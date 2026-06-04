import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async seedDemoExperts() {
    // Seed standard expert profiles if none exist
    const count = await this.prisma.user.count({ where: { role: 'EXPERT' } });
    if (count === 0) {
      const expert1 = await this.prisma.user.create({
        data: {
          email: 'elizabeth.holmes@seedvc.com',
          role: 'EXPERT',
          profile: {
            create: {
              firstName: 'Elizabeth',
              lastName: 'VC Advisor',
              bio: 'Venture Capitalist and 3x Fintech founder. Specializes in Seed rounds, valuation pitches, and Go-to-market strategy development.',
              skills: ['Seed Funding', 'Valuation', 'Pitch Decks', 'Fintech'],
              hourlyRate: 150.0,
              rating: 4.9,
              totalReviews: 24,
            },
          },
        },
      });

      const expert2 = await this.prisma.user.create({
        data: {
          email: 'steve.legal@launchpad.com',
          role: 'SERVICE_PROVIDER',
          profile: {
            create: {
              firstName: 'Steve',
              lastName: 'IP & Patent Attorney',
              bio: 'Tech lawyer with 12+ years experience filing USPTO utility patents, SaaS legal frameworks, and founding compliance structures.',
              skills: ['Legal', 'Patents', 'SaaS Compliance', 'Incorporation'],
              hourlyRate: 200.0,
              rating: 5.0,
              totalReviews: 48,
            },
          },
        },
      });
    }
  }

  async getExperts() {
    await this.seedDemoExperts();
    return this.prisma.user.findMany({
      where: {
        role: { in: ['EXPERT', 'SERVICE_PROVIDER'] },
      },
      include: { profile: true },
    });
  }

  async createBooking(clientId: string, expertId: string, startTime: Date, endTime: Date, notes?: string) {
    // Verify client exists
    let client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (!client) {
      client = await this.prisma.user.create({
        data: { id: clientId, email: `${clientId.substring(0, 8)}@founder.com`, role: 'FOUNDER' },
      });
    }

    // Verify expert exists
    const expert = await this.prisma.user.findUnique({ where: { id: expertId } });
    if (!expert) throw new NotFoundException('Expert not found');

    const jitsiRoomId = `launchpad-meet-${Math.random().toString(36).substring(2, 10)}`;

    return this.prisma.booking.create({
      data: {
        clientId,
        expertId,
        startTime,
        endTime,
        notes,
        jitsiRoomId,
        status: 'CONFIRMED',
      },
    });
  }

  async getBookingsForUser(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        OR: [{ clientId: userId }, { expertId: userId }],
      },
      include: {
        client: { include: { profile: true } },
        expert: { include: { profile: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async createServiceOrder(clientId: string, vendorId: string, title: string, price: number) {
    return this.prisma.serviceOrder.create({
      data: {
        clientId,
        vendorId,
        title,
        price,
        status: 'ESCROWED',
        escrowPaid: true,
      },
    });
  }

  async releaseEscrow(orderId: string) {
    const order = await this.prisma.serviceOrder.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.serviceOrder.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async getInvestorMatches(startupId: string) {
    // Dynamic matching algorithm: matches startups to demo investors based on sector/rating
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
      include: { analytics: true },
    });
    if (!startup) throw new NotFoundException('Startup not found');

    const score = startup.analytics?.startupScore || 50;

    const investors = [
      {
        name: 'SpaceBound Ventures',
        focus: ['Aerospatial', 'AI', 'SaaS', 'DeepTech'],
        minScore: 60,
        averageCheckSize: '$500K - $1.5M',
        matchPercent: score > 60 ? Math.round(score + 10) : 55,
      },
      {
        name: 'Apex Growth Partners',
        focus: ['Fintech', 'SaaS', 'B2B', 'Technology'],
        minScore: 40,
        averageCheckSize: '$250K - $750K',
        matchPercent: Math.round(score * 0.95),
      },
      {
        name: 'Anti-Gravity Seed Lab',
        focus: ['Developer Tools', 'AI', 'Software'],
        minScore: 70,
        averageCheckSize: '$1M - $3M',
        matchPercent: score > 70 ? Math.round(score + 8) : 40,
      },
    ];

    // Return filtered matches sorted by match percentage
    return investors
      .filter((inv) => score >= inv.minScore)
      .sort((a, b) => b.matchPercent - a.matchPercent);
  }
}
