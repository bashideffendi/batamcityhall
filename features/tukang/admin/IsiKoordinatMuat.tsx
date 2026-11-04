"use client";

import dynamic from "next/dynamic";

// Peta dan draf di localStorage hanya ada di browser.
const IsiKoordinat = dynamic(() => import("./IsiKoordinat"), {
  ssr: false,
  loading: () => <p className="bch-data">Itik sedang berbaris…</p>,
});

export default IsiKoordinat;
