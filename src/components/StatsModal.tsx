import React from 'react';
import type { GameStats } from '../hooks/useStats';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: GameStats;
    lastGame?: {
        guesses: number;
        globalAverage: number;
    } | null;
    onNewGame?: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, lastGame, onNewGame }) => {
    if (!isOpen) return null;

    const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

    // Sort distribution keys
    const brackets = ["1-20", "21-40", "41-60", "61-80", "81-100", "100+"];
    const maxVal = Math.max(...Object.values(stats.distribution), 1);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '4px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>Statistics</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '0 0.5rem'
                        }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.gamesPlayed}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Played</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{winPercentage}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Win %</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.currentStreak}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Cur Streak</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.maxStreak}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Max Streak</div>
                    </div>
                </div>

                {lastGame && (
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '1rem',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        borderLeft: '4px solid #bb1919'
                    }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>Last Game</h3>
                        <p style={{ margin: 0 }}>
                            You solved it in <strong>{lastGame.guesses}</strong> guesses.<br />
                            Global Average: <strong>{lastGame.globalAverage}</strong>
                        </p>
                    </div>
                )}

                <h3 style={{ fontSize: '1.1rem' }}>Success Distribution</h3>
                <div style={{ marginBottom: '2rem' }}>
                    {brackets.map(bracket => {
                        const val = stats.distribution[bracket] || 0;
                        const width = Math.max(5, (val / maxVal) * 100);
                        return (
                            <div key={bracket} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ width: '60px', flexShrink: 0 }}>{bracket}</span>
                                <div style={{
                                    flexGrow: 1,
                                    backgroundColor: '#eee',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: `${width}%`,
                                        backgroundColor: val > 0 ? '#bb1919' : '#e0e0e0',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        paddingRight: '0.5rem',
                                        color: val > 0 ? 'white' : 'transparent',
                                        transition: 'width 0.5s ease-out'
                                    }}>
                                        {val}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.8rem 1.5rem',
                            border: '1px solid #ccc',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Close
                    </button>
                    {onNewGame && (
                        <button
                            onClick={() => {
                                onNewGame();
                                onClose();
                            }}
                            style={{
                                padding: '0.8rem 1.5rem',
                                border: 'none',
                                backgroundColor: '#bb1919',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Play Random Article
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
