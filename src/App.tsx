import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ArticleView } from './components/ArticleView';
import { GuessInput } from './components/GuessInput';
import { HelpModal } from './components/HelpModal';
import { GuessFeedback } from './components/GuessFeedback';
import { getDailyArticle, ARTICLES } from './data/articles'; // ARTICLES needed for random pick
import { cleanWord, isRedacted, tokenize, countOccurrences } from './utils/gameLogic';
import { usePersistence } from './hooks/usePersistence';
import { useStats } from './hooks/useStats';
import { GuessHistory } from './components/GuessHistory';
import { StatsModal } from './components/StatsModal';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  // Article ID Management - Support Random Play
  // Persist article ID so refreshing the page keeps you on the same article
  const [currentArticleId, setCurrentArticleId] = usePersistence<string>(
    'current-article-id',
    getDailyArticle().id
  );
  const [isLoading, setIsLoading] = useState(false);

  const article = useMemo(() =>
    ARTICLES.find(a => a.id === currentArticleId) || getDailyArticle(),
    [currentArticleId]);

  // Statistics
  const { stats, recordWin, recordLoss } = useStats(); // Added recordLoss
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [lastGameStats, setLastGameStats] = useState<{ guesses: number; globalAverage: number } | null>(null);

  // ... (lines 30-101)

  const handleGiveUp = () => {
    if (confirm('Are you sure you want to give up? This will reveal the entire article.')) {
      setHasGivenUp(true);
      recordLoss(); // Record the loss
      setGuessList([]); // Clear guesses as requested
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
      // Check if this is a headline word
      const headTokens = tokenize(article.headline);
      const isHeadlineWord = headTokens.some(t => t.isWord && cleanWord(t.text) === cleaned);

      if (isHeadlineWord) {
        // Wait, isRedacted signature: isRedacted(word, guesses). Returns true if hidden (redacted).
        // Let's re-verify logic.
        // isRedacted returns TRUE if the word should be HIDDEN.

        const hiddenUniqueWords = new Set(
          headTokens
            .filter(t => t.isWord)
            .map(t => cleanWord(t.text))
            .filter(w => isRedacted(w, guesses))
        );

        if (hiddenUniqueWords.size === 1 && hiddenUniqueWords.has(cleaned)) {
          alert("You have to guess the last word of the title on your own!");
          setIsHintMode(false);
          return;
        }
      }

      handleGuess(cleaned);
      setIsHintMode(false); // Turn off after use
    }
  };

  const startNewGame = (random: boolean = true) => {
    if (!window.confirm("Are you sure you want to start a new game?")) return;

    setIsLoading(true);
    let nextId = getDailyArticle().id;
    if (random) {
      // Pick random article different from current
      const others = ARTICLES.filter(a => a.id !== currentArticleId);
      if (others.length > 0) {
        const randomArticle = others[Math.floor(Math.random() * others.length)];
        nextId = randomArticle.id;
      }
    }

    // Reset persistent data for this article so it's a "New Game"
    // Note: We use the key format from usePersistence
    localStorage.removeItem(`guesses-v2-${nextId}`);
    localStorage.removeItem(`stats-won-${nextId}`);

    setCurrentArticleId(nextId);
    setLastGuess(null);
    setHighlightedWord(null);
    setHasGivenUp(false);
    setIsStatsOpen(false);
    setIsHintMode(false);
    setRevealedTokenKey(null);
    window.scrollTo(0, 0);

    // Reset loading state after a brief delay to allow state updates to propagate
    setTimeout(() => setIsLoading(false), 100);
  };



  // Check win condition
  const headlineTokens = useMemo(() => tokenize(article.headline), [article]);
  const isHeadlineSolved = headlineTokens
    .filter(t => t.isWord)
    .every(t => !isRedacted(t.text, guesses));

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
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ArticleView
              key={article.id} // Force reset of internal state (Category Hint)
              article={article}
              guesses={guesses}
              highlightedWord={highlightedWord}
              isGiveUp={hasGivenUp || isHeadlineSolved}
              isHintMode={isHintMode}
              onWordClick={handleHintClick}
              revealedTokenKey={revealedTokenKey}
              onRevealToken={setRevealedTokenKey}
            />
          )}
        </main >

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
      </div >

      {/* Mobile/Floating Feedback */}
      < GuessFeedback lastGuess={lastGuess} />

      {!isHeadlineSolved && !hasGivenUp && (
        <GuessInput
          onGuess={handleGuess}
          guessCount={guesses.size}
          onToggleHint={() => setIsHintMode(prev => !prev)}
          isHintMode={isHintMode}
        />
      )
      }

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        lastGame={lastGameStats}
        onNewGame={() => startNewGame(true)}
      />
    </div >
  );
}

export default App;
