import type { Article } from '../utils/gameLogic';

const articleIds = [
    {
        index: 0,
        category: 'Gaming/TV',
        id: 'cvgr488vlmmo'
    },
    {
        index: 1,
        category: 'Cats',
        id: 'cqxqzlrzlx1o'
    },
    {
        index: 2,
        category: 'Christmas',
        id: 'c3v1n95p31go'
    },
    {
        index: 3,
        category: 'Black Friday',
        id: 'c3r7d820288o'
    },
    {
        index: 4,
        category: 'Dinosaurs',
        id: 'cde65y7p995o'
    }
];

const emptyArticle: Article =
{
    id: '-1',
    headline: "",
    category: "",
    date: "",
    content: []
};


export function getEmptyArticle(): Article {
    return emptyArticle;
}

export async function getDailyArticle(): Promise<Article> {
    const dailyIndex = 1;
    const url = `https://f1950jcnl7.execute-api.eu-west-1.amazonaws.com/${articleIds[dailyIndex].id}`;

    const response = await fetch(url);
    const json = await response.json();

    return { ...json, id: dailyIndex, category: articleIds[dailyIndex].category };
}