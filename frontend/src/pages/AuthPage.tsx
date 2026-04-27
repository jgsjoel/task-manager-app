import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { AlertDialog } from '../components/AlertDialog';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/tasks');
  };

  const handleRegisterSuccess = () => {
    setIsSuccessAlertOpen(true);
  };

  const handleAlertClose = () => {
    setIsSuccessAlertOpen(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Task Tracker</h1>
          <p className="text-center text-gray-600 mb-8">Manage your tasks efficiently</p>

          {/* Forms */}
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

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6">
          © 2026 Task Tracker. All rights reserved.
        </p>
      </div>

      <AlertDialog
        isOpen={isSuccessAlertOpen}
        title="Success"
        message="Account created! Please login."
        buttonText="OK"
        onClose={handleAlertClose}
      />
    </div>
  );
};
