// State awal halaman peta (client-only): URL (?view=&cam=) menang atas localStorage,
// dan semuanya divalidasi ketat terhadap daftar yang sah.
import { findCam, type Cam } from "./cctv";
import { PREF, readPref } from "./prefs";
import {
  VIEWS,
  VIEW_KEYS,
  defaultViewFor,
  type Mode,
  type ViewKey,
} from "./radar";

export type InitialState = {
  view: ViewKey;
  /** kamera dari link ?cam= (dibuka dengan tombol putar dulu, tidak auto-narik) */
  cam: Cam | null;
  collapsed: boolean;
  recentCams: Cam[];
  /** petunjuk "Ketuk Pin atau Angka…" masih perlu ditampilkan */
  camHint: boolean;
};

function readRecentCams(): Cam[] {
  try {
    const raw = JSON.parse(readPref(PREF.recentCams) ?? "[]");
    return (Array.isArray(raw) ? raw : [])
      .map((s) => findCam(String(s)))
      .filter((c): c is Cam => !!c)
      .slice(0, 3);
  } catch {
    return [];
  }
}

export function readInitialState(mode: Mode): InitialState {
  let urlView: ViewKey | null = null;
  let cam: Cam | null = null;
  try {
    const p = new URLSearchParams(window.location.search);
    const v = p.get("view");
    if (v && v in VIEWS) urlView = v as ViewKey;
    cam = findCam(p.get("cam"));
  } catch {
    /* abaikan */
  }

  // View yang tidak sah untuk halaman ini jatuh ke bawaannya: untuk CCTV itu kotak "kamera".
  let view: ViewKey = defaultViewFor(mode);
  const sv = readPref(PREF.view);
  if (urlView && VIEW_KEYS[mode].includes(urlView)) view = urlView;
  else if (sv && sv in VIEWS && VIEW_KEYS[mode].includes(sv as ViewKey)) view = sv as ViewKey;

  const recentCams = readRecentCams();
  return {
    view,
    cam,
    // Di ponsel lembar bawah mulai tertutup: peta penuh, judul, ringkasan, dan tab (PEDOMAN 4.6).
    collapsed: readPref(PREF.collapsed) !== "0",
    recentCams,
    // pernah memilih kamera = sudah paham, petunjuk tak perlu
    camHint: readPref(PREF.camHint) !== "1" && recentCams.length === 0,
  };
}
