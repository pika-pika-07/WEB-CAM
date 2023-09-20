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
let transparentColor = "transparent";

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

    if (db) {
      let videoId = shortid();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `vid=${videoId}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }

    // let videoUrl = URL.createObjectURL(blob);

    // let a = document.createElement("a");
    // a.href = videoUrl;
    // a.download = "stream.mp4";
    // a.click();
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

captureButtonContainer.addEventListener("click", (e) => {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");

  tool.drawImage(video, 0, 0, canvas.width, canvas.height);
  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);
  let imageUrl = canvas.toDataURL();

  if (db) {
    let imageId = shortid();
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img=${imageId}`,
      url: imageUrl,
    };
    imageStore.add(imageEntry);
  }

  // let a = document.createElement("a");
  // a.href = imageUrl;
  // a.download = "image.jpg";
  // a.click();
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

let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");
allFilters.forEach((filterElement) => {
  filterElement.addEventListener("click", (e) => {
    transparentColor =
      getComputedStyle(filterElement).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = transparentColor;
  });
});
