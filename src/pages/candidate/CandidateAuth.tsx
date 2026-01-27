import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Code, Mail, User, UserCheck } from 'lucide-react';

interface CandidateAuthProps {
  onAuthenticated: (userData: { name: string; email: string; isGuest: boolean }) => void;
  onSkip: () => void;
}

export const CandidateAuth: React.FC<CandidateAuthProps> = ({ 
  onAuthenticated, 
  onSkip 
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'guest'>('guest');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (authMode === 'guest') {
      if (!formData.name || !formData.email) {
        setError('Name and email are required for guest access');
        setIsLoading(false);
        return;
      }
      onAuthenticated({
        name: formData.name,
        email: formData.email,
        isGuest: true
      });
    } else {
      // Login logic would go here
      onAuthenticated({
        name: formData.name || 'John Doe',
        email: formData.email,
        isGuest: false
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                CodeAssess
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          {/* Auth mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
            <button
              onClick={() => setAuthMode('guest')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                authMode === 'guest'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Guest Access</span>
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                authMode === 'login'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {authMode === 'guest' ? 'Guest Access' : 'Login'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {authMode === 'guest' 
                    ? 'Provide your details to continue as a guest'
                    : 'Sign in to your account to continue'
                  }
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'guest' && (
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={User}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                )}
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                
                {authMode === 'login' && (
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {authMode === 'guest' ? 'Continue as Guest' : 'Sign In'}
                </Button>
              </form>

              {/* Skip option */}
              <div className="mt-6 text-center">
                <button
                  onClick={onSkip}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Skip authentication and continue anonymously
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};