import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AuthForm from './components/AuthForm';
import SocialAuthButton from './components/SocialAuthButton';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import WelcomeSection from './components/WelcomeSection';

const LoginPortal = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState({});

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSocialAuth = async (provider) => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Simulate social auth API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful social authentication
      localStorage.setItem('authToken', 'mock-social-jwt-token');
      localStorage.setItem('userEmail', `user@${provider}.com`);
      navigate('/dashboard');
    } catch (error) {
      console.error(`${provider} authentication failed:`, error);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      {/* Left Panel - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-success rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md mx-auto">
          <WelcomeSection />
        </div>
      </div>
      {/* Right Panel - Authentication Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
              <Icon name="Users" size={24} color="white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Employee Hub</h1>
            <p className="text-sm text-muted-foreground">Work made wonderful</p>
          </div>

          {/* Auth Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {isLogin ? 'Welcome back!' : 'Join Employee Hub'}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to access your personalized workspace' 
                : 'Create your account and start your journey'
              }
            </p>
          </div>

          {/* Social Authentication */}
          <div className="space-y-3">
            <SocialAuthButton
              provider="google"
              onClick={() => handleSocialAuth('google')}
              loading={socialLoading?.google}
              disabled={false}
            />
            <div className="grid grid-cols-2 gap-3">
              <SocialAuthButton
                provider="microsoft"
                onClick={() => handleSocialAuth('microsoft')}
                loading={socialLoading?.microsoft}
                disabled={false}
              />
              <SocialAuthButton
                provider="linkedin"
                onClick={() => handleSocialAuth('linkedin')}
                loading={socialLoading?.linkedin}
                disabled={false}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Auth Form */}
          <AuthForm
            isLogin={isLogin}
            onToggleMode={toggleAuthMode}
            onForgotPassword={handleForgotPassword}
          />

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Demo Credentials</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Admin:</strong> admin@employeehub.com / Admin@123</p>
              <p><strong>Manager:</strong> manager@employeehub.com / Manager@123</p>
              <p><strong>Employee:</strong> employee@employeehub.com / Employee@123</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
              </a>
            </p>
            <div className="flex items-center justify-center space-x-4 pt-2">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} className="text-green-600" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} className="text-blue-600" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={12} className="text-purple-600" />
                <span>Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={closeForgotPassword}
      />
    </div>
  );
};

export default LoginPortal;

