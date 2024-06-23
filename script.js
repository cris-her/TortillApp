document.addEventListener('DOMContentLoaded', function() {

    const timerInputsContainer = document.getElementById('inputContainer');
    const addTimerButton = document.getElementById('addTimer');
    const startTimersButton = document.getElementById('startTimers');
    
    let timerSequences = [];
    let currentTimerIndices = [];
    let isTimerRunning = [];
    let isFirstClick = [true, true, true];
    let sounds = ['do-stretched.wav', 'mi-stretched.wav', 'sol-stretched.wav']

    addTimerButton.addEventListener('click', function() {
        const timerCount = timerInputsContainer.querySelectorAll('.timer-input').length + 1;
        const newTimerInput = document.createElement('div');
        newTimerInput.className = 'timer-input';
        newTimerInput.innerHTML = `
            <label>Time ${timerCount}:</label>
            <input value="00:00:30" type="text" placeholder="hh:mm:ss" class="time-input" required>
            <button class="remove-timer">Remove</button>
        `;
        timerInputsContainer.appendChild(newTimerInput);

        const removeTimerButtons = timerInputsContainer.querySelectorAll('.remove-timer');
        removeTimerButtons.forEach(button => {
            button.addEventListener('click', function() {
                timerInputsContainer.removeChild(newTimerInput);
            });
        });
    });

    addTimerButton.click();
    addTimerButton.click();

    startTimersButton.addEventListener('click', function() {

        if (!isTimerRunning[1] && !isTimerRunning[2] && !isTimerRunning[3]) {
            const timeInputs = timerInputsContainer.querySelectorAll('.time-input');
            timerSequences[1] = Array.from(timeInputs).map(input => parseTime(input.value));
            timerSequences[2] = Array.from(timeInputs).map(input => parseTime(input.value)); // Example: Use different inputs for each set
            timerSequences[3] = Array.from(timeInputs).map(input => parseTime(input.value)); // Example: Use different inputs for each set

            if (timerSequences[1].every(timer => timer !== null) && timerSequences[2].every(timer => timer !== null)  && timerSequences[3].every(timer => timer !== null)) {
                
                document.getElementById('config').style.display = 'none';
                document.getElementById('timerSets').style.display = 'block';
        
                const timerControlsContainer1 = document.getElementById('timerControls1');
                const timerControlsContainer2 = document.getElementById('timerControls2');
                const timerControlsContainer3 = document.getElementById('timerControls3');

                timerInputsContainer.style.display = 'none';
                timerControlsContainer1.style.display = 'flex';
                timerControlsContainer2.style.display = 'flex';
                timerControlsContainer3.style.display = 'flex';

                isTimerRunning[1] = true;
                isTimerRunning[2] = true;
                isTimerRunning[3] = true;

                currentTimerIndices[1] = 0;
                currentTimerIndices[2] = 0;
                currentTimerIndices[3] = 0;

                runTimer(1);
                runTimer(2);
                runTimer(3);

            } else {
                alert('Please enter valid times in the format hh:mm:ss.');
            }
        }
    });

    function parseTime(timeString) {
        const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        if (timePattern.test(timeString)) {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            return {
                hours,
                minutes,
                seconds,
                totalTimeInSeconds: hours * 3600 + minutes * 60 + seconds
            };
        }
        return null;
    }

    function runTimer(setNumber) {
        const timerControlsContainer = document.getElementById(`timerControls${setNumber}`);
        const timerButton = document.createElement('button');
        timerButton.className = 'timer-button';
        timerControlsContainer.innerHTML = '';
        timerControlsContainer.appendChild(timerButton);

        if(isFirstClick[setNumber - 1]){
            timerButton.addEventListener('click', function onFirstClick() {
                updateTimer(timerButton, setNumber);
                timerButton.removeEventListener('click', onFirstClick);
            });
            timerButton.textContent = 'Start'
            isFirstClick[setNumber - 1] = false;
        } else {
            updateTimer(timerButton, setNumber);
        }
        
    }

    function updateTimer(button, setNumber) {
        const { hours, minutes, seconds, totalTimeInSeconds } = timerSequences[setNumber][currentTimerIndices[setNumber]];
        let remainingTime = totalTimeInSeconds;

        const intervalId = setInterval(function() {
            const hoursLeft = Math.floor(remainingTime / 3600);
            const minutesLeft = Math.floor((remainingTime % 3600) / 60);
            const secondsLeft = remainingTime % 60;

            button.textContent = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
            
            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(intervalId);
                if (currentTimerIndices[setNumber] === timerSequences[setNumber].length - 1) {
                    button.textContent = 'Restart';
                    
                    var audio = new Audio(sounds[setNumber - 1]);
                    audio.play();

                    button.addEventListener('click', function onRestartClick() {
                        currentTimerIndices[setNumber] = 0;
                        runTimer(setNumber);
                        button.removeEventListener('click', onRestartClick);
                    });
                } else {
                    button.textContent = 'Next';

                    var audio = new Audio(sounds[setNumber - 1]);
                    audio.play();

                    button.addEventListener('click', function onNextClick() {
                        currentTimerIndices[setNumber]++;
                        runTimer(setNumber);
                        button.removeEventListener('click', onNextClick);
                    });
                }
                isTimerRunning[setNumber] = false;
            }
        }, 1000);
    }
});
