document.addEventListener("DOMContentLoaded", () => {
  let bgAudio = null;
  let clickAudio = null;
  let isMusicPlaying = false;

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // 1. SETUP AUDIO
      if (data.audio) {
        if (data.audio.bgMusic) {
          bgAudio = new Audio(data.audio.bgMusic);
          bgAudio.loop = true;
          bgAudio.volume = 0.4; // Comfort background volume
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

      // Function to attempt playing background music
      const startMusic = () => {
        if (bgAudio && !isMusicPlaying) {
          bgAudio.play().then(() => {
            isMusicPlaying = true;
            if (musicStatus) musicStatus.textContent = "ON 🎵";
          }).catch((err) => {
            console.log("Autoplay blocked pending user interaction:", err);
          });
        }
      };

      // Function to pause background music
      const pauseMusic = () => {
        if (bgAudio && isMusicPlaying) {
          bgAudio.pause();
          isMusicPlaying = false;
          if (musicStatus) musicStatus.textContent = "OFF";
        }
      };

      // AUTO-PLAY: Play immediately on page load (if browser allows) OR on very first touch/click
      startMusic();
      
      const handleFirstInteraction = () => {
        startMusic();
        window.removeEventListener("touchstart", handleFirstInteraction);
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("scroll", handleFirstInteraction);
      };

      window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
      window.addEventListener("click", handleFirstInteraction);
      window.addEventListener("scroll", handleFirstInteraction, { passive: true });

      // PAGE VISIBILITY API: Pause music when tab is hidden or user leaves app
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (bgAudio && isMusicPlaying) {
            bgAudio.pause();
          }
        } else {
          if (bgAudio && isMusicPlaying) {
            bgAudio.play().catch(() => {});
          }
        }
      });

      // Pause audio when page unloads or user navigates away
      window.addEventListener("pagehide", () => {
        if (bgAudio) bgAudio.pause();
      });

      // Manual Music Toggle Button
      if (musicBtn) {
        musicBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent triggering interaction listener
          playClickSFX();
          if (!bgAudio) return;

          if (isMusicPlaying) {
            pauseMusic();
          } else {
            startMusic();
          }
        });
      }

      // 2. SET PROFILE HEADER
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

      // 3. RENDER LINKS LIST
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

        a.addEventListener("mouseenter", playClickSFX);
        a.addEventListener("click", playClickSFX);

        linksContainer.appendChild(a);
      });
    })
    .catch((error) => console.error("Error loading profile data:", error));
});
