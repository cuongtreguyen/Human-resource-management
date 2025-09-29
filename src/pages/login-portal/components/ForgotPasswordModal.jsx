import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email'); // email, code, reset, success
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailSubmit = async (e) => {
    e?.preventDefault();
    if (!formData?.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('code');
  };

  const handleCodeSubmit = async (e) => {
    e?.preventDefault();
    if (!formData?.code) {
      setErrors({ code: 'Verification code is required' });
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setStep('reset');
  };

  const handlePasswordReset = async (e) => {
    e?.preventDefault();
    if (!formData?.newPassword || !formData?.confirmPassword) {
      setErrors({ newPassword: 'Both password fields are required' });
      return;
    }
    if (formData?.newPassword !== formData?.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('email');
    setFormData({ email: '', code: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your email address and we'll send you a verification code
              </p>
            </div>
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
            <Button type="submit" fullWidth loading={loading}>
              Send Verification Code
            </Button>
          </form>
        );
        
      case 'code':
        return (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Enter Verification Code</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We've sent a 6-digit code to {formData?.email}
              </p>
            </div>
            <Input
              label="Verification Code"
              type="text"
              name="code"
              value={formData?.code}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              error={errors?.code}
              required
            />
            <Button type="submit" fullWidth loading={loading}>
              Verify Code
            </Button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to email entry
            </button>
          </form>
        );
        
      case 'reset':
        return (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Create New Password</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Choose a strong password for your account
              </p>
            </div>
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData?.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              error={errors?.newPassword}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              error={errors?.confirmPassword}
              required
            />
            <Button type="submit" fullWidth loading={loading}>
              Reset Password
            </Button>
          </form>
        );
        
      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Password Reset Successful</h3>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button onClick={handleClose} fullWidth>
              Back to Sign In
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-xl shadow-strong max-w-md w-full mx-4 animate-slide-in-right">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-foreground">Password Recovery</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

