import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post(':startupId/pitchdeck')
  generatePitchDeck(@Param('startupId') startupId: string) {
    return this.aiService.generatePitchDeck(startupId);
  }

  @Get(':startupId/predict')
  predictSuccess(@Param('startupId') startupId: string) {
    return this.aiService.predictSuccess(startupId);
  }

  @Post(':startupId/simulate')
  runSimulation(
    @Param('startupId') startupId: string,
    @Body() body: { type: 'revenue' | 'burn' | 'growth'; cash?: number; burn?: number; growthRate?: number; steps?: number },
  ) {
    return this.aiService.runSimulation(startupId, body.type, body);
  }
}
