// Fallen Palette mark — a cheeky winged paint droplet with a slipping halo.
export default function FallenIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="fallen-icon" aria-hidden="true">
      <defs>
        <linearGradient id="fp-grad" x1="10" y1="10" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="34%" stopColor="#F4A024" />
          <stop offset="68%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* wings (behind the drop) */}
      <path d="M15 27 C 6 22, 2 27, 5 33 C 8 29, 12 30, 16 32 Z" fill="#5B5F93" opacity="0.85" />
      <path d="M33 27 C 42 22, 46 27, 43 33 C 40 29, 36 30, 32 32 Z" fill="#5B5F93" opacity="0.85" />

      {/* droplet body */}
      <path d="M24 11 C 24 11, 34 27, 34 33 A 10 10 0 1 1 14 33 C 14 27, 24 11, 24 11 Z" fill="url(#fp-grad)" />
      {/* glossy highlight */}
      <ellipse cx="20" cy="31" rx="2.6" ry="4.2" fill="#ffffff" opacity="0.35" transform="rotate(-18 20 31)" />

      {/* slipping halo */}
      <ellipse cx="26" cy="8" rx="9" ry="2.5" fill="none" stroke="#F5C542" strokeWidth="2.2" transform="rotate(-17 26 8)" />
    </svg>
  );
}
