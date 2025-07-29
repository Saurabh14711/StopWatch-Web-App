let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 0;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsContainer = document.getElementById('lapsContainer');

// Format time as HH:MM:SS.ms
function formatTime(milliseconds) {
    let date = new Date(milliseconds);
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    let ms = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}.${ms}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
    
    // Add pulse animation when running
    if (isRunning) {
        display.classList.add('pulse');
    } else {
        display.classList.remove('pulse');
    }
}

function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(function() {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        isRunning = true;
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        lapBtn.disabled = false;
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 0;
    updateDisplay();
    
    // Clear laps container
    lapsContainer.innerHTML = '';
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    lapBtn.disabled = true;
}

function recordLap() {
    if (isRunning || elapsedTime > 0) {
        lapCount++;
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCount}</span>
            <span class="lap-time">${formatTime(elapsedTime)}</span>
        `;
        
        // Add divider except for the first lap
        if (lapCount > 1) {
            const divider = document.createElement('div');
            divider.className = 'lap-divider';
            divider.textContent = '↓';
            lapsContainer.insertBefore(divider, lapsContainer.firstChild);
        }
        
        lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
    }
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    } else if (e.code === 'KeyL') {
        e.preventDefault();
        recordLap();
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
    }
});

// Initialize
updateDisplay();
