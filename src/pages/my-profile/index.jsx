import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoCard from './components/PersonalInfoCard';
import SkillsCard from './components/SkillsCard';
import WorkHistoryCard from './components/WorkHistoryCard';
import GoalsCard from './components/GoalsCard';
import PrivacySettingsCard from './components/PrivacySettingsCard';
import SocialLinksCard from './components/SocialLinksCard';

const MyProfile = () => {
  // Mock user data
  const [user, setUser] = useState({
    id: 1,
    name: "Nguyễn Văn Cương",
    position: "Senior Product Manager",
    department: "Product Development",
    email: "sarah.johnson@employeehub.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    birthday: "1990-03-15",
    emergencyContact: "Michael Johnson",
    emergencyPhone: "+1 (555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    stats: {
      yearsAtCompany: 3,
      projectsCompleted: 24,
      teamSize: 8,
      skillsCount: 12
    }
  });

  // Mock skills data
  const [skills, setSkills] = useState([
    { id: 1, name: "Product Strategy", level: "Expert", verified: true },
    { id: 2, name: "User Experience Design", level: "Advanced", verified: true },
    { id: 3, name: "Data Analysis", level: "Advanced", verified: false },
    { id: 4, name: "Agile Methodology", level: "Expert", verified: true },
    { id: 5, name: "Market Research", level: "Intermediate", verified: false },
    { id: 6, name: "Team Leadership", level: "Advanced", verified: true },
    { id: 7, name: "Stakeholder Management", level: "Expert", verified: true },
    { id: 8, name: "Product Analytics", level: "Intermediate", verified: false }
  ]);

  // Mock work history data
  const workHistory = [
    {
      id: 1,
      position: "Senior Product Manager",
      company: "Employee Hub",
      location: "San Francisco, CA",
      startDate: "2022-01-15",
      endDate: null,
      current: true,
      description: `Leading product strategy and development for Employee Hub's core platform. Responsible for defining product roadmap, managing cross-functional teams, and driving user experience improvements that have resulted in 40% increase in user engagement.`,
      achievements: [
        "Launched 3 major product features that increased user retention by 35%",
        "Led a team of 8 engineers and designers to deliver projects on time",
        "Implemented data-driven decision making process that improved feature adoption by 50%",
        "Established user feedback loop that reduced customer complaints by 60%"
      ],
      skills: ["Product Strategy", "Team Leadership", "Data Analysis", "User Experience", "Agile"]
    },
    {
      id: 2,
      position: "Product Manager",
      company: "TechStart Solutions",
      location: "Austin, TX",
      startDate: "2020-03-01",
      endDate: "2021-12-31",
      current: false,
      description: `Managed product development lifecycle for B2B SaaS platform serving 10,000+ users. Collaborated with engineering, design, and marketing teams to deliver customer-centric solutions.`,
      achievements: [
        "Increased monthly active users by 150% through strategic feature development",
        "Reduced customer churn rate from 15% to 8% through improved onboarding",
        "Successfully launched mobile app with 4.8 star rating on app stores"
      ],
      skills: ["Product Management", "Mobile Development", "Customer Success", "Analytics"]
    },
    {
      id: 3,
      position: "Associate Product Manager",
      company: "Digital Innovations Inc",
      location: "Seattle, WA",
      startDate: "2018-06-01",
      endDate: "2020-02-28",
      current: false,
      description: `Started career in product management, focusing on user research and feature specification. Worked closely with senior PMs to understand market needs and translate them into actionable product requirements.`,
      achievements: [
        "Conducted 50+ user interviews that informed major product pivots",
        "Created comprehensive user personas adopted company-wide",
        "Improved feature adoption rates by 25% through better user onboarding"
      ],
      skills: ["User Research", "Market Analysis", "Documentation", "Prototyping"]
    }
  ];

  // Mock goals data
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Complete Product Management Certification",
      description: "Earn advanced certification in product management from Stanford Continuing Studies",
      category: "Learning",
      targetDate: "2024-06-30",
      progress: 65,
      status: "In Progress",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Lead Cross-Functional Team of 15+",
      description: "Expand leadership responsibilities to manage larger, more diverse teams",
      category: "Professional",
      targetDate: "2024-12-31",
      progress: 40,
      status: "In Progress",
      createdAt: "2024-02-01"
    },
    {
      id: 3,
      title: "Launch AI-Powered Feature",
      description: "Successfully deliver and launch the new AI recommendation engine",
      category: "Professional",
      targetDate: "2024-09-15",
      progress: 80,
      status: "In Progress",
      createdAt: "2024-03-01"
    },
    {
      id: 4,
      title: "Improve Work-Life Balance",
      description: "Establish better boundaries and maintain consistent exercise routine",
      category: "Personal",
      targetDate: "2024-12-31",
      progress: 30,
      status: "In Progress",
      createdAt: "2024-01-01"
    }
  ]);

  // Mock privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'team',
    contactInfo: 'team',
    workHistory: 'public',
    emailNotifications: true,
    profileViews: false,
    skillEndorsements: true,
    birthdayReminders: true,
    statusUpdates: true
  });

  // Mock social links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "https://linkedin.com/in/sarahjohnson",
    twitter: "https://twitter.com/sarahj_pm",
    github: "",
    portfolio: "https://sarahjohnson.dev",
    behance: "",
    dribbble: ""
  });

  // Handler functions
  const handlePhotoUpdate = (newPhotoUrl) => {
    setUser(prev => ({ ...prev, avatar: newPhotoUrl }));
  };

  const handlePersonalInfoUpdate = (updatedInfo) => {
    setUser(prev => ({ ...prev, ...updatedInfo }));
  };

  const handleSkillsUpdate = (updatedSkills) => {
    setSkills(updatedSkills);
    setUser(prev => ({ 
      ...prev, 
      stats: { ...prev?.stats, skillsCount: updatedSkills?.length }
    }));
  };

  const handleGoalsUpdate = (updatedGoals) => {
    setGoals(updatedGoals);
  };

  const handlePrivacySettingsUpdate = (updatedSettings) => {
    setPrivacySettings(updatedSettings);
  };

  const handleSocialLinksUpdate = (updatedLinks) => {
    setSocialLinks(updatedLinks);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Profile Header */}
          <div className="mb-8">
            <ProfileHeader 
              user={user} 
              onPhotoUpdate={handlePhotoUpdate}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <PersonalInfoCard 
                user={user} 
                onUpdate={handlePersonalInfoUpdate}
              />

              {/* Work History */}
              <WorkHistoryCard workHistory={workHistory} />

              {/* Goals Tracking */}
              <GoalsCard 
                goals={goals} 
                onGoalsUpdate={handleGoalsUpdate}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Skills & Expertise */}
              <SkillsCard 
                skills={skills} 
                onSkillsUpdate={handleSkillsUpdate}
              />

              {/* Social Links */}
              <SocialLinksCard 
                socialLinks={socialLinks} 
                onLinksUpdate={handleSocialLinksUpdate}
              />

              {/* Privacy Settings */}
              <PrivacySettingsCard 
                privacySettings={privacySettings} 
                onSettingsUpdate={handlePrivacySettingsUpdate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;

