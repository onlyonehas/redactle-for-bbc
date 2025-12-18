import React, { useState } from 'react';

interface GuessInputProps {
    onGuess: (word: string) => void;
    guessCount: number;
    onToggleHint: () => void;
    isHintMode: boolean;
}

export const GuessInput: React.FC<GuessInputProps> = ({ onGuess, guessCount, onToggleHint, isHintMode }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onGuess(input.trim());
            setInput('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#f0f0f0',
            padding: '1rem',
            borderTop: '2px solid #ccc',
            display: 'flex',
            justifyContent: 'center',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minHeight: '4.5rem'
        }}>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                width: '100%',
                maxWidth: '800px',
                gap: '0.5rem'
            }}>
                <button
                    type="button"
                    onClick={onToggleHint}
                    className="guess-input-btn hint-btn"
                    style={{
                        backgroundColor: isHintMode ? '#ffd700' : '#e0e0e0',
                        color: isHintMode ? 'black' : '#121212',
                        border: isHintMode ? '2px solid #000' : '1px solid #ccc',
                    }}
                    title="Hint Mode: Click to activate, then click a word to reveal it"
                >
                    <span className="btn-text">HINT</span>
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a guess..."
                    aria-label="Enter your guess"
                    style={{
                        flex: 1,
                        padding: '0.8rem',
                        fontSize: '1rem',
                        border: '1px solid #bbb',
                        borderRadius: '0',
                        color: '#121212',
                        minWidth: '0'
                    }}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
                <button type="submit" className="guess-input-btn submit-btn">
                    GUESS ({guessCount})
                </button>
            </form>
            <style>{`
                .guess-input-btn {
                    padding: 0 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 3rem;
                    font-size: 0.85rem;
                    white-space: nowrap;
                    border: none;
                    letter-spacing: 0.05em;
                    transition: opacity 0.2s;
                }
                .submit-btn {
                    background-color: var(--bbc-red);
                    color: white;
                }
                .hint-btn:hover {
                    opacity: 0.9;
                }
                @media (max-width: 600px) {
                    .guess-input-btn {
                        padding: 0 0.8rem;
                        font-size: 0.75rem;
                    }
                    form {
                        gap: 0.3rem;
                    }
                }
            `}</style>
        </div>
    );
};
