interface HeaderProps {
    articleId: number;
    headlineRevealed: boolean;
    onHelp: () => void;
    onStats: () => void;
    onNewGame: () => void;
    onDailyGame: () => void;
    onGiveUp: () => void;
    isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ articleId, headlineRevealed, onHelp, onStats, onNewGame, onDailyGame, onGiveUp, isLoading }) => {
    return (
        <header style={{
            backgroundColor: '#bb1919', // BBC Red
            color: 'white',
            borderBottom: '1px solid #991414',
            marginBottom: '1.5rem',
            fontFamily: 'Helvetica, Arial, sans-serif'
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '4rem',
                padding: '0 1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* BBC Logo Block */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '0 0.5rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{
                            color: '#bb1919',
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            letterSpacing: '-0.5px'
                        }}>BBC</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.4rem' }}>NEWS</span>
                        <span style={{
                            borderLeft: '1px solid rgba(255,255,255,0.3)',
                            height: '1.5rem',
                            margin: '0 0.5rem'
                        }}></span>
                        <span style={{ fontWeight: 400, fontSize: '1.4rem', letterSpacing: '0.5px' }}>REDACTLE</span>
                    </div>
                </div>

                <div className="header-actions">
                    <span className="article-id" title={`Article ID: ${articleId}`}>#{articleId}</span>
                    <button onClick={onStats} className="header-btn" title="Statistics">STATS</button>
                    <button onClick={onHelp} className="header-btn" title="How to play">HELP</button>
                    <button onClick={onNewGame} className="header-btn" title="Start a random game">NEW</button>
                    <button onClick={onDailyGame} className="header-btn" title="Play today's challenge">DAILY</button>
                    {!headlineRevealed && (
                        <button
                            onClick={onGiveUp}
                            className="header-btn give-up-btn"
                            disabled={isLoading}
                            title={isLoading ? "Loading article..." : "Reveal the entire article"}
                        >
                            GIVE UP
                        </button>
                    )}
                </div>
            </div>
            <style>{`
                .header-actions {
                    font-size: 1rem;
                    display: flex;
                    gap: 0.4rem;
                    align-items: center;
                    justify-content: flex-end;
                }
                .header-btn {
                    background-color: transparent;
                    border: 1px solid rgba(255,255,255,0.4);
                    font-size: 0.75rem;
                    padding: 0 0.8rem;
                    cursor: pointer;
                    color: white;
                    font-weight: 700;
                    white-space: nowrap;
                    min-height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: border-color 0.2s, background-color 0.2s;
                    letter-spacing: 0.05em;
                }
                .header-btn:hover:not(:disabled) {
                    background-color: rgba(255,255,255,0.15);
                    border-color: white;
                }
                .header-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .article-id {
                    font-weight: 700;
                    font-size: 0.85rem;
                    margin-right: 0.5rem;
                    color: rgba(255,255,255,0.9);
                }
                @media (max-width: 900px) {
                    header {
                        height: auto !important;
                        padding-bottom: 0.75rem;
                    }
                    header > div {
                        flex-direction: column;
                        height: auto !important;
                        padding: 0.75rem 1rem !important;
                        gap: 0.75rem;
                        align-items: flex-start !important;
                    }
                    .header-actions {
                        width: 100%;
                        justify-content: flex-start;
                        overflow-x: auto;
                        padding-bottom: 4px;
                        scrollbar-width: none; /* Hide scrollbar for clean look */
                    }
                    .header-actions::-webkit-scrollbar {
                        display: none;
                    }
                    .header-btn {
                        padding: 0 1rem;
                        min-height: 2.5rem;
                        font-size: 0.7rem;
                    }
                }
            `}</style>
        </header>
    );
};
