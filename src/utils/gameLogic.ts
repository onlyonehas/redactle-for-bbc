export interface Article {
  id: string;
  headline: string;
  category: string;
  date: string;
  content: string[]; // Array of paragraphs
  avgGuesses?: number; // Mock data for "Global Average"
}

export const COMMON_WORDS = new Set([
  'a', 'an', 'the', 'text', 'image', 'video',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'and', 'but', 'or', 'so', 'yet', 'nor',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'it', 'he', 'she', 'they', 'we', 'i', 'you',
  'his', 'her', 'their', 'our', 'my', 'your',
  'that', 'this', 'these', 'those', 'which', 'who', 'whom', 'whose',
  'as', 'can', 'will', 'would', 'could', 'should', 'has', 'have', 'had',
  'do', 'does', 'did',
  'year', 'years', 'month', 'months', 'day', 'days',
  'bbc', 'news', 'copyright', 'all', 'rights', 'reserved'
]);

export function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isRedacted(word: string, guesses: Set<string>): boolean {
  const clean = cleanWord(word);
  if (!clean) return false; // Punctuation only
  if (COMMON_WORDS.has(clean)) return false;
  if (guesses.has(clean)) return false;
  return true;
}

export interface WordToken {
  text: string;
  isWord: boolean;
  clean?: string;
}

// Simple tokenizer that splits by space but preserves punctuation
export function tokenize(text: string): WordToken[] {
  // Split by space, capturing delimiters if needed, or regex matching words and non-words
  // A simple approach: split by spaces and then analysis
  // Better: Match sequences of word chars and non-word chars
  const tokens: WordToken[] = [];
  const regex = /([a-zA-Z0-9]+)|([^a-zA-Z0-9]+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      tokens.push({ text: match[1], isWord: true, clean: match[1].toLowerCase() });
    } else if (match[2]) {
      tokens.push({ text: match[2], isWord: false });
    }
  }
  return tokens;
}

export function countOccurrences(article: Article, word: string): number {
  const cleanFn = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const target = cleanFn(word);

  if (!target) return 0;

  let count = 0;

  // Check headline
  tokenize(article.headline).forEach(t => {
    if (t.isWord && cleanFn(t.text) === target) count++;
  });

  // Check content
  article.content.forEach(paragraph => {
    tokenize(paragraph).forEach(t => {
      if (t.isWord && cleanFn(t.text) === target) count++;
    });
  });

  return count;
}
