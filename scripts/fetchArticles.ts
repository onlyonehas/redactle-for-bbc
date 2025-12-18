import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as htmlparser2 from 'htmlparser2';
import * as cssSelect from 'css-select';
import * as domutils from 'domutils';
import { articleList } from '../src/data/article-list.js';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/prefetched');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchArticle(pathOrUrl: string) {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `https://www.bbc.co.uk/${pathOrUrl}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    const dom = htmlparser2.parseDocument(html);

    const paragraphElements = cssSelect.selectAll('p[class*="Paragraph"]', dom);
    const paragraphs = paragraphElements
        .map(element => domutils.textContent(element))
        .filter(text => {
            const lowText = text.toLowerCase();
            // Basic length check
            if (text.length < 20) return false;

            // Standard page error check
            if (text.includes("Sorry, we couldn't find that page")) return false;

            // Copyright and Attribution Filtering
            if (lowText.includes("copyright")) return false;
            if (lowText.includes("all rights reserved")) return false;
            if (lowText.startsWith("reporting by") || lowText.includes("contributed to this report")) return false;
            if (lowText.startsWith("additional reporting")) return false;
            if (lowText.includes("image source") || lowText.includes("image copyright")) return false;
            if (lowText.includes("photo by") || lowText.includes("original reporting")) return false;

            if (lowText.includes("follow bbc news on")) return false;
            if (lowText.includes("more on this story")) return false;
            if (lowText.includes("related topics")) return false;
            if (lowText.includes("tell us which stories")) return false;
            if (lowText.includes("listen to highlights")) return false;
            if (lowText.includes("catch up with the latest")) return false;
            if (lowText.startsWith("follow bbc")) return false;
            if (lowText.includes(", external,")) return false; // Common in social links

            return true;
        });

    const headlineElement = cssSelect.selectOne('h1', dom);
    const dateElement = cssSelect.selectOne('time', dom);

    if (!headlineElement || paragraphs.length === 0) {
        throw new Error(`No content found for ${url}`);
    }

    const headline = domutils.textContent(headlineElement);
    const content = paragraphs;

    // Smarter Heuristic for avgGuesses
    const fullText = content.join(' ');
    const words = fullText.split(/\s+/).filter(w => w.length > 1);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));

    const avgWordLength = words.length > 0 ? words.reduce((acc, w) => acc + w.length, 0) / words.length : 5;
    const commonWords = ['the', 'is', 'in', 'and', 'to', 'of', 'a', 'was', 'for', 'on', 'with', 'as', 'at', 'by', 'it'];
    const commonWordCount = words.filter(w => commonWords.includes(w.toLowerCase())).length;
    const commonWordRatio = words.length > 0 ? commonWordCount / words.length : 0.2;

    // Heuristic:
    // - Base: 35 guesses
    // - Length: +1 guess per 120 words
    // - Vocabulary: +1 guess per 25 unique words
    // - Average Word Length: Multiplier for technicality
    // - Common Word Ratio: Higher ratio = Easier (more "scaffolding" revealed)
    let predicted = 35;
    predicted += Math.floor(words.length / 120);
    predicted += Math.floor(uniqueWords.size / 25);
    predicted += Math.floor((avgWordLength - 5) * 4);
    predicted -= Math.floor((commonWordRatio - 0.2) * 60);

    const headlineWords = headline.split(/\s+/).filter(w => w.length > 2);
    predicted += headlineWords.length * 2;

    const finalEstimate = Math.min(75, Math.max(25, predicted));

    return {
        headline,
        date: dateElement ? domutils.textContent(dateElement) : new Date().toLocaleDateString(),
        content,
        predictedGuesses: finalEstimate
    };
}

const SKIP_INDICES = [4]; // Manually perfected by user

async function run() {
    for (const articleInfo of articleList) {
        const fileName = `article-${articleInfo.index}.json`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        if (SKIP_INDICES.includes(articleInfo.index)) {
            console.log(`Skipping index ${articleInfo.index} (Manual override)`);
            continue;
        }

        if (fs.existsSync(filePath)) {
            console.log(`Skipping index ${articleInfo.index} (Already exists)`);
            continue;
        }

        try {
            const data = await fetchArticle(articleInfo.id);
            if (data) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Saved: ${fileName} (Predicted guesses: ${data.predictedGuesses})`);
            }
            // Add a small delay between fetches to avoid being blocked
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            console.error(`Error processing ${articleInfo.index}:`, error);
            // Even if it fails, wait a bit
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }
}

run();
