import { Module } from '@nestjs/common';
import { StartupService } from './startup.service';
import { StartupController } from './startup.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [StartupController],
  providers: [StartupService, PrismaService],
  exports: [StartupService],
})
export class StartupModule {}
