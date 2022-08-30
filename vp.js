const videoPlayer = document.querySelector(".video-player");
const video = videoPlayer.querySelector(".video");
const controls = videoPlayer.querySelector(".player-controls");
const playBtn = videoPlayer.querySelector(".play-btn");
const volume = videoPlayer.querySelector(".volume");
const volumeBtn = videoPlayer.querySelector(".volume-btn");
const volumeContainer = videoPlayer.querySelector(".volume-container");
const currentTimeElement = videoPlayer.querySelector(".current");
const durationTimeElement = videoPlayer.querySelector(".duration");
const progress = videoPlayer.querySelector(".video-progress");
const fullscreen = videoPlayer.querySelector(".fullscreen-btn");

const playIcon = "media/play-icon.png";
const replayIcon = "media/replay-icon.png";
const volumeIcon = "media/volume-icon.png";
const muteIcon = "media/mute-icon.png";
const exitFullscreenIcon = "media/exit-fullscreen-icon.png";
const fullscreenIcon = "media/fullscreen-icon.png";

// play

let isStarted = false;

playBtn.addEventListener("click", () => {
  if (!isStarted) isStarted = true;

  playBtn.querySelector(".play-btn-icon").src = playIcon;
  video.play();
  playBtn.classList.add("hidden");
});

video.addEventListener("click", () => {
  if (!isStarted) isStarted = true;

  playBtn.querySelector(".play-btn-icon").src = playIcon;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.classList.toggle("hidden");
});

video.addEventListener("ended", () => {
  isStarted = false;
  controls.classList.remove("show");

  playBtn.querySelector(".play-btn-icon").src = replayIcon;
  playBtn.classList.remove("hidden");
});

// show/hide controls

let hideControlsTimeout;

videoPlayer.addEventListener("mousemove", () => {
  if (isStarted) {
    controls.classList.add("show");

    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(() => {
      controls.classList.remove("show");
    }, 3000);
  }
});

// volume
volume.addEventListener("keydown", (e) => e.preventDefault());

volume.addEventListener("mousemove", (e) => {
  video.volume = e.target.value;
});

volume.addEventListener("click", (e) => {
  video.volume = e.target.value;
});

volumeBtn.addEventListener("click", () => {
  if (video.muted) {
    volumeBtn.querySelector(".volume-btn-icon").src = volumeIcon;
  } else {
    volumeBtn.querySelector(".volume-btn-icon").src = muteIcon;
  }

  video.muted = !video.muted;
});

// show/hide volume

let hideVolumeTimeout;

volumeContainer.addEventListener("click", () => {
  if (isStarted) {
    volumeContainer.classList.add("show");

    if (hideVolumeTimeout) clearTimeout(hideVolumeTimeout);
    hideVolumeTimeout = setTimeout(() => {
      volumeContainer.classList.remove("show");
    }, 3000);
  }
});

// time

const currentTime = () => {
  let currentMinutes = Math.floor(video.currentTime / 60);
  let currentSeconds = Math.floor(video.currentTime - currentMinutes * 60);
  let durationMinutes = Math.floor(video.duration / 60);
  let durationSeconds = Math.floor(video.duration - durationMinutes * 60);

  currentTimeElement.innerHTML = `${currentMinutes}:${
    currentSeconds < 10 ? "0" + currentSeconds : currentSeconds
  }`;
  durationTimeElement.innerHTML = `${durationMinutes}:${
    durationSeconds < 10 ? "0" + durationSeconds : durationSeconds
  }`;
};

video.addEventListener("timeupdate", currentTime);

// progress

let isProgressChanging = false;

progress.addEventListener("keydown", (e) => e.preventDefault());

video.addEventListener("timeupdate", () => {
  progress.max = Math.floor(video.duration);
  if (!isProgressChanging) {
    progress.value = Math.floor(video.currentTime);
  }
});

let timeUpdateTimeout;
let wasPaused;

const changeCurrentTime = () => {
  video.pause();
  video.currentTime = progress.value;

  if (timeUpdateTimeout) clearTimeout(timeUpdateTimeout);
  timeUpdateTimeout = setTimeout(() => {
    video.currentTime = progress.value;
  }, 100);
};

progress.addEventListener("mousedown", () => {
  isProgressChanging = true;
  wasPaused = video.paused;

  progress.addEventListener("mousemove", changeCurrentTime);
});

progress.addEventListener("mouseup", () => {
  progress.removeEventListener("mousemove", changeCurrentTime);
  isProgressChanging = false;
  if (!wasPaused) video.play();
});

progress.addEventListener("click", () => {
  video.currentTime = progress.value;
});

// fullscreen

let isFullscreen = false;

const checkFS = () => {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement
  ) {
    isFullscreen = true;
  } else {
    isFullscreen = false;
  }
};

fullscreen.addEventListener("click", () => {
  checkFS();

  if (!isFullscreen) {
    videoPlayer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

videoPlayer.addEventListener("fullscreenchange", () => {
  checkFS();

  if (isFullscreen) {
    fullscreen.querySelector(".fullscreen-btn-icon").src = exitFullscreenIcon;
  } else {
    fullscreen.querySelector(".fullscreen-btn-icon").src = fullscreenIcon;
  }
});

// keys
const skipTime = 5;
const skipVolume = 0.05;

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") video.dispatchEvent(new Event("click"));
  if (!isStarted) return;

  switch (e.code) {
    case "ArrowLeft":
      if (Math.floor(video.currentTime) - skipTime < 0) video.currentTime = 0;
      else video.currentTime = Math.floor(video.currentTime) - skipTime;
      break;
    case "ArrowRight":
      if (Math.floor(video.currentTime) + skipTime > Math.floor(video.duration))
        video.currentTime = Math.floor(video.duration);
      else video.currentTime = Math.floor(video.currentTime) + skipTime;
      break;
    case "ArrowUp":
      if (parseFloat(volume.value) + skipVolume > 1) volume.value = 1;
      else volume.value = parseFloat(volume.value) + skipVolume;
      volume.dispatchEvent(new Event("click"));
      volumeContainer.dispatchEvent(new Event("click"));
      break;
    case "ArrowDown":
      if (parseFloat(volume.value) - skipVolume < 0) volume.value = 0;
      else volume.value = parseFloat(volume.value) - skipVolume;
      volume.dispatchEvent(new Event("click"));
      volumeContainer.dispatchEvent(new Event("click"));
      break;
    case "KeyM":
      volumeBtn.dispatchEvent(new Event("click"));
      break;
    case "KeyF":
      fullscreen.dispatchEvent(new Event("click"));
      break;
  }
  videoPlayer.dispatchEvent(new Event("mousemove"));
});
