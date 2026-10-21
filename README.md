# Zefanya Digital Work

Website statis multi-halaman dengan portal admin, Supabase sebagai CMS/auth, dan Vercel sebagai hosting.

## Siapkan Supabase

1. Buat project di [Supabase](https://supabase.com/dashboard).
2. Buka **SQL Editor**, lalu jalankan isi semua file `.sql` di `supabase/migrations/` dari repository ini, berurutan menurut nama file.
   Migration pertama membuat tabel CMS dan `admin_users`, mengisi konten awal, serta mengaktifkan Row Level Security (RLS). Migration `20261021000000_custom_pages.sql` menambahkan dukungan halaman khusus yang dikelola dari portal admin. Jalankan keduanya sekali pada project Supabase yang digunakan website.
   Jika CMS sudah pernah disiapkan, cukup jalankan migration baru `20261021000000_custom_pages.sql` agar tabel `custom_pages` tersedia.
3. Di **Authentication → Providers → Email**, nonaktifkan **Allow new users to sign up**.
4. Di **Authentication → URL Configuration**, isi Site URL dengan domain production Vercel Anda. Tambahkan alamat localhost dan domain preview Vercel ke daftar Redirect URLs jika akan menggunakan alur email Supabase.
5. Di **Authentication → Users**, pilih **Add user → Create new user**, lalu buat akun dengan email yang akan digunakan untuk login. Konfirmasikan email jika diminta, dan gunakan password unik yang hanya diketahui admin. Mengisi email di form login website tidak otomatis membuat akun Supabase.
6. Pada project Supabase yang sama, buka **Authentication → Users**, cari akun yang baru dibuat, lalu salin **User UID**. Tambahkan UID tersebut ke daftar admin melalui **SQL Editor**:

   ```sql
   insert into public.admin_users (user_id)
   values ('TEMPEL-USER-UID-DI-SINI')
   on conflict (user_id) do nothing;
   ```

   Jika tidak menemukan akun di **Authentication → Users**, buat dahulu seperti langkah 5. Pastikan juga project yang dibuka sama dengan project pada `VITE_SUPABASE_URL` di `.env.local` (lokal) atau Vercel (website live). Hanya user yang secara eksplisit ditambahkan ke `admin_users` yang dapat mengelola konten. Jangan memberikan akses admin kepada semua user dan jangan menambahkan service-role key ke website. Setelah query berhasil, muat ulang portal admin dan login kembali.
7. Dari **Project Settings → API**, salin Project URL dan **anon/publishable key**. Key ini memang digunakan oleh client website; aturan akses ditentukan oleh RLS.

## Jalankan lokal

```powershell
npm ci
Copy-Item .env.example .env.local
```

Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di `.env.local`, lalu jalankan:

```powershell
npm run dev
```

Buka alamat yang dicetak Vite, biasanya `http://localhost:5173`. Admin berada di `/admin` atau `/admin.html`. Halaman tambahan yang dibuat admin ditampilkan di `/page.html?slug=nama-halaman`.

Portal admin menyediakan editor terpisah untuk Home, About, Project, Contact, detail Project, Header, dan Footer, serta CRUD untuk data project, slide beranda, dan halaman tambahan. Halaman bawaan tetap tersedia dan dapat diedit; penghapusan hanya tersedia untuk data project, slide, dan halaman tambahan.

Perintah pemeriksaan dan build:

```powershell
npm run check
npm run build
npm run preview
```

## Deploy dari GitHub ke Vercel

1. Push repository ini ke GitHub.
2. Di [Vercel](https://vercel.com/dashboard), pilih **Add New → Project**, lalu import repository GitHub tersebut.
3. Vercel mendeteksi Vite; pengaturan proyek menggunakan `npm run build` dan direktori output `dist` (juga tercantum di `vercel.json`).
4. Di **Project Settings → Environment Variables**, tambahkan untuk Production, Preview, dan Development:
   - `VITE_SUPABASE_URL` — Project URL dari Supabase.
   - `VITE_SUPABASE_ANON_KEY` — anon/publishable key dari Supabase.
5. Deploy. Setelah project tersambung ke GitHub, push ke branch production memicu production deployment; pull request menghasilkan preview deployment.
6. Buka `https://domain-vercel-anda/admin` dan masuk memakai akun yang sudah ditambahkan ke `admin_users`.

Environment variables Vite ditanam saat proses build. Setelah mengubahnya, lakukan redeploy. Jangan pernah memasukkan `service_role` key ke environment variable berawalan `VITE_`, file frontend, GitHub, atau browser.

GitHub Actions menjalankan pemeriksaan sintaks dan build untuk setiap push ke `main` serta pull request. Deploy otomatis dikelola oleh integrasi Git Vercel.

## Akses database

- Pengunjung anonim hanya dapat membaca `site_content`, `projects`, `home_slides`, dan `custom_pages`.
- Penulisan, perubahan, dan penghapusan hanya diizinkan bagi user terautentikasi yang lolos pemeriksaan `public.is_cms_admin()`.
- Pendaftaran admin ditutup; akun dibuat dari dashboard Supabase dan admin harus ditambahkan manual ke `admin_users`.
- Perubahan konten tersimpan di Supabase sehingga dibagikan lintas browser dan perangkat.
