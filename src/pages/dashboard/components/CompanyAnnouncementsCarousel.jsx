import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CompanyAnnouncementsCarousel = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || announcements?.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === announcements?.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, announcements?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? announcements?.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === announcements?.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'bg-error/10 text-error border-error/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-success/10 text-success border-success/20'
    };
    return colorMap?.[priority] || 'bg-muted text-muted-foreground border-gray-200';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!announcements || announcements?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
            <Icon name="Megaphone" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Company Announcements</h2>
            <p className="text-sm text-muted-foreground">Latest updates from leadership</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Icon name="Megaphone" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No announcements at this time</p>
        </div>
      </div>
    );
  }

  const currentAnnouncement = announcements?.[currentIndex];

  return (
    <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
            <Icon name="Megaphone" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Company Announcements</h2>
            <p className="text-sm text-muted-foreground">Latest updates from leadership</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={announcements?.length <= 1}
            className="w-8 h-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={announcements?.length <= 1}
            className="w-8 h-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {announcements?.map((announcement, index) => (
            <div key={announcement?.id} className="w-full flex-shrink-0">
              <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {announcement?.author?.avatar && (
                      <Image
                        src={announcement?.author?.avatar}
                        alt={announcement?.author?.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{announcement?.author?.name}</h3>
                      <p className="text-sm text-muted-foreground">{announcement?.author?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement?.priority)}`}>
                      {announcement?.priority?.toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(announcement?.date)}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-foreground mb-3">
                  {announcement?.title}
                </h4>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {announcement?.content}
                </p>

                {announcement?.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={announcement?.image}
                      alt={announcement?.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={14} />
                      <span>{announcement?.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={14} />
                      <span>{announcement?.comments} comments</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Read More
                    <Icon name="ArrowRight" size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {announcements?.length > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          {announcements?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-6' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyAnnouncementsCarousel;

