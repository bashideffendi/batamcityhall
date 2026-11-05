-- Konten yang dikelola pemilik lewat /admin: Jurnal, foto tempat makan, agenda, dan ubahan data makanan.
-- Semua tulisan lewat service role di server. Pembaca publik hanya melihat yang sudah terbit.

create table public.jurnal (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  judul text not null,
  penulis text not null,
  tanggal date not null,
  rubrik text not null,
  ringkasan text not null,
  gambar text,
  isi text not null,
  terbit boolean not null default false,
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now()
);

create table public.foto_tempat (
  id uuid primary key default gen_random_uuid(),
  tempat_id text not null,
  src text not null,
  w integer not null check (w > 0),
  h integer not null check (h > 0),
  alt text,
  kredit text,
  dibuat timestamptz not null default now()
);
create index foto_tempat_tempat on public.foto_tempat (tempat_id, dibuat);

create table public.agenda (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jenis text not null check (jenis in ('konser', 'festival', 'pameran', 'olahraga', 'komunitas', 'lainnya')),
  mulai date not null,
  selesai date,
  jam text,
  lokasi text not null,
  penyelenggara text,
  harga text,
  tautan text,
  keterangan text,
  terbit boolean not null default false,
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now()
);
create index agenda_mulai on public.agenda (mulai);

create table public.loker (
  id uuid primary key default gen_random_uuid(),
  posisi text not null,
  perusahaan text not null,
  jenis text not null check (jenis in ('penuh-waktu', 'paruh-waktu', 'kontrak', 'magang')),
  lokasi text not null,
  gaji text,
  syarat text,
  cara_melamar text not null,
  tautan text,
  tanggal date not null,
  batas date,
  terbit boolean not null default false,
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now()
);
create index loker_tanggal on public.loker (tanggal desc);

-- Ubahan data makanan dibaca saat build (scripts/ubahan-makan.ts), bukan oleh pengunjung.
create table public.makan_ubahan (
  tempat_id text primary key,
  baru boolean not null default false,
  data jsonb not null,
  diubah timestamptz not null default now()
);

alter table public.jurnal enable row level security;
alter table public.foto_tempat enable row level security;
alter table public.agenda enable row level security;
alter table public.makan_ubahan enable row level security;
alter table public.loker enable row level security;

create policy jurnal_baca on public.jurnal for select using (terbit);
create policy foto_baca on public.foto_tempat for select using (true);
create policy agenda_baca on public.agenda for select using (terbit);
create policy loker_baca on public.loker for select using (terbit);
-- makan_ubahan sengaja tanpa kebijakan: hanya service role.

insert into storage.buckets (id, name, public)
values ('konten', 'konten', true)
on conflict (id) do nothing;
