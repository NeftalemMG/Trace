import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const COMMUNITIES = [
  { id: 'indigenous', label: 'Indigenous-Led Tech', score: 28, color: '#7C3AED', queries: ['Indigenous tech companies Canada hiring', 'First Nations technology startups', 'NACCA Indigenous business programs'] },
  { id: 'black', label: 'Black Founders (Toronto)', score: 35, color: '#E63B2E', queries: ['Black founder startups Toronto hiring', 'DMZ Black Innovation Program', 'AfriTech Canada startup funding'] },
  { id: 'ocean', label: 'Ocean/BioTech (Halifax)', score: 38, color: '#0EA5E9', queries: ['Halifax ocean tech co-op roles', 'COVE Halifax internships', 'Nova Scotia biotech startups'] },
  { id: 'ev', label: 'Regional EV/Auto (Windsor)', score: 44, color: '#F59E0B', queries: ['Windsor EV startups hiring', 'NextStar Energy jobs', 'Stellantis Windsor careers'] },
  { id: 'francophone', label: 'Francophone Minorities', score: 32, color: '#10B981', queries: ['technologie francophone hors Québec', 'francophone tech startup Ontario', 'French tech jobs outside Quebec'] },
  { id: 'national', label: 'National Tech Programs', score: 78, color: '#6366F1', queries: ['Communitech programs Waterloo', 'MaRS Discovery District Toronto', 'Canadian tech accelerators'] },
  { id: 'urban', label: 'Major Urban Startups (TO/VAN)', score: 82, color: '#111', queries: ['Toronto tech startups hiring', 'Vancouver AI companies', 'Shopify ecosystem jobs'] },
];

const QUERY_TYPES = ['job opportunities', 'funding programs', 'accelerators', 'co-op roles', 'grant eligibility'];

export default function EquityMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [queryType, setQueryType] = useState('job opportunities');
  const [region, setRegion] = useState('Canada');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const selectedCommunity = COMMUNITIES.find(c => c.id === selected);

  const handleAnalyze = async () => {
    if (!selectedCommunity) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/equity-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community: selectedCommunity.label, region, queryType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const maxScore = Math.max(...COMMUNITIES.map(c => c.score));

  return (
    <>
      <Head><title>Equity Map — AiEO</title></Head>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#F5F3EE', paddingTop: '100px' }}>
        {/* Header */}
        <div style={{ background: '#E8E4DD', padding: '60px 48px 48px', borderBottom: '1.5px solid rgba(17,17,17,0.08)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tool 05 — Equity Visibility Map
            </span>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', color: '#111', marginTop: '12px', lineHeight: 1.05, marginBottom: '12px' }}>
              Who gets left<br />out.
            </h1>
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', color: '#666', maxWidth: '520px' }}>
              AI visibility gaps are not random - they are structural patterns that consistently disadvantage specific communities. Select a community to see real analysis.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: result ? '360px 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Left: Community selector + controls */}
            <div>
              {/* Visual score comparison */}
              <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)', marginBottom: '20px' }}>
                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                  AI Visibility by Community
                </div>
                {COMMUNITIES.sort((a, b) => b.score - a.score).map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c.id === selected ? null : c.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(17,17,17,0.06)',
                      opacity: selected && selected !== c.id ? 0.5 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: selected === c.id ? 600 : 400, color: selected === c.id ? c.color : '#333' }}>
                          {c.label}
                        </span>
                      </div>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', fontWeight: 700, color: c.color }}>{c.score}</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(17,17,17,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.score}%`, background: c.color, borderRadius: '3px', opacity: selected === c.id ? 1 : 0.5 }} />
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(230,59,46,0.08)', borderRadius: '0.75rem', border: '1px solid rgba(230,59,46,0.2)' }}>
                  <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E' }}>
                    54pt GAP: Indigenous-led tech (28) vs Major urban (82)
                  </p>
                </div>
              </div>

              {/* Controls */}
              {selected && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '24px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Analysis Settings
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Query Type</label>
                    <select className="input-raw" value={queryType} onChange={e => setQueryType(e.target.value)} style={{ width: '100%', padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>
                      {QUERY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Region</label>
                    <input className="input-raw" value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Canada, Ontario, Halifax" style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }} />
                  </div>
                  
                  {/* Sample queries */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Sample Queries for This Community</div>
                    {selectedCommunity?.queries.map((q, i) => (
                      <div key={i} style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#666', padding: '4px 0', borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
                        "{q}"
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-magnetic"
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={{
                      background: loading ? '#ccc' : '#E63B2E', color: 'white',
                      border: 'none', padding: '12px 24px', borderRadius: '999px',
                      fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
                    }}
                  >
                    {loading ? 'Analyzing...' : `Analyze ${selectedCommunity?.label} →`}
                  </button>
                </div>
              )}

              {!selected && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '24px', border: '1.5px solid rgba(17,17,17,0.08)', textAlign: 'center' }}>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#888' }}>
                    Click a community above to analyze its AI visibility in depth.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Analysis results */}
            {(loading || result || error) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading && (
                  <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '48px', textAlign: 'center', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                    <div className="pulse-dot" style={{ width: 12, height: 12, background: '#E63B2E', borderRadius: '50%', margin: '0 auto 20px' }} />
                    <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', color: '#888' }}>Analyzing community visibility patterns...</p>
                  </div>
                )}

                {error && (
                  <div style={{ background: 'rgba(230,59,46,0.08)', border: '1.5px solid rgba(230,59,46,0.3)', borderRadius: '1rem', padding: '20px' }}>
                    <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#E63B2E', fontSize: '14px' }}>Error: {error}</p>
                  </div>
                )}

                {result && !loading && (
                  <>
                    {/* Overview */}
                    <div style={{ background: '#111', borderRadius: '2rem', padding: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                            Equity Visibility Analysis
                          </div>
                          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '22px', fontWeight: 700, color: '#F5F3EE' }}>
                            {result.community}
                          </h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '48px', color: selectedCommunity?.color || '#E63B2E', lineHeight: 1 }}>
                            {result.visibility_score}
                          </div>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Visibility Score</div>
                        </div>
                      </div>
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: 'rgba(245,243,238,0.7)', lineHeight: 1.7, marginBottom: '20px' }}>
                        {result.overview}
                      </p>
                      
                      {result.benchmark && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '22px', color: '#E63B2E' }}>{result.benchmark.this_community_score}</div>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>This Community</div>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '22px', color: '#F5F3EE' }}>{result.benchmark.major_urban_score}</div>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Major Urban</div>
                          </div>
                          <div style={{ background: 'rgba(230,59,46,0.12)', borderRadius: '0.75rem', padding: '12px', textAlign: 'center', border: '1px solid rgba(230,59,46,0.2)' }}>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '22px', color: '#E63B2E' }}>-{result.benchmark.gap}</div>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Equity Gap</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Organizations */}
                    {result.organizations?.length > 0 && (
                      <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                          Key Organizations & AI Representation
                        </div>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Organization</th>
                              <th>Type</th>
                              <th>AI Visibility</th>
                              <th>AI Accuracy Issues</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.organizations.map((org: any, i: number) => {
                              const scoreColor = org.visibility_score >= 60 ? '#10B981' : org.visibility_score >= 40 ? '#F59E0B' : '#E63B2E';
                              return (
                                <tr key={i}>
                                  <td>
                                    <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#222', fontSize: '13px' }}>{org.name}</div>
                                    {org.region && <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', marginTop: '2px' }}>{org.region}</div>}
                                  </td>
                                  <td>
                                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#666', background: '#F5F3EE', borderRadius: '999px', padding: '3px 10px' }}>{org.type}</span>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ width: '60px', height: '4px', background: 'rgba(17,17,17,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${org.visibility_score}%`, background: scoreColor }} />
                                      </div>
                                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '12px', color: scoreColor, fontWeight: 700 }}>{org.visibility_score}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#666', lineHeight: 1.4 }}>{org.ai_accuracy_issues}</p>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Key Programs */}
                    {result.key_programs?.length > 0 && (
                      <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                          Programs & AI Representation Quality
                        </div>
                        {result.key_programs.map((p: any, i: number) => (
                          <div key={i} style={{ background: '#F5F3EE', borderRadius: '1rem', padding: '16px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                              <div>
                                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#222', fontSize: '14px' }}>{p.name}</div>
                                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888' }}>{p.funder} · {p.amount}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <span className="risk-pill" style={{
                                  background: p.ai_representation === 'good' ? 'rgba(16,185,129,0.1)' : p.ai_representation === 'fair' ? 'rgba(245,158,11,0.1)' : 'rgba(230,59,46,0.1)',
                                  color: p.ai_representation === 'good' ? '#047857' : p.ai_representation === 'fair' ? '#B45309' : '#E63B2E',
                                  border: 'none', fontSize: '9px',
                                }}>
                                  AI: {p.ai_representation}
                                </span>
                                <span className="risk-pill" style={{
                                  background: p.hallucination_risk === 'low' ? 'rgba(16,185,129,0.1)' : p.hallucination_risk === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(230,59,46,0.1)',
                                  color: p.hallucination_risk === 'low' ? '#047857' : p.hallucination_risk === 'medium' ? '#B45309' : '#E63B2E',
                                  border: 'none', fontSize: '9px',
                                }}>
                                  Hallucination: {p.hallucination_risk}
                                </span>
                              </div>
                            </div>
                            {p.common_ai_errors && (
                              <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#888', lineHeight: 1.5 }}>
                                <strong style={{ color: '#E63B2E' }}>Common AI errors:</strong> {p.common_ai_errors}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Structural gaps + recommended test queries */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {result.structural_gaps?.length > 0 && (
                        <div style={{ background: '#111', borderRadius: '2rem', padding: '24px' }}>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                            Structural Gaps
                          </div>
                          {result.structural_gaps.map((g: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
                              <span style={{ color: '#E63B2E', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>→</span>
                              <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: 'rgba(245,243,238,0.75)', lineHeight: 1.5 }}>{g}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.recommended_queries_to_test?.length > 0 && (
                        <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '24px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                            Recommended Test Queries
                          </div>
                          {result.recommended_queries_to_test.map((q: string, i: number) => (
                            <div key={i} style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#555', background: '#F5F3EE', borderRadius: '0.5rem', padding: '8px 12px', marginBottom: '8px' }}>
                              "{q}"
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
