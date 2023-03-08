const music = document.querySelector("audio");
const img = document.querySelector("img");
const artist = document.getElementById("artist");
const title = document.getElementById("title");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let progress = document.getElementById("progress");
let total_duration = document.getElementById("duration");
let current_time = document.getElementById("current_time");
const progress_div = document.getElementById("progress_div");

let isPlaying = false;
//for play functionality
const playMusic = () => {
  isPlaying = true;
  music.play();
  play.classList.replace("fa-play", "fa-pause");
  img.classList.add("anime");
};
//for pause functionality
const pauseMusic = () => {
  isPlaying = false;
  music.pause();
  play.classList.replace("fa-pause", "fa-play");
  img.classList.remove("anime");
};

play.addEventListener("click", () => {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

//changing the music data
const loadSong = (songs) => {
  title.textContent = songs.title;
  artist.textContent = songs.artist;
  music.src = "music/" + songs.name + ".mp3";
  img.src = "images/" + songs.name + ".jpg";
};

let songs = [];

// Fetch songs data from songs.json file
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    songs = data;
    loadSong(songs[0]);
  });

let songIndex = 0;

const nextSong = () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playMusic();
};
const prevSong = () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playMusic();
};

// progress js work
music.addEventListener("timeupdate", (event) => {
  const { currentTime, duration } = event.target;
  let progress_time = (currentTime / duration) * 100;
  progress.style.width = `${progress_time}%`;

  //music duration update
  let min_duration = Math.floor(duration / 60);
  let sec_duration = Math.floor(duration % 60);

  let tot_duration = `${min_duration}:${sec_duration}`;
  if (duration) {
    total_duration.textContent = `${tot_duration}`;
  }

  //current duration update
  let min_currentTime = Math.floor(currentTime / 60);
  let sec_currentTime = Math.floor(currentTime % 60);

  if (sec_currentTime < 10) {
    sec_currentTime = `0${sec_currentTime}`;
  }
  let tot_currentTime = `${min_currentTime}:${sec_currentTime}`;
  current_time.textContent = `${tot_currentTime}`;
});

//progress onclick functionality
progress_div.addEventListener("click", (event) => {
  const { duration } = music;
  let move_progress = (event.offsetX / event.target.clientWidth) * duration;

  music.currentTime = move_progress;
});
//if music is ended call next song
music.addEventListener("ended", nextSong);

//volume bar for volume increasing and decreasing
let e = document.querySelector(".volume_slider_container");
let eInner = document.querySelector(".volume_slider");
let audio = document.querySelector("audio");

let drag = false;
e.addEventListener("mousedown", (event) => {
  drag = true;
  updateBar(event.clientX);
});
document.addEventListener("mousemove", (event) => {
  if (drag) {
    updateBar(event.clientX);
  }
});
document.addEventListener("mouseup", (event) => {
  drag = false;
});

let updateBar = (x, vol) => {
  let volume = e;
  let percentage;
  //if only volume have specificed
  //then direct update volume
  if (vol) {
    percentage = vol * 100;
  } else {
    let position = x - volume.offsetLeft;
    percentage = (100 * position) / volume.clientWidth;
  }

  if (percentage > 100) {
    percentage = 100;
  }
  if (percentage < 0) {
    percentage = 0;
  }

  //update volume bar and video volume
  eInner.style.width = percentage + "%";
  audio.volume = percentage / 100;
};

next.addEventListener("click", nextSong);
prev.addEventListener("click", prevSong);
