"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ErrorData } from "hls.js";
import {
  angkaMb,
  checkCam,
  loadHls,
  mbPerMenit as hitungMb,
  streamUrl,
  teksMbPerMenit,
  urutanJalur,
  type Cam,
  type CamCheck,
  type Jalur,
} from "@/features/langit-laut/lib/cctv";
import { IconClose } from "./icons";

// ---------------------------------------------------------------------------
// Pemutar CCTV (HLS = HTTP Live Streaming) — SATU stream saja, hidup cuma selama panel kebuka.
//
// Disiplin bandwidth (penting, baca sebelum ngutak-atik):
// stream ini ~2,4 Mbit/s (≈1 GB/jam) dan yang nanggung server sumber, BUKAN kita.
// Jadi: nggak ada grid, nggak ada autoplay banyak kamera, nggak ada prefetch video.
// Yang boleh: SATU playlist teks (~250 B) buat ngecek kameranya hidup — kalau mati/
// beku, NOL byte video ditarik. Player di-destroy pas ditutup, dan BERHENTI narik
// saat tab disembunyikan.
//
// Alur: checking (playlist + chunk hls.js paralel) → connecting (manifest) →
// fetching (segmen pertama, 0,2 sampai 9 MB) → playing. Gagal punya sebab & pesan sendiri-sendiri,
// plus tangga pemulihan (retry startLoad / recoverMediaError) sebelum menyerah.
//
// Dua jalur pemutar (lib/cctv.ts urutanJalur): hls.js dulu, termasuk di iPhone lewat ManagedMediaSource,
// lalu pemutar bawaan peramban. Gagal karena format atau media SEBELUM siaran tayang → coba jalur berikutnya.
// Gagal karena jaringan atau server tidak pindah jalur: jalur lain akan gagal juga dan menarik data dua kali.
// ---------------------------------------------------------------------------

type Props = {
  cam: Cam;
  onClose: () => void;
  /** Dipanggil kalau kamera terbukti mati/beku/hilang — buat menandai pin. */
  onDead?: (slug: string, lastSeen: number | null) => void;
  /** false = tampilkan tombol putar dulu, jangan tarik apa pun (mis. dibuka dari link ?cam=). */
  autoStart?: boolean;
  /** Perkiraan dari pemeriksaan server (app/api/cctv-status). null = belum diketahui. */
  mbPerMenit?: number | null;
};

type State =
  "idle" | "checking" | "connecting" | "fetching" | "playing" | "buffering" | "paused" | "blocked" | "dead" | "error";

type Verdict = CamCheck["verdict"];

const fmtLastSeen = (ms: number) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms)) + " WIB";

const fmtTime = (ms: number) =>
  new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }).format(
    new Date(ms),
  );

const wibDay = (ms: number) => new Date(ms + 7 * 3600 * 1000).toISOString().slice(0, 10);

/** Judul pesan kamera mati/beku/hilang (tanggal disebut kalau bukan hari ini). */
function deadTitle(verdict: Verdict, lastSeen: number | null): string {
  if (verdict === "beku") {
    if (!lastSeen) return "Gambar kamera membeku";
    return `Gambar membeku sejak ${wibDay(lastSeen) === wibDay(Date.now()) ? `${fmtTime(lastSeen)} WIB` : fmtLastSeen(lastSeen)}`;
  }
  if (verdict === "hilang") return "Kamera sudah tidak ada";
  return "Kamera tidak aktif";
}

export default function CctvPlayer({ cam, onClose, onDead, autoStart = true, mbPerMenit = null }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onDeadRef = useRef(onDead);
  useEffect(() => {
    onCloseRef.current = onClose;
    onDeadRef.current = onDead;
  });
  const titleId = useId();

  const [started, setStarted] = useState(autoStart);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>(autoStart ? "checking" : "idle");
  const [note, setNote] = useState<string | null>(null);
  /** detail teknis kegagalan (dilipat di "Info Teknis") */
  const [tech, setTech] = useState<string | null>(null);
  /** saran tindakan yang selalu terlihat di bawah pesan gagal */
  const [hint, setHint] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const [deadInfo, setDeadInfo] = useState<{ verdict: Verdict; lastSeen: number | null } | null>(null);
  /** Pemakaian data dari potongan yang benar-benar diunduh. Menggantikan perkiraan server. */
  const [mbTerukur, setMbTerukur] = useState<number | null>(null);
  const mb = mbTerukur ?? mbPerMenit;

  // Fokus: simpan elemen sebelumnya, fokus ke Tutup, kembalikan saat modal ditutup. Sekali saja.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      prev?.focus?.();
    };
  }, []);

  // Esc buat nutup + Tab dikurung di dalam modal (aria-modal cuma nyembunyiin dari SR,
  // keyboard masih bisa Tab ke peta di belakang).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, video, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !started) return;
    const url = streamUrl(cam.slug);
    type HlsCtorT = Awaited<ReturnType<typeof loadHls>>["default"];
    type HlsInstance = InstanceType<HlsCtorT>;
    let hls: HlsInstance | null = null;
    let jalur: Jalur | null = null;
    let cadangan: Jalur[] = [];
    /** Kegagalan jalur sebelumnya, untuk keterangan teknis. */
    const riwayat: string[] = [];
    // iPhone: tanpa MediaSource penuh, hls.js memakai ManagedMediaSource.
    const lewatMms = !("MediaSource" in window) && "ManagedMediaSource" in window;
    let cancelled = false;
    const ctrl = new AbortController();
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(t);
    };
    let hasPlayed = false;
    // sudah divonis (gagal/mati) → watchdog & pemantau macet jangan menimpa pesannya
    let settled = false;
    let firstFrag = false;
    let netRetries = 0;
    let mediaRecovered = false;
    let nonFatal: number[] = [];
    const t0 = performance.now();
    const debug = /[?&]debug=cctv/.test(window.location.search);
    const mark = (k: string) => {
      if (debug) console.debug(`[cctv ${cam.slug}] ${k} @ ${Math.round(performance.now() - t0)} ms`);
    };

    setState("checking");
    setNote(null);
    setTech(null);
    setHint(null);
    setShowRetry(false);
    setDeadInfo(null);

    // play() ditolak (kebijakan autoplay) BUKAN kegagalan stream — tampilkan tombol
    // putar. Setelah pernah jalan, penolakan berikutnya juga bukan error.
    const tryPlay = () =>
      video.play().catch(() => {
        // play() yang ditolak SESUDAH vonis gagal (sumber error) bukan soal autoplay
        if (!cancelled && !hasPlayed && !settled) setState("blocked");
      });
    const namaJalur = () =>
      jalur === null
        ? "pemeriksaan kamera"
        : jalur === "bawaan"
          ? "pemutar bawaan peramban"
          : `hls.js${lewatMms ? " lewat ManagedMediaSource" : ""}`;
    // Dideklarasikan di bawah (butuh HlsCtor); dipanggil fail() untuk pindah jalur.
    let jalankan: (j: Jalur) => void = () => {};
    /** bisaPindah: kegagalan karena format atau media, jadi jalur lain mungkin berhasil. */
    const fail = (msg: string, techNote?: string, hintText?: string, bisaPindah = false) => {
      if (cancelled || settled) return;
      const catatan = `${namaJalur()}: ${techNote ?? msg}`;
      if (bisaPindah && !hasPlayed && cadangan.length) {
        riwayat.push(catatan);
        mark(`pindah jalur: ${catatan}`);
        jalankan(cadangan.shift() as Jalur);
        return;
      }
      settled = true;
      // hls.js hanya stopLoad() pada galat fatal; sisa buffer jangan diputar di balik pesan
      if (hasPlayed) video.pause();
      setNote(msg);
      setTech([...riwayat, catatan].join(" · "));
      setHint(hintText ?? null);
      setShowRetry(true);
      setState("error");
    };
    const dead = (verdict: Verdict, lastSeen: number | null) => {
      if (cancelled) return;
      settled = true;
      if (hasPlayed) video.pause();
      setDeadInfo({ verdict, lastSeen });
      setState("dead");
      onDeadRef.current?.(cam.slug, lastSeen);
    };

    // --- event <video> ---
    const onPlaying = () => {
      if (settled) return; // sisa buffer sesudah vonis gagal tidak menghapus pesannya
      hasPlayed = true;
      firstFrag = true;
      netRetries = 0;
      mediaRecovered = false;
      setNote(null);
      setShowRetry(false);
      setState("playing");
      mark("playing");
    };
    const onPause = () => {
      // Pause manual/sistem SETELAH pernah jalan → cukup badge "Dijeda", kontrol native yang pegang.
      if (hasPlayed && !video.ended) setState((s) => (s === "playing" || s === "buffering" ? "paused" : s));
    };
    const onWaiting = () => {
      if (!hasPlayed || settled) return;
      later(() => {
        if (!settled && !video.paused && !video.ended && video.readyState < 3) setState("buffering");
      }, 1500);
    };
    const onVideoError = () => {
      if (jalur !== "bawaan" || cancelled) return; // jalur hls.js punya handler sendiri
      const code = video.error?.code;
      const pesan = video.error?.message ? ` (${video.error.message})` : "";
      // Kode 4 SEBELUM metadata bisa berarti gagal mengambil sumber atau format yang ditolak (H.265 dalam .ts,
      // playlist terlalu pendek). Blink & WebKit sama-sama memetakannya ke MEDIA_ERR_SRC_NOT_SUPPORTED.
      const beforeMeta = video.readyState < 1 || !firstFrag;
      if (code === 4 && beforeMeta)
        fail(
          "Belum bisa tersambung ke kamera",
          `Galat media kode 4 sebelum metadata termuat${pesan}.`,
          undefined,
          true,
        );
      else if (code === 3 || code === 4)
        fail(
          "Peramban ini belum bisa memutar kamera ini",
          `Galat media kode ${code}${pesan}.`,
          "Coba kamera lain.",
          true,
        );
      else
        fail(
          hasPlayed ? "Koneksi ke kamera terputus" : "Belum bisa tersambung ke kamera",
          `Galat media kode ${code ?? "?"}${pesan}.`,
        );
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onWaiting);
    video.addEventListener("error", onVideoError);

    // Watchdog: 10 detik tanpa potongan pertama → kabari, jangan diam. Loading tetap jalan.
    later(() => {
      if (!firstFrag && !settled) {
        setNote("Jaringan berat, masih dicoba");
        setShowRetry(true);
      }
    }, 10000);
    // Tersendat kelamaan setelah pernah jalan → jujur bilang macet.
    let stallTimer: number | null = null;
    const armStall = () => {
      if (stallTimer !== null) return;
      stallTimer = window.setTimeout(() => {
        stallTimer = null;
        if (cancelled || settled || video.paused) return;
        if (video.readyState < 3) {
          setNote("Siaran macet: kamera berhenti mengirim gambar atau sinyal putus.");
          setShowRetry(true);
        }
      }, 20000);
      timers.push(stallTimer);
    };
    const onProgress = () => {
      if (stallTimer !== null) {
        clearTimeout(stallTimer);
        stallTimer = null;
      }
    };
    video.addEventListener("timeupdate", onProgress);
    const stallObserver = () => {
      if (hasPlayed && !video.paused) armStall();
    };
    video.addEventListener("waiting", stallObserver);

    // Tab disembunyikan / app ke background → BERHENTI narik (bandwidth Pemko), pause.
    // Balik lagi → lompat ke live edge.
    const onVis = () => {
      if (cancelled) return;
      if (document.hidden) {
        hls?.stopLoad();
        video.pause();
      } else {
        if (hls) {
          hls.startLoad(-1);
          if (hasPlayed) tryPlay();
        } else if (hasPlayed) {
          video.src = url; // jalur native: buffer lama basi, set ulang
          tryPlay();
        }
      }
    };
    const onHide = () => {
      hls?.stopLoad();
      video.pause();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);

    (async () => {
      const [hlsMod, check] = await Promise.allSettled([loadHls(), checkCam(cam.slug, ctrl.signal)]);
      if (cancelled) return;
      mark("check+chunk");
      const v: CamCheck = check.status === "fulfilled" ? check.value : { verdict: "diam", lastSeen: null };
      if (v.verdict === "mati" || v.verdict === "beku" || v.verdict === "hilang") {
        dead(v.verdict, v.lastSeen);
        return; // NOL byte video
      }
      if (v.verdict === "server") {
        fail("Server kamera sedang gangguan");
        return;
      }
      // "diam" (timeout/offline) TIDAK memvonis kamera — tetap coba.

      const HlsCtor: HlsCtorT | null = hlsMod.status === "fulfilled" ? hlsMod.value.default : null;
      const nativeOk = video.canPlayType("application/vnd.apple.mpegurl") !== "";
      const urutan = urutanJalur(!!HlsCtor && HlsCtor.isSupported(), nativeOk);
      if (!urutan.length) {
        fail(
          "Peramban ini belum bisa memutar kamera ini",
          `Peramban tidak mendukung siaran HLS${hlsMod.status === "rejected" ? " dan pemutar hls.js gagal dimuat" : ""}.`,
          "Coba peramban lain.",
        );
        return;
      }

      // Bongkar jalur yang sedang jalan sebelum mencoba jalur lain.
      const lepas = () => {
        if (hls) {
          try {
            hls.destroy();
          } catch {
            /* abaikan */
          }
          hls = null;
        }
        if (video.hasAttribute("src")) {
          video.removeAttribute("src");
          video.load();
        }
      };

      const mulaiBawaan = () => {
        video.addEventListener(
          "loadedmetadata",
          () => {
            if (!cancelled) setState((s) => (s === "connecting" ? "fetching" : s));
          },
          { once: true },
        );
        video.addEventListener(
          "loadeddata",
          () => {
            firstFrag = true;
          },
          { once: true },
        );
        video.src = url;
        tryPlay();
      };

      const mulaiHls = (Hls: HlsCtorT) => {
        // Semua field policy WAJIB lengkap: mergeConfig hls.js cuma spread dangkal —
        // kalau timeoutRetry/errorRetry kosong, retry mati diam-diam.
        const pol = (ttfb: number, load: number, tRetry: number, eRetry: number) => ({
          default: {
            maxTimeToFirstByteMs: ttfb,
            maxLoadTimeMs: load,
            timeoutRetry: { maxNumRetry: tRetry, retryDelayMs: 0, maxRetryDelayMs: 0 },
            errorRetry: { maxNumRetry: eRetry, retryDelayMs: 1000, maxRetryDelayMs: 4000 },
          },
        });
        const h = new Hls({
          lowLatencyMode: false,
          backBufferLength: 10,
          maxBufferLength: 15, // jangan antre 30 dtk (≈9 MB) buat orang yang nutup setelah 5 dtk
          maxMaxBufferLength: 30,
          startFragPrefetch: true, // potongan pertama mulai turun begitu manifest ke-parse
          liveSyncDurationCount: 2,
          liveMaxLatencyDurationCount: 4, // wajib > liveSyncDurationCount
          liveMaxUnchangedPlaylistRefresh: 4,
          manifestLoadPolicy: pol(6000, 10000, 1, 1),
          playlistLoadPolicy: pol(6000, 10000, 2, 2),
          // 20 dtk per potongan 3 MB = butuh ≥1,2 Mbit/s; di bawah itu stream 2,4 Mbit/s memang mustahil real-time
          fragLoadPolicy: pol(8000, 20000, 1, 2),
        });
        hls = h;
        h.on(Hls.Events.MANIFEST_PARSED, () => {
          mark("manifest");
          setState((s) => (s === "connecting" ? "fetching" : s));
          tryPlay();
        });
        h.on(Hls.Events.FRAG_LOADED, (_e, d) => {
          // Pemakaian data dari potongan sungguhan. Perkiraan server bisa meleset untuk kamera ini.
          const terukur = hitungMb(d.frag.stats.loaded, d.frag.duration);
          if (terukur !== null) setMbTerukur(terukur);
          if (!firstFrag) {
            firstFrag = true;
            mark("frag1");
            setNote(null);
            setShowRetry(false);
          }
        });
        h.on(Hls.Events.ERROR, (_e, data: ErrorData) => {
          if (cancelled) return;
          if (!data.fatal) {
            const now = Date.now();
            nonFatal = nonFatal.filter((t) => now - t < 30000);
            nonFatal.push(now);
            if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR && hasPlayed && !settled) {
              setState("buffering");
              armStall();
            }
            if (nonFatal.length >= 3) setNote("Sinyal kamera putus-putus");
            return;
          }
          const code = data.response?.code ?? 0;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            if (code >= 400 && code < 500) {
              // 4xx nggak di-retry hls.js — dan memang jangan. Hanya 404 yang pasti "tidak ada";
              // 4xx lain (403 dsb.) belum tentu kamera mati.
              if (code === 404) dead("hilang", null);
              else fail("Kamera belum bisa diakses", `${data.details}, HTTP ${code}.`);
              return;
            }
            if (code >= 500) {
              fail("Server kamera sedang gangguan", `${data.details}, HTTP ${code}.`);
              return;
            }
            const timeout =
              data.details === Hls.ErrorDetails.FRAG_LOAD_TIMEOUT ||
              data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ||
              data.details === Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT;
            if (timeout && !firstFrag) {
              fail(
                "Sinyal kurang kuat untuk video ini",
                `${data.details}. Potongan pertama tidak selesai diunduh dalam 20 detik.`,
                "Coba lagi di jaringan yang lebih kuat, atau pilih kamera yang lebih hemat data.",
              );
              return;
            }
            if (netRetries < 2) {
              // kedip jaringan di tengah tontonan → nyambung ulang, tanpa buka-tutup modal
              const delay = netRetries === 0 ? 1000 : 3000;
              netRetries++;
              setState(hasPlayed ? "buffering" : "connecting");
              setNote("Koneksi sempat putus, menyambung ulang");
              const go = () => {
                if (cancelled) return;
                h.startLoad(-1);
                tryPlay();
              };
              if (navigator.onLine === false) window.addEventListener("online", () => later(go, 200), { once: true });
              else later(go, delay);
              return;
            }
            fail(hasPlayed ? "Koneksi ke kamera terputus" : "Belum bisa tersambung ke kamera", `${data.details}.`);
            return;
          }
          // Codec tidak didukung browser (sebagian kamera menyiarkan H.265): recover percuma,
          // dan ini BUKAN salah perangkat/jaringan — bilang apa adanya.
          const codecIssue =
            data.details === Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR ||
            data.details === Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR ||
            data.details === Hls.ErrorDetails.BUFFER_INCOMPATIBLE_CODECS_ERROR;
          if (codecIssue) {
            fail(
              "Format video belum didukung peramban ini",
              `${data.details}. Kamera ini menyiarkan H.265 (HEVC). Dukungannya bergantung pada peramban dan perangkat.`,
              "Coba peramban atau kamera lain.",
              true,
            );
            return;
          }
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            if (!mediaRecovered) {
              mediaRecovered = true;
              h.recoverMediaError();
              tryPlay();
              return;
            }
            fail("Peramban ini belum bisa memutar kamera ini", `${data.details}.`, "Coba kamera lain.", true);
            return;
          }
          fail("Siaran belum bisa diputar", `${data.type}/${data.details}.`, undefined, true);
        });
        // Urutan: loadSource dulu, baru attachMedia.
        h.loadSource(url);
        h.attachMedia(video);
      };

      jalankan = (j: Jalur) => {
        if (cancelled) return;
        lepas();
        jalur = j;
        firstFrag = false;
        netRetries = 0;
        mediaRecovered = false;
        nonFatal = [];
        setState("connecting");
        mark(`jalur ${namaJalur()}`);
        if (j === "hls.js" && HlsCtor) mulaiHls(HlsCtor);
        else mulaiBawaan();
      };
      cadangan = urutan.slice(1);
      jalankan(urutan[0]);
    })();

    // Bongkar total pas ditutup/ganti kamera — ini yang bikin tarikan ke server sumber berhenti.
    return () => {
      cancelled = true;
      ctrl.abort();
      for (const t of timers) clearTimeout(t);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onWaiting);
      video.removeEventListener("error", onVideoError);
      video.removeEventListener("timeupdate", onProgress);
      video.removeEventListener("waiting", stallObserver);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      try {
        hls?.destroy();
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch {
        /* abaikan */
      }
    };
  }, [cam.slug, attempt, started]);

  const retry = () => {
    setAttempt((n) => n + 1);
    setStarted(true);
  };

  const badge: { text: string; cls: string } =
    state === "playing"
      ? { text: "Siaran langsung", cls: "is-live" }
      : state === "buffering"
        ? { text: "Siaran tersendat", cls: "is-muted" }
        : state === "paused"
          ? { text: "Siaran dijeda", cls: "is-muted" }
          : state === "dead"
            ? { text: "Kamera tidak aktif", cls: "is-off" }
            : state === "error"
              ? { text: "Gagal diputar", cls: "is-off" }
              : state === "idle" || state === "blocked"
                ? { text: "Siap diputar", cls: "is-muted" }
                : { text: "Menyambung", cls: "is-muted" };

  const statusText =
    state === "checking"
      ? "Memeriksa kamera"
      : state === "connecting"
        ? "Menyambung"
        : state === "fetching"
          ? "Mengambil siaran"
          : state === "playing"
            ? `Siaran ${cam.name} tayang`
            : state === "buffering"
              ? "Tersendat, menunggu data"
              : state === "dead" && deadInfo
                ? deadTitle(deadInfo.verdict, deadInfo.lastSeen)
                : state === "error"
                  ? (note ?? "Siaran belum bisa diputar")
                  : "";

  const showLoading = state === "checking" || state === "connecting" || state === "fetching";

  return (
    <div className="cctv-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="cctv-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cctv-head">
          <div className="cctv-title">
            <h2 className="cctv-name" id={titleId}>
              {cam.name}
            </h2>
            <div className="cctv-sub">
              {cam.area}
              {cam.approx && " · Lokasi perkiraan"}
            </div>
          </div>
          <button ref={closeRef} className="cctv-close" onClick={onClose} aria-label="Tutup kamera">
            <IconClose />
          </button>
        </div>

        <div className="cctv-stage">
          <video ref={videoRef} className="cctv-video" playsInline muted autoPlay controls />

          {showLoading && (
            <div className="cctv-overlay">
              <div className="cctv-stage-text">{statusText}</div>
              {note && <div className="cctv-note">{note}</div>}
              {showRetry && (
                <button className="cctv-retry" onClick={retry}>
                  Muat Ulang
                </button>
              )}
            </div>
          )}

          {state === "buffering" && (
            <div className="cctv-chip" aria-hidden>
              Tersendat
            </div>
          )}

          {(state === "idle" || state === "blocked") && (
            <button
              className="cctv-overlay cctv-play"
              onClick={() => {
                if (!started) setStarted(true);
                // elemen sudah galat → putar ulang dari awal, bukan play() yang pasti ditolak
                else if (videoRef.current?.error) retry();
                else videoRef.current?.play().catch(() => setState("blocked"));
              }}
              aria-label="Putar kamera"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Ketuk untuk memutar
              {!started && (
                <span className="cctv-note">
                  {mb !== null
                    ? `Siaran ini memakai sekitar ${angkaMb(mb)} MB per menit.`
                    : "Siaran video memakai kuota data."}
                </span>
              )}
            </button>
          )}

          {state === "dead" && deadInfo && (
            <div className="cctv-overlay">
              <div className="cctv-stage-text">{deadTitle(deadInfo.verdict, deadInfo.lastSeen)}</div>
              <div className="cctv-note">
                {deadInfo.verdict !== "beku" && deadInfo.lastSeen
                  ? `Terakhir mengirim gambar ${fmtLastSeen(deadInfo.lastSeen)}. `
                  : ""}
                Coba kamera lain di sekitar situ.
              </div>
              <button className="cctv-retry" onClick={retry}>
                Periksa lagi
              </button>
            </div>
          )}

          {state === "error" && (
            <div className="cctv-overlay">
              <div className="cctv-stage-text">{note ?? "Siaran belum bisa diputar"}</div>
              {hint && <div className="cctv-note">{hint}</div>}
              {tech && (
                <details className="cctv-tech">
                  <summary>Keterangan teknis</summary>
                  {tech}
                </details>
              )}
              <button className="cctv-retry" onClick={retry}>
                Coba lagi
              </button>
            </div>
          )}
        </div>

        <div className="cctv-foot">
          <span className={`cctv-live ${badge.cls}`}>
            <span className="dot" /> {badge.text}
          </span>
          {mb !== null && <span className="cctv-credit">{teksMbPerMenit(mb)}</span>}
        </div>
        <div className="sr-only" role="status" aria-live="polite">
          {statusText}
        </div>
      </div>
    </div>
  );
}
