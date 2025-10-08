import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import fakeApi from '../services/fakeApi';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [taskProgress, setTaskProgress] = useState({});
  const [timelineData, setTimelineData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedView, setSelectedView] = useState('month');
  const [eventFilter, setEventFilter] = useState('all');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'new',
    priority: 'medium',
    assigneeId: '',
    startDate: '',
    endDate: ''
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'development',
    startDate: '',
    endDate: '',
    assigneeId: '',
    description: ''
  });

  useEffect(() => {
    loadTasks();
    loadAssignees();
    loadNotifications();
    loadTimelineData();
    loadAnalyticsData();
  }, [loadTasks, loadAssignees, loadNotifications, loadTimelineData, loadAnalyticsData]);

  useEffect(() => {
    // Load progress for each task
    tasks.forEach(task => {
      loadTaskProgress(task.id);
    });
  }, [tasks]);

  useEffect(() => {
    // Reload timeline when month/year changes
    loadTimelineData();
  }, [currentMonth, currentYear, loadTimelineData]);

  const loadTasks = useCallback(async () => {
    try {
      const response = await fakeApi.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  const loadAssignees = useCallback(async () => {
    try {
      const response = await fakeApi.getTaskAssignees();
      setAssignees(response.data);
    } catch (error) {
      console.error('Error loading assignees:', error);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fakeApi.getTaskNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  const loadTaskProgress = async (taskId) => {
    try {
      const response = await fakeApi.getTaskProgress(taskId);
      setTaskProgress(prev => ({
        ...prev,
        [taskId]: response.data
      }));
    } catch (error) {
      console.error('Error loading task progress:', error);
    }
  };

  const loadTimelineData = useCallback(async () => {
    try {
      const response = await fakeApi.getTaskTimeline(currentYear, currentMonth);
      setTimelineData(response.data);
    } catch (error) {
      console.error('Error loading timeline data:', error);
    }
  }, [currentYear, currentMonth]);

  const loadAnalyticsData = useCallback(async () => {
    try {
      const response = await fakeApi.getTaskAnalytics();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }, []);

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
  };

  const calculateMetrics = async () => {
    try {
      const taskIds = tasks.map(task => task.id);
      const response = await fakeApi.calculateTaskMetrics(taskIds);
      alert(`Metrics calculated:\nTotal Hours: ${response.data.totalEstimatedHours}h\nEfficiency: ${response.data.efficiencyScore}%\nOn-time: ${response.data.onTimeCompletion}%`);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const assignee = assignees.find(a => a.id === parseInt(newEvent.assigneeId));
      const eventData = {
        ...newEvent,
        assignee: assignee,
        assigneeId: parseInt(newEvent.assigneeId),
        color: getEventTypeColor(newEvent.type)
      };

      // Add to timeline data
      setTimelineData(prev => ({
        ...prev,
        events: [...prev.events, {
          id: Date.now(),
          ...eventData,
          status: 'scheduled'
        }]
      }));
      
      setShowAddEvent(false);
      setNewEvent({
        title: '',
        type: 'development',
        startDate: '',
        endDate: '',
        assigneeId: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'development': '#3B82F6',
      'design': '#10B981',
      'meeting': '#8B5CF6',
      'review': '#F59E0B',
      'training': '#EF4444'
    };
    return colors[type] || '#6B7280';
  };

  const handleDragStart = (e, eventType) => {
    e.dataTransfer.setData('eventType', eventType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e, date) => {
    e.preventDefault();
    const eventType = e.dataTransfer.getData('eventType');
    if (eventType) {
      setNewEvent(prev => ({
        ...prev,
        type: eventType,
        startDate: date.toISOString().split('T')[0],
        endDate: date.toISOString().split('T')[0]
      }));
      setShowAddEvent(true);
    }
  };

  const handleDateClick = (date) => {
    setNewEvent(prev => ({
      ...prev,
      startDate: date.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0]
    }));
    setShowAddEvent(true);
  };

  const handleEventClick = (event) => {
    alert(`Event: ${event.title}\nType: ${event.type}\nDate: ${new Date(event.startDate).toLocaleDateString('vi-VN')}\nAssignee: ${event.assignee}`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const assignee = assignees.find(a => a.id === parseInt(newTask.assigneeId));
      const taskData = {
        ...newTask,
        assignee: assignee,
        assigneeId: parseInt(newTask.assigneeId)
      };

      const response = await fakeApi.createTask(taskData);
      setTasks(prev => [...prev, response.data]);
      setShowAddTask(false);
      setNewTask({
        title: '',
        description: '',
        status: 'new',
        priority: 'medium',
        assigneeId: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const _handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await fakeApi.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fakeApi.deleteTask(taskId);
        setTasks(prev => prev.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'border-blue-500';
      case 'in-progress': return 'border-teal-500';
      case 'pending': return 'border-orange-500';
      case 'complete': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tasksByStatus = {
    new: filteredTasks.filter(task => task.status === 'new'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    pending: filteredTasks.filter(task => task.status === 'pending'),
    complete: filteredTasks.filter(task => task.status === 'complete')
  };

  const TaskCard = ({ task }) => {
    const progress = taskProgress[task.id];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setSelectedTask(task)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => handleDeleteTask(task.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
        
        {/* Progress Bar */}
        {progress && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs text-gray-500">{progress.currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.currentProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-gray-500">{task.assignee.name}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        {task.startDate && task.endDate && (
          <div className="mt-2 text-xs text-gray-500">
            <div>Start: {task.startDate}</div>
            <div>End: {task.endDate}</div>
          </div>
        )}
      </div>
    );
  };

  const StatusColumn = ({ status, title, tasks }) => (
    <div className="flex-1 bg-gray-50 rounded-lg p-4">
      <div className={`border-t-4 ${getStatusColor(status)} pt-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowAddTask(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)} draggable>
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Management</h1>
            <p className="text-gray-400 text-sm">Dashboard / Task Management</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Task</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'timeline', name: 'Timeline' },
              { id: 'calculate', name: 'Calculate' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-white relative transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586-2.586a2 2 0 012.828 0L12 6l1.586-1.586a2 2 0 012.828 0L19 7v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                </svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-all duration-200 ${!notification.read ? 'bg-blue-900 bg-opacity-30' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                            <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Task"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="flex space-x-6">
            <StatusColumn 
              status="new" 
              title="New Task" 
              tasks={tasksByStatus.new} 
            />
            <StatusColumn 
              status="in-progress" 
              title="In Progress" 
              tasks={tasksByStatus['in-progress']} 
            />
            <StatusColumn 
              status="pending" 
              title="Pending" 
              tasks={tasksByStatus.pending} 
            />
            <StatusColumn 
              status="complete" 
              title="Complete" 
              tasks={tasksByStatus.complete} 
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700">
            {/* Timeline Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold text-white">
                    {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}
                  </h2>
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button 
                      onClick={() => setSelectedView('month')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedView === 'month' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Month
                    </button>
                    <button 
                      onClick={() => setSelectedView('week')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedView === 'week' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => setSelectedView('day')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedView === 'day' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Day
                    </button>
                  </div>
                  <button 
                    onClick={goToToday}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>

            {/* Draggable Events Sidebar */}
            <div className="flex">
              <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
                <button 
                  onClick={() => setShowAddEvent(true)}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Event</span>
                </button>
                
                <h3 className="text-white font-medium mb-4">Draggable Events</h3>
                
                {/* Event Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter Events</label>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Events ({timelineData?.events.length || 0})</option>
                    <option value="development">Development ({timelineData?.events.filter(e => e.type === 'development').length || 0})</option>
                    <option value="design">Design ({timelineData?.events.filter(e => e.type === 'design').length || 0})</option>
                    <option value="meeting">Meeting ({timelineData?.events.filter(e => e.type === 'meeting').length || 0})</option>
                    <option value="review">Review ({timelineData?.events.filter(e => e.type === 'review').length || 0})</option>
                    <option value="training">Training ({timelineData?.events.filter(e => e.type === 'training').length || 0})</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Development', type: 'development', color: '#3B82F6', icon: '💻' },
                    { name: 'Design', type: 'design', color: '#10B981', icon: '🎨' },
                    { name: 'Meeting', type: 'meeting', color: '#8B5CF6', icon: '👥' },
                    { name: 'Review', type: 'review', color: '#F59E0B', icon: '📋' },
                    { name: 'Training', type: 'training', color: '#EF4444', icon: '🎓' }
                  ].map((event, index) => (
                    <div 
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event.type)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-grab active:cursor-grabbing"
                      style={{ backgroundColor: `${event.color}20` }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: event.color }}
                      ></div>
                      <span className="text-sm text-white">{event.icon} {event.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 p-6">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(currentYear, currentMonth - 1, i - 6);
                    const day = date.getDate();
                    const month = date.getMonth();
                    const isCurrentMonth = month === currentMonth - 1;
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    // Find events for this date
                    const dayEvents = timelineData?.events.filter(event => {
                      const eventStart = new Date(event.startDate);
                      const eventEnd = new Date(event.endDate);
                      const isInDateRange = date >= eventStart && date <= eventEnd;
                      const matchesFilter = eventFilter === 'all' || event.type === eventFilter;
                      return isInDateRange && matchesFilter;
                    }) || [];

                    return (
                      <div 
                        key={i}
                        className={`min-h-24 p-2 border border-gray-600 rounded-lg cursor-pointer ${
                          isCurrentMonth ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-900'
                        } ${isToday ? 'bg-blue-900 border-blue-500 ring-2 ring-blue-500' : ''} transition-all duration-200`}
                        onDrop={(e) => handleDrop(e, date)}
                        onDragOver={handleDragOver}
                        onClick={() => handleDateClick(date)}
                        title={`${date.toLocaleDateString('vi-VN')} - ${dayEvents.length} events`}
                      >
                        <div className={`text-sm font-medium ${isCurrentMonth ? 'text-white' : 'text-gray-500'}`}>
                          {day}
                        </div>
                        <div className="space-y-1 mt-2">
                          {dayEvents.slice(0, 2).map(event => (
                            <div 
                              key={event.id}
                              className="text-xs p-1 rounded text-white truncate shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: event.color }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                              title={`${event.title} - ${event.type} - ${event.assignee}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculate' && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg border border-blue-500 p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-100">Total Tasks</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.totalTasks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg border border-green-500 p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-100">Completed</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.completedTasks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl shadow-lg border border-yellow-500 p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-100">Avg. Time</p>
                      <p className="text-3xl font-bold">{analyticsData.productivity.averageCompletionTime}d</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg border border-purple-500 p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-100">Efficiency</p>
                      <p className="text-3xl font-bold">{analyticsData.productivity.efficiencyScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Calculate Task Metrics</h3>
                <p className="text-gray-400 mb-6">Analyze performance and get insights for all tasks</p>
                <button 
                  onClick={calculateMetrics}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Calculate Metrics</span>
                </button>
              </div>
            </div>

            {/* Employee Performance */}
            {analyticsData && (
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Employee Performance</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.employeePerformance.map((employee, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{employee.name}</h4>
                            <p className="text-sm text-gray-400">{employee.tasksCompleted} tasks completed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${employee.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-white">{employee.score}%</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Avg: {employee.averageTime}d</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Add New Event</h2>
              <button 
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="meeting">Meeting</option>
                  <option value="review">Review</option>
                  <option value="training">Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assignee</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={newEvent.assigneeId}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, assigneeId: e.target.value }))}
                >
                  <option value="">Select assignee</option>
                  {assignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical text-white placeholder-gray-400"
                  placeholder="Enter event description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Add New Task</h2>
              <button 
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Task Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical text-white placeholder-gray-400"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="new">New Task</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assignee</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                >
                  <option value="">Select assignee</option>
                  {assignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.endDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default TaskManagement;
