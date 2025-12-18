import React from 'react';
import { usePersistence } from '../hooks/usePersistence';
import type { GameStats } from '../hooks/useStats';
import { SubmitScoreButton } from './submit-score-button';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: GameStats;
    lastGame?: {
        guesses: number;
        globalAverage: number;
    } | null;
    onNewGame?: () => void;
    onDailyGame?: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, lastGame, onNewGame, onDailyGame }) => {
    const [username, setUsername] = usePersistence('player-username', '');

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
                    <h2 style={{ margin: 0, color: '#bb1919' }}>Redactle BBC Articles Statistics</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            color: 'black',
                            padding: '0 0.5rem',
                            lineHeight: '1'
                        }}
                        aria-label="Close statistics"
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

                {lastGame && (<div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid #eee', padding: '1rem', borderRadius: '4px' }}>
                    <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>
                        Enter a username to submit your score:
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. RedactlePlayer123"
                        style={{
                            padding: '0.6rem',
                            border: '1px solid #bb1919',
                            borderRadius: '4px',
                            fontSize: '1rem'
                        }}
                    />
                    {!username && <span style={{ fontSize: '0.8rem', color: '#bb1919' }}>* Required for submission</span>}
                </div>)}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.8rem 1.5rem',
                            border: '1px solid #333',
                            backgroundColor: '#333',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            flex: 1
                        }}
                    >
                        Close
                    </button>
                    {lastGame && (
                        <SubmitScoreButton
                            score={lastGame.guesses}
                            game={'redactle'}
                            username={username}
                            date={new Date().toISOString().split('T')[0]}
                            style={{ flex: 1 }}
                        />
                    )}
                    {onDailyGame && (
                        <button
                            onClick={() => {
                                onDailyGame();
                                onClose();
                            }}
                            style={{
                                padding: '0.8rem 1.5rem',
                                border: '1px solid #bb1919',
                                backgroundColor: 'white',
                                color: '#bb1919',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                flex: 1
                            }}
                        >
                            Today's Game
                        </button>
                    )}
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
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                flex: 1
                            }}
                        >
                            New Game
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
