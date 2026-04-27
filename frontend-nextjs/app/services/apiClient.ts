import { authService } from './authService';
import { taskService } from './taskService';

// Re-export services for backwards compatibility
const apiClient = {
  // Auth endpoints
  register: authService.register,
  login: authService.login,
  refresh: authService.refresh,

  // Task endpoints
  getTasks: taskService.getTasks,
  getTask: taskService.getTask,
  createTask: taskService.createTask,
  updateTask: taskService.updateTask,
  deleteTask: taskService.deleteTask,
};

export default apiClient;
