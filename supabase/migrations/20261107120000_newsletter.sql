-- Pelanggan newsletter dari kaki situs. Hanya alamat email dan tanggalnya (lihat /privasi).
create table public.newsletter (
  email text primary key check (char_length(email) <= 254),
  dibuat timestamptz not null default now()
);

alter table public.newsletter enable row level security;
-- Sengaja tanpa kebijakan: hanya service role yang menulis dan membaca.
