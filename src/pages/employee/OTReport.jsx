import React, { useState } from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle, Send, AlertCircle, Star, DollarSign } from 'lucide-react';
import { useOTContext } from '../../context/OTContext';
import OTStatusBadge from '../../components/overtime/OTStatusBadge';
import { getUserInfo } from '../../utils/auth';

// OT Rate: 100,000 VND per hour
const OT_HOURLY_RATE = 100000;

const OTReport = () => {
  const {
    getOTByEmployee,
    getOTNeedingReport,
    submitReport
  } = useOTContext();

  // Get current user from auth
  const currentUser = getUserInfo() || {};
  const employeeId = currentUser.employeeId || '';

  // State
  const [selectedOT, setSelectedOT] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    actualHours: 0,
    completedWork: '',
    progress: 50
  });
  const [filter, setFilter] = useState('all');

  // Get OT requests
  const allOTRequests = getOTByEmployee(employeeId);
  const needingReport = getOTNeedingReport(employeeId);

  // Filter requests
  const filteredRequests = filter === 'all'
    ? allOTRequests
    : allOTRequests.filter(r => r.status === filter);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Open report modal
  const openReportModal = (otRequest) => {
    setSelectedOT(otRequest);
    setReportForm({
      actualHours: otRequest.plannedHours,
      completedWork: '',
      progress: 50
    });
    setShowReportModal(true);
  };

  // Handle submit report
  const handleSubmitReport = () => {
    if (!reportForm.completedWork.trim()) {
      alert('Vui lòng nhập công việc đã hoàn thành');
      return;
    }

    submitReport(selectedOT.id, {
      actualHours: reportForm.actualHours,
      completedWork: reportForm.completedWork,
      progress: reportForm.progress
    });

    setShowReportModal(false);
    setSelectedOT(null);
    alert('Đã nộp báo cáo OT thành công!');
  };

  // Calculate estimated pay - 100,000 VND per hour
  const calculatePay = (hours) => {
    const otPay = hours * OT_HOURLY_RATE;
    return Math.round(otPay).toLocaleString('vi-VN');
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/employee"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Báo cáo OT</h1>
            <p className="text-orange-100">Nộp kết quả làm việc sau khi hoàn thành OT</p>
          </div>
        </div>

        {/* Pending Reports Alert */}
        {needingReport.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">
                  Bạn có {needingReport.length} OT cần nộp báo cáo
                </p>
                <p className="text-sm text-orange-600">
                  Vui lòng nộp báo cáo kết quả để Manager có thể review
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng OT</p>
                <p className="text-xl font-bold text-gray-900">{allOTRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cần báo cáo</p>
                <p className="text-xl font-bold text-orange-600">{needingReport.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Star className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã review</p>
                <p className="text-xl font-bold text-gray-900">
                  {allOTRequests.filter(r => r.status === 'reviewed' || r.status === 'payroll_approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã duyệt lương</p>
                <p className="text-xl font-bold text-green-600">
                  {allOTRequests.filter(r => r.status === 'payroll_approved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* OT Needing Report */}
        {needingReport.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-orange-50 border-b border-orange-200">
              <h3 className="font-semibold text-orange-900">OT cần nộp báo cáo</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {needingReport.map((ot) => (
                  <div
                    key={ot.id}
                    className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{formatDate(ot.otDate)}</p>
                      <p className="text-sm text-gray-600">{ot.taskTitle}</p>
                      <p className="text-sm text-gray-500">Đã đăng ký: {ot.plannedHours}h</p>
                    </div>
                    <button
                      onClick={() => openReportModal(ot)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Send size={16} />
                      <span>Nộp báo cáo</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All OT History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Lịch sử OT</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500"
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

          <div className="divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Không có yêu cầu OT nào</p>
            ) : (
              filteredRequests.map((ot) => (
                <div key={ot.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-gray-900">{formatDate(ot.otDate)}</p>
                        <OTStatusBadge status={ot.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-700">{ot.taskTitle}</p>
                      <p className="text-sm text-gray-500">{ot.reason}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Đăng ký: <span className="font-medium">{ot.plannedHours}h</span>
                        </span>
                        {ot.report?.actualHours && (
                          <span className="text-gray-600">
                            Thực tế: <span className="font-medium text-purple-600">{ot.report.actualHours}h</span>
                          </span>
                        )}
                        <span className="text-green-600 font-medium">
                          {calculatePay(ot.report?.actualHours || ot.plannedHours)} VND
                        </span>
                      </div>

                      {/* Report info */}
                      {ot.report && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{ot.report.completedWork}</p>
                          <p className="text-sm text-gray-500 mt-1">Tiến độ: {ot.report.progress}%</p>
                        </div>
                      )}

                      {/* Review info */}
                      {ot.review && (
                        <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= ot.review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">- {ot.review.reviewedBy}</span>
                          </div>
                          <p className="text-sm text-indigo-700">{ot.review.feedback}</p>
                        </div>
                      )}

                      {/* Reject reason */}
                      {ot.status === 'rejected' && ot.rejectReason && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">Lý do từ chối: {ot.rejectReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {ot.status === 'approved' && new Date(ot.otDate) <= new Date() && (
                      <button
                        onClick={() => openReportModal(ot)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                      >
                        <Send size={14} />
                        <span>Nộp BC</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && selectedOT && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Nộp báo cáo OT</h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(selectedOT.otDate)} - {selectedOT.taskTitle}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Actual Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số giờ thực tế làm việc
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.5"
                    max={Math.min(selectedOT.plannedHours + 1, 4)}
                    step="0.5"
                    value={reportForm.actualHours}
                    onChange={(e) => setReportForm({...reportForm, actualHours: parseFloat(e.target.value)})}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="w-20 text-center">
                    <span className="text-2xl font-bold text-orange-600">{reportForm.actualHours}</span>
                    <span className="text-gray-500 ml-1">giờ</span>
                  </div>
                </div>

                {/* Estimated Pay Box */}
                <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Dự kiến lương OT:</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{calculatePay(reportForm.actualHours)} VND</p>
                      <p className="text-xs text-gray-500">{reportForm.actualHours} giờ × 100,000 VND/giờ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiến độ task sau OT: {reportForm.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={reportForm.progress}
                  onChange={(e) => setReportForm({...reportForm, progress: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Completed Work */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Công việc đã hoàn thành <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={reportForm.completedWork}
                  onChange={(e) => setReportForm({...reportForm, completedWork: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Mô tả chi tiết công việc bạn đã hoàn thành trong ca OT..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedOT(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReport}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Send size={16} />
                <span>Nộp báo cáo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTReport;
