//searches current page for html video element
function findVideoElement() {
    return document.querySelector("video");
}

//updates menu script with current video playback speed (for ui)
function logCurrentSpeed() {
    let video = findVideoElement();
    if (video) {
        chrome.runtime.sendMessage({ action: "updateSpeed", speed: video.playbackRate });
    }
}

//updates video playback speed on current page
function updatePlaybackSpeed(speed) {
    let video = findVideoElement();
    if (video) {
        video.playbackRate = speed;
        console.log(`playback speed modified to: ${speed}x`);
        logCurrentSpeed(); //update ui with modified speed 
    }
}

//listening for messages from menu script (ui)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setSpeed") {
        updatePlaybackSpeed(request.speed);
        sendResponse({ status: "success" });
    } else if (request.action === "getSpeed") {
        let video = findVideoElement();
        if (video) {
            sendResponse({ speed: video.playbackRate });
        } else {
            sendResponse({ speed: 1.0 });
        }
    } else if (request.action === "resetSpeed") {
        updatePlaybackSpeed(1.0);
        sendResponse({ status: "reset to default" });
    }
    return true;
});

//for detecting dynamically loaded videos
function waitForVideo() {
    let checkExist = setInterval(() => {
        let video = findVideoElement();
        if (video) {
            console.log("video is detected!");
            logCurrentSpeed();
            clearInterval(checkExist);
        }
    }, 1000);
}

waitForVideo();
