import { redirect } from "next/navigation";

// Alamat pendek yang gampang diingat saat panik.
export default function Darurat() {
  redirect("/info/darurat");
}
