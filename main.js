/* ============================================================
   PORTFOLIO – main.js
   Theme toggle, mobile nav, dynamic projects (CRUD + localStorage)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     DYNAMIC FOOTER YEAR
     ========================================================== */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ==========================================================
     THEME TOGGLE
     ========================================================== */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon   = document.getElementById("themeIcon");
  const THEME_KEY   = "portfolio-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    // Moon = light mode shown, Sun = dark mode shown
    themeIcon.innerHTML = theme === "dark" ? "&#9788;" : "&#9790;";
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  /* ==========================================================
     MOBILE NAVIGATION TOGGLE
     ========================================================== */
  const navToggle = document.getElementById("navToggle");
  const navList   = document.getElementById("navList");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navList.classList.toggle("show");
    });

    navList.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navList.classList.remove("show");
      });
    });
  }

  /* ==========================================================
     ACTIVE NAV-LINK HIGHLIGHT ON SCROLL
     ========================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav);

/* ==========================================================
   PROJECTS FROM JSON (STATIC)
   ========================================================== */

const projectsGrid = document.getElementById("projectsGrid");

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderProjects(projects) {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const title = project.title || "Untitled Project";
    const description = project.description || "No description provided.";
    const techStack = Array.isArray(project.techStack)
      ? project.techStack
      : ["Tech stack not specified"];
    const github = project.github || null;
    const liveDemo = project.liveDemo || null;

    const card = document.createElement("article");
    card.className = "project__card";

    card.innerHTML = `
      <h3 class="project__name">${escapeHTML(title)}</h3>
      <p class="project__description">${escapeHTML(description)}</p>
      <div class="project__stack">
        ${techStack
          .map((tech) => `<span class="tag">${escapeHTML(tech)}</span>`)
          .join("")}
      </div>
      <div class="project__links">
        ${
          github
            ? `<a href="${escapeHTML(
                github
              )}" class="btn btn--small btn--primary" target="_blank" rel="noopener noreferrer">GitHub</a>`
            : ""
        }
        ${
          liveDemo
            ? `<a href="${escapeHTML(
                liveDemo
              )}" class="btn btn--small btn--outline" target="_blank" rel="noopener noreferrer">Live Demo</a>`
            : ""
        }
      </div>
    `;

    projectsGrid.appendChild(card);
  });
}

function loadProjectsFromJSON() {
  fetch("projects.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load projects.json");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.projects || !Array.isArray(data.projects)) {
        console.error("Invalid JSON structure: 'projects' array missing.");
        return;
      }
      renderProjects(data.projects);
    })
    .catch((error) => {
      console.error("Error loading projects:", error);
    });
}

loadProjectsFromJSON();
});
