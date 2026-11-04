import { categoryMap } from "@/features/makan/lib/data";

/**
 * Photo placeholder: a warm gradient keyed to the category colour with the
 * category glyph. Real photos can replace this later via a `photo` field.
 */
export default function Thumb({
  category,
  className = "",
  size = "md",
  rounded = "rounded-2xl",
}: {
  category: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  rounded?: string;
}) {
  const cat = categoryMap[category];
  const color = cat?.color ?? "#e2552b";
  const emoji = cat?.emoji ?? "🍽️";
  const glyph = size === "lg" ? "text-6xl" : size === "sm" ? "text-2xl" : "text-4xl";

  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${rounded} ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 120% at 20% 10%, ${color}26 0%, ${color}14 45%, #ffffff00 100%), linear-gradient(140deg, ${color}1f, ${color}0a)`,
        backgroundColor: "#fff",
      }}
    >
      <span
        className="absolute -right-3 -bottom-4 select-none opacity-[0.13]"
        style={{ fontSize: size === "lg" ? 150 : 90, transform: "rotate(-8deg)" }}
        aria-hidden
      >
        {emoji}
      </span>
      <span className={`relative select-none ${glyph} drop-shadow-sm`} aria-hidden>
        {emoji}
      </span>
    </div>
  );
}
