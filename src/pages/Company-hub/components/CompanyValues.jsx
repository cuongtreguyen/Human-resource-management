import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CompanyValues = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const valuesData = [
    {
      id: 1,
      title: "Innovation First",
      subtitle: "Pioneering the Future of Work",
      description: "We believe in pushing boundaries and challenging the status quo. Innovation isn't just what we do �?it's who we are.",
      icon: "Lightbulb",
      color: "from-accent to-success",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      principles: [
        "Embrace creative thinking and experimentation",
        "Challenge conventional approaches to problem-solving",
        "Foster a culture of continuous learning and adaptation",
        "Invest in cutting-edge technology and methodologies"
      ],
      examples: [
        "AI-powered workflow automation reducing manual tasks by 40%",
        "Revolutionary employee engagement platform serving 1000+ companies",
        "15 patents filed in workplace technology innovations",
        "Industry-first remote collaboration tools"
      ],
      impact: "Our innovation-first approach has resulted in breakthrough solutions that transform how people work and collaborate."
    },
    {
      id: 2,
      title: "People Matter",
      subtitle: "Putting Humanity at the Heart of Everything",
      description: "Every decision we make starts with one question: How does this impact our people? Because great companies are built by great people.",
      icon: "Heart",
      color: "from-warning to-success",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      principles: [
        "Prioritize employee wellbeing and work-life balance",
        "Create inclusive environments where everyone thrives",
        "Invest in professional development and career growth",
        "Recognize and celebrate individual contributions"
      ],
      examples: [
        "95% employee satisfaction rate across all departments",
        "Comprehensive wellness programs including mental health support",
        "30% reduction in turnover through people-first policies",
        "Award-winning diversity and inclusion initiatives"
      ],
      impact: "Our people-centric culture has created an environment where talent flourishes and innovation thrives naturally."
    },
    {
      id: 3,
      title: "Excellence Driven",
      subtitle: "Setting the Standard for Quality",
      description: "We don't just meet expectations �?we exceed them. Excellence is our minimum standard, not our aspiration.",
      icon: "Star",
      color: "from-primary to-accent",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      principles: [
        "Maintain the highest standards in everything we deliver",
        "Continuously improve processes and outcomes",
        "Take ownership and accountability for results",
        "Strive for perfection while embracing iterative progress"
      ],
      examples: [
        "99.9% platform uptime with industry-leading reliability",
        "'Best Workplace Technology\' award recognition",
        "Zero-defect deployment processes and quality assurance",
        "Customer satisfaction scores consistently above 4.8/5"
      ],
      impact: "Our commitment to excellence has established us as the gold standard in employee management technology."
    },
    {
      id: 4,
      title: "Collaboration Always",
      subtitle: "Achieving More Together",
      description: "The best ideas emerge when diverse minds come together. We believe in the power of collective intelligence and shared success.",
      icon: "Users",
      color: "from-success to-primary",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      principles: [
        "Foster open communication and knowledge sharing",
        "Break down silos between departments and teams",
        "Celebrate collective achievements and shared wins",
        "Build bridges across different perspectives and expertise"
      ],
      examples: [
        "Cross-functional teams delivering 25% faster results",
        "Global collaboration tools connecting 12 office locations",
        "Peer mentorship programs with 90% participation",
        "Innovation challenges generating 200+ collaborative ideas"
      ],
      impact: "Our collaborative culture has accelerated innovation and created solutions that no individual could achieve alone."
    },
    {
      id: 5,
      title: "Integrity Always",
      subtitle: "Doing Right When No One\'s Watching",
      description: "Trust is the foundation of everything we build. We act with honesty, transparency, and ethical responsibility in all our endeavors.",
      icon: "Shield",
      color: "from-secondary to-accent",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      principles: [
        "Maintain transparency in all business practices",
        "Honor commitments and deliver on promises",
        "Protect customer data with the highest security standards",
        "Make ethical decisions even when they're difficult"
      ],
      examples: [
        "SOC 2 Type II compliance and enterprise-grade security",
        "Transparent pricing with no hidden fees or surprises",
        "Ethical AI development with bias prevention measures",
        "100% honest communication in all stakeholder relationships"
      ],
      impact: "Our unwavering integrity has built lasting trust with customers, partners, and team members worldwide."
    },
    {
      id: 6,
      title: "Growth Mindset",
      subtitle: "Embracing Continuous Evolution",
      description: "We see challenges as opportunities and failures as learning experiences. Growth isn\'t just our goal �?it\'s our way of thinking.",
      icon: "TrendingUp",
      color: "from-warning to-primary",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      principles: [
        "Embrace challenges as opportunities for development",
        "Learn from setbacks and iterate quickly",
        "Invest in continuous skill development and education",
        "Encourage experimentation and calculated risk-taking"
      ],
      examples: [
        "200+ hours of learning opportunities per employee annually",
        "Failure celebration sessions to extract valuable insights",
        "Career advancement programs with 80% internal promotion rate",
        "Innovation time allocation for personal project development"
      ],
      impact: "Our growth mindset has created a resilient organization that adapts quickly and thrives in changing environments."
    }
  ];

  const openValueDetail = (value) => {
    setSelectedValue(value);
  };

  const closeValueDetail = () => {
    setSelectedValue(null);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Compass" size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Company Values
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            The Principles That Guide Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our core values aren't just words on a wall �?they're the foundation of every decision, every innovation, and every relationship we build
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {valuesData?.map((value, index) => (
            <div 
              key={value?.id}
              className="bg-card rounded-xl border border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openValueDetail(value)}
            >
              <div className="relative">
                <div className="rounded-t-xl overflow-hidden">
                  <Image
                    src={value?.image}
                    alt={value?.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-br ${value?.color} rounded-full flex items-center justify-center shadow-strong`}>
                  <Icon name={value?.icon} size={20} color="white" />
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">{value?.title}</h3>
                  <p className="text-sm text-primary font-medium">{value?.subtitle}</p>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {value?.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-muted-foreground">
                    Core Value #{value?.id}
                  </span>
                  <Button variant="ghost" size="sm" iconName="ArrowRight">
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Values in Action */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Values in Action</h3>
            <p className="text-muted-foreground">See how our values translate into real-world impact</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Award" size={24} color="white" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Industry Recognition</h4>
              <p className="text-sm text-muted-foreground">25+ awards for innovation and workplace excellence</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={24} color="white" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Employee Satisfaction</h4>
              <p className="text-sm text-muted-foreground">95% satisfaction rate with people-first culture</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Continuous Growth</h4>
              <p className="text-sm text-muted-foreground">150% productivity increase through innovation</p>
            </div>
          </div>
        </div>

        {/* Value Detail Modal */}
        {selectedValue && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-strong animate-fade-in">
              {/* Modal Header */}
              <div className="relative">
                <div className="rounded-t-2xl overflow-hidden">
                  <Image
                    src={selectedValue?.image}
                    alt={selectedValue?.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" onClick={closeValueDetail} className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                    <Icon name="X" size={20} color="white" />
                  </Button>
                </div>
                
                <div className="absolute bottom-6 left-6 text-white">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedValue?.color} rounded-full flex items-center justify-center mb-4`}>
                    <Icon name={selectedValue?.icon} size={24} color="white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{selectedValue?.title}</h2>
                  <p className="text-lg opacity-90">{selectedValue?.subtitle}</p>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Our Commitment</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {selectedValue?.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Principles */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-foreground flex items-center space-x-2">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                      <span>Core Principles</span>
                    </h4>
                    <ul className="space-y-3">
                      {selectedValue?.principles?.map((principle, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Examples */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-foreground flex items-center space-x-2">
                      <Icon name="Lightbulb" size={20} className="text-accent" />
                      <span>Real Examples</span>
                    </h4>
                    <ul className="space-y-3">
                      {selectedValue?.examples?.map((example, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Impact */}
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="Target" size={20} className="text-primary" />
                    <span>Impact & Results</span>
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedValue?.impact}
                  </p>
                </div>
                
                {/* Action */}
                <div className="text-center">
                  <Button variant="default" size="lg" iconName="Heart" iconPosition="left">
                    Live This Value
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-card rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
            <Icon name="Compass" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join Our Values-Driven Culture
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Be part of an organization where values aren't just aspirations �?they're the foundation of everything we do. Together, we're building a workplace that truly works for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" size="lg" iconName="Users" iconPosition="left">
                Meet Our Team
              </Button>
              <Button variant="outline" size="lg" iconName="FileText" iconPosition="left">
                Our Culture Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyValues;

