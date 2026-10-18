import { createClient } from "@supabase/supabase-js";

const defaults = {
  content: {
    "home.intro": "Kami mengubah ide menjadi karya digital yang berkesan, fungsional, dan dibuat untuk berkembang.",
    "about.lead": "Kami menghubungkan desain, teknologi, dan cerita untuk membuat bisnis bergerak maju.",
    "about.storyLead": "Zefanya Digital Work membantu brand dan bisnis hadir lebih kuat di dunia digital.",
    "about.storyBody": "Kami menggabungkan ide, desain, dan teknologi untuk menghasilkan solusi yang bukan hanya terlihat menarik, tetapi juga benar-benar bekerja. Dari identitas visual hingga sistem digital, setiap detail dibuat dengan tujuan.",
    "about.storyNote": "Konten ini adalah placeholder yang bisa disesuaikan dengan cerita, visi, dan perjalanan bisnis Anda.",
    "projects.lead": "Jelajahi layanan dan portofolio kami. Pilih kategori untuk melihat halaman detail dan contoh karya.",
    "contact.lead": "Ceritakan apa yang sedang Anda rencanakan. Kami akan membantu menemukan cara terbaik untuk mewujudkannya.",
    "contact.email": "Creativestech79@gmail.com",
    "contact.emailHref": "mailto:Creativestech79@gmail.com",
    "contact.phone": "0851 6274 4708",
    "contact.whatsappLink": "https://wa.me/6285162744708",
    "contact.address": "Jl. H. Abdullah No.77, RT.01, RW.05, Kelurahan Jatikramat, Kecamatan Jatiasih, Bekasi 17421",
    "footer.about": "Ide baik layak diwujudkan dengan baik. Kami siap membantu bisnis Anda melangkah lebih jauh.",
    "footer.cta": "bersama."
  },
  projects: [
    {
      id: "creative-design",
      title: "Creative Design",
      category: "Visual identity · Graphic design · Art direction",
      description: "Membangun identitas visual yang punya karakter, mudah diingat, dan terasa tepat untuk audiens Anda.",
      copy: "Dari eksplorasi konsep hingga aset final, kami merancang pengalaman visual yang konsisten di setiap titik temu brand. Layanan ini mencakup strategi identitas, logo, sistem grafis, materi kampanye, dan art direction. Konten portofolio ini masih berupa placeholder dan akan diperbarui dengan proyek pilihan.",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=85",
      alt: "Komposisi desain grafis penuh warna",
      gallery: ["https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85"]
    },
    {
      id: "multimedia",
      title: "Multimedia",
      category: "Photo · Video · Motion",
      description: "Cerita brand yang terasa hidup melalui fotografi, video, dan konten bergerak.",
      copy: "Kami membantu merencanakan dan memproduksi konten multimedia, mulai dari ide dan storyboard sampai proses editing. Baik untuk kampanye, dokumentasi, maupun konten sosial media, setiap cerita dirancang agar terasa autentik dan menarik. Konten portofolio ini masih berupa placeholder.",
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1600&q=85",
      alt: "Produksi multimedia dan pengambilan gambar",
      gallery: ["https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=85"]
    },
    {
      id: "it-solution",
      title: "IT Solution",
      category: "IT support · Consultation · Setup",
      description: "Teknologi yang tepat untuk membantu operasional bisnis berjalan lebih lancar.",
      copy: "Kami menyediakan dukungan dan konsultasi teknologi sesuai kebutuhan bisnis, termasuk pengaturan perangkat, jaringan, dan solusi digital. Kami memulai dari memahami tantangan, lalu merekomendasikan pendekatan yang praktis dan mudah digunakan. Konten portofolio ini masih berupa placeholder.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=85",
      alt: "Tim bekerja bersama dalam solusi teknologi",
      gallery: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=85"]
    },
    {
      id: "web-development",
      title: "Web Development",
      category: "Website · E-commerce · Web app",
      description: "Website yang cepat, responsif, dan dirancang untuk memberi pengalaman digital terbaik.",
      copy: "Kami merancang dan membangun website yang menyatukan visual, kemudahan penggunaan, dan kebutuhan bisnis. Mulai dari landing page hingga e-commerce dan aplikasi web, setiap proyek dikembangkan agar nyaman digunakan di berbagai perangkat. Konten portofolio ini masih berupa placeholder.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=85",
      alt: "Tampilan website modern pada laptop",
      gallery: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85"]
    },
    {
      id: "cctv-specialist",
      title: "CCTV Specialist",
      category: "Security camera · Installation · Monitoring",
      description: "Solusi CCTV yang membantu Anda memantau ruang dan menjaga keamanan dengan lebih tenang.",
      copy: "Kami membantu merencanakan kebutuhan kamera pengawas, menentukan titik pemasangan, serta menyiapkan sistem pemantauan yang praktis. Solusi disesuaikan dengan kebutuhan rumah, kantor, maupun ruang usaha. Konten portofolio ini masih berupa placeholder.",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=85",
      alt: "Kamera keamanan untuk pemantauan area",
      gallery: ["https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=85"]
    }
  ],
  slides: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1500&q=85",
      alt: "Eksplorasi desain visual dengan warna-warna berani",
      label: "Visual identity",
      title: "A bold point of view",
      type: "Brand identity / 2025"
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1500&q=85",
      alt: "Produksi foto dan video untuk cerita sebuah brand",
      label: "Moving stories",
      title: "Stories in motion",
      type: "Multimedia / 2025"
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1500&q=85",
      alt: "Desain website modern pada layar laptop",
      label: "Digital experience",
      title: "Built for what’s next",
      type: "Web development / 2025"
    }
  ]
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const runtimeEnv = import.meta.env || {};
const supabaseUrl = runtimeEnv.VITE_SUPABASE_URL;
const supabaseAnonKey = runtimeEnv.VITE_SUPABASE_ANON_KEY;
const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
let state = clone(defaults);

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function applyContent() {
  document.querySelectorAll("[data-cms]").forEach((element) => {
    const value = state.content[element.dataset.cms];
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-cms-href]").forEach((element) => {
    const value = state.content[element.dataset.cmsHref];
    if (value) element.setAttribute("href", value);
  });
  document.querySelectorAll("[data-cms-map]").forEach((element) => {
    const address = state.content[element.dataset.cmsMap];
    if (!address) return;
    const query = encodeURIComponent(address);
    if (element.tagName === "IFRAME") {
      element.setAttribute("src", `https://maps.google.com/maps?q=${query}&z=16&output=embed`);
    } else {
      element.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=Zefanya%20Digital%20Work%2C%20${query}`);
    }
  });
}

function showPublicError(error) {
  console.error("Konten website gagal dimuat dari Supabase.", error);
  let notice = document.querySelector("#site-data-warning");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "site-data-warning";
    notice.className = "site-data-warning";
    notice.setAttribute("role", "alert");
    document.body.prepend(notice);
  }
  notice.textContent = "Konten belum dapat dimuat dari server. Coba muat ulang halaman atau hubungi administrator.";
}

async function load() {
  if (!supabaseClient) {
    throw new Error("Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  const [contentResult, projectResult, slideResult] = await Promise.all([
    supabaseClient.from("site_content").select("key,value"),
    supabaseClient.from("projects").select("id,title,category,description,copy,image,alt,gallery,sort_order").order("sort_order"),
    supabaseClient.from("home_slides").select("id,image,alt,label,title,type,sort_order").order("sort_order")
  ]);
  const failure = contentResult.error || projectResult.error || slideResult.error;
  if (failure) throw failure;

  state = {
    content: { ...defaults.content, ...Object.fromEntries(contentResult.data.map((item) => [item.key, item.value])) },
    projects: projectResult.data.map(({ sort_order, ...project }) => project),
    slides: slideResult.data.map(({ sort_order, ...slide }) => slide)
  };
  applyContent();
  return clone(state);
}

function requireClient() {
  if (!supabaseClient) {
    throw new Error("Konfigurasi Supabase tidak tersedia. Pastikan environment variable Vercel sudah diatur.");
  }
  return supabaseClient;
}

async function saveProject(project) {
  const client = requireClient();
  const index = state.projects.findIndex((item) => item.id === project.id);
  const sort_order = index >= 0 ? index : state.projects.length;
  const { error } = await client.from("projects").upsert({ ...project, sort_order });
  if (error) throw error;
  await load();
}

async function deleteProject(id) {
  const { error } = await requireClient().from("projects").delete().eq("id", id);
  if (error) throw error;
  await load();
}

async function saveSlide(slide) {
  const client = requireClient();
  const index = state.slides.findIndex((item) => item.id === slide.id);
  const sort_order = index >= 0 ? index : state.slides.length;
  const { error } = await client.from("home_slides").upsert({ ...slide, sort_order });
  if (error) throw error;
  await load();
}

async function deleteSlide(id) {
  const { error } = await requireClient().from("home_slides").delete().eq("id", id);
  if (error) throw error;
  await load();
}

async function saveContent(content) {
  const entries = Object.entries(content).map(([key, value]) => ({ key, value }));
  const { error } = await requireClient().from("site_content").upsert(entries);
  if (error) throw error;
  await load();
}

async function replaceAll(nextState) {
  const client = requireClient();
  const contentEntries = Object.entries(nextState.content).map(([key, value]) => ({ key, value }));
  const projectRows = nextState.projects.map((project, sort_order) => ({ ...project, sort_order }));
  const slideRows = nextState.slides.map((slide, sort_order) => ({ ...slide, sort_order }));

  const contentResult = await client.from("site_content").upsert(contentEntries);
  if (contentResult.error) throw contentResult.error;
  if (projectRows.length) {
    const projectResult = await client.from("projects").upsert(projectRows);
    if (projectResult.error) throw projectResult.error;
  }
  const projectIds = projectRows.map((item) => item.id);
  const projectDelete = projectIds.length
    ? await client.from("projects").delete().not("id", "in", `(${projectIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(",")})`)
    : await client.from("projects").delete().gte("sort_order", 0);
  if (projectDelete.error) throw projectDelete.error;
  const slideIds = slideRows.map((slide) => slide.id).filter(Boolean);
  if (slideRows.length) {
    const slideResult = await client.from("home_slides").upsert(slideRows);
    if (slideResult.error) throw slideResult.error;
  }
  const slideDelete = slideIds.length
    ? await client.from("home_slides").delete().not("id", "in", `(${slideIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(",")})`)
    : await client.from("home_slides").delete().gte("sort_order", 0);
  if (slideDelete.error) throw slideDelete.error;
  await load();
}

export const SiteCMS = {
  defaults: () => clone(defaults),
  getState: () => clone(state),
  load,
  saveProject,
  deleteProject,
  saveSlide,
  deleteSlide,
  saveContent,
  replaceAll,
  showPublicError,
  getClient: () => supabaseClient
};
