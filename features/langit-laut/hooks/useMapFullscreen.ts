"use client";

import { useEffect, useRef, useState } from "react";

/** Overlay tetap menjaga instance WebGL dan waktu yang dipilih. */
export function useMapFullscreen() {
  const [full, setFull] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!full || !container.current) return;
    const el = container.current;
    const y = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const saved = { position: body.style.position, top: body.style.top, width: body.style.width,
      overflow: body.style.overflow, rootOverflow: root.style.overflow };
    body.style.position = "fixed";
    body.style.top = -y + "px";
    body.style.width = "100%";
    body.style.overflow = root.style.overflow = "hidden";
    // Nonaktifkan semua cabang di luar dialog, termasuk kepala situs.
    const outside: [HTMLElement, boolean][] = [];
    let branch: HTMLElement = el;
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling instanceof HTMLElement && sibling !== branch) {
          outside.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
      if (branch === body) break;
    }
    const tombol = button.current;
    tombol?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setFull(false); }
      if (e.key !== "Tab") return;
      const items = [...el.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')]
        .filter((item) => item.getClientRects().length && !item.closest('[inert]'));
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) {
        e.preventDefault(); first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      outside.forEach(([item, inert]) => { item.inert = inert; });
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.width = saved.width;
      body.style.overflow = saved.overflow;
      root.style.overflow = saved.rootOverflow;
      window.scrollTo({ top: y, behavior: "instant" });
      tombol?.focus({ preventScroll: true });
    };
  }, [full]);
  return { full, setFull, container, button };
}
