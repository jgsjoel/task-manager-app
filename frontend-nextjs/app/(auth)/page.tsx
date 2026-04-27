'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { AlertDialog } from '../components/AlertDialog';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/tasks');
  };

  const handleRegisterSuccess = () => {
    setIsSuccessAlertOpen(true);
  };

  const handleAlertClose = () => {
    setIsSuccessAlertOpen(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Task Tracker</h1>
          <p className="text-center text-gray-600 mb-8">Manage your tasks efficiently</p>

          {isLogin ? (
            <>
              <LoginForm onSuccess={handleSuccess} />
              <p className="text-center text-gray-600 mt-6 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={handleRegisterSuccess} />
              <p className="text-center text-gray-600 mt-6 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <AlertDialog
        isOpen={isSuccessAlertOpen}
        title="Account Created"
        message="Your account has been created successfully! Please login with your credentials."
        buttonText="OK"
        onClose={handleAlertClose}
      />
    </div>
  );
}
