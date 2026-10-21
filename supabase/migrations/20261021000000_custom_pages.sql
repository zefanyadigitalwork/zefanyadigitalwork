create table if not exists public.custom_pages (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  body text not null,
  image text not null default '',
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.custom_pages enable row level security;

grant select on public.custom_pages to anon, authenticated;
grant insert, update, delete on public.custom_pages to authenticated;

drop policy if exists "Anyone can read custom pages" on public.custom_pages;
create policy "Anyone can read custom pages"
  on public.custom_pages for select to anon, authenticated
  using (true);

drop policy if exists "Admins can manage custom pages" on public.custom_pages;
create policy "Admins can manage custom pages"
  on public.custom_pages for all to authenticated
  using ((select public.is_cms_admin()))
  with check ((select public.is_cms_admin()));

notify pgrst, 'reload schema';
