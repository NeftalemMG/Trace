import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';

const ORG_TYPES = ['Accelerator / Incubator', 'Startup', 'Government Program', 'University / Research', 'Non-Profit / Community Org', 'Funder / VC', 'Enterprise Company', 'Other'];
const COMMUNITIES = ['General', 'Indigenous communities', 'Black founders', 'Women in tech', 'Francophone minorities', 'Newcomers / Immigrants', 'LGBTQ+', 'Rural / Remote'];
const REGIONS = ['Windsor, ON', 'Toronto, ON', 'Waterloo, ON', 'Ottawa, ON', 'Vancouver, BC', 'Halifax, NS', 'Montreal, QC', 'Calgary, AB', 'Winnipeg, MB', 'Canada (national)'];

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const angle = (score / 100) * 180 - 90;
  const color = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#E63B2E';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg viewBox="0 0 200 110" width="200" height="110">
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(17,17,17,0.08)" strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${score * 2.51} 251`} opacity="0.3" />
        {/* Needle */}
        <line
          x1="100" y1="100"
          x2={100 + 65 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 65 * Math.sin((angle * Math.PI) / 180)}
          stroke={color} strokeWidth="3" strokeLinecap="round"
          style={{ transition: 'all 1s ease' }}
        />
        <circle cx="100" cy="100" r="6" fill={color} />
        <text x="100" y="80" textAnchor="middle" fontSize="28" fontWeight="700" fill={color} fontFamily="Space Mono, monospace">{score}</text>
        <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#888" fontFamily="Space Mono, monospace">{grade}</text>
      </svg>
      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Score</div>
    </div>
  );
}

function DimBar({ label, score, description }: { label: string; score: number; description?: string }) {
  const color = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#E63B2E';
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 500, color: '#333' }}>{label}</span>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(17,17,17,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '3px', transition: 'width 1s ease' }} />
      </div>
      {description && <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', color: '#888', marginTop: '4px' }}>{description}</p>}
    </div>
  );
}

export default function AuditTool() {
  const [form, setForm] = useState({ orgName: '', orgType: '', region: '', website: '', description: '', targetCommunity: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.orgName.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <Head><title>Audit Tool</title></Head>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#F5F3EE', paddingTop: '100px' }}>
        <div style={{ background: '#E8E4DD', padding: '60px 48px 48px', borderBottom: '1.5px solid rgba(17,17,17,0.08)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tool 02 — AiEO Visibility Audit
            </span>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', color: '#111', marginTop: '12px', lineHeight: 1.05, marginBottom: '12px' }}>
              Score your AI<br />visibility.
            </h1>
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', color: '#666', maxWidth: '520px' }}>
              Enter your organization's details to receive a comprehensive AiEO Visibility Score across 6 dimensions with specific, actionable recommendations.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
          {/* Form */}
          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 2fr' : '1fr', gap: '32px', alignItems: 'start' }}>
            <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '36px', border: '1.5px solid rgba(17,17,17,0.08)', position: 'sticky', top: '100px' }}>
              <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
                Organization Details
              </div>

              {[
                { key: 'orgName', label: 'Organization Name *', placeholder: 'e.g. Black Founders Network' },
                { key: 'website', label: 'Website', placeholder: 'https://yourorg.ca' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>{f.label}</label>
                  <input
                    className="input-raw"
                    value={(form as any)[f.key]}
                    onChange={e => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '12px 16px', fontSize: '14px' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Organization Type</label>
                <select
                  className="input-raw"
                  value={form.orgType}
                  onChange={e => setField('orgType', e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="">Select type...</option>
                  {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Region</label>
                <select
                  className="input-raw"
                  value={form.region}
                  onChange={e => setField('region', e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="">Select region...</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Target Community</label>
                <select
                  className="input-raw"
                  value={form.targetCommunity}
                  onChange={e => setField('targetCommunity', e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="">Select community...</option>
                  {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Brief Description</label>
                <textarea
                  className="input-raw"
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="What does your organization do? Who do you serve?"
                  rows={3}
                  style={{ width: '100%', padding: '12px 16px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <button
                className="btn-magnetic"
                onClick={handleSubmit}
                disabled={loading || !form.orgName.trim()}
                style={{
                  background: loading || !form.orgName.trim() ? '#ccc' : '#E63B2E',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading || !form.orgName.trim() ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {loading ? 'Auditing...' : 'Generate Audit Report →'}
              </button>
            </div>

            {/* Results column */}
            <div>
              {loading && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '48px', textAlign: 'center', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div className="pulse-dot" style={{ width: 12, height: 12, background: '#E63B2E', borderRadius: '50%', margin: '0 auto 20px' }} />
                  <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', color: '#888' }}>Running AiEO audit across 6 dimensions...</p>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(230,59,46,0.08)', border: '1.5px solid rgba(230,59,46,0.3)', borderRadius: '1rem', padding: '20px' }}>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#E63B2E', fontSize: '14px' }}>Error: {error}</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '48px', textAlign: 'center', border: '1.5px solid rgba(17,17,17,0.06)' }}>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', color: '#888', lineHeight: 1.6 }}>
                    Fill in your organization details and click <strong>Generate Audit Report</strong> to receive your AiEO Visibility Score.
                  </p>
                </div>
              )}

              {result && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Overall score */}
                  <div style={{ background: '#111', borderRadius: '2rem', padding: '36px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <ScoreGauge score={result.overall_score || 0} grade={result.grade || 'N/A'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        AiEO Visibility Score
                      </div>
                      <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '22px', fontWeight: 700, color: '#F5F3EE', marginBottom: '8px' }}>
                        {result.org_name}
                      </h2>
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: 'rgba(245,243,238,0.6)', lineHeight: 1.6, marginBottom: '16px' }}>
                        {result.narrative}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Percentile</div>
                          <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '24px', color: '#E63B2E' }}>
                            {result.benchmark_comparison?.percentile || 0}th
                          </div>
                        </div>
                        <div>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Query Coverage</div>
                          <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '24px', color: '#F5F3EE' }}>
                            {Math.round((result.estimated_query_coverage || 0) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Risk Level</div>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '14px', color: result.risk_level === 'high' ? '#E63B2E' : result.risk_level === 'medium' ? '#F59E0B' : '#10B981', textTransform: 'uppercase' }}>
                            {result.risk_level}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dimension scores */}
                  {result.scores && (
                    <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                        Dimension Scores
                      </div>
                      <DimBar label="Accuracy" score={result.scores.accuracy} description="How accurately AI describes this organization" />
                      <DimBar label="Completeness" score={result.scores.completeness} description="How complete AI descriptions are" />
                      <DimBar label="Hallucination Resistance" score={100 - result.scores.hallucination_risk} description="Lower risk = higher score" />
                      <DimBar label="Equity Reach" score={result.scores.equity_reach} description="Visibility when equity-focused queries are used" />
                      <DimBar label="Data Freshness" score={result.scores.data_freshness} description="How current AI knowledge is" />
                      <DimBar label="Regional Specificity" score={result.scores.regional_specificity} description="How well AI knows the specific region" />
                    </div>
                  )}

                  {/* Benchmark comparison */}
                  {result.benchmark_comparison && (
                    <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                        Benchmark Comparison
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {[
                          { label: 'vs Major Urban Orgs', val: result.benchmark_comparison.vs_major_urban },
                          { label: 'vs National Programs', val: result.benchmark_comparison.vs_national_programs },
                          { label: 'vs Regional Average', val: result.benchmark_comparison.vs_regional_average },
                        ].map((b, i) => (
                          <div key={i} style={{ background: '#F5F3EE', borderRadius: '1rem', padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '28px', color: b.val >= 0 ? '#10B981' : '#E63B2E', marginBottom: '4px' }}>
                              {b.val >= 0 ? '+' : ''}{b.val}
                            </div>
                            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Issues */}
                  {result.key_issues?.length > 0 && (
                    <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                        Key Issues Found
                      </div>
                      {result.key_issues.map((issue: any, i: number) => (
                        <div key={i} style={{
                          display: 'flex', gap: '12px', alignItems: 'flex-start',
                          background: '#F5F3EE', borderRadius: '0.75rem', padding: '14px',
                          marginBottom: '10px',
                          borderLeft: `3px solid ${issue.severity === 'high' ? '#E63B2E' : issue.severity === 'medium' ? '#F59E0B' : '#3B82F6'}`,
                        }}>
                          <span className="risk-pill" style={{
                            background: issue.severity === 'high' ? 'rgba(230,59,46,0.1)' : 'rgba(245,158,11,0.1)',
                            color: issue.severity === 'high' ? '#E63B2E' : '#B45309',
                            border: 'none',
                            whiteSpace: 'nowrap',
                            fontSize: '9px',
                          }}>{issue.severity}</span>
                          <div>
                            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>{issue.issue}</p>
                            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: '#777' }}>{issue.impact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hallucination patterns */}
                  {result.hallucination_patterns_likely?.length > 0 && (
                    <div style={{ background: '#111', borderRadius: '2rem', padding: '28px' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                        Likely Hallucination Patterns
                      </div>
                      {result.hallucination_patterns_likely.map((h: any, i: number) => (
                        <div key={i} style={{ background: 'rgba(230,59,46,0.08)', border: '1px solid rgba(230,59,46,0.15)', borderRadius: '0.75rem', padding: '14px', marginBottom: '10px' }}>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, color: '#E8E4DD', marginBottom: '4px' }}>{h.pattern}</p>
                          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#888' }}>Example: {h.example}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Queries missed */}
                  {result.queries_likely_missed?.length > 0 && (
                    <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '28px', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                        Queries Likely Missed
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {result.queries_likely_missed.map((q: string, i: number) => (
                          <span key={i} style={{ background: '#F5F3EE', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '999px', padding: '6px 14px', fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#666' }}>
                            "{q}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA to guide */}
                  <div style={{ background: '#E63B2E', borderRadius: '2rem', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                        Get your AiEO Implementation Guide
                      </p>
                      <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
                        Schema markup, directory submissions, content strategy — all generated for your org.
                      </p>
                    </div>
                    <Link href={`/guide?org=${encodeURIComponent(form.orgName)}&type=${encodeURIComponent(form.orgType)}&region=${encodeURIComponent(form.region)}&score=${result.overall_score}`} style={{ textDecoration: 'none' }}>
                      <button className="btn-magnetic" style={{ background: 'white', color: '#E63B2E', border: 'none', padding: '14px 28px', borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Generate Guide →
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
