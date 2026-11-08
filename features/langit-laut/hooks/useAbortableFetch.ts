"use client";

import { useCallback, useRef } from "react";

const FETCH_TIMEOUT_MS = 15000;

/**
 * fetch JSON untuk SATU endpoint: panggilan baru membatalkan yang sebelumnya (respons lama
 * tidak boleh menimpa yang baru), dan ada timeout 15 detik supaya tidak menggantung.
 * Pembatalan melempar AbortError — pemanggil mengabaikannya lewat isAbort(). Timeout melempar TimeoutError,
 * yang bukan pembatalan, jadi pemanggil menampilkan galat dan tombol Coba Lagi, bukan "Memuat" terus.
 */
export function useAbortableFetch() {
  const ctrlRef = useRef<AbortController | null>(null);
  return useCallback(async <T>(url: string): Promise<T> => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    const timer = window.setTimeout(() => ctrl.abort(new DOMException("Waktu habis", "TimeoutError")), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
      if (!res.ok) throw new Error(`http ${res.status}`);
      return (await res.json()) as T;
    } finally {
      window.clearTimeout(timer);
      if (ctrlRef.current === ctrl) ctrlRef.current = null;
    }
  }, []);
}
