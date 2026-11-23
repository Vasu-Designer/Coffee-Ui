import { Fragment, type ElementType, type ReactNode } from 'react';

type Line = string | { text: string; em?: boolean };

/**
 * Server-rendered word split for GSAP headline reveals. Each line can be a
 * string or an array of segments; segments flagged `em` render in italic.
 * Screen readers get the plain sentence via aria-label.
 */
export function SplitWords({
  as: Tag = 'h2',
  lines,
  className,
  delay,
  manual,
  id,
}: {
  as?: ElementType;
  lines: (Line | Line[])[];
  className?: string;
  delay?: number;
  manual?: boolean;
  id?: string;
}) {
  const flat = (l: Line | Line[]) => (Array.isArray(l) ? l : [l]).map((s) => (typeof s === 'string' ? s : s.text)).join(' ');
  const label = lines.map(flat).join(' ');

  const renderSegment = (seg: Line, key: number): ReactNode => {
    const text = typeof seg === 'string' ? seg : seg.text;
    const em = typeof seg !== 'string' && seg.em;
    const words = text.split(' ').filter(Boolean);
    return (
      <Fragment key={key}>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="split-word">{em ? <em>{w}</em> : w}</span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </Fragment>
    );
  };

  return (
    <Tag
      id={id}
      className={className}
      aria-label={label}
      {...(manual ? { 'data-split-manual': '' } : { 'data-split': '' })}
      data-delay={delay}
    >
      {lines.map((line, i) => (
        <span className="split-line" aria-hidden="true" key={i}>
          {(Array.isArray(line) ? line : [line]).map((seg, j) => (
            <Fragment key={j}>
              {j > 0 ? ' ' : null}
              {renderSegment(seg, j)}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
