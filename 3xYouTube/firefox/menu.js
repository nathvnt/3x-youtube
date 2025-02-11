document.addEventListener("DOMContentLoaded", () => {
    const speedInput = document.getElementById("speedInput");
    const setSpeedButton = document.getElementById("setSpeed");
    const resetSpeedButton = document.getElementById("resetSpeed");
    const speedButtons = document.querySelectorAll(".speed-option");
    const currentSpeedDisplay = document.getElementById("currentSpeed");

    //trim extra decimal place when displaying current speed
    function updateCurrentSpeed(speed) {
        currentSpeedDisplay.textContent = `${parseFloat(speed)}x`;
    }

    //requesting current playback speed for display when menu ui opens
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: "getSpeed" }, (response) => {
            if (browser.runtime.lastError) {
                console.warn("an error getting speed:", browser.runtime.lastError.message);
                return;
            }
            if (response && response.speed) {
                updateCurrentSpeed(response.speed);
            } else {
                console.warn("there was no speed data received.");
            }
        });
    });

    //updating custom input with current applied speed
    function updateSpeed(value) {
        speedInput.value = value;
        applySpeed();
    }

    //applying the user specified custom playback speed
    function applySpeed() {
        const speed = parseFloat(speedInput.value);
        if (speed >= 0.1 && speed <= 10) {
            browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { action: "setSpeed", speed: speed });
            });
        }
    }

    //resseting playback to default 1x 
    resetSpeedButton.addEventListener("click", () => {
        updateSpeed(1);
    });

    //applying custom speed from user input
    setSpeedButton.addEventListener("click", applySpeed);

    //buttons with events for applying pre-defined custom speeds
    speedButtons.forEach(button => {
        button.addEventListener("click", () => {
            updateSpeed(parseFloat(button.dataset.speed));
        });
    });

    //listening to content script for update data
    browser.runtime.onMessage.addListener((request) => {
        if (request.action === "updateSpeed") {
            updateCurrentSpeed(request.speed);
        }
    });
});
