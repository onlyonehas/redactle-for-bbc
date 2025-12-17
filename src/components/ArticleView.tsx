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
}> = ({ token, tokenKey, guesses, highlightedWord, isGiveUp, isHintMode, onWordClick, isRevealed, onToggleReveal }) => {

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
        if (isHintMode && hidden && onWordClick) {
            onWordClick(token.text);
            return;
        }

        if (hidden && onToggleReveal) {
            onToggleReveal(tokenKey);
        }
    };

    const cursor = isHintMode && hidden ? 'crosshair' : (hidden ? 'pointer' : 'default');
    const showCount = isRevealed;

    const obfiscatedText = hidden ? token.text.replaceAll(/./g, "*") : token.text;

    return (
        <span
            className={classes}
            style={{ ...style, cursor, position: 'relative', display: 'inline-block' }}
            onClick={handleClick}
            title={hidden ? (isHintMode ? "Click to reveal word" : "Click to see letter count") : undefined}
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
                        <span style={{
                            backgroundColor: 'var(--bbc-red)',
                            color: 'white',
                            padding: '0.1rem 0.5rem',
                            fontWeight: 700
                        }}>
                            {article.category.toUpperCase()}
                        </span>
                    ) : (
                        <button
                            onClick={() => setCategoryRevealed(true)}
                            style={{
                                fontSize: '0.8rem',
                                padding: '0.2rem 0.6rem',
                                backgroundColor: '#f0f0f0',
                                color: '#333',
                                border: '1px solid #ccc'
                            }}
                            title="Click to reveal category (Hint)"
                        >
                            Reveal Hint
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
                                />
                            );
                        })}
                    </p>
                ))}
            </div>
        </article>
    );
};
