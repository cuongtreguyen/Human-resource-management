import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const NewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tất cả tin tức', icon: 'Newspaper' },
    { id: 'company', label: 'Cập nhật công ty', icon: 'Building2' },
    { id: 'achievements', label: 'Thành tựu', icon: 'Award' },
    { id: 'culture', label: 'Văn hoá', icon: 'Heart' },
    { id: 'events', label: 'Sự kiện', icon: 'Calendar' }
  ];

  const newsData = [
    {
      id: 1,
      category: 'company',
      title: "Employee Hub giành giải thưởng 'Công nghệ Nơi làm việc Tốt nhất'",
      excerpt: "Cách tiếp cận sáng tạo trong việc gắn kết nhân viên của chúng tôi đã được vinh danh tại Industry Excellence Awards 2024.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Sarah Johnson",
      authorRole: "Tổng giám đốc (CEO)",
      publishDate: "2024-09-20",
      readTime: "3 phút đọc",
      tags: ["Giải thưởng", "Ghi nhận", "Đổi mới"],
      featured: true
    },
    {
      id: 2,
      category: 'achievements',
      title: "Điểm nhấn hiệu suất Q3: Quý kỷ lục",
      excerpt: "Đội ngũ của chúng tôi đạt mức tăng trưởng chưa từng có với 150% năng suất và 95% sự hài lòng của nhân viên.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Michael Chen",
      authorRole: "Phó giám đốc vận hành",
      publishDate: "2024-09-18",
      readTime: "5 phút đọc",
      tags: ["Hiệu suất", "Tăng trưởng", "Thành công"]
    },
    {
      id: 3,
      category: 'culture',
      title: "Giới thiệu Wellness Wednesday: Sáng kiến sức khỏe tinh thần",
      excerpt: "Chương trình mới tập trung vào sức khỏe nhân viên với các buổi thiền, lớp thể dục và tài nguyên hỗ trợ tinh thần.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "TS. Emily Rodriguez",
      authorRole: "Trưởng phòng Nhân sự",
      publishDate: "2024-09-15",
      readTime: "4 phút đọc",
      tags: ["Sức khoẻ", "Tinh thần", "Sáng kiến"]
    },
    {
      id: 4,
      category: 'events',
      title: "Hội nghị Đổi mới thường niên 2024: Lưu ngày",
      excerpt: "Tham gia 3 ngày hội thảo, workshop và networking. Đăng ký mở vào ngày 1/10.",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Alex Thompson",
      authorRole: "Điều phối sự kiện",
      publishDate: "2024-09-12",
      readTime: "2 phút đọc",
      tags: ["Sự kiện", "Đổi mới", "Hội nghị"]
    },
    {
      id: 5,
      category: 'company',
      title: "Mở văn phòng mới tại Austin: Mở rộng tầm ảnh hưởng",
      excerpt: "Cơ sở mới nhất của chúng tôi với thiết kế hiện đại và không gian hợp tác cho phong cách làm việc mới.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Jennifer Park",
      authorRole: "Quản lý cơ sở vật chất",
      publishDate: "2024-09-10",
      readTime: "3 phút đọc",
      tags: ["Mở rộng", "Văn phòng", "Tăng trưởng"]
    },
    {
      id: 6,
      category: 'achievements',
      title: "Điểm sáng nhân viên: Đột phá AI của nhóm Đổi mới",
      excerpt: "Nhóm nghiên cứu AI phát triển giải pháp cải thiện hiệu suất công việc lên 40%.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "David Kumar",
      authorRole: "Giám đốc công nghệ (CTO)",
      publishDate: "2024-09-08",
      readTime: "6 phút đọc",
      tags: ["Đổi mới", "AI", "Công nghệ"]
    }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? newsData 
    : newsData?.filter(item => item?.category === selectedCategory);

  const featuredNews = newsData?.find(item => item?.featured);
  const regularNews = filteredNews?.filter(item => !item?.featured);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Newspaper" size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Tin tức mới nhất
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Cập nhật tin tức công ty
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những cập nhật, thành tựu và câu chuyện định hình văn hoá công ty
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? "default" : "outline"}
              size="sm"
              iconName={category?.icon}
              iconPosition="left"
              onClick={() => setSelectedCategory(category?.id)}
              className="transition-all duration-300 hover:scale-105"
            >
              {category?.label}
            </Button>
          ))}
        </div>

        {/* Featured News */}
        {featuredNews && selectedCategory === 'all' && (
          <div className="mb-16 animate-fade-in">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-gray-200">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                      Nổi bật
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(featuredNews.publishDate)?.toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                    {featuredNews?.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {featuredNews?.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} color="white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{featuredNews?.author}</p>
                        <p className="text-sm text-muted-foreground">{featuredNews?.authorRole}</p>
                      </div>
                    </div>
                    
                    <Button variant="default" iconName="ArrowRight" iconPosition="right">
                      Đọc thêm
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="rounded-xl overflow-hidden shadow-strong">
                    <Image
                      src={featuredNews?.image}
                      alt={featuredNews?.title}
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-foreground">{featuredNews?.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularNews?.map((article, index) => (
            <article 
              key={article?.id}
              className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="rounded-t-xl overflow-hidden">
                  <Image
                    src={article?.image}
                    alt={article?.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-xs font-medium text-foreground capitalize">
                    {article?.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-xs font-medium text-foreground">{article?.readTime}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(article.publishDate)?.toLocaleDateString('vi-VN')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground leading-tight hover:text-primary transition-colors duration-200">
                  {article?.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {article?.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {article?.tags?.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={12} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{article?.author}</p>
                      <p className="text-xs text-muted-foreground">{article?.authorRole}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" iconName="ArrowRight">
                    Đọc
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12 animate-fade-in">
          <Button variant="outline" size="lg" iconName="Plus" iconPosition="left">
            Xem thêm tin tức
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
