import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const NewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All News', icon: 'Newspaper' },
    { id: 'company', label: 'Company Updates', icon: 'Building2' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'culture', label: 'Culture', icon: 'Heart' },
    { id: 'events', label: 'Events', icon: 'Calendar' }
  ];

  const newsData = [
    {
      id: 1,
      category: 'company',
      title: "Employee Hub Wins \'Best Workplace Technology\' Award",
      excerpt: "Our innovative approach to employee engagement has been recognized by the Industry Excellence Awards 2024.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Sarah Johnson",
      authorRole: "CEO",
      publishDate: "2024-09-20",
      readTime: "3 min read",
      tags: ["Award", "Recognition", "Innovation"],
      featured: true
    },
    {
      id: 2,
      category: 'achievements',
      title: "Q3 Performance Highlights: Record-Breaking Quarter",
      excerpt: "Our team achieved unprecedented growth with 150% increase in productivity and 95% employee satisfaction.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Michael Chen",
      authorRole: "VP Operations",
      publishDate: "2024-09-18",
      readTime: "5 min read",
      tags: ["Performance", "Growth", "Success"]
    },
    {
      id: 3,
      category: 'culture',
      title: "Introducing Wellness Wednesday: Mental Health Initiative",
      excerpt: "New program focuses on employee wellbeing with meditation sessions, fitness classes, and mental health resources.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Dr. Emily Rodriguez",
      authorRole: "Head of HR",
      publishDate: "2024-09-15",
      readTime: "4 min read",
      tags: ["Wellness", "Mental Health", "Initiative"]
    },
    {
      id: 4,
      category: 'events',
      title: "Annual Innovation Summit 2024: Save the Date",
      excerpt: "Join us for three days of inspiring talks, workshops, and networking opportunities. Registration opens October 1st.",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Alex Thompson",
      authorRole: "Event Coordinator",
      publishDate: "2024-09-12",
      readTime: "2 min read",
      tags: ["Event", "Innovation", "Summit"]
    },
    {
      id: 5,
      category: 'company',
      title: "New Office Space Opens in Austin: Expanding Our Reach",
      excerpt: "Our newest location features state-of-the-art facilities and collaborative spaces designed for modern work.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Jennifer Park",
      authorRole: "Facilities Manager",
      publishDate: "2024-09-10",
      readTime: "3 min read",
      tags: ["Expansion", "Office", "Growth"]
    },
    {
      id: 6,
      category: 'achievements',
      title: "Employee Spotlight: Innovation Team\'s AI Breakthrough",
      excerpt: "Our AI research team develops groundbreaking solution that improves workflow efficiency by 40%.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "David Kumar",
      authorRole: "CTO",
      publishDate: "2024-09-08",
      readTime: "6 min read",
      tags: ["Innovation", "AI", "Technology"]
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
              Latest News
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Stay Updated with Company News
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest updates, achievements, and stories that shape our company culture
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
                      Featured
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(featuredNews.publishDate)?.toLocaleDateString()}</span>
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
                      Read More
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
                  <span>{new Date(article.publishDate)?.toLocaleDateString()}</span>
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
                    Read
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12 animate-fade-in">
          <Button variant="outline" size="lg" iconName="Plus" iconPosition="left">
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

