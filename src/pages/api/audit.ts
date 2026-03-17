import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orgName, orgType, region, website, description, targetCommunity } = req.body;

  if (!orgName) return res.status(400).json({ error: 'Organization name required' });

  try {
    // Generate a comprehensive AiEO audit for the organization
    const auditResponse = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: `You are an AiEO (AI Engine Optimization) auditor specializing in Canadian tech ecosystems, government programs, startup ecosystems, and equity-focused organizations.

AiEO is analogous to SEO but for AI systems - it measures how accurately and completely AI systems represent an organization when users query about it.

You will assess an organization's AI visibility across these dimensions:
1. Accuracy Score (0-100): How accurately would AI systems describe this org?
2. Completeness Score (0-100): How complete would AI descriptions be?
3. Hallucination Risk Score (0-100): How likely is AI to fabricate details? (higher = more risk)
4. Equity Reach Score (0-100): How well does AI surface this org for equity-seeking queries?
5. Data Freshness Score (0-100): How current would AI knowledge be?
6. Regional Specificity Score (0-100): How well does AI know this org's specific region?

Base your assessment on:
- Organization size/prominence (large national orgs score higher on accuracy)
- Regional specificity (local Windsor startup vs national Communitech)
- Equity focus (Indigenous, Black, francophone minority orgs typically score lower)
- Government-linked (usually higher accuracy, lower freshness)
- Media coverage and web presence
- Startup/niche status (less training data = lower scores)

Return ONLY this JSON structure:
{
  "org_name": "Organization name",
  "overall_score": 62,
  "grade": "C+",
  "scores": {
    "accuracy": 70,
    "completeness": 55,
    "hallucination_risk": 45,
    "equity_reach": 40,
    "data_freshness": 65,
    "regional_specificity": 60
  },
  "risk_level": "medium",
  "key_issues": [
    {"issue": "Issue description", "severity": "high", "impact": "Impact on students"},
    {"issue": "Issue description", "severity": "medium", "impact": "Impact on students"}
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "hallucination_patterns_likely": [
    {"pattern": "AI may fabricate program amounts", "example": "AI might claim grants of $50K when actual amount is $25K"},
    {"pattern": "AI may confuse with similar org", "example": "AI might conflate with larger national org"}
  ],
  "aieo_recommendations": [
    {
      "priority": "high",
      "action": "Add structured data markup",
      "description": "Implement JSON-LD schema on your website for Organization type",
      "implementation": "Add to your website's <head> section",
      "code_snippet": "{\"@context\": \"https://schema.org\", \"@type\": \"Organization\", \"name\": \"YourOrg\"}"
    },
    {
      "priority": "high", 
      "action": "Submit to authoritative directories",
      "description": "Get listed in canada.ca, Communitech, regional EDC directories",
      "implementation": "Submit applications to 3 key directories",
      "code_snippet": null
    }
  ],
  "benchmark_comparison": {
    "vs_major_urban": -25,
    "vs_national_programs": -18,
    "vs_regional_average": 5,
    "percentile": 42
  },
  "estimated_query_coverage": 0.35,
  "queries_likely_missed": ["Indigenous tech jobs Canada", "Windsor startup grants", "equity founder programs Ontario"],
  "narrative": "2-3 sentence plain English summary of the audit findings"
}`,
      messages: [{
        role: 'user',
        content: `Audit this organization for AiEO visibility:
Name: ${orgName}
Type: ${orgType || 'Unknown'}
Region: ${region || 'Canada'}
Website: ${website || 'Not provided'}
Description: ${description || 'Not provided'}
Target Community: ${targetCommunity || 'General'}`
      }]
    });

    const auditText = auditResponse.content[0].type === 'text' ? auditResponse.content[0].text : '{}';
    
    let auditData;
    try {
      auditData = JSON.parse(auditText.replace(/```json|```/g, '').trim());
    } catch {
      auditData = { error: 'Parse error', raw: auditText };
    }

    return res.status(200).json({
      ...auditData,
      audit_timestamp: new Date().toISOString(),
      org_input: { orgName, orgType, region, website, description, targetCommunity }
    });

  } catch (error: any) {
    console.error('Audit error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
}
