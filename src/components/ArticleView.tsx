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

    // "Give Up" reveals everything
    const hidden = !isGiveUp && isRedacted(token.text, guesses);

    // clean value for comparison
    const tokenClean = token.clean || token.text.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Highlight if:
    // 1. Matched the highlightedWord
    // 2. AND is NOT hidden (so we don't cheat by highlighting hidden structure words if that ever happens, though usually guesses are only for words)
    // Actually, traditionally if you guess 'the', it highlights 'the'.
    const isHighlighted = highlightedWord && tokenClean === highlightedWord;

    const classes = hidden ? "redacted" : "revealed";

    // Style override
    const style: React.CSSProperties = isHighlighted ? {
        backgroundColor: 'var(--bbc-highlight)',
        color: 'var(--bbc-text)',
        borderRadius: '2px',
        padding: '0 2px',
        margin: '0 -1px'
    } : {};

    // Toggle handling
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop propagation to prevent background click from resetting

        if (isHintMode && hidden && onWordClick) {
            onWordClick(token.text);
            return;
        }

        if (hidden && onToggleReveal) {
            // If already revealed, we could toggle off? Or just set it.
            // Behavior: "reveal resets if another selected".
            // If I click the *same* one, should it close?
            // Redactle.net: clicking same one toggles off.
            if (isRevealed) {
                // But wait, if we call onToggleReveal(''), it clears.
                // We need to know if we are toggle logic.
                // Let's passed down function handle it or we pass explicit null?
                // Let's assume onToggleReveal handles the "set to this key" logic.
                // If we want toggle off behavior:
                // We can pass `tokenKey` if we want to turn on.
                // But we need to know if we are turning off. `isRevealed` tells us!
                // Wait, passing back to parent.
                // Let's pass `null` if isRevealed, else `tokenKey`.
                // Actually parent setter `onRevealToken` expects (key | null).
                // BUT: Typescript signature of `onToggleReveal` in my props above says `(key: string)`.
                // Let's fix signature.
                // Actually, let's keep it simple: handleClick toggles.

                // However, "reset if another word is selected" implies exclusivity.
                // "reset if clicked elsewhere".

                // If I click THIS one, and it is ACTIVE -> Close it on toggle OFF?
            }
            onToggleReveal(tokenKey); // Parent decides toggle logic
        }
    };

    // Hint mode cursor
    const cursor = isHintMode && hidden ? 'crosshair' : (hidden ? 'pointer' : 'default');

    // Determine whether to show overlay
    const showCount = isRevealed;

    return (
        <span
            className={classes}
            style={{ ...style, cursor, position: 'relative', display: 'inline-block' }}
            onClick={handleClick}
            title={hidden ? (isHintMode ? "Click to reveal word" : "Click to see letter count") : undefined}
        >
            <span style={{ opacity: hidden && showCount ? 0 : 1 }}>{token.text}</span>
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
