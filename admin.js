import { SiteCMS } from "./site.js";

const client = SiteCMS.getClient();
const pageNames = {
  overview: "Ringkasan",
  projects: "Project",
  slides: "Slide beranda",
  content: "Konten halaman"
};
const contentGroups = [
  { title: "Home", description: "Teks pengantar halaman depan.", fields: [["home.intro", "Deskripsi hero"]] },
  {
    title: "About",
    description: "Cerita tentang studio Anda.",
    fields: [["about.lead", "Deskripsi halaman"], ["about.storyLead", "Kalimat utama cerita"], ["about.storyBody", "Cerita studio"], ["about.storyNote", "Catatan tambahan"]]
  },
  { title: "Project", description: "Teks pengantar halaman portfolio.", fields: [["projects.lead", "Deskripsi halaman"]] },
  {
    title: "Contact",
    description: "Informasi kontak pada halaman dan footer.",
    fields: [["contact.lead", "Deskripsi halaman"], ["contact.email", "Alamat email"], ["contact.phone", "Nomor WhatsApp"], ["contact.address", "Alamat lengkap"]]
  },
  { title: "Footer", description: "Teks yang muncul di footer website.", fields: [["footer.cta", "Kata penutup ajakan"], ["footer.about", "Deskripsi singkat studio"]] }
];
const loginView = document.querySelector("#admin-login");
const adminLayout = document.querySelector("#admin-layout");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const dialog = document.querySelector("#editor-dialog");
const editorForm = document.querySelector("#editor-form");
const projectFields = document.querySelector("#project-fields");
const slideFields = document.querySelector("#slide-fields");
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
    showLogin("Akun ini belum diberi akses admin.");
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

function renderContentForm() {
  const form = document.querySelector("#content-form");
  form.replaceChildren();
  contentGroups.forEach((group, index) => {
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
      input.maxLength = isLongText ? 1200 : 240;
      if (isLongText) input.rows = key === "about.storyBody" ? 5 : 3;
      field.append(input);
      fieldGrid.append(field);
    });
    card.append(legend, description, fieldGrid);
    card.style.animationDelay = `${index * 45}ms`;
    form.append(card);
  });
  form.append(makeElement("div", "content-submit-spacer"));
}

function renderAll() {
  document.querySelector("#project-total").textContent = state.projects.length;
  document.querySelector("#slide-total").textContent = state.slides.length;
  renderProjects();
  renderSlides();
  renderContentForm();
}

function goToPanel(name) {
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${name}`));
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
  projectFields.querySelectorAll("input, textarea").forEach((field) => { field.disabled = type !== "project"; });
  slideFields.querySelectorAll("input, textarea").forEach((field) => { field.disabled = type !== "slide"; });
  document.querySelector("#dialog-kicker").textContent = type === "project" ? "PROJECT PORTFOLIO" : "HOMEPAGE CAROUSEL";
  document.querySelector("#save-record").textContent = type === "project" ? "Simpan project" : "Simpan slide";
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

document.querySelectorAll(".admin-nav-item").forEach((button) => {
  button.addEventListener("click", () => goToPanel(button.dataset.panel));
});
document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => goToPanel(button.dataset.openPanel));
});
document.querySelector("#project-search").addEventListener("input", renderProjects);
document.querySelector("#add-project").addEventListener("click", () => openProjectEditor());
document.querySelector("#add-slide").addEventListener("click", () => openSlideEditor());
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
  contentGroups.flatMap((group) => group.fields).forEach(([key]) => {
    content[key] = String(fields.get(key) || "").trim();
  });
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
  await performMutation(() => SiteCMS.saveContent(content), "Konten halaman berhasil diperbarui.");
});

document.querySelector("#export-data").addEventListener("click", () => {
  const backup = new Blob([JSON.stringify({ version: 1, ...state }, null, 2)], { type: "application/json" });
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
    if (imported?.version !== 1 || !imported.content || !Array.isArray(imported.projects) || !Array.isArray(imported.slides)) {
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
      slides: imported.slides
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
