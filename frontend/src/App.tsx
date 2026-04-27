import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { AuthPage } from './pages/AuthPage';
import { TasksPage } from './pages/TasksPage';

function App() {
  return (
    // Wrap the entire app in AuthProvider to provide auth context to all components
    // Using react-router-dom for navigation
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-8">
                  <TasksPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
