import React from 'react';

const Header = ({ title, subtitle, actions = [] }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-white shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-white text-opacity-90 mt-1">{subtitle}</p>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
