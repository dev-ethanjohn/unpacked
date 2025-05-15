const overlayWrapper = document.getElementById("js-overlay");
const overlayContent = document.getElementById("js-overlay-target");
const toolsGrid = document.querySelector(".tools__grid");

document.addEventListener("DOMContentLoaded", () => {
  loadProjects().catch((error) => {
    console.error("Failed to load projects:", error);
    document.querySelector(".projects__header-count").textContent = "(0)";
  });
  renderToolsGrid();
  window.toggleImageView = toggleImageView;
});

// https://www.smashingmagazine.com/2023/12/view-transitions-api-ui-animations-part1/
function toggleImageView(clickedImage, sectionType) {
  const image = clickedImage;
  image.classList.add("gallery__image--active");

  const imageParentElement = image.parentElement;

  if (!document.startViewTransition) {
    moveImageToModal(image, sectionType);
    return;
  }

  document.startViewTransition(() => moveImageToModal(image, sectionType));

  overlayWrapper._transitionHandler = async () => {
    if (!document.startViewTransition) {
      moveImageBackFromModal(imageParentElement);
      return;
    }

    const transition = document.startViewTransition(() =>
      moveImageBackFromModal(imageParentElement)
    );

    await transition.finished;
    image.classList.remove("gallery__image--active");
  };

  overlayWrapper.onclick = overlayWrapper._transitionHandler;
}

function moveImageToModal(image, sectionType) {
  overlayWrapper.classList.add("overlay--active");
  overlayWrapper.classList.add(`overlay--${sectionType}`);
  overlayContent.innerHTML = "";

  if (sectionType === "project") {
    overlayContent.classList.add("overlay__inner-project");
  } else {
    overlayContent.classList.add("overlay__inner-about");
  }

  const caption = image.parentElement.querySelector(".image-description");

  overlayContent.appendChild(image);

  if (caption) {
    caption.classList.remove("hidden");
    caption.classList.add("animate-in");
    overlayContent.appendChild(caption);
  }
}

function moveImageBackFromModal(imageParentElement) {
  const image = overlayContent.querySelector("img");
  const caption = overlayContent.querySelector(".image-description");
  const sectionType = overlayWrapper.classList.contains("overlay--about")
    ? "about"
    : "project";

  imageParentElement.appendChild(image);

  if (caption) {
    caption.classList.remove("animate-in");
    caption.classList.add("hidden");
    imageParentElement.appendChild(caption);
  }

  overlayContent.classList.remove("overlay__inner-project");
  overlayContent.classList.remove("overlay__inner-about");

  overlayWrapper.classList.remove("overlay--active");
  overlayWrapper.classList.remove(`overlay--${sectionType}`);
}

// NOTE: PROJECTS
async function loadProjects() {
  try {
    const response = await fetch("/js/data/projects.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    console.log("Error loading projects:", error);
    //! fallback
    document.querySelector(".projects__header-count").textContent = "(0)";
    document.querySelector(".projects__list").innerHTML = `
      <p class="error-message">Failed to load projects</p>
    `;
  }
}

function renderProjects(projects) {
  const projectsList = document.querySelector(".projects__list");

  document.querySelector(
    ".projects__header-count"
  ).textContent = `(${projects.length})`;

  projects.forEach((project) => {
    const projectCard = document.createElement("article");
    projectCard.className = "project-card";

    projectCard.innerHTML = `
      <figure onclick="toggleImageView(this.querySelector('img'), 'project')" class="project-card__container">
        <img class="project-card__thumbnail" src="${project.image}" alt="${project.title}" />
        <figcaption class="image-description hidden" hidden>
          <h3 class="">${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-card__buttons">
            <a href="${project.links.live}" class="project-card__btn">live</a>
            <a href="${project.links.repo}" class="project-card__btn">repo</a>
          </div>
          
        </figcaption>
      </figure>
      <h3 class="project-card__title">${project.title}</h3>
      <div class="project-card__buttons">
        <a href="${project.links.live}" class="project-card__btn">live</a>
        <a href="${project.links.repo}" class="project-card__btn">repo</a>
      </div>
    `;

    projectsList.appendChild(projectCard);
  });
}

//NOTE: TOOLS AND SKILLS

const toolsGridTemplate = {
  template: `
    "js     js     js     html   html   vite"
    "js     js     js     html   html    git"
    "js     js     js     css    css    jest"
    "sass  sass    boot   css    css   styled"
    "sass  sass  tail    next react  react"
    "github npm  vscode figma  react react"
  `,
  items: [
    { name: "javascript.svg", area: "js" },
    { name: "bootstrap.svg", area: "boot" },
    { name: "styled-components.svg", area: "styled" },
    { name: "css.svg", area: "css" },
    { name: "html.svg", area: "html" },
    { name: "reactjs.svg", area: "react" },
    { name: "nextjs.svg", area: "next" },
    { name: "vite.svg", area: "vite" },
    { name: "sass.svg", area: "sass" },
    { name: "tailwind.svg", area: "tail" },
    { name: "git.svg", area: "git" },
    { name: "github.svg", area: "github" },
    { name: "npm.svg", area: "npm" },
    { name: "vscode.svg", area: "vscode" },
    { name: "figma.svg", area: "figma" },
    { name: "jest.svg", area: "jest" },
  ],
};

function renderToolsGrid() {
  const grid = document.querySelector(".tools__grid");
  grid.style.gridTemplateAreas = toolsGridTemplate.template;
  grid.innerHTML = "";

  toolsGridTemplate.items.forEach(({ name, area }) => {
    const item = document.createElement("figure");
    item.className = "tools__grid-item";
    item.style.gridArea = area;
    item.dataset.area = area;

    // Format label
    let label = name.replace(".svg", "");
    if (label === "reactjs") label = "react";
    if (label === "nextjs") label = "next.js";

    item.innerHTML = `
      <img src="./assets/tools/${name}" alt="${label}" />`;
    grid.appendChild(item);
  });
}
