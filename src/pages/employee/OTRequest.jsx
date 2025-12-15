import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Clock, Calendar, AlertTriangle, CheckCircle, FileText, DollarSign, Briefcase, Loader2 } from 'lucide-react';
import { useOTContext } from '../../context/OTContext';
import { boardService } from '../../services/kanbanService';
import QuotaIndicator from '../../components/overtime/QuotaIndicator';
import OTStatusBadge from '../../components/overtime/OTStatusBadge';
import { getUserInfo } from '../../utils/auth';

// OT Rate: 100,000 VND per hour
const OT_HOURLY_RATE = 100000;

const OTRequest = () => {
  const {
    createOTRequest,
    canRegisterOT,
    checkMonthlyQuota,
    validateOTHours,
    getOTByEmployee,
    MONTHLY_QUOTA,
    loading: contextLoading,
    error: contextError,
  } = useOTContext();

  // Get current user from auth
  const currentUser = getUserInfo() || {};
  const employeeName = currentUser.name || 'Nhân viên';
  // Lấy ID số từ database (id) thay vì employeeId string
  const employeeId = currentUser.id || currentUser.employeeId || '';
  const department = currentUser.department || '';

  // Form state
  const [form, setForm] = useState({
    otDate: new Date().toISOString().split('T')[0],
    selectedBoard: null,
    plannedHours: 2,
    reason: ''
  });

  // Validation state
  const [deadlineCheck, setDeadlineCheck] = useState(null);
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [hoursValidation, setHoursValidation] = useState({ valid: true, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State cho boards từ API
  const [myBoards, setMyBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [boardsError, setBoardsError] = useState(null);

  // Fetch boards mà employee là member
  useEffect(() => {
    const fetchMyBoards = async () => {
      setLoadingBoards(true);
      setBoardsError(null);
      try {
        const boards = await boardService.getMyBoards();
        setMyBoards(boards || []);
      } catch (err) {
        console.error('Error fetching my boards:', err);
        setBoardsError(err.message);
        setMyBoards([]);
      } finally {
        setLoadingBoards(false);
      }
    };

    fetchMyBoards();
  }, []);

  // Get employee's OT history
  const myOTRequests = getOTByEmployee(employeeId);
  const recentRequests = myOTRequests.slice(-5).reverse();

  // Check deadline every minute
  useEffect(() => {
    const check = () => {
      setDeadlineCheck(canRegisterOT(form.otDate));
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [form.otDate, canRegisterOT]);

  // Check quota whenever date changes
  useEffect(() => {
    const month = form.otDate.slice(0, 7);
    setQuotaInfo(checkMonthlyQuota(employeeId, month, form.plannedHours));
  }, [form.otDate, form.plannedHours, employeeId, checkMonthlyQuota]);

  // Validate hours
  useEffect(() => {
    setHoursValidation(validateOTHours(form.plannedHours));
  }, [form.plannedHours, validateOTHours]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all conditions
    if (!deadlineCheck?.allowed) {
      alert(deadlineCheck?.reason || 'Không thể đăng ký OT');
      return;
    }

    if (!quotaInfo?.allowed) {
      alert(quotaInfo?.message || 'Đã hết quota OT');
      return;
    }

    if (!hoursValidation.valid) {
      alert(hoursValidation.message);
      return;
    }

    if (!form.selectedBoard) {
      alert('Vui lòng chọn board/nhiệm vụ cần làm OT');
      return;
    }

    if (!form.reason.trim()) {
      alert('Vui lòng nhập lý do đăng ký OT');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create OT request - GỌI API BACKEND
      await createOTRequest({
        employeeId: employeeId, // ID số từ database
        employeeName,
        department,
        boardId: form.selectedBoard.id, // Board ID từ API
        otDate: form.otDate,
        plannedHours: form.plannedHours,
        reason: form.reason
      });

      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setForm({
          otDate: new Date().toISOString().split('T')[0],
          selectedBoard: null,
          plannedHours: 2,
          reason: ''
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating OT request:', error);
      alert(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate estimated OT pay - 100,000 VND per hour
  const calculateEstimatedPay = () => {
    const otPay = form.plannedHours * OT_HOURLY_RATE;
    return Math.round(otPay).toLocaleString('vi-VN');
  };

  const canSubmit = deadlineCheck?.allowed &&
                    quotaInfo?.allowed &&
                    hoursValidation.valid &&
                    form.selectedBoard &&
                    form.reason.trim() &&
                    !isSubmitting;

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
            <h1 className="text-3xl font-bold mb-2">Đăng ký OT</h1>
            <p className="text-orange-100">Đăng ký làm thêm giờ cho task của bạn</p>
          </div>
        </div>

        {/* Deadline Warning */}
        {deadlineCheck && (
          <div className={`p-4 rounded-xl border ${
            deadlineCheck.allowed
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {deadlineCheck.allowed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${deadlineCheck.allowed ? 'text-green-700' : 'text-red-700'}`}>
                  {deadlineCheck.reason}
                </p>
                {deadlineCheck.timeLeft && (
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    Còn {deadlineCheck.timeLeft} để đăng ký
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Quota */}
          <div className="md:col-span-2">
            {quotaInfo && (
              <QuotaIndicator
                used={quotaInfo.used}
                remaining={quotaInfo.remaining}
                quota={quotaInfo.quota}
              />
            )}
          </div>

          {/* Boards available for OT */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Board đang tham gia</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loadingBoards ? '...' : myBoards.length}
                </p>
              </div>
            </div>
          </div>

          {/* Pending requests */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myOTRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tạo yêu cầu OT mới</h2>
            <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết về ca OT của bạn</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Date and Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Ngày OT
                  </span>
                </label>
                <input
                  type="date"
                  value={form.otDate}
                  onChange={(e) => setForm({...form, otDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formatDate(form.otDate)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    Số giờ OT dự kiến
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={form.plannedHours}
                    onChange={(e) => setForm({...form, plannedHours: parseFloat(e.target.value)})}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="w-20 text-center">
                    <span className="text-2xl font-bold text-orange-600">{form.plannedHours}</span>
                    <span className="text-gray-500 ml-1">giờ</span>
                  </div>
                </div>
                {!hoursValidation.valid && (
                  <p className="text-sm text-red-600 mt-1">{hoursValidation.message}</p>
                )}

                {/* Estimated Pay Box */}
                <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Dự kiến lương OT:</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{calculateEstimatedPay()} VND</p>
                      <p className="text-xs text-gray-500">{form.plannedHours} giờ × 100,000 VND/giờ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Board Selection - From my boards */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Board/Nhiệm vụ được giao <span className="text-red-500">*</span>
                </span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Chọn từ danh sách board mà bạn đang là thành viên
              </p>

              {loadingBoards ? (
                <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg">
                  <Loader2 size={20} className="animate-spin text-orange-500" />
                  <span className="text-gray-500">Đang tải danh sách board...</span>
                </div>
              ) : boardsError ? (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-red-600 text-sm">{boardsError}</p>
                </div>
              ) : myBoards.length === 0 ? (
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-yellow-700 text-sm">Bạn chưa được thêm vào board nào. Liên hệ Manager để được thêm vào board.</p>
                </div>
              ) : (
                <select
                  value={form.selectedBoard?.id || ''}
                  onChange={(e) => {
                    const boardId = e.target.value;
                    const board = myBoards.find(b => b.id === Number(boardId));
                    setForm({...form, selectedBoard: board || null});
                  }}
                  disabled={!deadlineCheck?.allowed}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Chọn board cần làm OT --</option>
                  {myBoards.map(board => (
                    <option key={board.id} value={board.id}>
                      {board.name} ({board.memberCount} thành viên - Tiến độ {Math.round(board.progress || 0)}%)
                    </option>
                  ))}
                </select>
              )}

              {/* Hiển thị thông tin board đã chọn */}
              {form.selectedBoard && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900">{form.selectedBoard.name}</p>
                  <div className="flex gap-4 mt-2 text-sm text-blue-700">
                    <span>👥 {form.selectedBoard.memberCount} thành viên</span>
                    <span>📊 Tiến độ: {Math.round(form.selectedBoard.progress || 0)}%</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-blue-600">
                    <span>Cần làm: {form.selectedBoard.todoCount || 0}</span>
                    <span>Đang làm: {form.selectedBoard.inProgressCount || 0}</span>
                    <span>Review: {form.selectedBoard.reviewCount || 0}</span>
                    <span>Xong: {form.selectedBoard.doneCount || 0}</span>
                  </div>
                </div>
              )}

              {myBoards.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Có {myBoards.length} board bạn đang tham gia
                </p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  Lý do đăng ký OT <span className="text-red-500">*</span>
                </span>
              </label>
              <textarea
                rows="3"
                value={form.reason}
                onChange={(e) => setForm({...form, reason: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Nhập lý do chi tiết tại sao bạn cần làm OT cho task này..."
                required
                disabled={!deadlineCheck?.allowed}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Yêu cầu sẽ được gửi đến Manager để phê duyệt
              </p>

              {submitSuccess ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg">
                  <CheckCircle size={18} />
                  <span>Đã gửi thành công!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                    canSubmit && !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Đăng ký OT</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* OT History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Lịch sử đăng ký OT</h3>
            <a
              href="/employee/ot/report"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Xem tất cả →
            </a>
          </div>
          <div className="p-6">
            {recentRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có yêu cầu OT nào</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => {
                  const otHours = request.otHours || request.plannedHours || 0;
                  const otPay = otHours * OT_HOURLY_RATE;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Clock className="text-gray-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(request.otDate).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.boardName || request.taskTitle || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">{otHours}h</p>
                          <p className="text-xs text-green-600">{otPay.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <OTStatusBadge status={request.status} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTRequest;
