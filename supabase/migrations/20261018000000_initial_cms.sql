create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null
);

create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  copy text not null,
  image text not null,
  alt text not null,
  gallery jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0
);

create table if not exists public.home_slides (
  id uuid primary key,
  image text not null,
  alt text not null,
  label text not null,
  title text not null,
  type text not null,
  sort_order integer not null default 0
);

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.home_slides enable row level security;

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.site_content, public.projects, public.home_slides to anon, authenticated;
grant insert, update, delete on public.site_content, public.projects, public.home_slides to authenticated;
revoke all on function public.is_cms_admin() from public, anon;
grant execute on function public.is_cms_admin() to authenticated;

drop policy if exists "Admins can read their own access" on public.admin_users;
create policy "Admins can read their own access"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
  on public.site_content for select to anon, authenticated
  using (true);
drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
  on public.site_content for all to authenticated
  using ((select public.is_cms_admin()))
  with check ((select public.is_cms_admin()));

drop policy if exists "Anyone can read projects" on public.projects;
create policy "Anyone can read projects"
  on public.projects for select to anon, authenticated
  using (true);
drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
  on public.projects for all to authenticated
  using ((select public.is_cms_admin()))
  with check ((select public.is_cms_admin()));

drop policy if exists "Anyone can read home slides" on public.home_slides;
create policy "Anyone can read home slides"
  on public.home_slides for select to anon, authenticated
  using (true);
drop policy if exists "Admins can manage home slides" on public.home_slides;
create policy "Admins can manage home slides"
  on public.home_slides for all to authenticated
  using ((select public.is_cms_admin()))
  with check ((select public.is_cms_admin()));

insert into public.site_content (key, value) values
  ('home.intro', 'Kami mengubah ide menjadi karya digital yang berkesan, fungsional, dan dibuat untuk berkembang.'),
  ('about.lead', 'Kami menghubungkan desain, teknologi, dan cerita untuk membuat bisnis bergerak maju.'),
  ('about.storyLead', 'Zefanya Digital Work membantu brand dan bisnis hadir lebih kuat di dunia digital.'),
  ('about.storyBody', 'Kami menggabungkan ide, desain, dan teknologi untuk menghasilkan solusi yang bukan hanya terlihat menarik, tetapi juga benar-benar bekerja. Dari identitas visual hingga sistem digital, setiap detail dibuat dengan tujuan.'),
  ('about.storyNote', 'Konten ini adalah placeholder yang bisa disesuaikan dengan cerita, visi, dan perjalanan bisnis Anda.'),
  ('projects.lead', 'Jelajahi layanan dan portofolio kami. Pilih kategori untuk melihat halaman detail dan contoh karya.'),
  ('contact.lead', 'Ceritakan apa yang sedang Anda rencanakan. Kami akan membantu menemukan cara terbaik untuk mewujudkannya.'),
  ('contact.email', 'Creativestech79@gmail.com'),
  ('contact.emailHref', 'mailto:Creativestech79@gmail.com'),
  ('contact.phone', '0851 6274 4708'),
  ('contact.whatsappLink', 'https://wa.me/6285162744708'),
  ('contact.address', 'Jl. H. Abdullah No.77, RT.01, RW.05, Kelurahan Jatikramat, Kecamatan Jatiasih, Bekasi 17421'),
  ('footer.about', 'Ide baik layak diwujudkan dengan baik. Kami siap membantu bisnis Anda melangkah lebih jauh.'),
  ('footer.cta', 'bersama.')
on conflict (key) do nothing;

insert into public.projects (id, title, category, description, copy, image, alt, gallery, sort_order) values
  (
    'creative-design',
    'Creative Design',
    'Visual identity · Graphic design · Art direction',
    'Membangun identitas visual yang punya karakter, mudah diingat, dan terasa tepat untuk audiens Anda.',
    'Dari eksplorasi konsep hingga aset final, kami merancang pengalaman visual yang konsisten di setiap titik temu brand. Layanan ini mencakup strategi identitas, logo, sistem grafis, materi kampanye, dan art direction. Konten portofolio ini masih berupa placeholder dan akan diperbarui dengan proyek pilihan.',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=85',
    'Komposisi desain grafis penuh warna',
    '["https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85","https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85"]'::jsonb,
    0
  ),
  (
    'multimedia',
    'Multimedia',
    'Photo · Video · Motion',
    'Cerita brand yang terasa hidup melalui fotografi, video, dan konten bergerak.',
    'Kami membantu merencanakan dan memproduksi konten multimedia, mulai dari ide dan storyboard sampai proses editing. Baik untuk kampanye, dokumentasi, maupun konten sosial media, setiap cerita dirancang agar terasa autentik dan menarik. Konten portofolio ini masih berupa placeholder.',
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1600&q=85',
    'Produksi multimedia dan pengambilan gambar',
    '["https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85","https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=85"]'::jsonb,
    1
  ),
  (
    'it-solution',
    'IT Solution',
    'IT support · Consultation · Setup',
    'Teknologi yang tepat untuk membantu operasional bisnis berjalan lebih lancar.',
    'Kami menyediakan dukungan dan konsultasi teknologi sesuai kebutuhan bisnis, termasuk pengaturan perangkat, jaringan, dan solusi digital. Kami memulai dari memahami tantangan, lalu merekomendasikan pendekatan yang praktis dan mudah digunakan. Konten portofolio ini masih berupa placeholder.',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=85',
    'Tim bekerja bersama dalam solusi teknologi',
    '["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85","https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=85"]'::jsonb,
    2
  ),
  (
    'web-development',
    'Web Development',
    'Website · E-commerce · Web app',
    'Website yang cepat, responsif, dan dirancang untuk memberi pengalaman digital terbaik.',
    'Kami merancang dan membangun website yang menyatukan visual, kemudahan penggunaan, dan kebutuhan bisnis. Mulai dari landing page hingga e-commerce dan aplikasi web, setiap proyek dikembangkan agar nyaman digunakan di berbagai perangkat. Konten portofolio ini masih berupa placeholder.',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=85',
    'Tampilan website modern pada laptop',
    '["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85","https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85"]'::jsonb,
    3
  ),
  (
    'cctv-specialist',
    'CCTV Specialist',
    'Security camera · Installation · Monitoring',
    'Solusi CCTV yang membantu Anda memantau ruang dan menjaga keamanan dengan lebih tenang.',
    'Kami membantu merencanakan kebutuhan kamera pengawas, menentukan titik pemasangan, serta menyiapkan sistem pemantauan yang praktis. Solusi disesuaikan dengan kebutuhan rumah, kantor, maupun ruang usaha. Konten portofolio ini masih berupa placeholder.',
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=85',
    'Kamera keamanan untuk pemantauan area',
    '["https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1400&q=85","https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=85"]'::jsonb,
    4
  )
on conflict (id) do nothing;

insert into public.home_slides (id, image, alt, label, title, type, sort_order) values
  (
    '11111111-1111-4111-8111-111111111111',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1500&q=85',
    'Eksplorasi desain visual dengan warna-warna berani',
    'Visual identity',
    'A bold point of view',
    'Brand identity / 2025',
    0
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1500&q=85',
    'Produksi foto dan video untuk cerita sebuah brand',
    'Moving stories',
    'Stories in motion',
    'Multimedia / 2025',
    1
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1500&q=85',
    'Desain website modern pada layar laptop',
    'Digital experience',
    'Built for what’s next',
    'Web development / 2025',
    2
  )
on conflict (id) do nothing;

notify pgrst, 'reload schema';
