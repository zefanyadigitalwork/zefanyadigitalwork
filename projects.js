import { SiteCMS } from "./site.js";

const projectGrid = document.querySelector("#project-grid");

async function renderProjects() {
  let projects;
  try {
    projects = (await SiteCMS.load()).projects;
  } catch (error) {
    SiteCMS.showPublicError(error);
    projects = SiteCMS.getState().projects;
  }
  projectGrid.replaceChildren();

  if (!projects.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "project-empty";
    emptyState.textContent = "Belum ada project yang ditampilkan.";
    projectGrid.append(emptyState);
  }

  projects.forEach((project, index) => {
    const card = document.createElement("a");
    card.className = "project-card";
    if (index === 0 && projects.length > 2) card.classList.add("card-large");
    if (index === projects.length - 1 && projects.length > 2) card.classList.add("card-wide");
    card.href = `project.html?category=${encodeURIComponent(project.id)}`;

  const imageFrame = document.createElement("div");
  imageFrame.className = "project-image";
  const image = document.createElement("img");
  image.src = project.image;
  image.alt = project.alt;
  image.loading = "lazy";
  const number = document.createElement("span");
  number.className = "card-number";
  number.textContent = String(index + 1).padStart(2, "0");
  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.textContent = "↗";
  imageFrame.append(image, number, arrow);

  const metadata = document.createElement("div");
  metadata.className = "project-meta";
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = project.title;
  const category = document.createElement("p");
  category.textContent = project.category;
  details.append(title, category);
  const count = document.createElement("span");
  count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
  metadata.append(details, count);
  card.append(imageFrame, metadata);
    projectGrid.append(card);
  });
}

renderProjects();
