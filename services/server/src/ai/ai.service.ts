import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async generatePitchDeck(startupId: string) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
    });
    if (!startup) throw new NotFoundException('Startup not found');

    const pitchDeck = await this.prisma.pitchDeck.create({
      data: {
        startupId,
        problem: `Founders waste months building MVPs without validation because traditional toolchains are fragmented and lack business insights.`,
        solution: `Launch Pad - a unified Anti-Gravity OS that integrates idea validation, AI roadmaps, Kanban workspaces, developer tools, expert networks, and investor channels into a single SaaS platform.`,
        marketSize: `$24 Billion total addressable market (TAM) across 150 million global founders and micro-SMEs starting up annually.`,
        competition: `Indirect competitors like Monday.com, Notion AI, and traditional accelerators lack deep database integrations and venture-readiness scoring models.`,
        businessModel: `B2B SaaS with subscription tiers ($29 - $149/month) coupled with transactional marketplace commissions (10% on expert consults and service orders).`,
        traction: `Alpha launch completed with 5 active startups, showing a 40% reduction in time-to-MVP specifications.`,
        team: `Experienced team of startup founders, full-stack engineers, and product designers with previous successful exits.`,
        financials: `Projecting $1.2M ARR in Year 1 with a 75% gross margin by utilizing automated API integrations.`,
        ask: `$1.5 Million Seed round to expand the AI core validator, increase integration catalogs, and hire growth marketing engineers.`,
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

    // Run simple rules to predict success
    const hasValidatedIdeas = startup.ideas.some((i) => (i.validationScore || 0) > 75);
    const successProbability = hasValidatedIdeas ? 82.5 : 54.0;
    
    const failureRisks = [
      'High market competition in the designated industry segment',
      !hasValidatedIdeas ? 'Unvalidated idea core assumptions' : 'Under-diversified early growth acquisition channels',
      'Potential cash runway burn-out before reaching product-market fit',
    ];

    const missingRoles = [
      'Growth Marketing Director (PLG specialist)',
      'Chief Technology Officer (AI / LLM scaling experience)',
    ];

    const prediction = await this.prisma.successPrediction.create({
      data: {
        startupId,
        successProbability,
        failureRisks,
        missingRoles,
        fundingLikelihood: hasValidatedIdeas ? 'High' : 'Medium',
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
