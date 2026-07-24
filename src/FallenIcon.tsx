// Fallen Palette mark — the hooded Fallen marine with a spilled palette.
// Image lives at /public/fallen-icon.png
export default function FallenIcon({ size = 48 }: { size?: number }) {
  return (
    <img
      src="/fallen-icon.png"
      width={size}
      height={size}
      alt="Fallen Palette"
      className="fallen-icon"
      draggable={false}
    />
  );
}
