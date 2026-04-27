'use client';

import { useState } from 'react';

interface CreateTaskFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  isLoading: boolean;
}

export const CreateTaskForm = ({ onSubmit, isLoading }: CreateTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            disabled={isLoading}
            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            minLength={3}
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)..."
            disabled={isLoading}
            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
            rows={2}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};
