import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventsCalendar = () => {
  const [selectedView, setSelectedView] = useState('upcoming');
  const [rsvpStatus, setRsvpStatus] = useState({});

  const viewOptions = [
    { id: 'upcoming', label: 'Sắp diễn ra', icon: 'Calendar' },
    { id: 'this-month', label: 'Tháng này', icon: 'CalendarDays' },
    { id: 'past', label: 'Đã diễn ra', icon: 'History' }
  ];

  const eventsData = [
    {
      id: 1,
      title: "Hội nghị Đổi mới Sáng tạo 2024",
      description: "Tham gia 3 ngày hội thảo, workshop và networking với các nhà lãnh đạo và chuyên gia hàng đầu trong ngành.",
      date: "2024-10-15",
      time: "09:00 - 17:00",
      location: "Hội trường chính",
      type: "Hội nghị",
      category: "upcoming",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      attendees: 245,
      maxAttendees: 300,
      organizer: "Alex Thompson",
      tags: ["Đổi mới", "Công nghệ", "Kết nối"],
      featured: true
    },
    {
      id: 2,
      title: "Thứ Tư Sức Khoẻ: Yoga & Thiền",
      description: "Bắt đầu ngày mới với sự tĩnh tâm và vận động. Mọi cấp độ đều tham gia được.",
      date: "2024-09-25",
      time: "08:00 - 09:00",
      location: "Phòng Sức Khoẻ, Tầng 3",
      type: "Sức khoẻ",
      category: "upcoming",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      attendees: 28,
      maxAttendees: 30,
      organizer: "BS. Emily Rodriguez",
      tags: ["Sức khoẻ", "Thiền", "Tập luyện"]
    },
    {
      id: 3,
      title: "Hoạt động nhóm: Thử thách Escape Room",
      description: "Rèn luyện kỹ năng giải quyết vấn đề và làm việc nhóm trong trò chơi Escape Room đầy thú vị.",
      date: "2024-09-28",
      time: "14:00 - 16:00",
      location: "Escape Room trung tâm",
      type: "Team Building",
      category: "upcoming",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      attendees: 42,
      maxAttendees: 48,
      organizer: "Jennifer Park",
      tags: ["Nhóm", "Vui chơi", "Thử thách"]
    },
    {
      id: 4,
      title: "Họp Toàn Công ty Quý IV",
      description: "Cập nhật kết quả Q3 và kế hoạch Q4 cùng ban lãnh đạo.",
      date: "2024-10-02",
      time: "10:00 - 12:00",
      location: "Trực tuyến & Hội trường lớn",
      type: "Cuộc họp",
      category: "this-month",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      attendees: 892,
      maxAttendees: 1000,
      organizer: "Sarah Johnson",
      tags: ["Công ty", "Cập nhật", "Kế hoạch"]
    },
    {
      id: 5,
      title: "Tech Talk: AI trong Nơi làm việc hiện đại",
      description: "Khám phá cách AI thay đổi cách chúng ta làm việc và hợp tác.",
      date: "2024-10-08",
      time: "15:00 - 16:30",
      location: "Tech Hub, Tầng 2",
      type: "Học tập",
      category: "this-month",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      attendees: 67,
      maxAttendees: 80,
      organizer: "David Kumar",
      tags: ["Công nghệ", "AI", "Học tập"]
    },
    {
      id: 6,
      title: "Picnic Mùa Hè Công ty",
      description: "Sự kiện ngoài trời thường niên với ẩm thực, trò chơi và hoạt động cho cả gia đình.",
      date: "2024-08-15",
      time: "11:00 - 18:00",
      location: "Công viên Trung tâm",
      type: "Xã hội",
      category: "past",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      attendees: 456,
      maxAttendees: 500,
      organizer: "Phòng Nhân sự",
      tags: ["Xã hội", "Gia đình", "Ăn mừng"]
    }
  ];

  const filteredEvents = eventsData?.filter(event => event?.category === selectedView);

  const handleRSVP = (eventId, status) => {
    setRsvpStatus(prev => ({
      ...prev,
      [eventId]: status
    }));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Hội nghị': 'from-primary to-accent',
      'Sức khoẻ': 'from-success to-accent',
      'Team Building': 'from-warning to-primary',
      'Cuộc họp': 'from-secondary to-primary',
      'Học tập': 'from-accent to-success',
      'Xã hội': 'from-warning to-success'
    };
    return colors?.[type] || 'from-primary to-accent';
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Calendar" size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Lịch sự kiện
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tham gia sự kiện tuyệt vời của chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kết nối, học hỏi và phát triển thông qua các sự kiện đa dạng của công ty
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
          {viewOptions?.map((option) => (
            <Button
              key={option?.id}
              variant={selectedView === option?.id ? "default" : "outline"}
              size="sm"
              iconName={option?.icon}
              iconPosition="left"
              onClick={() => setSelectedView(option?.id)}
              className="transition-all duration-300 hover:scale-105"
            >
              {option?.label}
            </Button>
          ))}
        </div>

        {/* Featured Event */}
        {selectedView === 'upcoming' && (
          <div className="mb-16 animate-fade-in">
            {eventsData?.filter(event => event?.featured && event?.category === 'upcoming')?.map((event) => (
              <div key={event?.id} className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-gray-200">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                        Sự kiện nổi bật
                      </div>
                      <div className={`px-3 py-1 bg-gradient-to-r ${getEventTypeColor(event?.type)} text-white text-xs font-medium rounded-full`}>
                        {event?.type}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                      {event?.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {event?.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <Icon name="Calendar" size={16} />
                        <span>{new Date(event.date)?.toLocaleDateString('vi-VN')} lúc {event?.time}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <Icon name="MapPin" size={16} />
                        <span>{event?.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <Icon name="Users" size={16} />
                        <span>{event?.attendees}/{event?.maxAttendees} người tham dự</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {event?.tags?.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-muted/50 text-muted-foreground text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="default" 
                        size="lg"
                        iconName="Calendar"
                        iconPosition="left"
                        onClick={() => handleRSVP(event?.id, 'attending')}
                        className={rsvpStatus?.[event?.id] === 'attending' ? 'bg-success hover:bg-success/90' : ''}
                      >
                        {rsvpStatus?.[event?.id] === 'attending' ? 'Đã tham gia' : 'Đăng ký'}
                      </Button>
                      
                      <Button variant="outline" size="lg" iconName="Share" iconPosition="left">
                        Chia sẻ
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden shadow-strong">
                      <Image
                        src={event?.image}
                        alt={event?.title}
                        className="w-full h-64 lg:h-80 object-cover"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {new Date(event.date)?.getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {new Date(event.date)?.toLocaleDateString('vi-VN', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents?.filter(event => !event?.featured)?.map((event, index) => (
            <div 
              key={event?.id}
              className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="rounded-t-xl overflow-hidden">
                  <Image
                    src={event?.image}
                    alt={event?.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {new Date(event.date)?.getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {new Date(event.date)?.toLocaleDateString('vi-VN', { month: 'short' })}
                    </div>
                  </div>
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${getEventTypeColor(event?.type)} text-white text-xs font-medium rounded-full`}>
                  {event?.type}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {event?.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {event?.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    <span>{event?.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={14} />
                    <span>{event?.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Users" size={14} />
                    <span>{event?.attendees}/{event?.maxAttendees} người tham dự</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {event?.tags?.slice(0, 2)?.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-muted-foreground">
                    Bởi {event?.organizer}
                  </div>
                  
                  {selectedView !== 'past' ? (
                    <Button 
                      variant={rsvpStatus?.[event?.id] === 'attending' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleRSVP(event?.id, 'attending')}
                      className={rsvpStatus?.[event?.id] === 'attending' ? 'bg-success hover:bg-success/90' : ''}
                    >
                      {rsvpStatus?.[event?.id] === 'attending' ? 'Đã tham gia' : 'Đăng ký'}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" iconName="Eye">
                      Xem
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Integration */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="bg-card rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
            <Icon name="Calendar" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Đồng bộ với lịch cá nhân
            </h3>
            <p className="text-muted-foreground mb-6">
              Đừng bỏ lỡ sự kiện nào bằng cách đồng bộ với ứng dụng lịch bạn dùng
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" iconName="Calendar">
                Google Calendar
              </Button>
              <Button variant="outline" size="sm" iconName="Calendar">
                Outlook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsCalendar;
