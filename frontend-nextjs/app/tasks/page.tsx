'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../services/apiClient';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskItem } from '../components/TaskItem';
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '../types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.getTasks();
      setTasks(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch tasks';
      setError(message);
      if (err.response?.status === 401) {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskPayload) => {
    try {
      setError('');
      const response = await apiClient.createTask(data);
      setTasks([response.data, ...tasks]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create task';
      throw new Error(message);
    }
  };

  const handleUpdateTask = async (id: string, data: UpdateTaskPayload) => {
    try {
      setError('');
      const response = await apiClient.updateTask(id, data);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update task';
      setError(message);
      throw new Error(message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError('');
      await apiClient.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete task';
      setError(message);
      throw new Error(message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="space-y-6">
      <CreateTaskForm onSubmit={handleCreateTask} isLoading={isLoading} />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
          <p className="text-gray-600 text-sm font-medium">Active</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.active}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium capitalize border-b-2 transition -mb-px ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {filter === 'all' ? 'No tasks yet. Create one to get started!' : `No ${filter} tasks.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
