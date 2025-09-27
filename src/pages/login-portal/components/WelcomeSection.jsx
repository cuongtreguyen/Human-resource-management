import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WelcomeSection = () => {
  const features = [
    {
      icon: 'Users',
      title: 'Team Collaboration',
      description: 'Connect and collaborate with your team members seamlessly'
    },
    {
      icon: 'BarChart3',
      title: 'Performance Analytics',
      description: 'Track your progress and achievements with detailed insights'
    },
    {
      icon: 'Shield',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to protect your data and privacy'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director',
      company: 'TechCorp Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      quote: 'Employee Hub transformed our workplace culture. The intuitive design makes daily tasks enjoyable rather than burdensome.'
    },
    {
      name: 'Michael Chen',
      role: 'Team Lead',
      company: 'Innovation Labs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      quote: 'The seamless integration and beautiful interface have significantly improved our team productivity and engagement.'
    }
  ];

  return (
    <div className="flex flex-col justify-center space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-success rounded-2xl flex items-center justify-center mx-auto shadow-strong animate-pulse-soft">
            <Icon name="Users" size={32} color="white" strokeWidth={2.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center animate-bounce-gentle">
            <Icon name="Sparkles" size={12} color="white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              Employee Hub
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Where productivity meets personality. Your digital workplace that actually works for you.
          </p>
        </div>
      </div>
      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6">
        {features?.map((feature, index) => (
          <div
            key={feature?.title}
            className="flex items-start space-x-4 p-4 bg-card/50 rounded-lg border border-gray-200/50 hover:border-primary/20 transition-all duration-300 hover:shadow-soft animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={18} className="text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-sm">{feature?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Testimonials */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">Trusted by Teams Worldwide</h3>
        <div className="space-y-4">
          {testimonials?.map((testimonial, index) => (
            <div
              key={testimonial?.name}
              className="bg-card/30 rounded-lg p-4 border border-gray-200/30 animate-fade-in"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{testimonial?.quote}"
                  </p>
                  <div>
                    <p className="text-xs font-medium text-foreground">{testimonial?.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial?.role} at {testimonial?.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-green-600" />
            <span className="text-xs text-muted-foreground">SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={16} className="text-blue-600" />
            <span className="text-xs text-muted-foreground">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-purple-600" />
            <span className="text-xs text-muted-foreground">SOC 2 Certified</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Join 50,000+ professionals who trust Employee Hub
          </p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            {[1, 2, 3, 4, 5]?.map((star) => (
              <Icon key={star} name="Star" size={12} className="text-yellow-400 fill-current" />
            ))}
            <span className="text-xs text-muted-foreground ml-2">4.9/5 rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;

