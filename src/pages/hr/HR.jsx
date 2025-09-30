import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HR = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      icon: 'Users',
      label: 'Total Employees',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      color: 'blue'
    },
    {
      icon: 'UserPlus',
      label: 'New Hires (This Month)',
      value: '18',
      change: '+5',
      changeType: 'positive',
      color: 'green'
    },
    {
      icon: 'UserMinus',
      label: 'Pending Resignations',
      value: '3',
      change: '-2',
      changeType: 'negative',
      color: 'orange'
    },
    {
      icon: 'FileText',
      label: 'Pending Documents',
      value: '24',
      change: '+8',
      changeType: 'neutral',
      color: 'purple'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'new_hire',
      employee: 'Sarah Johnson',
      department: 'Engineering',
      date: '2 hours ago',
      icon: 'UserPlus'
    },
    {
      id: 2,
      type: 'document',
      employee: 'Michael Chen',
      action: 'Submitted leave application',
      date: '5 hours ago',
      icon: 'FileText'
    },
    {
      id: 3,
      type: 'resignation',
      employee: 'David Wilson',
      action: 'Resignation notice received',
      date: '1 day ago',
      icon: 'UserMinus'
    },
    {
      id: 4,
      type: 'training',
      employee: 'Emma Davis',
      action: 'Completed HR compliance training',
      date: '2 days ago',
      icon: 'Award'
    }
  ];

  const pendingTasks = [
    { id: 1, task: 'Review onboarding documents for Sarah Johnson', priority: 'high', dueDate: 'Today' },
    { id: 2, task: 'Process leave application for Michael Chen', priority: 'medium', dueDate: 'Tomorrow' },
    { id: 3, task: 'Schedule exit interview with David Wilson', priority: 'high', dueDate: 'This week' },
    { id: 4, task: 'Update employee handbook', priority: 'low', dueDate: 'Next week' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-orange-600 bg-orange-50',
      low: 'text-blue-600 bg-blue-50'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your workforce effectively</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Icon name="Download" size={18} />
                <span>Export Report</span>
              </Button>
              <Button variant="default" className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent">
                <Icon name="UserPlus" size={18} />
                <span>Add Employee</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon name={stat.icon} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Icon name={activity.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.employee}</p>
                    <p className="text-sm text-gray-600">{activity.action || `New hire in ${activity.department}`}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pending Tasks</h2>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-900 flex-1">{task.task}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center">
              <Icon name="UserPlus" size={24} className="mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium text-gray-700">Add Employee</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center">
              <Icon name="FileText" size={24} className="mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium text-gray-700">Generate Report</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center">
              <Icon name="Calendar" size={24} className="mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium text-gray-700">Schedule Interview</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center">
              <Icon name="Mail" size={24} className="mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium text-gray-700">Send Announcement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HR;