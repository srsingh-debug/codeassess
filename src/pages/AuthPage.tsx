import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Code, Mail, Lock, User } from 'lucide-react';
import { AxiosError } from 'axios';
import { getDashboardRoute } from '../utils/roleRouting';

export const AuthPage: React.FC = () => {
  console.log("AuthPage");
  const navigate = useNavigate();
  const { login, register, isLoading, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  console.log("user", user);

  // Navigate based on user role after successful login
  useEffect(() => {
    if (user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }
      
      const result = await register(formData.email, formData.password, formData.name);
      
      if (!result.success) {
        setError(result.error || 'Registration failed. Please try again.');
      }
      // If successful, the useEffect will handle navigation based on user role
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      console.log("success", success);
      return;
      
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      // Extract error message from response
      const error = err as AxiosError<{
        error?: {
          message?: string;
          details?: Array<{ message: string }>;
        };
      }>;
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.error) {
        if (error.response.data.error.details) {
          // Validation errors
          const details = error.response.data.error.details;
          errorMessage = details.map((d) => d.message).join(', ');
        } else if (error.response.data.error.message) {
          errorMessage = error.response.data.error.message;
        }
      }
      setError(errorMessage);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl inline-block mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CodeAssess</h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <Card padding="lg">

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                icon={User}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            )}
            
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            
            {isSignUp && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle Sign Up/Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ email: '', password: '', confirmPassword: '', name: '' });
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Admin:</strong> admin@example.com / Admin@123</div>
              <div><strong>Candidate:</strong> candidate@example.com / Candidate@123</div>
              <div><strong>Recruiter:</strong> recruiter@example.com / Recruiter@123</div>
              <div><strong>HR:</strong> hr@example.com / Hr@123</div>
              <div><strong>Interviewer:</strong> interviewer@example.com / Interviewer@123</div>
              <div><strong>Hiring Manager:</strong> hiring-manager@example.com / HiringManager@123</div>
            </div>
          </div>
        </Card>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};