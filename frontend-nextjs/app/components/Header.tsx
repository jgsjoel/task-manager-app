'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { ConfirmDialog } from './ConfirmDialog';

export const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Task Tracker</h1>
          {user && <p className="text-sm text-gray-600">Welcome, {user.name}!</p>}
        </div>
        {user && (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            <ConfirmDialog
              isOpen={isLogoutConfirmOpen}
              title="Logout"
              message="Are you sure you want to logout?"
              confirmText="Logout"
              cancelText="Cancel"
              isDangerous
              onConfirm={handleConfirmLogout}
              onCancel={() => setIsLogoutConfirmOpen(false)}
            />
          </>
        )}
      </div>
    </header>
  );
};
