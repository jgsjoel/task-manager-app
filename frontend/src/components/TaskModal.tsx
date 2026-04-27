import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import type { Task } from '../types';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal = ({ task, isOpen, onClose }: TaskModalProps) => {
  const [fullTask, setFullTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && task.id) {
      console.log('Modal opened, fetching task:', task.id);
      fetchTaskDetails();
    }
  }, [isOpen, task.id]);

  const fetchTaskDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching task from backend:', task.id);
      const response = await apiClient.getTask(task.id);
      console.log('Task loaded from backend:', response.data);
      setFullTask(response.data);
    } catch (err: any) {
      console.error('Error fetching task:', err);
      const message = err.response?.data?.message || 'Failed to load task details';
      setError(message);
      setFullTask(task);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayTask = fullTask || task;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 p-6 max-w-md w-full mx-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{displayTask.title}</h2>
            
            {displayTask.description ? (
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{displayTask.description}</p>
            ) : (
              <p className="text-gray-500 italic mb-6">No description provided</p>
            )}

            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <p><span className="font-semibold">Status:</span> {displayTask.completed ? 'Completed' : 'Active'}</p>
              <p><span className="font-semibold">Created:</span> {new Date(displayTask.createdAt).toLocaleDateString()}</p>
              {displayTask.updatedAt !== displayTask.createdAt && (
                <p><span className="font-semibold">Updated:</span> {new Date(displayTask.updatedAt).toLocaleDateString()}</p>
              )}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};
