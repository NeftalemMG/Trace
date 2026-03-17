import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orgName, orgType, region, website, programs, description, targetCommunity, auditScore } = req.body;

  if (!orgName) return res.status(400).json({ error: 'Organization name required' });

  try {
    const guideResponse = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `You are an expert in AiEO (AI Engine Optimization) for Canadian organizations. You help organizations improve how AI systems like ChatGPT, Claude, Gemini, and Perplexity represent them.

Generate a comprehensive, actionable AiEO implementation guide. Include:
1. Ready-to-use JSON-LD structured data schema
2. Specific directory submission list with URLs
3. Content strategy for AI training signal improvement
4. Equity visibility tactics for underrepresented communities

Return ONLY this JSON structure:
{
  "org_name": "Org name",
  "guide_title": "AiEO Visibility Guide: [Org Name]",
  "executive_summary": "2-3 sentence summary",
  "priority_score": 85,
  "schema_markup": {
    "organization": "{complete JSON-LD for Organization schema}",
    "local_business": "{JSON-LD if applicable}",
    "event": "{JSON-LD template for events if applicable}",
    "funding_opportunity": "{schema if they offer grants/funding}"
  },
  "directory_submissions": [
    {"name": "Directory name", "url": "https://...", "priority": "high", "instructions": "How to submit", "equity_relevant": true},
    {"name": "Canada.ca Business Directory", "url": "https://www.canada.ca/en/services/business.html", "priority": "high", "instructions": "Submit via Innovation, Science and Economic Development Canada", "equity_relevant": false}
  ],
  "content_strategy": {
    "title": "Content for AI Discoverability",
    "tactics": [
      {
        "tactic": "Publish program eligibility pages",
        "rationale": "AI systems learn eligibility criteria from structured web pages",
        "implementation": "Create dedicated pages for each program with clear headers: Who can apply, Amount, Deadline, How to apply",
        "priority": "high"
      }
    ]
  },
  "equity_visibility_tactics": [
    {
      "community": "Indigenous tech seekers",
      "tactic": "Partner with ICTC and NACCA directories",
      "implementation": "Submit profile to ICTC member directory and NACCA's Indigenous business listing",
      "expected_impact": "medium"
    }
  ],
  "press_release_template": "Draft press release template for announcing programs/milestones",
  "faq_schema_questions": [
    {"question": "Who is eligible for [program]?", "answer": "Template answer with key eligibility criteria"},
    {"question": "How do I apply to [program]?", "answer": "Template answer with application steps"}
  ],
  "monitoring_checklist": [
    "Test org visibility monthly: ask ChatGPT, Claude, Gemini about your programs",
    "Track which queries surface your org",
    "Check for hallucinations quarterly"
  ],
  "implementation_timeline": {
    "week_1": ["Task 1", "Task 2"],
    "month_1": ["Task 1", "Task 2"],
    "ongoing": ["Task 1"]
  }
}`,
      messages: [{
        role: 'user',
        content: `Generate AiEO guide for:
Name: ${orgName}
Type: ${orgType || 'Tech organization'}
Region: ${region || 'Canada'}
Website: ${website || 'Not provided'}
Programs/Services: ${programs || 'Not specified'}
Description: ${description || 'Not provided'}
Target Community: ${targetCommunity || 'General'}
Current Audit Score: ${auditScore || 'Not audited'}`
      }]
    });

    const guideText = guideResponse.content[0].type === 'text' ? guideResponse.content[0].text : '{}';
    
    let guideData;
    try {
      guideData = JSON.parse(guideText.replace(/```json|```/g, '').trim());
    } catch {
      guideData = { error: 'Parse error', raw: guideText };
    }

    return res.status(200).json({
      ...guideData,
      generated_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Guide error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
}
