document.addEventListener("DOMContentLoaded", () => {
  let bgAudio = null;
  let clickAudio = null;
  let isMusicPlaying = false;

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // 1. APPLY CUSTOM THEME & BACKGROUND FROM JSON
      if (data.theme) {
        const root = document.documentElement;
        if (data.theme.cardBg) root.style.setProperty("--card-bg", data.theme.cardBg);
        if (data.theme.textMain) root.style.setProperty("--text-main", data.theme.textMain);
        if (data.theme.textSub) root.style.setProperty("--text-sub", data.theme.textSub);
        if (data.theme.accent) root.style.setProperty("--accent", data.theme.accent);
        if (data.theme.btnBg) root.style.setProperty("--btn-bg", data.theme.btnBg);

        if (data.theme.backgroundImage) {
          document.body.style.backgroundImage = `url('${data.theme.backgroundImage}')`;
        }
      }

      // 2. SETUP AUDIO (Music + SFX)
      if (data.audio) {
        if (data.audio.bgMusic) {
          bgAudio = new Audio(data.audio.bgMusic);
          bgAudio.loop = true;
          bgAudio.volume = 0.4; // 40% volume for comfortable background listening
        }

        if (data.audio.clickSound) {
          clickAudio = new Audio(data.audio.clickSound);
          clickAudio.volume = 0.6;
        }
      }

      const musicBtn = document.getElementById("music-btn");
      const musicStatus = document.getElementById("music-status");

      // Function to play click SFX
      const playClickSFX = () => {
        if (clickAudio) {
          clickAudio.currentTime = 0;
          clickAudio.play().catch(() => {});
        }
      };

      // Toggle Music Button
      musicBtn.addEventListener("click", () => {
        playClickSFX();
        if (!bgAudio) return;

        if (isMusicPlaying) {
          bgAudio.pause();
          musicStatus.textContent = "OFF";
          isMusicPlaying = false;
        } else {
          bgAudio.play().then(() => {
            musicStatus.textContent = "ON 🎵";
            isMusicPlaying = true;
          }).catch(() => {
            alert("Please interact with the page first so browser allows audio playback!");
          });
        }
      });

      // Auto-start music on first user interaction anywhere on page
      const startAudioOnFirstClick = () => {
        if (bgAudio && !isMusicPlaying) {
          bgAudio.play().then(() => {
            musicStatus.textContent = "ON 🎵";
            isMusicPlaying = true;
          }).catch(() => {});
        }
        document.removeEventListener("click", startAudioOnFirstClick);
      };
      document.addEventListener("click", startAudioOnFirstClick);

      // 3. SET PROFILE HEADER
      document.getElementById("name").textContent = data.name;
      document.getElementById("handle").textContent = data.handle;
      document.getElementById("status").textContent = data.status;
      document.getElementById("bio").textContent = data.bio;
      document.getElementById("avatar").src = data.avatar;

      // Helper for Google Favicons
      const getFaviconUrl = (pageUrl) => {
        try {
          const domain = new URL(pageUrl).hostname;
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch (e) {
          return "";
        }
      };

      // 4. RENDER UNIFIED LINKS LIST
      const linksContainer = document.getElementById("links-container");
      
      data.links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.url;
        a.className = "link-button";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const faviconSrc = getFaviconUrl(link.url);

        a.innerHTML = `
          <div class="link-content">
            <img src="${faviconSrc}" alt="icon" class="link-favicon">
            <div class="link-text">
              <span class="link-title">${link.title}</span>
              ${link.description ? `<span class="link-desc">${link.description}</span>` : ""}
            </div>
          </div>
        `;

        // Play SFX on hover/click
        a.addEventListener("mouseenter", playClickSFX);
        a.addEventListener("click", playClickSFX);

        linksContainer.appendChild(a);
      });
    })
    .catch((error) => console.error("Error loading profile data:", error));
});
