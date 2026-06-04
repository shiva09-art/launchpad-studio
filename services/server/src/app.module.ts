import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { IdeaModule } from './idea/idea.module';
import { StartupModule } from './startup/startup.module';
import { AiModule } from './ai/ai.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [IdeaModule, StartupModule, AiModule, MarketplaceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
