"use client";

import { useFavorites } from "@/features/makan/lib/favorites";

export default function FavButton({
  id,
  size = 36,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const active = has(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-label={active ? "Remove from saved" : "Save"}
      aria-pressed={active}
      className={`grid shrink-0 place-items-center rounded-full border border-line bg-card/90 backdrop-blur transition active:scale-90 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill={active ? "#e2552b" : "none"}
        stroke={active ? "#e2552b" : "#6b635e"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.5 0 5 3.5 3.5 6.5C19 15.65 12 20 12 20Z" />
      </svg>
    </button>
  );
}
