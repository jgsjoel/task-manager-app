'use client';

import { useState } from 'react';
import type { Task, UpdateTaskPayload } from '../types';
import { TaskModal } from './TaskModal';
import { ConfirmDialog } from './ConfirmDialog';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, data: UpdateTaskPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const TaskItem = ({ task, onUpdate, onDelete, isLoading }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleToggleComplete = async () => {
    try {
      await onUpdate(task.id, { completed: !task.completed });
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(task.id, { title, description });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmOpen(false);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength={3}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Add description..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading || !title.trim()}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description || '');
                setIsEditing(false);
              }}
              disabled={isLoading}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isLoading}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1">
              <h3
                onClick={() => setIsModalOpen(true)}
                className={`font-semibold text-lg cursor-pointer hover:underline ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:bg-gray-100 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <TaskModal task={task} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};
