-- PostgreSQL + PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE status_koordinat AS ENUM ('terverifikasi','perlu_cek_ulang','perlu_diisi_user');
CREATE TYPE asal_data AS ENUM ('resmi','osm','warga','kurasi','campuran');

CREATE TABLE tempat (
  id                TEXT PRIMARY KEY,          -- slug, mis. 'kes-rsud-embung-fatimah'
  nama              TEXT NOT NULL,
  nama_alternatif   TEXT[] DEFAULT '{}',
  kategori          TEXT NOT NULL,             -- belanja, ruang_publik, ibadah, pemakaman, transportasi, kesehatan,
                                               -- pendidikan, pemerintahan, akomodasi, olahraga, jasa, khas_batam
  subkategori       TEXT NOT NULL,
  tag               TEXT[] DEFAULT '{}',
  kecamatan         TEXT CHECK (kecamatan IN ('Batam Kota','Batu Aji','Batu Ampar','Belakang Padang','Bengkong',
                      'Bulang','Galang','Lubuk Baja','Nongsa','Sagulung','Sei Beduk','Sekupang')),
  kelurahan         TEXT,
  alamat            TEXT,
  lat               DOUBLE PRECISION,
  lng               DOUBLE PRECISION,
  geom              GEOGRAPHY(POINT,4326) GENERATED ALWAYS AS (
                      CASE WHEN lat IS NOT NULL AND lng IS NOT NULL
                      THEN ST_SetSRID(ST_MakePoint(lng,lat),4326)::geography END) STORED,
  status_koordinat  status_koordinat NOT NULL DEFAULT 'perlu_diisi_user',
  area_layanan      TEXT[] DEFAULT '{}',       -- jasa panggilan tanpa titik
  telepon           TEXT,
  whatsapp          TEXT,
  website           TEXT,
  opening_hours_osm TEXT,                      -- 'Mo-Th 07:30-16:00'
  jam_buka          JSONB,
  kode_resmi        JSONB DEFAULT '{}',        -- {"npsn":".."} / {"kode_rs":".."} / {"kode_puskesmas":".."}
  atribut           JSONB DEFAULT '{}',        -- kolom khusus per kategori, mis. {"tipe":"B","igd_24jam":true,"terima_bpjs":true}
  label_museum      JSONB DEFAULT '{}',        -- {"judul":"..","tahun":"..","keterangan":".."}
  asal_data         asal_data NOT NULL,
  sumber_url        TEXT[] DEFAULT '{}',
  osm_type          TEXT CHECK (osm_type IN ('node','way','relation')),
  osm_id            BIGINT,
  status_tempat     TEXT DEFAULT 'aktif' CHECK (status_tempat IN ('aktif','tutup_sementara','tutup','pindah','rencana')),
  terakhir_diverifikasi DATE,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (osm_type, osm_id)
);
CREATE INDEX ON tempat USING GIST (geom);
CREATE INDEX ON tempat (kategori, subkategori);
CREATE INDEX ON tempat USING GIN (atribut);

CREATE TABLE dokter (
  id TEXT PRIMARY KEY, nama TEXT NOT NULL, gelar TEXT,
  spesialisasi TEXT NOT NULL,  -- umum, gigi, obgyn, anak, kulit, tht, mata, penyakit_dalam, saraf, jantung,
                               -- ortopedi, psikiater, psikolog, fisioterapi, bidan, gizi, hewan
  bahasa TEXT[] DEFAULT '{id}', sumber_url TEXT[] DEFAULT '{}'
);
CREATE TABLE praktik (
  dokter_id TEXT REFERENCES dokter(id) ON DELETE CASCADE,
  tempat_id TEXT REFERENCES tempat(id) ON DELETE CASCADE,
  jadwal JSONB, terima_bpjs BOOLEAN, perlu_janji BOOLEAN,
  kanal_booking TEXT, terakhir_dicek DATE,
  PRIMARY KEY (dokter_id, tempat_id)
);
CREATE TABLE rekomendasi_warga (           -- Tukang Langganan, tanpa listing berbayar
  id BIGSERIAL PRIMARY KEY,
  tempat_id TEXT REFERENCES tempat(id) ON DELETE CASCADE,
  pemberi_alias TEXT, cerita TEXT NOT NULL, kisaran_harga TEXT, tanggal_pakai DATE,
  ada_hubungan_bisnis BOOLEAN NOT NULL DEFAULT false,   -- true = tidak ditampilkan
  status_moderasi TEXT DEFAULT 'menunggu' CHECK (status_moderasi IN ('menunggu','tampil','ditolak')),
  created_at TIMESTAMPTZ DEFAULT now()
);
