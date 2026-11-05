import type { ConditionsResponse, EchoSummary } from "@/features/langit-laut/lib/api-types";
import { rainyKec } from "@/features/langit-laut/lib/kecamatan";
import { arahLengkap, titleCase } from "@/features/langit-laut/lib/status";

const kecil = (s: string) => s.trim().toLowerCase();

// Prakiraan 2 jam, kualitas udara, indeks UV, dan angin berasal dari stasiun di Singapura, bukan pengukuran di
// Batam. Hujan terdekat dihitung dari radar. Keterangan di bawah tabel menyebutnya supaya tidak salah baca.
export default function KondisiSaatIni({
  data,
  error,
  echo,
}: {
  data: ConditionsResponse | null;
  error: boolean;
  kecamatanHujan?: string | null;
  echo: EchoSummary | null;
}) {
  const { nowcast, aq, uv, wind } = data ?? {};
  const terdekat = echo?.kec ? rainyKec(echo.kec)[0] : undefined;
  const baris: [string, string][] = [];
  if (nowcast) baris.push(["Prakiraan 2 jam", `${titleCase(nowcast.text)}, ${nowcast.area}`]);
  if (echo) baris.push(["Hujan terdekat", terdekat ? `Kecamatan ${terdekat.name}` : "Tidak ada di Batam"]);
  if (aq) baris.push(["Kualitas udara (PSI)", `${aq.psi}, ${kecil(aq.label)}`]);
  if (uv) baris.push(["Indeks UV", `${uv.value}, ${kecil(uv.label)}`]);
  if (wind) baris.push(["Angin", `${wind.speed} km/jam dari ${arahLengkap(wind.label)}`]);
  return (
    <section aria-labelledby="cu-kondisi">
      <h2 id="cu-kondisi">Kondisi Saat Ini</h2>
      {baris.length ? (
        <dl className="bch-tabel-info cu-tabel-rapat">
          {baris.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>{error ? "Data kondisi belum dapat dimuat." : "Memuat data"}</p>
      )}
      {(nowcast || aq || uv || wind) && <p className="cu-catatan">Kualitas udara, indeks UV, angin, dan prakiraan 2 jam diukur di Singapura.</p>}
    </section>
  );
}
