import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CompanyTimeline = () => {
  const [selectedYear, setSelectedYear] = useState('all');

  const timelineData = [
    {
      id: 1,
      year: '2024',
      quarter: 'Q3',
      title: "Employee Hub giành giải thưởng 'Best Workplace Technology'",
      description: "Cách tiếp cận sáng tạo của chúng tôi trong việc gắn kết nhân viên đã được công nhận tại Industry Excellence Awards, đánh dấu một cột mốc quan trọng trong hành trình phát triển.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Achievement",
      impact: "Được công nhận toàn công ty và tăng cường uy tín trên thị trường",
      metrics: ["+150% năng suất", "95% sự hài lòng nhân viên", "50+ lần nhắc đến trong ngành"]
    },
    {
      id: 2,
      year: '2024',
      quarter: 'Q2',
      title: "Khai trương văn phòng Austin",
      description: "Mở rộng hiện diện với cơ sở hiện đại tại Austin, Texas, bao gồm không gian hợp tác và công nghệ tiên tiến.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Expansion",
      impact: "200+ nhân viên mới và mở rộng sự hiện diện khu vực",
      metrics: ["25,000 ft² văn phòng", "200+ nhân viên mới", "3 phòng ban mới"]
    },
    {
      id: 3,
      year: '2024',
      quarter: 'Q1',
      title: "Ra mắt Phòng thí nghiệm AI Innovation Lab",
      description: "Thành lập phòng nghiên cứu AI chuyên dụng, tập trung vào tự động hóa nơi làm việc và nâng cao trải nghiệm nhân viên.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Innovation",
      impact: "Các giải pháp AI đột phá cải thiện hiệu suất công việc 40%",
      metrics: ["15 nhà nghiên cứu AI", "5 bằng sáng chế", "40% tăng hiệu suất"]
    },
    {
      id: 4,
      year: '2023',
      quarter: 'Q4',
      title: "Giải thưởng Chương trình Sức khỏe Xuất sắc",
      description: "Chương trình chăm sóc sức khỏe toàn diện cho nhân viên đã được công nhận quốc gia nhờ sự sáng tạo trong cân bằng tinh thần và công việc.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Culture",
      impact: "Cải thiện sức khỏe nhân viên và giảm 30% tỷ lệ nghỉ việc",
      metrics: ["30% giảm nghỉ việc", "90% tham gia", "4.8/5 điểm hài lòng"]
    },
    {
      id: 5,
      year: '2023',
      quarter: 'Q2',
      title: "Hợp tác toàn cầu với TechCorp",
      description: "Thiết lập liên minh chiến lược với TechCorp để tăng cường công nghệ và mở rộng thị trường toàn cầu.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Partnership",
      impact: "Tiếp cận thị trường mới và nâng cao năng lực sản phẩm",
      metrics: ["12 thị trường mới", "Hợp tác trị giá $50M", "25% tăng trưởng doanh thu"]
    },
    {
      id: 6,
      year: '2022',
      quarter: 'Q3',
      title: "IPO thành công và niêm yết công khai",
      description: "Hoàn tất IPO thành công, huy động được $200M để thúc đẩy tăng trưởng và đổi mới.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Milestone",
      impact: "Đảm bảo nguồn vốn cho tăng trưởng và mở rộng thị trường",
      metrics: ["$200M huy động", "Niêm yết NYSE", "500% tăng trưởng cổ phiếu"]
    },
    {
      id: 7,
      year: '2021',
      quarter: 'Q1',
      title: "Chuyển đổi sang văn hoá Remote-First",
      description: "Chuyển đổi thành công sang mô hình làm việc từ xa, triển khai công cụ và quy trình mới để duy trì năng suất.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Transformation",
      impact: "Duy trì 100% năng suất và mở rộng nhân tài toàn cầu",
      metrics: ["100% khả năng remote", "Tiếp cận nhân tài toàn cầu", "Không mất năng suất"]
    },
    {
      id: 8,
      year: '2020',
      quarter: 'Q2',
      title: "Ra mắt nền tảng Employee Hub",
      description: "Phát hành nền tảng quản lý nhân sự đầu tiên, cách mạng hóa cách doanh nghiệp gắn kết với lực lượng lao động.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Product",
      impact: "Thay đổi trải nghiệm nhân viên cho 1000+ công ty",
      metrics: ["1000+ công ty", "100K+ người dùng", "99.9% uptime"]
    }
  ];

  const years = ['all', ...new Set(timelineData.map(item => item.year))]?.sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return b?.localeCompare(a);
  });

  const filteredTimeline = selectedYear === 'all' 
    ? timelineData 
    : timelineData?.filter(item => item?.year === selectedYear);

  const getTypeColor = (type) => {
    const colors = {
      'Achievement': 'from-accent to-success',
      'Expansion': 'from-primary to-accent',
      'Innovation': 'from-success to-primary',
      'Culture': 'from-warning to-success',
      'Partnership': 'from-secondary to-primary',
      'Milestone': 'from-primary to-warning',
      'Transformation': 'from-accent to-warning',
      'Product': 'from-success to-accent'
    };
    return colors?.[type] || 'from-primary to-accent';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Achievement': 'Award',
      'Expansion': 'Building2',
      'Innovation': 'Lightbulb',
      'Culture': 'Heart',
      'Partnership': 'Handshake',
      'Milestone': 'Flag',
      'Transformation': 'RefreshCw',
      'Product': 'Rocket'
    };
    return icons?.[type] || 'Star';
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Clock" size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Dòng thời gian công ty
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Hành trình tăng trưởng & đổi mới
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những cột mốc, thành tựu và khoảnh khắc thay đổi đã định hình sự phát triển của công ty chúng tôi
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
          {years?.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className="transition-all duration-300 hover:scale-105"
            >
              {year === 'all' ? 'Tất cả' : year}
            </Button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-success opacity-30"></div>

          <div className="space-y-12">
            {filteredTimeline?.map((milestone, index) => (
              <div 
                key={milestone?.id}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-background shadow-strong z-10"></div>

                <div className="ml-20">
                  <div className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                    <div className="grid lg:grid-cols-3 gap-0">
                      <div className="relative lg:col-span-1">
                        <Image
                          src={milestone?.image}
                          alt={milestone?.title}
                          className="w-full h-64 lg:h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${getTypeColor(milestone?.type)} text-white text-sm font-medium rounded-full flex items-center space-x-2`}>
                          <Icon name={getTypeIcon(milestone?.type)} size={14} />
                          <span>{milestone?.type}</span>
                        </div>

                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{milestone?.year}</div>
                            <div className="text-xs text-muted-foreground">{milestone?.quarter}</div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 p-8 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-muted-foreground font-medium">
                              {milestone?.year} · {milestone?.quarter}
                            </div>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-foreground leading-tight">
                            {milestone?.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed">
                            {milestone?.description}
                          </p>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="TrendingUp" size={16} className="text-success" />
                            <span className="text-sm font-medium text-foreground">Tác động</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone?.impact}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Icon name="BarChart3" size={16} className="text-primary" />
                            <span className="text-sm font-medium text-foreground">Chỉ số chính</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {milestone?.metrics?.map((metric, metricIndex) => (
                              <div 
                                key={metricIndex}
                                className="bg-primary/5 rounded-lg p-3 text-center"
                              >
                                <div className="text-sm font-medium text-primary">{metric}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-sm text-muted-foreground">
                            Mốc #{milestone?.id}
                          </div>
                          <Button variant="ghost" size="sm" iconName="ExternalLink">
                            Xem thêm
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Hành trình qua các con số</h3>
            <p className="text-muted-foreground">Những thành tựu chính trong dòng thời gian của công ty</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <Icon name="Calendar" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">15+</div>
              <div className="text-sm text-muted-foreground">Năm hoạt động</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto">
                <Icon name="Award" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">25+</div>
              <div className="text-sm text-muted-foreground">Giải thưởng</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Users" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">2,847</div>
              <div className="text-sm text-muted-foreground">Nhân viên</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center mx-auto">
                <Icon name="Building2" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Văn phòng toàn cầu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;
