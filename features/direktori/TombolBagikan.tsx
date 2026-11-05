"use client";

import { useState } from "react";

export default function TombolBagikan({ judul }: { judul: string }) {
  const [pesan, setPesan] = useState("");

  const bagikan = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: judul, url });
      else {
        await navigator.clipboard.writeText(url);
        setPesan("Tautan disalin");
      }
    } catch {
      // Dibatalkan pengguna.
    }
  };

  return (
    <>
      <button type="button" className="bch-btn" data-variant="ghost" onClick={bagikan}>
        Bagikan
      </button>
      {pesan && (
        <span className="bch-data self-center" role="status">
          {pesan}
        </span>
      )}
    </>
  );
}
