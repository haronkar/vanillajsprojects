const songsObj = [
  {
    name: "Vagrant (Feat. Veela)ajsndamsndadn",
    artist: "Feint",
    song: "songs/Feint - Vagrant (Feat. Veela).mp3",
    cover: "cover/vagrant.jpg",
  },
  {
    name: "Spaceship",
    artist: "AP Dhillon",
    song: "songs/Spaceship.mp3",
    cover: "cover/spaceship.jpg",
  },
  {
    name: "Tigni",
    artist: "Kikimoteleba",
    song: "songs/Tigini.mp3",
    cover: "cover/tigni.jpg",
  },
];

function createSongItemPrototype(song, pos) {
  const songItemEl = document.createElement("div");
  songItemEl.classList.add("song-item");
  songItemEl._obj = song;
  songItemEl._index = pos;
  songItemEl.addEventListener("click", (e) => {
    isPlaying = true;
    loadSongPrototype(e.target._obj);
    index = e.target._index;
  });

  const songNameEle = document.createElement("h3");
  songNameEle.classList.add("song-name");
  songNameEle.innerHTML = song.name;

  const songArtistEle = document.createElement("h3");
  songArtistEle.classList.add("song-artist");
  songArtistEle.innerHTML = song.artist;

  songItemEl.append(songNameEle);
  songItemEl.append(songArtistEle);

  listContent.append(songItemEl);
}

function setSongListPrototype(songs) {
  removeChild();
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    createSongItemPrototype(song, i);
  }
}

function loadSongPrototype(song) {
  title.innerHTML = song.name;
  subTitle.innerHTML = song.artist;
  cover.src = song.cover;
  audio.src = song.song;
  bgImage.style.backgroundImage = `url(${song.cover})`;
  document.title = song.name;

  audio.onloadedmetadata = function () {
    const duration = audio.duration;
    const currentTime = audio.currentTime;

    currentLable.innerHTML = formatTime(currentTime);
    durationLabel.innerHTML = formatTime(duration);
  };
  if (!isPlaying) return;
  playSong();
}
