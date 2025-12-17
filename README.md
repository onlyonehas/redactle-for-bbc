# Redactle for BBC

A BBC-themed Redactle clone where you guess the hidden article by revealing words one by one.

## Features

- **Daily Article**: A new blurred article every day (simulation).
- **BBC Styling**: Styled to match the BBC News aesthetic.
- **Progress Tracking**: Local storage persistence for your guesses.
- **Smart Redaction**: Common words are automatically revealed.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

## How to Play

1. Read the redacted article. Common words (the, a, in, etc.) are visible.
2. Type a word in the input box at the bottom.
3. If the word exists in the article, all instances are revealed.
4. Try to guess the headline to win!

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest

## License

Private
