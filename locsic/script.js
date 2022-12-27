gsap.registerPlugin(Flip);

// const musicContainer = document.querySelector(".music-container");
const bgImage = document.querySelector(".bgimage");
const playBtn = document.querySelector("#play");
const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");

const shuffleBtn = document.querySelector("#shuffle");
const repeatBtn = document.querySelector("#repeat");
const queueBtn = document.querySelector("#queue");

const audio = document.querySelector("#audio");
const title = document.querySelector(".title");
const subTitle = document.querySelector(".sub-title");
const cover = document.querySelector("#cover");

const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");
const currentLable = document.querySelector("#current");
const durationLabel = document.querySelector("#duration");

const listContainer = document.querySelector(".song-list-container");
const listContent = document.querySelector(".list-content");
const upperContainer = document.querySelector(".upper-container");
const imageContainer = document.querySelector(".image-container");

const volume = document.querySelector(".volume");
const file = document.querySelector("#file");

var link = document.querySelector("link[rel~='icon']");
var linkApple = document.querySelector("link[rel~='apple-touch-icon']");

const jsmediatags = window.jsmediatags;
let songs = songsObj;
let index = 0;

let isSeeking = false;
let repeat = false;
let shuffle = false;
let isPlaying = false;

let prototype = true;

setSongListPrototype(songsObj);
loadSongPrototype(songsObj[index]);

audio.volume = 0.1;

// song functions

function loadSong(song, tag = null) {
  const state = Flip.getState(title);
  if (tag.tags.picture) {
    const data = tag.tags.picture.data;
    const format = tag.tags.picture.format;
    let base64String = "";
    for (let i = 0; i < data.length; i++) {
      base64String += String.fromCharCode(data[i]);
    }
    cover.src = `data:${format};base64,${window.btoa(base64String)}`;
    link.href = `data:${format};base64,${window.btoa(base64String)}`;
    bgImage.style.backgroundImage = `url(data:${format};base64,${window.btoa(
      base64String
    )})`;
  } else {
    cover.src = "cover/vagrant.jpg";
    bgImage.style.backgroundImage = "url(cover/vagrant.jpg)";
    link.href = "cover/vagrant.jpg";
  }

  title.innerHTML = tag.tags.title;
  subTitle.innerHTML = tag.tags.artist;
  audio.src = URL.createObjectURL(song);

  document.title = tag.tags.title;
  Flip.from(state, {
    duration: 1,
    ease: "expo-out",
    // absolute: true,
  });

  if (!isPlaying) return;
  playSong();
}
function loadMetadata(song) {
  if (!song.type) return;
  jsmediatags.read(song, {
    onSuccess: function (tag) {
      loadSong(song, tag);
    },
    onError: function (error) {
      console.log(error);
    },
  });
}
function playSong() {
  if (audio.paused) {
    audio.play();
    isPlaying = !audio.paused;
  } else {
    audio.pause();
    isPlaying = !audio.paused;
  }
  if (!isPlaying) {
    playBtn.querySelector("i.fas").classList.add("fa-play");
    playBtn.querySelector("i.fas").classList.remove("fa-pause");
  } else {
    playBtn.querySelector("i.fas").classList.add("fa-pause");
    playBtn.querySelector("i.fas").classList.remove("fa-play");
  }
}
function nextSong() {
  if (repeat) index = index;
  else {
    index++;
    if (index > songs.length - 1) index = 0;
    // Mac folder system have an issue, and i hate that
    if (!songs[index].type && !prototype) index++;
  }

  if (prototype) loadSongPrototype(songs[index]);
  else loadMetadata(songs[index]);
}
function prevSong() {
  if (repeat) index = index;
  else {
    index--;
    // Mac folder system have an issue, and i hate that
    if (!prototype && !songs[index].type) index--;
    if (index < 0) index = songs.length - 1;
  }

  if (prototype) loadSongPrototype(songs[index]);
  else loadMetadata(songs[index]);
}

// Progress
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;

  const progressPercentage = (currentTime / duration) * 100;
  if (!isSeeking) progress.value = progressPercentage;

  currentLable.innerHTML = formatTime(currentTime);
}
function setProgress(e) {
  const maxValue = e.target.max;
  const currentValue = e.target.value;
  const duration = audio.duration;
  audio.currentTime = (currentValue / maxValue) * duration;
}

// Utility funciotns
function toogleRepeat() {
  if (repeat) repeatBtn.classList.remove("active");
  else repeatBtn.classList.add("active");

  repeat = !repeat;
}
function toogleShuffle() {
  if (shuffle) shuffleBtn.classList.remove("active");
  else shuffleBtn.classList.add("active");

  shuffle = !shuffle;
}

function formatTime(duration) {
  let min = parseInt(duration / 60);
  let sec = Math.round(duration % 60);
  if (sec >= 60) {
    min++;
    sec = 0;
  }
  const time = sec < 10 ? "0" + sec.toString() : sec.toString();

  return `${min}:${time}`;
}

// Volume
function updateVolume(e) {
  audio.volume = e.target.value / 100;
}

const propList = [
  upperContainer,
  title,
  subTitle,
  progressContainer,
  imageContainer,
  listContainer,
];
// list functions
function toogleList() {
  if (!Flip.isFlipping(upperContainer)) {
    const state = Flip.getState(propList);
    upperContainer.classList.toggle("list");
    queueBtn.classList.toggle("active");
    Flip.from(state, {
      duration: 0.2,
      ease: "expo-out",
      // absolute: true,
    });
  }
}

function createSongItem(song, tag, pos) {
  const songItemEl = document.createElement("div");
  songItemEl.classList.add("song-item");
  songItemEl._obj = song;
  songItemEl._index = pos;
  songItemEl.addEventListener("click", (e) => {
    isPlaying = true;
    loadMetadata(e.target._obj);
    index = e.target._index;
  });

  const songNameEle = document.createElement("h3");
  songNameEle.classList.add("song-name");
  songNameEle.innerHTML = tag.tags.title;

  const songArtistEle = document.createElement("h3");
  songArtistEle.classList.add("song-artist");
  songArtistEle.innerHTML = tag.tags.artist;

  songItemEl.append(songNameEle);
  songItemEl.append(songArtistEle);

  listContent.append(songItemEl);
}

function setSongList(songs) {
  removeChild();
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    if (!song.type) continue;

    jsmediatags.read(song, {
      onSuccess: function (tag) {
        createSongItem(song, tag, i);
      },
      onError: function (error) {
        console.log(error);
      },
    });
  }
}
function removeChild() {
  while (listContent.firstChild) {
    listContent.removeChild(listContent.lastChild);
  }
}

// event listeners
playBtn.addEventListener("click", playSong);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", toogleShuffle);
repeatBtn.addEventListener("click", toogleRepeat);
queueBtn.addEventListener("click", toogleList);

progress.addEventListener("mousedown", (e) => {
  isSeeking = true;
});
progress.addEventListener("mouseup", (e) => {
  isSeeking = false;
});
progress.addEventListener("change", setProgress);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);

volume.addEventListener("input", updateVolume);

file.addEventListener("change", (e) => {
  index = 1;
  prototype = false;
  songs = e.target.files;
  setSongList(songs);
  loadMetadata(songs[index]);
});
