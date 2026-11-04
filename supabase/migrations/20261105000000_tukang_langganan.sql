-- Tukang Langganan, koreksi data, kiriman foto (research/00 bagian 4, CLAUDE_CODE_PROMPT 4.3 dan 7).
--
-- BELUM PERNAH DIJALANKAN di Postgres atau Supabase sungguhan: proyek Supabase belum ada.
-- Periksa dulu di proyek percobaan sebelum dipakai di produksi.
--
-- Aturan akses:
-- 1. Semua tabel memakai RLS tanpa satu pun policy, dan hak anon serta authenticated dicabut.
--    Jadi kunci anon tidak bisa membaca atau menulis tabel apa pun secara langsung.
-- 2. Semua tulisan warga lewat route server (service role, setelah validasi zod, honeypot, batas laju).
-- 3. Warga hanya membaca dua view: tukang_publik dan rekomendasi_publik. Keduanya menyebut kolom satu per
--    satu, jadi kontak perekomendasi dan kontak_hash tidak mungkin ikut. View sengaja berjalan dengan hak
--    pemiliknya (bukan security_invoker), karena itulah yang membuatnya bisa membaca tabel ber-RLS tertutup.
--    Linter Supabase akan memberi peringatan "security definer view": ini disengaja.
--
-- Syarat tampil di sini harus sama dengan syaratTampil() di features/tukang/aturan.ts.

create extension if not exists pgcrypto;

create type public.status_moderasi as enum ('menunggu', 'disetujui', 'ditolak');
create type public.subjek_persetujuan as enum ('perekomendasi', 'tukang', 'pengirim_koreksi', 'pengirim_foto');
create type public.aksi_persetujuan as enum ('setuju', 'cabut', 'hapus');
create type public.jenis_laporan as enum ('masih_buka', 'sudah_pindah', 'masalah');
create type public.status_tinjauan as enum ('baru', 'ditinjau');

create table public.tukang (
  id uuid primary key default gen_random_uuid(),
  -- Kunci pencocokan kiriman kedua dan seterusnya: lihat kunciTukang() di features/tukang/aturan.ts.
  kunci text not null unique,
  nama text not null check (char_length(nama) between 2 and 80),
  jasa text not null,
  area_kecamatan text[] not null check (
    cardinality(area_kecamatan) >= 1
    and area_kecamatan <@ array['Batam Kota', 'Batu Aji', 'Batu Ampar', 'Belakang Padang', 'Bengkong', 'Bulang',
      'Galang', 'Lubuk Baja', 'Nongsa', 'Sagulung', 'Sei Beduk', 'Sekupang']::text[]
  ),
  area_catatan text check (char_length(area_catatan) <= 120),
  panggilan boolean not null default false,
  cara_hubungi text not null check (char_length(cara_hubungi) between 3 and 120),
  status_moderasi public.status_moderasi not null default 'menunggu',
  -- Persetujuan tukang (WA singkat). Rinciannya di consent_log.
  izin_tukang_at timestamptz,
  kontak_boleh_tampil boolean not null default false,
  disembunyikan boolean not null default false,
  terakhir_dicek date,
  dibuat_at timestamptz not null default now()
);

create table public.rekomendasi (
  id uuid primary key default gen_random_uuid(),
  tukang_id uuid not null references public.tukang (id) on delete cascade,
  cerita text not null check (char_length(cerita) between 20 and 600),
  tag text[] not null default '{}',
  kapan_dipakai text not null check (kapan_dipakai ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  -- Data pribadi. Tidak pernah keluar lewat view, dan layar admin hanya menerima versi tersamar.
  kontak_perekomendasi text not null,
  -- Dasar hitungan "perekomendasi berbeda".
  kontak_hash text not null,
  status_moderasi public.status_moderasi not null default 'menunggu',
  dibuat_at timestamptz not null default now()
);
create index rekomendasi_tukang_idx on public.rekomendasi (tukang_id);
create index rekomendasi_kontak_hash_idx on public.rekomendasi (kontak_hash);

-- Log persetujuan. Sengaja tanpa kontak: baris ini tetap ada setelah data orangnya dihapus.
create table public.consent_log (
  id uuid primary key default gen_random_uuid(),
  subjek public.subjek_persetujuan not null,
  aksi public.aksi_persetujuan not null,
  tukang_id uuid references public.tukang (id) on delete set null,
  rekomendasi_id uuid references public.rekomendasi (id) on delete set null,
  versi_teks text not null,
  catatan text check (char_length(catatan) <= 300),
  dicatat_at timestamptz not null default now()
);

create table public.laporan (
  id uuid primary key default gen_random_uuid(),
  tukang_id uuid not null references public.tukang (id) on delete cascade,
  jenis public.jenis_laporan not null,
  alasan text check (char_length(alasan) <= 500),
  status public.status_tinjauan not null default 'baru',
  dibuat_at timestamptz not null default now()
);
create index laporan_tukang_idx on public.laporan (tukang_id);

create table public.koreksi_data (
  id uuid primary key default gen_random_uuid(),
  jenis text not null,
  -- id di data/places.json, bukan kunci asing: direktori masih berkas JSON statis.
  tempat_id text,
  tukang_id uuid references public.tukang (id) on delete set null,
  isi text not null check (char_length(isi) between 10 and 1500),
  kontak text,
  kontak_hash text,
  status public.status_tinjauan not null default 'baru',
  dibuat_at timestamptz not null default now()
);

-- Metadata dan izin saja. Berkas foto menyusul setelah ada bucket.
create table public.kiriman_foto (
  id uuid primary key default gen_random_uuid(),
  judul text not null check (char_length(judul) between 3 and 120),
  lokasi text not null check (char_length(lokasi) between 2 and 120),
  perkiraan_tahun text not null check (char_length(perkiraan_tahun) between 2 and 40),
  cerita text check (char_length(cerita) <= 800),
  kredit text not null check (char_length(kredit) between 2 and 80),
  kontak text not null,
  punya_hak boolean not null check (punya_hak),
  izin_tampil boolean not null check (izin_tampil),
  status public.status_tinjauan not null default 'baru',
  dibuat_at timestamptz not null default now()
);

alter table public.tukang enable row level security;
alter table public.rekomendasi enable row level security;
alter table public.consent_log enable row level security;
alter table public.laporan enable row level security;
alter table public.koreksi_data enable row level security;
alter table public.kiriman_foto enable row level security;

-- Supabase memberi hak bawaan yang lebar pada skema public. Dicabut supaya berlapis dengan RLS.
revoke all on public.tukang, public.rekomendasi, public.consent_log, public.laporan, public.koreksi_data,
  public.kiriman_foto from anon, authenticated;

create view public.tukang_publik with (security_barrier = true) as
select
  t.id,
  t.nama,
  t.jasa,
  t.area_kecamatan,
  t.area_catatan,
  t.panggilan,
  -- Kontak tukang hanya keluar kalau tukangnya mengizinkan.
  case when t.kontak_boleh_tampil then t.cara_hubungi end as cara_hubungi,
  t.terakhir_dicek,
  r.jumlah as jumlah_rekomendasi,
  coalesce(l.masih_buka, 0) as masih_buka,
  coalesce(l.sudah_pindah, 0) as sudah_pindah
from public.tukang t
join lateral (
  select count(distinct x.kontak_hash)::int as jumlah
  from public.rekomendasi x
  where x.tukang_id = t.id and x.status_moderasi = 'disetujui'
) r on r.jumlah >= 2
left join lateral (
  select
    count(*) filter (where y.jenis = 'masih_buka')::int as masih_buka,
    count(*) filter (where y.jenis = 'sudah_pindah')::int as sudah_pindah
  from public.laporan y
  where y.tukang_id = t.id
) l on true
where t.status_moderasi = 'disetujui'
  and t.izin_tukang_at is not null
  and not t.disembunyikan;

create view public.rekomendasi_publik with (security_barrier = true) as
select r.tukang_id, r.cerita, r.tag, r.kapan_dipakai, r.dibuat_at
from public.rekomendasi r
join public.tukang_publik t on t.id = r.tukang_id
where r.status_moderasi = 'disetujui';

revoke all on public.tukang_publik, public.rekomendasi_publik from anon, authenticated;
grant select on public.tukang_publik, public.rekomendasi_publik to anon, authenticated;

-- Moderator: buat pengguna di Supabase Auth, matikan pendaftaran terbuka, lalu isi
-- app_metadata = {"peran": "moderator"} (hanya bisa diubah lewat service role). Lihat aksesAdmin().
