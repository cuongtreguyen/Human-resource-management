import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react';
import fakeApi from '../services/fakeApi';

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesRes, leaveRequestsRes] = await Promise.all([
        fakeApi.getEmployees(),
        fakeApi.getLeaveRequests()
      ]);
      
      setEmployees(employeesRes.data);
      setLeaveRequests(leaveRequestsRes.data);
    } catch {
      console.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'maternity': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeName = (type) => {
    const types = {
      'annual': 'Nghỉ phép thường',
      'sick': 'Nghỉ ốm',
      'maternity': 'Nghỉ thai sản',
      'emergency': 'Nghỉ khẩn cấp'
    };
    return types[type] || 'Khác';
  };

  const handleApprove = async (requestId) => {
    try {
      const updatedRequests = leaveRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', approvedBy: 'admin' }
          : request
      );
      setLeaveRequests(updatedRequests);
      alert('Đã duyệt đơn nghỉ phép!');
    } catch {
      alert('Có lỗi xảy ra khi duyệt đơn');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const updatedRequests = leaveRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', approvedBy: 'admin' }
          : request
      );
      setLeaveRequests(updatedRequests);
      alert('Đã từ chối đơn nghỉ phép!');
    } catch {
      alert('Có lỗi xảy ra khi từ chối đơn');
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
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
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Quản lý nghỉ phép</h1>
                <p className="text-green-100 mt-1">Theo dõi và quản lý các đơn nghỉ phép của nhân viên</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="secondary" 
                  size="md" 
                  onClick={() => navigate('/leaves/create')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo đơn nghỉ phép
                </Button>
                <Button 
                  variant="secondary" 
                  size="md" 
                  onClick={() => navigate('/leaves/delegation')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Bàn giao công việc
                </Button>
                <Button 
                  variant="secondary" 
                  size="md" 
                  onClick={() => navigate('/leaves/workflow')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Workflow
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card title="Tổng đơn nghỉ phép" icon={<FileText className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Tổng số đơn</div>
              </div>
            </Card>
            
            <Card title="Chờ duyệt" icon={<Clock className="h-5 w-5 text-yellow-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-500">Cần xử lý</div>
              </div>
            </Card>
            
            <Card title="Đã duyệt" icon={<CheckCircle className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-500">Đã duyệt</div>
              </div>
            </Card>
            
            <Card title="Từ chối" icon={<AlertCircle className="h-5 w-5 text-red-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-500">Từ chối</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  label="Tìm kiếm"
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value)}
                  placeholder="Tìm theo tên nhân viên hoặc lý do..."
                />
              </div>
              <Select
                label="Lọc theo trạng thái"
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'pending', label: 'Chờ duyệt' },
                  { value: 'approved', label: 'Đã duyệt' },
                  { value: 'rejected', label: 'Từ chối' },
                  { value: 'cancelled', label: 'Đã hủy' }
                ]}
                value={filter}
                onChange={(value) => setFilter(value)}
                className="w-48"
              />
            </div>
          </Card>

          {/* Leave Requests List */}
          <Card title="Danh sách đơn nghỉ phép">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NHÂN VIÊN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LOẠI NGHỈ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">THỜI GIAN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">SỐ NGÀY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LÝ DO</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{request.employeeName}</div>
                            <div className="text-sm text-gray-500">ID: {request.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.type)}`}>
                          {getLeaveTypeName(request.type)}
                        </span>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {new Date(request.startDate).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="text-gray-500">
                            đến {new Date(request.endDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{request.days}</div>
                          <div className="text-sm text-gray-500">ngày</div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 truncate" title={request.reason}>
                            {request.reason}
                          </p>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status === 'approved' ? 'Đã duyệt' :
                           request.status === 'pending' ? 'Chờ duyệt' :
                           request.status === 'rejected' ? 'Từ chối' :
                           request.status === 'cancelled' ? 'Đã hủy' : request.status}
                        </span>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              // View details
                              alert(`Chi tiết đơn nghỉ phép:\n\nNhân viên: ${request.employeeName}\nLoại nghỉ: ${getLeaveTypeName(request.type)}\nThời gian: ${new Date(request.startDate).toLocaleDateString('vi-VN')} - ${new Date(request.endDate).toLocaleDateString('vi-VN')}\nSố ngày: ${request.days}\nLý do: ${request.reason}\nTrạng thái: ${request.status}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handleReject(request.id)}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
    </Layout>
  );
};

export default LeaveManagement;
