import { SiteCMS } from "./site.js";

const pageTitle = document.querySelector("#custom-page-title");
const pageDescription = document.querySelector("#custom-page-description");
const pageContent = document.querySelector("#custom-page-content");
const imageWrap = document.querySelector("#custom-page-image-wrap");
const image = document.querySelector("#custom-page-image");

async function renderPage() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    showMissingPage();
    return;
  }

  try {
    const { pages } = await SiteCMS.load();
    const page = pages.find((item) => item.slug === slug);
    if (!page) {
      showMissingPage();
      return;
    }

    document.title = `${page.title} — Zefanya Digital Work`;
    document.querySelector('meta[name="description"]').content = page.description || page.title;
    pageTitle.textContent = page.title;
    pageDescription.textContent = page.description;
    pageDescription.hidden = !page.description;

    if (page.image) {
      image.src = page.image;
      image.alt = page.alt;
      imageWrap.hidden = false;
    }

    page.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean).forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      pageContent.append(paragraph);
    });
  } catch (error) {
    SiteCMS.showPublicError(error);
    showMissingPage();
  }
}

function showMissingPage() {
  document.title = "Halaman tidak ditemukan — Zefanya Digital Work";
  pageTitle.textContent = "Halaman tidak ditemukan.";
  pageDescription.textContent = "Halaman ini mungkin sudah dihapus atau tautannya tidak valid.";
  pageContent.replaceChildren();
}

renderPage();
