import httpClient from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

const client = httpClient.getClient();

export const taskService = {
  getTasks: () => client.get(API_ENDPOINTS.TASKS),

  getTask: (id: string) => client.get(API_ENDPOINTS.TASK_BY_ID(id)),

  createTask: (data: { title: string; description?: string; completed?: boolean }) =>
    client.post(API_ENDPOINTS.TASKS, data),

  updateTask: (id: string, data: { title?: string; description?: string; completed?: boolean }) =>
    client.put(API_ENDPOINTS.TASK_BY_ID(id), data),

  deleteTask: (id: string) => client.delete(API_ENDPOINTS.TASK_BY_ID(id)),
};
