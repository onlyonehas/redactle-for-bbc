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

    const response = await fetch(url);
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

    // AI/Heuristic Prediction for avgGuesses
    const fullText = content.join(' ');
    const words = fullText.split(/\s+/).filter(w => w.length > 1);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));

    // Heuristic:
    // - Base: 30 guesses
    // - Length: +1 guess per 150 words
    // - Vocabulary: +1 guess per 20 unique words
    // - Headline: +2 guesses per word in headline (makes it harder to start)
    const headlineWords = headline.split(/\s+/).filter(w => w.length > 2);

    let predicted = 30;
    predicted += Math.floor(words.length / 150);
    predicted += Math.floor(uniqueWords.size / 20);
    predicted += headlineWords.length * 2;

    const finalEstimate = Math.min(65, Math.max(30, predicted));

    return {
        headline,
        date: dateElement ? domutils.textContent(dateElement) : new Date().toLocaleDateString(),
        content,
        predictedGuesses: finalEstimate
    };
}

async function run() {
    for (const articleInfo of articleList) {
        try {
            const data = await fetchArticle(articleInfo.id);
            if (data) {
                const fileName = `article-${articleInfo.index}.json`;
                const filePath = path.join(OUTPUT_DIR, fileName);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Saved: ${fileName} (Predicted guesses: ${data.predictedGuesses})`);
            }
        } catch (error) {
            console.error(`Error processing ${articleInfo.index}:`, error);
        }
    }
}

run();
