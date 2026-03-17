import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function GuidePage() {
  const router = useRouter();
  const [form, setForm] = useState({ orgName: '', orgType: '', region: '', website: '', programs: '', description: '', targetCommunity: '', auditScore: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('schema');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const { org, type, region, score } = router.query;
      if (org) setForm(f => ({ ...f, orgName: org as string, orgType: (type as string) || '', region: (region as string) || '', auditScore: (score as string) || '' }));
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async () => {
    if (!form.orgName.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Guide generation failed');
      setResult(data);
      setActiveTab('schema');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const tabs = [
    { id: 'schema', label: 'Schema Markup' },
    { id: 'directories', label: 'Directories' },
    { id: 'content', label: 'Content Strategy' },
    { id: 'equity', label: 'Equity Tactics' },
    { id: 'faq', label: 'FAQ Schema' },
    { id: 'timeline', label: 'Timeline' },
  ];

  const priorityColor = (p: string) => p === 'high' ? '#E63B2E' : p === 'medium' ? '#F59E0B' : '#10B981';

  return (
    <>
      <Head><title>AiEO Guide — AiEO</title></Head>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#F5F3EE', paddingTop: '100px' }}>
        {/* Header */}
        <div style={{ background: '#111', padding: '60px 48px 48px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tool 05 — AiEO Implementation Guide
            </span>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', color: '#F5F3EE', marginTop: '12px', lineHeight: 1.05, marginBottom: '12px' }}>
              Fix your AI<br />footprint.
            </h1>
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', color: 'rgba(245,243,238,0.6)', maxWidth: '520px' }}>
              Generate a custom implementation guide: ready-to-use JSON-LD schema, directory submission list, content strategy, and equity visibility tactics.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: result ? '320px 1fr' : '600px 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Form */}
            <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '32px', border: '1.5px solid rgba(17,17,17,0.08)', position: 'sticky', top: '100px' }}>
              <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                Organization Profile
              </div>

              {[
                { key: 'orgName', label: 'Organization Name *', placeholder: 'e.g. Animikii' },
                { key: 'website', label: 'Website', placeholder: 'https://yourorg.ca' },
                { key: 'programs', label: 'Programs / Services', placeholder: 'e.g. Indigenous tech accelerator, youth coding bootcamp' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '7px' }}>{f.label}</label>
                  <input className="input-raw" value={(form as any)[f.key]} onChange={e => setField(f.key, e.target.value)} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }} />
                </div>
              ))}

              {[
                { key: 'orgType', label: 'Org Type', options: ['Accelerator', 'Startup', 'Government Program', 'University', 'Non-Profit', 'Funder', 'Enterprise'] },
                { key: 'region', label: 'Region', options: ['Windsor, ON', 'Toronto, ON', 'Waterloo, ON', 'Vancouver, BC', 'Halifax, NS', 'Montreal, QC', 'Calgary, AB', 'Canada (national)'] },
                { key: 'targetCommunity', label: 'Target Community', options: ['General', 'Indigenous communities', 'Black founders', 'Women in tech', 'Francophone minorities', 'Newcomers / Immigrants', 'LGBTQ+'] },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '7px' }}>{f.label}</label>
                  <select className="input-raw" value={(form as any)[f.key]} onChange={e => setField(f.key, e.target.value)} style={{ width: '100%', padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>
                    <option value="">Select...</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '7px' }}>Description</label>
                <textarea className="input-raw" value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Who are you? Who do you serve? What's your mission?" rows={3} style={{ width: '100%', padding: '10px 14px', fontSize: '13px', resize: 'vertical' }} />
              </div>

              <button
                className="btn-magnetic"
                onClick={handleSubmit}
                disabled={loading || !form.orgName.trim()}
                style={{
                  background: loading || !form.orgName.trim() ? '#ccc' : '#E63B2E',
                  color: 'white', border: 'none', padding: '14px 24px',
                  borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '14px', fontWeight: 600,
                  cursor: loading || !form.orgName.trim() ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {loading ? 'Generating Guide...' : 'Generate AiEO Guide →'}
              </button>
            </div>

            {/* Right: guide content */}
            <div>
              {!loading && !result && !error && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '60px', textAlign: 'center', border: '1.5px solid rgba(17,17,17,0.06)' }}>
                  <p style={{ fontFamily: '"Syne", sans-serif', fontSize: '24px', color: '#888', lineHeight: 1.4 }}>
                    Your personalized AiEO guide will appear here — schema markup, directories, content strategy, all ready to implement.
                  </p>
                </div>
              )}

              {loading && (
                <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '48px', textAlign: 'center', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                  <div className="pulse-dot" style={{ width: 12, height: 12, background: '#E63B2E', borderRadius: '50%', margin: '0 auto 20px' }} />
                  <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '13px', color: '#888' }}>
                    Generating your custom AiEO implementation guide...
                  </p>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(230,59,46,0.08)', border: '1.5px solid rgba(230,59,46,0.3)', borderRadius: '1rem', padding: '20px' }}>
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#E63B2E', fontSize: '14px' }}>Error: {error}</p>
                </div>
              )}

              {result && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Header summary */}
                  <div style={{ background: '#111', borderRadius: '2rem', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>AiEO Implementation Guide</div>
                        <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '20px', fontWeight: 700, color: '#F5F3EE', marginBottom: '8px' }}>{result.org_name}</h2>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: 'rgba(245,243,238,0.65)', lineHeight: 1.6, maxWidth: '500px' }}>{result.executive_summary}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '48px', color: '#E63B2E', lineHeight: 1 }}>{result.priority_score}</div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Priority Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Tab navigation */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {tabs.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        style={{
                          background: activeTab === t.id ? '#E63B2E' : '#E8E4DD',
                          color: activeTab === t.id ? 'white' : '#444',
                          border: activeTab === t.id ? 'none' : '1.5px solid rgba(17,17,17,0.12)',
                          borderRadius: '999px', padding: '8px 16px',
                          fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 500,
                          cursor: 'pointer', transition: 'all 0.2s ease',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  {activeTab === 'schema' && result.schema_markup && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        JSON-LD Structured Data — Add to your website's &lt;head&gt; section
                      </div>
                      {Object.entries(result.schema_markup).map(([key, value]: [string, any]) => (
                        value && (
                          <div key={key} style={{ background: '#111', borderRadius: '1.5rem', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key.replace(/_/g, ' ')}</span>
                              <button
                                onClick={() => copyToClipboard(typeof value === 'string' ? value : JSON.stringify(value, null, 2), key)}
                                style={{ background: copied === key ? '#10B981' : 'rgba(255,255,255,0.08)', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '999px', fontFamily: '"Space Mono", monospace', fontSize: '10px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                              >
                                {copied === key ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <pre style={{ padding: '16px 20px', fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E8E4DD', overflowX: 'auto', lineHeight: 1.6, margin: 0 }}>
                              {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                            </pre>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {activeTab === 'directories' && result.directory_submissions?.length > 0 && (
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                        {result.directory_submissions.length} Directories to Submit To
                      </div>
                      {result.directory_submissions.map((d: any, i: number) => (
                        <div key={i} style={{ background: '#E8E4DD', borderRadius: '1.25rem', padding: '18px 20px', marginBottom: '10px', border: '1.5px solid rgba(17,17,17,0.07)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: priorityColor(d.priority), flexShrink: 0, marginTop: '6px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#222', fontSize: '14px' }}>{d.name}</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {d.equity_relevant && <span className="risk-pill" style={{ background: 'rgba(139,92,246,0.1)', color: '#7C3AED', border: '1px solid rgba(139,92,246,0.2)', fontSize: '9px' }}>Equity</span>}
                                <span className="risk-pill" style={{ background: `${priorityColor(d.priority)}22`, color: priorityColor(d.priority), border: 'none', fontSize: '9px' }}>{d.priority} priority</span>
                              </div>
                            </div>
                            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#666', marginBottom: '6px' }}>{d.instructions}</p>
                            {d.url && d.url !== 'https://...' && (
                              <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#E63B2E', textDecoration: 'none' }}>{d.url} →</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'content' && result.content_strategy && (
                    <div>
                      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '16px', fontWeight: 600, color: '#222', marginBottom: '20px' }}>{result.content_strategy.title}</div>
                      {result.content_strategy.tactics?.map((t: any, i: number) => (
                        <div key={i} style={{ background: '#E8E4DD', borderRadius: '1.25rem', padding: '20px', marginBottom: '12px', border: '1.5px solid rgba(17,17,17,0.07)', borderLeft: `3px solid ${priorityColor(t.priority)}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#222', fontSize: '14px' }}>{t.tactic}</span>
                            <span className="risk-pill" style={{ background: `${priorityColor(t.priority)}22`, color: priorityColor(t.priority), border: 'none', fontSize: '9px' }}>{t.priority}</span>
                          </div>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#666', marginBottom: '8px' }}>{t.rationale}</p>
                          <div style={{ background: '#F5F3EE', borderRadius: '0.5rem', padding: '10px 14px' }}>
                            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>HOW: </span>
                            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#444' }}>{t.implementation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'equity' && result.equity_visibility_tactics?.length > 0 && (
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                        Equity Community Visibility Tactics
                      </div>
                      {result.equity_visibility_tactics.map((t: any, i: number) => (
                        <div key={i} style={{ background: '#E8E4DD', borderRadius: '1.25rem', padding: '20px', marginBottom: '12px', border: '1.5px solid rgba(17,17,17,0.07)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(139,92,246,0.1)', borderRadius: '999px', padding: '3px 10px' }}>{t.community}</span>
                            <span className="risk-pill" style={{ background: t.expected_impact === 'high' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: t.expected_impact === 'high' ? '#047857' : '#B45309', border: 'none', fontSize: '9px' }}>
                              Expected Impact: {t.expected_impact}
                            </span>
                          </div>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: '14px', color: '#222', marginBottom: '6px' }}>{t.tactic}</p>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#666' }}>{t.implementation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'faq' && result.faq_schema_questions?.length > 0 && (
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        FAQ Schema — Add to your FAQ page to signal content to AI systems
                      </div>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: result.faq_schema_questions.map((q: any) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })) }, null, 2), 'faq')}
                        style={{ background: copied === 'faq' ? '#10B981' : '#E63B2E', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '999px', fontFamily: '"Space Mono", monospace', fontSize: '11px', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s ease' }}
                      >
                        {copied === 'faq' ? 'Copied!' : 'Copy Full FAQ Schema'}
                      </button>
                      {result.faq_schema_questions.map((q: any, i: number) => (
                        <div key={i} style={{ background: '#E8E4DD', borderRadius: '1rem', padding: '16px 20px', marginBottom: '10px', border: '1.5px solid rgba(17,17,17,0.07)' }}>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#222', fontSize: '14px', marginBottom: '6px' }}>Q: {q.question}</p>
                          <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#666', fontSize: '13px', lineHeight: 1.5 }}>A: {q.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'timeline' && result.implementation_timeline && (
                    <div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                        Implementation Timeline
                      </div>
                      {Object.entries(result.implementation_timeline).map(([phase, tasks]: [string, any]) => (
                        <div key={phase} style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: phase === 'week_1' ? '#E63B2E' : phase === 'month_1' ? '#F59E0B' : '#10B981' }} />
                            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                              {phase.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {(tasks as string[]).map((task: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(17,17,17,0.06)', marginLeft: '22px' }}>
                              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: phase === 'week_1' ? '#E63B2E' : phase === 'month_1' ? '#F59E0B' : '#10B981', fontWeight: 700, marginTop: '1px' }}>
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#444', lineHeight: 1.5 }}>{task}</span>
                            </div>
                          ))}
                        </div>
                      ))}

                      {result.monitoring_checklist?.length > 0 && (
                        <div style={{ background: '#111', borderRadius: '1.5rem', padding: '20px', marginTop: '8px' }}>
                          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            Ongoing Monitoring Checklist
                          </div>
                          {result.monitoring_checklist.map((item: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <span style={{ color: '#E63B2E', fontSize: '12px', marginTop: '2px' }}>□</span>
                              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: 'rgba(245,243,238,0.75)', lineHeight: 1.5 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
