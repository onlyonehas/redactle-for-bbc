import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Integration', () => {
    it('registers a user guess', () => {
        render(<App />);

        const input = screen.getByPlaceholderText('Type a guess...');
        const button = screen.getByRole('button', { name: /GUESS/ });

        // Initial state
        expect(button).toHaveTextContent('GUESS (0)');

        // Type a guess
        fireEvent.change(input, { target: { value: 'world' } });
        fireEvent.click(button);

        // Expect input to be cleared
        expect(input).toHaveValue('');

        // Expect guess count to increment (assuming 'world' is not in COMMON_WORDS and hasn't been guessed)
        expect(button).toHaveTextContent('GUESS (1)');
    });

    it('ignores empty input', () => {
        render(<App />);
        const input = screen.getByPlaceholderText('Type a guess...');
        const button = screen.getByRole('button', { name: /GUESS/ });

        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.click(button);

        expect(button).toHaveTextContent('GUESS (0)');
    });
});
