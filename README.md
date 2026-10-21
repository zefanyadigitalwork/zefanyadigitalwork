# Zefanya Digital Work

Website statis multi-halaman dengan portal admin, Supabase sebagai CMS/auth, dan Vercel sebagai hosting.

## Siapkan Supabase

1. Buat project di [Supabase](https://supabase.com/dashboard).
2. Buka **SQL Editor**, lalu jalankan seluruh isi `supabase/migrations/20261018000000_initial_cms.sql` dari repository ini.
   Migration ini membuat tabel CMS dan `admin_users`, mengisi konten awal, serta mengaktifkan Row Level Security (RLS). Jalankan sekali pada project Supabase yang digunakan website; jika login menampilkan `Could not find the table 'public.admin_users'`, jalankan migration ini lalu muat ulang portal admin.
3. Di **Authentication → Providers → Email**, nonaktifkan **Allow new users to sign up**.
4. Di **Authentication → URL Configuration**, isi Site URL dengan domain production Vercel Anda. Tambahkan alamat localhost dan domain preview Vercel ke daftar Redirect URLs jika akan menggunakan alur email Supabase.
5. Di **Authentication → Users**, buat user admin secara manual dan konfirmasikan alamat email jika diminta. Gunakan password unik yang hanya diketahui admin.
6. Salin UUID user tersebut, lalu tambahkan ke daftar admin melalui SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('UUID-USER-ADMIN-DARI-SUPABASE');
   ```

   Hanya user dalam `admin_users` yang dapat menulis konten. Jangan menambahkan service-role key ke website.
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

Buka alamat yang dicetak Vite, biasanya `http://localhost:5173`. Admin berada di `/admin` atau `/admin.html`.

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

- Pengunjung anonim hanya dapat membaca `site_content`, `projects`, dan `home_slides`.
- Penulisan, perubahan, dan penghapusan hanya diizinkan bagi user terautentikasi yang lolos pemeriksaan `public.is_cms_admin()`.
- Pendaftaran admin ditutup; akun dibuat dari dashboard Supabase dan admin harus ditambahkan manual ke `admin_users`.
- Perubahan konten tersimpan di Supabase sehingga dibagikan lintas browser dan perangkat.
