import type { Article } from '../utils/gameLogic';
import { articleList } from './article-list';

// Import all pre-fetched articles
// Dynamically import all pre-fetched high-profile articles using Vite's glob import
const modules = import.meta.glob('./prefetched/article-*.json', { eager: true });

const prefetchedArticles: Record<number, any> = {};

// Parse the file names to get the indices
Object.entries(modules).forEach(([path, module]) => {
    const match = path.match(/article-(\d+)\.json$/);
    if (match) {
        const index = parseInt(match[1]);
        prefetchedArticles[index] = (module as any).default;
    }
});




const emptyArticle: Article = {
    index: -1,
    headline: "",
    category: "",
    date: "",
    content: []
};

export function getEmptyArticle(): Article {
    return emptyArticle;
}

function getPlayedArticleIndices(): number[] {
    try {
        const played: number[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('stats-won-')) {
                const index = parseInt(key.replace('stats-won-', ''));
                if (!isNaN(index)) played.push(index);
            }
        }
        return played;
    } catch (e) {
        return [];
    }
}

export async function getArticleByID(id: number): Promise<Article> {
    const articleInfo = articleList.find(a => a.index === id) || articleList[0];
    const bbcData = prefetchedArticles[articleInfo.index];

    if (!bbcData) {
        console.warn(`Article ${id} not found in pre-fetched store, using fallback.`);
        return {
            ...emptyArticle,
            headline: "Article Not Found",
            content: ["This article has not been pre-fetched yet."],
            index: articleInfo.index,
            category: 'Error'
        };
    }

    return {
        ...emptyArticle,
        ...bbcData,
        index: articleInfo.index,
        category: articleInfo.category,
        avgGuesses: bbcData.predictedGuesses || articleInfo.avgGuesses
    } as Article;
}

export async function getRandomArticle(currentIndex: number): Promise<Article> {
    const played = getPlayedArticleIndices();
    const available = articleList.filter(a => prefetchedArticles[a.index]);
    const others = available.filter(a => a.index !== currentIndex && !played.includes(a.index));

    const candidates = others.length > 0 ? others : available.filter(a => a.index !== currentIndex);
    const randomArticle = candidates[Math.floor(Math.random() * candidates.length)];

    return getArticleByID(randomArticle.index);
}

export async function getDailyArticle(): Promise<Article> {
    // Deterministic selection based on date
    const now = new Date();
    // Use UTC date to ensure everyone gets the same article regardless of timezone
    const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dayIndex = Math.floor(startOfToday / (1000 * 60 * 60 * 24));

    // Use the dayIndex as a seed to pick an article from the list
    const available = articleList.filter(a => prefetchedArticles[a.index]);
    if (available.length === 0) return getArticleByID(0);

    const dailyIndex = dayIndex % available.length;
    const articleId = available[dailyIndex].index;

    return getArticleByID(articleId);
}