// video.js
// Affiche une vidéo selon l’ID dans l’URL (video.html?id=xxx)

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const player = document.getElementById("videoPlayer");
const titleEl = document.getElementById("videoTitle");
const descEl = document.getElementById("videoDesc");
const catEl = document.getElementById("videoCat");
const dateEl = document.getElementById("videoDate");
const favToggle = document.getElementById("favToggle");
const openVimeo = document.getElementById("openVimeo");

let favorites = JSON.parse(localStorage.getItem("favorites") || "{}");

fetch("videos.json")
  .then(r => r.json())
  .then(videos => {
    const video = videos.find(v => v.id === id);
    if (!video) {
      player.innerHTML = "<p>Vidéo introuvable.</p>";
      return;
    }

    const vimeoId = video.vimeo_url.split("/").pop();
    player.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0" allowfullscreen></iframe>`;
    titleEl.textContent = video.title;
    descEl.textContent = video.description;
    catEl.textContent = video.category;
    dateEl.textContent = video.published;
    openVimeo.href = video.vimeo_url;

    updateFavButton(video);
    favToggle.onclick = () => toggleFavorite(video);
  });

function updateFavButton(video) {
  favToggle.textContent = favorites[video.id]
    ? "❤ Retirer des favoris"
    : "❤ Ajouter aux favoris";
}

function toggleFavorite(video) {
  if (favorites[video.id]) {
    delete favorites[video.id];
  } else {
    favorites[video.id] = true;
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavButton(video);
}
