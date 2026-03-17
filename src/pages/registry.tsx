import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const PLATFORMS = ['ChatGPT (GPT-4o)', 'Google Gemini', 'Perplexity AI', 'Claude', 'Copilot', 'Other'];
const ERROR_TYPES: Record<string, string> = {
  fabricated_entity: 'Fabricated Entity',
  wrong_location: 'Wrong Location',
  outdated_info: 'Outdated Info',
  wrong_eligibility: 'Wrong Eligibility',
  misclassified: 'Misclassified',
  confidence_mismatch: 'Confidence Mismatch',
};

const RESEARCH_ENTRIES = [
  {
    id: 'research-1',
    query: 'What EV startups in Windsor, Ontario are hiring new graduates?',
    platform: 'Google Gemini',
    submitted_at: '2026-03-08T10:00:00Z',
    hallucinations_found: true,
    hallucination_count: 2,
    entries: [
      { entity_name: 'Direct Energy / Centrica EV Windsor', claimed_by_ai: 'UK utility hiring for EV roles in Windsor', reality_check: 'Centrica is a UK utility with no verified Windsor EV startup presence', error_type: 'fabricated_entity', risk_level: 'critical', harm_scenario: 'Student applies for non-existent local roles, wastes application effort', community_impact: 'General', confidence_expressed: 95 },
    ],
    severity_score: 90,
    patterns_identified: ['Regional misattribution', 'Enterprise vs startup confusion'],
  },
  {
    id: 'research-2',
    query: 'What AI startups beyond big names are hiring in Waterloo?',
    platform: 'Google Gemini',
    submitted_at: '2026-03-08T10:15:00Z',
    hallucinations_found: true,
    hallucination_count: 1,
    entries: [
      { entity_name: 'CSMC', claimed_by_ai: 'Nuclear microreactor + quantum sensing startup in Waterloo', reality_check: 'No verifiable company matching this description exists in Waterloo ecosystem', error_type: 'fabricated_entity', risk_level: 'critical', harm_scenario: 'Student spends hours researching and applying to non-existent company', community_impact: 'General', confidence_expressed: 92 },
    ],
    severity_score: 95,
    patterns_identified: ['Complete entity fabrication', 'Technical domain hallucination'],
  },
  {
    id: 'research-3',
    query: 'What startups founded by Black entrepreneurs in Toronto are growing and hiring?',
    platform: 'ChatGPT (GPT-4o)',
    submitted_at: '2026-03-08T10:30:00Z',
    hallucinations_found: true,
    hallucination_count: 1,
    entries: [
      { entity_name: 'Flipp (Black-founded attribution)', claimed_by_ai: 'Flipp presented as Black-founded startup from DMZ Black Innovation program', reality_check: 'Flipp was not Black-founded and has no verified connection to DMZ Black programs', error_type: 'misclassified', risk_level: 'high', harm_scenario: 'Misattributes Black founder status, undermines program integrity and community trust', community_impact: 'Black founders', confidence_expressed: 88 },
    ],
    severity_score: 78,
    patterns_identified: ['Wrong attribution', 'Equity program misrepresentation'],
  },
  {
    id: 'research-4',
    query: 'What are Indigenous-led technology companies in Canada hiring junior developers?',
    platform: 'ChatGPT (GPT-4o)',
    submitted_at: '2026-03-08T10:45:00Z',
    hallucinations_found: true,
    hallucination_count: 1,
    entries: [
      { entity_name: 'Turtle Island Technology', claimed_by_ai: 'Indigenous tech company in Canada hiring developers', reality_check: 'No verifiable company under this name found in any Canadian Indigenous tech directory', error_type: 'fabricated_entity', risk_level: 'critical', harm_scenario: 'Indigenous student directed to phantom company, losing access to real pathways', community_impact: 'Indigenous', confidence_expressed: 85 },
    ],
    severity_score: 95,
    patterns_identified: ['Complete fabrication of Indigenous entity', 'Zero uncertainty flagged'],
  },
  {
    id: 'research-5',
    query: 'What AI startups in Waterloo have open junior positions?',
    platform: 'ChatGPT (GPT-4o)',
    submitted_at: '2026-03-08T11:00:00Z',
    hallucinations_found: true,
    hallucination_count: 2,
    entries: [
      { entity_name: 'TextGenetic AI', claimed_by_ai: 'Hiring AI startup in Waterloo with junior roles', reality_check: 'Not verifiable as active Waterloo startup with open junior roles', error_type: 'fabricated_entity', risk_level: 'high', harm_scenario: 'Student applies to unverifiable company', community_impact: 'General', confidence_expressed: 82 },
      { entity_name: 'Real Life Robotics', claimed_by_ai: 'Active Waterloo robotics startup hiring', reality_check: 'Not verifiable as active Waterloo startup with open junior roles', error_type: 'fabricated_entity', risk_level: 'high', harm_scenario: 'Student invests time in application to non-existent opportunity', community_impact: 'General', confidence_expressed: 80 },
    ],
    severity_score: 75,
    patterns_identified: ['Plausible-sounding entity fabrication', 'Regional ecosystem hallucination'],
  },
];

const RISK_COLORS: Record<string, { bg: string; color: string }> = {
  critical: { bg: 'rgba(230,59,46,0.1)', color: '#E63B2E' },
  high: { bg: 'rgba(245,158,11,0.1)', color: '#B45309' },
  medium: { bg: 'rgba(59,130,246,0.1)', color: '#1D4ED8' },
  low: { bg: 'rgba(16,185,129,0.1)', color: '#047857' },
};

export default function Registry() {
  const [entries, setEntries] = useState<any[]>(RESEARCH_ENTRIES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ query: '', platform: '', aiResponse: '', reporterNotes: '' });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.query.trim() || !form.aiResponse.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEntries(prev => [data, ...prev]);
      setForm({ query: '', platform: '', aiResponse: '', reporterNotes: '' });
      setShowForm(false);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'critical') return e.entries?.some((h: any) => h.risk_level === 'critical');
    if (filter === 'indigenous') return e.entries?.some((h: any) => h.community_impact === 'Indigenous');
    if (filter === 'fabricated') return e.entries?.some((h: any) => h.error_type === 'fabricated_entity');
    return true;
  });

  const totalHallucinations = entries.reduce((sum, e) => sum + (e.hallucination_count || 0), 0);
  const criticalCount = entries.filter(e => e.entries?.some((h: any) => h.risk_level === 'critical')).length;

  return (
    <>
      <Head><title>Hallucination Registry — AiEO</title></Head>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#F5F3EE', paddingTop: '100px' }}>
        {/* Header */}
        <div style={{ background: '#111', padding: '60px 48px 48px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tool 03 — Hallucination Registry
            </span>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', color: '#F5F3EE', marginTop: '12px', lineHeight: 1.05, marginBottom: '24px' }}>
              Document the<br />phantom record.
            </h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '700px' }}>
              {[
                { label: 'Total Entries', val: entries.length },
                { label: 'Hallucinations', val: totalHallucinations },
                { label: 'Critical Risk', val: criticalCount },
                { label: 'Platforms', val: 4 },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '36px', color: '#E63B2E' }}>{s.val}</div>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'critical', 'indigenous', 'fabricated'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? '#E63B2E' : '#E8E4DD',
                    color: filter === f ? 'white' : '#444',
                    border: filter === f ? 'none' : '1.5px solid rgba(17,17,17,0.12)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {f === 'all' ? 'All Entries' : f === 'critical' ? 'Critical Risk' : f === 'indigenous' ? 'Indigenous Impact' : 'Fabricated Entities'}
                </button>
              ))}
            </div>
            <button
              className="btn-magnetic"
              onClick={() => setShowForm(!showForm)}
              style={{
                background: '#E63B2E', color: 'white', border: 'none',
                padding: '10px 24px', borderRadius: '999px',
                fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Submit Hallucination
            </button>
          </div>

          {/* Submit form */}
          {showForm && (
            <div style={{ background: '#E8E4DD', borderRadius: '2rem', padding: '32px', marginBottom: '24px', border: '1.5px solid rgba(230,59,46,0.2)' }}>
              <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                Submit New Hallucination
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Query Asked *</label>
                  <input className="input-raw" value={form.query} onChange={e => setForm(f => ({ ...f, query: e.target.value }))} placeholder="What did the student ask?" style={{ width: '100%', padding: '12px 16px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Platform</label>
                  <select className="input-raw" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} style={{ width: '100%', padding: '12px 16px', fontSize: '14px', cursor: 'pointer' }}>
                    <option value="">Select platform...</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>AI Response (paste the full response) *</label>
                <textarea className="input-raw" value={form.aiResponse} onChange={e => setForm(f => ({ ...f, aiResponse: e.target.value }))} placeholder="Paste the complete AI response you received..." rows={6} style={{ width: '100%', padding: '12px 16px', fontSize: '13px', resize: 'vertical', fontFamily: '"Space Mono", monospace' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Your Notes (what did you verify?)</label>
                <textarea className="input-raw" value={form.reporterNotes} onChange={e => setForm(f => ({ ...f, reporterNotes: e.target.value }))} placeholder="What did you check? What was actually true?" rows={3} style={{ width: '100%', padding: '12px 16px', fontSize: '14px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-magnetic" onClick={handleSubmit} disabled={loading || !form.query.trim() || !form.aiResponse.trim()} style={{ background: loading ? '#ccc' : '#E63B2E', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Classifying...' : 'Submit & Classify →'}
                </button>
                <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#888', border: '1.5px solid rgba(17,17,17,0.12)', padding: '12px 24px', borderRadius: '999px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Registry entries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredEntries.map((entry) => (
              <div key={entry.id} style={{ background: '#E8E4DD', borderRadius: '2rem', overflow: 'hidden', border: '1.5px solid rgba(17,17,17,0.08)' }}>
                {/* Entry header */}
                <div
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  style={{ padding: '24px 28px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{entry.platform}</span>
                      <span style={{ color: '#ccc' }}>·</span>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888' }}>{new Date(entry.submitted_at).toLocaleDateString('en-CA')}</span>
                      {entry.entries?.some((h: any) => h.risk_level === 'critical') && (
                        <span className="risk-pill risk-critical" style={{ fontSize: '9px' }}>CRITICAL</span>
                      )}
                      {entry.entries?.some((h: any) => h.community_impact === 'Indigenous') && (
                        <span className="risk-pill" style={{ background: 'rgba(139,92,246,0.1)', color: '#7C3AED', border: '1px solid rgba(139,92,246,0.3)', fontSize: '9px' }}>Indigenous Impact</span>
                      )}
                    </div>
                    <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px', fontWeight: 500, color: '#222', marginBottom: '6px' }}>
                      "{entry.query}"
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', color: '#888' }}>
                        {entry.hallucination_count} hallucination{entry.hallucination_count !== 1 ? 's' : ''}
                      </span>
                      {entry.patterns_identified?.slice(0, 2).map((p: string, i: number) => (
                        <span key={i} style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#888', background: '#F5F3EE', borderRadius: '999px', padding: '2px 10px' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '28px', color: entry.severity_score >= 80 ? '#E63B2E' : '#F59E0B' }}>{entry.severity_score}</div>
                      <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '8px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</div>
                    </div>
                    <span style={{ color: '#888', fontSize: '18px' }}>{expandedEntry === entry.id ? '↑' : '↓'}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedEntry === entry.id && entry.entries?.map((h: any, i: number) => (
                  <div key={i} style={{ borderTop: '1px solid rgba(17,17,17,0.08)', padding: '24px 28px', background: '#F5F3EE' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Entity Named by AI</div>
                        <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', fontWeight: 600, color: '#E63B2E' }}>{h.entity_name}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Error Type</div>
                        <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: '#333' }}>{ERROR_TYPES[h.error_type] || h.error_type}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>AI Confidence</div>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '14px', color: '#333' }}>{h.confidence_expressed}%</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                      <div style={{ background: 'rgba(230,59,46,0.06)', borderRadius: '0.75rem', padding: '12px' }}>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#E63B2E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>AI Claimed</div>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#555', lineHeight: 1.5 }}>{h.claimed_by_ai}</p>
                      </div>
                      <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: '0.75rem', padding: '12px' }}>
                        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Reality</div>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#555', lineHeight: 1.5 }}>{h.reality_check}</p>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(17,17,17,0.04)', borderRadius: '0.75rem', padding: '12px' }}>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student Harm Scenario: </span>
                      <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#444' }}>{h.harm_scenario}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
