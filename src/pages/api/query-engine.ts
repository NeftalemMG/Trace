import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, orgName, orgType, region } = req.body;

  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    // Run two parallel analyses: one as a "naive AI user" and one as a "verifier"
    const [naiveResponse, verifierResponse] = await Promise.all([
      // Simulate what a student would get (naive, no verification)
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are a helpful career advisor. A student is asking about Canadian opportunities. 
Answer helpfully and specifically. Name actual companies, programs, amounts, and deadlines you know about.
Do NOT say you don't know - give your best answer with specifics. 
Format your response as JSON with this structure:
{
  "answer": "your full answer here",
  "companies_named": ["company1", "company2"],
  "programs_named": ["program1", "program2"],
  "confidence_level": 85,
  "specific_claims": ["specific claim 1", "specific claim 2", "specific claim 3"]
}
Return ONLY the JSON, no markdown.`,
        messages: [{ role: 'user', content: query }]
      }),

      // Verifier: critically assess the answer
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: `You are an expert fact-checker and AI hallucination researcher specializing in Canadian tech ecosystems, government programs, startup funding, and immigration pathways. 
        
Your job: Analyze a student's query about Canadian opportunities and assess what problems a typical AI might have answering it accurately.

Consider:
- Is this about a niche/regional ecosystem likely to have low AI training data?
- Are there equity-facing communities (Indigenous, Black founders, francophone minorities) involved?
- Are government programs involved (funding amounts, deadlines, eligibility often change)?
- Is this about specific small/regional companies?
- What hallucination patterns are likely?

Return JSON with this EXACT structure:
{
  "visibility_score": 45,
  "accuracy_risk": "high",
  "hallucination_patterns": ["pattern1", "pattern2"],
  "equity_gap_detected": true,
  "equity_communities": ["Indigenous-led tech", "Black founders"],
  "data_freshness_risk": "high",
  "regional_specificity_risk": "medium",
  "recommended_verifications": ["verify company X on LinkedIn", "check program Y on canada.ca"],
  "verified_orgs": [
    {"name": "Org Name", "status": "verified", "confidence": 85, "source": "official website", "notes": "Details about this org"}
  ],
  "ghost_risk_orgs": [
    {"name": "Possibly fake org", "reason": "No verifiable web presence", "risk_level": "critical"}
  ],
  "aieo_recommendations": ["Add schema markup", "Submit to regional directories"],
  "summary": "Brief assessment paragraph"
}
Return ONLY the JSON, no markdown.`,
        messages: [{ role: 'user', content: `Query: "${query}"\n\nOrg being searched: ${orgName || 'N/A'}\nOrg type: ${orgType || 'N/A'}\nRegion: ${region || 'Canada'}` }]
      })
    ]);

    const naiveText = naiveResponse.content[0].type === 'text' ? naiveResponse.content[0].text : '{}';
    const verifierText = verifierResponse.content[0].type === 'text' ? verifierResponse.content[0].text : '{}';

    let naiveData, verifierData;
    try {
      naiveData = JSON.parse(naiveText.replace(/```json|```/g, '').trim());
    } catch {
      naiveData = { answer: naiveText, companies_named: [], programs_named: [], confidence_level: 50, specific_claims: [] };
    }
    try {
      verifierData = JSON.parse(verifierText.replace(/```json|```/g, '').trim());
    } catch {
      verifierData = { visibility_score: 50, accuracy_risk: 'medium', hallucination_patterns: [], summary: verifierText };
    }

    return res.status(200).json({
      query,
      naive_response: naiveData,
      verification: verifierData,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Query engine error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
}
