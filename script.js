let currentLevel = 1;
let currentScore = 0;
let timerInterval;
let timeRemaining = 30;
let hintUsed = false; // Track if a hint has been used

const levels = [
    { word: "VATA", hint: "This dosha represents wind" },
    { word: "PITA", hint: "This dosha represents fire" },
    { word: "KAPA", hint: "This dosha represents water" },
    // Add more levels here with different Ayurvedic words and hints
];

// Start the game with the first level
function startLevel(level) {
    clearInterval(timerInterval);
    resetBoard();
    hintUsed = false; // Reset hint used for the new level
    const currentWord = levels[level - 1].word;
    document.querySelector('.clue').textContent = `Clue: ${levels[level - 1].hint}`;
    initializeLetters(currentWord);
    startTimer();
    updateLevelDisplay();
}

function initializeLetters(word) {
    const letters = word.split('');
    shuffleArray(letters);

    const letterElements = document.querySelectorAll('.letter');
    for (let i = 0; i < letterElements.length; i++) {
        letterElements[i].textContent = letters[i];
    }
}

function startTimer() {
    timeRemaining = 30;
    updateTimeDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimeDisplay();
        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            alert("Time's up! Try again.");
            resetBoard();
            startLevel(currentLevel);
        }
    }, 1000);
}

function updateTimeDisplay() {
    document.getElementById('timer').textContent = `Time: ${timeRemaining}s`;
}

function resetBoard() {
    const dropBoxes = document.querySelectorAll('.drop-box');
    dropBoxes.forEach(box => {
        box.textContent = '';
        box.classList.remove('filled');
    });
}

// Drag and Drop Logic
document.querySelectorAll('.letter').forEach(letter => {
    letter.addEventListener('dragstart', dragStart);
});

document.querySelectorAll('.drop-box').forEach(box => {
    box.addEventListener('dragover', allowDrop);
    box.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedLetter = document.getElementById(e.dataTransfer.getData("text"));
    if (!e.target.classList.contains('filled')) {
        e.target.textContent = draggedLetter.textContent;
        e.target.classList.add('filled');
        e.target.classList.add('animate-drop'); // Add animation class
        setTimeout(() => {
            e.target.classList.remove('animate-drop'); // Remove animation class after animation is done
        }, 300); // Duration of animation
    }
    checkWordCompletion();
}

function checkWordCompletion() {
    const dropBoxes = document.querySelectorAll('.drop-box');
    let formedWord = '';
    dropBoxes.forEach(box => {
        formedWord += box.textContent;
    });

    if (formedWord === levels[currentLevel - 1].word) {
        currentScore += 10;
        updateScore();
        showCelebration();
        setTimeout(nextLevel, 2000);
    }
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > levels.length) {
        alert("Congratulations! You've completed all the levels.");
        return;
    }
    startLevel(currentLevel);
}

function showCelebration() {
    document.getElementById('celebration').style.display = 'block';
    setTimeout(() => {
        document.getElementById('celebration').style.display = 'none';
    }, 2000);
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${currentScore}`;
}

function updateLevelDisplay() {
    document.getElementById('level').textContent = `Level: ${currentLevel}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function useHint() {
    if (currentScore >= 5) { // Check if the user has enough points
        currentScore -= 5; // Deduct points for using a hint
        updateScore(); // Update score display

        const currentWord = levels[currentLevel - 1].word;
        const dropBoxes = document.querySelectorAll('.drop-box');

        // Find a letter in the current word that hasn't been revealed yet
        let revealed = false;
        for (let i = 0; i < currentWord.length; i++) {
            if (dropBoxes[i].textContent === '') { // If the drop box is empty
                dropBoxes[i].textContent = currentWord[i]; // Reveal the corresponding letter
                dropBoxes[i].classList.add('filled'); // Mark the box as filled
                revealed = true; // Set the revealed flag
                break; // Exit after revealing one letter
            }
        }

        // If no letters were available to reveal, alert the user
        if (!revealed) {
            alert("All letters are already revealed!");
        }
    } else {
        alert("Not enough points to use a hint!");
    }
}


// Function to reveal a letter from the correct answer
function revealLetter() {
    const currentWord = levels[currentLevel - 1].word;
    const letterToReveal = currentWord.charAt(0); // For now, revealing the first letter
    const dropBoxes = document.querySelectorAll('.drop-box');
    for (let box of dropBoxes) {
        if (box.textContent === '') {
            box.textContent = letterToReveal; // Place the revealed letter in an empty drop box
            box.classList.add('filled');
            break; // Exit after revealing one letter
        }
    }
}

startLevel(currentLevel);
