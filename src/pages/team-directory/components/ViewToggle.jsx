import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewToggle = ({ viewMode, onViewModeChange }) => {
  const views = [
    { id: 'grid', label: 'Lưới', icon: 'Grid3X3' },
    { id: 'list', label: 'Danh sách', icon: 'List' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
      {views?.map((view) => (
        <Button
          key={view?.id}
          variant={viewMode === view?.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange(view?.id)}
          iconName={view?.icon}
          iconPosition="left"
          className={`transition-all duration-200 ${
            viewMode === view?.id 
              ? 'shadow-soft' 
              : 'hover:bg-background/50'
          }`}
        >
          {view?.label}
        </Button>
      ))}
    </div>
  );
};

export default ViewToggle;

