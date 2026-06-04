import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';

@Controller('api/ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto) {
    return this.ideaService.create(createIdeaDto);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.ideaService.getOne(id);
  }

  @Get('startup/:startupId')
  getByStartup(@Param('startupId') startupId: string) {
    return this.ideaService.getByStartup(startupId);
  }

  @Post(':id/validate')
  validate(@Param('id') id: string) {
    return this.ideaService.validateIdea(id);
  }
}
