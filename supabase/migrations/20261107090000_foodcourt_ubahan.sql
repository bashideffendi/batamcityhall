-- Ubahan food court dari dashboard. Sama dengan makan_ubahan: digabung ke data/makan/foodcourt.json saat build
-- di Railway, berkas repo tidak berubah. Koordinat tidak disimpan di sini, diisi lewat lembar koordinat.
create table public.foodcourt_ubahan (
  foodcourt_id text primary key,
  baru boolean not null default false,
  data jsonb not null,
  diubah timestamptz not null default now()
);

alter table public.foodcourt_ubahan enable row level security;
-- Sengaja tanpa kebijakan: hanya service role.
