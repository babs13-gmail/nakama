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

const news = [
  { tag: "manga", tagLabel: "Manga", date: "25 mai", title: "Bleach : le nouvel arc annonce son anime", excerpt: "Une adaptation très attendue par les fans depuis des années." },
  { tag: "anime", tagLabel: "Anime", date: "24 mai", title: "My Hero Academia saison 7 : trailer officiel", excerpt: "Découvre le trailer officiel de la saison 7." },
  { tag: "manga", tagLabel: "Manga", date: "23 mai", title: "Demon Slayer : une suite après l'arc final ?", excerpt: "L'autrice aurait un nouveau projet en préparation." },
  { tag: "industrie", tagLabel: "Industrie", date: "22 mai", title: "Le marché du manga explose en 2026", excerpt: "Les ventes ont explosé cette année en francophonie." },
];

// ============================================
// ACTU EN DIRECT — flux RSS MyAnimeList via rss2json
// (remplace les news fictives ci-dessus dès que le flux répond)
// ============================================
const RSS_FEED_URL = "https://myanimelist.net/rss/news.xml";
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}`;

function formatRssDate(pubDate) {
  const d = new Date(pubDate);
  const months = ["jan.","fév.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

async function loadRealNews() {
  try {
    const res = await fetch(RSS2JSON_URL);
    const data = await res.json();
    if (data.status !== "ok" || !data.items?.length) return; // garde les news fictives si ça échoue

    const liveNews = data.items.slice(0, 8).map((item) => ({
      tag: "anime",
      tagLabel: "Actu",
      date: formatRssDate(item.pubDate),
      title: item.title,
      excerpt: item.description
        ? item.description.replace(/<[^>]*>/g, "").slice(0, 100) + "…"
        : "",
      link: item.link,
    }));

    document.getElementById("newsRowHome").innerHTML = liveNews.map(newsCardHTML).join("");
  } catch (err) {
    console.error("Flux RSS indisponible, on garde les news par défaut :", err);
  }
}

const heroSlides = [
  { tag: "À LA UNE", title: "One Piece — Chapitre 1145", desc: "Le nouveau chapitre approche à grands pas. Découvre les dernières informations et théories de la communauté.", date: "2 juin", category: "Manga" },
  { tag: "TENDANCE", title: "Frieren : la saison 2 confirmée", desc: "Le studio Madhouse confirme la suite tant attendue de la série.", date: "28 mai", category: "Anime" },
  { tag: "NOUVEAU", title: "Solo Leveling : arc final en approche", desc: "Les scans des derniers chapitres commencent à circuler.", date: "26 mai", category: "Manga" },
];

const releases = [
  { title: "One Piece", ep: "Chapitre 1122", days: 2 },
  { title: "Blue Lock", ep: "Épisode 12", days: 5 },
  { title: "Kaiju No. 8", ep: "Épisode 6", days: 7 },
  { title: "Dandadan", ep: "Chapitre 9", days: 10 },
  { title: "Frieren", ep: "Épisode 25", days: 12 },
  { title: "Chainsaw Man", ep: "Épisode 4", days: 14 },
];

// ============================================
// RENDU DES CARTES
// ============================================
function animeCardHTML(t) {
  const coverStyle = t.cover ? ` style="background-image:url('${t.cover}')"` : "";
  return `
    <a class="anime-card" href="${t.link || "#"}" target="_blank" rel="noopener">
      <div class="anime-cover"${coverStyle}>
        ${t.cover ? "" : '<span class="placeholder">Jaquette</span>'}
        <span class="anime-score">★ ${t.score}</span>
      </div>
      <div class="anime-info">
        <p class="a-title">${t.title}</p>
        <p class="a-ep">${t.ep}</p>
      </div>
    </a>`;
}

function newsCardHTML(n) {
  return `
    <a class="news-card" href="${n.link || "#"}" target="_blank" rel="noopener">
      <div class="news-thumb">
        <span class="news-thumb-tag tag-${n.tag}">${n.tagLabel}</span>
      </div>
      <div class="news-body">
        <p class="news-date">${n.date}</p>
        <p class="news-title">${n.title}</p>
        <p class="news-excerpt">${n.excerpt}</p>
      </div>
    </a>`;
}

function upcomingItemHTML(r) {
  const isFar = r.days > 7;
  const thumbStyle = r.cover ? ` style="background-image:url('${r.cover}')"` : "";
  return `
    <a class="upcoming-item" href="${r.link || "#"}" target="_blank" rel="noopener">
      <div class="u-left">
        <div class="u-thumb"${thumbStyle}></div>
        <div>
          <p class="u-title">${r.title}</p>
          <p class="u-sub">${r.ep}</p>
        </div>
      </div>
      <span class="u-countdown ${isFar ? "is-far" : ""}">${r.days === 0 ? "AUJOURD'HUI" : r.days + " JOURS"}</span>
    </a>`;
}

// Remplissage
document.getElementById("trendingGridFull").innerHTML = trending.map(animeCardHTML).join("");
document.getElementById("newsRowHome").innerHTML = news.map(newsCardHTML).join("");
loadRealNews(); // remplace par les vraies actus dès que le flux répond

// ============================================
// ANILIST — tendances & calendrier des sorties en direct
// API publique, gratuite, sans clé nécessaire
// ============================================
const ANILIST_URL = "https://graphql.anilist.co";

async function anilistQuery(query, variables = {}) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function loadTrending() {
  const query = `
    query {
      Page(perPage: 8) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          title { romaji }
          coverImage { large }
          averageScore
          episodes
          nextAiringEpisode { episode }
          siteUrl
        }
      }
    }`;
  try {
    const data = await anilistQuery(query);
    const items = data?.data?.Page?.media;
    if (!items?.length) return; // garde les données fictives si ça échoue

    const liveTrending = items.map((m) => ({
      title: m.title.romaji,
      ep: m.nextAiringEpisode ? `Ép ${m.nextAiringEpisode.episode}` : m.episodes ? `${m.episodes} ép.` : "—",
      score: m.averageScore ? (m.averageScore / 10).toFixed(1) : "—",
      cover: m.coverImage?.large,
      link: m.siteUrl,
    }));

    document.getElementById("trendingGridFull").innerHTML = liveTrending.map(animeCardHTML).join("");
  } catch (err) {
    console.error("AniList tendances indisponible, on garde les données par défaut :", err);
  }
}

async function loadCalendar() {
  const now = Math.floor(Date.now() / 1000);
  const weekLater = now + 7 * 24 * 3600;
  const query = `
    query ($start: Int, $end: Int) {
      Page(perPage: 15) {
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
          episode
          airingAt
          media {
            title { romaji }
            coverImage { medium }
            siteUrl
            isAdult
          }
        }
      }
    }`;
  try {
    const data = await anilistQuery(query, { start: now, end: weekLater });
    let items = data?.data?.Page?.airingSchedules;
    if (!items?.length) return; // garde les données fictives si ça échoue

    items = items.filter((s) => !s.media.isAdult);

    const liveReleases = items.map((s) => ({
      title: s.media.title.romaji,
      ep: `Épisode ${s.episode}`,
      days: Math.max(0, Math.round((s.airingAt - now) / 86400)),
      cover: s.media.coverImage?.medium,
      link: s.media.siteUrl,
    }));

    document.getElementById("upcomingListHome").innerHTML = liveReleases.slice(0, 6).map(upcomingItemHTML).join("");
    const releaseListFull = document.getElementById("releaseListFull");
    if (releaseListFull) releaseListFull.innerHTML = liveReleases.map(upcomingItemHTML).join("");
  } catch (err) {
    console.error("AniList calendrier indisponible, on garde les données par défaut :", err);
  }
}

loadTrending();
loadCalendar();
document.getElementById("upcomingListHome").innerHTML = releases.map(upcomingItemHTML).join("");

const releaseListFull = document.getElementById("releaseListFull");
if (releaseListFull) releaseListFull.innerHTML = releases.map(upcomingItemHTML).join("");

// ============================================
// BANDE DE JOURS — 7 jours à partir d'aujourd'hui
// ============================================
const dayNames = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const dayStrip = document.getElementById("dayStrip");
const today = new Date();

let dayStripHTML = "";
for (let i = -1; i < 6; i++) {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  const isToday = i === 0;
  dayStripHTML += `
    <button class="day-btn ${isToday ? "is-active" : ""}">
      <span class="d-num">${d.getDate()}</span>
      <span class="d-name">${dayNames[d.getDay()]}</span>
    </button>`;
}
dayStrip.innerHTML = dayStripHTML;

dayStrip.querySelectorAll(".day-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    dayStrip.querySelectorAll(".day-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

// ============================================
// CARROUSEL HERO — change de slide toutes les 6s
// ============================================
const heroTag = document.getElementById("heroTag");
const heroTitle = document.getElementById("heroSlideTitle");
const heroDesc = document.getElementById("heroSlideDesc");
const heroDate = document.getElementById("heroDate");
const heroCategory = document.getElementById("heroCategory");
const heroDots = document.getElementById("heroDots");

let currentSlide = 0;

function renderHeroDots() {
  heroDots.innerHTML = heroSlides
    .map((_, i) => `<span class="hero-dot ${i === currentSlide ? "is-active" : ""}"></span>`)
    .join("");
}

function showSlide(index) {
  const s = heroSlides[index];
  heroTag.textContent = s.tag;
  heroTitle.textContent = s.title;
  heroDesc.textContent = s.desc;
  heroDate.textContent = s.date;
  heroCategory.textContent = s.category;
  currentSlide = index;
  renderHeroDots();
}

showSlide(0);
setInterval(() => {
  showSlide((currentSlide + 1) % heroSlides.length);
}, 6000);

// ============================================
// MENU MOBILE
// ============================================
const navToggle = document.getElementById("navToggle");
const navTabs = document.getElementById("navTabs");

navToggle.addEventListener("click", () => {
  const isOpen = navTabs.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

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
  navTabs.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelectorAll(".nav-tab").forEach((btn) => {
  btn.addEventListener("click", () => goToTab(btn.dataset.tab));
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => goToTab(btn.dataset.goto));
});

// ============================================
// MODALE CONNEXION / INSCRIPTION
// ============================================
const authModal = document.getElementById("authModal");

function openAuthModal(tab = "login") {
  authModal.classList.add("is-open");
  document.querySelectorAll(".modal-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.authtab === tab);
  });
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.toggle("is-active", form.id === `${tab}Form`);
  });
}

function closeAuthModal() {
  authModal.classList.remove("is-open");
}

document.getElementById("navAccountBtn").addEventListener("click", () => openAuthModal("login"));
document.getElementById("profilLoginBtn").addEventListener("click", () => openAuthModal("login"));
document.getElementById("modalClose").addEventListener("click", closeAuthModal);

authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && authModal.classList.contains("is-open")) closeAuthModal();
});

document.querySelectorAll(".modal-tab").forEach((btn) => {
  btn.addEventListener("click", () => openAuthModal(btn.dataset.authtab));
});
