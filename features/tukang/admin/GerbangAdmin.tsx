import type { AksesAdmin } from "../admin-auth";
import { modeKiriman } from "../mode";
import MasukAdmin from "./MasukAdmin";

/** Tampil kalau akses belum "masuk". Tidak memuat data apa pun. */
export default function GerbangAdmin({ akses }: { akses: Exclude<AksesAdmin, "masuk"> }) {
  return (
    <div className="bch-page bch-tk-halaman">
      <p className="bch-kicker m-0">Admin</p>
      <h1 className="mt-2">{akses === "tertutup" ? "Admin tertutup" : "Masuk"}</h1>
      {akses === "tertutup" ? (
        <p className="bch-lede" data-admin-tertutup>
          Halaman ini tertutup. Basis datanya belum tersambung.
        </p>
      ) : (
        <MasukAdmin pakaiEmail={modeKiriman() === "supabase"} />
      )}
    </div>
  );
}
