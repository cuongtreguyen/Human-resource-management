import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Calendar, FileText, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import fakeApi from '../../services/fakeApi';
import { getUserInfo } from '../../utils/auth';

const EmployeeLeave = () => {
  const [form, setForm] = useState({ type: 'annual', startDate: '', endDate: '', reason: '' });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLeaveData();
  }, []);

  const loadLeaveData = async () => {
    try {
      setLoading(true);
      const userInfo = getUserInfo();
      const employeeId = userInfo?.employeeId || 'emp001';
      const currentYear = new Date().getFullYear();

      // Load leave balance
      const balanceRes = await fakeApi.getLeaveBalance(employeeId);
      if (balanceRes.success) {
        setLeaveBalance(balanceRes.data);
      }

      // Load leave history
      const historyRes = await fakeApi.getLeaveHistory(employeeId, currentYear);
      if (historyRes.success) {
        setLeaveHistory(historyRes.data);
      }
    } catch (err) {
      console.error('Error loading leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userInfo = getUserInfo();

      const leaveRequest = {
        ...form,
        employeeId: userInfo?.employeeId || 'emp001',
        employeeName: userInfo?.name || 'Nhân viên',
        days: calculateDays(),
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      await fakeApi.createLeaveRequest(leaveRequest);
      alert('Đã gửi yêu cầu nghỉ phép thành công!');
      setForm({ type: 'annual', startDate: '', endDate: '', reason: '' });
      loadLeaveData(); // Refresh data
    } catch (err) {
      console.error('Error submitting leave:', err);
      alert('Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  // Tính số ngày nghỉ
  const calculateDays = () => {
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const days = calculateDays();

  return (
    <div>
      <div className="space-y-6">
        {/* Header với nút quay lại */}
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
            <h1 className="text-3xl font-bold mb-2">Xin nghỉ phép</h1>
            <p className="text-orange-100">Gửi và theo dõi yêu cầu nghỉ phép của bạn</p>
          </div>
        </div>

        {/* Thẻ thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phép năm còn lại</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `${leaveBalance?.annual?.remaining || 0} ngày`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã sử dụng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `${leaveBalance?.annual?.used || 0} ngày`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Yêu cầu chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : leaveHistory.filter(l => l.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form xin nghỉ phép */}
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tạo yêu cầu nghỉ phép mới</h2>
            <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết về kỳ nghỉ của bạn</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FileText size={16} />
                    Loại nghỉ phép
                  </span>
                </label>
                <select
                  value={form.type}
                  onChange={(e)=>setForm({...form, type:e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="annual">🌴 Nghỉ phép năm</option>
                  <option value="sick">🏥 Nghỉ ốm</option>
                  <option value="unpaid">💼 Nghỉ không lương</option>
                </select>
              </div>
              
              <div className="flex items-end">
                {days > 0 && (
                  <div className="w-full p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Tổng số ngày nghỉ</p>
                    <p className="text-3xl font-bold text-orange-700">{days} ngày</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Từ ngày
                  </span>
                </label>
                <input 
                  type="date" 
                  value={form.startDate} 
                  onChange={(e)=>setForm({...form, startDate:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Đến ngày
                  </span>
                </label>
                <input 
                  type="date" 
                  value={form.endDate} 
                  onChange={(e)=>setForm({...form, endDate:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                  min={form.startDate}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  Lý do nghỉ phép
                </span>
              </label>
              <textarea 
                rows="4" 
                value={form.reason} 
                onChange={(e)=>setForm({...form, reason:e.target.value})} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none" 
                placeholder="Nhập lý do chi tiết để quản lý có thể xem xét..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Yêu cầu của bạn sẽ được gửi đến quản lý để phê duyệt
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span>{submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Lịch sử yêu cầu nghỉ phép */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Lịch sử yêu cầu gần đây</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-500">Đang tải...</span>
              </div>
            ) : leaveHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch sử nghỉ phép</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaveHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'annual' ? 'bg-green-100' :
                        item.type === 'sick' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <Calendar className={`${
                          item.type === 'annual' ? 'text-green-600' :
                          item.type === 'sick' ? 'text-red-600' :
                          'text-gray-600'
                        }`} size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.type === 'annual' ? 'Nghỉ phép năm' :
                           item.type === 'sick' ? 'Nghỉ ốm' :
                           item.type === 'unpaid' ? 'Không lương' :
                           item.type === 'maternity' ? 'Thai sản' : 'Khác'} • {item.days} ngày
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'approved' && <CheckCircle2 size={14} />}
                      {item.status === 'pending' && <Clock size={14} />}
                      {item.status === 'rejected' && <XCircle size={14} />}
                      {item.status === 'approved' ? 'Đã duyệt' :
                       item.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
