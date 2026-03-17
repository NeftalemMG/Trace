import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// ─── Platform callers ─────────────────────────────────────────────────────────

async function callClaude(query: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: `You are a helpful career and opportunity advisor for Canadian students. Answer the question directly and specifically, naming real organizations, programs, and opportunities you know about in Canada. Be honest about uncertainty — flag when you're unsure.`,
    messages: [{ role: 'user', content: query }],
  });
  return res.content[0].type === 'text' ? res.content[0].text : '';
}

async function callPerplexity(query: string): Promise<{ text: string; citations: string[] }> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) {
    return {
      text: 'PERPLEXITY_API_KEY not configured. Get a free key at perplexity.ai/settings/api and add it to .env.local',
      citations: [],
    };
  }
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Answer specifically about Canadian organizations, programs, and opportunities.' },
          { role: 'user', content: query },
        ],
        max_tokens: 800,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { text: `Perplexity API error ${res.status}: ${err.slice(0, 300)}`, citations: [] };
    }
    const data = await res.json();
    return {
      text: data.choices?.[0]?.message?.content || 'No response',
      citations: data.citations || [],
    };
  } catch (e: any) {
    return { text: `Perplexity request failed: ${e.message}`, citations: [] };
  }
}

async function callGemini(query: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return 'GEMINI_API_KEY not configured. Get a free key at aistudio.google.com/app/apikey and add it to .env.local';
  }
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful career advisor for Canadian students. Answer specifically about Canadian organizations, programs, and opportunities.\n\nQuestion: ${query}`,
            }],
          }],
          generationConfig: { maxOutputTokens: 800 },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      return `Gemini API error ${res.status}: ${err.slice(0, 300)}`;
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
  } catch (e: any) {
    return `Gemini request failed: ${e.message}`;
  }
}

async function callChatGPT(query: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return 'OPENAI_API_KEY not configured. Add your OpenAI API key to .env.local as OPENAI_API_KEY=sk-...';
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful career and opportunity advisor for Canadian students. Answer the question directly and specifically, naming real organizations, programs, and opportunities you know about in Canada.',
          },
          { role: 'user', content: query },
        ],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return `ChatGPT API error ${res.status}: ${err.slice(0, 300)}`;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response from ChatGPT';
  } catch (e: any) {
    return `ChatGPT request failed: ${e.message}`;
  }
}

// ─── Cross-platform analyzer ──────────────────────────────────────────────────

async function analyzeResponses(
  query: string,
  responses: Record<string, string>,
  citations: string[]
): Promise<any> {
  const prompt = `You are an expert at analyzing AI hallucinations about Canadian opportunities.

Query: "${query}"

Platform responses:
${Object.entries(responses).map(([platform, response]) => `\n=== ${platform.toUpperCase()} ===\n${response}`).join('\n')}

${citations.length > 0 ? `Perplexity live citations: ${citations.join(', ')}` : ''}

Analyze all responses and return ONLY this JSON:
{
  "platform_scores": {
    "claude":     { "visibility_score": 70, "accuracy_estimate": 70, "confidence_level": 45, "hallucination_risk": "low",    "entities_named": ["org1", "org2"], "key_issues": [] },
    "perplexity": { "visibility_score": 65, "accuracy_estimate": 65, "confidence_level": 75, "hallucination_risk": "medium", "entities_named": ["org1"], "key_issues": ["issue1"] },
    "gemini":     { "visibility_score": 40, "accuracy_estimate": 40, "confidence_level": 95, "hallucination_risk": "high",   "entities_named": ["org1"], "key_issues": ["issue1"] },
    "chatgpt":    { "visibility_score": 55, "accuracy_estimate": 55, "confidence_level": 90, "hallucination_risk": "high",   "entities_named": ["org1"], "key_issues": ["issue1"] }
  },
  "cross_platform_entities": [
    { "name": "Org Name", "mentioned_by": ["claude", "perplexity"], "verification_status": "verified", "notes": "Why this status" }
  ],
  "consensus_orgs": ["orgs mentioned by 3+ platforms"],
  "contested_claims": ["claims where platforms disagree or one fabricates"],
  "best_platform": "platform name and brief reason",
  "worst_platform": "platform name and brief reason",
  "equity_gap_detected": true,
  "overall_visibility_score": 52,
  "summary": "2-3 sentence cross-platform summary of what this query reveals"
}

Only include scores for platforms that actually have responses (not error messages).`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = res.content[0].type === 'text' ? res.content[0].text : '{}';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { summary: text, platform_scores: {}, cross_platform_entities: [] };
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, platforms = ['claude', 'perplexity', 'gemini', 'chatgpt'] } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    // Run all selected platforms in parallel
    const calls: { platform: string; promise: Promise<any> }[] = [];

    if (platforms.includes('claude'))     calls.push({ platform: 'claude',     promise: callClaude(query) });
    if (platforms.includes('perplexity')) calls.push({ platform: 'perplexity', promise: callPerplexity(query) });
    if (platforms.includes('gemini'))     calls.push({ platform: 'gemini',     promise: callGemini(query) });
    if (platforms.includes('chatgpt'))    calls.push({ platform: 'chatgpt',    promise: callChatGPT(query) });

    const settled = await Promise.allSettled(calls.map(c => c.promise));

    const responses: Record<string, string> = {};
    let perplexityCitations: string[] = [];

    settled.forEach((result, i) => {
      const { platform } = calls[i];
      if (result.status === 'fulfilled') {
        const val = result.value;
        if (platform === 'perplexity' && typeof val === 'object' && val !== null) {
          responses[platform] = val.text;
          perplexityCitations = val.citations || [];
        } else {
          responses[platform] = typeof val === 'string' ? val : String(val);
        }
      } else {
        responses[platform] = `Request failed: ${result.reason?.message || 'unknown error'}`;
      }
    });

    const analysis = await analyzeResponses(query, responses, perplexityCitations);

    return res.status(200).json({
      query,
      responses,
      perplexity_citations: perplexityCitations,
      analysis,
      platforms_run: Object.keys(responses),
      api_keys_configured: {
        claude:     true,
        perplexity: !!process.env.PERPLEXITY_API_KEY,
        gemini:     !!process.env.GEMINI_API_KEY,
        chatgpt:    !!process.env.OPENAI_API_KEY,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Multi-platform error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
}
