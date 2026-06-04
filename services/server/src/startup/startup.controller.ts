import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { StartupService } from './startup.service';

@Controller('api/startups')
export class StartupController {
  constructor(private readonly startupService: StartupService) {}

  @Post()
  create(@Body() body: { name: string; industry: string; stage?: string }) {
    return this.startupService.create(body.name, body.industry, body.stage || 'Idea');
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.startupService.getOne(id);
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: string },
  ) {
    return this.startupService.addMember(id, body.userId, body.role || 'Member');
  }

  @Post(':id/roadmaps/regenerate')
  regenerateRoadmap(@Param('id') id: string) {
    return this.startupService.generateRoadmap(id);
  }

  @Patch('tasks/:taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() body: { status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' },
  ) {
    return this.startupService.updateTaskStatus(taskId, body.status);
  }

  @Post('milestones/:milestoneId/tasks')
  createTask(
    @Param('milestoneId') milestoneId: string,
    @Body() body: { title: string; description?: string },
  ) {
    return this.startupService.createTask(milestoneId, body.title, body.description);
  }
}
