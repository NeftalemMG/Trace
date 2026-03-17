import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// In-memory store (in production this would be a DB)
let registry: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ entries: registry, total: registry.length });
  }

  if (req.method === 'POST') {
    const { aiResponse, query, platform, reporterNotes } = req.body;

    if (!aiResponse || !query) {
      return res.status(400).json({ error: 'AI response and query required' });
    }

    try {
      const classifyResponse = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are an expert at identifying and classifying AI hallucinations about Canadian opportunities.

Classify the hallucinations in an AI response about Canadian tech opportunities, jobs, grants, or programs.

Return ONLY this JSON:
{
  "hallucinations_found": true,
  "hallucination_count": 3,
  "entries": [
    {
      "entity_name": "Name of hallucinated company/program",
      "claimed_by_ai": "What the AI claimed about this entity",
      "reality_check": "What is actually true or unknown",
      "error_type": "fabricated_entity|wrong_location|outdated_info|wrong_eligibility|misclassified|confidence_mismatch",
      "risk_level": "critical|high|medium|low",
      "harm_scenario": "How this could harm a student",
      "community_impact": "Indigenous|Black founders|Regional|General|Multiple",
      "confidence_expressed": 85
    }
  ],
  "patterns_identified": ["Pattern 1", "Pattern 2"],
  "severity_score": 75,
  "summary": "Brief classification summary"
}`,
        messages: [{
          role: 'user',
          content: `Query asked: "${query}"\nPlatform: ${platform || 'Unknown'}\nAI Response to analyze:\n${aiResponse}\n\nReporter notes: ${reporterNotes || 'None'}`
        }]
      });

      const classifyText = classifyResponse.content[0].type === 'text' ? classifyResponse.content[0].text : '{}';
      
      let classifyData;
      try {
        classifyData = JSON.parse(classifyText.replace(/```json|```/g, '').trim());
      } catch {
        classifyData = { hallucinations_found: false, entries: [], summary: classifyText };
      }

      const registryEntry = {
        id: Date.now().toString(),
        query,
        platform: platform || 'Unknown',
        submitted_at: new Date().toISOString(),
        original_response_snippet: aiResponse.substring(0, 300) + '...',
        ...classifyData
      };

      registry.unshift(registryEntry);
      if (registry.length > 100) registry = registry.slice(0, 100);

      return res.status(200).json(registryEntry);

    } catch (error: any) {
      console.error('Registry error:', error);
      return res.status(500).json({ error: error.message || 'Internal error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
