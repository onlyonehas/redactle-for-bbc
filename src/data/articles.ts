import type { Article } from '../utils/gameLogic';
import { articleList } from './article-list';

// Import all pre-fetched articles
import article0 from './prefetched/article-0.json';
import article1 from './prefetched/article-1.json';
import article2 from './prefetched/article-2.json';
import article3 from './prefetched/article-3.json';
import article4 from './prefetched/article-4.json';
import article5 from './prefetched/article-5.json';
import article6 from './prefetched/article-6.json';
import article7 from './prefetched/article-7.json';
import article8 from './prefetched/article-8.json';
import article9 from './prefetched/article-9.json';
import article10 from './prefetched/article-10.json';
import article11 from './prefetched/article-11.json';
import article12 from './prefetched/article-12.json';
import article13 from './prefetched/article-13.json';
import article14 from './prefetched/article-14.json';
import article15 from './prefetched/article-15.json';
import article16 from './prefetched/article-16.json';
import article17 from './prefetched/article-17.json';
import article18 from './prefetched/article-18.json';
import article19 from './prefetched/article-19.json';
import article20 from './prefetched/article-20.json';
import article21 from './prefetched/article-21.json';
import article22 from './prefetched/article-22.json';
import article23 from './prefetched/article-23.json';
import article24 from './prefetched/article-24.json';
import article25 from './prefetched/article-25.json';
import article26 from './prefetched/article-26.json';
import article27 from './prefetched/article-27.json';
import article28 from './prefetched/article-28.json';
import article29 from './prefetched/article-29.json';
import article30 from './prefetched/article-30.json';
import article31 from './prefetched/article-31.json';
import article32 from './prefetched/article-32.json';
import article33 from './prefetched/article-33.json';
import article34 from './prefetched/article-34.json';
import article35 from './prefetched/article-35.json';
import article36 from './prefetched/article-36.json';
import article37 from './prefetched/article-37.json';
import article38 from './prefetched/article-38.json';
import article39 from './prefetched/article-39.json';
import article40 from './prefetched/article-40.json';
import article41 from './prefetched/article-41.json';
import article42 from './prefetched/article-42.json';
import article43 from './prefetched/article-43.json';
import article44 from './prefetched/article-44.json';
import article45 from './prefetched/article-45.json';
import article46 from './prefetched/article-46.json';
import article47 from './prefetched/article-47.json';
import article48 from './prefetched/article-48.json';
import article49 from './prefetched/article-49.json';
import article50 from './prefetched/article-50.json';
import article51 from './prefetched/article-51.json';

const prefetchedArticles: Record<number, any> = {
    0: article0,
    1: article1,
    2: article2,
    3: article3,
    4: article4,
    5: article5,
    6: article6,
    7: article7,
    8: article8,
    9: article9,
    10: article10,
    11: article11,
    12: article12,
    13: article13,
    14: article14,
    15: article15,
    16: article16,
    17: article17,
    18: article18,
    19: article19,
    20: article20,
    21: article21,
    22: article22,
    23: article23,
    24: article24,
    25: article25,
    26: article26,
    27: article27,
    28: article28,
    29: article29,
    30: article30,
    31: article31,
    32: article32,
    33: article33,
    34: article34,
    35: article35,
    36: article36,
    37: article37,
    38: article38,
    39: article39,
    40: article40,
    41: article41,
    42: article42,
    43: article43,
    44: article44,
    45: article45,
    46: article46,
    47: article47,
    48: article48,
    49: article49,
    50: article50,
    51: article51
};

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
    const dailyIndex = 1;
    return getArticleByID(dailyIndex);
}