import { describe, it, expect } from 'vitest';
import { cleanWord, isRedacted, tokenize } from './gameLogic';

describe('gameLogic', () => {
    describe('cleanWord', () => {
        it('lowercases and removes non-alphanumeric characters', () => {
            expect(cleanWord('Hello')).toBe('hello');
            expect(cleanWord('World!')).toBe('world');
            expect(cleanWord("don't")).toBe('dont');
            expect(cleanWord('1999')).toBe('1999');
        });
    });

    describe('tokenize', () => {
        it('splits text into tokens', () => {
            const tokens = tokenize("Hello, world!");
            // Expect: "Hello", ",", " ", "world", "!"
            // Implementation splits by regex group
            expect(tokens.map(t => t.text)).toEqual(['Hello', ',', ' ', 'world', '!']);
            expect(tokens[0].isWord).toBe(true);
            expect(tokens[1].isWord).toBe(false); // comma
        });

        it('handles contractions (current behavior)', () => {
            const tokens = tokenize("don't");
            // "don", "'", "t"
            expect(tokens.map(t => t.text)).toEqual(['don', "'", 't']);
        });
    });

    describe('isRedacted', () => {
        it('returns true for unknown words', () => {
            const guesses = new Set<string>();
            expect(isRedacted('Secret', guesses)).toBe(true);
        });

        it('returns false for known words', () => {
            const guesses = new Set(['secret']);
            expect(isRedacted('Secret', guesses)).toBe(false);
        });

        it('returns false for common words', () => {
            const guesses = new Set<string>();
            expect(isRedacted('the', guesses)).toBe(false);
        });

        it('returns false for punctuation', () => {
            const guesses = new Set<string>();
            expect(isRedacted('!', guesses)).toBe(false);
        });
    });
});
