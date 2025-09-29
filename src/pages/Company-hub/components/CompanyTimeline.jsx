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
      title: "Employee Hub Wins \'Best Workplace Technology\' Award",
      description: "Our innovative approach to employee engagement has been recognized by the Industry Excellence Awards, marking a significant milestone in our journey.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Achievement",
      impact: "Company-wide recognition and increased market visibility",
      metrics: ["150% productivity increase", "95% employee satisfaction", "50+ industry mentions"]
    },
    {
      id: 2,
      year: '2024',
      quarter: 'Q2',
      title: "Austin Office Grand Opening",
      description: "Expanded our presence with a state-of-the-art facility in Austin, Texas, featuring collaborative spaces and cutting-edge technology.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Expansion",
      impact: "200+ new employees and enhanced regional presence",
      metrics: ["25,000 sq ft facility", "200+ new hires", "3 new departments"]
    },
    {
      id: 3,
      year: '2024',
      quarter: 'Q1',
      title: "AI Innovation Lab Launch",
      description: "Established our dedicated AI research and development lab, focusing on workplace automation and employee experience enhancement.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Innovation",
      impact: "Breakthrough AI solutions improving workflow efficiency by 40%",
      metrics: ["15 AI researchers", "5 patents filed", "40% efficiency gain"]
    },
    {
      id: 4,
      year: '2023',
      quarter: 'Q4',
      title: "Wellness Program Excellence Award",
      description: "Our comprehensive employee wellness program received national recognition for its innovative approach to mental health and work-life balance.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Culture",
      impact: "Improved employee wellbeing and reduced turnover by 30%",
      metrics: ["30% turnover reduction", "90% program participation", "4.8/5 satisfaction rating"]
    },
    {
      id: 5,
      year: '2023',
      quarter: 'Q2',
      title: "Global Partnership with TechCorp",
      description: "Formed strategic alliance with TechCorp to enhance our technology stack and expand our global reach in the enterprise market.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Partnership",
      impact: "Access to new markets and enhanced product capabilities",
      metrics: ["12 new markets", "$50M partnership value", "25% revenue growth"]
    },
    {
      id: 6,
      year: '2022',
      quarter: 'Q3',
      title: "IPO Success and Public Listing",
      description: "Successfully completed our initial public offering, raising $200M to fuel our growth and innovation initiatives.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Milestone",
      impact: "Secured funding for accelerated growth and market expansion",
      metrics: ["$200M raised", "NYSE listing", "500% stock growth"]
    },
    {
      id: 7,
      year: '2021',
      quarter: 'Q1',
      title: "Remote-First Culture Transformation",
      description: "Successfully transitioned to a remote-first work culture, implementing new tools and processes to maintain productivity and connection.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Transformation",
      impact: "Maintained 100% productivity while expanding talent pool globally",
      metrics: ["100% remote capability", "Global talent access", "Zero productivity loss"]
    },
    {
      id: 8,
      year: '2020',
      quarter: 'Q2',
      title: "Employee Hub Platform Launch",
      description: "Launched our flagship employee management platform, revolutionizing how companies engage with their workforce.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Product",
      impact: "Transformed employee experience for 1000+ companies",
      metrics: ["1000+ companies", "100K+ users", "99.9% uptime"]
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
              Company Timeline
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Journey of Growth & Innovation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the key milestones, achievements, and transformative moments that have shaped our company's evolution
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
              {year === 'all' ? 'All Years' : year}
            </Button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-success opacity-30"></div>

          <div className="space-y-12">
            {filteredTimeline?.map((milestone, index) => (
              <div 
                key={milestone?.id}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-background shadow-strong z-10"></div>

                {/* Content Card */}
                <div className="ml-20">
                  <div className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                    <div className="grid lg:grid-cols-3 gap-0">
                      {/* Image */}
                      <div className="relative lg:col-span-1">
                        <Image
                          src={milestone?.image}
                          alt={milestone?.title}
                          className="w-full h-64 lg:h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Type Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${getTypeColor(milestone?.type)} text-white text-sm font-medium rounded-full flex items-center space-x-2`}>
                          <Icon name={getTypeIcon(milestone?.type)} size={14} />
                          <span>{milestone?.type}</span>
                        </div>

                        {/* Year Badge */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{milestone?.year}</div>
                            <div className="text-xs text-muted-foreground">{milestone?.quarter}</div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:col-span-2 p-8 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-muted-foreground font-medium">
                              {milestone?.year} �?{milestone?.quarter}
                            </div>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-foreground leading-tight">
                            {milestone?.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed">
                            {milestone?.description}
                          </p>
                        </div>

                        {/* Impact */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="TrendingUp" size={16} className="text-success" />
                            <span className="text-sm font-medium text-foreground">Impact</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone?.impact}</p>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Icon name="BarChart3" size={16} className="text-primary" />
                            <span className="text-sm font-medium text-foreground">Key Metrics</span>
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

                        {/* Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-sm text-muted-foreground">
                            Milestone #{milestone?.id}
                          </div>
                          <Button variant="ghost" size="sm" iconName="ExternalLink">
                            Learn More
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

        {/* Statistics Summary */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Our Journey in Numbers</h3>
            <p className="text-muted-foreground">Key achievements across our company timeline</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <Icon name="Calendar" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">15+</div>
              <div className="text-sm text-muted-foreground">Years of Excellence</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto">
                <Icon name="Award" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">25+</div>
              <div className="text-sm text-muted-foreground">Industry Awards</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Users" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">2,847</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center mx-auto">
                <Icon name="Building2" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Global Offices</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;

