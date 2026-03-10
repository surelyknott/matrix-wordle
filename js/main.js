// MATRIX ANIMATION
const canvas = document.getElementById('matrix-canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;
const rainDrops = Array.from({ length: columns }).fill(1);

function draw() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#0F0';
    context.font = fontSize + 'px monospace';

    rainDrops.forEach((y, i) => {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    });
}

setInterval(draw, 30);

//MATRIX MUSIC PLAYER 
const youtubeUrl = "https://www.youtube.com/watch?v=pFS4zYWxzNA";

function extractVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return match ? match[1] : null;
}

const videoId = extractVideoId(youtubeUrl);
let player;
let isPlaying = false;

function loadYouTubeAPI() {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        videoId,
        playerVars: { autoplay: 0, controls: 0 },
        events: { onReady: setupPlayerControls, onStateChange: handlePlayerStateChange },
    });
}

function setupPlayerControls() {
    const playBtn = document.getElementById("play-btn");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");
    const totalTimeEl = document.getElementById("total-time");

    player.setVolume(100);

    totalTimeEl.textContent = formatTime(player.getDuration());

    playBtn.addEventListener("click", () => {
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    progressBar.addEventListener("input", (e) => {
        const newTime = (e.target.value / 100) * player.getDuration();
        player.seekTo(newTime);
    });

    setInterval(() => {
        if (isPlaying) {
            const currentTime = player.getCurrentTime();
            currentTimeEl.textContent = formatTime(currentTime);
            progressBar.value = (currentTime / player.getDuration()) * 100;
        }
    }, 1000);
}

function handlePlayerStateChange(event) {
    isPlaying = event.data === YT.PlayerState.PLAYING;
    document.getElementById("play-btn").textContent = isPlaying ? "⏸" : "▶";
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

loadYouTubeAPI();

// WORDLE BUSINESS
const grid = document.querySelector('.grid');
const keyboard = document.querySelector('.keyboard');
const resultModal = document.getElementById('result-modal');
const resultMessage = document.getElementById('result-message');
const playAgainButton = document.getElementById('play-again');
const howToPlayModal = document.getElementById('how-to-play-modal');

/// Show the how-to-play modal on page load
window.addEventListener("load", () => {
    const howToPlayModal = document.getElementById("how-to-play-modal");

    // Show the modal
    howToPlayModal.style.display = "flex"; // Use flex for centering
});

// Close the how-to-play modal
const closeHowToPlayButton = document.getElementById("close-how-to-play");
closeHowToPlayButton.addEventListener("click", () => {
    const howToPlayModal = document.getElementById("how-to-play-modal");

    // Hide the modal
    howToPlayModal.style.display = "none";
});

// Track the current tile being edited
let currentRow = 0;
let currentCol = 0;

const wordList = ['CRANE', 'APPLE', 'TIGER', 'OCEAN', 'MONEY', 'HAPPY', 'SMILE', 'BRAIN', 'CLOUD', 'ANGRY', 'DREAM', 'YACHT', 'EAGLE', 'GOOSE', 'GRAIN', 'LOWER', 
    'DUALS', 'HURTS', 'AFTER', 'PAYEE', 'FIELD', 'QUICK', 'ZEBRA', 'FANCY', 'GLASS', 'JUMPY', 'WAVES', 'VIXEN', 'BRAVE', 'DIZZY', 'FROST', 'GHOST', 'HUMAN', 'IMPLY', 
    'JOKER', 'KNOCK', 'LUNCH', 'MAGIC', 'NORTH', 'OFFER', 'PLUMB', 'QUIRK', 'REACT', 'STORM', 'TWIST', 'URBAN', 'VOTER', 'WITCH', 'XYLEM', 'YOUTH', 'ZONAL', 'ALIVE', 
    'BINGO', 'CHILL', 'DRIVE', 'EARLY', 'FLOUR', 'GRAND', 'HEAVY', 'IMAGE', 'JUICY', 'KINGS', 'LIGHT', 'MOUNT', 'NOVEL', 'OPTIC', 'PITCH', 'QUOTA', 'RIVER', 'SHOUT', 
    'TUMOR', 'UNCLE', 'VISOR', 'WHISK', 'XENON', 'YEAST', 'ALBUM', 'BREAD', 'CROWN', 'DEPTH', 'EXIST', 'FORCE', 'GLORY', 'HEIST', 'INBOX', 'JOLLY', 'KARMA', 
    'LEMON', 'MERCY', 'NOBLE', 'OMEGA', 'PRIZE', 'QUEUE', 'RUGBY', 'STRAW', 'THREE', 'UNDER', 'VIRUS', 'WORST', 'YIELD', 'ZONED'];
let targetWord = wordList[Math.floor(Math.random() * wordList.length)];

// NEW: fast local lookup for validation (uses your existing list)
const VALID_WORDS = new Set(wordList.map(w => w.toUpperCase()));

// Ensure grid and keyboard are above the canvas
const gameElements = document.querySelectorAll('.grid, .keyboard');
gameElements.forEach(el => el.style.position = 'relative');
gameElements.forEach(el => el.style.zIndex = '1');

document.getElementById('matrix-canvas').style.zIndex = '-1';

// Function to check if a word is valid (LOCAL, no API)
async function isValidWord(word) {
    // keep signature async so callers don't change
    const w = (word || '').toUpperCase();
    if (!/^[A-Z]{5}$/.test(w)) return false; // enforce 5 letters
    return VALID_WORDS.has(w);
}

// Function to check if a word is valid using Datamuse API
// async function isValidWord(word) {
//     const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
//     const data = await response.json();
//     return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
// }

// Function to clear the current row
function clearCurrentRow(row) {
    for (let col = 0; col < 5; col++) {
        const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        tile.textContent = ''; // Clear the tile content
        tile.style.backgroundColor = '#222222'; // Reset background color
        tile.style.color = '#ffffff'; // Reset text color
        tile.classList.remove('flip'); // Remove flip animation if present
    }
}

// Modify the validateGuess function to check if the word is valid
// async function validateGuess(guess, row) {
//     const isValid = await isValidWord(guess);
//     if (!isValid) {
//         alert('Invalid word! Please try again.');
//         clearCurrentRow(row); // Clear the current row
//         currentCol = 0; // Reset the column counter
//         return false; // Return false to indicate the guess was invalid
//     }

async function validateGuess(guess, row) {
    // Remove validation check — accept any 5-letter guess
    let targetWordArray = targetWord.split('');
    let guessArray = guess.split('');
    let targetLetterCounts = {};

    targetWordArray.forEach(letter => {
        targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    });


    // First pass: Mark correct letters (green)
    let usedPositions = new Set();
    for (let col = 0; col < 5; col++) {
        const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        tile.classList.add('flip');
        setTimeout(() => {
            if (guessArray[col] === targetWordArray[col]) {
                tile.style.backgroundColor = '#00ff00';
                tile.style.color = '#000000';
                updateKeyboardColor(guessArray[col], '#00ff00');
                targetLetterCounts[guessArray[col]]--;
                usedPositions.add(col);
            }
        }, col * 100);
    }

    // Second pass: Mark misplaced letters (yellow), ensuring correct count
    setTimeout(() => {
        for (let col = 0; col < 5; col++) {
            const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!usedPositions.has(col) && targetWordArray.includes(guessArray[col]) && targetLetterCounts[guessArray[col]] > 0) {
                tile.style.backgroundColor = '#ffff00';
                tile.style.color = '#000000';
                updateKeyboardColor(guessArray[col], '#ffff00');
                targetLetterCounts[guessArray[col]]--;
            }
            tile.classList.remove('flip');
        }
    }, 700);

    // Third pass: Mark incorrect letters (gray)
    setTimeout(() => {
        for (let col = 0; col < 5; col++) {
            const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!usedPositions.has(col) && targetLetterCounts[guessArray[col]] === undefined) {
                tile.style.backgroundColor = '#333333';
                tile.style.color = '#ffffff';
                updateKeyboardColor(guessArray[col], '#333333');
            }
        }
    }, 1600);

    // Check for win/loss after all animations complete
    setTimeout(() => {
        if (guess === targetWord) {
            showResultModal('You win!');
        } else if (row === 5) {
            showResultModal(`You lose! The word was ${targetWord}.`);
        }
    }, 2500);

    return true; // Return true to indicate the guess was valid
}

// Keyboard event listener
keyboard.addEventListener('click', async (event) => {
    const key = event.target;
    if (!key.classList.contains('key')) return;

    const keyValue = key.textContent;

    if (keyValue === 'Back' || keyValue === 'Backspace') {
        if (currentCol > 0) {
            currentCol--;
        }
        const tile = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
        if (tile) tile.textContent = ''; // Clear the tile
    } else if (keyValue === 'Enter') {
        if (currentCol === 5 && !document.querySelector('.tile.flip')) {
            const guess = getCurrentGuess(currentRow);
            if (guess.length === 5) {
                const isValid = await validateGuess(guess, currentRow);
                if (isValid) {
                    // Only move to the next row if the word is valid
                    currentRow++;
                    currentCol = 0;
                }
            }
        }
    } else {
        if (currentCol < 5) {
            const tile = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
            tile.textContent = keyValue;
            currentCol++;
        }
    }
});

function updateKeyboardColor(letter, color) {
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => {
    if (key.textContent === letter) {
      if (color === '#00ff00') {
        key.style.backgroundColor = '#00ff00';
      } else if (color === '#ffff00' && key.style.backgroundColor !== '#00ff00') {
        key.style.backgroundColor = '#ffff00';
      } else if (color === '#333333' && !['#00ff00', '#ffff00'].includes(key.style.backgroundColor)) {
        key.style.backgroundColor = '#333333';
      }
    }
  });
}

function getCurrentGuess(row) {
  let guess = '';
  for (let col = 0; col < 5; col++) {
    const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    guess += tile.textContent;
  }
  return guess;
}

function showResultModal(message) {
  resultMessage.textContent = message;
  resultModal.style.display = 'flex';
}

function resetGame() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
      tile.textContent = '';
      tile.style.color = '#ffffff';
      tile.style.backgroundColor = '#222222'; // Match dark mode
      tile.classList.remove('flip');
    });
  
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
      key.style.backgroundColor = '#d4eadc';
      key.classList.remove('used', 'correct', 'misplaced', 'incorrect');
    });
  
    currentRow = 0;
    currentCol = 0;
    targetWord = wordList[Math.floor(Math.random() * wordList.length)];
  }
  
  playAgainButton.addEventListener('click', () => {
    resultModal.style.display = 'none';
    resetGame();
  });