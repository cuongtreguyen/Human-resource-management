import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, FileText, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import JobManagement from './components/JobManagement';
import CandidatePipeline from './components/CandidatePipeline';
import InterviewScheduler from './components/InterviewScheduler';
import RecruitmentMetrics from './components/RecruitmentMetrics';
import CommunicationHub from './components/CommunicationHub';

// Mock API Functions - Easy to understand fake data and operations
const mockAPI = {
  // Jobs fake data
  jobs: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Ho Chi Minh City',
      type: 'Full-time',
      status: 'Active',
      applicants: 45,
      postedDate: '2025-01-15',
      salary: '$80,000 - $120,000',
      description: 'Build amazing user interfaces with React and modern technologies'
    },
    {
      id: 2,
      title: 'HR Business Partner',
      department: 'Human Resources',
      location: 'Ha Noi',
      type: 'Full-time',
      status: 'Active',
      applicants: 28,
      postedDate: '2025-01-10',
      salary: '$60,000 - $90,000',
      description: 'Strategic HR partner to support business growth and employee development'
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      status: 'Draft',
      applicants: 0,
      postedDate: '2025-01-20',
      salary: '$90,000 - $130,000',
      description: 'Lead product strategy and roadmap for our core platforms'
    }
  ],

  // Candidates fake data
  candidates: [
    {
      id: 1,
      name: 'Nguyen Van A',
      email: 'nguyenvana@email.com',
      phone: '+84 901 234 567',
      position: 'Senior Frontend Developer',
      stage: 'Applied',
      score: 85,
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Node.js'],
      resumeUrl: '/fake-resume-1.pdf',
      appliedDate: '2025-01-16'
    },
    {
      id: 2,
      name: 'Tran Thi B',
      email: 'tranthib@email.com',
      phone: '+84 902 345 678',
      position: 'Senior Frontend Developer',
      stage: 'Screening',
      score: 92,
      experience: '7 years',
      skills: ['React', 'Vue.js', 'AWS'],
      resumeUrl: '/fake-resume-2.pdf',
      appliedDate: '2025-01-14'
    },
    {
      id: 3,
      name: 'Le Van C',
      email: 'levanc@email.com',
      phone: '+84 903 456 789',
      position: 'HR Business Partner',
      stage: 'Interview',
      score: 88,
      experience: '4 years',
      skills: ['HR Strategy', 'Leadership', 'Analytics'],
      resumeUrl: '/fake-resume-3.pdf',
      appliedDate: '2025-01-12'
    }
  ],

  // Interviews fake data
  interviews: [
    {
      id: 1,
      candidateName: 'Tran Thi B',
      position: 'Senior Frontend Developer',
      interviewer: 'Tech Lead - Pham Van D',
      date: '2025-01-25',
      time: '10:00',
      type: 'Technical',
      status: 'Scheduled',
      meetingLink: 'https://meet.google.com/fake-link-1'
    },
    {
      id: 2,
      candidateName: 'Le Van C',
      position: 'HR Business Partner',
      interviewer: 'HR Director - Hoang Thi E',
      date: '2025-01-26',
      time: '14:30',
      type: 'Behavioral',
      status: 'Scheduled',
      meetingLink: 'https://meet.google.com/fake-link-2'
    }
  ],

  // Fake API methods
  async getJobs() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.jobs;
  },

  async getCandidates() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.candidates;
  },

  async getInterviews() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.interviews;
  },

  async createJob(jobData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newJob = {
      id: this.jobs?.length + 1,
      ...jobData,
      applicants: 0,
      postedDate: new Date()?.toISOString()?.split('T')?.[0]
    };
    this.jobs?.push(newJob);
    return newJob;
  },

  async updateCandidateStage(candidateId, newStage) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const candidate = this.candidates?.find(c => c?.id === candidateId);
    if (candidate) {
      candidate.stage = newStage;
    }
    return candidate;
  }
};

const RecruitmentPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load fake data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsData, candidatesData, interviewsData] = await Promise.all([
          mockAPI?.getJobs(),
          mockAPI?.getCandidates(),
          mockAPI?.getInterviews()
        ]);
        
        setJobs(jobsData);
        setCandidates(candidatesData);
        setInterviews(interviewsData);
      } catch (error) {
        console.log('Demo: Fake API error handled gracefully');
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'jobs', label: 'Job Management', icon: FileText },
    { id: 'candidates', label: 'Candidate Pipeline', icon: Users },
    { id: 'interviews', label: 'Interview Scheduler', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: MessageSquare }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recruitment data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <RecruitmentMetrics jobs={jobs} candidates={candidates} interviews={interviews} />;
      case 'jobs':
        return <JobManagement jobs={jobs} setJobs={setJobs} mockAPI={mockAPI} />;
      case 'candidates':
        return <CandidatePipeline candidates={candidates} setCandidates={setCandidates} mockAPI={mockAPI} />;
      case 'interviews':
        return <InterviewScheduler interviews={interviews} candidates={candidates} />;
      case 'communication':
        return <CommunicationHub candidates={candidates} />;
      default:
        return <RecruitmentMetrics jobs={jobs} candidates={candidates} interviews={interviews} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recruitment Portal</h1>
                <p className="text-sm text-gray-500">Advanced Applicant Tracking System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Job</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabConfig?.map((tab) => {
              const IconComponent = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab?.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RecruitmentPortal;

