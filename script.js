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

      // Render Social Icons
      const socialsContainer = document.getElementById("socials");
      data.socials.forEach((social) => {
        const a = document.createElement("a");
        a.href = social.url;
        a.className = "social-item";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = `${social.icon} ${social.name}`;
        socialsContainer.appendChild(a);
      });

      // Render Main Links
      const linksContainer = document.getElementById("links-container");
      data.links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.url;
        a.className = "link-button";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        a.innerHTML = `
          <span class="link-title">${link.title}</span>
          ${link.description ? `<span class="link-desc">${link.description}</span>` : ""}
        `;

        linksContainer.appendChild(a);
      });
    })
    .catch((error) => console.error("Error loading profile data:", error));
});

