import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkHistoryCard = ({ workHistory }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(itemId)) {
      newExpanded?.delete(itemId);
    } else {
      newExpanded?.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end?.getFullYear() - start?.getFullYear()) * 12 + (end?.getMonth() - start?.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-card rounded-xl shadow-medium border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Briefcase" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Work History</h3>
            <p className="text-sm text-muted-foreground">Your professional journey</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Add Position
        </Button>
      </div>
      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-8">
          {workHistory?.map((item, index) => (
            <div key={item?.id} className="relative flex items-start space-x-6">
              {/* Timeline Dot */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-medium ${
                item?.current ? 'bg-primary text-white' : 'bg-card border-2 border-gray-200'
              }`}>
                <Icon 
                  name={item?.current ? "MapPin" : "Building2"} 
                  size={18} 
                  className={item?.current ? "text-white" : "text-muted-foreground"}
                />
                {item?.current && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse-soft"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-muted/30 rounded-lg p-6 hover:shadow-medium transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {item?.position}
                      </h4>
                      <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <Icon name="Building2" size={16} />
                        <span className="font-medium">{item?.company}</span>
                        {item?.current && (
                          <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} />
                          <span>
                            {formatDate(item?.startDate)} - {item?.endDate ? formatDate(item?.endDate) : 'Present'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>{calculateDuration(item?.startDate, item?.endDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item?.id)}
                      className="mt-2 sm:mt-0"
                    >
                      <Icon 
                        name={expandedItems?.has(item?.id) ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                    </Button>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Icon name="MapPin" size={14} />
                    <span>{item?.location}</span>
                  </div>

                  {/* Description Preview */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {expandedItems?.has(item?.id) ? item?.description : `${item?.description?.substring(0, 150)}...`}
                  </p>

                  {/* Expanded Content */}
                  {expandedItems?.has(item?.id) && (
                    <div className="mt-6 animate-fade-in">
                      {/* Key Achievements */}
                      {item?.achievements && item?.achievements?.length > 0 && (
                        <div className="mb-6">
                          <h5 className="font-medium text-foreground mb-3 flex items-center">
                            <Icon name="Trophy" size={16} className="mr-2 text-accent" />
                            Key Achievements
                          </h5>
                          <ul className="space-y-2">
                            {item?.achievements?.map((achievement, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills Used */}
                      {item?.skills && item?.skills?.length > 0 && (
                        <div>
                          <h5 className="font-medium text-foreground mb-3 flex items-center">
                            <Icon name="Code" size={16} className="mr-2 text-primary" />
                            Skills & Technologies
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {item?.skills?.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryCard;

