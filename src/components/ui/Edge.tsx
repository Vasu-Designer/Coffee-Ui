/**
 * Organic “deckled paper” edge used between colour bands — a softer,
 * hand-cut take on a torn edge. `fill` should match the band it belongs to.
 */
export function Edge({
  fill = 'var(--band)',
  position = 'top',
  variant = 1,
  className,
}: {
  fill?: string;
  position?: 'top' | 'bottom';
  variant?: 1 | 2;
  className?: string;
}) {
  const d =
    variant === 1
      ? 'M0 46 C 60 38 110 52 170 44 S 290 30 350 40 S 460 56 540 44 S 660 26 740 36 S 860 54 940 42 S 1060 28 1140 38 S 1260 52 1330 40 S 1410 34 1440 38 V 64 H 0 Z'
      : 'M0 38 C 90 50 150 30 240 40 S 380 56 470 42 S 600 24 700 34 S 830 52 930 44 S 1060 26 1160 36 S 1300 50 1380 40 S 1430 36 1440 40 V 64 H 0 Z';
  return (
    <svg
      className={className}
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        height: 'clamp(22px, 3.6vw, 56px)',
        marginBottom: position === 'top' ? -1 : 0,
        marginTop: position === 'bottom' ? -1 : 0,
        transform: position === 'bottom' ? 'scaleY(-1)' : undefined,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <path d={d} fill={fill} />
    </svg>
  );
}
