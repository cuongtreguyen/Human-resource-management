import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsGrid = ({ stats }) => {
  const getStatIcon = (type) => {
    const iconMap = {
      tasks: 'CheckCircle2',
      meetings: 'Calendar',
      messages: 'MessageSquare',
      projects: 'Briefcase'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getStatColor = (type) => {
    const colorMap = {
      tasks: 'from-success to-emerald-400',
      meetings: 'from-primary to-blue-400',
      messages: 'from-accent to-green-400',
      projects: 'from-warning to-yellow-400'
    };
    return colorMap?.[type] || 'from-secondary to-gray-400';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat, index) => (
        <div
          key={stat?.id}
          className="bg-card rounded-lg p-6 border border-gray-200 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${getStatColor(stat?.type)} rounded-lg flex items-center justify-center shadow-medium`}>
              <Icon name={getStatIcon(stat?.type)} size={20} className="text-white" />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              stat?.trend === 'up' ?'bg-success/10 text-success' 
                : stat?.trend === 'down' ?'bg-error/10 text-error' :'bg-muted text-muted-foreground'
            }`}>
              {stat?.trend === 'up' && <Icon name="TrendingUp" size={12} className="inline mr-1" />}
              {stat?.trend === 'down' && <Icon name="TrendingDown" size={12} className="inline mr-1" />}
              {stat?.change}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{stat?.value}</h3>
            <p className="text-sm text-muted-foreground">{stat?.label}</p>
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;

