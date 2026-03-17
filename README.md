### Trace


A real-time platform that audits, scores, and fixes how AI systems represent Canadian organizations, programs, and opportunities. Every tool makes live API calls.

---

#### Setup

```bash
git clone https://github.com/NeftalemMG/Trace.git
cd TRACE
npm install
cp .env.local.example .env.local
# add your API keys to .env.local
npm run dev
```

Open http://localhost:3000

---

#### API Keys

| Key | Where to get it | Cost |
|-----|----------------|------|
| `ANTHROPIC_API_KEY` | console.anthropic.com/settings/keys | Pay per use |
| `PERPLEXITY_API_KEY` | perplexity.ai/settings/api | Free credits available |
| `GEMINI_API_KEY` | aistudio.google.com/app/apikey | Completely free |
| `OPENAI_API_KEY` | platform.openai.com/api-keys | Pay per use |

Only `ANTHROPIC_API_KEY` is required. The other three unlock their respective platforms in the Multi-Platform tool.

---

#### Pages

**Home**:  Landing page with live telemetry feed, platform accuracy comparison, and equity visibility bars.

**Query Engine** (`/query-engine`): Enter any student-facing query about Canadian opportunities. Runs a dual-layer analysis: a naive pass showing what AI tells the student, then a verification pass that identifies hallucination patterns, ghost entities, and equity gaps. Six research presets included.

**Audit Tool** (`/audit`): Enter an organization's details to receive an AiEO Visibility Score across six dimensions: Accuracy, Completeness, Hallucination Resistance, Equity Reach, Data Freshness, and Regional Specificity. Returns benchmark comparisons, key issues, likely hallucination patterns, and queries the org is probably invisible to.

**Multi-Platform** (`/multi-platform`): Run the same query simultaneously across Claude, Perplexity, Gemini, and ChatGPT GPT-4o. Returns side-by-side responses with per-platform accuracy estimates, hallucination risk scores, cross-platform entity verification, and consensus/contested claim analysis.

**Hallucination Registry** (`/registry`): Browse documented hallucinations from the research study. Submit new ones by pasting any AI response — Claude classifies the error type, risk level, community impact, and harm scenario automatically. Pre-loaded with all five documented hallucinations from the paper.

**Equity Map** (`/equity-map`): Select a community (Indigenous-led tech, Black founders, Halifax ocean/bio, etc.) and get a real analysis of which organizations serve them, how accurately AI represents each one, and what structural gaps exist. Visualizes the 54-point gap between Indigenous-led tech (28/100) and major urban ecosystems (82/100).

**AiEO Guide** (`/guide`): Enter an organization's details and receive a full implementation guide: ready-to-copy JSON-LD schema markup, a directory submission list with URLs, content strategy tactics with rationale, equity-specific visibility recommendations, FAQ schema questions, and a phased implementation timeline.

---

#### API Routes

All routes are in `src/pages/api/`.

- `query-engine.ts` - Dual-layer Claude analysis (naive response + critical verifier)
- `audit.ts` - 6-dimension AiEO score generation
- `multi-platform.ts` - Parallel calls to Claude, Perplexity, Gemini, and OpenAI GPT-4o with cross-platform analysis
- `registry.ts` - Hallucination classification (error type, risk level, harm scenario)
- `equity-map.ts` - Community ecosystem analysis
- `guide.ts` - Full AiEO implementation guide generation

---

#### Research Background

We tested GPT-4o, Gemini, Perplexity, and Claude across five student queries targeting niche Canadian ecosystems. Every response was cross-referenced against official sources. Key findings:

- Gemini: 40% accuracy, 95% confidence - highest hallucination risk
- ChatGPT: 55% accuracy, 90% confidence - fabricated entities presented with full confidence
- Perplexity: 65% accuracy, 75% confidence - best accuracy via live search
- Claude: 70% accuracy, 45% confidence - only platform to flag uncertainty

