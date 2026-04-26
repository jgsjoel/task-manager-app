import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Task } from 'generated/prisma/browser.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          completed: createTaskDto.completed ?? false,
          userId,
        },
      });
      this.logger.log(`Task created: ${task.id} for user ${userId}`);
      return task;
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`);
      throw new BadRequestException('Failed to create task');
    }
  }

  async getTasks(userId: string): Promise<Task[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return tasks;
    } catch (error) {
      this.logger.error(`Error fetching tasks: ${error.message}`);
      throw new BadRequestException('Failed to fetch tasks');
    }
  }

  async getTaskById(taskId: string, userId: string): Promise<Task> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      // Ensure the task belongs to the user
      if (task.userId !== userId) {
        throw new NotFoundException('Task not found');
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching task: ${error.message}`);
      throw new BadRequestException('Failed to fetch task');
    }
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    try {
      // Verify task belongs to user
      const task = await this.getTaskById(taskId, userId);

      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: {
          title: updateTaskDto.title ?? task.title,
          completed: updateTaskDto.completed ?? task.completed,
        },
      });

      this.logger.log(`Task updated: ${taskId} for user ${userId}`);
      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating task: ${error.message}`);
      throw new BadRequestException('Failed to update task');
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<{ message: string }> {
    try {
      // Verify task belongs to user
      await this.getTaskById(taskId, userId);

      await this.prisma.task.delete({
        where: { id: taskId },
      });

      this.logger.log(`Task deleted: ${taskId} for user ${userId}`);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting task: ${error.message}`);
      throw new BadRequestException('Failed to delete task');
    }
  }
}


