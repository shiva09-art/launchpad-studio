import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OpenAI } from 'openai';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async generatePitchDeck(startupId: string) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
    });
    if (!startup) throw new NotFoundException('Startup not found');

    let problem = `Founders waste months building MVPs without validation because traditional toolchains are fragmented and lack business insights.`;
    let solution = `Launch Pad - a unified Anti-Gravity OS that integrates idea validation, AI roadmaps, Kanban workspaces, developer tools, expert networks, and investor channels into a single SaaS platform.`;
    let marketSize = `$24 Billion total addressable market (TAM) across 150 million global founders and micro-SMEs starting up annually.`;
    let competition = `Indirect competitors like Monday.com, Notion AI, and traditional accelerators lack deep database integrations and venture-readiness scoring models.`;
    let businessModel = `B2B SaaS with subscription tiers ($29 - $149/month) coupled with marketplace commission structures.`;
    let traction = `Alpha launch completed with 5 active startups, showing a 40% reduction in time-to-MVP specifications.`;
    let team = `Experienced team of startup founders, full-stack engineers, and product designers with previous successful exits.`;
    let financials = `Projecting $1.2M ARR in Year 1 with a 75% gross margin by utilizing automated API integrations.`;
    let ask = `$1.5 Million Seed round to expand the AI core validator, increase integration catalogs, and hire growth marketing engineers.`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const prompt = `You are a world-class venture capitalist and pitch advisor. 
Help this startup:
Name: "${startup.name}"
Industry: "${startup.industry}"
Stage: "${startup.stage}"

Generate a customized, professional pitch deck outline in JSON format containing keys:
"problem", "solution", "marketSize", "competition", "businessModel", "traction", "team", "financials", "ask".
Keep each slide copy descriptive, high-quality, and impactful (1-2 sentences). Do not use markdown codeblocks.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });

        const resultJson = JSON.parse(completion.choices[0].message?.content || '{}');
        problem = resultJson.problem || problem;
        solution = resultJson.solution || solution;
        marketSize = resultJson.marketSize || marketSize;
        competition = resultJson.competition || competition;
        businessModel = resultJson.businessModel || businessModel;
        traction = resultJson.traction || traction;
        team = resultJson.team || team;
        financials = resultJson.financials || financials;
        ask = resultJson.ask || ask;
      } catch (err) {
        console.error('Failed to generate pitch deck using OpenAI, falling back to template copy', err);
      }
    }

    const pitchDeck = await this.prisma.pitchDeck.create({
      data: {
        startupId,
        problem,
        solution,
        marketSize,
        competition,
        businessModel,
        traction,
        team,
        financials,
        ask,
        shareToken: Math.random().toString(36).substring(2, 15),
      },
    });

    // Update investor readiness score in analytics
    await this.prisma.startupAnalytics.update({
      where: { startupId },
      data: {
        investorReadiness: 85,
        startupScore: 78,
      },
    });

    return pitchDeck;
  }

  async predictSuccess(startupId: string) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
      include: { ideas: true },
    });
    if (!startup) throw new NotFoundException('Startup not found');

    const hasValidatedIdeas = startup.ideas.some((i) => (i.validationScore || 0) > 75);
    
    let successProbability = hasValidatedIdeas ? 82.5 : 54.0;
    let failureRisks = [
      'High market competition in the designated industry segment',
      !hasValidatedIdeas ? 'Unvalidated idea core assumptions' : 'Under-diversified early growth acquisition channels',
      'Potential cash runway burn-out before reaching product-market fit',
    ];
    let missingRoles = [
      'Growth Marketing Director (PLG specialist)',
      'Chief Technology Officer (AI / LLM scaling experience)',
    ];
    let fundingLikelihood = hasValidatedIdeas ? 'High' : 'Medium';

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const prompt = `You are an AI startup success predictor model. 
Analyze this startup:
Name: "${startup.name}"
Industry: "${startup.industry}"
Stage: "${startup.stage}"
Has validated ideas: ${hasValidatedIdeas}

Provide a survival metrics analysis in JSON format containing:
1. "probability": number between 10 and 95 indicating success probability.
2. "risks": string array of top 3 failure risks.
3. "missingRoles": string array of recommended team roles to hire.
4. "funding": string indicating likelihood of funding (Low/Medium/High).

Output raw JSON only.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });

        const resultJson = JSON.parse(completion.choices[0].message?.content || '{}');
        successProbability = resultJson.probability || successProbability;
        failureRisks = resultJson.risks || failureRisks;
        missingRoles = resultJson.missingRoles || missingRoles;
        fundingLikelihood = resultJson.funding || fundingLikelihood;
      } catch (err) {
        console.error('Failed to generate success prediction using OpenAI, falling back to default model', err);
      }
    }

    const prediction = await this.prisma.successPrediction.create({
      data: {
        startupId,
        successProbability,
        failureRisks,
        missingRoles,
        fundingLikelihood,
      },
    });

    return prediction;
  }

  async runSimulation(startupId: string, type: 'revenue' | 'burn' | 'growth', params: { cash?: number; burn?: number; growthRate?: number; steps?: number }) {
    const startup = await this.prisma.startup.findUnique({ where: { id: startupId } });
    if (!startup) throw new NotFoundException('Startup not found');

    const startCash = params.cash || 100000;
    const startBurn = params.burn || 8000;
    const growth = params.growthRate || 0.15; // 15% growth
    const steps = params.steps || 12; // 12 months

    const results = [];
    let currentCash = startCash;
    let currentRevenue = 1000;

    for (let month = 1; month <= steps; month++) {
      currentRevenue = Math.round(currentRevenue * (1 + growth));
      const netBurn = startBurn - currentRevenue;
      currentCash = Math.max(0, Math.round(currentCash - netBurn));
      
      results.push({
        month: `Month ${month}`,
        cash: currentCash,
        revenue: currentRevenue,
        burn: startBurn,
        runwayRemaining: netBurn > 0 ? Math.round(currentCash / netBurn) : 999, // 999 means infinite runway (profitable)
      });
    }

    const run = await this.prisma.simulationRun.create({
      data: {
        startupId,
        type,
        parameters: params as any,
        results: results as any,
      },
    });

    return run;
  }
}
