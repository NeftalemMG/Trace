import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Head from 'next/head';

const TELEMETRY_MSGS = [
  '> Scanning Windsor EV ecosystem...',
  '> GPT-4o fabricated "Direct Energy EV Windsor" — GHOST DETECTED',
  '> Gemini confidence: 95% | Accuracy: 40% — DANGER ZONE',
  '> Indigenous tech visibility score: 28/100',
  '> Hallucination pattern: fabricated_entity [CSMC, Waterloo]',
  '> Cross-referencing canada.ca database...',
  '> Turtle Island Technology — no verifiable entry found',
  '> Black founder query: attribution error detected',
  '> Perplexity: correctly identified COVE, BFN, Animikii',
  '> Equity gap: 54pt between Indigenous vs urban orgs',
  '> AiEO audit complete — 3 critical risks found',
  '> Generating schema markup recommendations...',
];

const PLATFORM_DATA = [
  { name: 'Gemini', accuracy: 40, confidence: 95, tag: 'MOST DANGEROUS', color: '#E63B2E' },
  { name: 'ChatGPT', accuracy: 55, confidence: 90, tag: 'HIGH RISK', color: '#F59E0B' },
  { name: 'Perplexity', accuracy: 65, confidence: 75, tag: 'MIXED', color: '#3B82F6' },
  { name: 'Claude', accuracy: 70, confidence: 45, tag: 'MOST HONEST', color: '#10B981' },
];

const TOOLS = [
  { number: '01', title: 'Query Engine', description: 'Run student queries. Detect hallucinations. Score risk across 4 AI platforms in real time.', href: '/query-engine' },
  { number: '02', title: 'Audit Tool', description: 'Get a full AiEO Visibility Score for any Canadian organization across 6 dimensions.', href: '/audit' },
  { number: '03', title: 'Hallucination Registry', description: 'Submit, browse, and classify documented AI hallucinations about Canadian opportunities.', href: '/registry' },
  { number: '04', title: 'Equity Map', description: 'Explore the 54-point gap in AI visibility between Indigenous communities and major urban ecosystems.', href: '/equity-map' },
  { number: '05', title: 'AiEO Guide', description: 'Generate schema markup, directory submissions, and content tactics to fix your AI footprint.', href: '/guide' },
];

function PlatformRow({ p, delay }: { p: typeof PLATFORM_DATA[0]; delay: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const dangerZone = p.confidence > p.accuracy + 25;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr 90px', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(232,228,221,0.06)' }}>
      <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, color: '#E8E4DD' }}>{p.name}</span>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase' }}>Accuracy</span>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: p.color, fontWeight: 700 }}>{p.accuracy}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: animated ? `${p.accuracy}%` : '0%', background: p.color, borderRadius: '2px', transition: `width 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms` }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase' }}>Confidence</span>
          <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: dangerZone ? '#E63B2E' : '#888' }}>{p.confidence}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: animated ? `${p.confidence}%` : '0%', background: dangerZone ? 'rgba(230,59,46,0.5)' : 'rgba(255,255,255,0.2)', borderRadius: '2px', transition: `width 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay + 150}ms` }} />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: p.color, textTransform: 'uppercase', letterSpacing: '0.06em', background: `${p.color}18`, borderRadius: '999px', padding: '3px 8px', display: 'inline-block' }}>{p.tag}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentMsg, setCurrentMsg] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const msg = TELEMETRY_MSGS[currentMsg];
    if (charIndex < msg.length) {
      const t = setTimeout(() => { setDisplayText(msg.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setCurrentMsg(m => (m + 1) % TELEMETRY_MSGS.length); setCharIndex(0); setDisplayText(''); }, 2200);
      return () => clearTimeout(t);
    }
  }, [currentMsg, charIndex]);

  return (
    <>
      <Head>
        <title>AiEO — AI Visibility Audit Platform</title>
        <meta name="description" content="The AiEO Visibility Audit Tool for Canadian organizations" />
      </Head>
      <Navbar />

      {/* ─── HERO: full-bleed image with text bottom-left ─── */}
      <section style={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 0 80px 0',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1800&q=85&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
        }} />
        {/* Gradient overlay: dark bottom-left, lighter top-right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(125deg, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.82) 40%, rgba(13,13,13,0.45) 70%, rgba(13,13,13,0.25) 100%)',
        }} />
        {/* Subtle red glow bottom-left */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 20% 90%, rgba(230,59,46,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Top-right: live telemetry card */}
        <div style={{
          position: 'absolute', top: '96px', right: '48px', width: '320px',
          background: 'rgba(13,13,13,0.82)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(230,59,46,0.25)', borderRadius: '1.25rem', padding: '20px',
          opacity: heroLoaded ? 1 : 0,
          transform: heroLoaded ? 'none' : 'translateY(16px)',
          transition: 'all 0.8s ease 0.5s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div className="pulse-dot" style={{ width: 7, height: 7, background: '#E63B2E', borderRadius: '50%' }} />
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Detection Feed</span>
          </div>
          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E8E4DD', lineHeight: 1.7, minHeight: '52px' }}>
            {displayText}<span className="cursor-blink" style={{ color: '#E63B2E' }}>█</span>
          </div>
        </div>

        {/* Top-left: four stat pills stacked */}
        <div style={{
          position: 'absolute', top: '96px', left: '48px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          opacity: heroLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          {[
            { val: '16+', label: 'Hallucinations documented' },
            { val: '54pt', label: 'Equity visibility gap' },
            { val: '5',   label: 'Ghost companies fabricated' },
            { val: '4',   label: 'AI platforms tested' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(13,13,13,0.72)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232,228,221,0.08)', borderRadius: '0.75rem',
              padding: '10px 16px',
            }}>
              <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', color: '#E63B2E', lineHeight: 1, minWidth: '44px' }}>{s.val}</span>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'rgba(232,228,221,0.65)', fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom-left: main headline */}
        <div style={{
          position: 'relative', zIndex: 2,
          padding: '0 48px',
          opacity: heroLoaded ? 1 : 0,
          transform: heroLoaded ? 'none' : 'translateY(32px)',
          transition: 'all 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.15s',
          maxWidth: '680px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#E63B2E', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              AI Visibility Audit Platform · University of Windsor · 2026
            </span>
          </div>

          <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(52px, 6vw, 88px)', color: '#E8E4DD', lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '6px' }}>
            AUDIT
          </h1>
          <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(62px, 7.5vw, 116px)', color: '#E63B2E', lineHeight: 0.88, letterSpacing: '0.04em', marginBottom: '28px' }}>
            THE PHANTOM.
          </h1>

          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', color: 'rgba(232,228,221,0.55)', lineHeight: 1.7, maxWidth: '500px', marginBottom: '36px' }}>
            When AI confidently misleads students about Canadian jobs, grants, and programs — the harm is real. AiEO scores, documents, and fixes AI visibility gaps.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/query-engine" style={{ textDecoration: 'none' }}>
              <button className="btn-magnetic" style={{ background: '#E63B2E', color: 'white', border: 'none', padding: '15px 32px', borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                Run a Query →
              </button>
            </Link>
            <Link href="/audit" style={{ textDecoration: 'none' }}>
              <button className="btn-magnetic" style={{ background: 'transparent', color: '#E8E4DD', border: '1.5px solid rgba(232,228,221,0.2)', padding: '15px 32px', borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
                Audit Your Org
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TOOLS SECTION ─── */}
      <section style={{ background: '#F5F3EE', padding: '100px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform Tools</span>
              <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: '#111', marginTop: '10px', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
                FIVE INSTRUMENTS.<br />ONE MISSION.
              </h2>
            </div>
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#888', maxWidth: '300px', lineHeight: 1.65 }}>
              Every tool runs real AI calls — no simulated data, no fake scores. Everything is live.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {TOOLS.map((tool) => (
              <Link key={tool.number} href={tool.href} style={{ textDecoration: 'none' }}>
                <div className="card-lift" style={{ background: '#E8E4DD', border: '1.5px solid rgba(17,17,17,0.08)', borderRadius: '2rem', padding: '36px', cursor: 'pointer', height: '100%' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E63B2E', letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>{tool.number}</div>
                  <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '21px', color: '#111', marginBottom: '12px', letterSpacing: '-0.01em' }}>{tool.title}</h3>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#666', lineHeight: 1.65, marginBottom: '24px' }}>{tool.description}</p>
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, color: '#E63B2E' }}>Open Tool →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESEARCH SECTION ─── */}
      <section style={{ background: '#111', padding: '100px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The Research</span>
              <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#F5F3EE', marginTop: '12px', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '24px' }}>
                WHAT WE FOUND.
              </h2>
              <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', color: 'rgba(245,243,238,0.5)', lineHeight: 1.7, marginBottom: '16px' }}>
                We tested ChatGPT (GPT-4o), Google Gemini, Perplexity AI, and Claude across 5 student queries targeting niche Canadian ecosystems: Windsor EV, Waterloo deep tech, Halifax ocean/biotech, Indigenous-led tech, and Toronto's Black entrepreneur ecosystem.
              </p>
              <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', color: 'rgba(245,243,238,0.5)', lineHeight: 1.7 }}>
                Every response was cross-referenced against official sources: company websites, LinkedIn, government databases, Crunchbase, and regional accelerator directories.
              </p>
            </div>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem', padding: '28px' }}>
                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Accuracy (Y) vs. Confidence (X)</span>
                  <span style={{ color: '#E63B2E' }}>Research 2026</span>
                </div>
                <svg viewBox="0 0 320 220" style={{ width: '100%' }}>
                  {/* Axis lines */}
                  <line x1="40" y1="10" x2="40" y2="185" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                  <line x1="40" y1="185" x2="310" y2="185" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                  {/* Grid lines */}
                  {[25,50,75,100].map(v => (
                    <g key={v}>
                      <line x1="40" y1={185 - (v/100)*175} x2="310" y2={185 - (v/100)*175} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                      <text x="34" y={185 - (v/100)*175 + 4} fill="#555" fontSize="8" fontFamily="Space Mono, monospace" textAnchor="end">{v}</text>
                    </g>
                  ))}
                  {[25,50,75,100].map(v => (
                    <g key={v}>
                      <line x1={40 + (v/100)*270} y1="10" x2={40 + (v/100)*270} y2="185" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                      <text x={40 + (v/100)*270} y="198" fill="#555" fontSize="8" fontFamily="Space Mono, monospace" textAnchor="middle">{v}</text>
                    </g>
                  ))}
                  {/* Danger zone: high confidence (>75), low accuracy (<60) */}
                  <rect x={40 + 0.75*270} y={185 - 0.60*175} width={0.25*270} height={0.60*175} fill="rgba(230,59,46,0.07)" stroke="rgba(230,59,46,0.2)" strokeWidth="1" strokeDasharray="3,2"/>
                  <text x={40 + 0.77*270} y={185 - 0.60*175 + 12} fill="rgba(230,59,46,0.5)" fontSize="7.5" fontFamily="Space Mono, monospace">DANGER</text>
                  <text x={40 + 0.77*270} y={185 - 0.60*175 + 22} fill="rgba(230,59,46,0.5)" fontSize="7.5" fontFamily="Space Mono, monospace">ZONE</text>
                  {/* Axis labels */}
                  <text x="8" y="100" fill="#666" fontSize="8" fontFamily="Space Mono, monospace" transform="rotate(-90 8 100)" textAnchor="middle">ACCURACY %</text>
                  <text x="175" y="215" fill="#666" fontSize="8" fontFamily="Space Mono, monospace" textAnchor="middle">CONFIDENCE %</text>
                  {/* Data points — cx = 40 + (confidence/100)*270, cy = 185 - (accuracy/100)*175 */}
                  {[
                    { name: 'Gemini',     accuracy: 40, confidence: 95, color: '#E63B2E' },
                    { name: 'ChatGPT',    accuracy: 55, confidence: 90, color: '#F59E0B' },
                    { name: 'Perplexity', accuracy: 65, confidence: 75, color: '#3B82F6' },
                    { name: 'Claude',     accuracy: 70, confidence: 45, color: '#10B981' },
                  ].map((p) => {
                    const cx = 40 + (p.confidence / 100) * 270;
                    const cy = 185 - (p.accuracy / 100) * 175;
                    // Label above for Gemini/ChatGPT (top-right), below-left for Claude/Perplexity
                    const labelX = p.name === 'Claude' ? cx - 8 : cx + 9;
                    const labelY = p.name === 'Gemini' ? cy - 10 : p.name === 'Claude' ? cy + 14 : cy + 4;
                    const anchor = p.name === 'Claude' ? 'end' : 'start';
                    return (
                      <g key={p.name}>
                        <circle cx={cx} cy={cy} r="14" fill={p.color} opacity="0.1" />
                        <circle cx={cx} cy={cy} r="6" fill={p.color} />
                        <text x={labelX} y={labelY} fill={p.color} fontSize="9.5" fontFamily="Space Mono, monospace" fontWeight="700" textAnchor={anchor}>{p.name}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#E8E4DD', padding: '48px', borderTop: '1px solid rgba(17,17,17,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '14px', fontWeight: 700, color: '#111' }}>
              Ai<span style={{ color: '#E63B2E' }}>EO</span>
            </span>
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>University of Windsor · March 2026</p>
          </div>
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#888' }}>Faisal Al-Durra · Neftalem Gebremical · Utkarsh Kanade</p>
        </div>
      </footer>
    </>
  );
}
