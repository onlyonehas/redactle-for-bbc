import React from 'react';
import { tokenize, isRedacted } from '../utils/gameLogic';
import type { Article, WordToken } from '../utils/gameLogic';

interface ArticleViewProps {
    article: Article;
    guesses: Set<string>;
    highlightedWord?: string | null;
    isGiveUp?: boolean;
    isHintMode?: boolean;
    onWordClick?: (word: string) => void;
    revealedTokenKey?: string | null;
    onRevealToken?: (key: string | null) => void;
}

const Token: React.FC<{
    token: WordToken,
    tokenKey: string,
    guesses: Set<string>,
    highlightedWord?: string | null,
    isGiveUp?: boolean,
    isHintMode?: boolean,
    onWordClick?: (word: string) => void;
    isRevealed?: boolean;
    onToggleReveal?: (key: string) => void;
    isHintable?: boolean;
}> = ({ token, tokenKey, guesses, highlightedWord, isGiveUp, isHintMode, onWordClick, isRevealed, onToggleReveal, isHintable = true }) => {

    if (!token.isWord) {
        return <span>{token.text}</span>;
    }

    const hidden = !isGiveUp && isRedacted(token.text, guesses);

    const tokenClean = token.clean || token.text.toLowerCase().replace(/[^a-z0-9]/g, '');

    const isHighlighted = highlightedWord && tokenClean === highlightedWord;

    const classes = hidden ? "redacted" : "revealed";

    const style: React.CSSProperties = isHighlighted ? {
        backgroundColor: 'var(--bbc-highlight)',
        color: 'var(--bbc-text)',
        borderRadius: '2px',
        padding: '0 2px',
        margin: '0 -1px'
    } : {};

    // Toggle handling
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isHintMode && hidden && isHintable && onWordClick) {
            onWordClick(token.text);
            return;
        }

        if (hidden && onToggleReveal) {
            onToggleReveal(tokenKey);
        }
    };

    const canBeHinted = isHintMode && hidden && isHintable;
    const cursor = canBeHinted ? 'crosshair' : (isHintMode && hidden ? 'not-allowed' : (hidden ? 'pointer' : 'default'));

    if (isHintMode && hidden && !isHintable) {
        style.opacity = 0.6;
        style.filter = 'grayscale(1)';
    }
    const showCount = isRevealed;

    const obfiscatedText = hidden ? token.text.replaceAll(/./g, "*") : token.text;

    return (
        <span
            className={classes}
            style={{ ...style, cursor, position: 'relative', display: 'inline-block' }}
            onClick={handleClick}
            title={hidden ? (isHintMode ? (isHintable ? "Click to reveal word" : "This word must be guessed!") : "Click to see letter count") : undefined}
        >
            <span style={{ opacity: hidden && showCount ? 0 : 1 }}>{hidden ? obfiscatedText : token.text}</span>
            {hidden && showCount && (
                <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.8em',
                    lineHeight: '1',
                    fontWeight: 'bold',
                    color: 'var(--bbc-light-gray)', // Text color for the number on top of redacted block
                    pointerEvents: 'none'
                }}>
                    {token.text.length}
                </span>
            )}
        </span>
    );
};

export const ArticleView: React.FC<ArticleViewProps> = ({ article, guesses, highlightedWord, isGiveUp, isHintMode, onWordClick, revealedTokenKey, onRevealToken }) => {
    const headlineTokens = tokenize(article.headline);
    const contentParagraphs = article.content.map(p => tokenize(p));

    const isHeadlineSolved = headlineTokens
        .filter(t => t.isWord)
        .every(t => !isRedacted(t.text, guesses));

    const hiddenHeadlineWords = new Set(
        headlineTokens
            .filter(t => t.isWord && isRedacted(t.text, guesses))
            .map(t => (t.clean || t.text.toLowerCase().replace(/[^a-z0-9]/g, '')))
    );

    const nonHintableWords = hiddenHeadlineWords.size === 1 ? hiddenHeadlineWords : new Set<string>();

    const [categoryRevealed, setCategoryRevealed] = React.useState(false);

    const handleToggleReveal = (key: string) => {
        if (!onRevealToken) return;
        // Toggle off if clicking same
        if (revealedTokenKey === key) {
            onRevealToken(null);
        } else {
            onRevealToken(key);
        }
    };

    // Auto-reveal category on win or give up
    React.useEffect(() => {
        if (isHeadlineSolved || isGiveUp) setCategoryRevealed(true);
    }, [isHeadlineSolved, isGiveUp]);

    return (
        <article className="container" style={{ paddingBottom: '100px', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>
                {headlineTokens.map((t, i) => {
                    const key = `h-${i}`;
                    return (
                        <Token
                            key={key}
                            token={t}
                            tokenKey={key}
                            guesses={guesses}
                            highlightedWord={highlightedWord}
                            isGiveUp={isGiveUp}
                            isHintMode={isHintMode}
                            onWordClick={onWordClick}
                            isRevealed={revealedTokenKey === key}
                            onToggleReveal={handleToggleReveal}
                            isHintable={!nonHintableWords.has(t.clean || t.text.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                        />
                    );
                })}
            </h1>

            <div style={{
                borderTop: '1px solid #ccc',
                borderBottom: '1px solid #ccc',
                padding: '0.8rem 0',
                marginBottom: '2rem',
                color: '#4a4a4a',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <span style={{ fontWeight: 700, color: '#333' }}>{article.date}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>Category:</span>
                    {categoryRevealed ? (
                        <span className="category-badge">
                            {article.category.toUpperCase()}
                        </span>
                    ) : (
                        <button
                            onClick={() => setCategoryRevealed(true)}
                            className="reveal-hint-btn"
                            title="Click to reveal category (Hint)"
                        >
                            REVEAL HINT
                        </button>
                    )}
                </div>
            </div>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                {contentParagraphs.map((paragraph, i) => (
                    <p key={i} style={{ marginBottom: '1.5rem' }}>
                        {paragraph.map((t, j) => {
                            const key = `c-${i}-${j}`;
                            return (
                                <Token
                                    key={key}
                                    token={t}
                                    tokenKey={key}
                                    guesses={guesses}
                                    highlightedWord={highlightedWord}
                                    isGiveUp={isGiveUp}
                                    isHintMode={isHintMode}
                                    onWordClick={onWordClick}
                                    isRevealed={revealedTokenKey === key}
                                    onToggleReveal={handleToggleReveal}
                                    isHintable={!nonHintableWords.has(t.clean || t.text.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                />
                            );
                        })}
                    </p>
                ))}
            </div>
            <style>{`
                .reveal-hint-btn {
                    font-size: 0.9rem;
                    padding: 0 1rem;
                    background-color: #f2f2f2;
                    color: #121212;
                    border: 1px solid #bbb;
                    font-weight: 700;
                    min-height: 2.5rem;
                    cursor: pointer;
                    letter-spacing: 0.02em;
                    transition: background-color 0.2s;
                }
                .reveal-hint-btn:hover {
                    background-color: #e5e5e5;
                    border-color: #999;
                }
                .category-badge {
                    background-color: var(--bbc-red);
                    color: white;
                    padding: 0.2rem 0.6rem;
                    font-weight: 700;
                    font-size: 0.9rem;
                    letter-spacing: 0.02em;
                }
            `}</style>
        </article>
    );
};
