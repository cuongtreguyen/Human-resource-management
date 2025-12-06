import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { DelegationGuide, DelegationDetailModal } from '../../components/features';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  FileText,
  ArrowRight,
  Bell,
  Eye,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import fakeApi from '../../services/fakeApi';
import { LEAVE_TYPES, LEAVE_TYPE_OPTIONS } from '../../constants/leaveTypes';

const TaskDelegation = () => {
  const navigate = useNavigate();
  const [delegations, setDelegations] = useState([]);
  const [, setEmployees] = useState([]);
  const [, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showGuide, setShowGuide] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newDelegation, setNewDelegation] = useState({
    originalAssigneeId: '',
    delegatedToId: '',
    taskTitle: '',
    priority: 'medium',
    leaveType: LEAVE_TYPES.ANNUAL_LEAVE,
    startDate: '',
    endDate: '',
    reason: '',
    handoverNotes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesRes, tasksRes] = await Promise.all([
        fakeApi.getEmployees(),
        fakeApi.getTasks()
      ]);
      
      setEmployees(employeesRes.data);
      setTasks(tasksRes.data);
      
      // Mock delegation data
      setDelegations([
        {
          id: 1,
          originalAssignee: { id: 1, name: 'Nguyễn Văn An', position: 'Senior Developer' },
          delegatedTo: { id: 2, name: 'Trần Thị Bình', position: 'Developer' },
          task: { id: 1, title: 'Hero Section Design', priority: 'high' },
          leaveRequest: {
            type: 'maternity',
            startDate: '2024-02-01',
            endDate: '2024-11-10',
            days: 280,
            reason: 'Nghỉ thai sản'
          },
          status: 'active',
          delegatedAt: '2024-01-15',
          handoverNotes: 'Cần hoàn thành design theo brand guidelines mới',
          progress: 75
        },
        {
          id: 2,
          originalAssignee: { id: 3, name: 'Lê Minh Chính', position: 'Marketing Specialist' },
          delegatedTo: { id: 4, name: 'Phạm Thu Cúc', position: 'Marketing Coordinator' },
          task: { id: 2, title: 'Website Design', priority: 'medium' },
          leaveRequest: {
            type: 'annual',
            startDate: '2024-01-20',
            endDate: '2024-01-25',
            days: 6,
            reason: 'Nghỉ phép thường'
          },
          status: 'completed',
          delegatedAt: '2024-01-18',
          handoverNotes: 'Design đã hoàn thành, cần review và feedback',
          progress: 100
        },
        {
          id: 3,
          originalAssignee: { id: 5, name: 'Hoàng Đức Dũng', position: 'Sales Executive' },
          delegatedTo: { id: 1, name: 'Nguyễn Văn An', position: 'Senior Developer' },
          task: { id: 3, title: 'Banner Design', priority: 'low' },
          leaveRequest: {
            type: 'emergency',
            startDate: '2024-01-22',
            endDate: '2024-01-24',
            days: 3,
            reason: 'Nghỉ khẩn cấp'
          },
          status: 'pending',
          delegatedAt: '2024-01-22',
          handoverNotes: 'Cần thiết kế banner cho campaign mới',
          progress: 0
        }
      ]);
    } catch {
      console.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'maternity': return 'bg-purple-100 text-purple-800';
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDelegations = delegations.filter(delegation => {
    if (filter === 'all') return true;
    return delegation.status === filter;
  });

  const handleUpdateProgress = async (delegationId, progress) => {
    try {
      const updatedDelegations = delegations.map(delegation => 
        delegation.id === delegationId 
          ? { ...delegation, progress }
          : delegation
      );
      setDelegations(updatedDelegations);
      
      // Show success message
      const progressText = progress === 100 ? 'hoàn thành' : `${progress}%`;
      alert(`Cập nhật tiến độ thành công! Công việc đã đạt ${progressText}`);
      
      // Auto-complete if progress is 100%
      if (progress === 100) {
        const finalDelegations = updatedDelegations.map(delegation => 
          delegation.id === delegationId 
            ? { ...delegation, status: 'completed' }
            : delegation
        );
        setDelegations(finalDelegations);
      }
    } catch {
      alert('Có lỗi xảy ra khi cập nhật tiến độ');
    }
  };

  const handleCompleteDelegation = async (delegationId) => {
    try {
      const updatedDelegations = delegations.map(delegation => 
        delegation.id === delegationId 
          ? { ...delegation, status: 'completed', progress: 100 }
          : delegation
      );
      setDelegations(updatedDelegations);
      alert('Hoàn thành bàn giao công việc!');
    } catch {
      alert('Có lỗi xảy ra khi hoàn thành bàn giao');
    }
  };

  const handleViewDetails = (delegation) => {
    setSelectedDelegation(delegation);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDelegation(null);
  };

  const handleAddDelegation = () => {
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setNewDelegation({
      originalAssigneeId: '',
      delegatedToId: '',
      taskTitle: '',
      priority: 'medium',
      leaveType: LEAVE_TYPES.ANNUAL_LEAVE,
      startDate: '',
      endDate: '',
      reason: '',
      handoverNotes: ''
    });
  };

  const handleSubmitDelegation = async (e) => {
    e.preventDefault();

    try {
      // Calculate days between dates
      const start = new Date(newDelegation.startDate);
      const end = new Date(newDelegation.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      // Create new delegation
      const delegation = {
        id: delegations.length + 1,
        originalAssignee: { id: newDelegation.originalAssigneeId, name: 'Nhân viên A', position: 'Chức vụ' },
        delegatedTo: { id: newDelegation.delegatedToId, name: 'Nhân viên B', position: 'Chức vụ' },
        task: { id: delegations.length + 1, title: newDelegation.taskTitle, priority: newDelegation.priority },
        leaveRequest: {
          type: newDelegation.leaveType,
          startDate: newDelegation.startDate,
          endDate: newDelegation.endDate,
          days: days,
          reason: newDelegation.reason
        },
        status: 'pending',
        delegatedAt: new Date().toISOString().split('T')[0],
        handoverNotes: newDelegation.handoverNotes,
        progress: 0
      };

      setDelegations([...delegations, delegation]);
      handleCloseAddTaskModal();
      alert('Tạo bàn giao công việc thành công!');
    } catch (error) {
      console.error('Error creating delegation:', error);
      alert('Có lỗi xảy ra khi tạo bàn giao công việc');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Quản lý bàn giao công việc</h1>
                <p className="text-purple-100 mt-1">Theo dõi và quản lý việc bàn giao công việc khi nghỉ phép</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddDelegation}
                  className="flex items-center space-x-2 bg-white text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm bàn giao</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowGuide(!showGuide)}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{showGuide ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn'}</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/leaves')}
                >
                  ← Quay lại
                </Button>
              </div>
            </div>
          </div>

          {/* Delegation Guide */}
          {showGuide && (
            <div className="mb-6">
              <DelegationGuide />
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card title="Tổng bàn giao" icon={<Users className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{delegations.length}</div>
                <div className="text-sm text-gray-500">Tổng số bàn giao</div>
              </div>
            </Card>
            
            <Card title="Đang thực hiện" icon={<Clock className="h-5 w-5 text-yellow-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {delegations.filter(d => d.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">Đang bàn giao</div>
              </div>
            </Card>
            
            <Card title="Hoàn thành" icon={<CheckCircle className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {delegations.filter(d => d.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-500">Đã hoàn thành</div>
              </div>
            </Card>
            
            <Card title="Chờ xử lý" icon={<AlertCircle className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {delegations.filter(d => d.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500">Chờ xử lý</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center space-x-4">
              <Select
                label="Lọc theo trạng thái"
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'active', label: 'Đang thực hiện' },
                  { value: 'completed', label: 'Hoàn thành' },
                  { value: 'pending', label: 'Chờ xử lý' },
                  { value: 'overdue', label: 'Quá hạn' }
                ]}
                value={filter}
                onChange={(value) => setFilter(value)}
                className="w-48"
              />
            </div>
          </Card>

          {/* Delegation List */}
          <Card title="Danh sách bàn giao công việc">
            {/* Quick Explanation */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Cách đọc bảng dữ liệu</h4>
                  <p className="text-sm text-blue-800">
                    Bảng này hiển thị <strong>kết quả</strong> của việc bàn giao công việc. 
                    Để thực hiện bàn giao mới, hãy nhấn nút <strong>"Xem hướng dẫn"</strong> ở trên để xem quy trình chi tiết.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">CÔNG VIỆC</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NGƯỜI GIAO</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NGƯỜI NHẬN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LOẠI NGHỈ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TIẾN ĐỘ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDelegations.map((delegation) => (
                    <tr key={delegation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{delegation.task.title}</div>
                            <div className="text-sm text-gray-500">{delegation.handoverNotes}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(delegation.task.priority)}`}>
                                {delegation.task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {delegation.originalAssignee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{delegation.originalAssignee.name}</div>
                            <div className="text-sm text-gray-500">{delegation.originalAssignee.position}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {delegation.delegatedTo.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{delegation.delegatedTo.name}</div>
                            <div className="text-sm text-gray-500">{delegation.delegatedTo.position}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(delegation.leaveRequest.type)}`}>
                            {delegation.leaveRequest.type}
                          </span>
                          <div className="text-sm text-gray-500">
                            {delegation.leaveRequest.days} ngày
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tiến độ</span>
                            <span className="font-medium">{delegation.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                delegation.progress >= 100 ? 'bg-green-500' :
                                delegation.progress >= 75 ? 'bg-blue-500' :
                                delegation.progress >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${delegation.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delegation.status)}`}>
                          {delegation.status}
                        </span>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              const newProgress = prompt('Nhập tiến độ mới (0-100):', delegation.progress);
                              if (newProgress !== null) {
                                const progress = parseInt(newProgress);
                                if (!isNaN(progress) && progress >= 0 && progress <= 100) {
                                  handleUpdateProgress(delegation.id, progress);
                                } else {
                                  alert('Vui lòng nhập số từ 0 đến 100');
                                }
                              }
                            }}
                            title="Cập nhật tiến độ công việc"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          
                          {delegation.status === 'active' && (
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleCompleteDelegation(delegation.id)}
                              title="Đánh dấu hoàn thành"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="secondary" 
                            size="sm"
                            title="Xem chi tiết bàn giao"
                            onClick={() => handleViewDetails(delegation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Delegation Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Thêm bàn giao công việc mới</h2>
              <button
                onClick={handleCloseAddTaskModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitDelegation} className="p-6">
              <div className="space-y-6">
                {/* Task Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Thông tin công việc
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên công việc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newDelegation.taskTitle}
                        onChange={(e) => setNewDelegation({ ...newDelegation, taskTitle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nhập tên công việc cần bàn giao"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mức độ ưu tiên <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={newDelegation.priority}
                        onChange={(e) => setNewDelegation({ ...newDelegation, priority: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="high">Cao</option>
                        <option value="medium">Trung bình</option>
                        <option value="low">Thấp</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú bàn giao
                      </label>
                      <textarea
                        value={newDelegation.handoverNotes}
                        onChange={(e) => setNewDelegation({ ...newDelegation, handoverNotes: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nhập ghi chú, yêu cầu đặc biệt..."
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Thông tin bàn giao
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Người giao việc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newDelegation.originalAssigneeId}
                        onChange={(e) => setNewDelegation({ ...newDelegation, originalAssigneeId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="ID nhân viên giao việc"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Người nhận việc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newDelegation.delegatedToId}
                        onChange={(e) => setNewDelegation({ ...newDelegation, delegatedToId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="ID nhân viên nhận việc"
                      />
                    </div>
                  </div>
                </div>

                {/* Leave Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Thông tin nghỉ phép
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại nghỉ phép <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={newDelegation.leaveType}
                        onChange={(e) => setNewDelegation({ ...newDelegation, leaveType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {LEAVE_TYPE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newDelegation.startDate}
                          onChange={(e) => setNewDelegation({ ...newDelegation, startDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newDelegation.endDate}
                          onChange={(e) => setNewDelegation({ ...newDelegation, endDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lý do nghỉ phép <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={newDelegation.reason}
                        onChange={(e) => setNewDelegation({ ...newDelegation, reason: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nhập lý do nghỉ phép..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseAddTaskModal}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bàn giao
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <DelegationDetailModal
        delegation={selectedDelegation}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
    </Layout>
  );
};

export default TaskDelegation;
