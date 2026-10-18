import { SiteCMS } from "./site.js";

async function renderProject() {
  let projects;
  try {
    projects = (await SiteCMS.load()).projects;
  } catch (error) {
    SiteCMS.showPublicError(error);
    projects = SiteCMS.getState().projects;
  }
  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  const project = projects.find((item) => item.id === requestedCategory) || projects[0];

  if (!project) {
    const message = document.createElement("p");
    message.textContent = "Belum ada project yang tersedia.";
    document.querySelector(".detail-heading").append(message);
    return;
  }
  const index = projects.indexOf(project);
  document.title = `${project.title} — Zefanya Digital Work`;
  document.querySelector("#detail-count").textContent = `${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
  document.querySelector("#detail-title").textContent = project.title;
  document.querySelector("#detail-description").textContent = project.description;
  document.querySelector("#detail-copy").textContent = project.copy;
  document.querySelector("#detail-tag").textContent = project.category;

  const detailImage = document.querySelector("#detail-image");
  detailImage.src = project.image;
  detailImage.alt = project.alt;

  const gallery = document.querySelector("#detail-gallery");
  (project.gallery || []).forEach((photo, photoIndex) => {
    const image = document.createElement("img");
    image.src = photo;
    image.alt = `${project.title} — contoh visual ${photoIndex + 1}`;
    image.loading = "lazy";
    gallery.append(image);
  });
}

renderProject();
