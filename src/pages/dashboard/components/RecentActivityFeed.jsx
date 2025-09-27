import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      task_completed: 'CheckCircle2',
      meeting_scheduled: 'Calendar',
      document_shared: 'FileText',
      team_joined: 'Users',
      project_updated: 'Briefcase',
      message_received: 'MessageSquare'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      task_completed: 'text-success bg-success/10',
      meeting_scheduled: 'text-primary bg-primary/10',
      document_shared: 'text-accent bg-accent/10',
      team_joined: 'text-warning bg-warning/10',
      project_updated: 'text-secondary bg-secondary/10',
      message_received: 'text-purple-600 bg-purple-100'
    };
    return colorMap?.[type] || 'text-muted-foreground bg-muted';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Latest updates and actions</p>
          </div>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity, index) => (
          <div
            key={activity?.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity?.title}
                </p>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {activity?.description}
              </p>
              
              {activity?.user && (
                <div className="flex items-center space-x-2 mt-2">
                  <Image
                    src={activity?.user?.avatar}
                    alt={activity?.user?.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-muted-foreground">
                    {activity?.user?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityFeed;

