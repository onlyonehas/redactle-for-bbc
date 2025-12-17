import { usePersistence } from './usePersistence';

export interface GameStats {
    gamesPlayed: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
    totalGuesses: number;
    distribution: Record<string, number>; // "1-20", "21-40", etc.
}

const INITIAL_STATS: GameStats = {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalGuesses: 0,
    distribution: {}
};

export const useStats = () => {
    const [stats, setStats] = usePersistence<GameStats>('redactle-stats', INITIAL_STATS);

    const recordWin = (guessCount: number) => {
        setStats(prev => {
            const newCurrentStreak = prev.currentStreak + 1;

            // Determine bracket
            let bracket = "100+";
            if (guessCount <= 20) bracket = "1-20";
            else if (guessCount <= 40) bracket = "21-40";
            else if (guessCount <= 60) bracket = "41-60";
            else if (guessCount <= 80) bracket = "61-80";
            else if (guessCount <= 100) bracket = "81-100";

            return {
                ...prev,
                gamesPlayed: prev.gamesPlayed + 1,
                wins: prev.wins + 1,
                currentStreak: newCurrentStreak,
                maxStreak: Math.max(prev.maxStreak, newCurrentStreak),
                totalGuesses: prev.totalGuesses + guessCount,
                distribution: {
                    ...prev.distribution,
                    [bracket]: (prev.distribution[bracket] || 0) + 1
                }
            };
        });
    };

    const recordLoss = () => {
        setStats(prev => ({
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            currentStreak: 0
        }));
    };

    return { stats, recordWin, recordLoss };
};
