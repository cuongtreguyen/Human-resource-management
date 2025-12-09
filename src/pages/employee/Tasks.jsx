import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ListTodo, TrendingUp, Calendar, X, Eye, Edit, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import kanbanService from '../../services/kanbanService';
import { getCurrentDepartment, getCurrentEmployeeId } from '../../utils/auth';

const EmployeeTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [taskProgress, setTaskProgress] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showTaskUpdate, setShowTaskUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateNote, setUpdateNote] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Get current employee ID and department
        const currentEmployeeId = getCurrentEmployeeId() || localStorage.getItem('employeeId') || '';
        const currentDepartment = getCurrentDepartment() || '';
        
        // Fetch tasks: filter by assigneeId AND department
        // Employee chỉ thấy tasks của phòng ban mà họ thuộc về
        const filters = { assigneeId: currentEmployeeId };
        if (currentDepartment) {
          filters.department = currentDepartment;
        }
        
        const res = await kanbanService.task.getAll(filters);
        const loadedTasks = res.data || res || [];
        
        // Transform API tasks to match component format
        // API returns: status = "in-progress", "new", "pending", "complete" (lowercase with hyphen)
        const transformedTasks = loadedTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: task.status === 'complete' ? 'complete' : 
                  task.status === 'in-progress' ? 'in-progress' : 
                  task.status === 'pending' ? 'pending' : 
                  task.status === 'new' ? 'new' : task.status,
          priority: task.priority?.toLowerCase() || 'medium',
          startDate: task.startDate,
          endDate: task.endDate || task.deadline,
          assignee: task.assignees?.[0] || null
        }));
        
        setTasks(transformedTasks);
        
        // Load progress for each task
        transformedTasks.forEach(task => {
          kanbanService.task.getProgress(task.id).then(progressRes => {
            const progressData = progressRes.data || progressRes;
            setTaskProgress(prev => ({
              ...prev,
              [task.id]: {
                currentProgress: progressData.currentProgress || 0,
                milestones: progressData.milestones || []
              }
            }));
          }).catch(err => console.error('Error loading task progress:', err));
        });
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Handle task status update
  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    
    try {
      // Map status to API format
      // API expects: "NEW", "IN_PROGRESS", "PENDING", "DONE" (uppercase with underscore)
      const apiStatus = updateStatus === 'complete' ? 'DONE' :
                       updateStatus === 'in-progress' ? 'IN_PROGRESS' :
                       updateStatus === 'pending' ? 'PENDING' : 'NEW';
      
      // Update task status
      await kanbanService.task.update(selectedTask.id, { 
        status: apiStatus
      });
      
      // Update progress if changed
      if (updateProgress !== (taskProgress[selectedTask.id]?.currentProgress || 0)) {
        await kanbanService.task.updateProgress(selectedTask.id, {
          currentProgress: updateProgress,
          comments: updateNote
        });
      }
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: updateStatus }
          : task
      ));
      
      // Update progress
      setTaskProgress(prev => ({
        ...prev,
        [selectedTask.id]: {
          ...prev[selectedTask.id],
          currentProgress: updateProgress
        }
      }));
      
      setShowTaskUpdate(false);
      setSelectedTask(null);
      alert('Cập nhật nhiệm vụ thành công!');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật nhiệm vụ: ' + (error.message || 'Unknown error'));
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  
  const completedCount = tasks.filter(t => t.status === 'complete').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'complete':
        return { icon: CheckCircle, text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
      case 'in-progress':
        return { icon: Clock, text: 'Đang làm', color: 'bg-blue-100 text-blue-700' };
      case 'pending':
        return { icon: AlertCircle, text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' };
      default:
        return { icon: ListTodo, text: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/employee')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Nhiệm vụ của tôi</h1>
            <p className="text-indigo-100">Công việc được giao và tiến độ thực hiện</p>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang thực hiện</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chờ xử lý ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in-progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang làm ({inProgressCount})
            </button>
            <button
              onClick={() => setFilter('complete')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'complete' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoàn thành ({completedCount})
            </button>
          </div>
        </div>

        {/* Danh sách nhiệm vụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!loading && filteredTasks.map(t => {
            const statusInfo = getStatusInfo(t.status);
            const StatusIcon = statusInfo.icon;
            const progress = taskProgress[t.id];
            
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg mb-2">{t.title}</div>
                    <div className="text-sm text-gray-600 leading-relaxed line-clamp-2">{t.description}</div>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color} whitespace-nowrap ml-3`}>
                    <StatusIcon size={14} />
                    {statusInfo.text}
                  </span>
                </div>

                {/* Progress Bar */}
                {progress && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Tiến độ</span>
                      <span className="text-xs font-semibold text-gray-700">{progress.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.currentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${getPriorityColor(t.priority)}`}>
                    <TrendingUp size={14} />
                    Ưu tiên: {t.priority === 'high' ? 'Cao' : t.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </div>
                  {t.startDate && t.endDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={14} />
                      {t.startDate} - {t.endDate}
                    </div>
                  )}
                </div>

                {t.assignee && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    {t.assignee.avatar && (
                      <img
                        src={t.assignee.avatar}
                        alt={t.assignee.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-xs text-gray-500">{t.assignee.name}</span>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTask(t);
                      setShowTaskDetail(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Eye size={16} />
                    Chi tiết
                  </button>
                  {t.status !== 'complete' && (
                    <button
                      onClick={() => {
                        setSelectedTask(t);
                        setUpdateStatus(t.status);
                        setUpdateProgress(progress?.currentProgress || 0);
                        setUpdateNote('');
                        setShowTaskUpdate(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
                    >
                      <Edit size={16} />
                      Cập nhật
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {loading && (
            <div className="col-span-2 py-12 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải...</span>
              </div>
            </div>
          )}
          
          {!loading && filteredTasks.length === 0 && (
            <div className="col-span-2 py-12 text-center text-gray-500">
              Không có nhiệm vụ nào
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">Chi tiết nhiệm vụ</h2>
                <p className="text-purple-100 text-sm">Thông tin đầy đủ về nhiệm vụ</p>
              </div>
              <button
                onClick={() => {
                  setShowTaskDetail(false);
                  setSelectedTask(null);
                }}
                className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Task Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTask.title}</h3>
                <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Trạng thái</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTask.status === 'complete' ? 'bg-green-100 text-green-700' :
                    selectedTask.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    selectedTask.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedTask.status === 'complete' && <CheckCircle size={16} />}
                    {selectedTask.status === 'in-progress' && <Clock size={16} />}
                    {selectedTask.status === 'pending' && <AlertCircle size={16} />}
                    {selectedTask.status === 'new' ? 'Mới' :
                     selectedTask.status === 'in-progress' ? 'Đang làm' :
                     selectedTask.status === 'pending' ? 'Chờ xử lý' :
                     selectedTask.status === 'complete' ? 'Hoàn thành' : selectedTask.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Ưu tiên</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTask.priority === 'high' ? 'bg-red-100 text-red-700' :
                    selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    <TrendingUp size={16} />
                    {selectedTask.priority === 'high' ? 'Cao' :
                     selectedTask.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
              </div>

              {/* Progress */}
              {taskProgress[selectedTask.id] && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Tiến độ</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {taskProgress[selectedTask.id].currentProgress}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress[selectedTask.id].currentProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Assignee */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-3">Người được giao</p>
                <div className="flex items-center gap-3">
                  {selectedTask.assignee?.avatar ? (
                    <img
                      src={selectedTask.assignee.avatar}
                      alt={selectedTask.assignee.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <User size={24} className="text-purple-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedTask.assignee?.name || 'Chưa giao'}</p>
                    <p className="text-sm text-gray-500">{selectedTask.assignee?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              {(selectedTask.startDate || selectedTask.endDate) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-3">Thời gian</p>
                  <div className="space-y-2">
                    {selectedTask.startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-600">Bắt đầu:</span>
                        <span className="font-medium text-gray-900">{selectedTask.startDate}</span>
                      </div>
                    )}
                    {selectedTask.endDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-600">Kết thúc:</span>
                        <span className="font-medium text-gray-900">{selectedTask.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {taskProgress[selectedTask.id]?.milestones && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-3">Các mốc quan trọng</p>
                  <div className="space-y-2">
                    {taskProgress[selectedTask.id].milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {milestone.completed ? <CheckCircle size={14} /> : <span>{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${milestone.completed ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
                            {milestone.name}
                          </p>
                          {milestone.completedAt && (
                            <p className="text-xs text-gray-500">
                              Hoàn thành: {new Date(milestone.completedAt).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowTaskDetail(false);
                    setSelectedTask(null);
                  }}
                >
                  Đóng
                </Button>
                {selectedTask.status !== 'complete' && (
                  <Button
                    variant="primary"
                    className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => {
                      setShowTaskDetail(false);
                      setUpdateStatus(selectedTask.status);
                      setUpdateProgress(taskProgress[selectedTask.id]?.currentProgress || 0);
                      setUpdateNote('');
                      setShowTaskUpdate(true);
                    }}
                  >
                    <Edit size={16} className="inline mr-2" />
                    Cập nhật
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Task Update Modal */}
      {showTaskUpdate && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">Cập nhật nhiệm vụ</h2>
                <p className="text-purple-100 text-sm">{selectedTask.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowTaskUpdate(false);
                  setSelectedTask(null);
                }}
                className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="new">Mới</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="in-progress">Đang làm</option>
                  <option value="complete">Hoàn thành</option>
                </select>
              </div>

              {/* Progress Update */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tiến độ <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm font-semibold text-purple-600">{updateProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={updateProgress}
                  onChange={(e) => setUpdateProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Progress Bar Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Xem trước tiến độ</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${updateProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  rows={4}
                  placeholder="Nhập ghi chú về tiến độ công việc..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowTaskUpdate(false);
                    setSelectedTask(null);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleUpdateTask}
                >
                  <CheckCircle size={16} className="inline mr-2" />
                  Lưu cập nhật
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
