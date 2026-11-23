import type { ReactNode } from 'react';

/** Inline: **bold** and *italic*. Everything else is plain text (React escapes it). */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    out.push(tok.startsWith('**') ? <strong key={k++}>{tok.slice(2, -2)}</strong> : <em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Minimal, dependency-free renderer for journal posts: paragraphs,
 * `## headings` and `> pull quotes` (with an optional “— attribution”).
 */
export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const b = block.trim();
        if (b.startsWith('## ')) {
          const text = b.slice(3);
          return <h2 key={i} id={slugify(text)}>{inline(text)}</h2>;
        }
        if (b.startsWith('> ')) {
          const raw = b.replace(/^>\s?/gm, '');
          const [quote, cite] = raw.split(/\s+—\s+/);
          return (
            <blockquote key={i}>
              <p>{inline(quote.replace(/^“|”$/g, '').replace(/^"|"$/g, ''))}</p>
              {cite && <cite>— {cite}</cite>}
            </blockquote>
          );
        }
        return <p key={i}>{inline(b)}</p>;
      })}
    </>
  );
}

export const headingsOf = (source: string) =>
  source
    .split('\n')
    .filter((l) => l.startsWith('## '))
    .map((l) => ({ text: l.slice(3).trim(), id: slugify(l.slice(3).trim()) }));
