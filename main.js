const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0
};
// set Interval variable
let interval;

// add Event main button
const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.querySelector('#js-btn');
mainButton.addEventListener('click', function () {
    buttonSound.play();
    const { action } = mainButton.dataset;

    if (action === 'start') startTimer();
    else stopTimer();
});

// Calculate remaining time with startTimer();
function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds
    };
}

// start Timer with interval
function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    // count sessions
    if (timer.mode === 'pomodoro') timer.sessions++;

    // Creation stop button
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;

        if (total <= 0) {
            clearInterval(interval);

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }
            document.querySelector(`[data-sound= "${timer.mode}"]`);
            startTimer();
        }
    }, 1000);
}

// Stop timer

function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.add('active');
}
// Update clock UI
function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;

    // Title text
    const text = timer.mode === 'pomodoro' ? 'Do your work now' : 'rest';
    document.title = `${minutes}:${seconds} - ${text}`;

    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}
// Switch Pomodoro timer modes(css)
function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0
    };

    document.querySelectorAll('button[data-mode]').forEach((e) => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    document.getElementById('js-progress').setAttribute('max', timer.remainingTime.total);

    updateClock();
}

function handleMode(event) {
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
}
// This ensures that the default mode for the timer is pomodoro
document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});
