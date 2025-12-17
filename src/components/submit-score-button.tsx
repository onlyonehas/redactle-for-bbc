import { useState } from 'react';
import { submitScore } from '../utils/submit-score';

/**
 * Button component to submit a score using submitScore function.
 * Props:
 *   - score: number
 *   - game: string
 *   - date?: string
 */
export function SubmitScoreButton({ score, game, username, date }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await submitScore({ score, game, username, date });
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading || username === '' || !username}>
        {loading ? 'Submitting...' : 'Submit Score'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Score submitted!</div>}
    </div>
  );
}