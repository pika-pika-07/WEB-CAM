let video = document.querySelector("video");
let recordButtonContainer = document.querySelector(".record-btn-container");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let captureButtonContainer = document.querySelector(".capture-btn-container");
let recordFlag = false;
let chunks = []; // media data in chunks
let recorder;
let constraints = {
  video: true,
  audio: true,
};

// navigator gives glober browser info
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);

  recorder.addEventListener("start", (e) => {
    // At the start empty the last chunk
    chunks = [];
  });

  // listener to check if data chunk is available
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });

  recorder.addEventListener("stop", (e) => {
    // Conversion of media chunks data to video

    let blob = new Blob(chunks, { type: "video/mp4" });

    let videoUrl = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = videoUrl;
    a.download = "stream.mp4";
    a.click();
  });
});

recordButtonContainer.addEventListener("click", (e) => {
  if (!recorder) {
    return;
  }
  recordFlag = !recordFlag;
  if (recordFlag) {
    // start recording

    recorder.start();
    startTimer();
    recordBtn.classList.add("scale-record");
  } else {
    // stop recording
    stopTimer();
    recordBtn.classList.remove("scale-record");
    recorder.stop();
  }
});

let timerId;
let counter = 0; // Represents total seconds
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;
    let hours = Number.parseInt(totalSeconds / 3600);

    totalSeconds = totalSeconds % 3600; // Balance

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerText = `${hours}:${minutes}:${seconds}`;
    counter++;
  }
  timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
  timer.style.display = "none";
  clearInterval(timerId);
  timer.innerText = "00:00:00";
}
