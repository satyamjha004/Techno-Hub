      // ═══════════════════════════════════════════════
      // CHANNEL CONFIG
      // ═══════════════════════════════════════════════
      const CHANNEL_ID   = "UC5FJxrMbJs_YVg8A-bKcTNw";
      const CHANNEL_URL  = "https://www.youtube.com/@TechnoHub04";
      const CHANNEL_HANDLE = "@TechnoHub04";

      // ─── LIVE SUBSCRIBER COUNTER ───
      let currentCount = 1000;
      const ticker = document.getElementById("liveCount");
      const heroEl = document.getElementById("heroSubs");

      let startCount = 0;
      const heroEnd = 1000;
      const increment = Math.ceil(heroEnd / 60);
      const counter = setInterval(() => {
        startCount = Math.min(startCount + increment, heroEnd);
        heroEl.textContent = startCount.toLocaleString() + "+";
        if (startCount >= heroEnd) clearInterval(counter);
      }, 25);

      // ─── SCROLL REVEAL ───
      const revealEls = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add("visible"), i * 80);
            }
          });
        },
        { threshold: 0.1 }
      );
      revealEls.forEach((el) => observer.observe(el));

      // ─── BACK TO TOP ───
      window.addEventListener("scroll", () => {
        const bt = document.getElementById("backTop");
        bt.classList.toggle("visible", window.scrollY > 400);
      });

      // ─── THEME MODAL ───
      function toggleThemeModal() {
        document.getElementById("themeOverlay").classList.toggle("open");
      }
      function closeThemeOverlay(e) {
        if (e.target === document.getElementById("themeOverlay")) toggleThemeModal();
      }
      function applyTheme(name, clickedEl) {
        const themes = {
          cyber: { accent: "#00D4FF", accent2: "#FF2D6E", accent3: "#7B2FFF" },
          neon:  { accent: "#FF2D6E", accent2: "#FF6B35", accent3: "#FF2D6E" },
          deep:  { accent: "#7B2FFF", accent2: "#00D4FF", accent3: "#7B2FFF" },
          green: { accent: "#00FF88", accent2: "#00CCAA", accent3: "#00CCAA" },
        };
        const t = themes[name]; if (!t) return;
        const r = document.documentElement;
        r.style.setProperty("--accent",  t.accent);
        r.style.setProperty("--accent2", t.accent2);
        r.style.setProperty("--accent3", t.accent3);
        r.style.setProperty("--border", `rgba(${hexToRgb(t.accent)},0.15)`);
        r.style.setProperty("--glow",  `0 0 30px rgba(${hexToRgb(t.accent)},0.3)`);
        r.style.setProperty("--glow2", `0 0 30px rgba(${hexToRgb(t.accent2)},0.3)`);
        document.querySelectorAll(".modal-theme-opt").forEach(o => o.classList.remove("active"));
        document.getElementById("mopt-" + name)?.classList.add("active");
        document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
        document.querySelector(".t" + (Object.keys(themes).indexOf(name) + 1))?.classList.add("active");
        document.getElementById("themeOverlay").classList.remove("open");
      }
      function hexToRgb(hex) {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "0,212,255";
      }
      function setTheme(theme, card) {
        applyTheme({ cyber:"cyber", neon:"neon", deep:"deep" }[theme] || "cyber", card);
      }

      // ─── SEND MESSAGE ───
      function sendMessage() {
        const btn = document.querySelector(".btn-send");
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = "linear-gradient(135deg, #00C48C, #00D4FF)";
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.style.background = "";
        }, 3000);
      }

      // ─── MOBILE DRAWER ───
      function toggleMenu() {
        const ham = document.querySelector(".hamburger");
        const links = document.querySelector(".nav-links");
        if (!links) return;
        const isOpen = links.classList.contains("drawer-open");
        if (isOpen) {
          links.classList.remove("drawer-open");
          ham.classList.remove("open");
          links.removeAttribute("style");
        } else {
          links.classList.add("drawer-open");
          ham.classList.add("open");
          Object.assign(links.style, {
            display: "flex", flexDirection: "column", gap: "0.25rem",
            position: "absolute", top: "70px", left: "0", right: "0",
            background: "rgba(5,10,20,0.97)", backdropFilter: "blur(20px)",
            padding: "1.25rem 1.5rem 1.5rem",
            borderBottom: "1px solid rgba(0,212,255,0.15)", zIndex: "999",
          });
          links.querySelectorAll("a").forEach(a => {
            a.style.padding = "10px 12px";
            a.style.borderRadius = "8px";
            a.onclick = () => toggleMenu();
          });
        }
      }
      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
          const links = document.querySelector(".nav-links");
          if (links) { links.removeAttribute("style"); links.classList.remove("drawer-open"); }
          document.querySelector(".hamburger")?.classList.remove("open");
        }
      });

      // ═══════════════════════════════════════════════
      // YOUTUBE VIDEO LOADER
      // ═══════════════════════════════════════════════
      const YT_CHANNEL = CHANNEL_ID;
      let allVideos   = [];
      let currentFilter = "all";
      let nextPageToken = "";
      let apiKey = localStorage.getItem("yt_api_key") || "";

      function formatViews(n) {
        if (!n) return "—";
        n = parseInt(n);
        if (n >= 1000000) return (n/1000000).toFixed(1) + "M";
        if (n >= 1000) return (n/1000).toFixed(1) + "K";
        return n.toString();
      }
      function timeAgo(iso) {
        const diff = (Date.now() - new Date(iso)) / 1000;
        if (diff < 3600)    return Math.floor(diff/60) + " min ago";
        if (diff < 86400)   return Math.floor(diff/3600) + " hours ago";
        if (diff < 604800)  return Math.floor(diff/86400) + " days ago";
        if (diff < 2592000) return Math.floor(diff/604800) + " weeks ago";
        if (diff < 31536000)return Math.floor(diff/2592000) + " months ago";
        return Math.floor(diff/31536000) + " years ago";
      }
      function isShort(v) {
        // YouTube Shorts are vertical (aspect < 1) and typically ≤60s
        // We detect by title keywords or duration
        const title = (v.snippet?.title || "").toLowerCase();
        if (title.includes("#shorts") || title.includes("shorts")) return true;
        const dur = v.contentDetails?.duration || "";
        // Parse ISO 8601 duration: PT1M30S
        const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (m) {
          const h = parseInt(m[1]||0), mn = parseInt(m[2]||0), s = parseInt(m[3]||0);
          const total = h*3600 + mn*60 + s;
          if (total <= 60) return true;
        }
        return false;
      }
      function parseDuration(dur) {
        const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return "";
        const h = parseInt(m[1]||0), mn = parseInt(m[2]||0), s = parseInt(m[3]||0);
        if (h > 0) return `${h}:${String(mn).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
        return `${mn}:${String(s).padStart(2,"0")}`;
      }

      function renderVideoCard(v, idx) {
        const vid = v.id;
        const title = v.snippet?.title || "Untitled";
        const thumb = v.snippet?.thumbnails?.medium?.url ||
                      v.snippet?.thumbnails?.default?.url || "";
        const views = formatViews(v.statistics?.viewCount);
        const ago   = timeAgo(v.snippet?.publishedAt || "");
        const dur   = parseDuration(v.contentDetails?.duration || "");
        const short = isShort(v);
        const colors = ["#0d1b3e,#1a3a6e","#1a0d3e,#3a1a6e","#0d2e1a,#1a6e3a",
                        "#3e1a0d,#6e3a1a","#0d2e3e,#1a5a6e","#3e0d2e,#6e1a5a"];
        const bg = colors[idx % colors.length];

        return `
          <div class="video-card" data-cat="${short ? 'shorts' : 'long'}" data-title="${title.toLowerCase()}"
               onclick="window.open('https://www.youtube.com/watch?v=${vid}','_blank')"
               style="cursor:pointer;">
            <div class="video-thumb">
              ${thumb
                ? `<img src="${thumb}" alt="${title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
                : `<div class="thumb-bg" style="background:linear-gradient(135deg,${bg});width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">📱</div>`
              }
              ${idx === 0 ? '<span class="video-badge badge-new">New</span>' : ''}
              ${short ? '<span class="video-badge badge-trending" style="top:8px;left:8px;">Short</span>' : ''}
              <div class="play-btn">
                <div class="play-icon"><i class="fas fa-play"></i></div>
              </div>
              ${dur ? `<div class="video-duration">${dur}</div>` : ""}
            </div>
            <div class="video-info">
              <div class="video-title">${title}</div>
              <div class="video-meta">
                <span><i class="fas fa-eye"></i> ${views} views</span>
                <span><i class="fas fa-clock"></i> ${ago}</span>
              </div>
            </div>
          </div>`;
      }

      function showVideos() {
        const grid = document.getElementById("videosGrid");
        const filtered = currentFilter === "all"
          ? allVideos
          : allVideos.filter(v => currentFilter === "shorts" ? isShort(v) : !isShort(v));
        grid.innerHTML = filtered.map((v, i) => renderVideoCard(v, i)).join("");
        grid.style.display = filtered.length ? "grid" : "none";
        document.getElementById("loadMoreWrap").style.display =
          nextPageToken && currentFilter === "all" ? "block" : "none";
      }

      function filterVideos(cat, btn) {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = cat;
        showVideos();
      }

      // Search
      document.getElementById("searchInput").addEventListener("input", function() {
        const q = this.value.toLowerCase().trim();
        document.querySelectorAll("#videosGrid .video-card").forEach(card => {
          const show = !q || card.dataset.title.includes(q);
          card.style.display = show ? "block" : "none";
        });
      });

      async function fetchVideos(pageToken = "") {
        if (!apiKey) { showError(); return; }
        try {
          // 1. Get uploads playlist ID
          let playlistId = sessionStorage.getItem("yt_playlist");
          if (!playlistId) {
            const chRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YT_CHANNEL}&key=${apiKey}`
            );
            const chData = await chRes.json();
            if (chData.error) throw new Error(chData.error.message);
            playlistId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
            if (!playlistId) throw new Error("Channel not found");
            sessionStorage.setItem("yt_playlist", playlistId);
          }

          // 2. Get video IDs from playlist
          const plRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=12&key=${apiKey}${pageToken ? "&pageToken="+pageToken : ""}`
          );
          const plData = await plRes.json();
          if (plData.error) throw new Error(plData.error.message);
          nextPageToken = plData.nextPageToken || "";
          const ids = plData.items.map(i => i.snippet.resourceId.videoId).join(",");

          // 3. Get full video details (stats, duration)
          const vRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${apiKey}`
          );
          const vData = await vRes.json();
          if (vData.error) throw new Error(vData.error.message);

          if (pageToken) {
            allVideos = [...allVideos, ...vData.items];
          } else {
            allVideos = vData.items;
          }

          document.getElementById("videosLoading").style.display = "none";
          document.getElementById("videosError").style.display = "none";
          document.getElementById("videosGrid").style.display = "grid";
          showVideos();
        } catch(err) {
          console.error("YouTube API error:", err);
          showError();
        }
      }

      function showError() {
        document.getElementById("videosLoading").style.display = "none";
        document.getElementById("videosGrid").style.display = "none";
        document.getElementById("videosError").style.display = "block";
        document.getElementById("loadMoreWrap").style.display = "none";
      }

      function saveApiKey() {
        const key = document.getElementById("apiKeyInput").value.trim();
        if (!key) return;
        apiKey = key;
        localStorage.setItem("yt_api_key", key);
        document.getElementById("videosError").style.display = "none";
        document.getElementById("videosLoading").style.display = "block";
        sessionStorage.removeItem("yt_playlist");
        allVideos = [];
        fetchVideos();
      }

      function loadMoreVideos() {
        if (nextPageToken) fetchVideos(nextPageToken);
      }

      // ─── SUBSCRIBE button → opens channel ───
      function handleSubscribe() {
        window.open(CHANNEL_URL, "_blank");
      }

      // Auto-load if API key saved
      window.addEventListener("DOMContentLoaded", () => {
        if (apiKey) {
          fetchVideos();
        } else {
          showError();
        }
      });
