import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { JwtGuard } from '../common/guards/jwt.guard.js';
import { GetUser } from '../common/decorators/get-user.decorator.js';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(@GetUser() user: any) {
    return this.taskService.getTasks(user.sub);
  }

  @Post()
  @HttpCode(201)
  async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: any) {
    return this.taskService.createTask(user.sub, createTaskDto);
  }

  @Get(':id')
  async getTaskById(@Param('id') taskId: string, @GetUser() user: any) {
    return this.taskService.getTaskById(taskId, user.sub);
  }

  @Put(':id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: any,
  ) {
    return this.taskService.updateTask(taskId, user.sub, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteTask(@Param('id') taskId: string, @GetUser() user: any) {
    return this.taskService.deleteTask(taskId, user.sub);
  }
}
