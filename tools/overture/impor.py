"""Impor tempat Batam dari Overture Maps Places ke data/tempat-terbuka.json.

Keputusan pemilik 9 Nov 2026: direktori diperbesar dengan data terbuka Overture (CDLA-Permissive-2.0, sebagian
Apache-2.0 dan CC0), bukan menyalin Google Maps. Kredit di Kolofon.

Pakai:
    pip install duckdb
    python -I tools/overture/impor.py                         # ambil langsung dari penyimpanan terbuka Overture
    python -I tools/overture/impor.py --parquet batam.parquet  # pakai hasil ambil sebelumnya

Aturan yang dijaga (lihat docs/PEDOMAN.md dan research/18-batam-co-id.md):
- Hanya jenis tempat umum. Jenis yang biasanya milik perorangan (agen properti, salon rumahan, jasa acara), hiburan
  malam, pijat, situs militer, dan kantor pemerintah atau darurat tidak diambil. Kantor pemerintah dan darurat sudah
  dikurasi di data/places.json dan lebih bisa dipercaya.
- Keyakinan sumber paling rendah 0,7. Titik harus di dalam salah satu dari 12 kecamatan Batam.
- Nomor ponsel tidak diambil, sesuai keputusan pemilik untuk tempat makan (PEDOMAN 8.3); hanya nomor telepon tetap.
- Tautan media sosial tidak diambil; situs web usaha boleh, kecuali situs pemerintah.
- Tempat yang sudah ada di data/places.json tidak ditambahkan lagi.
- Tidak ada data pajak.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import unicodedata
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RILIS = "2026-10-21.0"
KEYAKINAN_MIN = 0.7
# Kotak kasar sekitar Pulau Batam, Rempang, Galang, Bulang, Belakang Padang. Disaring lagi dengan poligon kecamatan.
KOTAK = (103.85, 0.55, 104.25, 1.215)

# basic_category Overture -> (kategori data kita, subkategori). Yang tidak ada di sini tidak diambil.
PETA: dict[str, tuple[str, str]] = {
    # Makan dan minum
    "restaurant": ("kuliner", "restoran"),
    "casual_eatery": ("kuliner", "rumah_makan"),
    "food_and_drink": ("kuliner", "rumah_makan"),
    "fast_food_restaurant": ("kuliner", "cepat_saji"),
    "coffee_shop": ("kuliner", "kafe"),
    "cafe": ("kuliner", "kafe"),
    "food_truck_stand": ("kuliner", "kedai_kaki_lima"),
    "non_alcoholic_beverage_venue": ("kuliner", "kedai_minuman"),
    "smoothie_juice_bar": ("kuliner", "kedai_minuman"),
    # Penginapan
    "hotel": ("akomodasi", "hotel"),
    "lodging": ("akomodasi", "penginapan"),
    "inn": ("akomodasi", "penginapan"),
    "resort": ("akomodasi", "resor"),
    # Pendidikan: jenjang ditentukan dari nama (jenjang_sekolah)
    "place_of_learning": ("pendidikan", "?"),
    "education": ("pendidikan", "?"),
    "elementary_school": ("pendidikan", "sd"),
    "middle_school": ("pendidikan", "smp"),
    "high_school": ("pendidikan", "sma"),
    "preschool": ("pendidikan", "tk_paud"),
    "college_university": ("pendidikan", "universitas"),
    "specialty_school": ("pendidikan", "kursus"),
    "educational_service": ("pendidikan", "kursus"),
    # Kesehatan
    "hospital": ("kesehatan", "rumah_sakit"),
    "dental_clinic": ("kesehatan", "klinik_gigi"),
    "health_care": ("kesehatan", "klinik"),
    "outpatient_care_facility": ("kesehatan", "klinik"),
    "medical_service": ("kesehatan", "klinik"),
    "primary_care_or_general_clinic": ("kesehatan", "klinik"),
    "pediatric_clinic": ("kesehatan", "klinik"),
    "vision_or_eye_care_clinic": ("kesehatan", "klinik"),
    "reproductive_perinatal_and_womens_care": ("kesehatan", "klinik"),
    "physical_medicine_and_rehabilitation": ("kesehatan", "klinik"),
    "specialized_medical_facility": ("kesehatan", "klinik"),
    "behavioral_or_mental_health_clinic": ("kesehatan", "klinik"),
    "emergency_or_urgent_care_facility": ("kesehatan", "klinik"),
    "diagnostics_imaging_or_lab_service": ("kesehatan", "laboratorium"),
    "pharmacy_and_drug_store": ("kesehatan", "apotek"),
    # Ibadah: jenis ditentukan dari nama (jenis_ibadah)
    "muslim_place_of_worship": ("ibadah", "masjid"),
    "christian_place_of_worship": ("ibadah", "gereja"),
    "buddhist_place_of_worship": ("ibadah", "vihara"),
    "hindu_place_of_worship": ("ibadah", "pura"),
    # Belanja
    "shopping_mall": ("belanja", "mal"),
    "department_store": ("belanja", "toserba"),
    "convenience_store": ("belanja", "minimarket"),
    "warehouse_club_store": ("belanja", "grosir"),
    "market": ("belanja", "pasar"),
    "farmers_market": ("belanja", "pasar"),
    "hardware_home_and_garden_store": ("belanja", "bahan_bangunan"),
    "electronics_store": ("belanja", "toko_elektronik"),
    "books_music_and_video_store": ("belanja", "buku_atk"),
    "office_supply_store": ("belanja", "buku_atk"),
    "sporting_goods_store": ("belanja", "toko_olahraga"),
    # Jasa
    "bank_or_credit_union": ("jasa", "bank"),
    "atm": ("jasa", "atm"),
    "automotive_service": ("jasa", "bengkel"),
    "vehicle_service": ("jasa", "bengkel"),
    "shipping_or_delivery_service": ("jasa", "ekspedisi"),
    # Transportasi
    "gas_station": ("transportasi", "spbu"),
    "fueling_station": ("transportasi", "spbu"),
    # Ruang publik, wisata, budaya
    "park": ("ruang_publik", "taman"),
    "garden": ("ruang_publik", "taman"),
    "playground": ("ruang_publik", "taman_bermain"),
    "public_plaza": ("ruang_publik", "alun_alun"),
    "beach": ("wisata", "pantai"),
    "amusement_park": ("wisata", "taman_hiburan"),
    "zoo": ("wisata", "kebun_binatang"),
    "aquarium": ("wisata", "akuarium"),
    "nature_reserve": ("wisata", "cagar_alam"),
    "movie_theater": ("wisata", "bioskop"),
    "museum": ("budaya", "museum"),
    "art_gallery": ("budaya", "galeri_seni"),
    "library": ("perpustakaan", "perpustakaan"),
    # Olahraga
    "gym": ("olahraga", "pusat_kebugaran"),
    "fitness_studio": ("olahraga", "pusat_kebugaran"),
    "sport_or_fitness_facility": ("olahraga", "pusat_kebugaran"),
    "swimming_pool": ("olahraga", "kolam_renang"),
    "golf_course": ("olahraga", "golf"),
    "stadium_arena": ("olahraga", "stadion"),
    "sport_court": ("olahraga", "lapangan"),
    "sport_field": ("olahraga", "lapangan"),
}

kata = lambda pola: re.compile(rf"(?<![a-z0-9])(?:{pola})(?![a-z0-9])", re.I)

# Jenis yang sudah dikurasi atau bukan tempat umum: tidak diambil walau kategorinya cocok. Perumahan dan kawasan
# industri sering tercatat sebagai penginapan atau taman di sumbernya; keduanya bukan tempat yang dicari di direktori.
NAMA_DILEWATI = kata(
    r"puskesmas|pustu|polsek|polres|polresta|polda|kantor camat|kecamatan|kelurahan|kantor lurah|kua|damkar|"
    r"pemadam|basarnas|tni|kodim|koramil|lanal|lantamal|lanud|denpom|yonif|brimob|kodam|dinas|disdukcapil|"
    r"imigrasi|samsat|bp batam|pemko|pemkot|dprd|kos|kost|kosan|kost-kostan|dijual|disewakan|for sale|for rent|"
    r"jual|sewa|lowongan|loker|promo|perum|perum\.|perumahan|cluster|blok|industries|industrial|industri|factory|"
    r"pabrik|bpjs|balai|balaibesar\w*|kementerian|kemenkes|kemenag"
)
KOMPLEKS = re.compile(r"^(komp|komplek|kompleks)\b\.?", re.I)
# Huruf Sirilik atau Yunani di nama tempat Batam hampir selalu nama spam yang menyamar.
HURUF_ASING_PALSU = re.compile(r"[Ͱ-ϿЀ-ӿ]")
# Praktik perorangan (dokter, bidan) tidak diambil: namanya nama orang.
PERORANGAN = re.compile(
    r"^(dr|drg|dokter|bidan|bd|ns)\b\.?|\b(sp\.?\s?og|spog|sp\.?\s?a|m\.?\s?kes|s\.?\s?ked|s\.?\s?pd)\b", re.I
)
PENGOBATAN_LAIN = kata(r"bekam|ruqyah|herbal|pijat|refleksi|spa|tradisional|akupunktur|akupuntur")
JENJANG = [
    ("slb", kata(r"slb|sekolah luar biasa")),
    ("tk_paud", kata(r"tk|tkit|paud|kb|ra|kindergarten|preschool|pre-school|playgroup|daycare|taman kanak-kanak")),
    ("sd", kata(r"sd|sdn|sdit|sds|mi|min|sekolah dasar|elementary|primary school")),
    ("smp", kata(r"smp|smpn|smpit|mts|mtsn|junior high")),
    ("smk", kata(r"smk|smkn|stm")),
    ("sma", kata(r"sma|sman|smait|ma|man|senior high|high school")),
    ("politeknik", kata(r"politeknik|polytechnic|poltek")),
    ("universitas", kata(r"universitas|university|sekolah tinggi|stie|stmik|stikes|akademi|kampus|institut teknologi")),
    ("pesantren", kata(r"pesantren|pondok|ponpes|boarding school")),
    ("kursus", kata(r"kursus|course|les|bimbel|bimbingan belajar|training|pelatihan|college|institute|academy|lembaga")),
]
SEKOLAH_UMUM = kata(r"sekolah|school|yayasan pendidikan|education center")
MUSALA = kata(r"musala|mushola|musholla|mushala|musalla|surau|langgar")
MASJID = kata(r"masjid|mesjid|mosque|مسجد")
GEREJA = kata(r"gereja|church|gpdi|hkbp|gbi|gki|gkpi|gpib|gkli|hki|gmim|bnkp|ministry|jemaat|kapel|chapel")
KATOLIK = kata(r"katolik|katholik|catholic|paroki|santo|santa|st\.?")
VIHARA = kata(r"vihara|wihara|cetiya|chan si|buddha|buddhist")
KELENTENG = kata(r"kelenteng|klenteng|tokong|bio|tua pek kong|dabogong|大伯公")
PURA = kata(r"pura|kuil|mandir|hindu|sri")
ADA_KATA = lambda pola: (lambda nama: bool(kata(pola).search(nama)))
OLAHRAGA = [
    ("pusat_kebugaran", kata(r"gym|fitness|fitnes|yoga|zumba|aerobic|pilates|crossfit|muay|boxing|martial")),
    ("kolam_renang", kata(r"kolam|swim|swimming|renang")),
    ("golf", kata(r"golf|driving range")),
    ("stadion", kata(r"stadion|stadium")),
    ("lapangan", kata(r"futsal|badminton|bulu tangkis|bulutangkis|lapangan|lap|gor|tenis|tennis|basket|arena|hall")),
]
# Media sosial dan halaman pihak ketiga (ensiklopedia, situs pemesanan, ulasan) bukan situs usaha itu sendiri.
SOSMED = re.compile(
    r"facebook\.|fb\.|instagram\.|linktr\.ee|wa\.me|whatsapp|tiktok\.|twitter\.|x\.com|youtube\.|google\.|goo\.gl|"
    r"bit\.ly|wiki|tripadvisor|booking\.com|agoda|traveloka|tiket\.com|oyorooms|reddoorz|airbnb|trip\.com|"
    r"foursquare|yelp|zomato|gofood|grabfood|shopee|tokopedia|bukalapak|lazada",
    re.I,
)
PEMERINTAH = re.compile(r"\.go\.id(/|$)", re.I)
NOMOR_DI_TEKS = re.compile(r"\d[\d\s().-]{6,}\d")
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿️‍]")


def jenjang_sekolah(nama: str, awal: str) -> str:
    """Jenjang dari nama. Nama tanpa jenjang memakai jenis dari Overture; yang umum tanpa jenjang jadi sekolah/kursus."""
    for sub, pola in JENJANG:
        if pola.search(nama):
            return sub
    if awal not in ("?", "universitas"):
        return awal
    # Nama tanpa kata sekolah atau jenjang (konsultan, yayasan, nama orang) tidak diambil.
    return "sekolah" if SEKOLAH_UMUM.search(nama) else None


def jenis_ibadah(nama: str, awal: str) -> str:
    """Nama lebih dipercaya daripada kategori sumber: di Overture ada gereja yang tercatat sebagai pura."""
    if MUSALA.search(nama):
        return "musala"
    if MASJID.search(nama):
        return "masjid"
    if GEREJA.search(nama) or KATOLIK.search(nama) and awal == "gereja":
        return "gereja_katolik" if KATOLIK.search(nama) else "gereja"
    if KELENTENG.search(nama):
        return "kelenteng"
    if VIHARA.search(nama):
        return "vihara"
    if PURA.search(nama) and awal == "pura":
        return "pura"
    return awal


PERUSAHAAN = re.compile(r"^(pt|cv)\b\.?", re.I)
MINIMARKET = kata(r"indomaret|alfamart|alfamidi|circle k|mini ?market|minimarket|lawson|family ?mart")


def jenis_dari_nama(kategori: str, sub: str, nama: str, kat: str) -> str | None:
    """Jenis akhir dari nama. None berarti tidak diambil: nama tidak cocok dengan jenis yang rawan salah di sumber."""
    # Nama PT atau CV di makan, belanja, penginapan, dan olahraga biasanya kantor perusahaan, bukan gerai.
    if kategori in ("kuliner", "belanja", "akomodasi", "olahraga") and PERUSAHAAN.search(nama):
        return None
    if kategori == "pendidikan":
        return jenjang_sekolah(nama, sub)
    if kategori == "ibadah":
        return jenis_ibadah(nama, sub)
    if kategori == "kuliner" and kata(r"cargo|kargo|ekspedisi|logistic|logistik|express").search(nama):
        return None
    if kategori == "kesehatan":
        pola_bukan = (
            r"tanah|beton|material|elektronika|komputer|mechanical|testing|cantik|beauty|kecantikan|skin ?care|"
            r"aesthetic|estetik|wellness|salon"
        )
        if PENGOBATAN_LAIN.search(nama) or kata(pola_bukan).search(nama):
            return None
        if kata(r"apotek|apotik|pharmacy|kimia farma|guardian|watsons|century").search(nama):
            return "apotek"
        if kata(r"dental|dentist|gigi").search(nama):
            return "klinik_gigi"
        if kata(r"rumah sakit|rs|rsia|rsu|rsud|rsb|hospital").search(nama):
            return "rumah_sakit"
        if sub == "laboratorium" and kata(r"lab|laborator|laboratorium|prodia|diagnos|diagnostic").search(nama):
            return "laboratorium"
        return "klinik"
    if kategori == "akomodasi":
        if kata(r"travel|tour|haji|umroh|umrah|informasi|deal|agency|agen").search(nama):
            return None
        if kata(r"resort|resor").search(nama):
            return "resor"
        if kata(r"hotel|suites|apartment|apartemen").search(nama):
            return "hotel"
        if kata(r"homestay|guest ?house|guesthouse|losmen|wisma|penginapan|inn|hostel|villa|cottage").search(nama):
            return "penginapan"
        # "lodging" di sumber banyak berisi nama kompleks dan alamat rumah: tanpa kata penginapan, tidak diambil.
        return sub if kat in ("hotel", "resort") else None
    if kategori == "olahraga":
        for jenis, pola in OLAHRAGA:
            if pola.search(nama):
                return jenis
        return None
    if kategori == "belanja":
        if MINIMARKET.search(nama):
            return "minimarket"
        if kata(r"pasar|pujasera|bazar").search(nama):
            return "pasar"
        if sub == "pasar":
            return None
        return "perabot_bangunan" if sub == "bahan_bangunan" else sub
    if kategori == "jasa" and sub in ("bank", "atm"):
        if re.match(r"^atm\b", nama, re.I):
            return "atm"
        pola = r"atm|bank|bca|bni|bri|mandiri|cimb|uob|ocbc|btn|bsi|maybank|danamon|permata|panin|mega|bjb|bpr"
        return sub if kata(pola).search(nama) or sub == "bank" else None
    if kategori == "transportasi":
        pola = r"spbu|spbg|spbn|pertamina|shell|vivo|bp|petronas|pom bensin|bensin"
        return "spbu" if kata(pola).search(nama) else None
    if kategori == "ruang_publik":
        # Di Batam "Taman ..." dan "... Park" sering nama perumahan. Hanya nama yang jelas ruang publik yang diambil.
        if kata(r"residen|residence|regency|villa|square|plaza|mall|peruman|gor|badminton").search(nama):
            return None
        if sub == "alun_alun" or kata(r"alun|bundaran|dataran").search(nama):
            return "alun_alun" if kata(r"alun|bundaran|dataran").search(nama) else None
        pola = r"taman kota|hutan kota|kebun raya|taman bermain|playground|bike park|taman rusa|taman wisata|taman tematik"
        return ("taman_bermain" if kata(r"playground|taman bermain").search(nama) else "taman") if kata(pola).search(nama) else None
    if kategori == "wisata":
        if sub == "bioskop":
            return "bioskop" if kata(r"xxi|cgv|cinema|cinemas|bioskop|cinepolis|21|studio 21").search(nama) else None
        if sub == "pantai":
            return "pantai" if kata(r"pantai|beach|pasir|coast|coastarina|tanjung|pulau").search(nama) else None
        return sub
    return sub


def rapikan_nama(nama: str) -> str:
    # NFKC mengubah huruf hias seperti "𝐏𝐞𝐫𝐮𝐦𝐚𝐡𝐚𝐧" menjadi huruf biasa.
    nama = EMOJI.sub("", unicodedata.normalize("NFKC", nama))
    # Nama dari situs pemesanan hotel menempelkan "NearPelabuhan ..." di ujungnya.
    nama = re.sub(r"(?<=[a-z)])Near(?=[A-Z]).*$", "", nama)
    return re.sub(r"\s+", " ", nama).strip(" -|·•")


def kunci_nama(nama: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", nama.lower()).strip()


KATA_UMUM = {"batam", "the", "dan", "and", "di", "kota", "cabang", "branch", "pt", "cv", "tbk", "indonesia"}


def token(nama: str) -> set[str]:
    return {t for t in kunci_nama(nama).split() if t not in KATA_UMUM and len(t) > 1}


def mirip(a: str, b: str) -> bool:
    ka, kb = kunci_nama(a), kunci_nama(b)
    if ka == kb or (len(ka) >= 5 and len(kb) >= 5 and (ka in kb or kb in ka)):
        return True
    ta, tb = token(a), token(b)
    return bool(ta and tb) and len(ta & tb) / len(ta | tb) >= 0.6


def jarak_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def telepon_tetap(daftar: list[str] | None) -> str | None:
    """Nomor telepon tetap Indonesia pertama, ditulis "(0778) 470303". Ponsel dan nomor luar negeri dibuang."""
    for mentah in daftar or []:
        angka = re.sub(r"\D", "", mentah or "")
        if angka.startswith("0"):
            angka = "62" + angka[1:]
        if not angka.startswith("62") or angka.startswith("628") or not 10 <= len(angka) <= 13:
            continue
        lokal = "0" + angka[2:]
        kode = 4 if lokal.startswith(("0778", "0779", "0771", "0770", "0776", "0777")) else 3
        return f"({lokal[:kode]}) {lokal[kode:]}"
    return None


def situs_usaha(daftar: list[str] | None) -> str | None:
    for u in daftar or []:
        if u and re.match(r"^https?://", u) and not SOSMED.search(u) and not PEMERINTAH.search(u):
            return u.rstrip("/")
    return None


def alamat_bersih(teks: str | None, nama: str) -> str | None:
    if not teks:
        return None
    t = re.sub(r"\s+", " ", EMOJI.sub("", teks)).strip(" ,")
    if not t or t.lower() == nama.lower() or NOMOR_DI_TEKS.search(t) and not re.search(r"no\.?\s*\d", t, re.I):
        return None
    if re.search(r"https?://|www\.", t, re.I):
        return None
    return t


# ---------- Kecamatan ----------


def muat_kecamatan() -> list[tuple[str, list[list[list[float]]]]]:
    g = json.loads((ROOT / "data/wilayah/kecamatan-kepri.geojson").read_text(encoding="utf-8"))
    hasil = []
    for f in g["features"]:
        if f["properties"].get("kab") != "Batam":
            continue
        geom = f["geometry"]
        polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        hasil.append((f["properties"]["name"], polys))
    return hasil


def di_cincin(x: float, y: float, cincin: list[list[float]]) -> bool:
    dalam = False
    j = len(cincin) - 1
    for i in range(len(cincin)):
        xi, yi = cincin[i][0], cincin[i][1]
        xj, yj = cincin[j][0], cincin[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            dalam = not dalam
        j = i
    return dalam


def kecamatan_dari(lng: float, lat: float, wilayah) -> str | None:
    for nama, polys in wilayah:
        for poly in polys:
            if di_cincin(lng, lat, poly[0]) and not any(di_cincin(lng, lat, lubang) for lubang in poly[1:]):
                return nama
    return None


# ---------- Ambil ----------


def ambil(parquet: str | None, rilis: str):
    import duckdb

    con = duckdb.connect()
    if parquet:
        sumber = f"read_parquet('{parquet}')"
    else:
        con.execute("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
        sumber = f"read_parquet('s3://overturemaps-us-west-2/release/{rilis}/theme=places/type=place/*', hive_partitioning=1)"
    x0, y0, x1, y1 = KOTAK
    return con.execute(
        f"""
        SELECT id, names.primary AS nama, basic_category AS kat, confidence AS yakin,
               (bbox.xmin + bbox.xmax) / 2 AS lng, (bbox.ymin + bbox.ymax) / 2 AS lat,
               phones, websites, addresses[1].freeform AS alamat, addresses[1].country AS negara,
               operating_status AS status
        FROM {sumber}
        WHERE bbox.xmin BETWEEN {x0} AND {x1} AND bbox.ymin BETWEEN {y0} AND {y1}
          AND confidence >= {KEYAKINAN_MIN}
        """
    ).fetchall()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--parquet", help="berkas parquet hasil ambil sebelumnya")
    ap.add_argument("--rilis", default=RILIS)
    ap.add_argument("--keluaran", default=str(ROOT / "data/tempat-terbuka.json"))
    arg = ap.parse_args()

    wilayah = muat_kecamatan()
    kurasi = [
        p for p in json.loads((ROOT / "data/places.json").read_text(encoding="utf-8")) if p.get("nama")
    ]
    hitung: dict[str, int] = {}
    tambah = lambda k: hitung.__setitem__(k, hitung.get(k, 0) + 1)

    calon = []
    for (oid, nama, kat, yakin, lng, lat, phones, websites, alamat, negara, status) in ambil(arg.parquet, arg.rilis):
        if kat not in PETA:
            tambah("jenis tidak diambil")
            continue
        if negara not in (None, "ID") or status in ("permanently_closed", "temporarily_closed"):
            tambah("luar negeri atau tutup")
            continue
        nama = rapikan_nama(nama or "")
        if len(nama) < 3 or len(nama) > 90 or NOMOR_DI_TEKS.search(nama) or re.search(r"https?://|www\.", nama, re.I):
            tambah("nama tidak layak")
            continue
        if NAMA_DILEWATI.search(nama) or KOMPLEKS.search(nama):
            tambah("jenis dikurasi atau bukan tempat umum")
            continue
        if HURUF_ASING_PALSU.search(nama) or PERORANGAN.search(nama):
            tambah("nama spam atau perorangan")
            continue
        kategori, sub_awal = PETA[kat]
        sub = jenis_dari_nama(kategori, sub_awal, nama, kat)
        if not sub:
            tambah("nama tidak cocok dengan jenisnya")
            continue
        kec = kecamatan_dari(lng, lat, wilayah)
        if not kec:
            tambah("di luar kecamatan Batam")
            continue
        calon.append(
            {
                "oid": oid,
                "nama": nama,
                "kategori": kategori,
                "sub": sub,
                "kecamatan": kec,
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "alamat": alamat_bersih(alamat, nama),
                "telepon": telepon_tetap(phones),
                "situs": situs_usaha(websites),
                "keyakinan": round(yakin, 2),
            }
        )

    # Ganda di dalam Overture: nama sama dalam 100 m, yang keyakinannya lebih tinggi menang.
    calon.sort(key=lambda c: -c["keyakinan"])
    unik: list[dict] = []
    per_kunci: dict[str, list[dict]] = {}
    for c in calon:
        k = kunci_nama(c["nama"])
        if any(jarak_m(c["lat"], c["lng"], u["lat"], u["lng"]) < 100 for u in per_kunci.get(k, [])):
            tambah("ganda di Overture")
            continue
        per_kunci.setdefault(k, []).append(c)
        unik.append(c)

    # Sudah ada di data kurasi: dalam 300 m dengan nama mirip, atau nama sama persis untuk tempat kurasi tanpa titik.
    hasil = []
    for c in unik:
        sama = False
        for p in kurasi:
            if p.get("lat") is not None:
                if jarak_m(c["lat"], c["lng"], p["lat"], p["lng"]) < 300 and mirip(c["nama"], p["nama"]):
                    sama = True
                    break
            elif p.get("kategori") == c["kategori"] and kunci_nama(p["nama"]) == kunci_nama(c["nama"]):
                sama = True
                break
        if sama:
            tambah("sudah ada di data kurasi")
            continue
        hasil.append(c)

    # Id stabil dari id Overture; 12 karakter heksa sudah cukup untuk beberapa ribu tempat, diperiksa unik.
    for c in hasil:
        c["id"] = "ov-" + c.pop("oid").replace("-", "")[:12]
    if len({c["id"] for c in hasil}) != len(hasil):
        print("id ganda, perpanjang potongan id", file=sys.stderr)
        return 1

    hasil.sort(key=lambda c: (c["kategori"], c["sub"], kunci_nama(c["nama"])))
    urutan = ["id", "nama", "kategori", "sub", "kecamatan", "lat", "lng", "alamat", "telepon", "situs", "keyakinan"]
    keluaran = {
        "sumber": {
            "nama": "Overture Maps Foundation",
            "rilis": arg.rilis,
            "lisensi": "CDLA-Permissive-2.0; sebagian Apache-2.0 dan CC0-1.0",
            "diambil": date.today().isoformat(),
        },
        "tempat": [{k: c[k] for k in urutan} for c in hasil],
    }
    Path(arg.keluaran).write_text(json.dumps(keluaran, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    per_kat: dict[str, int] = {}
    for c in hasil:
        per_kat[c["kategori"]] = per_kat.get(c["kategori"], 0) + 1
    print("ditulis", len(hasil), "tempat ke", arg.keluaran)
    print("per kategori", dict(sorted(per_kat.items(), key=lambda x: -x[1])))
    print("dilewati", hitung)
    print("bertelepon", sum(1 for c in hasil if c["telepon"]), "bersitus", sum(1 for c in hasil if c["situs"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
