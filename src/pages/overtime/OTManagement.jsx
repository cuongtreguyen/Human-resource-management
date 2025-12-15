import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  AlertCircle,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  getOvertimeByStatus,
  setOvertimeStatus,
  countOvertimeByStatus,
  formatOTListResponse,
  mapOTStatusToBackend
} from '../../services/overtimeService';
import OTStatusBadge from '../../components/overtime/OTStatusBadge';
import { getUserInfo } from '../../utils/auth';

const OTManagement = () => {
  // State cho OT requests từ API
  const [otRequests, setOtRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // State
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOT, setSelectedOT] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    total: 0,
    totalHours: 0
  });

  // Get current manager from auth
  const currentUser = getUserInfo() || {};
  const managerName = currentUser.name || 'Quản lý';

  // Fetch OT requests từ API
  const fetchOTRequests = useCallback(async (statusFilter = null) => {
    setLoading(true);
    setError(null);
    try {
      // Map filter sang backend status
      let backendStatus = null;
      if (statusFilter && statusFilter !== 'all') {
        backendStatus = mapOTStatusToBackend(statusFilter);
      }

      const data = await getOvertimeByStatus(backendStatus);
      const formattedData = formatOTListResponse(data || []);
      setOtRequests(formattedData);
    } catch (err) {
      console.error('Error fetching OT requests:', err);
      setError(err.message);
      setOtRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      // Lấy tất cả OT để tính stats
      const allData = await getOvertimeByStatus(null);
      const formattedData = formatOTListResponse(allData || []);

      const pending = formattedData.filter(ot => ot.status === 'pending').length;
      const approved = formattedData.filter(ot => ot.status === 'approved').length;
      const rejected = formattedData.filter(ot => ot.status === 'rejected').length;
      const completed = formattedData.filter(ot => ot.status === 'completed').length;
      const totalHours = formattedData
        .filter(ot => ['approved', 'completed'].includes(ot.status))
        .reduce((sum, ot) => sum + (ot.otHours || 0), 0);

      setStats({
        pending,
        approved,
        rejected,
        completed,
        total: formattedData.length,
        totalHours
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Load data on mount và khi filter thay đổi
  useEffect(() => {
    fetchOTRequests(filter);
    fetchStats();
  }, [filter, fetchOTRequests, fetchStats]);

  // Filter and search (chỉ search vì filter đã xử lý ở API)
  const filteredRequests = otRequests.filter(ot => {
    const matchesSearch = searchTerm === '' ||
      (ot.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ot.taskTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ot.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle approve - GỌI API
  const handleApprove = async (otId) => {
    setActionLoading(true);
    try {
      await setOvertimeStatus(otId, 'APPROVED', `Đã duyệt bởi ${managerName}`);
      // Refresh data
      await fetchOTRequests(filter);
      await fetchStats();
      setShowDetailModal(false);
      setSelectedOT(null);
      alert('Đã duyệt yêu cầu OT thành công!');
    } catch (err) {
      console.error('Error approving OT:', err);
      alert(err.message || 'Có lỗi xảy ra khi duyệt OT');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const openRejectModal = (ot) => {
    setSelectedOT(ot);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Handle reject - GỌI API
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setActionLoading(true);
    try {
      await setOvertimeStatus(selectedOT.id, 'REJECTED', rejectReason);
      // Refresh data
      await fetchOTRequests(filter);
      await fetchStats();
      setShowRejectModal(false);
      setShowDetailModal(false);
      setSelectedOT(null);
      setRejectReason('');
      alert('Đã từ chối yêu cầu OT!');
    } catch (err) {
      console.error('Error rejecting OT:', err);
      alert(err.message || 'Có lỗi xảy ra khi từ chối OT');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchOTRequests(filter);
    fetchStats();
  };

  // View detail
  const viewDetail = (ot) => {
    setSelectedOT(ot);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý OT</h1>
            <p className="text-purple-100">Duyệt và quản lý yêu cầu làm thêm giờ</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          onClick={() => setFilter('pending')}
          className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
            filter === 'pending' ? 'border-yellow-500 shadow-lg' : 'border-gray-200 hover:border-yellow-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('approved')}
          className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
            filter === 'approved' ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã duyệt</p>
              <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('rejected')}
          className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
            filter === 'rejected' ? 'border-red-500 shadow-lg' : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('all')}
          className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
            filter === 'all' ? 'border-gray-500 shadow-lg' : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="text-gray-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng đơn</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng giờ OT</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalHours}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm theo tên nhân viên, task, phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="completed">Đã nộp BC</option>
              <option value="reviewed">Đã review</option>
              <option value="payroll_approved">Đã duyệt lương</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* OT Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nhân viên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Board</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ngày OT</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Giờ</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin text-purple-600" />
                      <span className="text-gray-500">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Không có yêu cầu OT nào
                  </td>
                </tr>
              ) : (
                filteredRequests.map((ot) => (
                  <tr key={ot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ot.employeeName || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{ot.department || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 truncate max-w-xs" title={ot.boardName}>
                        {ot.boardName || 'Chưa có thông tin'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{formatDate(ot.otDate)}</p>
                      <p className="text-xs text-gray-500">Đăng ký: {formatDateTime(ot.createdAt || ot.submittedAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-purple-600">{ot.otHours || ot.plannedHours || 0}h</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <OTStatusBadge status={ot.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewDetail(ot)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <FileText size={18} />
                        </button>

                        {ot.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(ot.id)}
                              disabled={actionLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Duyệt"
                            >
                              {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            </button>
                            <button
                              onClick={() => openRejectModal(ot)}
                              disabled={actionLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Từ chối"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOT && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Chi tiết yêu cầu OT</h3>
                <OTStatusBadge status={selectedOT.status} size="md" />
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOT(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedOT.employeeName}</p>
                  <p className="text-sm text-gray-500">{selectedOT.department}</p>
                </div>
              </div>

              {/* OT Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500">Ngày OT</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedOT.otDate)}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500">Số giờ đăng ký</p>
                  <p className="font-semibold text-purple-600">{selectedOT.otHours || selectedOT.plannedHours || 0} giờ</p>
                </div>
              </div>

              {/* Board Info */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Board</p>
                <p className="font-semibold text-gray-900">{selectedOT.boardName || 'Chưa có thông tin'}</p>
              </div>

              {/* Reason */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Lý do đăng ký OT</p>
                <p className="text-gray-900">{selectedOT.reason || 'Không có lý do'}</p>
              </div>

              {/* Submitted Time */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600">
                  Đăng ký lúc: {formatDateTime(selectedOT.createdAt || selectedOT.submittedAt)}
                </p>
              </div>

              {/* Report (if exists) */}
              {selectedOT.report && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-800 mb-2">Báo cáo kết quả</p>
                  <p className="text-sm text-gray-700 mb-2">{selectedOT.report.completedWork}</p>
                  <div className="flex gap-4 text-sm">
                    <span>Thực tế: <strong>{selectedOT.report.actualHours}h</strong></span>
                    <span>Tiến độ: <strong>{selectedOT.report.progress}%</strong></span>
                  </div>
                </div>
              )}

              {/* Manager Note / Reject Reason */}
              {selectedOT.status === 'rejected' && selectedOT.managerNote && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Lý do từ chối: {selectedOT.managerNote}
                  </p>
                </div>
              )}

              {selectedOT.status === 'approved' && selectedOT.managerNote && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">
                    Ghi chú: {selectedOT.managerNote}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedOT.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={() => openRejectModal(selectedOT)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XCircle size={18} />
                  <span>Từ chối</span>
                </button>
                <button
                  onClick={() => handleApprove(selectedOT.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  <span>{actionLoading ? 'Đang xử lý...' : 'Duyệt OT'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedOT && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Từ chối yêu cầu OT</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedOT.employeeName} - {formatDate(selectedOT.otDate)}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                placeholder="Nhập lý do từ chối yêu cầu OT..."
              />
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <XCircle size={18} />
                )}
                <span>{actionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTManagement;
