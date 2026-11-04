"use client";

import { LabelBadge, HalalBadge } from "@/features/makan/components/Badges";
import { useI18n } from "@/features/makan/lib/i18n";
import { places, ferries } from "@/features/makan/lib/data";
import type { RecLabel } from "@/features/makan/lib/types";

export default function AboutPage() {
  const { lang } = useI18n();
  const id = lang === "id";

  return (
    <div className="no-scrollbar overflow-y-auto px-4 pb-28 pt-4 md:mx-auto md:max-w-2xl md:pb-10">
      <h1 className="text-2xl font-extrabold">
        {id ? "Tentang Batam Bites" : "About Batam Bites"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink/90">
        {id
          ? `Peta kuliner saku untuk Batam — dikurasi tangan, bukan hasil rata-rata rating anonim. ${places.length} warung legendaris, seafood, sup ikan, kopitiam, dan hidden gem, dipilih untuk turis yang baru turun dari ferry.`
          : `A pocket food map for Batam — hand-curated, not anonymous rating averages. ${places.length} legendary warungs, seafood, fish soup, kopitiam and hidden gems, picked for travellers fresh off the ferry.`}
      </p>

      <div className="mt-4 rounded-2xl border border-line bg-card p-4">
        <h2 className="text-sm font-extrabold">
          {id ? "🤝 Janji kurasi" : "🤝 Curation promise"}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          {id
            ? "Tanpa listing berbayar, tanpa endorse, tanpa bias iklan. Tujuannya satu: kasih tahu di mana makan enak, halal atau bukan, dan cara ke sananya."
            : "No paid listings, no sponsorships, no ad bias. One goal: tell you where to eat well, whether it's halal, and how to get there."}
        </p>
      </div>

      {/* Label legend */}
      <section className="mt-5">
        <h2 className="mb-2 text-sm font-extrabold">{id ? "Arti label" : "Label legend"}</h2>
        <div className="space-y-2">
          {([
            ["wajib-coba", id ? "Ikonik, jangan dilewatkan." : "Iconic, don't miss it."],
            ["legendaris", id ? "Sudah puluhan tahun, teruji waktu." : "Decades old, stood the test of time."],
            ["hits", id ? "Lagi viral / ramai diperbincangkan." : "Trending / buzzing right now."],
            ["hidden-gem", id ? "Tersembunyi tapi layak dicari." : "Tucked away but worth the hunt."],
          ] as [RecLabel, string][]).map(([l, desc]) => (
            <div key={l} className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2">
              <LabelBadge label={l} />
              <span className="text-[13px] text-muted">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Halal */}
      <section className="mt-5">
        <h2 className="mb-2 text-sm font-extrabold">{id ? "Status halal" : "Halal status"}</h2>
        <div className="flex flex-wrap gap-2">
          <HalalBadge status="halal" size="md" />
          <HalalBadge status="muslim-friendly" size="md" />
          <HalalBadge status="non-halal" size="md" />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">
          {id
            ? `"Ramah Muslim" = umumnya aman tapi tempatnya bisa menyajikan menu non-halal (mis. seafood/chinese yang juga jual babi/bak kut teh). Status halal adalah hasil kurasi terbaik — selalu konfirmasi langsung bila ragu.`
            : `"Muslim-Friendly" = generally fine but the venue may also serve non-halal items (e.g. seafood/Chinese spots that also sell pork/bak kut teh). Halal status is a best-effort call — always confirm on-site if unsure.`}
        </p>
      </section>

      {/* Ferry */}
      <section className="mt-5">
        <h2 className="mb-2 text-sm font-extrabold">⛴ {id ? "Terminal ferry" : "Ferry terminals"}</h2>
        <div className="space-y-2">
          {ferries.map((f) => (
            <div key={f.id} className="rounded-xl border border-line bg-card px-3 py-2.5">
              <div className="text-[13px] font-bold">{f.name}</div>
              <div className="mt-0.5 text-[12px] text-muted">{id ? f.blurb_id : f.blurb_en}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QRIS */}
      <section className="mt-5 rounded-2xl border border-teal/30 bg-teal/8 p-4">
        <h2 className="text-sm font-extrabold text-teal-dark">💳 QRIS Cross-Border</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink/85">
          {id
            ? "Turis dari Singapura (OCBC, UOB, DBS menyusul) & Malaysia (DuitNow) bisa scan QRIS pakai app bank sendiri — tanpa tukar uang, kurs kompetitif. Cari tanda QRIS di kasir warung."
            : "Travellers from Singapore (OCBC, UOB, DBS later) & Malaysia (DuitNow) can scan QRIS with their own bank app — no money changing, competitive rates. Look for the QRIS sign at the counter."}
        </p>
      </section>

      {/* Tips */}
      <section className="mt-5">
        <h2 className="mb-2 text-sm font-extrabold">💡 {id ? "Tips lokal" : "Local tips"}</h2>
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted">
          <li>• {id ? "Sup ikan & bubur sering habis siang — datang pagi." : "Fish soup & congee often sell out by noon — go early."}</li>
          <li>• {id ? "Di restoran seafood, selalu tanya harga per kg/porsi sebelum pesan." : "At seafood spots, always ask the price per kg/portion before ordering."}</li>
          <li>• {id ? "Tiket ferry akhir pekan cepat habis — pesan lebih awal." : "Weekend ferry tickets sell fast — book ahead."}</li>
          <li>• {id ? "Pin peta sebagian perkiraan; pakai tombol Navigasi untuk arah pasti." : "Some map pins are approximate; use Navigate for exact directions."}</li>
        </ul>
      </section>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
        {id
          ? "Rating & info dikumpulkan dari Google Maps, TripAdvisor & sumber lokal pertengahan 2026. Bisa berubah — verifikasi sebelum berangkat."
          : "Ratings & info gathered from Google Maps, TripAdvisor & local sources, mid-2026. Subject to change — verify before you go."}
      </p>
      <p className="mt-2 text-center text-[11px] font-bold text-muted">
        Batam<span className="text-brick">Bites</span> · made with ❤️ for Batam
      </p>
    </div>
  );
}
