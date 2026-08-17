document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // Set Profile Header Info
      document.getElementById("name").textContent = data.name;
      document.getElementById("handle").textContent = data.handle;
      document.getElementById("status").textContent = data.status;
      document.getElementById("bio").textContent = data.bio;
      document.getElementById("avatar").src = data.avatar;

      // Helper function to get Google's Favicon URL from any full link
      const getFaviconUrl = (pageUrl) => {
        try {
          const domain = new URL(pageUrl).hostname;
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch (e) {
          return "";
        }
      };

      // Render Social Icons with Favicons
      const socialsContainer = document.getElementById("socials");
      data.socials.forEach((social) => {
        const a = document.createElement("a");
        a.href = social.url;
        a.className = "social-item";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const faviconSrc = getFaviconUrl(social.url);
        a.innerHTML = `
          <img src="${faviconSrc}" alt="${social.name} icon" class="favicon-icon">
          <span>${social.name}</span>
        `;
        socialsContainer.appendChild(a);
      });

      // Render Main Links with Favicons
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
            <img src="${faviconSrc}" alt="link icon" class="link-favicon">
            <div class="link-text">
              <span class="link-title">${link.title}</span>
              ${link.description ? `<span class="link-desc">${link.description}</span>` : ""}
            </div>
          </div>
        `;

        linksContainer.appendChild(a);
      });
    })
    .catch((error) => console.error("Error loading profile data:", error));
});
