import { Fragment } from "react";

/** Markdown sebaris dari data panduan: hanya **tebal**. */
export default function Teks({ isi }: { isi: string }) {
  return (
    <>
      {isi.split("**").map((bagian, i) => (
        <Fragment key={i}>{i % 2 === 1 ? <strong>{bagian}</strong> : bagian}</Fragment>
      ))}
    </>
  );
}
