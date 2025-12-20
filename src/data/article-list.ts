export interface ArticleMetadata {
    index: number;
    category: string;
    id: string;
    avgGuesses: number;
}

/**
 * Article list - major events that everyone would know
 * This is the single source of truth, bundled at build time.
 * To update: modify this list and rebuild the app.
 */
export const articleList: ArticleMetadata[] = [
    { index: 0, category: 'UK', id: 'news/uk-52012432', avgGuesses: 45 }, // PM orders UK lockdown
    { index: 1, category: 'UK', id: 'news/uk-61585886', avgGuesses: 40 }, // Queen Elizabeth II dies
    { index: 2, category: 'Politics', id: 'news/articles/c9vjlj1ezpgo', avgGuesses: 50 }, // Zelensky warns EU
    { index: 3, category: 'World', id: 'news/world-middle-east-56505413', avgGuesses: 48 }, // Suez Canal Blockage
    { index: 5, category: 'World', id: 'news/articles/cd10ejlpepvo', avgGuesses: 45 }, // Notre Dame Reopening
    { index: 6, category: 'World', id: 'news/world-us-canada-52834099', avgGuesses: 50 }, // George Floyd / BLM
    { index: 7, category: 'World', id: 'news/world-us-canada-55554332', avgGuesses: 48 }, // Capitol Riot Jan 6
    { index: 8, category: 'Science', id: 'news/science-environment-62122847', avgGuesses: 46 }, // James Webb Telescope
    { index: 9, category: 'Business', id: 'news/business-61224748', avgGuesses: 45 }, // Elon Musk buys Twitter
    { index: 10, category: 'Tech', id: 'news/technology-63953730', avgGuesses: 44 }, // ChatGPT Launch
    { index: 11, category: 'UK', id: 'news/uk-56690270', avgGuesses: 42 }, // Prince Philip dies
    { index: 12, category: 'World', id: 'news/world-europe-64540692', avgGuesses: 50 }, // Turkey Earthquakes
    { index: 13, category: 'Sport', id: 'sport/football-65839074', avgGuesses: 44 }, // Messi Inter Miami
    { index: 15, category: 'World', id: 'news/world-us-canada-61923062', avgGuesses: 50 }, // Roe v Wade Overturn
    { index: 16, category: 'World', id: 'news/world-middle-east-53655134', avgGuesses: 48 }, // Beirut Explosion
    { index: 17, category: 'World', id: 'news/world-asia-58223701', avgGuesses: 50 }, // Taliban takes Kabul
    { index: 20, category: 'UK', id: 'news/uk-65505079', avgGuesses: 45 }, // King Charles Coronation
    { index: 21, category: 'Entertainment', id: 'news/entertainment-arts-60912852', avgGuesses: 38 }, // Will Smith Slap
    { index: 23, category: 'Sport', id: 'news/articles/c29dle82e1do', avgGuesses: 45 }, // Paris Olympics
    { index: 24, category: 'World', id: 'news/articles/c720grvze8po', avgGuesses: 46 }, // Titan Sub
    { index: 25, category: 'World', id: 'news/world-europe-64120023', avgGuesses: 44 }, // Andrew Tate Arrest
    { index: 26, category: 'Politics', id: 'news/uk-politics-62085732', avgGuesses: 45 }, // Boris Johnson Resigns
    { index: 27, category: 'Politics', id: 'news/uk-politics-63321528', avgGuesses: 42 }, // Liz Truss Resigns
    { index: 28, category: 'Sport', id: 'sport/football-64010330', avgGuesses: 35 }, // Argentina World Cup Win
    { index: 29, category: 'World', id: 'news/world-asia-62088844', avgGuesses: 48 }, // Shinzo Abe Assassination
    { index: 30, category: 'World', id: 'news/world-us-canada-54854155', avgGuesses: 48 }, // Biden wins Election
    { index: 31, category: 'World', id: 'news/world-middle-east-67039975', avgGuesses: 55 }, // Gaza Hospital Blast
    { index: 32, category: 'World', id: 'news/world-us-canada-69083204', avgGuesses: 47 }, // Trump Hush Money
    { index: 33, category: 'World', id: 'news/world-australia-50951043', avgGuesses: 48 }, // Australia Bushfires
    { index: 36, category: 'UK', id: 'news/uk-67912389', avgGuesses: 44 }, // Post Office Scandal
    { index: 37, category: 'Politics', id: 'news/uk-politics-60031804', avgGuesses: 45 }, // Partygate Report
    { index: 38, category: 'Business', id: 'news/business-63604323', avgGuesses: 48 }, // FTX Collapse
    { index: 39, category: 'World', id: 'news/world-europe-60506682', avgGuesses: 55 }, // Ukraine Invasion Start
    { index: 40, category: 'World', id: 'news/world-middle-east-67036733', avgGuesses: 55 }, // October 7 Attack
    { index: 41, category: 'Science', id: 'news/world-asia-india-66594520', avgGuesses: 46 }, // India Moon Landing
    { index: 42, category: 'Science', id: 'news/world-us-canada-68748119', avgGuesses: 42 }, // Solar Eclipse 2024
    { index: 45, category: 'Politics', id: 'news/articles/c977njnvq7no', avgGuesses: 46 }, // Starmer Wins Election
    { index: 46, category: 'World', id: 'news/articles/cx2y30v7ndjo', avgGuesses: 48 }, // Trump Wins 2024
    { index: 47, category: 'Tech', id: 'news/business-67459137', avgGuesses: 46 }, // OpenAI Sam Altman Ousted
    { index: 48, category: 'Science', id: 'news/science-environment-56119902', avgGuesses: 48 }, // Mars Landing Perseverance
    { index: 51, category: 'Sport', id: 'sport/football-57451624', avgGuesses: 35 } // Christian Eriksen
];

/**
 * Get the article list
 * This is bundled at build time - no runtime fetching required
 */
export function getArticleList(): ArticleMetadata[] {
    return articleList;
}



