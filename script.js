import { SiteCMS } from "./site.js";

let slides = SiteCMS.getState().slides;
let activeSlide = 0;
const heroImage = document.querySelector("#hero-image");

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  const slide = slides[activeSlide];
  heroImage.classList.add("changing");
  window.setTimeout(() => {
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;
    document.querySelector("#slide-current").textContent = String(activeSlide + 1).padStart(2, "0");
    document.querySelector(".hero-image-note > span:first-child").textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    document.querySelector("#slide-label").textContent = slide.label;
    document.querySelector("#slide-title").textContent = slide.title;
    document.querySelector("#slide-type").textContent = slide.type;
    heroImage.classList.remove("changing");
  }, 180);
}

async function initializeSlides() {
  try {
    const remoteState = await SiteCMS.load();
    slides = remoteState.slides;
  } catch (error) {
    SiteCMS.showPublicError(error);
  }

  if (!slides.length) {
    document.querySelector(".hero-controls").hidden = true;
    document.querySelector(".hero-visual").hidden = true;
    return;
  }
  document.querySelector(".slide-count").innerHTML = `<span id="slide-current">01</span> <i>/</i> ${String(slides.length).padStart(2, "0")}`;
  document.querySelector(".hero-image-note > span:first-child").textContent = `01 / ${String(slides.length).padStart(2, "0")}`;
  heroImage.src = slides[0].image;
  heroImage.alt = slides[0].alt;
  document.querySelector("#slide-label").textContent = slides[0].label;
  document.querySelector("#slide-title").textContent = slides[0].title;
  document.querySelector("#slide-type").textContent = slides[0].type;
  if (slides.length > 1) window.setInterval(() => showSlide(activeSlide + 1), 6000);
}

document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => showSlide(activeSlide + (button.dataset.slide === "next" ? 1 : -1)));
});

initializeSlides();
