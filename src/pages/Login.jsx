import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'nguyencuong120904@gmail.com',
    password: '••••••••••'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple login logic - in real app you'd validate credentials
    if (formData.email && formData.password) {
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Sign in to your account
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-blue-50"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-10 py-3 border border-blue-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-blue-50"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Sign in Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="flex flex-col h-full justify-center items-center text-center px-8">
          {/* Main Icon */}
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center relative">
              <Clock className="w-10 h-10 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Title and tagline */}
          <h3 className="text-5xl font-bold text-white mb-4">
            HR Management
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-md">
            Streamline your workplace management
          </p>

          {/* Decorative elements */}
          <div className="absolute top-1/4 right-8 w-16 h-16 bg-white bg-opacity-20 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 left-8 w-12 h-12 bg-white bg-opacity-15 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-12 w-8 h-8 bg-white bg-opacity-25 rounded-full blur-md"></div>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 right-8 opacity-20">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile branding */}
      <div className="lg:hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-12">
        <div className="flex flex-col items-center text-center px-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">
            HR Management
          </h3>
          <p className="text-lg text-blue-100">
            Streamline your workplace management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
