import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ShortcutTiles = ({ shortcuts }) => {
  const getTileGradient = (color) => {
    const gradientMap = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-500',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600',
      teal: 'from-teal-500 to-teal-600'
    };
    return gradientMap?.[color] || 'from-primary to-accent';
  };

  return (
    <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-gray-600 rounded-lg flex items-center justify-center">
            <Icon name="Grid3X3" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Shortcuts</h2>
            <p className="text-sm text-muted-foreground">Frequently used features</p>
          </div>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          Customize
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {shortcuts?.map((shortcut, index) => (
          <Link
            key={shortcut?.id}
            to={shortcut?.path}
            className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-medium transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${getTileGradient(shortcut?.color)} rounded-xl flex items-center justify-center mb-3 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
              <Icon name={shortcut?.icon} size={20} className="text-white" />
            </div>
            
            <span className="text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors duration-300 mb-1">
              {shortcut?.title}
            </span>
            
            <span className="text-xs text-muted-foreground text-center line-clamp-2">
              {shortcut?.description}
            </span>

            {shortcut?.badge && (
              <div className="mt-2 px-2 py-1 bg-error/10 text-error text-xs font-medium rounded-full">
                {shortcut?.badge}
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            <Icon name="Plus" size={16} />
            <span>Add more shortcuts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutTiles;

