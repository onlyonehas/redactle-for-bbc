interface HeaderProps {
    articleId: number;
    headlineRevealed: boolean;
    onHelp: () => void;
    onStats: () => void;
    onNewGame: () => void;
    onDailyGame: () => void;
    onGiveUp: () => void;
    onToggleHint: () => void;
    isHintMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ articleId, headlineRevealed, onHelp, onStats, onNewGame, onDailyGame, onGiveUp, onToggleHint, isHintMode }) => {
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

                <div style={{
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <span>#{articleId}</span>
                    <button
                        onClick={onToggleHint}
                        className="header-btn"
                        style={{ backgroundColor: isHintMode ? '#ffd700' : 'transparent', color: isHintMode ? 'black' : 'white', fontWeight: isHintMode ? 'bold' : 'normal' }}
                        title="Click, then click a word to reveal it"
                    >
                        Hint
                    </button>
                    <button onClick={onStats} className="header-btn" title="Statistics">Stats</button>
                    <button onClick={onHelp} className="header-btn">Help</button>
                    <button onClick={onNewGame} className="header-btn">New Game</button>
                    <button onClick={onDailyGame} className="header-btn">Today's Game</button>
                    {!headlineRevealed && (
                        <button onClick={onGiveUp} className="header-btn">Give Up</button>
                    )}
                </div>
            </div>
            <style>{`
                .header-btn {
                    background-color: transparent;
                    border: 1px solid white;
                    font-size: 0.8rem;
                    padding: 0.4em 0.8em;
                    cursor: pointer;
                    color: white;
                }
                .header-btn:hover {
                    background-color: rgba(255,255,255,0.1);
                }
            `}</style>
        </header>
    );
};
