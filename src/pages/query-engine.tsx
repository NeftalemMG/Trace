import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const PRESET_QUERIES = [
  { label: 'Windsor EV Startups', query: 'What EV startups in Windsor, Ontario are hiring new graduates for engineering or software roles?', region: 'Windsor, ON', community: 'General' },
  { label: 'Indigenous Tech Jobs', query: 'What are Indigenous-led technology companies in Canada that are currently hiring junior developers or offering internships?', region: 'Canada', community: 'Indigenous' },
  { label: 'Toronto Black Founders', query: 'What startups founded by Black entrepreneurs in Toronto are growing and hiring in 2024?', region: 'Toronto, ON', community: 'Black founders' },
  { label: 'Halifax Ocean/Biotech', query: 'What ocean technology or biotech co-op positions are available in Halifax Nova Scotia for recent graduates?', region: 'Halifax, NS', community: 'General' },
  { label: 'Waterloo AI Startups', query: 'Beyond the big names, what AI startups in Waterloo Ontario have open junior software positions?', region: 'Waterloo, ON', community: 'General' },
  { label: 'Indigenous Grants Canada', query: 'What funding programs or grants are available for Indigenous-led technology startups in Canada?', region: 'Canada', community: 'Indigenous' },
];

const RISK_COLORS: Record<string, string> = {
  critical: '#E63B2E',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#10B981',
};

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = ((100 - score) / 100) * circ;
  const color = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#E63B2E';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(17,17,17,0.08)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={fill}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill={color} fontFamily="Space Mono, monospace">{score}</text>
      </svg>
      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

export default function QueryEngine() {
  const [query, setQuery] = useState('');
  const [orgName, setOrgName] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/query-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, orgName, region }),
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

  const selectPreset = (i: number) => {
    const p = PRESET_QUERIES[i];
    setSelectedPreset(i);
    setQuery(p.query);
    setRegion(p.region);
  };

  const ver = result?.verification;
  const naive = result?.naive_response;

  return (
    <>
      <Head>
        <title>Query Engine — AiEO</title>
      </Head>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#F5F3EE', paddingTop: '100px' }}>
        {/* Header */}
        <div style={{ background: '#111', padding: '60px 48px 48px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="pulse-dot" style={{ width: 8, height: 8, background: '#E63B2E', borderRadius: '50%' }} />
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Tool 01 — Query Engine
              </span>
            </div>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', color: '#F5F3EE', lineHeight: 1.05, marginBottom: '12px' }}>
              Test how AI answers<br />student queries.
            </h1>
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', color: 'rgba(245,243,238,0.6)', maxWidth: '560px' }}>
              Enter a query a student would ask about Canadian opportunities. We'll analyze what AI says, detect hallucinations, and score the risk.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
          {/* Preset queries */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Research Query Presets
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESET_QUERIES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => selectPreset(i)}
                  style={{
                    background: selectedPreset === i ? '#E63B2E' : '#E8E4DD',
                    color: selectedPreset === i ? 'white' : '#444',
                    border: selectedPreset === i ? 'none' : '1.5px solid rgba(17,17,17,0.12)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '36px', marginBottom: '32px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
                Student Query
              </label>
              <textarea
                className="input-raw"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. What EV startups in Windsor are hiring new grads?"
                rows={4}
                style={{ width: '100%', padding: '16px', fontSize: '15px', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
                  Org Name (Optional)
                </label>
                <input
                  className="input-raw"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  placeholder="e.g. NextStar Energy"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
                  Region
                </label>
                <input
                  className="input-raw"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  placeholder="e.g. Windsor, Ontario"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px' }}
                />
              </div>
            </div>

            <button
              className="btn-magnetic"
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              style={{
                background: loading || !query.trim() ? '#ccc' : '#E63B2E',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '999px',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Analyzing...' : 'Run Analysis →'}
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '48px', textAlign: 'center', border: '1.5px solid rgba(17,17,17,0.08)' }}>
              <div className="pulse-dot" style={{ width: 12, height: 12, background: '#E63B2E', borderRadius: '50%', margin: '0 auto 20px' }} />
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', color: '#888' }}>
                Running dual-layer analysis: naive response + verification pipeline...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(230,59,46,0.08)', border: '1.5px solid rgba(230,59,46,0.3)', borderRadius: '1rem', padding: '20px', marginBottom: '24px' }}>
              <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#E63B2E', fontSize: '14px' }}>Error: {error}</p>
            </div>
          )}

          {/* Results */}
          {result && ver && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Score overview */}
              <div style={{ background: '#111', borderRadius: '2rem', padding: '36px' }}>
                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
                  AiEO Risk Assessment
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  <ScoreRing score={ver.visibility_score || 0} label="Visibility" />
                  <ScoreRing score={100 - (ver.data_freshness_risk === 'high' ? 70 : ver.data_freshness_risk === 'medium' ? 50 : 30)} label="Freshness" />
                  <ScoreRing score={100 - (ver.regional_specificity_risk === 'high' ? 70 : ver.regional_specificity_risk === 'medium' ? 50 : 30)} label="Regional Fit" />
                  <ScoreRing score={ver.accuracy_risk === 'high' ? 30 : ver.accuracy_risk === 'medium' ? 55 : 75} label="Accuracy Est." />
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {ver.equity_gap_detected && (
                    <div style={{ background: 'rgba(230,59,46,0.15)', border: '1px solid rgba(230,59,46,0.3)', borderRadius: '999px', padding: '6px 14px' }}>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        ⚠ Equity Gap Detected
                      </span>
                    </div>
                  )}
                  {(ver.equity_communities || []).map((c: string, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 14px' }}>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#F5F3EE', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two column: naive vs verification */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* What AI says */}
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      What AI Tells the Student
                    </div>
                    <span style={{ background: '#E8E4DD', border: '1.5px solid rgba(17,17,17,0.15)', borderRadius: '999px', padding: '4px 12px', fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#444' }}>
                      {naive?.confidence_level || 0}% confidence
                    </span>
                  </div>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#333', lineHeight: 1.7, marginBottom: '20px' }}>
                    {naive?.answer || 'No response generated'}
                  </p>

                  {naive?.companies_named?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Companies Named</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {naive.companies_named.map((c: string, i: number) => (
                          <span key={i} style={{ background: '#F5F3EE', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '999px', padding: '3px 10px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#444' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {naive?.specific_claims?.length > 0 && (
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Specific Claims Made</div>
                      {naive.specific_claims.map((c: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#E63B2E', fontFamily: '"Space Mono", monospace', fontSize: '12px', marginTop: '2px' }}>→</span>
                          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#555' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verification */}
                <div style={{ background: '#111', borderRadius: '2rem', padding: '28px' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                    Verification Analysis
                  </div>

                  {ver.hallucination_patterns?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Hallucination Patterns</div>
                      {ver.hallucination_patterns.map((p: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start', background: 'rgba(230,59,46,0.1)', borderRadius: '0.5rem', padding: '8px 12px' }}>
                          <span style={{ color: '#E63B2E', fontSize: '12px' }}>!</span>
                          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#E8E4DD', lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {ver.verified_orgs?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Verified Entities</div>
                      {ver.verified_orgs.map((o: any, i: number) => (
                        <div key={i} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', padding: '10px 14px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, color: '#34D399' }}>{o.name}</span>
                            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#34D399' }}>{o.confidence}%</span>
                          </div>
                          {o.notes && <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'rgba(245,243,238,0.6)' }}>{o.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {ver.ghost_risk_orgs?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Ghost Risk Entities</div>
                      {ver.ghost_risk_orgs.map((o: any, i: number) => (
                        <div key={i} style={{ background: 'rgba(230,59,46,0.1)', border: '1px solid rgba(230,59,46,0.2)', borderRadius: '0.75rem', padding: '10px 14px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, color: '#E63B2E' }}>{o.name}</span>
                            <span className="risk-pill risk-critical" style={{ fontSize: '9px' }}>{o.risk_level}</span>
                          </div>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'rgba(245,243,238,0.6)' }}>{o.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {ver.summary && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: 'rgba(245,243,238,0.7)', lineHeight: 1.6 }}>{ver.summary}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {ver.recommended_verifications?.length > 0 && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Recommended Verifications for Students
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                    {ver.recommended_verifications.map((r: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#F5F3EE', borderRadius: '0.75rem', padding: '12px' }}>
                        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '12px', color: '#E63B2E', fontWeight: 700 }}>{i + 1}</span>
                        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#444', lineHeight: 1.5 }}>{r}</span>
                      </div>
                    ))}
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
