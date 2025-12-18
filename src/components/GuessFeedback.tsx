import React from 'react';

interface GuessFeedbackProps {
    lastGuess: { word: string; count: number } | null;
}

export const GuessFeedback: React.FC<GuessFeedbackProps> = ({ lastGuess }) => {
    if (!lastGuess) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '120px', // Raised higher to avoid obstruction
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '0.8rem 1.5rem',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 49,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <span>
                {lastGuess.count > 0 ? (
                    <>Found <strong style={{ color: '#fff3c4' }}>{lastGuess.count}</strong> instance{lastGuess.count !== 1 ? 's' : ''} of <strong>"{lastGuess.word}"</strong></>
                ) : (
                    <><strong>"{lastGuess.word}"</strong> not found in article</>
                )}
            </span>
        </div>
    );
};
