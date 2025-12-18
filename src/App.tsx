import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ArticleView } from './components/ArticleView';
import { GuessInput } from './components/GuessInput';
import { getDailyArticle, getEmptyArticle, getArticleByID, getRandomArticle } from './data/articles';
import { HelpModal } from './components/HelpModal';
import { GuessFeedback } from './components/GuessFeedback';
import { cleanWord, isRedacted, tokenize, countOccurrences } from './utils/gameLogic';
import { usePersistence } from './hooks/usePersistence';
import { useStats } from './hooks/useStats';
import { GuessHistory } from './components/GuessHistory';
import { StatsModal } from './components/StatsModal';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const [article, setArticle] = useState(getEmptyArticle);
  const [isLoading, setIsLoading] = useState(true);
  const [articleIndex, setArticleIndex] = usePersistence<number>(`current-article-index`, -1);

  // Statistics
  const { stats, recordWin, recordLoss } = useStats();
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
  const [guessList, setGuessList] = usePersistence<{ word: string, count: number }[]>(`guesses-v2-${article.index}`, []);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lastGuess, setLastGuess] = useState<{ word: string; count: number } | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  // New Features State
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [isHintMode, setIsHintMode] = useState(false);
  const [revealedTokenKey, setRevealedTokenKey] = useState<string | null>(null);

  // Auto-dismiss last guess feedback
  useEffect(() => {
    if (lastGuess) {
      const timer = setTimeout(() => {
        setLastGuess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastGuess]);

  useEffect(() => {
    const loadArticle = async () => {
      let loadedArticle;
      if (articleIndex === -1) {
        loadedArticle = await getDailyArticle();
      } else {
        loadedArticle = await getArticleByID(articleIndex);
      }

      setArticle(loadedArticle);
      setArticleIndex(loadedArticle.index);
      setIsLoading(false);

      // If already solved, reconstruction of lastGameStats for the modal
      const isSolvedKey = `stats-won-${loadedArticle.index}`;
      if (localStorage.getItem(isSolvedKey)) {
        setLastGameStats({
          guesses: guessList.length,
          globalAverage: loadedArticle.avgGuesses || 45
        });
      }
    };

    loadArticle();
  }, [articleIndex, guessList.length]);

  console.log('App rendering, Article ID:', article.index);

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
    setRevealedTokenKey(null);

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
      setIsHintMode(false);
    }
  };

  const startDailyGame = () => {
    setIsLoading(true);
    getDailyArticle().then((article) => {
      setArticle(article);
      setArticleIndex(article.index);
      setIsLoading(false);
    });

    setLastGuess(null);
    setHighlightedWord(null);
    setHasGivenUp(false);
    setIsStatsOpen(false);
    setIsHintMode(false);
    setRevealedTokenKey(null);
    window.scrollTo(0, 0);
  };

  const startNewGame = () => {
    if (!window.confirm("Are you sure you want to start a new game?")) return;

    setIsLoading(true);
    const currentIdx = article.index !== undefined ? article.index : -1;
    getRandomArticle(currentIdx).then((article) => {
      // Reset persistent data for this article
      localStorage.removeItem(`guesses-v2-${article.index}`);
      localStorage.removeItem(`stats-won-${article.index}`);

      setArticle(article);
      setArticleIndex(article.index);
      setLastGuess(null);
      setHighlightedWord(null);
      setHasGivenUp(false);
      setIsStatsOpen(false);
      setIsHintMode(false);
      setRevealedTokenKey(null);
      window.scrollTo(0, 0);

      // Reset loading state after a brief delay
      setTimeout(() => setIsLoading(false), 100);
    });
  };

  // Check win condition
  const headlineTokens = useMemo(() => tokenize(article.headline), [article]);
  const isHeadlineSolved = article.index >= 0 && headlineTokens
    .filter(t => t.isWord)
    .every(t => !isRedacted(t.text, guesses));

  // Effect for Win
  useEffect(() => {
    if (isHeadlineSolved && !hasGivenUp && guessList.length > 0) {
      const key = `stats-won-${article.index}`;
      if (!localStorage.getItem(key)) {
        // Use guessList.length here - it will be the updated value when this effect runs
        recordWin(guessList.length);
        localStorage.setItem(key, 'true');
      }
      setLastGameStats({
        guesses: guessList.length,
        globalAverage: article.avgGuesses || 45
      });
      setIsStatsOpen(true);
    }
  }, [isHeadlineSolved, hasGivenUp, article.index, article.avgGuesses, guessList.length, recordWin]);

  return (
    <div className="App">
      <Header
        articleId={article.index}
        headlineRevealed={isHeadlineSolved || hasGivenUp}
        onHelp={() => setIsHelpOpen(true)}
        onStats={() => setIsStatsOpen(true)}
        onNewGame={startNewGame}
        onDailyGame={startDailyGame}
        onGiveUp={handleGiveUp}
        onHome={startDailyGame}
        isLoading={isLoading}
      />

      {isHintMode && (
        <div style={{
          backgroundColor: '#ffcf00', // BBC Focus Yellow
          color: '#121212',
          textAlign: 'center',
          padding: '0.75rem',
          fontWeight: '700',
          position: 'sticky',
          top: '0',
          zIndex: 900,
          fontSize: '0.9rem',
          letterSpacing: '0.02em',
          borderBottom: '2px solid #000'
        }}>
          💡 HINT MODE: CLICK A HIDDEN WORD TO REVEAL IT
        </div>
      )}

      <div
        className="game-layout"
        onClick={() => {
          setHighlightedWord(null);
          setRevealedTokenKey(null);
        }}
      >
        <main className="article-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ArticleView
              key={article.index}
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
        </main>

        <aside
          className="desktop-history"
          onClick={(e) => e.stopPropagation()}
        >
          <GuessHistory
            guesses={guessList}
            onHighlight={(word) => {
              setHighlightedWord(word);
              setRevealedTokenKey(null);
            }}
            highlightedWord={highlightedWord}
            onToggleHint={() => setIsHintMode(prev => !prev)}
            isHintMode={isHintMode}
          />
        </aside>
      </div>

      <GuessFeedback lastGuess={lastGuess} />

      {!isHeadlineSolved && !hasGivenUp && (
        <GuessInput
          onGuess={handleGuess}
          guessCount={guesses.size}
          onToggleHint={() => setIsHintMode(prev => !prev)}
          isHintMode={isHintMode}
        />
      )}

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        lastGame={lastGameStats}
        onNewGame={startNewGame}
        onDailyGame={startDailyGame}
      />
    </div>
  );
}

export default App;
