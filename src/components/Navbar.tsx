import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { label: 'Query Engine', href: '/query-engine' },
    { label: 'Audit Tool', href: '/audit' },
    { label: 'Multi-Platform', href: '/multi-platform' },
    { label: 'Registry', href: '/registry' },
    { label: 'Equity Map', href: '/equity-map' },
    { label: 'AiEO Guide', href: '/guide' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        background: scrolled ? 'rgba(245,243,238,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        border: scrolled ? '1.5px solid rgba(17,17,17,0.1)' : '1.5px solid transparent',
        borderRadius: '999px',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '13px',
          fontWeight: 700,
          color: scrolled ? '#111' : '#F5F3EE',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transition: 'color 0.4s ease',
        }}>
          TR<span style={{ color: '#E63B2E' }}>ACE</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {nav.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#E63B2E' : scrolled ? '#444' : 'rgba(245,243,238,0.85)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: active ? 'rgba(230,59,46,0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = '#E63B2E';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = scrolled ? '#444' : 'rgba(245,243,238,0.85)';
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <Link href="/audit" style={{ textDecoration: 'none' }}>
        <button
          className="btn-magnetic"
          style={{
            background: '#E63B2E',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '999px',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Run Audit →
        </button>
      </Link>
    </nav>
  );
}
