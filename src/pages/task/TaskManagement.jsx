import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import fakeApi from '../../services/fakeApi';
import { getRole, getUserInfo, isAdmin, isManager } from '../../utils/auth';

const TaskManagement = () => {
  // Get current user info and role
  const currentRole = getRole();
  const userInfo = getUserInfo();
  const userDepartment = userInfo?.department || null;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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

  // Filter assignees based on role and department
  // Admin: can see all employees
  // Manager: can only see employees in their department
  const filteredAssignees = useMemo(() => {
    if (isAdmin()) {
      return assignees; // Admin sees all
    } else if (isManager() && userDepartment) {
      return assignees.filter(assignee => assignee.department === userDepartment);
    }
    return assignees;
  }, [assignees, userDepartment]);

  // Filter tasks based on role and department
  // Admin: can see all tasks
  // Manager: can only see tasks assigned to their department members
  const filteredTasks = useMemo(() => {
    if (isAdmin()) {
      return tasks; // Admin sees all
    } else if (isManager() && userDepartment) {
      return tasks.filter(task => {
        // Check if task assignee is in manager's department
        const assignee = assignees.find(a => a.id === task.assigneeId);
        return assignee && assignee.department === userDepartment;
      });
    }
    return tasks;
  }, [tasks, assignees, userDepartment]);

  // Filter timeline events based on role and department
  // Admin: can see all events
  // Manager: can only see events assigned to their department members
  const filteredTimelineEvents = useMemo(() => {
    if (!timelineData?.events) return [];

    if (isAdmin()) {
      return timelineData.events; // Admin sees all
    } else if (isManager() && userDepartment) {
      return timelineData.events.filter(event => {
        const assignee = assignees.find(a => a.id === event.assigneeId);
        return assignee && assignee.department === userDepartment;
      });
    }
    return timelineData.events;
  }, [timelineData, assignees, userDepartment]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fakeApi.getTaskNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

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

  useEffect(() => {
    loadTasks();
    loadAssignees();
    loadNotifications();
    loadTimelineData();
    loadAnalyticsData();
  }, [loadTasks, loadAssignees, loadNotifications, loadTimelineData, loadAnalyticsData]);

  useEffect(() => {
    // Reload timeline when month/year changes
    loadTimelineData();
  }, [currentMonth, currentYear, loadTimelineData]);

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
      const assignee = filteredAssignees.find(a => a.id === parseInt(newEvent.assigneeId));
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
      const assignee = filteredAssignees.find(a => a.id === parseInt(newTask.assigneeId));
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-indigo-100 px-6 py-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Quản lý Công việc
                  </h1>
                  {isManager() && userDepartment && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                      Phòng {userDepartment}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {isManager() && userDepartment
                    ? `Quản lý công việc cho phòng ${userDepartment}`
                    : 'Tổ chức và theo dõi công việc hiệu quả'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm công việc</span>
            </button>
          </div>

          {/* Role Info Banner */}
          {isManager() && userDepartment && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  Bạn chỉ có thể giao và xem các công việc của nhân viên trong phòng <strong>{userDepartment}</strong>.
                  {isAdmin() ? ' Admin có thể xem tất cả.' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-indigo-100">
              {[
                { id: 'list', name: '📋 Danh sách' },
                { id: 'timeline', name: '📅 Lịch trình' },
                { id: 'calculate', name: '📊 Tính toán' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl relative transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 z-50">
                  <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="font-bold text-gray-800">🔔 Thông báo</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
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

            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 w-64"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-200"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="new">Mới</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="complete">Hoàn thành</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Độ ưu tiên</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-200"
                  >
                    <option value="all">Tất cả độ ưu tiên</option>
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>

                {/* Stats Summary */}
                <div className="flex items-center justify-center gap-4 md:col-span-1">
                  <div className="text-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{filteredTasks.length}</p>
                    <p className="text-xs text-gray-600">Tổng công việc</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-2xl font-bold text-green-600">
                      {filteredTasks.filter(t => t.status === 'complete').length}
                    </p>
                    <p className="text-xs text-gray-600">Hoàn thành</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Công việc
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Người thực hiện
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Độ ưu tiên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thời hạn
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks
                      .filter(task => {
                        const matchesSearch = searchTerm === '' ||
                          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
                        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
                        return matchesSearch && matchesStatus && matchesPriority;
                      })
                      .map((task) => {
                        const assignee = assignees.find(a => a.id === task.assigneeId);

                        const statusConfig = {
                          'new': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Mới' },
                          'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Đang thực hiện' },
                          'pending': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Chờ xử lý' },
                          'complete': { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' }
                        };

                        const priorityConfig = {
                          'low': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Thấp' },
                          'medium': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trung bình' },
                          'high': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cao' }
                        };

                        return (
                          <tr key={task.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                                {task.description && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                  {assignee?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{assignee?.name || 'Chưa gán'}</p>
                                  <p className="text-xs text-gray-500">{assignee?.department}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[task.status]?.bg} ${statusConfig[task.status]?.text}`}>
                                {statusConfig[task.status]?.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority]?.bg} ${priorityConfig[task.priority]?.text}`}>
                                {priorityConfig[task.priority]?.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {task.endDate ? new Date(task.endDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowTaskDetails(true);
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                  title="Xem chi tiết"
                                >
                                  Xem
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setNewTask(task);
                                    setShowEditTask(true);
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Bạn có chắc muốn xóa công việc "${task.title}"?`)) {
                                      try {
                                        await fakeApi.deleteTask(task.id);
                                        setTasks(prev => prev.filter(t => t.id !== task.id));
                                      } catch (error) {
                                        console.error('Error deleting task:', error);
                                      }
                                    }
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Xóa"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                {filteredTasks.filter(task => {
                  const matchesSearch = searchTerm === '' ||
                    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.description?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
                  const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
                  return matchesSearch && matchesStatus && matchesPriority;
                }).length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-lg font-medium">Không tìm thấy công việc nào</p>
                    <p className="mt-2 text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
            {/* Timeline Header */}
            <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {new Date(currentYear, currentMonth - 1).toLocaleString('vi-VN', { month: 'long' })} {currentYear}
                  </h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-white rounded-xl p-1.5 shadow-md border border-indigo-100">
                    <button
                      onClick={() => setSelectedView('month')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        selectedView === 'month' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Tháng
                    </button>
                    <button
                      onClick={() => setSelectedView('week')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        selectedView === 'week' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Tuần
                    </button>
                    <button
                      onClick={() => setSelectedView('day')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        selectedView === 'day' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Ngày
                    </button>
                  </div>
                  <button
                    onClick={goToToday}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Hôm nay
                  </button>
                </div>
              </div>
            </div>

            {/* Draggable Events Sidebar */}
            <div className="flex">
              <div className="w-80 bg-gradient-to-br from-indigo-50 to-purple-50 border-r border-indigo-100 p-6">
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold mb-6 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Thêm sự kiện</span>
                </button>

                <h3 className="text-gray-800 font-bold mb-4 text-lg">🎯 Kéo thả sự kiện</h3>

                {/* Event Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lọc sự kiện</label>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-indigo-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-200"
                  >
                    <option value="all">Tất cả sự kiện ({filteredTimelineEvents.length})</option>
                    <option value="development">Phát triển ({filteredTimelineEvents.filter(e => e.type === 'development').length})</option>
                    <option value="design">Thiết kế ({filteredTimelineEvents.filter(e => e.type === 'design').length})</option>
                    <option value="meeting">Họp ({filteredTimelineEvents.filter(e => e.type === 'meeting').length})</option>
                    <option value="review">Đánh giá ({filteredTimelineEvents.filter(e => e.type === 'review').length})</option>
                    <option value="training">Đào tạo ({filteredTimelineEvents.filter(e => e.type === 'training').length})</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: 'Phát triển', type: 'development', color: '#3B82F6', icon: '💻' },
                    { name: 'Thiết kế', type: 'design', color: '#10B981', icon: '🎨' },
                    { name: 'Họp', type: 'meeting', color: '#8B5CF6', icon: '👥' },
                    { name: 'Đánh giá', type: 'review', color: '#F59E0B', icon: '📋' },
                    { name: 'Đào tạo', type: 'training', color: '#EF4444', icon: '🎓' }
                  ].map((event, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event.type)}
                      className="flex items-center space-x-3 p-3.5 rounded-xl bg-white hover:shadow-md border-2 border-indigo-100 hover:border-blue-300 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-105"
                    >
                      <div
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: event.color }}
                      ></div>
                      <span className="text-sm text-gray-800 font-semibold">{event.icon} {event.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-bold text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(currentYear, currentMonth - 1, i - 6);
                    const day = date.getDate();
                    const month = date.getMonth();
                    const isCurrentMonth = month === currentMonth - 1;
                    const isToday = date.toDateString() === new Date().toDateString();

                    // Find events for this date (already filtered by department via filteredTimelineEvents)
                    const dayEvents = filteredTimelineEvents.filter(event => {
                      const eventStart = new Date(event.startDate);
                      const eventEnd = new Date(event.endDate);
                      const isInDateRange = date >= eventStart && date <= eventEnd;
                      const matchesFilter = eventFilter === 'all' || event.type === eventFilter;
                      return isInDateRange && matchesFilter;
                    });

                    return (
                      <div
                        key={i}
                        className={`min-h-24 p-2 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          isCurrentMonth ? 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300' : 'bg-gray-50 border-gray-100'
                        } ${isToday ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 ring-2 ring-blue-400 shadow-lg' : ''}`}
                        onDrop={(e) => handleDrop(e, date)}
                        onDragOver={handleDragOver}
                        onClick={() => handleDateClick(date)}
                        title={`${date.toLocaleDateString('vi-VN')} - ${dayEvents.length} events`}
                      >
                        <div className={`text-sm font-bold ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'} ${isToday ? 'text-blue-600' : ''}`}>
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
                            <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-lg font-semibold border border-blue-200">
                              +{dayEvents.length - 2} khác
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
                      <p className="text-sm font-medium text-blue-100">Tổng công việc</p>
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
                      <p className="text-sm font-medium text-green-100">Hoàn thành</p>
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
                      <p className="text-sm font-medium text-yellow-100">TG trung bình</p>
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
                      <p className="text-sm font-medium text-purple-100">Hiệu suất</p>
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
                <h3 className="text-xl font-bold text-white mb-2">Tính toán số liệu công việc</h3>
                <p className="text-gray-400 mb-6">Phân tích hiệu suất và thông tin chi tiết cho tất cả công việc</p>
                <button 
                  onClick={calculateMetrics}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Tính toán</span>
                </button>
              </div>
            </div>

            {/* Employee Performance */}
            {analyticsData && (
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Hiệu suất nhân viên</h3>
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
                            <p className="text-sm text-gray-400">{employee.tasksCompleted} công việc hoàn thành</p>
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
              <h2 className="text-xl font-semibold text-white">Thêm sự kiện mới</h2>
              <button 
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề sự kiện *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  placeholder="Nhập tiêu đề sự kiện"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loại sự kiện</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="development">Phát triển</option>
                  <option value="design">Thiết kế</option>
                  <option value="meeting">Họp</option>
                  <option value="review">Đánh giá</option>
                  <option value="training">Đào tạo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Người thực hiện</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={newEvent.assigneeId}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, assigneeId: e.target.value }))}
                >
                  <option value="">Chọn người thực hiện</option>
                  {filteredAssignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>{assignee.name} - {assignee.department}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical text-white placeholder-gray-400"
                  placeholder="Nhập mô tả sự kiện"
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
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Đang tạo...' : 'Tạo sự kiện'}
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
              <h2 className="text-xl font-semibold text-white">Thêm công việc mới</h2>
              <button 
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề công việc *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  placeholder="Nhập tiêu đề công việc"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical text-white placeholder-gray-400"
                  placeholder="Nhập mô tả công việc"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trạng thái</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="new">Mới</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="complete">Hoàn thành</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ưu tiên</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Người thực hiện</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                >
                  <option value="">Chọn người thực hiện</option>
                  {filteredAssignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>{assignee.name} - {assignee.department}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ngày kết thúc</label>
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
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Đang tạo...' : 'Tạo công việc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết Công việc</h2>
              <button
                onClick={() => setShowTaskDetails(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề</label>
                <p className="text-gray-900 font-medium">{selectedTask.title}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <p className="text-gray-700">{selectedTask.description || 'Không có mô tả'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTask.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    selectedTask.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                    selectedTask.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedTask.status === 'new' ? 'Mới' :
                     selectedTask.status === 'in-progress' ? 'Đang thực hiện' :
                     selectedTask.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Độ ưu tiên</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTask.priority === 'low' ? 'bg-gray-100 text-gray-700' :
                    selectedTask.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedTask.priority === 'low' ? 'Thấp' :
                     selectedTask.priority === 'medium' ? 'Trung bình' : 'Cao'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Người thực hiện</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const assignee = assignees.find(a => a.id === selectedTask.assigneeId);
                    return assignee ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {assignee.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignee.name}</p>
                          <p className="text-xs text-gray-500">{assignee.department}</p>
                        </div>
                      </>
                    ) : <p className="text-gray-500">Chưa gán</p>;
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu</label>
                  <p className="text-gray-900">{selectedTask.startDate ? new Date(selectedTask.startDate).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày kết thúc</label>
                  <p className="text-gray-900">{selectedTask.endDate ? new Date(selectedTask.endDate).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTaskDetails(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa Công việc</h2>
              <button
                onClick={() => {
                  setShowEditTask(false);
                  setNewTask({
                    title: '',
                    description: '',
                    status: 'new',
                    priority: 'medium',
                    assigneeId: '',
                    startDate: '',
                    endDate: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await fakeApi.updateTask(selectedTask.id, newTask);
                setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...newTask } : t));
                setShowEditTask(false);
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
                console.error('Error updating task:', error);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề công việc"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Nhập mô tả công việc"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  <select
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="new">Mới</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="complete">Hoàn thành</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Độ ưu tiên</label>
                  <select
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Người thực hiện</label>
                <select
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                >
                  <option value="">Chọn người thực hiện</option>
                  {filteredAssignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>{assignee.name} - {assignee.department}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTask.endDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTask(false);
                    setNewTask({
                      title: '',
                      description: '',
                      status: 'new',
                      priority: 'medium',
                      assigneeId: '',
                      startDate: '',
                      endDate: ''
                    });
                  }}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors font-semibold"
                >
                  Cập nhật
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
