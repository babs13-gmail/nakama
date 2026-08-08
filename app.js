// ============================================
// DONNÉES FICTIVES — à remplacer plus tard par
// des appels à l'API AniList ou Jikan
// ============================================
const trending = [
  { title: "Jujutsu Kaisen", ep: "S3 · Ép 8", score: 8.9 },
  { title: "Frieren", ep: "S1 · Ép 24", score: 9.4 },
  { title: "Solo Leveling", ep: "S2 · Ép 5", score: 8.7 },
  { title: "Chainsaw Man", ep: "S2 · Ép 3", score: 8.5 },
  { title: "Kaiju No. 8", ep: "Ép 6", score: 8.2 },
  { title: "Dandadan", ep: "Ép 9", score: 8.8 },
  { title: "Blue Lock", ep: "Ép 12", score: 8.4 },
  { title: "One Piece", ep: "Ép 1122", score: 9.1 },
];

const releases = [
  { title: "One Piece", date: "Dimanche", time: "17:00", ep: "Ép 1122" },
  { title: "Blue Lock", date: "Lundi", time: "20:30", ep: "Ép 12" },
  { title: "Kaiju No. 8", date: "Mardi", time: "19:00", ep: "Ép 6" },
  { title: "Dandadan", date: "Mercredi", time: "18:00", ep: "Ép 9" },
  { title: "Frieren", date: "Jeudi", time: "21:00", ep: "Ép 25" },
  { title: "Chainsaw Man", date: "Vendredi", time: "19:30", ep: "Ép 4" },
];

// ============================================
// RENDU DES CARTES
// ============================================
function animeCardHTML(t) {
  return `
    <div class="anime-card">
      <div class="anime-cover">
        <span class="placeholder">Jaquette</span>
        <span class="anime-score">★ ${t.score}</span>
      </div>
      <div class="anime-info">
        <p class="a-title">${t.title}</p>
        <p class="a-ep">${t.ep}</p>
      </div>
    </div>`;
}

function releaseCardHTML(r) {
  return `
    <div class="release-card">
      <p class="r-date">${r.date} · ${r.time}</p>
      <p class="r-title">${r.title}</p>
      <p class="r-ep">${r.ep}</p>
    </div>`;
}

function releaseListItemHTML(r) {
  return `
    <div class="release-list-item">
      <div class="r-left">
        <div class="r-daytime">
          <p class="day">${r.date}</p>
          <p class="time">${r.time}</p>
        </div>
        <div class="r-thumb"></div>
        <div>
          <p class="r-title">${r.title}</p>
          <p class="r-ep">${r.ep}</p>
        </div>
      </div>
    </div>`;
}

// Remplissage des grilles/listes
document.getElementById("trendingGridHome").innerHTML =
  trending.slice(0, 4).map(animeCardHTML).join("");
document.getElementById("trendingGridFull").innerHTML =
  trending.map(animeCardHTML).join("");

document.getElementById("releaseRowHome").innerHTML =
  releases.slice(0, 4).map(releaseCardHTML).join("");
document.getElementById("releaseListFull").innerHTML =
  releases.map(releaseListItemHTML).join("");

// ============================================
// NAVIGATION PAR ONGLETS
// ============================================
function goToTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("is-active", page.id === `page-${tabId}`);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelectorAll(".nav-tab").forEach((btn) => {
  btn.addEventListener("click", () => goToTab(btn.dataset.tab));
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => goToTab(btn.dataset.goto));
});

// ============================================
// MODALE CONNEXION / INSCRIPTION — ouverture/fermeture
// (la logique Firebase elle-même est dans auth.js)
// ============================================
const authModal = document.getElementById("authModal");

function openAuthModal(tab = "login") {
  authModal.hidden = false;
  document.querySelectorAll(".modal-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.authtab === tab);
  });
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.toggle("is-active", form.id === `${tab}Form`);
  });
}

function closeAuthModal() {
  authModal.hidden = true;
}

document.getElementById("navAccountBtn").addEventListener("click", () => {
  openAuthModal("login");
});
document.getElementById("profilLoginBtn").addEventListener("click", () => {
  openAuthModal("login");
});
document.getElementById("modalClose").addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});

document.querySelectorAll(".modal-tab").forEach((btn) => {
  btn.addEventListener("click", () => openAuthModal(btn.dataset.authtab));
});
