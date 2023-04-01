const WORK_TIME_DEFAULT =  25 * 60;
const RELAX_TIME_DEFAULT = 5 * 60;

let workTime = WORK_TIME_DEFAULT;
let relaxTime = RELAX_TIME_DEFAULT;
let workTimeSetted = WORK_TIME_DEFAULT;
let relaxTimeSetted = RELAX_TIME_DEFAULT;
let isWorking = true;
let intervalId;

const timerDisplay = document.getElementById('timer');
const timerLabel = document.getElementById('timer-label');
const startBtn = document.getElementById('start-btn');
const settingBtn = document.getElementById('setting-btn');
const resetBtn = document.getElementById('reset-btn');
const settingForm = document.getElementById('setting-form');
const workTimeInput = document.getElementById('work-time-input');
const relaxTimeInput = document.getElementById('relax-time-input');
const confirmBtn = document.getElementById('confirm-btn');

function updateTimerDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTextDisplay() {
  if (isWorking) {
    timerDisplay.classList.remove('text-green-500');

    timerLabel.textContent = "Work"
    timerLabel.classList.add("text-gray-500");
    timerLabel.classList.remove("text-green-500");
  } else {
    // Relaxing
    timerDisplay.classList.add('text-green-500');

    timerLabel.textContent = "Relax"
    timerLabel.classList.remove("text-gray-500");
    timerLabel.classList.add("text-green-500");
  }
}

function startTimer() {
  startBtn.textContent = 'Restart';
  intervalId = setInterval(() => {
    if (isWorking) {
      workTime--;
      updateTimerDisplay(workTime);
      if (workTime === 0) {
        isWorking = false;
        document.title = 'Take a break!';
        workTime = workTimeSetted;
        updateTextDisplay();
        updateTimerDisplay(relaxTime);
        notify();
      }
    } else {
      relaxTime--;
      updateTimerDisplay(relaxTime);
      if (relaxTime === 0) {
        isWorking = true;
        // clearInterval(intervalId);
        document.title = 'Back to work!';
        relaxTime = relaxTimeSetted;
        updateTextDisplay();
        updateTimerDisplay(workTime);
        // startBtn.textContent = 'Start';
        notify();
      } else if (relaxTime <= 5 || relaxTime === relaxTimeSetted) {
        document.title = `(${relaxTime}) Take a break!`;
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function resetTimer() {
  stopTimer();
  workTime = workTimeSetted;
  relaxTime = relaxTimeSetted;
  isWorking = true;
  updateTimerDisplay(workTime);
  startBtn.textContent = 'Start';
}

function showSettingForm() {
  settingForm.classList.remove('hidden');
}

function hideSettingForm() {
  settingForm.classList.add('hidden');
}

function showOrHideSettingForm() {
  if (settingForm.classList.contains('hidden')) {
    showSettingForm();
  } else {
    hideSettingForm();
  }
}

function playBeep() {
    // Create an AudioContext object
    const audioCtx = new AudioContext();

    // Define the frequency and duration of the beep
    const frequency = 200; // in Hz
    const duration = 0.5; // in seconds
  
    // Create an oscillator node and connect it to the AudioContext destination
    const oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
  
    // Set the frequency and type of the oscillator
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.type = 'sine';
  
    // Start the oscillator
    oscillator.start(audioCtx.currentTime);
  
    // Stop the oscillator after the specified duration
    oscillator.stop(audioCtx.currentTime + duration);
}

function newNotification() {
  if (isWorking) {
    const minutes = Math.floor(workTimeSetted / 60);
    var notification = new Notification('Back to work!', {
      body: `${minutes} minutes to work!`,
    });
  } else {
    const minutes = Math.floor(relaxTimeSetted / 60);
    var notification = new Notification('Time to relax', {
      body: `Try to relax for ${minutes} minutes!`,
    });
  }
}

function sendNotificaiton() {
  if (Notification.permission === 'granted') {
    newNotification()
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        newNotification()
      }
    });
  }
}

function notify() {
  // playBeep();
  sendNotificaiton();
}

function updateTimerSetting(event) {
  event.preventDefault();
  workTimeSetted = parseInt(workTimeInput.value) * 60 || WORK_TIME_DEFAULT;
  relaxTimeSetted = parseInt(relaxTimeInput.value) * 60 || RELAX_TIME_DEFAULT;
  hideSettingForm();
  resetTimer();
}

startBtn.addEventListener('click', () => {
  if (startBtn.textContent === 'Start') {
    startTimer();
  } else {
    resetTimer();
    startTimer();
  }
});

settingBtn.addEventListener('click', showOrHideSettingForm);

resetBtn.addEventListener('click', resetTimer);

confirmBtn.addEventListener('click', updateTimerSetting);
