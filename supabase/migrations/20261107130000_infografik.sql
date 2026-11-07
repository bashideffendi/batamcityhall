-- Infografik unggahan dashboard. Infografik bawaan ada di repo (features/infografik/data.ts).
create table public.infografik (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  judul text not null,
  ringkasan text not null,
  rubrik text not null,
  tanggal date not null,
  gambar text not null,
  lebar integer not null check (lebar > 0),
  tinggi integer not null check (tinggi > 0),
  -- Isi infografik dalam teks, untuk pembaca layar.
  deskripsi text not null,
  terbit boolean not null default false,
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now()
);

alter table public.infografik enable row level security;
create policy infografik_baca on public.infografik for select using (terbit);
