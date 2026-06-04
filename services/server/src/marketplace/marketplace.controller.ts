import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('api/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('experts')
  getExperts() {
    return this.marketplaceService.getExperts();
  }

  @Post('bookings')
  createBooking(
    @Body() body: { clientId: string; expertId: string; startTime: string; endTime: string; notes?: string },
  ) {
    return this.marketplaceService.createBooking(
      body.clientId,
      body.expertId,
      new Date(body.startTime),
      new Date(body.endTime),
      body.notes,
    );
  }

  @Get('bookings/user/:userId')
  getBookingsForUser(@Param('userId') userId: string) {
    return this.marketplaceService.getBookingsForUser(userId);
  }

  @Post('orders')
  createServiceOrder(
    @Body() body: { clientId: string; vendorId: string; title: string; price: number },
  ) {
    return this.marketplaceService.createServiceOrder(body.clientId, body.vendorId, body.title, body.price);
  }

  @Post('orders/:orderId/release')
  releaseEscrow(@Param('orderId') orderId: string) {
    return this.marketplaceService.releaseEscrow(orderId);
  }

  @Get('investors/match/:startupId')
  getInvestorMatches(@Param('startupId') startupId: string) {
    return this.marketplaceService.getInvestorMatches(startupId);
  }
}
