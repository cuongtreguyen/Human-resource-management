import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmployeeRecognition = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedRecognitions, setLikedRecognitions] = useState({});

  const categories = [
    { id: 'all', label: 'All Recognition', icon: 'Award' },
    { id: 'innovation', label: 'Innovation', icon: 'Lightbulb' },
    { id: 'teamwork', label: 'Teamwork', icon: 'Users' },
    { id: 'leadership', label: 'Leadership', icon: 'Crown' },
    { id: 'excellence', label: 'Excellence', icon: 'Star' }
  ];

  const recognitionData = [
    {
      id: 1,
      employeeName: "Alex Thompson",
      employeeRole: "Senior Software Engineer",
      employeeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Engineering",
      category: "innovation",
      achievement: "AI Workflow Automation Breakthrough",
      description: "Alex led the development of our revolutionary AI-powered workflow automation system that increased team productivity by 40%. His innovative approach to machine learning integration has set new standards for our development processes.",
      recognizedBy: "David Kumar",
      recognizerRole: "Chief Innovation Officer",
      recognizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2024-09-20",
      likes: 127,
      comments: 23,
      tags: ["AI", "Innovation", "Productivity", "Leadership"],
      featured: true
    },
    {
      id: 2,
      employeeName: "Maria Garcia",
      employeeRole: "UX Design Lead",
      employeeAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Design",
      category: "excellence",
      achievement: "Outstanding User Experience Design",
      description: "Maria\'s exceptional design work on our new employee portal has received unanimous praise from users. Her attention to detail and user-centric approach resulted in a 95% user satisfaction rate.",
      recognizedBy: "Jennifer Park",
      recognizerRole: "Head of Design",
      recognizerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2024-09-18",
      likes: 89,
      comments: 15,
      tags: ["UX Design", "User Experience", "Innovation", "Excellence"]
    },
    {
      id: 3,
      employeeName: "James Wilson",
      employeeRole: "Team Lead - Customer Success",
      employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Customer Success",
      category: "leadership",
      achievement: "Exceptional Team Leadership During Q3",
      description: "James demonstrated outstanding leadership by guiding his team through a challenging quarter, achieving 150% of their customer satisfaction targets while maintaining team morale and fostering professional growth.",
      recognizedBy: "Dr. Emily Rodriguez",
      recognizerRole: "Chief People Officer",
      recognizerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2024-09-15",
      likes: 156,
      comments: 31,
      tags: ["Leadership", "Customer Success", "Team Management", "Excellence"]
    },
    {
      id: 4,
      employeeName: "Priya Patel",
      employeeRole: "Data Scientist",
      employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Analytics",
      category: "innovation",
      achievement: "Predictive Analytics Model Success",
      description: "Priya developed a groundbreaking predictive analytics model that improved our forecasting accuracy by 60%. Her work has become the foundation for strategic decision-making across multiple departments.",
      recognizedBy: "Michael Chen",
      recognizerRole: "Chief Technology Officer",
      recognizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2024-09-12",
      likes: 98,
      comments: 18,
      tags: ["Data Science", "Analytics", "Innovation", "Strategy"]
    },
    {
      id: 5,
      employeeName: "Robert Kim",
      employeeRole: "Marketing Specialist",
      employeeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Marketing",
      category: "teamwork",
      achievement: "Cross-Department Collaboration Excellence",
      description: "Robert's exceptional collaboration skills were instrumental in the successful launch of our Q3 campaign. He seamlessly coordinated between design, development, and sales teams, ensuring perfect execution.",
      recognizedBy: "Sarah Johnson",
      recognizerRole: "Chief Executive Officer",
      recognizerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2024-09-10",
      likes: 134,
      comments: 27,
      tags: ["Teamwork", "Collaboration", "Marketing", "Leadership"]
    },
    {
      id: 6,
      employeeName: "Lisa Chen",
      employeeRole: "HR Business Partner",
      employeeAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Human Resources",
      category: "excellence",
      achievement: "Employee Engagement Champion",
      description: "Lisa\'s innovative approach to employee engagement has resulted in our highest-ever satisfaction scores. Her wellness initiatives and feedback programs have transformed our workplace culture.",
      recognizedBy: "Dr. Emily Rodriguez",
      recognizerRole: "Chief People Officer",
      recognizerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "2024-09-08",
      likes: 167,
      comments: 42,
      tags: ["HR", "Employee Engagement", "Wellness", "Culture"]
    }
  ];

  const filteredRecognitions = selectedCategory === 'all' 
    ? recognitionData 
    : recognitionData?.filter(item => item?.category === selectedCategory);

  const handleLike = (recognitionId) => {
    setLikedRecognitions(prev => ({
      ...prev,
      [recognitionId]: !prev?.[recognitionId]
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'innovation': 'from-accent to-success',
      'teamwork': 'from-primary to-accent',
      'leadership': 'from-warning to-primary',
      'excellence': 'from-success to-accent'
    };
    return colors?.[category] || 'from-primary to-accent';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'innovation': 'Lightbulb',
      'teamwork': 'Users',
      'leadership': 'Crown',
      'excellence': 'Star'
    };
    return icons?.[category] || 'Award';
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Award" size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Employee Recognition
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Celebrating Our Amazing Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognizing outstanding achievements, innovative thinking, and exceptional contributions from our talented team members
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

        {/* Featured Recognition */}
        {selectedCategory === 'all' && (
          <div className="mb-16 animate-fade-in">
            {recognitionData?.filter(item => item?.featured)?.map((recognition) => (
              <div key={recognition?.id} className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-gray-200">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                        Featured Recognition
                      </div>
                      <div className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(recognition?.category)} text-white text-xs font-medium rounded-full flex items-center space-x-1`}>
                        <Icon name={getCategoryIcon(recognition?.category)} size={12} />
                        <span className="capitalize">{recognition?.category}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                        {recognition?.achievement}
                      </h3>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {recognition?.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {recognition?.tags?.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-muted/50 text-muted-foreground text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {new Date(recognition.date)?.toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Heart"
                          iconPosition="left"
                          onClick={() => handleLike(recognition?.id)}
                          className={likedRecognitions?.[recognition?.id] ? 'text-red-500' : ''}
                        >
                          {recognition?.likes + (likedRecognitions?.[recognition?.id] ? 1 : 0)}
                        </Button>
                        
                        <Button variant="ghost" size="sm" iconName="MessageCircle" iconPosition="left">
                          {recognition?.comments}
                        </Button>
                        
                        <Button variant="ghost" size="sm" iconName="Share">
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Employee Card */}
                    <div className="bg-card rounded-xl p-6 border border-gray-200 text-center">
                      <Image
                        src={recognition?.employeeAvatar}
                        alt={recognition?.employeeName}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                      />
                      <h4 className="text-lg font-bold text-foreground mb-1">{recognition?.employeeName}</h4>
                      <p className="text-sm text-primary font-medium mb-1">{recognition?.employeeRole}</p>
                      <p className="text-xs text-muted-foreground">{recognition?.department}</p>
                    </div>
                    
                    {/* Recognizer Card */}
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-3">Recognized by</p>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={recognition?.recognizerAvatar}
                          alt={recognition?.recognizedBy}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{recognition?.recognizedBy}</p>
                          <p className="text-xs text-muted-foreground">{recognition?.recognizerRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recognition Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecognitions?.filter(item => !item?.featured)?.map((recognition, index) => (
            <div 
              key={recognition?.id}
              className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(recognition?.category)} text-white text-xs font-medium rounded-full flex items-center space-x-1`}>
                    <Icon name={getCategoryIcon(recognition?.category)} size={12} />
                    <span className="capitalize">{recognition?.category}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(recognition.date)?.toLocaleDateString()}
                  </div>
                </div>
                
                {/* Employee Info */}
                <div className="flex items-center space-x-4">
                  <Image
                    src={recognition?.employeeAvatar}
                    alt={recognition?.employeeName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{recognition?.employeeName}</h4>
                    <p className="text-sm text-muted-foreground">{recognition?.employeeRole}</p>
                    <p className="text-xs text-muted-foreground">{recognition?.department}</p>
                  </div>
                </div>
                
                {/* Achievement */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    {recognition?.achievement}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recognition?.description?.substring(0, 120)}...
                  </p>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {recognition?.tags?.slice(0, 3)?.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={recognition?.recognizerAvatar}
                      alt={recognition?.recognizedBy}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs text-muted-foreground">
                      by {recognition?.recognizedBy}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Heart"
                      onClick={() => handleLike(recognition?.id)}
                      className={`text-xs ${likedRecognitions?.[recognition?.id] ? 'text-red-500' : ''}`}
                    >
                      {recognition?.likes + (likedRecognitions?.[recognition?.id] ? 1 : 0)}
                    </Button>
                    
                    <Button variant="ghost" size="sm" iconName="MessageCircle" className="text-xs">
                      {recognition?.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recognition Stats */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Recognition Impact</h3>
            <p className="text-muted-foreground">Celebrating achievements across our organization</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <Icon name="Award" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">892</div>
              <div className="text-sm text-muted-foreground">Total Recognitions</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto">
                <Icon name="Users" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">456</div>
              <div className="text-sm text-muted-foreground">Recognized Employees</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Employee Satisfaction</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center mx-auto">
                <Icon name="Heart" size={24} color="white" />
              </div>
              <div className="text-3xl font-bold text-foreground">2.4K</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
          </div>
        </div>

        {/* Nominate Someone */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="bg-card rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
            <Icon name="Plus" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Nominate a Colleague
            </h3>
            <p className="text-muted-foreground mb-6">
              Know someone who deserves recognition? Nominate them today!
            </p>
            <Button variant="default" size="lg" iconName="Award" iconPosition="left">
              Submit Nomination
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeRecognition;

