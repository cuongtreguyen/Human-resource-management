import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import WelcomeHeader from './components/WelcomeHeader';
import QuickStatsGrid from './components/QuickStatsGrid';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentActivityFeed from './components/RecentActivityFeed';
import UpcomingEventsWidget from './components/UpcomingEventsWidget';
import WeatherWidget from './components/WeatherWidget';
import CompanyAnnouncementsCarousel from './components/CompanyAnnouncementsCarousel';
import ShortcutTiles from './components/ShortcutTiles';

const Dashboard = () => {
  const [currentUser] = useState({
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@employeehub.com",
    role: "Senior Product Manager",
    department: "Product Development",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  });

  const [dashboardStats] = useState([
    {
      id: 1,
      type: "tasks",
      label: "Tasks Completed",
      value: "24",
      description: "This week",
      change: "+12%",
      trend: "up"
    },
    {
      id: 2,
      type: "meetings",
      label: "Meetings Today",
      value: "6",
      description: "Next: 2:30 PM",
      change: "2 pending",
      trend: "neutral"
    },
    {
      id: 3,
      type: "messages",
      label: "Unread Messages",
      value: "18",
      description: "Team channels",
      change: "+5 new",
      trend: "up"
    },
    {
      id: 4,
      type: "projects",
      label: "Active Projects",
      value: "3",
      description: "On track",
      change: "100%",
      trend: "up"
    }
  ]);

  const [quickActions] = useState([
    {
      id: 1,
      label: "Submit Report",
      description: "Monthly status",
      icon: "FileText",
      path: "/reports/submit",
      color: "primary"
    },
    {
      id: 2,
      label: "Book Meeting",
      description: "Schedule time",
      icon: "Calendar",
      path: "/calendar/book",
      color: "success"
    },
    {
      id: 3,
      label: "Team Chat",
      description: "Join discussion",
      icon: "MessageSquare",
      path: "/chat",
      color: "accent"
    },
    {
      id: 4,
      label: "Time Off",
      description: "Request leave",
      icon: "Plane",
      path: "/time-off",
      color: "warning"
    },
    {
      id: 5,
      label: "Expenses",
      description: "Submit receipt",
      icon: "Receipt",
      path: "/expenses",
      color: "primary"
    },
    {
      id: 6,
      label: "Directory",
      description: "Find colleagues",
      icon: "Users",
      path: "/team-directory",
      color: "success"
    },
    {
      id: 7,
      label: "Help Desk",
      description: "Get support",
      icon: "HelpCircle",
      path: "/help",
      color: "accent"
    },
    {
      id: 8,
      label: "Settings",
      description: "Preferences",
      icon: "Settings",
      path: "/settings",
      color: "warning"
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "task_completed",
      title: "Completed Q4 Planning Document",
      description: "Finalized the quarterly planning document with all department inputs and submitted for review.",
      timestamp: new Date(Date.now() - 900000),
      user: {
        name: "You",
        avatar: currentUser?.avatar
      }
    },
    {
      id: 2,
      type: "meeting_scheduled",
      title: "Team Standup Scheduled",
      description: "Daily standup meeting scheduled for tomorrow at 9:00 AM with the product development team.",
      timestamp: new Date(Date.now() - 1800000),
      user: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      id: 3,
      type: "document_shared",
      title: "Design System Guidelines Shared",
      description: "New design system guidelines have been shared with the entire product team for implementation.",
      timestamp: new Date(Date.now() - 3600000),
      user: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      id: 4,
      type: "team_joined",
      title: "New Team Member Joined",
      description: "Alex Thompson has joined the Product Development team as a Senior UX Designer.",
      timestamp: new Date(Date.now() - 7200000),
      user: {
        name: "HR Team",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      id: 5,
      type: "project_updated",
      title: "Mobile App Project Milestone",
      description: "Mobile application project has reached 75% completion with successful user testing results.",
      timestamp: new Date(Date.now() - 10800000),
      user: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    }
  ]);

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: "Product Strategy Meeting",
      description: "Quarterly product roadmap review and planning session",
      date: new Date(Date.now() + 3600000),
      type: "meeting",
      location: "Conference Room A",
      attendees: [
        { name: "Sarah Johnson" },
        { name: "Michael Chen" },
        { name: "Emma Rodriguez" },
        { name: "David Kim" },
        { name: "Lisa Wang" }
      ]
    },
    {
      id: 2,
      title: "Project Deadline: Mobile App",
      description: "Final submission deadline for mobile application beta version",
      date: new Date(Date.now() + 86400000),
      type: "deadline",
      location: "Development Team"
    },
    {
      id: 3,
      title: "Company All-Hands Meeting",
      description: "Monthly company-wide meeting with leadership updates",
      date: new Date(Date.now() + 172800000),
      type: "event",
      location: "Main Auditorium",
      attendees: [
        { name: "All Employees" }
      ]
    },
    {
      id: 4,
      title: "Performance Review Reminder",
      description: "Complete quarterly performance review self-assessment",
      date: new Date(Date.now() + 259200000),
      type: "reminder",
      location: "HR Portal"
    }
  ]);

  const [weatherData] = useState({
    location: "San Francisco, CA",
    temperature: 72,
    condition: "partly_cloudy",
    condition_text: "Partly Cloudy",
    feels_like: 75,
    humidity: 65,
    wind_speed: 8,
    visibility: 10
  });

  const [companyAnnouncements] = useState([
    {
      id: 1,
      title: "Q4 Company Performance & Holiday Celebration",
      content: `We're thrilled to announce that Employee Hub has exceeded all Q4 targets, achieving 127% of our revenue goals and expanding our team by 40%. This incredible success is a testament to each team member's dedication and hard work.\n\nTo celebrate these achievements, we're hosting our annual holiday party on December 15th at the Grand Ballroom. Join us for an evening of recognition, great food, and team bonding. More details to follow!`,
      author: {
        name: "Jennifer Martinez",
        title: "CEO & Founder",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
      },
      date: new Date(Date.now() - 86400000),
      priority: "high",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=300&fit=crop",
      views: 1247,
      comments: 89
    },
    {
      id: 2,
      title: "New Employee Benefits Package Launch",
      content: `Starting January 1st, 2025, we're launching an enhanced benefits package that includes improved health coverage, mental wellness support, professional development stipends, and flexible work arrangements.\n\nKey highlights include 100% premium coverage for employees, $2,000 annual learning budget, and expanded parental leave policies. HR will be hosting information sessions next week.`,
      author: {
        name: "Robert Chen",
        title: "Head of People Operations",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      date: new Date(Date.now() - 172800000),
      priority: "medium",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=300&fit=crop",
      views: 892,
      comments: 45
    },
    {
      id: 3,
      title: "Office Renovation & Hybrid Work Updates",
      content: `Our office renovation project is progressing beautifully! The new collaborative spaces, wellness rooms, and upgraded technology infrastructure will be ready by February 2025.\n\nDuring the renovation period, we're maintaining our hybrid work policy with enhanced remote collaboration tools. The temporary workspace on the 5th floor is available for those who prefer in-office work.`,
      author: {
        name: "Amanda Foster",
        title: "Operations Director",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      date: new Date(Date.now() - 259200000),
      priority: "low",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop",
      views: 654,
      comments: 23
    }
  ]);

  const [shortcuts] = useState([
    {
      id: 1,
      title: "My Profile",
      description: "Update info",
      icon: "User",
      path: "/my-profile",
      color: "blue"
    },
    {
      id: 2,
      title: "Team Directory",
      description: "Find colleagues",
      icon: "Users",
      path: "/team-directory",
      color: "green"
    },
    {
      id: 3,
      title: "Company Hub",
      description: "News & updates",
      icon: "Building2",
      path: "/company-hub",
      color: "purple"
    },
    {
      id: 4,
      title: "Time Tracking",
      description: "Log hours",
      icon: "Clock",
      path: "/time-tracking",
      color: "orange"
    },
    {
      id: 5,
      title: "Payroll",
      description: "View payslips",
      icon: "DollarSign",
      path: "/payroll",
      color: "red",
      badge: "New"
    },
    {
      id: 6,
      title: "Benefits",
      description: "Health & perks",
      icon: "Heart",
      path: "/benefits",
      color: "indigo"
    },
    {
      id: 7,
      title: "Learning",
      description: "Courses & training",
      icon: "BookOpen",
      path: "/learning",
      color: "pink"
    },
    {
      id: 8,
      title: "Feedback",
      description: "Give feedback",
      icon: "MessageCircle",
      path: "/feedback",
      color: "teal"
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard - Employee Hub</title>
        <meta name="description" content="Your personalized Employee Hub dashboard with quick actions, recent activity, and important updates." />
      </Helmet>
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <WelcomeHeader user={currentUser} />
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-8">
            <QuickStatsGrid stats={dashboardStats} />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Quick Actions & Shortcuts */}
            <div className="lg:col-span-1 space-y-8">
              <QuickActionsPanel actions={quickActions} />
              <ShortcutTiles shortcuts={shortcuts} />
            </div>

            {/* Middle Column - Activity Feed & Weather */}
            <div className="lg:col-span-1 space-y-8">
              <RecentActivityFeed activities={recentActivities} />
              <WeatherWidget weather={weatherData} />
            </div>

            {/* Right Column - Events & Announcements */}
            <div className="lg:col-span-1 space-y-8">
              <UpcomingEventsWidget events={upcomingEvents} />
            </div>
          </div>

          {/* Company Announcements - Full Width */}
          <div className="mb-8">
            <CompanyAnnouncementsCarousel announcements={companyAnnouncements} />
          </div>

          {/* Footer Info */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-sm text-muted-foreground">
              Welcome to Employee Hub - Your digital workplace that actually works for you
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {new Date()?.toLocaleString()} | Version 2.1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

