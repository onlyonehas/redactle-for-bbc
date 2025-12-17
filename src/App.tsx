import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ArticleView } from './components/ArticleView';
import { GuessInput } from './components/GuessInput';
import { getDailyArticle, getEmptyArticle } from './data/articles';
import { HelpModal } from './components/HelpModal';
import { GuessFeedback } from './components/GuessFeedback';
import { cleanWord, isRedacted, tokenize, countOccurrences } from './utils/gameLogic';
import { usePersistence } from './hooks/usePersistence';
import { useStats } from './hooks/useStats';
import { GuessHistory } from './components/GuessHistory';
import { StatsModal } from './components/StatsModal';

function App() {
  const [article, setArticle] = useState(getEmptyArticle);
  useEffect(()=> {
    getDailyArticle().then((article)=> {
      setArticle(article);
  });
  }, []);

  // Statistics
  const { stats, recordWin, recordLoss } = useStats(); // Added recordLoss
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [lastGameStats, setLastGameStats] = useState<{ guesses: number; globalAverage: number } | null>(null);

  const handleGiveUp = () => {
    if (confirm('Are you sure you want to give up? This will reveal the entire article.')) {
      setHasGivenUp(true);
      recordLoss();
      setGuessList([]);
      setLastGuess(null);
      setHighlightedWord(null);
    }
  };

  // Game State
  // Store guesses as OBJECTS { word, count } in persistence
  const [guessList, setGuessList] = usePersistence<{ word: string, count: number }[]>(`guesses-v2-${article.id}`, []);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lastGuess, setLastGuess] = useState<{ word: string; count: number } | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  // New Features State
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [isHintMode, setIsHintMode] = useState(false); // If true, next click on word reveals it
  const [revealedTokenKey, setRevealedTokenKey] = useState<string | null>(null); // Key of the single token showing char count

  console.log('App rendering, Article ID:', article.id);

  const guesses = useMemo(() => new Set(guessList.map(g => g.word)), [guessList]);

  // Handle a new guess
  const handleGuess = (word: string) => {
    const cleaned = cleanWord(word);
    if (!cleaned) return;

    // Calculate count
    const count = countOccurrences(article, cleaned);
    setLastGuess({ word: cleaned, count });

    // Auto-highlight the just-guessed word
    setHighlightedWord(cleaned);
    setRevealedTokenKey(null); // Clear character reveal on guess

    if (guesses.has(cleaned)) return;

    // Add to history
    setGuessList(prev => [...prev, { word: cleaned, count }]);
  };

  const handleHintClick = (tokenText: string) => {
    if (!isHintMode) return;

    const cleaned = cleanWord(tokenText);
    if (cleaned && !guesses.has(cleaned)) {
      handleGuess(cleaned);
      setIsHintMode(false); // Turn off after use
    }
  };

  const startNewGame = (random: boolean = true) => {
    let nextId = article.id;
    // if (random) {
    //   // Pick random article different from current
    //   const others = ARTICLES.filter(a => a.id !== currentArticleId);
    //   if (others.length > 0) {
    //     const randomArticle = others[Math.floor(Math.random() * others.length)];
    //     nextId = randomArticle.id;
    //   }
    // }

    // Reset persistent data for this article so it's a "New Game"
    // Note: We use the key format from usePersistence
    localStorage.removeItem(`guesses-v2-${nextId}`);
    localStorage.removeItem(`stats-won-${nextId}`);

    setLastGuess(null);
    setHighlightedWord(null);
    setHasGivenUp(false);
    setIsStatsOpen(false);
    setIsHintMode(false);
    setRevealedTokenKey(null);
    window.scrollTo(0, 0);
  };



  // Check win condition
  const headlineTokens = useMemo(() => tokenize(article.headline), [article]);
  const isHeadlineSolved = headlineTokens
    .filter(t => t.isWord)
    .every(t => !isRedacted(t.text, guesses)) && article.content?.length > 1;

  // Effect for Win
  useEffect(() => {
    if (isHeadlineSolved && !hasGivenUp) {
      const key = `stats-won-${article.id}`;
      if (!localStorage.getItem(key)) {
        recordWin(guessList.length);
        localStorage.setItem(key, 'true');
      }
      setLastGameStats({
        guesses: guessList.length,
        globalAverage: article.avgGuesses || 45
      });
      setIsStatsOpen(true);
    }
  }, [isHeadlineSolved, hasGivenUp, article.id, article.avgGuesses, guessList.length, recordWin]);


  return (
    <div className="App">
      <Header
        articleId={article.id}
        headlineRevealed={isHeadlineSolved || hasGivenUp}
        onHelp={() => setIsHelpOpen(true)}
        onStats={() => setIsStatsOpen(true)}
        onNewGame={() => startNewGame(true)}
        onGiveUp={handleGiveUp}
        onToggleHint={() => setIsHintMode(prev => !prev)}
        isHintMode={isHintMode}
      />

      {isHintMode && (
        <div style={{
          backgroundColor: '#ffd700',
          color: 'black',
          textAlign: 'center',
          padding: '0.5rem',
          fontWeight: 'bold',
          position: 'sticky',
          top: '0',
          zIndex: 900
        }}>
          HINT MODE: Click any hidden word to reveal it!
        </div>
      )}

      <div
        className="game-layout"
        onClick={() => {
          setHighlightedWord(null);
          setRevealedTokenKey(null);
        }} // Click background to clear highlight and reveals
      >
        <main className="article-container">
          <ArticleView
            key={article.id} // Force reset of internal state (Category Hint)
            article={article}
            guesses={guesses}
            highlightedWord={highlightedWord}
            isGiveUp={hasGivenUp}
            isHintMode={isHintMode}
            onWordClick={handleHintClick}
            revealedTokenKey={revealedTokenKey}
            onRevealToken={setRevealedTokenKey}
          />
        </main>

        <aside
          className="desktop-history"
          onClick={(e) => e.stopPropagation()} // Prevent sidebar clicks from clearing
        >
          <GuessHistory
            guesses={guessList}
            onHighlight={(word) => {
              setHighlightedWord(word);
              setRevealedTokenKey(null); // Clear reveal when highlighting from sidebar
            }}
            highlightedWord={highlightedWord}
          />
        </aside>
      </div>

      {/* Mobile/Floating Feedback */}
      <GuessFeedback lastGuess={lastGuess} />

      {!isHeadlineSolved && !hasGivenUp && (
        <GuessInput onGuess={handleGuess} guessCount={guesses.size} />
      )}

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        lastGame={lastGameStats}
        onNewGame={() => startNewGame(true)}
      />
    </div>
  );
}

export default App;
