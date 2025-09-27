import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      numbers: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    score = Object.values(checks)?.filter(Boolean)?.length;
    
    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-200' },
      2: { label: 'Weak', color: 'text-orange-600', bgColor: 'bg-orange-200' },
      3: { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-200' },
      4: { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-200' },
      5: { label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-200' }
    };
    
    return { score, ...strengthLevels?.[score], checks };
  };

  const strength = calculateStrength(password);
  
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              level <= strength?.score ? strength?.bgColor : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {/* Strength Label */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${strength?.color}`}>
          {strength?.label}
        </span>
        {strength?.score === 5 && (
          <Icon name="Shield" size={14} className="text-green-600" />
        )}
      </div>
      {/* Requirements Checklist */}
      <div className="text-xs space-y-1">
        <div className={`flex items-center space-x-2 ${strength?.checks?.length ? 'text-green-600' : 'text-gray-400'}`}>
          <Icon name={strength?.checks?.length ? "Check" : "X"} size={12} />
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center space-x-2 ${strength?.checks?.uppercase && strength?.checks?.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          <Icon name={strength?.checks?.uppercase && strength?.checks?.lowercase ? "Check" : "X"} size={12} />
          <span>Upper & lowercase letters</span>
        </div>
        <div className={`flex items-center space-x-2 ${strength?.checks?.numbers ? 'text-green-600' : 'text-gray-400'}`}>
          <Icon name={strength?.checks?.numbers ? "Check" : "X"} size={12} />
          <span>At least one number</span>
        </div>
        <div className={`flex items-center space-x-2 ${strength?.checks?.special ? 'text-green-600' : 'text-gray-400'}`}>
          <Icon name={strength?.checks?.special ? "Check" : "X"} size={12} />
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

