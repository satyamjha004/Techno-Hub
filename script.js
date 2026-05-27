/* ═══════════════════════════════════════════════
   TECHNOHUB — COMPLETE SCRIPT
   Features: Live Subs, Video Slider, Dark/Night
═══════════════════════════════════════════════ */

const CHANNEL_ID = "UC5FJxrMbJs_YVg8A-bKcTNw";
const CHANNEL_URL = "https://www.youtube.com/@TechnoHub04";
const YT_API_KEY = "AIzaSyAc810O-MDR18NzQX5umB3oShtsOr59Yw8";

/* ─── PAGE LOADER ─── */
(function () {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;
  document.body.style.overflow = "hidden";
  const start = Date.now();
  function hide() {
    const wait = Math.max(0, 2200 - (Date.now() - start));
    setTimeout(() => {
      loader.classList.add("loaded");
      document.body.style.overflow = "";
    }, wait);
  }
  if (document.readyState === "complete") hide();
  else {
    window.addEventListener("load", hide);
    setTimeout(() => {
      loader.classList.add("loaded");
      document.body.style.overflow = "";
    }, 4500);
  }
})();

/* ─── DARK / NIGHT MODE TOGGLE ─── */
(function initMode() {
  const saved = localStorage.getItem("th_mode") || "dark";
  if (saved === "night") applyNightMode(true, false);
})();

function toggleMode() {
  const isNight = !document.body.classList.contains("night-mode");
  applyNightMode(isNight, true);
}

function applyNightMode(on, save) {
  document.body.classList.toggle("night-mode", on);
  const icon = document.getElementById("modeIcon");
  const iconS = document.getElementById("modeIconSun");
  const label = document.getElementById("modeLabel");
  const thumb = document.getElementById("modePillThumb");
  if (icon) icon.style.opacity = on ? "0.3" : "1";
  if (iconS) iconS.style.opacity = on ? "1" : "0.3";
  if (label) label.textContent = on ? "Night" : "Dark";
  if (save) localStorage.setItem("th_mode", on ? "night" : "dark");
}

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting)
        setTimeout(() => e.target.classList.add("visible"), i * 80);
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ─── NAV SCROLL + ACTIVE LINK ─── */
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
  const secs = [
    "hero",
    "videos",
    "features",
    "about",
    "team",
    "membership",
    "contact",
  ];
  let cur = "";
  secs.forEach((id) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) cur = id;
  });
  document
    .querySelectorAll(".nav-links a")
    .forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + cur),
    );
  const bt = document.getElementById("backTop");
  if (bt) bt.classList.toggle("visible", window.scrollY > 400);
});

/* ─── MOBILE MENU ─── */
function toggleMenu() {
  const ham = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  if (!links) return;
  const open = links.classList.contains("drawer-open");
  if (open) {
    links.classList.remove("drawer-open");
    ham.classList.remove("open");
    links.removeAttribute("style");
  } else {
    links.classList.add("drawer-open");
    ham.classList.add("open");
    Object.assign(links.style, {
      display: "flex",
      flexDirection: "column",
      gap: ".25rem",
      position: "absolute",
      top: "70px",
      left: "0",
      right: "0",
      background: "rgba(5,10,20,0.97)",
      backdropFilter: "blur(20px)",
      padding: "1.25rem 1.5rem 1.5rem",
      borderBottom: "1px solid rgba(0,212,255,0.12)",
      zIndex: "999",
    });
    links.querySelectorAll("a").forEach((a) => {
      a.style.padding = "10px 12px";
      a.style.borderRadius = "8px";
      a.onclick = () => toggleMenu();
    });
  }
}
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    const links = document.querySelector(".nav-links");
    if (links) {
      links.removeAttribute("style");
      links.classList.remove("drawer-open");
    }
    document.querySelector(".hamburger")?.classList.remove("open");
  }
});

/* ─── SEARCH ─── */
const searchInputEl = document.getElementById("searchInput");
const searchBarWrapEl = document.getElementById("searchBarWrap");
if (searchInputEl && searchBarWrapEl) {
  searchInputEl.addEventListener("input", function () {
    searchBarWrapEl.classList.toggle("has-text", this.value.length > 0);
    doSearch(this.value);
  });
}
function doSearch(val) {
  const q = val.toLowerCase().trim();
  document.querySelectorAll("#videosGrid .video-card").forEach((c) => {
    c.style.display = !q || c.dataset.title.includes(q) ? "" : "none";
  });
  if (slider.ready) setTimeout(updateSlider, 50);
}
function clearSearch() {
  const inp = document.getElementById("searchInput");
  if (inp) {
    inp.value = "";
    inp.dispatchEvent(new Event("input"));
    inp.focus();
  }
}
function toggleSearchBar() {
  document.getElementById("searchInput")?.focus();
}
function toggleSearchMobile() {
  const bar = document.getElementById("mobileSearchBar");
  if (!bar) return;
  const open = bar.classList.contains("open");
  if (open) {
    bar.classList.remove("open");
    setTimeout(() => (bar.style.display = ""), 300);
  } else {
    bar.style.display = "flex";
    requestAnimationFrame(() => bar.classList.add("open"));
    const inp = document.getElementById("searchInputMob");
    if (inp) {
      inp.focus();
      inp.addEventListener("input", function () {
        doSearch(this.value);
        const di = document.getElementById("searchInput");
        if (di) di.value = this.value;
      });
    }
  }
}

/* ─── TEAM 3D TILT ─── */
document.querySelectorAll(".team-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.transform = `translateY(-6px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -12}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 12}deg)`;
  });
  card.addEventListener("mouseleave", () => (card.style.transform = ""));
});

/* ═══════════════════════════════════════════════
   LIVE SUBSCRIBER COUNT (via YouTube API)
═══════════════════════════════════════════════ */
async function fetchLiveStats() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YT_API_KEY}`,
    );
    const data = await res.json();
    const stats = data.items?.[0]?.statistics;
    if (!stats) return;

    const subs = parseInt(stats.subscriberCount || 0);
    const views = parseInt(stats.viewCount || 0);
    const vids = parseInt(stats.videoCount || 0);

    // Animate hero stats
    animCount("heroSubs", subs, formatSubs(subs));
    animCount("heroViews", views, formatViews(views));
    animCount("heroVids", vids, vids.toString());

    // Live ticker
    const liveEl = document.getElementById("liveCount");
    if (liveEl) liveEl.textContent = subs.toLocaleString("en-IN");

    // About subs
    const aboutEl = document.getElementById("aboutSubs");
    if (aboutEl) aboutEl.textContent = formatSubs(subs);

    // Footer
    const footerEl = document.getElementById("footerSubs");
    if (footerEl) footerEl.textContent = subs.toLocaleString("en-IN");

    // Refresh every 60 seconds for "live" feel
    setTimeout(fetchLiveStats, 60000);
  } catch (e) {
    console.warn("Stats fetch failed:", e);
    // Fallback static values
    ["heroSubs", "liveCount", "aboutSubs"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.textContent === "—") el.textContent = "8,000+";
    });
    const fv = document.getElementById("heroViews");
    if (fv) fv.textContent = "3M+";
    const fvid = document.getElementById("heroVids");
    if (fvid) fvid.textContent = "150+";
    const fl = document.getElementById("footerSubs");
    if (fl && fl.textContent === "—") fl.textContent = "8,000+";
  }
}

function formatSubs(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M+";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K+";
  return n.toString();
}
function formatViews(n) {
  if (!n) return "—";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M+";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K+";
  return n.toString();
}
function animCount(id, end, finalText) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const steps = 50;
  const step = end / steps;
  const t = setInterval(() => {
    cur = Math.min(cur + step, end);
    el.textContent = Math.floor(cur).toLocaleString("en-IN");
    if (cur >= end) {
      clearInterval(t);
      el.textContent = finalText;
    }
  }, 30);
}

/* ═══════════════════════════════════════════════
   VIDEO SLIDER ENGINE
═══════════════════════════════════════════════ */
const slider = {
  ready: false,
  index: 0,
  cardW: 0,
  gap: 20,
  visible: 3,
  total: 0,
  _drag: false,
};

function getVisible() {
  const w = window.innerWidth;
  if (w < 500) return 1;
  if (w < 800) return 2;
  return 3;
}

function updateSlider() {
  const track = document.getElementById("videosGrid");
  const vp = document.getElementById("sliderViewport");
  const prev = document.getElementById("sliderPrev");
  const next = document.getElementById("sliderNext");
  const dots = document.getElementById("sliderDots");
  if (!track || !vp) return;

  const cards = Array.from(track.querySelectorAll(".video-card")).filter(
    (c) => c.style.display !== "none",
  );
  slider.total = cards.length;
  slider.visible = getVisible();
  const vpW = vp.offsetWidth;
  slider.cardW = (vpW - (slider.visible - 1) * slider.gap) / slider.visible;

  cards.forEach((c) => {
    c.style.flex = `0 0 ${slider.cardW}px`;
  });

  const maxIdx = Math.max(0, slider.total - slider.visible);
  slider.index = Math.min(slider.index, maxIdx);
  track.style.transform = `translateX(-${slider.index * (slider.cardW + slider.gap)}px)`;

  if (prev) prev.disabled = slider.index === 0;
  if (next) next.disabled = slider.index >= maxIdx;

  if (dots) {
    dots.innerHTML = "";
    for (let i = 0; i <= maxIdx; i++) {
      const d = document.createElement("button");
      d.className = "sdot" + (i === slider.index ? " active" : "");
      d.onclick = () => {
        slider.index = i;
        updateSlider();
      };
      dots.appendChild(d);
    }
  }
}

function slideMove(dir) {
  const track = document.getElementById("videosGrid");
  if (!track) return;
  const cards = Array.from(track.querySelectorAll(".video-card")).filter(
    (c) => c.style.display !== "none",
  );
  const maxIdx = Math.max(0, cards.length - slider.visible);
  slider.index = Math.max(0, Math.min(slider.index + dir, maxIdx));
  updateSlider();
}

function initDragSlider() {
  const vp = document.getElementById("sliderViewport");
  if (!vp || slider._drag) return;
  slider._drag = true;
  let startX = 0,
    moved = false,
    dragging = false;

  vp.addEventListener("mousedown", (e) => {
    dragging = true;
    moved = false;
    startX = e.clientX;
    vp.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 5) moved = true;
  });
  window.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    vp.style.cursor = "grab";
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) slideMove(dx < 0 ? 1 : -1);
  });
  vp.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    },
    true,
  );

  // Touch
  let tx = 0;
  vp.addEventListener(
    "touchstart",
    (e) => {
      tx = e.touches[0].clientX;
    },
    { passive: true },
  );
  vp.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) slideMove(dx < 0 ? 1 : -1);
  });
}

// Auto-slide every 5s
setInterval(() => {
  if (!slider.ready) return;
  const track = document.getElementById("videosGrid");
  if (!track) return;
  const cards = Array.from(track.querySelectorAll(".video-card")).filter(
    (c) => c.style.display !== "none",
  );
  const maxIdx = Math.max(0, cards.length - slider.visible);
  slider.index = slider.index >= maxIdx ? 0 : slider.index + 1;
  updateSlider();
}, 5000);

window.addEventListener("resize", () => {
  if (slider.ready) updateSlider();
});

/* ═══════════════════════════════════════════════
   YOUTUBE VIDEO FETCHER
═══════════════════════════════════════════════ */
let allVideos = [],
  currentFilter = "all",
  nextPageToken = "";

function parseDuration(dur) {
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] || 0),
    mn = parseInt(m[2] || 0),
    s = parseInt(m[3] || 0);
  return h > 0
    ? `${h}:${String(mn).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${mn}:${String(s).padStart(2, "0")}`;
}
function isShort(v) {
  const title = (v.snippet?.title || "").toLowerCase();
  if (title.includes("#shorts") || title.includes("shorts")) return true;
  const m = (v.contentDetails?.duration || "").match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/,
  );
  if (m) {
    const total =
      parseInt(m[1] || 0) * 3600 +
      parseInt(m[2] || 0) * 60 +
      parseInt(m[3] || 0);
    if (total <= 60) return true;
  }
  return false;
}
function timeAgo(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return Math.floor(d / 60) + "m ago";
  if (d < 86400) return Math.floor(d / 3600) + "h ago";
  if (d < 604800) return Math.floor(d / 86400) + "d ago";
  if (d < 2592000) return Math.floor(d / 604800) + "w ago";
  if (d < 31536000) return Math.floor(d / 2592000) + " months ago";
  return Math.floor(d / 31536000) + "y ago";
}

function renderCard(v, idx) {
  const vid = v.id;
  const title = (v.snippet?.title || "Untitled").replace(/"/g, "&quot;");
  const thumb =
    v.snippet?.thumbnails?.maxres?.url ||
    v.snippet?.thumbnails?.high?.url ||
    v.snippet?.thumbnails?.medium?.url ||
    v.snippet?.thumbnails?.default?.url ||
    "";
  const views = formatViews(v.statistics?.viewCount);
  const likes = formatViews(v.statistics?.likeCount);
  const ago = timeAgo(v.snippet?.publishedAt || "");
  const dur = parseDuration(v.contentDetails?.duration || "");
  const short = isShort(v);
  const isNew = idx === 0;
  const isHot = parseInt(v.statistics?.viewCount || 0) > 50000;

  return `
<div class="video-card" data-cat="${short ? "shorts" : "long"}" data-title="${title.toLowerCase()}"
     onclick="window.open('https://www.youtube.com/watch?v=${vid}','_blank')">
  <div class="video-thumb">
    ${thumb ? `<img src="${thumb}" alt="${title}" loading="lazy">` : `<div class="thumb-placeholder"><i class="fab fa-youtube"></i></div>`}
    <div class="thumb-overlay"></div>
    <div class="video-badges">
      ${isNew ? `<span class="vbadge vbadge--new"><i class="fas fa-bolt"></i> NEW</span>` : ""}
      ${short ? `<span class="vbadge vbadge--short"><i class="fas fa-film"></i> SHORT</span>` : ""}
      ${isHot && !isNew ? `<span class="vbadge vbadge--hot"><i class="fas fa-fire"></i> HOT</span>` : ""}
    </div>
    ${dur ? `<div class="video-duration">${dur}</div>` : ""}
    <div class="play-ripple"><div class="play-ripple__ring"></div><div class="play-ripple__btn"><i class="fas fa-play"></i></div></div>
    <div class="thumb-hover-info">
      <div class="thi-stat"><i class="fas fa-eye"></i> ${views}</div>
      <div class="thi-stat"><i class="fas fa-thumbs-up"></i> ${likes}</div>
    </div>
  </div>
  <div class="video-info">
    <div class="video-title">${title}</div>
    <div class="video-meta">
      <span><i class="fas fa-clock"></i> ${ago}</span>
      <span><i class="fas fa-eye"></i> ${views}</span>
    </div>
    <div class="video-progress-bar"><div class="video-progress-fill" style="width:${Math.floor(Math.random() * 50 + 20)}%"></div></div>
  </div>
</div>`;
}

function showVideos() {
  const grid = document.getElementById("videosGrid");
  const sec = document.getElementById("sliderSection");
  if (!grid || !sec) return;
  const filtered =
    currentFilter === "all"
      ? allVideos
      : allVideos.filter((v) =>
          currentFilter === "shorts" ? isShort(v) : !isShort(v),
        );
  grid.innerHTML = filtered.map((v, i) => renderCard(v, i)).join("");
  if (filtered.length > 0) {
    sec.style.display = "block";
    document.getElementById("loadMoreWrap").style.display = "block";
    slider.index = 0;
    slider.ready = true;
    setTimeout(() => {
      updateSlider();
      initDragSlider();
    }, 100);
  } else {
    sec.style.display = "none";
  }
}

function filterVideos(cat, btn) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = cat;
  slider.index = 0;
  showVideos();
}

async function fetchVideos(pageToken = "") {
  try {
    let pid = sessionStorage.getItem("yt_playlist");
    if (!pid) {
      const cd = await (
        await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YT_API_KEY}`,
        )
      ).json();
      if (cd.error) throw new Error(cd.error.message);
      pid = cd.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!pid) throw new Error("Channel not found");
      sessionStorage.setItem("yt_playlist", pid);
    }
    const pd = await (
      await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${pid}&maxResults=12&key=${YT_API_KEY}${pageToken ? "&pageToken=" + pageToken : ""}`,
      )
    ).json();
    if (pd.error) throw new Error(pd.error.message);
    nextPageToken = pd.nextPageToken || "";
    const ids = pd.items.map((i) => i.snippet.resourceId.videoId).join(",");
    const vd = await (
      await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${YT_API_KEY}`,
      )
    ).json();
    if (vd.error) throw new Error(vd.error.message);
    allVideos = pageToken ? [...allVideos, ...vd.items] : vd.items;
    document.getElementById("videosLoading").style.display = "none";
    showVideos();
  } catch (err) {
    console.error("YT API:", err);
    document.getElementById("videosLoading").innerHTML = `
      <div style="text-align:center;padding:2rem;">
        <i class="fab fa-youtube" style="font-size:2.5rem;color:var(--accent2);display:block;margin-bottom:1rem;"></i>
        <p style="color:var(--text-muted);margin-bottom:1rem;">Could not load videos.</p>
        <a href="${CHANNEL_URL}/videos" target="_blank" style="color:var(--accent);text-decoration:none;">Watch on YouTube →</a>
      </div>`;
  }
}

function loadMoreVideos() {
  if (nextPageToken) fetchVideos(nextPageToken);
}

/* ─── RAZORPAY ─── */
const RAZORPAY_KEY = "rzp_live_SrgPaCgJcPReQO";
function payWithRazorpay(amount, planName) {
  const rzp = new Razorpay({
    key: RAZORPAY_KEY,
    amount: amount * 100,
    currency: "INR",
    name: "TechnoHub",
    description: planName + " Membership",
    handler: (r) => showPaySuccess(planName, r.razorpay_payment_id),
    theme: { color: "#00D4FF" },
  });
  rzp.on("payment.failed", (r) =>
    alert("Payment failed: " + r.error.description),
  );
  rzp.open();
}
function showPaySuccess(plan, pid) {
  const ov = document.createElement("div");
  ov.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);";
  ov.innerHTML = `<div style="background:linear-gradient(135deg,#0a1628,#0d1f3c);border:1px solid rgba(0,212,255,0.3);border-radius:24px;padding:3rem;max-width:420px;width:90%;text-align:center;"><div style="width:70px;height:70px;background:linear-gradient(135deg,#00D4FF,#7B2FFF);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 1.5rem;">✅</div><h3 style="color:#fff;font-size:1.5rem;margin-bottom:.5rem;">Payment Successful!</h3><p style="color:rgba(255,255,255,.7);margin-bottom:1rem;">Welcome to <strong style="color:#00D4FF;">${plan}</strong>! 🎉</p><p style="font-size:.75rem;color:rgba(255,255,255,.4);margin-bottom:1.5rem;">ID: ${pid}</p><button onclick="this.closest('div[style*=fixed]').remove()" style="background:linear-gradient(135deg,#00D4FF,#7B2FFF);border:none;border-radius:30px;padding:12px 32px;color:#000;font-weight:800;cursor:pointer;">Explore →</button></div>`;
  document.body.appendChild(ov);
  ov.addEventListener("click", (e) => {
    if (e.target === ov) ov.remove();
  });
}
function handleSubscribe() {
  window.open(CHANNEL_URL, "_blank");
}

/* ─── CONTACT FORM ─── */
function sendMessage() {
  const btn = document.querySelector(".btn-send");
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = "linear-gradient(135deg,#00C48C,#00D4FF)";
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = "";
  }, 3000);
}

/* ─── NEWSLETTER ─── */
function subscribeNewsletter() {
  const name = document.getElementById("nlName").value.trim();
  const email = document.getElementById("nlEmail").value.trim();
  if (!name) {
    showNlError("Please enter your name");
    return;
  }
  if (!email || !email.includes("@")) {
    showNlError("Please enter a valid email");
    return;
  }
  document.getElementById("nlForm").style.display = "none";
  document.getElementById("nlSuccess").style.display = "block";
}
function showNlError(msg) {
  let e = document.getElementById("nlError");
  if (!e) {
    e = document.createElement("p");
    e.id = "nlError";
    e.style.cssText =
      "color:#FF2D6E;font-size:.8rem;margin:0;text-align:center;";
    document.getElementById("nlForm").appendChild(e);
  }
  e.textContent = "⚠️ " + msg;
  setTimeout(() => {
    if (e) e.textContent = "";
  }, 3000);
}

/* ─── OLD THEME FUNCS (compat) ─── */
function toggleThemeModal() {}
function closeThemeOverlay() {}
function applyTheme() {}
function setTheme() {}
function hexToRgb(h) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return r
    ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`
    : "0,212,255";
}

/* ─── BOOT ─── */
window.addEventListener("DOMContentLoaded", () => {
  // Load videos
  document.getElementById("videosLoading").style.display = "block";
  fetchVideos();
  // Load live stats
  fetchLiveStats();
});

/* ===== NEWSLETTER DATA =====
All newsletter users are stored in browser localStorage.
Open browser console and type:
JSON.parse(localStorage.getItem("technohub_newsletter"))

You can later connect this with Firebase, MongoDB,
Google Sheets or a backend API to store real users online.
================================ */

/* ===== GOOGLE SHEETS NEWSLETTER INTEGRATION ===== */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby_i2xZwiDlJN1VQcaF4UJpsJI0KdgRDlp74gLyHLiuozDX8jNdM7gPkzzDIJgXhcfR/exec";

document.addEventListener("DOMContentLoaded", () => {
  const newsletterForm = document.querySelector("#newsletterForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = newsletterForm.querySelector("input[name='name']").value;
      const email = newsletterForm.querySelector("input[name='email']").value;

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            date: new Date().toLocaleString(),
          }),
        });

        alert("Newsletter Joined Successfully!");
        newsletterForm.reset();
      } catch (error) {
        console.error(error);
        alert("Something went wrong!");
      }
    });
  }
});

/*
===========================================
GOOGLE SHEETS SETUP

1. Open Google Sheets
2. Extensions > Apps Script
3. Paste this code:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.name,
    data.email,
    data.date
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({result: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

4. Click Deploy > New Deployment
5. Select "Web App"
6. Access: Anyone
7. Copy Web App URL
8. Paste URL inside GOOGLE_SCRIPT_URL

===========================================
*/
/* ═══════════════════════════════════════════════
   NEWSLETTER GOOGLE SHEET CONNECT
═══════════════════════════════════════════════ */

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const msg = document.getElementById("msg");

    msg.innerHTML = "Sending...";

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwJHhu6iaaN1sIXGyK8L_8H9vKc7Ps9gVpW4J6S94SyveB6n2FU8tyfVgHxTcrPfuTl/exec",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            email: email,
          }),
        },
      );

      const data = await response.json();

      if (data.result === "success") {
        msg.innerHTML = "Subscribed Successfully!";

        newsletterForm.reset();
      } else {
        msg.innerHTML = "Something went wrong";
      }
    } catch (error) {
      console.log(error);

      msg.innerHTML = "Error sending data";
    }
  });
}
