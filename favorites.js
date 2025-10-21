// favorites.js : affichage des favoris uniquement
const catalogue = document.getElementById("catalogue");
const searchInput = document.getElementById("searchInput");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

let videos = [];
let favorites = JSON.parse(localStorage.getItem("favorites") || "{}");

// Charger les données
fetch("videos.json")
  .then(r => r.json())
  .then(data => {
    videos = data;
    renderFilteredVideos();
  })
  .catch(err => {
    catalogue.innerHTML = "<p>Erreur de chargement du catalogue.</p>";
    console.error(err);
  });

// Menu mobile
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Variables pour recherche et filtre
let currentCategory = "all";
const filterBtns = document.querySelectorAll(".filter-btn");

// Filtrer par catégorie
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderFilteredVideos();
  });
});

// Recherche
searchInput.addEventListener("input", () => {
  renderFilteredVideos();
});

// Afficher les vidéos selon recherche + filtre
function renderFilteredVideos() {
  const q = searchInput.value.toLowerCase();

  // on ne prend que les favoris
  const filtered = videos
    .filter(v => favorites[v.id])  // seulement les favoris
    .filter(v => {
      const matchesSearch =
        (v.title + v.description + v.category).toLowerCase().includes(q);
      const matchesCategory =
        currentCategory === "all" || v.category === currentCategory;
      return matchesSearch && matchesCategory;
    });

  renderVideos(filtered);
}

// Fonction pour afficher les vignettes
function renderVideos(list) {
  catalogue.innerHTML = "";
  const tpl = document.getElementById("thumbTemplate");
  if(list.length === 0){
    catalogue.innerHTML = "<p>Aucun favori trouvé.</p>";
    return;
  }
  list.forEach(v => {
    const node = tpl.content.cloneNode(true);
    const art = node.querySelector(".thumb");
    const img = node.querySelector(".thumb-img");
    const title = node.querySelector(".thumb-title");
    const cat = node.querySelector(".thumb-cat");

    img.src = v.thumb || "https://via.placeholder.com/400x225?text=VOD";
    title.textContent = v.title;
    cat.textContent = v.category;

    art.onclick = () => {
      window.location.href = `video.html?id=${v.id}`;
    };
    catalogue.appendChild(node);
  });
}
