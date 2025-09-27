import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    return new Date()?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white shadow-strong">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-white/80 text-sm mb-4">
            {getCurrentDate()}
          </p>
          <p className="text-white/90 text-base">
            Ready to make today productive? Here's your personalized dashboard.
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Icon name="Zap" size={32} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;

