import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ actions }) => {
  const getActionColor = (type) => {
    const colorMap = {
      primary: 'from-primary to-blue-500',
      success: 'from-success to-emerald-500',
      warning: 'from-warning to-orange-500',
      accent: 'from-accent to-green-500'
    };
    return colorMap?.[type] || 'from-secondary to-gray-500';
  };

  return (
    <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Frequently used shortcuts</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Icon name="Settings" size={16} className="mr-2" />
          Customize
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {actions?.map((action, index) => (
          <Link
            key={action?.id}
            to={action?.path}
            className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-medium animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${getActionColor(action?.color)} rounded-lg flex items-center justify-center mb-3 shadow-medium group-hover:shadow-strong transition-all duration-300`}>
              <Icon name={action?.icon} size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors duration-300">
              {action?.label}
            </span>
            <span className="text-xs text-muted-foreground text-center mt-1">
              {action?.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;

