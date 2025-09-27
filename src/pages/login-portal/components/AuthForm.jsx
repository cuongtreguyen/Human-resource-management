import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const AuthForm = ({ isLogin, onToggleMode, onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for demonstration
  const mockCredentials = {
    admin: { email: "admin@employeehub.com", password: "Admin@123" },
    manager: { email: "manager@employeehub.com", password: "Manager@123" },
    employee: { email: "employee@employeehub.com", password: "Employee@123" }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLogin) {
      if (!formData?.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData?.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Check mock credentials
        const isValidCredential = Object.values(mockCredentials)?.some(
          cred => cred?.email === formData?.email && cred?.password === formData?.password
        );
        
        if (isValidCredential) {
          // Store auth token (mock)
          localStorage.setItem('authToken', 'mock-jwt-token');
          localStorage.setItem('userEmail', formData?.email);
          navigate('/dashboard');
        } else {
          setErrors({ 
            general: 'Invalid credentials. Please use: admin@employeehub.com / Admin@123' 
          });
        }
      } else {
        // Registration success
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-600" />
            <span className="text-sm text-red-700">{errors?.general}</span>
          </div>
        </div>
      )}
      {!isLogin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData?.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            error={errors?.firstName}
            required
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData?.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            error={errors?.lastName}
            required
          />
        </div>
      )}
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData?.email}
        onChange={handleInputChange}
        placeholder="Enter your work email"
        error={errors?.email}
        required
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData?.password}
          onChange={handleInputChange}
          placeholder={isLogin ? "Enter your password" : "Create a strong password"}
          error={errors?.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
        </button>
        
        {!isLogin && formData?.password && (
          <PasswordStrengthIndicator password={formData?.password} />
        )}
      </div>
      {!isLogin && (
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          error={errors?.confirmPassword}
          required
        />
      )}
      {isLogin && (
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>
      )}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={loading}
        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 shadow-medium hover:shadow-strong transition-all duration-300"
      >
        {isLogin ? 'Sign In' : 'Create Account'}
      </Button>
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </span>
        <button
          type="button"
          onClick={onToggleMode}
          className="ml-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;

