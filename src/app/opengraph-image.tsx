import { ImageResponse } from 'next/og';

export const alt = 'Kaapii Roasting Co. — single-estate Indian coffee, roasted by hand in Bengaluru';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 85% 10%, #6b4430 0%, #2f1c14 55%, #1a0f0a 100%)',
          color: '#f5eee2',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: '#dcc08a' }}>
          <svg width="56" height="56" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18.6" stroke="#dcc08a" strokeWidth="1.2" fill="none" />
            <g transform="rotate(-32 20 20.5)">
              <ellipse cx="20" cy="20.5" rx="7.6" ry="10.8" fill="#f5eee2" />
              <path d="M20.4 10.2c-3.6 3.4 3.8 8.6.1 12.2-2.4 2.3-1.6 5.5-.3 8.3" stroke="#2f1c14" strokeWidth="1.5" fill="none" />
            </g>
          </svg>
          Kaapii Roasting Co.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, lineHeight: 1, letterSpacing: -3 }}>
          <span>Slow coffee from</span>
          <span style={{ color: '#cf8f4c', fontStyle: 'italic' }}>the hills of South India.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: 'rgba(245,238,226,0.7)' }}>
          <span>Chikmagalur · Coorg · Araku · Nilgiris</span>
          <span>Roasted Mon · Wed · Fri</span>
        </div>
      </div>
    ),
    size,
  );
}
