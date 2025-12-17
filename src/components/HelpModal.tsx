import React from 'react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                maxWidth: '600px',
                width: '100%',
                padding: '2rem',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        color: '#333',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem'
                    }}
                >
                    ✕
                </button>

                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                    How to Play
                </h2>

                <div style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>1. Guess Valid Words:</strong> Type a word into the input box and press Enter. If the word appears in the article, it will be revealed.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>2. Context Matters:</strong> Common words like "the", "a", and "in" are automatically revealed to help you understand the structure.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>3. Solve the Headline:</strong> Your goal is to reveal the main subject of the article. Winning is triggered when you solve the **Headline**.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>4. Hints:</strong> You can reveal the article's Category for a hint if you get stuck.
                    </p>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: '#bb1919',
                            color: 'white',
                            padding: '0.8rem 2rem',
                            border: 'none',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Start Playing
                    </button>
                </div>
            </div>
        </div>
    );
};
