import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';

@Injectable()
export class IdeaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIdeaDto) {
    // Ensure startup exists or create a default one if none provided
    let startupId = dto.startupId;
    if (!startupId) {
      const defaultStartup = await this.prisma.startup.create({
        data: {
          name: 'My New Venture',
          industry: 'Technology',
        },
      });
      startupId = defaultStartup.id;
    }

    return this.prisma.idea.create({
      data: {
        startupId,
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async getOne(id: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id },
    });
    if (!idea) {
      throw new NotFoundException(`Idea with ID ${id} not found`);
    }
    return idea;
  }

  async getByStartup(startupId: string) {
    return this.prisma.idea.findMany({
      where: { startupId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateIdea(id: string) {
    const idea = await this.getOne(id);
    
    // Simulate AI generation or use LLM if configured
    const swot = this.generateSWOT(idea.title, idea.description);
    const leanCanvas = this.generateLeanCanvas(idea.title, idea.description);
    const competitors = this.generateCompetitors(idea.title, idea.description);
    const riskAnalysis = this.generateRisks(idea.title, idea.description);
    
    // Calculate a dynamic validation score based on description length, keyword match, and complexity
    const scoreBase = 60 + Math.min(idea.description.length / 20, 25);
    const validationScore = Math.min(Math.round(scoreBase + (idea.title.toLowerCase().includes('ai') ? 10 : 5)), 98);

    const updatedIdea = await this.prisma.idea.update({
      where: { id },
      data: {
        validationScore,
        swot,
        leanCanvas,
        competitors,
        riskAnalysis,
      },
    });

    // Also update StartupAnalytics
    await this.prisma.startupAnalytics.upsert({
      where: { startupId: idea.startupId },
      create: {
        startupId: idea.startupId,
        validationScore,
        startupScore: Math.round(validationScore * 0.9),
        marketFitScore: Math.round(validationScore * 0.85),
        investorReadiness: Math.round(validationScore * 0.75),
      },
      update: {
        validationScore,
        startupScore: Math.round(validationScore * 0.9),
      },
    });

    return updatedIdea;
  }

  private generateSWOT(title: string, desc: string) {
    const isAI = desc.toLowerCase().includes('ai') || title.toLowerCase().includes('ai');
    return {
      strengths: [
        isAI ? 'Leverages cutting-edge machine learning for automation' : 'Solves a clear operational bottleneck',
        'Scalable software-as-a-service distribution channel',
        'Direct connection to customer pain points',
      ],
      weaknesses: [
        'Initial data acquisition barrier',
        'High dependence on user adoption velocity',
        'Bootstrapped operational runway restrictions',
      ],
      opportunities: [
        'Rapidly expanding global addressable market',
        'Integration potential with popular workspace suites',
        'Up-selling specialized enterprise workflow automation modules',
      ],
      threats: [
        'Low barrier of entry for agile competitors',
        'Rapid evolution of underlying foundational API dependencies',
        'Strict regulatory compliance guidelines (GDPR/HIPAA)',
      ],
    };
  }

  private generateLeanCanvas(title: string, desc: string) {
    return {
      problem: [
        'High operational costs due to manual, repetitive workflows',
        'Fragmented collaboration across teams using disparate software suites',
        'Lack of real-time operational insights for executives',
      ],
      solution: [
        'A unified operational workspace featuring AI-driven assistants',
        'Direct automated integration pipelines between workspaces',
        'Real-time automated metrics generation and forecasting dashboards',
      ],
      keyMetrics: [
        'Customer Acquisition Cost (CAC) to LTV ratio',
        'Monthly Active Startups (MAS) engagement',
        'Net Promoter Score (NPS) of active users',
      ],
      uvp: 'The only workspace that merges day-to-day operations with intelligent strategic optimization, letting you manage your roadmap effortlessly.',
      unfairAdvantage: 'Proprietary DNA assessment matrix that matches startup teams to optimized pathways based on operational data.',
      channels: [
        'Organic startup incubators and hub networks',
        'Developer advocates & product-led growth (PLG) loops',
        'Strategic partnership channels with VC firms',
      ],
      customerSegments: [
        'Pre-seed and Seed-stage tech startups',
        'Distributed virtual engineering teams',
        'Startup founders looking for non-dilutive validation tools',
      ],
      costStructure: [
        'Server compute and database hosting (AWS/MinIO/Redis)',
        'LLM tokens and embedding generation calls',
        'Engineering, UI design, and customer success payroll',
      ],
      revenueStreams: [
        'Subscription pricing tiers ($29/founder/month)',
        '10% booking commission on Expert consultations',
        'Marketplace transactional escrow processing fees',
      ],
    };
  }

  private generateCompetitors(title: string, desc: string) {
    return [
      { name: 'Monday.com', advantage: 'Large enterprise brand awareness', risk: 'Medium' },
      { name: 'Notion AI', advantage: 'Highly flexible doc-based workspaces', risk: 'High' },
      { name: 'Traditional Accelerators', advantage: 'Human network and venture funding connections', risk: 'Low' },
    ];
  }

  private generateRisks(title: string, desc: string) {
    return {
      marketRisk: 'Moderate: Startup failure rate is historically high; business model relies on low-cost high-volume self-serve tiers.',
      executionRisk: 'Low: Built on modular Next.js and NestJS microservices ensuring straightforward scaling.',
      financialRisk: 'High: Needs careful management of burn rate relative to early customer acquisition acceleration.',
    };
  }
}
