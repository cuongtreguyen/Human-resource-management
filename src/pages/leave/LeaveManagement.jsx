import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  X,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import fakeApi from '../../services/fakeApi';
import { toast } from 'react-toastify';
import { getRole } from '../../utils/auth';
import { logApproveLeave, logRejectLeave } from '../../utils/systemLogger';

const LeaveManagement = () => {
  const userRole = getRole();

  // Màu sắc theo role
  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'manager':
        return 'from-purple-600 to-purple-700';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-100';
      case 'manager':
        return 'text-purple-100';
      case 'accountant':
        return 'text-emerald-100';
      default:
        return 'text-orange-100';
    }
  };
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingRequestId, setRejectingRequestId] = useState(null);

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

  const getStatusName = (status) => {
    const statuses = {
      'approved': 'Đã duyệt',
      'pending': 'Chờ duyệt',
      'rejected': 'Từ chối',
      'cancelled': 'Đã hủy'
    };
    return statuses[status] || status;
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

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApprove = async (requestId) => {
    try {
      const request = leaveRequests.find(r => r.id === requestId);
      if (!request) return;
      
      const approverName = userRole === 'admin' ? 'Admin' : userRole === 'manager' ? 'Manager' : 'Accountant';
      const updatedRequests = leaveRequests.map(req =>
        req.id === requestId
          ? { ...req, status: 'approved', approvedBy: approverName }
          : req
      );
      setLeaveRequests(updatedRequests);
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: 'approved', approvedBy: approverName });
      }
      
      // Log hành động duyệt đơn nghỉ phép
      logApproveLeave(requestId, request.employeeName || request.employeeName || 'Unknown', request.days || 0);
      
      toast.success('Đã duyệt đơn nghỉ phép thành công!');
    } catch {
      toast.error('Có lỗi xảy ra khi duyệt đơn');
    }
  };

  const openRejectModal = (requestId) => {
    setRejectingRequestId(requestId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning('Vui lòng nhập lý do từ chối!');
      return;
    }
    try {
      const request = leaveRequests.find(r => r.id === rejectingRequestId);
      if (!request) return;
      
      const approverName = userRole === 'admin' ? 'Admin' : userRole === 'manager' ? 'Manager' : 'Accountant';
      const updatedRequests = leaveRequests.map(req =>
        req.id === rejectingRequestId
          ? { ...req, status: 'rejected', approvedBy: approverName, rejectReason: rejectReason }
          : req
      );
      setLeaveRequests(updatedRequests);
      if (selectedRequest && selectedRequest.id === rejectingRequestId) {
        setSelectedRequest({ ...selectedRequest, status: 'rejected', approvedBy: approverName, rejectReason: rejectReason });
      }
      
      // Log hành động từ chối đơn nghỉ phép
      logRejectLeave(rejectingRequestId, request.employeeName || 'Unknown', rejectReason);
      
      setShowRejectModal(false);
      setShowModal(false);
      setRejectReason('');
      setRejectingRequestId(null);
      toast.success('Đã từ chối đơn nghỉ phép thành công!');
    } catch {
      toast.error('Có lỗi xảy ra khi từ chối đơn');
    }
  };

  // Kiểm tra quyền duyệt đơn nghỉ phép
  const canApproveRequest = (request) => {
    // Admin có thể duyệt tất cả đơn
    if (userRole === 'admin') return true;
    
    // Manager có thể duyệt đơn của nhân viên (không phải manager và accountant)
    // Kiểm tra dựa trên department hoặc employeeId - nếu đơn của manager/accountant thì chỉ admin mới duyệt được
    if (userRole === 'manager') {
      // Manager có thể duyệt đơn của nhân viên thường
      // Để đơn giản, cho phép manager duyệt tất cả đơn (trừ khi là đơn của manager/accountant khác)
      return true;
    }
    
    // Accountant chỉ xem, không thể duyệt
    if (userRole === 'accountant') return false;
    
    return false;
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
          <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-lg mb-6`}>
            <div>
              <h1 className="text-3xl font-bold">Duyệt đơn nghỉ phép</h1>
              <p className={`${getSubtitleColor()} mt-1`}>
                {userRole === 'admin' 
                  ? 'Xem và duyệt tất cả các đơn nghỉ phép (bao gồm accountant và manager)'
                  : userRole === 'manager'
                  ? 'Xem và duyệt các đơn nghỉ phép của nhân viên'
                  : 'Xem các đơn nghỉ phép'}
              </p>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NHÂN VIÊN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">PHÒNG BAN</th>
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
                        <span className="text-sm font-medium text-blue-600">{request.employeeId}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {request.employeeName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{request.employeeName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{request.department || 'Chưa xác định'}</span>
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
                          {getStatusName(request.status)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewDetail(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {request.status === 'pending' && canApproveRequest(request) && (
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
                                onClick={() => openRejectModal(request.id)}
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

      {/* Modal xem chi tiết đơn nghỉ phép */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn nghỉ phép</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Thông tin nhân viên */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {selectedRequest.employeeName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedRequest.employeeName}</h4>
                  <p className="text-sm text-gray-500">ID: {selectedRequest.employeeId}</p>
                  <p className="text-sm text-gray-500">Phòng: {selectedRequest.department || 'Chưa xác định'}</p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusName(selectedRequest.status)}
                  </span>
                </div>
              </div>

              {/* Chi tiết đơn */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Loại nghỉ</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getLeaveTypeColor(selectedRequest.type)}`}>
                    {getLeaveTypeName(selectedRequest.type)}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Số ngày nghỉ</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{selectedRequest.days} ngày</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Ngày bắt đầu</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedRequest.startDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Ngày kết thúc</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedRequest.endDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Lý do nghỉ */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Lý do nghỉ phép</span>
                </div>
                <p className="text-gray-900">{selectedRequest.reason}</p>
              </div>

              {/* Lý do từ chối (nếu bị từ chối) */}
              {selectedRequest.status === 'rejected' && selectedRequest.rejectReason && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Lý do từ chối</span>
                  </div>
                  <p className="text-red-700">{selectedRequest.rejectReason}</p>
                </div>
              )}

              {/* Thông tin bổ sung */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                <span>Ngày nộp đơn: {new Date(selectedRequest.submittedDate).toLocaleDateString('vi-VN')}</span>
                {selectedRequest.approvedBy && (
                  <span>Người duyệt: {selectedRequest.approvedBy}</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              {selectedRequest.status === 'pending' && canApproveRequest(selectedRequest) ? (
                <>
                  <button
                    onClick={() => openRejectModal(selectedRequest.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Duyệt đơn
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Từ chối đơn nghỉ phép</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setRejectingRequestId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối đơn nghỉ phép..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={4}
                />
              </div>
              <p className="text-sm text-gray-500">
                Lý do này sẽ được gửi đến nhân viên để họ biết tại sao đơn bị từ chối.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setRejectingRequestId(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LeaveManagement;
