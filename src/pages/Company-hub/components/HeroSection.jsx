import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const heroData = {
    title: "Chào mừng đến với Employee Hub",
    subtitle: "Nơi năng suất gặp gỡ cá tính",
    description: "Không gian làm việc số thực sự dành cho bạn. Kết nối với văn hoá công ty, tôn vinh thành tựu và cùng nhau tạo nên điều tuyệt vời.",
    backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    stats: [
      { label: "Nhân viên đang hoạt động", value: "2,847", icon: "Users" },
      { label: "Sự kiện công ty", value: "156", icon: "Calendar" },
      { label: "Thành tựu", value: "892", icon: "Award" },
      { label: "Năm phát triển", value: "15", icon: "Building2" }
    ]
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Nội dung */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse-soft"></div>
                <span className="text-sm font-medium text-accent uppercase tracking-wider">
                  Trung tâm văn hoá công ty
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                {heroData?.title}
              </h1>
              
              <p className="text-xl text-primary font-medium">
                {heroData?.subtitle}
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {heroData?.description}
              </p>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="default" 
                size="lg"
                iconName="Calendar"
                iconPosition="left"
                className="animate-bounce-gentle"
              >
                Xem sự kiện
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                iconName="Users"
                iconPosition="left"
              >
                Gặp gỡ đội ngũ
              </Button>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {heroData?.stats?.map((stat, index) => (
                <div 
                  key={stat?.label}
                  className="text-center space-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                    <Icon name={stat?.icon} size={20} color="white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
                  <div className="text-sm text-muted-foreground">{stat?.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hình ảnh Hero */}
          <div className="relative animate-slide-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <Image
                src={heroData?.backgroundImage}
                alt="Môi trường văn phòng hiện đại với đội ngũ đa dạng"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Phần tử nổi */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center shadow-strong animate-pulse-soft">
              <Icon name="Sparkles" size={24} color="white" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-warning to-primary rounded-full flex items-center justify-center shadow-strong animate-bounce-gentle">
              <Icon name="Heart" size={16} color="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
