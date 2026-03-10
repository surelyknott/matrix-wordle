# Matrix Wordle

![Gameplay GIF Placeholder](./assets/matrix-wordle-demo.gif)
<!-- Replace the path above with your real GIF file -->

A Matrix-themed Wordle clone built with vanilla HTML, CSS, and JavaScript.

## Features

- Matrix rain animated canvas background
- Classic 5-letter Wordle gameplay (6 guesses)
- On-screen keyboard with color feedback
- "How to Play" modal on load
- End-game modal with replay button
- Built-in Matrix music player (YouTube iframe API)

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- YouTube Iframe API

## Getting Started

1. Clone this repo:
   ```bash
   git clone <your-repo-url>
   ```
2. Open the project folder:
   ```bash
   cd WORDLE
   ```
3. Launch `index.html` in your browser.

No build tools or install step required.

## How To Play

- Enter a 5-letter word using the on-screen keyboard.
- Press `Enter` to submit.
- Tile colors after each guess:
  - Green: correct letter, correct position
  - Yellow: correct letter, wrong position
  - Gray: letter not in the target word
- You have 6 total attempts.

## Project Structure

```text
WORDLE/
├── index.html
├── css/
│   ├── style.css
│   ├── normalize.css
│   └── reset.css
├── js/
│   └── main.js
└── the-matrix-code-keanu-reeves.avif
```

## Notes

- The current valid-word list is local and defined in `js/main.js`.
- The target word is randomly selected each game from the same local list.
