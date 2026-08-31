document.addEventListener("DOMContentLoaded", () => {
  let bgAudio = null;
  let clickAudio = null;
  let isMusicPlaying = false;

  // VISITOR COUNTER LOGIC
  const countElement = document.getElementById("view-count");
  const namespace = "studblockhead_whois";
  const key = "page_views";

  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
  const hasVisited = localStorage.getItem("has_visited_studblockhead");

  if (isBot) {
    fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
      .then((res) => res.json())
      .then((data) => {
        if (countElement) countElement.textContent = `${data.value || 0} views`;
      })
      .catch(() => {
        if (countElement) countElement.textContent = "1 view";
      });
  } else if (!hasVisited) {
    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("has_visited_studblockhead", "true");
        if (countElement) countElement.textContent = `${data.value} views`;
      })
      .catch(() => {
        if (countElement) countElement.textContent = "1 view";
      });
  } else {
    fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
      .then((res) => res.json())
      .then((data) => {
        if (countElement) countElement.textContent = `${data.value || 1} views`;
      })
      .catch(() => {
        if (countElement) countElement.textContent = "1 view";
      });
  }

  // MAIN PROFILE DATA FETCH
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.audio) {
        if (data.audio.bgMusic) {
          bgAudio = new Audio(data.audio.bgMusic);
          bgAudio.loop = true;
          bgAudio.volume = 0.4;
        }

        if (data.audio.clickSound) {
          clickAudio = new Audio(data.audio.clickSound);
          clickAudio.volume = 0.6;
        }
      }

      const musicBtn = document.getElementById("music-btn");
      const musicStatus = document.getElementById("music-status");

      const playClickSFX = () => {
        if (clickAudio) {
          clickAudio.currentTime = 0;
          clickAudio.play().catch(() => {});
        }
      };

      const startMusic = () => {
        if (bgAudio && !isMusicPlaying) {
          bgAudio.play().then(() => {
            isMusicPlaying = true;
            if (musicStatus) musicStatus.textContent = "ON 🎵";
          }).catch(() => {});
        }
      };

      const pauseMusic = () => {
        if (bgAudio && isMusicPlaying) {
          bgAudio.pause();
          isMusicPlaying = false;
          if (musicStatus) musicStatus.textContent = "OFF";
        }
      };

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

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (bgAudio && isMusicPlaying) bgAudio.pause();
        } else {
          if (bgAudio && isMusicPlaying) bgAudio.play().catch(() => {});
        }
      });

      window.addEventListener("pagehide", () => {
        if (bgAudio) bgAudio.pause();
      });

      if (musicBtn) {
        musicBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          playClickSFX();
          if (!bgAudio) return;

          if (isMusicPlaying) {
            pauseMusic();
          } else {
            startMusic();
          }
        });
      }

      document.getElementById("name").textContent = data.name;
      
      const handleElem = document.getElementById("handle");
      if (data.handle) {
        handleElem.textContent = data.handle.startsWith("@") ? data.handle : `@${data.handle}`;
      } else {
        handleElem.style.display = "none";
      }

      document.getElementById("bio").textContent = data.bio;
      document.getElementById("avatar").src = data.avatar;

      const getFaviconUrl = (pageUrl) => {
        try {
          const domain = new URL(pageUrl).hostname;
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch (e) {
          return "";
        }
      };

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
    .catch((error) => {
      console.error("Error loading profile data:", error);
      document.getElementById("name").textContent = "Error Loading Profile";
      document.getElementById("bio").textContent = "Check data.json formatting in your repository!";
    });
});
