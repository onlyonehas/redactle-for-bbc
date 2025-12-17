import type { Article } from '../utils/gameLogic';

const articleIds = [
    {
        index: 0,
        category: 'Gaming/TV',
        id: 'cvgr488vlmmo',
        avgGuesses: 42  // Gaming/TV topics tend to be moderate difficulty
    },
    {
        index: 1,
        category: 'Cats',
        id: 'cqxqzlrzlx1o',
        avgGuesses: 28  // Cats is a simple, common topic
    },
    {
        index: 2,
        category: 'Christmas',
        id: 'c3v1n95p31go',
        avgGuesses: 35  // Seasonal topic, moderately easy
    },
    {
        index: 3,
        category: 'Black Friday',
        id: 'c3r7d820288o',
        avgGuesses: 38  // Shopping event, moderate difficulty
    },
    {
        index: 4,
        category: 'Dinosaurs',
        id: 'cde65y7p995o',
        avgGuesses: 52  // Scientific topic, more challenging
    }
];

const emptyArticle: Article =
{
    index: -1,
    headline: "",
    category: "",
    date: "",
    content: []
};


export function getEmptyArticle(): Article {
    return emptyArticle;
}

export async function getArticleByID(id: number): Promise<Article> {
    const url = `https://f1950jcnl7.execute-api.eu-west-1.amazonaws.com/${articleIds[id].id}`;

    const response = await fetch(url);
    const json = await response.json();

    return {
        ...json,
        index: articleIds[id].index,
        category: articleIds[id].category,
        avgGuesses: articleIds[id].avgGuesses
    };
}

export async function getRandomArticle(currentIndex: number): Promise<Article> {
    const others = articleIds.filter(a => a.index !== currentIndex);
    const randomArticle = others[Math.floor(Math.random() * others.length)];
    const url = `https://f1950jcnl7.execute-api.eu-west-1.amazonaws.com/${randomArticle.id}`;

    const response = await fetch(url);
    const json = await response.json();

    return {
        ...json,
        index: randomArticle.index,
        category: randomArticle.category,
        avgGuesses: randomArticle.avgGuesses
    };
}

export async function getDailyArticle(): Promise<Article> {
    const dailyIndex = 1;
    const url = `https://f1950jcnl7.execute-api.eu-west-1.amazonaws.com/${articleIds[dailyIndex].id}`;

    const response = await fetch(url);
    const json = await response.json();

    return {
        ...json,
        index: dailyIndex,
        category: articleIds[dailyIndex].category,
        avgGuesses: articleIds[dailyIndex].avgGuesses
    };
}