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
  ChevronRight
} from 'lucide-react';
import fakeApi from '../../services/fakeApi';

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
