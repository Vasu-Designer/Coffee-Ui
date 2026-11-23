import styles from './anchors.module.css';

/**
 * An invisible seat for the travelling coffee bean. Drop one into a section's
 * negative space; BeanJourney measures every seat and routes the bean through
 * them in document order. Positions live in anchors.module.css (separate
 * desktop and mobile layouts).
 */
export function JourneyAnchor({
  id,
  rotate = 0,
  focus,
  hold,
}: {
  id: string;
  /** Bean tilt in degrees while seated here. */
  rotate?: number;
  /** Viewport height fraction where the seat sits when the bean is "seated" (default 0.5). */
  focus?: number;
  /** Fraction of the viewport the bean stays glued to the seat on each side (default 0.2). */
  hold?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={styles.anchor}
      data-journey-anchor={id}
      data-journey-rotate={rotate}
      data-journey-focus={focus}
      data-journey-hold={hold}
    />
  );
}
