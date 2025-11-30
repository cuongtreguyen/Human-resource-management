import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useOTContext } from '../../context/OTContext';
import OTStatusBadge from '../../components/overtime/OTStatusBadge';

const OTManagement = () => {
  const {
    otRequests,
    approveOT,
    rejectOT,
    getOTStatistics
  } = useOTContext();

  // State
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOT, setSelectedOT] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Get current manager (demo)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const managerName = currentUser.name || 'Manager';

  // Stats
  const stats = getOTStatistics();

  // Filter and search
  const filteredRequests = otRequests.filter(ot => {
    const matchesFilter = filter === 'all' || ot.status === filter;
    const matchesSearch = searchTerm === '' ||
      ot.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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

  // Handle approve
  const handleApprove = (otId) => {
    approveOT(otId, managerName);
    setShowDetailModal(false);
    setSelectedOT(null);
  };

  // Handle reject
  const openRejectModal = (ot) => {
    setSelectedOT(ot);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    rejectOT(selectedOT.id, rejectReason, managerName);
    setShowRejectModal(false);
    setShowDetailModal(false);
    setSelectedOT(null);
    setRejectReason('');
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
        <h1 className="text-3xl font-bold mb-2">Quản lý OT</h1>
        <p className="text-purple-100">Duyệt và quản lý yêu cầu làm thêm giờ</p>
      </div>

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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Task</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ngày OT</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Giờ</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
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
                          <p className="font-medium text-gray-900">{ot.employeeName}</p>
                          <p className="text-sm text-gray-500">{ot.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 truncate max-w-xs" title={ot.taskTitle}>
                        {ot.taskTitle}
                      </p>
                      <p className="text-xs text-gray-500">Deadline: {formatDate(ot.taskDeadline)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{formatDate(ot.otDate)}</p>
                      <p className="text-xs text-gray-500">Đăng ký: {formatDateTime(ot.submittedAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-purple-600">{ot.plannedHours}h</span>
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
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duyệt"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => openRejectModal(ot)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  <p className="font-semibold text-purple-600">{selectedOT.plannedHours} giờ</p>
                </div>
              </div>

              {/* Task Info */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Task</p>
                <p className="font-semibold text-gray-900">{selectedOT.taskTitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Deadline: {formatDate(selectedOT.taskDeadline)}
                </p>
              </div>

              {/* Reason */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Lý do đăng ký OT</p>
                <p className="text-gray-900">{selectedOT.reason}</p>
              </div>

              {/* Submitted Time */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600">
                  Đăng ký lúc: {formatDateTime(selectedOT.submittedAt)}
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

              {/* Reject Reason */}
              {selectedOT.status === 'rejected' && selectedOT.rejectReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Lý do từ chối: {selectedOT.rejectReason}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedOT.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={() => openRejectModal(selectedOT)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <XCircle size={18} />
                  <span>Từ chối</span>
                </button>
                <button
                  onClick={() => handleApprove(selectedOT.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={18} />
                  <span>Duyệt OT</span>
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle size={18} />
                <span>Xác nhận từ chối</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTManagement;
