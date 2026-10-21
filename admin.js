import { SiteCMS } from "./site.js";

const client = SiteCMS.getClient();
const pageNames = {
  overview: "Ringkasan",
  home: "Halaman Home",
  about: "Halaman About",
  "project-page": "Halaman Project",
  contact: "Halaman Contact",
  "project-detail": "Detail Project",
  header: "Header website",
  footer: "Footer website",
  projects: "Project",
  slides: "Slide beranda",
  pages: "Halaman tambahan"
};
const contentGroups = [
  {
    id: "home",
    title: "Home",
    description: "Atur judul, deskripsi, dan ajakan pada halaman Home.",
    fields: [["home.eyebrow", "Label kecil"], ["home.headingLead", "Judul baris pertama"], ["home.headingMiddle", "Kata penghubung"], ["home.headingAccent", "Judul beraksen"], ["home.headingEnd", "Penutup judul"], ["home.intro", "Deskripsi hero"], ["home.projectLink", "Tautan project"], ["home.ctaEyebrow", "Label ajakan"], ["home.ctaLineOne", "Baris ajakan pertama"], ["home.ctaLineTwo", "Baris ajakan kedua"], ["home.ctaAboutLink", "Tautan About"], ["home.ctaProjectsLink", "Tautan Project"]]
  },
  {
    id: "about",
    title: "About",
    description: "Atur cerita, nilai, dan ajakan pada halaman About.",
    fields: [["about.eyebrow", "Label halaman"], ["about.headingLead", "Judul baris pertama"], ["about.headingMiddle", "Kata penghubung"], ["about.headingAccent", "Judul beraksen"], ["about.headingEnd", "Penutup judul"], ["about.lead", "Deskripsi halaman"], ["about.storyEyebrow", "Label cerita"], ["about.storyHeadingLead", "Judul cerita"], ["about.storyHeadingAccent", "Judul cerita beraksen"], ["about.storyLead", "Kalimat utama cerita"], ["about.storyBody", "Cerita studio"], ["about.storyNote", "Catatan tambahan"], ["about.storyImage", "URL gambar cerita"], ["about.storyImageAlt", "Deskripsi gambar"], ["about.storyLink", "Tautan layanan"], ["about.approachEyebrow", "Label cara kerja"], ["about.approachNumber", "Nomor bagian"], ["about.valueOne", "Nilai pertama"], ["about.valueTwo", "Nilai kedua"], ["about.valueThree", "Nilai ketiga"], ["about.ctaEyebrow", "Label ajakan"], ["about.ctaLineOne", "Baris ajakan pertama"], ["about.ctaLineTwo", "Baris ajakan kedua"], ["about.ctaLink", "Tautan kontak"]]
  },
  {
    id: "project-page",
    title: "Project",
    description: "Atur pengantar dan ajakan pada halaman portfolio.",
    fields: [["projects.eyebrow", "Label halaman"], ["projects.headingLead", "Judul halaman"], ["projects.headingAccent", "Judul beraksen"], ["projects.lead", "Deskripsi halaman"], ["projects.ctaEyebrow", "Label ajakan"], ["projects.ctaLineOne", "Baris ajakan pertama"], ["projects.ctaLineTwo", "Baris ajakan kedua"], ["projects.ctaLink", "Tautan kontak"]]
  },
  {
    id: "contact",
    title: "Contact",
    description: "Atur judul halaman dan detail kontak yang tampil di seluruh website.",
    fields: [["contact.eyebrow", "Label halaman"], ["contact.headingLead", "Judul halaman"], ["contact.headingAccent", "Judul beraksen"], ["contact.lead", "Deskripsi halaman"], ["contact.sectionEyebrow", "Label kontak"], ["contact.email", "Alamat email"], ["contact.phone", "Nomor WhatsApp"], ["contact.address", "Alamat lengkap"], ["contact.whatsappLabel", "Label WhatsApp"], ["contact.locationLabel", "Label lokasi"], ["contact.mapTitle", "Judul peta"], ["contact.mapLabel", "Label peta"]]
  },
  {
    id: "project-detail",
    title: "Detail Project",
    description: "Atur label dan ajakan bersama yang muncul di halaman detail portfolio.",
    fields: [["project.backLink", "Teks kembali"], ["project.kicker", "Label portfolio"], ["project.aboutEyebrow", "Label tentang layanan"], ["project.headingLead", "Judul detail"], ["project.headingAccent", "Judul detail beraksen"], ["project.contactLink", "Tautan diskusi"], ["project.nextEyebrow", "Label project berikutnya"], ["project.nextLink", "Tautan semua project"]]
  },
  {
    id: "header",
    title: "Header website",
    description: "Perubahan header diterapkan di semua halaman website.",
    fields: [["header.logo", "Lokasi atau URL logo"], ["header.logoAlt", "Deskripsi logo"], ["header.caption", "Caption brand"], ["header.navLabel", "Label aksesibilitas navigasi"], ["header.menuLabel", "Label tombol menu"], ["header.home", "Menu Home"], ["header.about", "Menu About"], ["header.projects", "Menu Project"], ["header.contact", "Menu kontak"]]
  },
  {
    id: "footer",
    title: "Footer website",
    description: "Perubahan footer diterapkan di semua halaman website.",
    fields: [["footer.kicker", "Kalimat pengantar"], ["footer.ctaHeading", "Judul ajakan"], ["footer.cta", "Penutup ajakan"], ["footer.whatsappLink", "Teks tombol WhatsApp"], ["footer.about", "Deskripsi studio"], ["footer.exploreLabel", "Judul tautan"], ["footer.homeLink", "Tautan Home"], ["footer.aboutLink", "Tautan About"], ["footer.projectsLink", "Tautan Project"], ["footer.contactLink", "Tautan Contact"], ["footer.contactLabel", "Judul kontak"], ["footer.bottomNote", "Catatan bawah"], ["footer.findLink", "Tautan temukan kami"]]
  }
];
let activeContentGroup = "home";
const loginView = document.querySelector("#admin-login");
const adminLayout = document.querySelector("#admin-layout");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const dialog = document.querySelector("#editor-dialog");
const editorForm = document.querySelector("#editor-form");
const projectFields = document.querySelector("#project-fields");
const slideFields = document.querySelector("#slide-fields");
const pageFields = document.querySelector("#page-fields");
const statusElement = document.querySelector("#admin-status");
let state = SiteCMS.defaults();
let editorType = "project";

function showStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("is-error", isError);
  statusElement.classList.add("visible");
  window.clearTimeout(showStatus.timeout);
  showStatus.timeout = window.setTimeout(() => statusElement.classList.remove("visible"), 5000);
}

function showLogin(message = "") {
  loginError.textContent = message;
  loginView.hidden = false;
  adminLayout.hidden = true;
}

async function openAdmin(user) {
  const { data, error } = await client.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  if (!data) {
    await client.auth.signOut();
    showLogin("Login berhasil, tetapi akun ini belum terdaftar sebagai admin. Tambahkan email akun ke public.admin_users melalui SQL Editor Supabase; caranya ada di README.");
    return false;
  }
  state = await SiteCMS.load();
  renderAll();
  loginView.hidden = true;
  adminLayout.hidden = false;
  return true;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeAction(label, className, callback) {
  const button = makeElement("button", className, label);
  button.type = "button";
  button.addEventListener("click", callback);
  return button;
}

function renderProjects() {
  const body = document.querySelector("#project-rows");
  const query = document.querySelector("#project-search").value.trim().toLowerCase();
  const matches = state.projects.filter((project) => `${project.title} ${project.category}`.toLowerCase().includes(query));
  body.replaceChildren();

  matches.forEach((project) => {
    const row = document.createElement("tr");
    const titleCell = document.createElement("td");
    const projectInfo = makeElement("div", "project-cell");
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = "";
    image.loading = "lazy";
    const labels = makeElement("div");
    labels.append(makeElement("strong", "", project.title), makeElement("small", "", project.id));
    projectInfo.append(image, labels);
    titleCell.append(projectInfo);

    const category = makeElement("td", "muted-cell", project.category);
    const imageCell = document.createElement("td");
    const imageLink = makeElement("a", "image-link", "Buka gambar ↗");
    imageLink.href = project.image;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";
    imageCell.append(imageLink);

    const actions = makeElement("td");
    const actionRow = makeElement("div", "row-actions");
    actionRow.append(
      makeAction("Edit", "table-action", () => openProjectEditor(project.id)),
      makeAction("Hapus", "table-action delete-action", () => deleteProject(project.id))
    );
    actions.append(actionRow);
    row.append(titleCell, category, imageCell, actions);
    body.append(row);
  });

  document.querySelector("#project-empty").hidden = matches.length > 0;
  document.querySelector("#project-count").textContent = `${matches.length} dari ${state.projects.length} project`;
}

function renderSlides() {
  const container = document.querySelector("#slide-list");
  container.replaceChildren();
  state.slides.forEach((slide, index) => {
    const card = makeElement("article", "slide-card");
    const image = document.createElement("img");
    image.src = slide.image;
    image.alt = slide.alt;
    image.loading = "lazy";
    const content = makeElement("div", "slide-card-content");
    const copy = makeElement("div", "slide-card-copy");
    copy.append(
      makeElement("span", "admin-kicker", `SLIDE ${String(index + 1).padStart(2, "0")}`),
      makeElement("h3", "", slide.title),
      makeElement("p", "", `${slide.label} · ${slide.type}`)
    );
    const actions = makeElement("div", "row-actions");
    actions.append(
      makeAction("Edit", "table-action", () => openSlideEditor(slide.id)),
      makeAction("Hapus", "table-action delete-action", () => deleteSlide(slide.id))
    );
    content.append(copy, actions);
    card.append(image, content);
    container.append(card);
  });
  document.querySelector("#slide-empty").hidden = state.slides.length > 0;
}

function renderPages() {
  const body = document.querySelector("#page-rows");
  body.replaceChildren();
  state.pages.forEach((page) => {
    const row = document.createElement("tr");
    const titleCell = document.createElement("td");
    const title = makeElement("strong", "", page.title);
    const slug = makeElement("small", "page-slug-label", `/${page.slug}`);
    titleCell.append(title, slug);

    const linkCell = document.createElement("td");
    const pageLink = makeElement("a", "image-link", "Buka halaman ↗");
    pageLink.href = `page.html?slug=${encodeURIComponent(page.slug)}`;
    pageLink.target = "_blank";
    pageLink.rel = "noopener noreferrer";
    linkCell.append(pageLink);

    const actions = makeElement("td");
    const actionRow = makeElement("div", "row-actions");
    actionRow.append(
      makeAction("Edit", "table-action", () => openPageEditor(page.slug)),
      makeAction("Hapus", "table-action delete-action", () => deletePage(page.slug))
    );
    actions.append(actionRow);
    row.append(titleCell, linkCell, actions);
    body.append(row);
  });
  document.querySelector("#page-empty").hidden = state.pages.length > 0;
}

function renderContentForm() {
  const form = document.querySelector("#content-form");
  const group = contentGroups.find((item) => item.id === activeContentGroup);
  form.replaceChildren();
  if (!group) return;
  const card = makeElement("fieldset", "admin-card content-group");
  const legend = makeElement("legend", "", group.title);
  const description = makeElement("p", "group-description", group.description);
  const fieldGrid = makeElement("div", "content-field-grid");
  group.fields.forEach(([key, label]) => {
    const field = makeElement("label", "field");
    field.append(makeElement("span", "field-label", label));
    const isLongText = ["about.storyBody", "about.storyNote", "contact.address", "footer.about"].includes(key);
    const input = document.createElement(isLongText ? "textarea" : "input");
    input.name = key;
    input.value = state.content[key] || "";
    input.required = true;
    input.maxLength = isLongText ? 1200 : key === "header.logo" ? 500 : 240;
    if (isLongText) input.rows = key === "about.storyBody" ? 5 : 3;
    field.append(input);
    fieldGrid.append(field);
  });
  card.append(legend, description, fieldGrid);
  form.append(card);
}

function renderAll() {
  document.querySelector("#project-total").textContent = state.projects.length;
  document.querySelector("#slide-total").textContent = state.slides.length;
  document.querySelector("#page-total").textContent = state.pages.length;
  renderProjects();
  renderSlides();
  renderPages();
  renderContentForm();
}

function goToPanel(name) {
  const contentGroup = contentGroups.find((group) => group.id === name);
  if (contentGroup) {
    activeContentGroup = contentGroup.id;
    renderContentForm();
    document.querySelector("#content-panel-title").textContent = contentGroup.title;
    document.querySelector("#content-panel-description").textContent = contentGroup.description;
  }
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${name}` || Boolean(contentGroup && panel.id === "panel-content")));
  document.querySelectorAll(".admin-nav-item").forEach((button) => button.classList.toggle("active", button.dataset.panel === name));
  document.querySelector("#page-title").textContent = pageNames[name];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isWebUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function createSlug(title) {
  const base = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  let id = base;
  let suffix = 2;
  while (state.projects.some((project) => project.id === id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function createPageSlug(title) {
  const base = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "halaman";
  let slug = base;
  let suffix = 2;
  while (state.pages.some((page) => page.slug === slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

async function performMutation(action, message) {
  try {
    await action();
    state = SiteCMS.getState();
    renderAll();
    showStatus(message);
  } catch (error) {
    console.error("Perubahan CMS tidak dapat disimpan.", error);
    showStatus(`Gagal menyimpan: ${error.message || "Terjadi kesalahan koneksi."}`, true);
  }
}

function setEditorMode(type) {
  editorType = type;
  projectFields.hidden = type !== "project";
  slideFields.hidden = type !== "slide";
  pageFields.hidden = type !== "page";
  projectFields.querySelectorAll("input, textarea").forEach((field) => { field.disabled = type !== "project"; });
  slideFields.querySelectorAll("input, textarea").forEach((field) => { field.disabled = type !== "slide"; });
  pageFields.querySelectorAll("input, textarea").forEach((field) => { field.disabled = type !== "page"; });
  document.querySelector("#dialog-kicker").textContent = type === "project"
    ? "PROJECT PORTFOLIO"
    : type === "slide" ? "HOMEPAGE CAROUSEL" : "HALAMAN PUBLIK";
  document.querySelector("#save-record").textContent = type === "project"
    ? "Simpan project"
    : type === "slide" ? "Simpan slide" : "Simpan halaman";
}

function openProjectEditor(projectId = "") {
  setEditorMode("project");
  const project = state.projects.find((item) => item.id === projectId);
  document.querySelector("#dialog-title").textContent = project ? "Edit project" : "Tambah project";
  document.querySelector("#record-id").value = project ? project.id : "";
  document.querySelector("#field-title").value = project?.title || "";
  document.querySelector("#field-category").value = project?.category || "";
  document.querySelector("#field-image").value = project?.image || "";
  document.querySelector("#field-alt").value = project?.alt || "";
  document.querySelector("#field-description").value = project?.description || "";
  document.querySelector("#field-copy").value = project?.copy || "";
  document.querySelector("#field-gallery").value = (project?.gallery || []).join("\n");
  document.querySelector("#form-error").textContent = "";
  dialog.showModal();
}

function openSlideEditor(slideId = "") {
  setEditorMode("slide");
  const slide = state.slides.find((item) => item.id === slideId);
  document.querySelector("#dialog-title").textContent = slide ? "Edit slide" : "Tambah slide";
  document.querySelector("#record-id").value = slide?.id || "";
  document.querySelector("#slide-image").value = slide?.image || "";
  document.querySelector("#slide-alt").value = slide?.alt || "";
  document.querySelector("#slide-label").value = slide?.label || "";
  document.querySelector("#slide-title").value = slide?.title || "";
  document.querySelector("#slide-type").value = slide?.type || "";
  document.querySelector("#form-error").textContent = "";
  dialog.showModal();
}

function openPageEditor(slug = "") {
  setEditorMode("page");
  const page = state.pages.find((item) => item.slug === slug);
  document.querySelector("#dialog-title").textContent = page ? "Edit halaman" : "Tambah halaman";
  document.querySelector("#record-id").value = page?.slug || "";
  document.querySelector("#field-page-title").value = page?.title || "";
  document.querySelector("#page-slug").value = page?.slug || "";
  document.querySelector("#page-slug").readOnly = Boolean(page);
  document.querySelector("#page-slug").dataset.edited = "";
  document.querySelector("#page-description").value = page?.description || "";
  document.querySelector("#page-body").value = page?.body || "";
  document.querySelector("#page-image").value = page?.image || "";
  document.querySelector("#page-alt").value = page?.alt || "";
  document.querySelector("#form-error").textContent = "";
  dialog.showModal();
}

function deleteProject(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!project || !window.confirm(`Hapus project "${project.title}"?`)) return;
  performMutation(() => SiteCMS.deleteProject(id), "Project berhasil dihapus.");
}

function deleteSlide(id) {
  const slide = state.slides.find((item) => item.id === id);
  if (!slide || !window.confirm(`Hapus slide "${slide.title}"?`)) return;
  performMutation(() => SiteCMS.deleteSlide(id), "Slide berhasil dihapus.");
}

function deletePage(slug) {
  const page = state.pages.find((item) => item.slug === slug);
  if (!page || !window.confirm(`Hapus halaman "${page.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
  performMutation(() => SiteCMS.deletePage(slug), "Halaman berhasil dihapus.");
}

document.querySelectorAll(".admin-nav-item").forEach((button) => {
  button.addEventListener("click", () => goToPanel(button.dataset.panel));
});
document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => goToPanel(button.dataset.openPanel));
});
document.querySelector("#project-search").addEventListener("input", renderProjects);
document.querySelector("#add-project").addEventListener("click", () => openProjectEditor());
document.querySelector("#add-slide").addEventListener("click", () => openSlideEditor());
document.querySelector("#add-page").addEventListener("click", () => openPageEditor());
document.querySelector("#field-page-title").addEventListener("input", (event) => {
  const slugInput = document.querySelector("#page-slug");
  if (!document.querySelector("#record-id").value && !slugInput.dataset.edited) {
    slugInput.value = createPageSlug(event.currentTarget.value);
  }
});
document.querySelector("#page-slug").addEventListener("input", (event) => {
  event.currentTarget.dataset.edited = "true";
});
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => dialog.close());

editorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const errorElement = document.querySelector("#form-error");
  const recordId = document.querySelector("#record-id").value;

  if (editorType === "project") {
    const image = document.querySelector("#field-image").value.trim();
    const gallery = document.querySelector("#field-gallery").value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
    if (!isWebUrl(image) || gallery.some((url) => !isWebUrl(url))) {
      errorElement.textContent = "Gunakan URL gambar lengkap yang diawali http:// atau https://.";
      return;
    }
    const project = {
      id: recordId || createSlug(document.querySelector("#field-title").value.trim()),
      title: document.querySelector("#field-title").value.trim(),
      category: document.querySelector("#field-category").value.trim(),
      description: document.querySelector("#field-description").value.trim(),
      copy: document.querySelector("#field-copy").value.trim(),
      image,
      alt: document.querySelector("#field-alt").value.trim(),
      gallery: gallery.length ? gallery : [image]
    };
    dialog.close();
    await performMutation(() => SiteCMS.saveProject(project), recordId ? "Project berhasil diperbarui." : "Project baru berhasil ditambahkan.");
    return;
  }

  if (editorType === "page") {
    const title = document.querySelector("#field-page-title").value.trim();
    const slug = document.querySelector("#page-slug").value.trim();
    const image = document.querySelector("#page-image").value.trim();
    const alt = document.querySelector("#page-alt").value.trim();
    const duplicateSlug = state.pages.some((page) => page.slug === slug && page.slug !== recordId);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      errorElement.textContent = "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.";
      return;
    }
    if (duplicateSlug) {
      errorElement.textContent = "Slug tersebut sudah digunakan. Pilih alamat halaman yang berbeda.";
      return;
    }
    if (image && !isWebUrl(image)) {
      errorElement.textContent = "Gunakan URL gambar lengkap yang diawali http:// atau https://.";
      return;
    }
    if (image && !alt) {
      errorElement.textContent = "Isi teks alternatif untuk gambar agar halaman tetap mudah diakses.";
      return;
    }
    const page = {
      slug,
      title,
      description: document.querySelector("#page-description").value.trim(),
      body: document.querySelector("#page-body").value.trim(),
      image,
      alt
    };
    dialog.close();
    await performMutation(() => SiteCMS.savePage(page), recordId ? "Halaman berhasil diperbarui." : "Halaman baru berhasil ditambahkan.");
    return;
  }

  const image = document.querySelector("#slide-image").value.trim();
  if (!isWebUrl(image)) {
    errorElement.textContent = "Gunakan URL gambar lengkap yang diawali http:// atau https://.";
    return;
  }
  const slide = {
    id: recordId || crypto.randomUUID(),
    image,
    alt: document.querySelector("#slide-alt").value.trim(),
    label: document.querySelector("#slide-label").value.trim(),
    title: document.querySelector("#slide-title").value.trim(),
    type: document.querySelector("#slide-type").value.trim()
  };
  dialog.close();
  await performMutation(() => SiteCMS.saveSlide(slide), recordId ? "Slide berhasil diperbarui." : "Slide baru berhasil ditambahkan.");
});

document.querySelector("#content-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const content = { ...state.content };
  const group = contentGroups.find((item) => item.id === activeContentGroup);
  if (!group) return;
  group.fields.forEach(([key]) => {
    content[key] = String(fields.get(key) || "").trim();
  });
  if (activeContentGroup === "contact") {
    const email = content["contact.email"];
    const phone = content["contact.phone"].replace(/\D/g, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Masukkan alamat email yang valid.", true);
      return;
    }
    if (phone.length < 8) {
      showStatus("Nomor WhatsApp harus berisi minimal 8 digit.", true);
      return;
    }
    content["contact.emailHref"] = `mailto:${email}`;
    content["contact.whatsappLink"] = `https://wa.me/${phone.startsWith("0") ? `62${phone.slice(1)}` : phone}`;
  }
  await performMutation(() => SiteCMS.saveContent(content), "Konten halaman berhasil diperbarui.");
});

document.querySelector("#export-data").addEventListener("click", () => {
  const backup = new Blob([JSON.stringify({ version: 2, ...state }, null, 2)], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(backup);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `zefanya-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
  showStatus("File backup JSON berhasil dibuat.");
});

document.querySelector("#import-data").addEventListener("change", async (event) => {
  const file = event.currentTarget.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const defaultContent = SiteCMS.defaults().content;
    if (![1, 2].includes(imported?.version) || !imported.content || !Array.isArray(imported.projects) || !Array.isArray(imported.slides)) {
      throw new Error("Struktur file tidak sesuai format backup.");
    }
    if (!Object.keys(defaultContent).every((key) => typeof imported.content[key] === "string")) {
      throw new Error("Data konten pada file backup tidak valid.");
    }
    const validProject = (project) => project
      && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(project.id)
      && ["title", "category", "description", "copy", "alt"].every((key) => typeof project[key] === "string")
      && isWebUrl(project.image)
      && Array.isArray(project.gallery)
      && project.gallery.every(isWebUrl);
    if (!imported.projects.every(validProject)) throw new Error("Data project pada file backup tidak valid.");
    const validSlide = (slide) => slide
      && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slide.id)
      && ["title", "label", "type", "alt"].every((key) => typeof slide[key] === "string")
      && isWebUrl(slide.image);
    if (!imported.slides.every(validSlide)) throw new Error("Data slide pada file backup tidak valid.");
    const validPage = (page) => page
      && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(page.slug)
      && ["title", "description", "body", "alt"].every((key) => typeof page[key] === "string")
      && (page.image === "" || isWebUrl(page.image));
    if (imported.pages !== undefined && (
      !Array.isArray(imported.pages)
      || !imported.pages.every(validPage)
      || new Set(imported.pages.map((page) => page.slug)).size !== imported.pages.length
    )) {
      throw new Error("Data halaman pada file backup tidak valid.");
    }

    const email = imported.content["contact.email"];
    const phone = imported.content["contact.phone"].replace(/\D/g, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 8) {
      throw new Error("Informasi kontak pada file backup tidak valid.");
    }
    imported.content["contact.emailHref"] = `mailto:${email}`;
    imported.content["contact.whatsappLink"] = `https://wa.me/${phone.startsWith("0") ? `62${phone.slice(1)}` : phone}`;
    const importedState = {
      content: { ...defaultContent, ...imported.content },
      projects: imported.projects,
      slides: imported.slides,
      pages: imported.pages || state.pages
    };
    await performMutation(() => SiteCMS.replaceAll(importedState), "Backup berhasil diimpor.");
  } catch (error) {
    console.error("File backup tidak dapat diimpor.", error);
    showStatus(`Gagal mengimpor backup: ${error.message}`, true);
  } finally {
    event.currentTarget.value = "";
  }
});

document.querySelector("#reset-data").addEventListener("click", () => {
  if (!window.confirm("Kembalikan seluruh konten ke versi awal? Perubahan saat ini akan diganti.")) return;
  performMutation(() => SiteCMS.replaceAll(SiteCMS.defaults()), "Konten awal berhasil dipulihkan.");
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    showStatus(`Gagal keluar: ${error.message}`, true);
    return;
  }
  showLogin();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  const submit = loginForm.querySelector("button[type=submit]");
  submit.disabled = true;
  submit.textContent = "Memeriksa akun…";
  try {
    if (!client) throw new Error("Supabase belum dikonfigurasi. Atur environment variable VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Vercel.");
    const { data, error } = await client.auth.signInWithPassword({
      email: document.querySelector("#login-email").value.trim(),
      password: document.querySelector("#login-password").value
    });
    if (error) throw error;
    const isAdmin = await openAdmin(data.user);
    if (!isAdmin) return;
  } catch (error) {
    console.error("Login admin gagal.", error);
    loginError.textContent = error.message || "Login gagal. Periksa koneksi dan konfigurasi Supabase.";
  } finally {
    submit.disabled = false;
    submit.innerHTML = "Masuk ke portal <span>↗</span>";
  }
});

async function initializeAdmin() {
  if (!client) {
    showLogin("Supabase belum dikonfigurasi. Lengkapi environment variable VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, lalu deploy ulang.");
    return;
  }
  try {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (data.session) {
      const authorized = await openAdmin(data.session.user);
      if (authorized) return;
    }
    showLogin();
  } catch (error) {
    console.error("Portal admin tidak dapat dimuat.", error);
    showLogin(`Gagal menghubungkan portal admin: ${error.message}`);
  }
}

initializeAdmin();
