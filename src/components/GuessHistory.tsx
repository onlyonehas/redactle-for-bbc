import React, { useMemo } from 'react';

interface Guess {
    word: string;
    count: number;
}

interface GuessHistoryProps {
    guesses: Guess[];
    onHighlight?: (word: string) => void;
    highlightedWord?: string | null;
    onToggleHint: () => void;
    isHintMode: boolean;
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({ guesses, onHighlight, highlightedWord, onToggleHint, isHintMode }) => {
    const sortedGuesses = useMemo(() => {
        // Map to include original index (1-based)
        const withIndex = guesses.map((g, index) => ({ ...g, id: index + 1 }));
        // Reverse to show latest first
        return withIndex.reverse();
    }, [guesses]);

    return (
        <div style={{
            backgroundColor: '#fdfdfd',
            border: '1px solid #dcdcdc',
            padding: '1rem',
            height: 'fit-content',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            minWidth: '240px',
            fontSize: '0.9rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                    Your Guesses ({guesses.length})
                </h3>
                <button
                    onClick={onToggleHint}
                    title="Hint Mode: Click to activate, then click a word to reveal it"
                    className="sidebar-hint-btn"
                    style={{
                        backgroundColor: isHintMode ? '#ffcf00' : 'transparent',
                        color: isHintMode ? '#121212' : '#bb1919',
                        border: isHintMode ? '1px solid #000' : '1px solid #bb1919',
                    }}
                >
                    HINT
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #bbc-red', color: '#111' }}>
                        <th style={{ padding: '0.5rem 0.2rem', width: '30px' }}>#</th>
                        <th style={{ padding: '0.5rem 0.2rem' }}>Guess</th>
                        <th style={{ padding: '0.5rem 0.2rem', textAlign: 'right' }}>Hits</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedGuesses.map((g) => {
                        const isSelected = highlightedWord === g.word;
                        return (
                            <tr
                                key={g.id}
                                onClick={() => onHighlight?.(g.word)}
                                style={{
                                    borderBottom: '1px solid #e0e0e0',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'var(--bbc-highlight)' : 'transparent',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <td style={{ padding: '0.4rem 0.2rem', color: '#666', fontSize: '0.8em' }}>{g.id}</td>
                                <td style={{ padding: '0.4rem 0.2rem', textTransform: 'uppercase', fontWeight: 500 }}>{g.word}</td>
                                <td style={{ padding: '0.4rem 0.2rem', textAlign: 'right', fontWeight: 'bold' }}>{g.count}</td>
                            </tr>
                        );
                    })}
                    {guesses.length === 0 && (
                        <tr>
                            <td colSpan={3} style={{ padding: '1rem 0', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                                No guesses yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <style>{`
                .sidebar-hint-btn {
                    padding: 0 0.8rem;
                    font-size: 0.75rem;
                    cursor: pointer;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    min-height: 2.25rem;
                    transition: opacity 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sidebar-hint-btn:hover {
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
};
