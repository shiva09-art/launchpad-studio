/* ═══════════════════════════════════════════════════════════
   AI Startup Idea Reviewer — Professional Scoring Engine
   
   Analyzes startup ideas across 8 dimensions and produces
   a structured, professional review report.
   
   100% free — runs entirely client-side, no API key needed.
═══════════════════════════════════════════════════════════ */

export interface DimensionScore {
  name: string;
  score: number;        // 0–100
  icon: string;         // FontAwesome class
  reasoning: string;    // Detailed explanation
  color: string;        // CSS color for the bar
}

export interface StartupReview {
  overallScore: number;
  verdict: "Strong" | "Promising" | "Needs Work" | "High Risk";
  verdictColor: string;
  dimensions: DimensionScore[];
  goodReasons: string[];
  badReasons: string[];
  recommendations: string[];
  reviewDate: string;
}

/* ─── Keyword Banks ─── */

const PROBLEM_KEYWORDS = [
  "problem", "pain", "struggle", "challenge", "frustration", "issue", "gap",
  "need", "broken", "inefficient", "expensive", "slow", "difficult", "waste",
  "lack", "missing", "failure", "bottleneck", "burden", "complexity",
  "friction", "obstacle", "barrier", "limitation", "cost", "time-consuming",
  "manual", "outdated", "legacy", "risk", "error", "mistake"
];

const SOLUTION_KEYWORDS = [
  "solution", "platform", "app", "tool", "software", "service", "automate",
  "simplify", "streamline", "optimize", "dashboard", "ai", "machine learning",
  "algorithm", "api", "integration", "workflow", "system", "engine",
  "marketplace", "network", "analytics", "insights", "predict", "detect",
  "enable", "empower", "transform", "revolutionize", "disrupt", "innovate"
];

const AUDIENCE_KEYWORDS = [
  "customer", "user", "founder", "startup", "enterprise", "small business",
  "smb", "consumer", "b2b", "b2c", "developer", "designer", "marketer",
  "student", "freelancer", "agency", "healthcare", "fintech", "edtech",
  "ecommerce", "saas", "retailer", "manufacturer", "professional",
  "team", "manager", "executive", "cto", "ceo", "creator", "influencer"
];

const BUSINESS_MODEL_KEYWORDS = [
  "subscription", "saas", "freemium", "revenue", "monetize", "pricing",
  "fee", "commission", "marketplace", "transaction", "premium", "tier",
  "plan", "license", "advertising", "ads", "affiliate", "partnership",
  "b2b", "enterprise", "contract", "recurring", "arpu", "ltv", "mrr",
  "unit economics", "margin", "profit", "cost", "charge"
];

const MARKET_KEYWORDS = [
  "market", "industry", "billion", "million", "tam", "sam", "som",
  "growth", "trend", "demand", "opportunity", "sector", "vertical",
  "global", "emerging", "expanding", "underserved", "untapped",
  "segment", "niche", "mainstream", "adoption", "penetration"
];

const COMPETITIVE_KEYWORDS = [
  "competitor", "competition", "advantage", "moat", "unique", "different",
  "better", "faster", "cheaper", "proprietary", "patent", "first-mover",
  "defensible", "network effect", "switching cost", "brand", "data",
  "exclusive", "unfair advantage", "ip", "secret", "innovative"
];

const SCALABILITY_KEYWORDS = [
  "scale", "scalable", "growth", "expand", "global", "automated",
  "cloud", "infrastructure", "platform", "api", "marketplace",
  "network", "viral", "organic", "self-serve", "onboard", "multiply",
  "replicate", "franchise", "white-label", "enterprise", "international"
];

const EXECUTION_KEYWORDS = [
  "mvp", "prototype", "launch", "beta", "roadmap", "milestone",
  "team", "co-founder", "experience", "expertise", "track record",
  "traction", "users", "revenue", "customer", "pilot", "validation",
  "tested", "proven", "iteration", "agile", "lean", "sprint"
];

/* ─── Analysis Functions ─── */

function countKeywordMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of keywords) {
    // Count unique keyword matches (not repeated occurrences)
    if (lower.includes(kw.toLowerCase())) count++;
  }
  return count;
}

function analyzeTextQuality(text: string): {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  hasStructure: boolean;
  specificity: number;
} {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const avgSentenceLength = wordCount / sentenceCount;

  // Check for structural indicators (lists, questions, sections)
  const hasStructure =
    text.includes("\n") ||
    text.includes("•") ||
    text.includes("-") ||
    text.includes("1.") ||
    text.includes("?");

  // Specificity: presence of numbers, percentages, proper nouns
  const numberMatches = text.match(/\d+/g) || [];
  const percentMatches = text.match(/\d+%/g) || [];
  const specificity = Math.min(
    100,
    numberMatches.length * 12 + percentMatches.length * 20 + (hasStructure ? 15 : 0)
  );

  return { wordCount, sentenceCount, avgSentenceLength, hasStructure, specificity };
}

function scoreDimension(
  matches: number,
  maxKeywords: number,
  textQuality: ReturnType<typeof analyzeTextQuality>,
  baseMultiplier: number = 1
): number {
  // Keyword coverage score (0–50)
  const keywordScore = Math.min(50, (matches / Math.max(1, maxKeywords * 0.3)) * 50);

  // Text depth score based on word count (0–30)
  const depthScore = Math.min(30, (textQuality.wordCount / 150) * 30);

  // Specificity bonus (0–20)
  const specificityScore = Math.min(20, textQuality.specificity * 0.2);

  const raw = (keywordScore + depthScore + specificityScore) * baseMultiplier;
  return Math.min(100, Math.max(8, Math.round(raw)));
}

/* ─── Reasoning Generator ─── */

function generateReasoning(
  dimensionName: string,
  score: number,
  matches: number,
  textQuality: ReturnType<typeof analyzeTextQuality>
): string {
  if (score >= 80) {
    return `Excellent ${dimensionName.toLowerCase()} articulation. The idea clearly addresses this dimension with ${matches} relevant indicators and detailed specificity. This is well above the threshold for investor-ready pitches.`;
  } else if (score >= 60) {
    return `Good ${dimensionName.toLowerCase()} coverage with ${matches} relevant indicators. Adding more specifics — data points, metrics, and concrete examples — would strengthen this dimension further.`;
  } else if (score >= 40) {
    return `Moderate ${dimensionName.toLowerCase()} signals detected (${matches} indicators). This dimension needs more development. Consider elaborating on specific details, benchmarks, or evidence to support your claims.`;
  } else if (score >= 20) {
    return `Weak ${dimensionName.toLowerCase()} coverage with only ${matches} relevant indicators. This is a significant gap. We recommend dedicating focused effort to articulate this dimension before approaching investors or partners.`;
  } else {
    return `Very limited ${dimensionName.toLowerCase()} signals detected. This dimension is critically underdeveloped. A professional startup pitch requires clear articulation in this area.`;
  }
}

/* ─── Main Reviewer ─── */

export function reviewStartupIdea(
  title: string,
  description: string,
  helpNeeded: string
): StartupReview {
  const fullText = `${title} ${description} ${helpNeeded}`;
  const textQuality = analyzeTextQuality(fullText);

  // Analyze each dimension
  const problemMatches = countKeywordMatches(fullText, PROBLEM_KEYWORDS);
  const solutionMatches = countKeywordMatches(fullText, SOLUTION_KEYWORDS);
  const audienceMatches = countKeywordMatches(fullText, AUDIENCE_KEYWORDS);
  const businessMatches = countKeywordMatches(fullText, BUSINESS_MODEL_KEYWORDS);
  const marketMatches = countKeywordMatches(fullText, MARKET_KEYWORDS);
  const competitiveMatches = countKeywordMatches(fullText, COMPETITIVE_KEYWORDS);
  const scalabilityMatches = countKeywordMatches(fullText, SCALABILITY_KEYWORDS);
  const executionMatches = countKeywordMatches(fullText, EXECUTION_KEYWORDS);

  // Score each dimension
  const dimensions: DimensionScore[] = [
    {
      name: "Problem Clarity",
      score: scoreDimension(problemMatches, PROBLEM_KEYWORDS.length, textQuality, 1.1),
      icon: "fa-solid fa-crosshairs",
      reasoning: generateReasoning("Problem Clarity", scoreDimension(problemMatches, PROBLEM_KEYWORDS.length, textQuality, 1.1), problemMatches, textQuality),
      color: "#ef4444",
    },
    {
      name: "Solution Uniqueness",
      score: scoreDimension(solutionMatches, SOLUTION_KEYWORDS.length, textQuality, 1.0),
      icon: "fa-solid fa-lightbulb",
      reasoning: generateReasoning("Solution Uniqueness", scoreDimension(solutionMatches, SOLUTION_KEYWORDS.length, textQuality, 1.0), solutionMatches, textQuality),
      color: "#f59e0b",
    },
    {
      name: "Target Audience",
      score: scoreDimension(audienceMatches, AUDIENCE_KEYWORDS.length, textQuality, 1.05),
      icon: "fa-solid fa-users",
      reasoning: generateReasoning("Target Audience", scoreDimension(audienceMatches, AUDIENCE_KEYWORDS.length, textQuality, 1.05), audienceMatches, textQuality),
      color: "#3b82f6",
    },
    {
      name: "Business Model",
      score: scoreDimension(businessMatches, BUSINESS_MODEL_KEYWORDS.length, textQuality, 0.95),
      icon: "fa-solid fa-coins",
      reasoning: generateReasoning("Business Model", scoreDimension(businessMatches, BUSINESS_MODEL_KEYWORDS.length, textQuality, 0.95), businessMatches, textQuality),
      color: "#10b981",
    },
    {
      name: "Market Size",
      score: scoreDimension(marketMatches, MARKET_KEYWORDS.length, textQuality, 0.9),
      icon: "fa-solid fa-chart-pie",
      reasoning: generateReasoning("Market Size", scoreDimension(marketMatches, MARKET_KEYWORDS.length, textQuality, 0.9), marketMatches, textQuality),
      color: "#8b5cf6",
    },
    {
      name: "Competitive Advantage",
      score: scoreDimension(competitiveMatches, COMPETITIVE_KEYWORDS.length, textQuality, 1.0),
      icon: "fa-solid fa-shield-halved",
      reasoning: generateReasoning("Competitive Advantage", scoreDimension(competitiveMatches, COMPETITIVE_KEYWORDS.length, textQuality, 1.0), competitiveMatches, textQuality),
      color: "#ec4899",
    },
    {
      name: "Scalability",
      score: scoreDimension(scalabilityMatches, SCALABILITY_KEYWORDS.length, textQuality, 0.95),
      icon: "fa-solid fa-rocket",
      reasoning: generateReasoning("Scalability", scoreDimension(scalabilityMatches, SCALABILITY_KEYWORDS.length, textQuality, 0.95), scalabilityMatches, textQuality),
      color: "#06b6d4",
    },
    {
      name: "Execution Feasibility",
      score: scoreDimension(executionMatches, EXECUTION_KEYWORDS.length, textQuality, 1.0),
      icon: "fa-solid fa-hammer",
      reasoning: generateReasoning("Execution Feasibility", scoreDimension(executionMatches, EXECUTION_KEYWORDS.length, textQuality, 1.0), executionMatches, textQuality),
      color: "#f97316",
    },
  ];

  // Weighted overall score
  const weights = [0.15, 0.15, 0.12, 0.13, 0.10, 0.13, 0.10, 0.12];
  const overallScore = Math.round(
    dimensions.reduce((sum, dim, i) => sum + dim.score * weights[i], 0)
  );

  // Determine verdict
  let verdict: StartupReview["verdict"];
  let verdictColor: string;
  if (overallScore >= 75) {
    verdict = "Strong";
    verdictColor = "#4ade80";
  } else if (overallScore >= 55) {
    verdict = "Promising";
    verdictColor = "#60a5fa";
  } else if (overallScore >= 35) {
    verdict = "Needs Work";
    verdictColor = "#f59e0b";
  } else {
    verdict = "High Risk";
    verdictColor = "#ef4444";
  }

  // Generate Good Reasons
  const goodReasons: string[] = [];
  const sortedHigh = [...dimensions].sort((a, b) => b.score - a.score);

  if (sortedHigh[0].score >= 50) {
    goodReasons.push(`Strong ${sortedHigh[0].name.toLowerCase()} — your idea scores ${sortedHigh[0].score}/100 in this critical dimension.`);
  }
  if (sortedHigh[1].score >= 45) {
    goodReasons.push(`Solid ${sortedHigh[1].name.toLowerCase()} coverage — above average at ${sortedHigh[1].score}/100.`);
  }
  if (textQuality.wordCount >= 80) {
    goodReasons.push(`Well-articulated pitch — ${textQuality.wordCount} words demonstrate thorough thinking about the concept.`);
  }
  if (textQuality.specificity > 30) {
    goodReasons.push("Includes specific data points and metrics, which significantly strengthens credibility.");
  }
  if (problemMatches >= 3 && solutionMatches >= 3) {
    goodReasons.push("Clear problem-solution alignment — the idea connects a defined pain point to a concrete solution.");
  }
  if (audienceMatches >= 2) {
    goodReasons.push("Defined target market — knowing your customer is the foundation of product-market fit.");
  }
  if (goodReasons.length === 0) {
    goodReasons.push("The idea shows initiative and willingness to build something new — that's the first step.");
  }

  // Generate Bad Reasons
  const badReasons: string[] = [];
  const sortedLow = [...dimensions].sort((a, b) => a.score - b.score);

  if (sortedLow[0].score < 40) {
    badReasons.push(`Weak ${sortedLow[0].name.toLowerCase()} — scoring only ${sortedLow[0].score}/100. This is a critical gap that needs addressing.`);
  }
  if (sortedLow[1].score < 40) {
    badReasons.push(`Underdeveloped ${sortedLow[1].name.toLowerCase()} — at ${sortedLow[1].score}/100, this needs significant improvement.`);
  }
  if (textQuality.wordCount < 40) {
    badReasons.push(`Very brief description (${textQuality.wordCount} words) — investors and partners need more detail to evaluate the opportunity.`);
  }
  if (businessMatches < 2) {
    badReasons.push("No clear revenue model mentioned — how will this business generate sustainable income?");
  }
  if (competitiveMatches < 2) {
    badReasons.push("No competitive moat articulated — what prevents incumbents from copying this approach?");
  }
  if (marketMatches < 2) {
    badReasons.push("Market sizing is absent — investors need TAM/SAM/SOM estimates to gauge the opportunity.");
  }
  if (badReasons.length === 0) {
    badReasons.push("Continue refining each dimension to elevate the overall score further.");
  }

  // Generate Recommendations
  const recommendations: string[] = [];

  if (sortedLow[0].score < 50) {
    recommendations.push(`Priority: Strengthen your ${sortedLow[0].name.toLowerCase()} — this is currently the weakest dimension. Research competitors and articulate what makes your approach unique.`);
  }
  if (textQuality.wordCount < 100) {
    recommendations.push("Expand your pitch to 150+ words — include specific metrics, target customer profiles, and revenue projections.");
  }
  if (businessMatches < 3) {
    recommendations.push("Define a clear monetization strategy — specify pricing tiers, revenue model (SaaS, marketplace, freemium), and target unit economics.");
  }
  if (marketMatches < 3) {
    recommendations.push("Add market sizing data — research your TAM (Total Addressable Market) and include industry growth rates to validate the opportunity.");
  }
  if (competitiveMatches < 3) {
    recommendations.push("Build a competitive analysis matrix — list your top 3 competitors and clearly articulate your unfair advantage over each.");
  }
  if (executionMatches < 3) {
    recommendations.push("Outline your execution roadmap — define MVP features, launch timeline, and key milestones for the next 6-12 months.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Your idea is well-articulated. Consider seeking mentorship from industry experts to validate assumptions and refine your go-to-market strategy.");
  }

  return {
    overallScore,
    verdict,
    verdictColor,
    dimensions,
    goodReasons,
    badReasons,
    recommendations,
    reviewDate: new Date().toISOString(),
  };
}
