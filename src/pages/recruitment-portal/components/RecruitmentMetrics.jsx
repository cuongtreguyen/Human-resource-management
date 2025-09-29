import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  Calendar,
  Target,
  UserCheck,
  Briefcase
} from 'lucide-react';
import Icon from '../../../components/AppIcon';


const RecruitmentMetrics = ({ jobs, candidates, interviews }) => {
  // Calculate metrics from fake data
  const metrics = {
    totalJobs: jobs?.length,
    activeJobs: jobs?.filter(job => job?.status === 'Active')?.length,
    totalCandidates: candidates?.length,
    interviewsScheduled: interviews?.filter(i => i?.status === 'Scheduled')?.length,
    candidatesHired: candidates?.filter(c => c?.stage === 'Hired')?.length,
    avgTimeToHire: 18, // fake data
    sourceEffectiveness: 85, // fake data
    diversityScore: 72 // fake data
  };

  // Stage distribution for pipeline chart
  const stageDistribution = [
    { stage: 'Applied', count: candidates?.filter(c => c?.stage === 'Applied')?.length, color: 'bg-blue-500' },
    { stage: 'Screening', count: candidates?.filter(c => c?.stage === 'Screening')?.length, color: 'bg-yellow-500' },
    { stage: 'Interview', count: candidates?.filter(c => c?.stage === 'Interview')?.length, color: 'bg-purple-500' },
    { stage: 'Offer', count: candidates?.filter(c => c?.stage === 'Offer')?.length, color: 'bg-green-500' },
    { stage: 'Hired', count: candidates?.filter(c => c?.stage === 'Hired')?.length, color: 'bg-emerald-500' }
  ];

  const maxCount = Math.max(...stageDistribution?.map(s => s?.count));

  const MetricCard = ({ title, value, icon: IconComponent, change, changeType = 'positive' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <IconComponent className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Active Job Postings"
          value={metrics?.activeJobs}
          icon={Briefcase}
          change="+12% from last month"
        />
        <MetricCard 
          title="Total Candidates"
          value={metrics?.totalCandidates}
          icon={Users}
          change="+25% from last month"
        />
        <MetricCard 
          title="Interviews Scheduled"
          value={metrics?.interviewsScheduled}
          icon={Calendar}
          change="+8% from last week"
        />
        <MetricCard 
          title="Candidates Hired"
          value={metrics?.candidatesHired}
          icon={UserCheck}
          change="+3 this month"
        />
      </div>
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Average Time to Hire</h3>
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{metrics?.avgTimeToHire} days</div>
          <p className="text-sm text-gray-600">Industry average: 23 days</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${100 - (metrics?.avgTimeToHire / 30) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Source Effectiveness</h3>
            <Target className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{metrics?.sourceEffectiveness}%</div>
          <p className="text-sm text-gray-600">Quality candidates ratio</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>LinkedIn</span>
              <span>45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Referrals</span>
              <span>30%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Job Boards</span>
              <span>25%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Diversity Score</h3>
            <CheckCircle className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{metrics?.diversityScore}%</div>
          <p className="text-sm text-gray-600">Inclusive hiring progress</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${metrics?.diversityScore}%` }}
            ></div>
          </div>
        </motion.div>
      </div>
      {/* Recruitment Pipeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruitment Pipeline</h3>
        
        <div className="space-y-4">
          {stageDistribution?.map((stage, index) => (
            <div key={stage?.stage} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-700">
                {stage?.stage}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className={`${stage?.color} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${maxCount > 0 ? (stage?.count / maxCount) * 100 : 0}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {stage?.count}
                  </span>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-600">
                {stage?.count}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Pipeline Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Conversion Rate (Applied �?Hired): </span>
              <span className="font-medium">
                {metrics?.totalCandidates > 0 
                  ? Math.round((metrics?.candidatesHired / metrics?.totalCandidates) * 100) 
                  : 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Interview Rate: </span>
              <span className="font-medium">
                {candidates?.filter(c => c?.stage === 'Applied')?.length > 0
                  ? Math.round((candidates?.filter(c => c?.stage === 'Interview')?.length / candidates?.filter(c => c?.stage === 'Applied')?.length) * 100)
                  : 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Offer Acceptance: </span>
              <span className="font-medium text-green-600">87%</span>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recruitment Activity</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 rounded-full p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New candidate applied</p>
              <p className="text-xs text-gray-600">Nguyen Van A applied for Senior Frontend Developer</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Interview completed</p>
              <p className="text-xs text-gray-600">Le Van C completed HR Business Partner interview</p>
            </div>
            <span className="text-xs text-gray-500">5 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="bg-purple-100 rounded-full p-2">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Interview scheduled</p>
              <p className="text-xs text-gray-600">Tran Thi B - Technical interview tomorrow at 10:00</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecruitmentMetrics;

