import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { community, region, queryType } = req.body;

  try {
    const mapResponse = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: `You are an expert on Canadian equity tech ecosystems. Analyze AI visibility gaps for underrepresented communities in Canadian tech.

For the given community/region, provide a real analysis of:
1. Which real organizations serve this community
2. AI visibility scores for each
3. Key programs and their AI representation
4. Structural gaps

Return ONLY this JSON:
{
  "community": "Community name",
  "region": "Region",
  "overview": "2-3 sentence overview of this community's tech ecosystem",
  "visibility_score": 35,
  "organizations": [
    {
      "name": "Real org name",
      "type": "Accelerator|Funder|Network|Company|Government",
      "region": "City, Province",
      "visibility_score": 45,
      "verified_real": true,
      "website": "https://...",
      "key_programs": ["Program 1", "Program 2"],
      "ai_accuracy_issues": "Specific accuracy issues AI has with this org",
      "equity_focus": "How this org serves the community"
    }
  ],
  "key_programs": [
    {
      "name": "Real program name",
      "funder": "Funder org",
      "amount": "$amount or range",
      "eligibility": "Who can apply",
      "ai_representation": "poor|fair|good",
      "hallucination_risk": "high|medium|low",
      "common_ai_errors": "What AI gets wrong about this program"
    }
  ],
  "structural_gaps": [
    "Gap 1: Specific structural issue",
    "Gap 2: Another issue"
  ],
  "recommended_queries_to_test": [
    "Query 1 to test AI knowledge of this community",
    "Query 2"
  ],
  "benchmark": {
    "major_urban_score": 82,
    "national_program_score": 78,
    "this_community_score": 35,
    "gap": 47
  }
}`,
      messages: [{
        role: 'user',
        content: `Analyze AI visibility for: Community: ${community || 'Indigenous-led tech'}, Region: ${region || 'Canada'}, Query type: ${queryType || 'job opportunities'}`
      }]
    });

    const mapText = mapResponse.content[0].type === 'text' ? mapResponse.content[0].text : '{}';
    
    let mapData;
    try {
      mapData = JSON.parse(mapText.replace(/```json|```/g, '').trim());
    } catch {
      mapData = { error: 'Parse error', raw: mapText };
    }

    return res.status(200).json({ ...mapData, analyzed_at: new Date().toISOString() });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
