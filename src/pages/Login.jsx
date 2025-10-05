import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'nguyencuong120904@gmail.com',
    password: '••••••••••'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState([]);

  // Initialize floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.5 + 0.3,
          delay: Math.random() * 2000
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Holographic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        {/* Tech Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, rgba(120, 119, 198, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)
            `
          }}
        />

        {/* Holographic Shimmer Effect */}
        <div className="absolute inset-0">
          <div className="shimmer-gradient"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50 floating-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}ms`,
                opacity: particle.opacity
              }}
            />
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-purple-400 rounded-full blur-2xl opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 left-16 w-16 h-16 bg-cyan-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-20 h-20 bg-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>

        {/* Holographic Data Interface */}
        <div className="absolute top-8 left-8 right-8 h-64 opacity-60">
          <div className="h-full bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
            {/* Chart Lines */}
            <div className="absolute inset-4">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Line Chart */}
                <polyline
                  points="0,160 40,140 80,120 120,80 160,100 200,60 240,40 280,70 320,50 400,30"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.8)"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                {/* Data Points */}
                <circle cx="40" cy="140" r="3" fill="rgba(59, 130, 246, 1)" />
                <circle cx="80" cy="120" r="3" fill="rgba(59, 130, 246, 1)" />
                <circle cx="120" cy="80" r="3" fill="rgba(59, 130, 246, 1)" />
                <circle cx="160" cy="100" r="3" fill="rgba(59, 130, 246, 1)" />
                <circle cx="200" cy="60" r="3" fill="rgba(59, 130, 246, 1)" />
                {/* Bar Chart */}
                <rect x="50" y="150" width="15" height="30" fill="rgba(59, 130, 246, 0.6)" className="animate-pulse" />
                <rect x="75" y="130" width="15" height="50" fill="rgba(59, 130, 246, 0.6)" className="animate-pulse" />
                <rect x="100" y="100" width="15" height="80" fill="rgba(59, 130, 246, 0.6)" className="animate-pulse" />
                <rect x="125" y="120" width="15" height="60" fill="rgba(59, 130, 246, 0.6)" className="animate-pulse" />
              </svg>
            </div>
            {/* Data Numbers */}
            <div className="absolute top-2 left-2 text-blue-300 text-xs font-mono animate-pulse">485</div>
            <div className="absolute top-2 right-2 text-blue-300 text-xs font-mono animate-pulse">0DF.025</div>
            <div className="absolute bottom-2 left-2 text-blue-300 text-xs font-mono animate-pulse">GDP 2024</div>
          </div>
          {/* Network Globe */}
          <div className="absolute top-4 right-4 w-16 h-16">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute inset-2 bg-white rounded-full opacity-30"></div>
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line x1="8" y1="8" x2="24" y2="24" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
              <line x1="40" y1="8" x2="24" y2="24" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
              <line x1="8" y1="40" x2="24" y2="24" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
              <line x1="40" y1="40" x2="24" y2="24" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Digital Handshake - Improved */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50">
          <div className="w-80 h-80 relative">
            {/* Network Lines */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full">
                {/* Connecting lines */}
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" />
                <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" />
                {/* Data points */}
                <circle cx="20%" cy="20%" r="2" fill="rgba(59, 130, 246, 0.8)" />
                <circle cx="80%" cy="20%" r="2" fill="rgba(59, 130, 246, 0.8)" />
                <circle cx="20%" cy="80%" r="2" fill="rgba(59, 130, 246, 0.8)" />
                <circle cx="80%" cy="80%" r="2" fill="rgba(59, 130, 246, 0.8)" />
                <circle cx="50%" cy="50%" r="3" fill="rgba(255, 255, 255, 0.9)" className="animate-ping" />
              </svg>
            </div>
            
            {/* Digital Hands with Shirt Sleeves */}
            <div className="absolute top-8 left-8 w-20 h-32 relative">
              {/* Shirt sleeve */}
              <div className="absolute top-0 left-0 w-20 h-8 bg-gradient-to-r from-blue-700 to-blue-800 rounded-t-lg opacity-70"></div>
              {/* Digital hand */}
              <div className="absolute top-8 left-0 w-20 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-b-lg transform rotate-12 opacity-60">
                {/* Hand lines */}
                <div className="absolute top-4 left-2 w-16 h-1 bg-white opacity-40"></div>
                <div className="absolute top-12 left-2 w-16 h-1 bg-white opacity-40"></div>
                <div className="absolute top-20 left-2 w-16 h-1 bg-white opacity-40"></div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 w-20 h-32 relative">
              {/* Shirt sleeve */}
              <div className="absolute top-0 left-0 w-20 h-8 bg-gradient-to-r from-blue-700 to-blue-800 rounded-t-lg opacity-70"></div>
              {/* Digital hand */}
              <div className="absolute top-8 left-0 w-20 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-b-lg transform -rotate-12 opacity-60">
                {/* Hand lines */}
                <div className="absolute top-4 left-2 w-16 h-1 bg-white opacity-40"></div>
                <div className="absolute top-12 left-2 w-16 h-1 bg-white opacity-40"></div>
                <div className="absolute top-20 left-2 w-16 h-1 bg-white opacity-40"></div>
              </div>
            </div>

            {/* Glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Workplace Objects - Desktop scene */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-50">
          {/* Wooden desk surface */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-800/20 to-transparent"></div>
          
          {/* Left side objects */}
          <div className="absolute bottom-4 left-8">
            {/* Plant */}
            <div className="relative mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
              <div className="w-5 h-4 bg-amber-600 rounded-sm opacity-40 absolute -bottom-1 left-1"></div>
            </div>
            
            {/* Coffee cup */}
            <div className="relative left-8">
              <div className="w-4 h-5 bg-white rounded-sm opacity-60"></div>
              <div className="absolute top-1 left-1 w-2 h-3 bg-amber-800 rounded-sm opacity-40"></div>
              <div className="absolute -top-1 left-2 w-3 h-1 bg-white rounded-sm opacity-40"></div>
            </div>
            
            {/* Documents */}
            <div className="relative left-16 mb-2">
              <div className="w-6 h-4 bg-gray-200 rounded-sm opacity-40"></div>
              <div className="absolute top-1 left-1 w-4 h-1 bg-blue-600 opacity-30 rounded"></div>
              <div className="absolute top-2 left-1 w-4 h-0.5 bg-gray-600 opacity-20 rounded"></div>
              <div className="absolute top-2.5 left-1 w-3 h-0.5 bg-gray-600 opacity-20 rounded"></div>
            </div>
          </div>
          
          {/* Right side objects */}
          <div className="absolute bottom-4 right-8">
            {/* Tablet/Computer */}
            <div className="relative mb-2">
              <div className="w-8 h-6 bg-gray-300 rounded-sm opacity-40"></div>
              <div className="absolute inset-1 bg-blue-400 opacity-30 rounded-sm"></div>
              <div className="absolute top-2 left-2 w-4 h-1 bg-blue-600 opacity-40 rounded"></div>
              <div className="absolute top-3 left-2 w-3 h-0.5 bg-gray-600 opacity-20 rounded"></div>
            </div>
            
            {/* Mouse */}
            <div className="relative left-4">
              <div className="w-3 h-2 bg-white rounded-sm opacity-60"></div>
              <div className="absolute top-0.5 left-1 w-1 h-1 bg-gray-600 rounded-full opacity-30"></div>
            </div>
            
            {/* Tech blocks */}
            <div className="relative left-8">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded opacity-40"></div>
                <div className="w-1 h-1 bg-purple-400 rounded opacity-40"></div>
                <div className="w-1 h-1 bg-cyan-400 rounded opacity-40"></div>
              </div>
            </div>
          </div>
          
          {/* Twitter icon holographic */}
          <div className="absolute bottom-8 left-1/3 w-3 h-3 bg-blue-400 rounded-sm opacity-50 animate-pulse">
            <div className="absolute inset-1 bg-white rounded-full opacity-60"></div>
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
            </svg>
          </div>
        </div>

        {/* Floating tech elements - Enhanced */}
        <div className="absolute top-1/4 left-8 w-6 h-6 bg-blue-300 opacity-40 rotate-45 animate-bounce"></div>
        <div className="absolute top-3/4 right-16 w-8 h-8 bg-purple-300 opacity-30 rotate-45 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-cyan-300 opacity-50 rotate-45 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white opacity-30 animate-bounce" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-blue-400 opacity-25 animate-bounce" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Left side - Login form with slide animation */}
      <div className="absolute left-0 top-0 w-full lg:w-1/2 h-full flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96 animate-slide-in-left">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 slide-in-form">
            <div className="space-y-8">
              {/* Header with glow effect */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 glow-text">
                  Welcome Back
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Sign in to your account
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email Field with glow effect */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 glow-icon" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-blue-50/50 backdrop-blur-sm glow-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password Field with glow effect */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 glow-icon" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="w-full pl-10 pr-10 py-3 border border-blue-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-blue-50/50 backdrop-blur-sm glow-input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center glow-icon-hover"
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded glow-checkbox"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 underline glow-link">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {/* Sign in Button with glow effect */}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 glow-button"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - HR Management Branding */}
      <div className="hidden lg:flex lg:absolute lg:right-0 lg:top-0 lg:w-1/2 lg:h-full lg:flex-col lg:justify-center lg:items-center lg:text-center lg:px-8 z-10">
        {/* Main Icon with multi-layer glow */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse glow-intense">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative animate-spin-slow">
              <Clock className="w-10 h-10 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center glow-small">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
              </div>
            </div>
            {/* Multi-layer glow rings */}
            <div className="absolute inset-0 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-2 w-28 h-28 bg-purple-400 rounded-full opacity-60 animate-ping" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Title with glow effect */}
        <h3 className="text-5xl font-bold text-white mb-4 glow-text-intense animate-pulse">
          EMPLOYEE HUB
        </h3>
        <p className="text-xl text-blue-100 mb-8 max-w-md glow-text">
          Streamline your workplace management
        </p>

        {/* Additional floating particles around branding */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-8 w-6 h-6 bg-white opacity-30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-12 w-4 h-4 bg-blue-300 opacity-40 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 right-16 w-8 h-8 bg-purple-300 opacity-25 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-20 right-8 w-6 h-6 bg-cyan-300 opacity-35 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Mobile branding with responsive animations */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-blue-700 to-blue-800 py-12 animate-slide-in-bottom">
        <div className="flex flex-col items-center text-center px-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg glow-mobile">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2 glow-text">
            HR Management
          </h3>
          <p className="text-lg text-blue-100 glow-text">
            Streamline your workplace management
          </p>
        </div>
      </div>

      {/* Custom CSS styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer-gradient {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 3s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .floating-particle {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes slideInLeft {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInForm {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInBottom {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out;
        }
        
        .slide-in-form {
          animation: slideInForm 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-in-bottom {
          animation: slideInBottom 1s ease-out;
        }
        
        .animate-spin-slow {
          animation: spinSlow 10s linear infinite;
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .glow-text-intense {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(59, 130, 246, 0.6);
        }
        
        .glow-icon {
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.3));
        }
        
        .glow-icon-hover:hover {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
        }
        
        .glow-input {
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 10px rgba(59, 130, 246, 0.1);
        }
        
        .glow-input:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.3);
        }
        
        .glow-button {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
        
        .glow-button:hover {
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
        }
        
        .glow-checkbox:checked {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .glow-link:hover {
          text-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }
        
        .glow-intense {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(59, 130, 246, 0.4);
        }
        
        .glow-small {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
        }
        
        .glow-mobile {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Login;
