import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StartupService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, industry: string, stage: string) {
    const startup = await this.prisma.startup.create({
      data: {
        name,
        industry,
        stage: stage || 'Idea',
      },
    });

    // Automatically create empty analytics structure
    await this.prisma.startupAnalytics.create({
      data: {
        startupId: startup.id,
        startupScore: 50,
        validationScore: 0,
        investorReadiness: 30,
        marketFitScore: 20,
        burnRate: 5000,
        revenueForecast: [
          { month: 'Jul', revenue: 0 },
          { month: 'Aug', revenue: 500 },
          { month: 'Sep', revenue: 1500 },
          { month: 'Oct', revenue: 3000 },
          { month: 'Nov', revenue: 6000 },
          { month: 'Dec', revenue: 12000 },
        ],
      },
    });

    // Automatically generate founder DNA metrics
    await this.prisma.founderDNA.create({
      data: {
        startupId: startup.id,
        executionAbility: 65.0,
        technicalCapability: 70.0,
        businessCapability: 55.0,
        fundingReadiness: 40.0,
      },
    });

    // Generate initial default roadmap
    await this.generateRoadmap(startup.id);

    return startup;
  }

  async getOne(id: string) {
    const startup = await this.prisma.startup.findUnique({
      where: { id },
      include: {
        members: true,
        ideas: true,
        roadmaps: {
          include: {
            milestones: {
              include: {
                tasks: true,
              },
            },
          },
        },
        analytics: true,
        dna: true,
      },
    });
    if (!startup) {
      throw new NotFoundException(`Startup with ID ${id} not found`);
    }
    return startup;
  }

  async addMember(startupId: string, userId: string, role: string) {
    // Ensure startup exists
    await this.getOne(startupId);
    
    // Check if user is registered in local db, create user if not exists
    let user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: userId,
          email: `${userId.substring(0, 8)}@placeholder.com`,
          role: 'FOUNDER',
        },
      });
    }

    return this.prisma.startupMember.create({
      data: {
        startupId,
        userId,
        role: role || 'Member',
      },
    });
  }

  async generateRoadmap(startupId: string) {
    const startup = await this.prisma.startup.findUnique({ where: { id: startupId } });
    if (!startup) throw new NotFoundException('Startup not found');

    const stage = startup.stage;

    const roadmap = await this.prisma.roadmap.create({
      data: {
        startupId,
        title: `${startup.name} - Master Launch Blueprint`,
        description: `Custom roadmap tailored for the ${stage} stage.`,
      },
    });

    // Define milestone milestones and tasks based on stage
    let milestonesData = [];
    if (stage === 'Idea') {
      milestonesData = [
        {
          title: 'Phase 1: Idea Validation & Validation Analysis',
          tasks: [
            'Fill out business assumptions in Lean Canvas',
            'Conduct AI validation review & Competitor SWOT',
            'Conduct 10 customer interviews with target audience',
          ],
        },
        {
          title: 'Phase 2: MVP Product Definition',
          tasks: [
            'Create User Flow Diagram and core mockups',
            'Write high-level PRD (Product Requirements Document)',
            'Define technical stack and deployment architecture',
          ],
        },
      ];
    } else {
      milestonesData = [
        {
          title: 'Phase 1: MVP Construction & Alpha Run',
          tasks: [
            'Configure PostgreSQL database & Keycloak Authentication',
            'Develop core workspace and landing page logic',
            'Onboard 5 alpha testers and track engagement metrics',
          ],
        },
        {
          title: 'Phase 2: Market Launch & Investor Pitch',
          tasks: [
            'Generate exportable Investor Pitch Deck',
            'Publish public product link (Beta launch)',
            'Complete due diligence check for seed fundraising',
          ],
        },
      ];
    }

    // Insert milestones and tasks
    for (let i = 0; i < milestonesData.length; i++) {
      const data = milestonesData[i];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i + 1) * 30); // 30, 60 days out

      const milestone = await this.prisma.milestone.create({
        data: {
          roadmapId: roadmap.id,
          title: data.title,
          dueDate,
          status: 'NOT_STARTED',
        },
      });

      for (const taskTitle of data.tasks) {
        await this.prisma.task.create({
          data: {
            milestoneId: milestone.id,
            title: taskTitle,
            status: 'TODO',
          },
        });
      }
    }

    return this.prisma.roadmap.findUnique({
      where: { id: roadmap.id },
      include: { milestones: { include: { tasks: true } } },
    });
  }

  async updateTaskStatus(taskId: string, status: any) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  async createTask(milestoneId: string, title: string, description?: string) {
    return this.prisma.task.create({
      data: {
        milestoneId,
        title,
        description,
        status: 'TODO',
      },
    });
  }
}
