import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const PRESET_QUERIES = [
  { label: 'Windsor EV Startups', query: 'What EV startups in Windsor Ontario are hiring new graduates for engineering or software roles?', community: 'General' },
  { label: 'Indigenous Tech Jobs', query: 'What are Indigenous-led technology companies in Canada hiring junior developers or offering internships?', community: 'Indigenous' },
  { label: 'Toronto Black Founders', query: 'What startups founded by Black entrepreneurs in Toronto are growing and hiring in 2024?', community: 'Black founders' },
  { label: 'Halifax Ocean/Biotech', query: 'What ocean technology or biotech co-op positions are available in Halifax Nova Scotia for recent graduates?', community: 'General' },
  { label: 'Waterloo AI Startups', query: 'Beyond the big names, what AI startups in Waterloo Ontario have open junior software positions?', community: 'General' },
];

const PLATFORM_META: Record<string, { color: string; label: string; note: string; free: boolean }> = {
  claude:    { color: '#E8A87C', label: 'Claude (Sonnet)',     note: 'Live API · claude-sonnet-4-20250514',                              free: true  },
  perplexity:{ color: '#3B82F6', label: 'Perplexity (Sonar)', note: 'Live API · sonar model · needs PERPLEXITY_API_KEY',                free: true  },
  gemini:    { color: '#10B981', label: 'Google Gemini',       note: 'Live API · gemini-1.5-flash · needs GEMINI_API_KEY',              free: true  },
  chatgpt:   { color: '#F59E0B', label: 'ChatGPT (GPT-4o)',   note: 'Live API · gpt-4o · needs OPENAI_API_KEY',                        free: false },
};

const RISK_COLORS: Record<string, string> = { low: '#10B981', medium: '#F59E0B', high: '#E63B2E', critical: '#E63B2E' };

function PlatformCard({ platform, response, score, apiKeysConfigured }: {
  platform: string;
  response: string;
  score?: any;
  apiKeysConfigured: Record<string, boolean>;
}) {
  const meta = PLATFORM_META[platform];
  const [expanded, setExpanded] = useState(true);
  const isConfigured = platform === 'claude' || platform === 'chatgpt' || apiKeysConfigured[platform];
  const isApiError = response?.includes('not configured') || response?.includes('API error');

  return (
    <div style={{
      background: '#E8E4DD',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      border: `1.5px solid ${isApiError ? 'rgba(245,158,11,0.3)' : 'rgba(17,17,17,0.08)'}`,
    }}>
      {/* Card header */}
      <div style={{ background: '#111', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color }} />
          <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '14px', color: '#E8E4DD' }}>{meta.label}</span>
          {!isConfigured && (
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#F59E0B', background: 'rgba(245,158,11,0.12)', borderRadius: '999px', padding: '2px 8px' }}>NEEDS API KEY</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {score && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: RISK_COLORS[score.hallucination_risk] || '#E8E4DD', lineHeight: 1 }}>{score.visibility_score}</div>
              <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Visibility</div>
            </div>
          )}
          <button onClick={() => setExpanded(e => !e)} style={{ background: 'rgba(255,255,255,0.07)', color: '#E8E4DD', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>
            {expanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Score pills row */}
      {score && (
        <div style={{ background: '#0D0D0D', padding: '10px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Accuracy</span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: RISK_COLORS[score.hallucination_risk], fontWeight: 700 }}>{score.accuracy_estimate}%</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Confidence</span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E8E4DD', fontWeight: 700 }}>{score.confidence_level}%</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Hallucination Risk</span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: RISK_COLORS[score.hallucination_risk], fontWeight: 700, textTransform: 'uppercase' }}>{score.hallucination_risk}</span>
          </div>
          {score.entities_named?.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Named:</span>
              {score.entities_named.slice(0, 4).map((e: string, i: number) => (
                <span key={i} style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', padding: '2px 7px' }}>{e}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Response text */}
      {expanded && (
        <div style={{ padding: '20px', maxHeight: '300px', overflowY: 'auto' }}>
          {isApiError ? (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '14px' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#F59E0B', lineHeight: 1.6 }}>{response}</p>
              {platform === 'perplexity' && (
                <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  Get a free Perplexity API key at <strong>perplexity.ai/settings/api</strong> → add as PERPLEXITY_API_KEY in .env.local
                </p>
              )}
              {platform === 'gemini' && (
                <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  Get a free Gemini API key at <strong>aistudio.google.com/app/apikey</strong> → add as GEMINI_API_KEY in .env.local
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#444', lineHeight: 1.7, margin: 0 }}>
              {response}
            </p>
          )}
        </div>
      )}

      {/* Key issues */}
      {expanded && score?.key_issues?.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(17,17,17,0.07)', padding: '12px 20px', background: 'rgba(230,59,46,0.03)' }}>
          {score.key_issues.map((issue: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
              <span style={{ color: '#E63B2E', fontSize: '12px', flexShrink: 0 }}>!</span>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#888' }}>{issue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      <div style={{ padding: '8px 20px 12px', borderTop: '1px solid rgba(17,17,17,0.05)' }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{meta.note}</span>
      </div>
    </div>
  );
}

export default function MultiPlatform() {
  const [query, setQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['claude', 'perplexity', 'gemini', 'chatgpt']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleRun = async () => {
    if (!query.trim() || selectedPlatforms.length === 0) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/multi-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, platforms: selectedPlatforms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const analysis = result?.analysis;

  return (
    <>
      <Head><title>Multi-Platform Comparison — AiEO</title></Head>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#F5F3EE', paddingTop: '100px' }}>
        {/* Header */}
        <div style={{ background: '#0D0D0D', padding: '60px 48px 48px', position: 'relative', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <pattern id="hgrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(232,228,221,0.04)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hgrid)" />
          </svg>
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="pulse-dot" style={{ width: 8, height: 8, background: '#E63B2E', borderRadius: '50%' }} />
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Tool 03 — Multi-Platform Visibility Test
              </span>
            </div>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 60px)', color: '#E8E4DD', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              HOW DOES YOUR<br />QUERY LAND?
            </h1>
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', color: 'rgba(232,228,221,0.5)', maxWidth: '560px', lineHeight: 1.6, marginBottom: '24px' }}>
              Run the same query across Claude, Perplexity, Gemini, and a research-accurate GPT-4o - then compare accuracy, confidence, and hallucination risk side by side.
            </p>
            {/* API key status */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(PLATFORM_META).map(([key, meta]) => {
                const isLive = key === 'claude' || (result?.api_keys_configured?.[key]);
                const notConfigured = result && !result.api_keys_configured?.[key] && key !== 'claude' && key !== 'chatgpt';
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '5px 12px', border: `1px solid ${notConfigured ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: notConfigured ? '#F59E0B' : meta.color }} />
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: notConfigured ? '#F59E0B' : '#888', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      {meta.label.split(' ')[0]}{notConfigured ? ' — needs key' : key === 'chatgpt'} {/* removed this - ? ' — simulated' : ''  */}
                    </span>
                   
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

          {/* Preset selector */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Research Query Presets
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESET_QUERIES.map((p, i) => (
                <button key={i} onClick={() => { setSelectedPreset(i); setQuery(p.query); }}
                  style={{ background: selectedPreset === i ? '#E63B2E' : '#E8E4DD', color: selectedPreset === i ? 'white' : '#444', border: selectedPreset === i ? 'none' : '1.5px solid rgba(17,17,17,0.12)', borderRadius: '999px', padding: '8px 16px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Query input + platform toggles */}
          <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '32px', marginBottom: '32px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
                Query
              </label>
              <textarea className="input-raw" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="e.g. What Indigenous-led tech companies in Canada are hiring junior developers?"
                rows={3} style={{ width: '100%', padding: '14px 16px', fontSize: '15px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  Platforms to Test
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(PLATFORM_META).map(([key, meta]) => (
                    <button key={key} onClick={() => togglePlatform(key)} style={{
                      background: selectedPlatforms.includes(key) ? meta.color : 'transparent',
                      color: selectedPlatforms.includes(key) ? 'white' : '#666',
                      border: `1.5px solid ${selectedPlatforms.includes(key) ? meta.color : 'rgba(17,17,17,0.15)'}`,
                      borderRadius: '999px', padding: '7px 16px',
                      fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}>
                      {meta.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn-magnetic" onClick={handleRun}
                disabled={loading || !query.trim() || selectedPlatforms.length === 0}
                style={{ background: loading || !query.trim() ? '#ccc' : '#E63B2E', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', fontWeight: 600, cursor: loading || !query.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                {loading ? `Running ${selectedPlatforms.length} platforms...` : `Compare ${selectedPlatforms.length} Platforms →`}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ background: '#111', borderRadius: '2rem', padding: '48px', textAlign: 'center', marginBottom: '32px' }}>
              <div className="pulse-dot" style={{ width: 12, height: 12, background: '#E63B2E', borderRadius: '50%', margin: '0 auto 20px' }} />
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
                Querying {selectedPlatforms.length} AI platforms simultaneously...
              </p>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#555' }}>
                {selectedPlatforms.map(p => PLATFORM_META[p].label).join(' · ')}
              </p>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(230,59,46,0.08)', border: '1.5px solid rgba(230,59,46,0.3)', borderRadius: '1rem', padding: '20px', marginBottom: '24px' }}>
              <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#E63B2E', fontSize: '14px' }}>Error: {error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Analysis summary bar */}
              {analysis && (
                <div style={{ background: '#111', borderRadius: '2rem', padding: '28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Overall Visibility</div>
                      <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '48px', color: '#E63B2E', lineHeight: 1 }}>{analysis.overall_visibility_score}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Best Platform</div>
                      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', fontWeight: 700, color: '#E8E4DD' }}>{analysis.best_platform?.split(' ')[0] || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Most Problematic</div>
                      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', fontWeight: 700, color: '#E63B2E' }}>{analysis.worst_platform?.split(' ')[0] || '—'}</div>
                    </div>
                    {analysis.equity_gap_detected && (
                      <div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Equity Gap</div>
                        <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', fontWeight: 700, color: '#E63B2E' }}>DETECTED</div>
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: 'rgba(245,243,238,0.65)', lineHeight: 1.65, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    {analysis.summary}
                  </p>
                </div>
              )}

              {/* Cross-platform entity consensus */}
              {analysis?.cross_platform_entities?.length > 0 && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Cross-Platform Entity Analysis
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    {analysis.cross_platform_entities.map((entity: any, i: number) => {
                      const statusColor = entity.verification_status === 'verified' ? '#10B981' : entity.verification_status === 'unverified' ? '#F59E0B' : '#E63B2E';
                      return (
                        <div key={i} style={{ background: '#F5F3EE', borderRadius: '1rem', padding: '14px', borderLeft: `3px solid ${statusColor}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', fontWeight: 600, color: '#222' }}>{entity.name}</span>
                            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: statusColor, textTransform: 'uppercase', letterSpacing: '0.06em', background: `${statusColor}15`, borderRadius: '999px', padding: '2px 8px' }}>
                              {entity.verification_status?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            {entity.mentioned_by?.map((p: string) => (
                              <span key={p} style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: PLATFORM_META[p]?.color || '#888', background: `${PLATFORM_META[p]?.color || '#888'}15`, borderRadius: '999px', padding: '2px 8px' }}>{p}</span>
                            ))}
                          </div>
                          {entity.notes && <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#777', lineHeight: 1.4 }}>{entity.notes}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Consensus orgs + contested claims */}
              {(analysis?.consensus_orgs?.length > 0 || analysis?.contested_claims?.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {analysis?.consensus_orgs?.length > 0 && (
                    <div style={{ background: '#E8E4DD', borderRadius: '1.5rem', padding: '24px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                        Consensus Orgs (3+ platforms agree)
                      </div>
                      {analysis.consensus_orgs.map((org: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
                          <span style={{ color: '#10B981', fontSize: '12px' }}>✓</span>
                          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#333' }}>{org}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {analysis?.contested_claims?.length > 0 && (
                    <div style={{ background: '#E8E4DD', borderRadius: '1.5rem', padding: '24px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                        Contested / Inconsistent Claims
                      </div>
                      {analysis.contested_claims.map((claim: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
                          <span style={{ color: '#E63B2E', fontSize: '12px', flexShrink: 0 }}>≠</span>
                          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#555', lineHeight: 1.4 }}>{claim}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Platform cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>
                {result.platforms_run?.map((platform: string) => (
                  <PlatformCard
                    key={platform}
                    platform={platform}
                    response={result.responses?.[platform] || ''}
                    score={analysis?.platform_scores?.[platform]}
                    apiKeysConfigured={result.api_keys_configured || {}}
                  />
                ))}
              </div>

              {/* Perplexity citations */}
              {result.perplexity_citations?.length > 0 && (
                <div style={{ background: '#E8E4DD', borderRadius: '1.5rem', padding: '24px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                    Perplexity Citations (Live Web Sources)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.perplexity_citations.map((cite: string, i: number) => (
                      <a key={i} href={cite} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#3B82F6', textDecoration: 'none', padding: '6px 0', borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
                        {i + 1}. {cite}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Setup instructions if keys missing */}
              {result && (!result.api_keys_configured?.perplexity || !result.api_keys_configured?.gemini || !result.api_keys_configured?.chatgpt) && (
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1.5px solid rgba(245,158,11,0.2)', borderRadius: '1.5rem', padding: '24px' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Enable More Platforms
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {!result.api_keys_configured?.perplexity && (
                      <div>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333', marginBottom: '6px' }}>Perplexity — Free</p>
                        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#666', lineHeight: 1.7 }}>
                          perplexity.ai/settings/api<br/>
                          Free credits, no credit card<br/>
                          <strong style={{ color: '#333' }}>PERPLEXITY_API_KEY=pplx-...</strong>
                        </p>
                      </div>
                    )}
                    {!result.api_keys_configured?.gemini && (
                      <div>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333', marginBottom: '6px' }}>Google Gemini — Free</p>
                        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#666', lineHeight: 1.7 }}>
                          aistudio.google.com/app/apikey<br/>
                          Completely free, no credit card<br/>
                          <strong style={{ color: '#333' }}>GEMINI_API_KEY=AIza...</strong>
                        </p>
                      </div>
                    )}
                    {!result.api_keys_configured?.chatgpt && (
                      <div>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333', marginBottom: '6px' }}>ChatGPT GPT-4o — Paid</p>
                        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#666', lineHeight: 1.7 }}>
                          platform.openai.com/api-keys<br/>
                          Requires OpenAI account + credits<br/>
                          <strong style={{ color: '#333' }}>OPENAI_API_KEY=sk-...</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
