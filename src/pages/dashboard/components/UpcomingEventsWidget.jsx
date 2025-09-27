import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingEventsWidget = ({ events }) => {
  const formatEventDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type) => {
    const colorMap = {
      meeting: 'bg-primary/10 text-primary border-primary/20',
      deadline: 'bg-error/10 text-error border-error/20',
      event: 'bg-accent/10 text-accent border-accent/20',
      reminder: 'bg-warning/10 text-warning border-warning/20'
    };
    return colorMap?.[type] || 'bg-muted text-muted-foreground border-gray-200';
  };

  const getEventIcon = (type) => {
    const iconMap = {
      meeting: 'Video',
      deadline: 'Clock',
      event: 'Calendar',
      reminder: 'Bell'
    };
    return iconMap?.[type] || 'Calendar';
  };

  return (
    <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Add Event
        </Button>
      </div>
      <div className="space-y-3">
        {events?.length > 0 ? (
          events?.map((event, index) => (
            <div
              key={event?.id}
              className="flex items-center space-x-4 p-3 rounded-lg border hover:shadow-soft transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getEventTypeColor(event?.type)}`}>
                <Icon name={getEventIcon(event?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {event?.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatEventDate(event?.date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {event?.description}
                </p>
                {event?.location && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {event?.location}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {event?.attendees && event?.attendees?.length > 0 && (
                  <div className="flex -space-x-1">
                    {event?.attendees?.slice(0, 3)?.map((attendee, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 bg-gradient-to-br from-secondary to-muted rounded-full border-2 border-card flex items-center justify-center"
                        title={attendee?.name}
                      >
                        <span className="text-xs text-white font-medium">
                          {attendee?.name?.charAt(0)}
                        </span>
                      </div>
                    ))}
                    {event?.attendees?.length > 3 && (
                      <div className="w-6 h-6 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          +{event?.attendees?.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">No upcoming events</p>
            <p className="text-xs text-muted-foreground">Your calendar is clear for the next 7 days</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsWidget;

