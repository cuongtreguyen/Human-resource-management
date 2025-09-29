import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LeadershipMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const leadershipData = [
    {
      id: 1,
      name: "Nguyễn Văn Cương",
      role: "Chief Executive Officer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Executive Leadership",
      joinDate: "2018-03-15",
      message: {
        title: "Embracing Innovation in the Digital Age",
        content: `Dear Team,\n\nAs we navigate through 2024, I'm incredibly proud of how our organization has embraced innovation while staying true to our core values. Our recent recognition as 'Best Workplace Technology' is a testament to your dedication and creativity.\n\nThe future of work is evolving rapidly, and we're not just adapting �?we're leading the charge. Our investment in AI technology, wellness programs, and employee development continues to set new industry standards.\n\nTogether, we're building more than just a company; we're creating a movement that transforms how people experience work. Thank you for being part of this incredible journey.\n\nWith gratitude and excitement for what's ahead,\nSarah`,
        date: "2024-09-20",
        category: "Vision & Strategy",
        readTime: "3 min read"
      },
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson"
      },
      achievements: ["Fortune 40 Under 40", "Tech Leader of the Year 2023", "Innovation Excellence Award"]
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Chief Technology Officer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Technology",
      joinDate: "2019-07-22",
      message: {
        title: "The AI Revolution: Our Technical Journey Forward",
        content: `Hello Innovators,\n\nOur recent breakthrough in AI-powered workflow automation represents more than just technological advancement �?it's a glimpse into the future we're building together.\n\nThe 40% efficiency improvement we've achieved isn't just a number; it's time given back to our employees to focus on what truly matters: creativity, collaboration, and meaningful work.\n\nAs we continue to push the boundaries of what's possible, remember that technology is only as powerful as the human vision that guides it. Your ideas, feedback, and innovative thinking are what transform code into solutions that change lives.\n\nLet's keep building the future, one breakthrough at a time.\n\nBest regards,\nMichael`,
        date: "2024-09-18",
        category: "Technology & Innovation",
        readTime: "4 min read"
      },
      socialLinks: {
        linkedin: "https://linkedin.com/in/michaelchen",
        github: "https://github.com/michaelchen"
      },
      achievements: ["AI Innovation Award 2024", "Patent Holder (15 patents)", "Tech Visionary Recognition"]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Chief People Officer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Human Resources",
      joinDate: "2020-01-10",
      message: {
        title: "Wellness Wednesday: Investing in Our Greatest Asset",
        content: `Dear Team Family,\n\nWhen we launched Wellness Wednesday, it wasn't just about adding another program to our benefits package. It was about recognizing that our people are our greatest strength, and their wellbeing is fundamental to our collective success.\n\nSeeing 90% participation in our wellness programs and witnessing the positive impact on both personal and professional lives fills me with immense pride. Your mental health, physical wellness, and work-life balance aren't just HR metrics �?they're the foundation of our thriving culture.\n\nAs we continue to expand our wellness initiatives, remember that taking care of yourself isn't selfish; it's essential. A healthy, happy team creates extraordinary results.\n\nWith care and appreciation,\nDr. Emily`,
        date: "2024-09-15",
        category: "Wellness & Culture",
        readTime: "3 min read"
      },
      socialLinks: {
        linkedin: "https://linkedin.com/in/emilyrodriguez",
        twitter: "https://twitter.com/dremilyrodriguez"
      },
      achievements: ["HR Excellence Award 2024", "Wellness Program Innovation", "Employee Satisfaction Champion"]
    },
    {
      id: 4,
      name: "David Kumar",
      role: "Chief Innovation Officer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      department: "Innovation Lab",
      joinDate: "2021-05-18",
      message: {
        title: "Innovation Lab: Where Ideas Become Reality",
        content: `Innovation Enthusiasts,\n\nOur Innovation Lab has become more than a physical space �?it's a mindset, a culture, and a commitment to pushing boundaries. The 15 patents we've filed this year represent countless hours of creative thinking, experimentation, and collaborative problem-solving.\n\nBut innovation isn't just about technology; it's about reimagining how we work, connect, and grow together. Every suggestion in our innovation portal, every 'what if' conversation, and every bold idea contributes to our collective genius.\n\nThe future belongs to organizations that dare to think differently. Thank you for making Employee Hub a place where innovation thrives and impossible becomes inevitable.\n\nKeep innovating,\nDavid`,
        date: "2024-09-12",
        category: "Innovation & Research",
        readTime: "4 min read"
      },
      socialLinks: {
        linkedin: "https://linkedin.com/in/davidkumar",
        twitter: "https://twitter.com/davidkumar"
      },
      achievements: ["Innovation Leader 2024", "Patent Portfolio Excellence", "R&D Breakthrough Award"]
    }
  ];

  const openMessage = (leader) => {
    setSelectedMessage(leader);
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="MessageSquare" size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Leadership Messages
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Words from Our Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, vision, and inspiration from the leadership team guiding our journey forward
          </p>
        </div>

        {/* Leadership Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {leadershipData?.map((leader, index) => (
            <div 
              key={leader?.id}
              className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openMessage(leader)}
            >
              <div className="p-6 text-center space-y-4">
                <div className="relative mx-auto w-20 h-20">
                  <Image
                    src={leader?.avatar}
                    alt={leader?.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center">
                    <Icon name="MessageCircle" size={12} color="white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">{leader?.name}</h3>
                  <p className="text-sm text-primary font-medium">{leader?.role}</p>
                  <p className="text-xs text-muted-foreground">{leader?.department}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-1">Latest Message</p>
                    <p className="text-xs text-muted-foreground">{leader?.message?.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(leader.message.date)?.toLocaleDateString()}
                      </span>
                      <span className="text-xs text-primary">{leader?.message?.readTime}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" fullWidth iconName="Eye">
                    Read Message
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Messages Preview */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Recent Leadership Updates</h3>
            <p className="text-muted-foreground">Stay connected with the latest thoughts and insights from our leadership team</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {leadershipData?.slice(0, 2)?.map((leader) => (
              <div key={leader?.id} className="bg-card rounded-xl p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <Image
                    src={leader?.avatar}
                    alt={leader?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-bold text-foreground">{leader?.name}</h4>
                      <p className="text-sm text-muted-foreground">{leader?.role}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-foreground mb-2">{leader?.message?.title}</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {leader?.message?.content?.split('\n')?.[2]?.substring(0, 120)}...
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(leader.message.date)?.toLocaleDateString()}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        iconName="ArrowRight"
                        onClick={() => openMessage(leader)}
                      >
                        Read Full
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-strong animate-fade-in">
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src={selectedMessage?.avatar}
                    alt={selectedMessage?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedMessage?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMessage?.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeMessage}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {selectedMessage?.message?.category}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedMessage.message.date)?.toLocaleDateString()} �?{selectedMessage?.message?.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedMessage?.message?.title}
                  </h2>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  {selectedMessage?.message?.content?.split('\n')?.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {/* Leader Info */}
                <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-foreground">About {selectedMessage?.name}</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Department</p>
                      <p className="font-medium text-foreground">{selectedMessage?.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Joined</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedMessage.joinDate)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Key Achievements</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage?.achievements?.map((achievement, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-success/10 text-success text-sm rounded-full"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-muted-foreground">Connect:</p>
                    {Object.entries(selectedMessage?.socialLinks)?.map(([platform, url]) => (
                      <Button key={platform} variant="ghost" size="sm" iconName="ExternalLink">
                        {platform?.charAt(0)?.toUpperCase() + platform?.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadershipMessages;

