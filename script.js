// DOM Elements
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const currentRoundEl = document.getElementById('current-round');
const totalRoundsEl = document.getElementById('total-rounds');
const statusEl = document.getElementById('status');
const roundTimeInput = document.getElementById('round-time');
const roundTimeUnitSelect = document.getElementById('round-time-unit');
const restTimeInput = document.getElementById('rest-time');
const numRoundsInput = document.getElementById('num-rounds');
const prepTimeInput = document.getElementById('prep-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const bellEl = document.getElementById('bell'); 

// Light/Dark Mode elements
const body = document.body;
const modeToggleBtn = document.getElementById('mode-toggle');

// Audio Context for generated sounds
let audioContext = null;

// Audio files (now loaded from the 'audio/' folder)
const startBellSound = new Audio('audio/round_start.mp3');
const endBellSound = new Audio('audio/round_end.mp3');
const warningSound = new Audio('audio/warning_beep.mp3');
const halfwaySound = new Audio('audio/halfway_beep.mp3'); // New halfway sound

// Mute state
let isMuted = false;
const muteToggleBtn = document.getElementById('mute-toggle');

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generate a beep sound using Web Audio API (fallback)
function generateBeep(frequency = 440, duration = 0.2, volume = 0.5) {
    if (!audioContext || isMuted) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// Play sound with mute check
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0;
        sound.play().catch(e => {
            console.warn("Audio playback failed, falling back to generated sound:", e);
            generateBeep();
        });
    }
}

// Toggle mute state
function toggleMute() {
    isMuted = !isMuted;
    muteToggleBtn.querySelector('.mute-icon').textContent = isMuted ? '🔇' : '🔊';
}

// Timer variables
let timer;
let isRunning = false;
let isPaused = false;
let currentRound = 0;
let totalRounds = 12;
let roundTimeInSeconds = 180;
let restTimeInSeconds = 60;
let prepTimeInSeconds = 10;
let currentTimeInSeconds;
let currentPhase = 'ready';

// --- Light/Dark Mode Functions ---

// Set the theme (dark or light)
function setMode(mode) {
    if (mode === 'light') {
        body.classList.add('light-mode');
        modeToggleBtn.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        modeToggleBtn.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
}

// Toggle the theme
function toggleMode() {
    const currentMode = body.classList.contains('light-mode') ? 'light' : 'dark';
    setMode(currentMode === 'dark' ? 'light' : 'dark');
}

// Apply saved theme on page load
function applySavedMode() {
    const savedMode = localStorage.getItem('theme') || 'dark'; 
    setMode(savedMode);
}

// --- Timer Functions ---

// Initialize the timer display and settings
function initializeTimer() {
    totalRounds = parseInt(numRoundsInput.value);
    
    // Calculate round time based on unit selection
    if (roundTimeUnitSelect.value === 'min') {
        roundTimeInSeconds = parseInt(roundTimeInput.value) * 60;
    } else {
        roundTimeInSeconds = parseInt(roundTimeInput.value);
    }
    
    restTimeInSeconds = parseInt(restTimeInput.value);
    prepTimeInSeconds = parseInt(prepTimeInput.value);

    currentRound = 0;
    totalRoundsEl.textContent = totalRounds;
    currentRoundEl.textContent = currentRound;

    if (prepTimeInSeconds > 0) {
        currentTimeInSeconds = prepTimeInSeconds;
        statusEl.textContent = 'READY';
        statusEl.className = 'status ready';
        currentPhase = 'ready';
    } else {
        currentTimeInSeconds = 0; 
        statusEl.textContent = 'READY';
        statusEl.className = 'status ready';
        currentPhase = 'ready';
    }
    
    updateTimerDisplay(prepTimeInSeconds > 0 ? prepTimeInSeconds : 0);

    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Start timer functionality (handles initial start and resume)
function startTimer() {
    if (isRunning && !isPaused) return;

    roundTimeInput.disabled = true;
    roundTimeUnitSelect.disabled = true;
    restTimeInput.disabled = true;
    numRoundsInput.disabled = true;
    prepTimeInput.disabled = true;
    modeToggleBtn.disabled = true; 

    startBtn.disabled = true;
    pauseBtn.disabled = false;

    if (!isRunning) {
        isRunning = true;
        isPaused = false;

        if (prepTimeInSeconds > 0) {
            currentPhase = 'prep';
            statusEl.textContent = 'PREP!';
            statusEl.className = 'status ready';
            playSound(startBellSound);
        } else {
            currentRound = 1;
            currentRoundEl.textContent = currentRound;
            startNewRound(); 
            return; 
        }

        timer = setInterval(updateTimer, 1000);

    } else if (isPaused) {
        isPaused = false;
        statusEl.textContent = statusEl.textContent.replace('(PAUSED)', '').trim();
        if(currentPhase === 'fight') statusEl.className = 'status fight';
        else if (currentPhase === 'rest') statusEl.className = 'status rest';
        else if (currentPhase === 'prep') statusEl.className = 'status ready'; 

        timer = setInterval(updateTimer, 1000);
    }
}

// Start the preparation phase
function startPrepPhase() {
    currentPhase = 'prep';
    statusEl.textContent = 'PREP!';
    statusEl.className = 'status ready'; 
    currentTimeInSeconds = prepTimeInSeconds;
    updateTimerDisplay(currentTimeInSeconds);
    playSound(startBellSound);
    timer = setInterval(updateTimer, 1000);
}

// Start a new round (fight phase)
function startNewRound() {
    currentRound++;
    currentRoundEl.textContent = currentRound;

    currentPhase = 'fight';
    statusEl.textContent = 'FIGHT!';
    statusEl.className = 'status fight';

    currentTimeInSeconds = roundTimeInSeconds; 
    updateTimerDisplay(currentTimeInSeconds);

    playSound(startBellSound);
    timer = setInterval(updateTimer, 1000);
}

// Pause timer functionality
function pauseTimer() {
    clearInterval(timer);
    isPaused = true;

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    modeToggleBtn.disabled = false; 

    statusEl.textContent = statusEl.textContent + ' (PAUSED)';
}

// Reset timer functionality
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    currentRound = 0;
    currentPhase = 'ready'; 

    roundTimeInput.disabled = false;
    roundTimeUnitSelect.disabled = false;
    restTimeInput.disabled = false;
    numRoundsInput.disabled = false;
    prepTimeInput.disabled = false;
    modeToggleBtn.disabled = false; 

    startBtn.disabled = false;
    pauseBtn.disabled = true;

    initializeTimer(); 
}

// Update timer each second
function updateTimer() {
    currentTimeInSeconds--;
    
    // Log timer tick for debugging
    console.log('script.js: updateTimer - currentTimeInSeconds:', currentTimeInSeconds, 'currentPhase:', currentPhase);

    // Play halfway sound at the halfway point of the round
    if (currentPhase === 'fight' && currentTimeInSeconds === Math.floor(roundTimeInSeconds / 2)) {
        console.log('script.js: updateTimer - Playing halfway sound!');
        playSound(halfwaySound);
    }

    if (currentTimeInSeconds === 10 &&
        (currentPhase === 'fight' || currentPhase === 'rest' || (currentPhase === 'prep' && prepTimeInSeconds > 10)))
    {
        playSound(warningSound);
    }

    updateTimerDisplay(currentTimeInSeconds);
    
    if (currentTimeInSeconds <= 0) {
        clearInterval(timer); 
        
        if (currentPhase === 'prep') {
            if (totalRounds > 0) {
                currentRound = 0; 
                startNewRound(); 
            } else {
                endWorkout();
            }

        } else if (currentPhase === 'fight') {
            if (currentRound < totalRounds) {
                startRestPeriod();
            } else {
                endWorkout();
            }
        } else if (currentPhase === 'rest') {
            if (currentRound < totalRounds) {
                startNewRound();
            } else {
                endWorkout();
            }
        }
    }
}

// Start rest period between rounds
function startRestPeriod() {
    currentPhase = 'rest';
    statusEl.textContent = 'REST';
    statusEl.className = 'status rest';
    
    currentTimeInSeconds = restTimeInSeconds; 
    updateTimerDisplay(currentTimeInSeconds);
    
    playSound(endBellSound);
    timer = setInterval(updateTimer, 1000);
}

// End the entire workout
function endWorkout() {
    clearInterval(timer); 
    isRunning = false;
    isPaused = false; 
    currentPhase = 'complete';
    statusEl.textContent = 'COMPLETE!';
    statusEl.className = 'status ready'; 

    updateTimerDisplay(0);
    
    playSound(endBellSound);
    roundTimeInput.disabled = false;
    roundTimeUnitSelect.disabled = false;
    restTimeInput.disabled = false;
    numRoundsInput.disabled = false;
    prepTimeInput.disabled = false;
    modeToggleBtn.disabled = false; 

    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Update the timer display (minutes:seconds)
function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    
    // Add warning class when 10 seconds remaining
    const timerDisplay = document.querySelector('.timer-display');
    if (currentPhase === 'fight' && timeInSeconds <= 10) {
        timerDisplay.classList.add('warning');
        if (timeInSeconds === 10) {
            playSound(warningSound);
        }
    } else {
        timerDisplay.classList.remove('warning');
    }
    
    // Update phase-specific styling
    timerDisplay.classList.remove('phase-rest', 'phase-fight');
    if (currentPhase === 'rest') {
        timerDisplay.classList.add('phase-rest');
    } else if (currentPhase === 'fight') {
        timerDisplay.classList.add('phase-fight');
    }
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
modeToggleBtn.addEventListener('click', toggleMode); 
muteToggleBtn.addEventListener('click', toggleMute);
document.addEventListener('click', initAudioContext, { once: true });

// Initialize the timer and apply saved theme when the page loads
applySavedMode(); 
initializeTimer();