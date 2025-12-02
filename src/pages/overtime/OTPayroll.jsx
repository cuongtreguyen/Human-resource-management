import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle,
  User,
  FileText,
  Clock,
  Download,
  Calculator
} from 'lucide-react';
import { useOTContext } from '../../context/OTContext';
import OTStatusBadge from '../../components/overtime/OTStatusBadge';
import { getUserInfo } from '../../utils/auth';

const OTPayroll = () => {
  const {
    getOTForPayroll,
    getPayrollSummary,
    approveForPayroll
  } = useOTContext();

  // State
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Get current accountant from auth
  const currentUser = getUserInfo() || {};
  const accountantName = currentUser.name || 'Kế toán';

  // Get OT for payroll (status: completed - after employee submitted report)
  const otForPayroll = getOTForPayroll();
  const payrollSummary = getPayrollSummary(selectedMonth);

  // Default hourly rate calculation (demo)
  const DEFAULT_MONTHLY_SALARY = 15000000;
  const hourlyRate = DEFAULT_MONTHLY_SALARY / 22 / 8;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle approve for payroll
  const handleApproveForPayroll = (otId) => {
    approveForPayroll(otId, accountantName, hourlyRate);
    alert('Đã duyệt OT cho lương thành công!');
  };

  // Handle approve all
  const handleApproveAll = () => {
    if (otForPayroll.length === 0) return;

    if (!confirm(`Bạn có chắc muốn duyệt ${otForPayroll.length} yêu cầu OT cho lương?`)) {
      return;
    }

    otForPayroll.forEach(ot => {
      approveForPayroll(ot.id, accountantName, hourlyRate);
    });

    alert('Đã duyệt tất cả OT cho lương!');
  };

  // Export to CSV (demo)
  const handleExport = () => {
    const csvContent = [
      ['Nhân viên', 'Phòng ban', 'Ngày OT', 'Giờ', 'OT Pay', 'Trạng thái'].join(','),
      ...payrollSummary.employees.flatMap(emp =>
        emp.requests.map(r =>
          [
            emp.employeeName,
            emp.department,
            r.otDate,
            r.report?.actualHours || r.plannedHours,
            r.calculatedPay || 'Chưa tính',
            r.status
          ].join(',')
        )
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `OT_Report_${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">OT Payroll</h1>
            <p className="text-emerald-100">Duyệt và tính lương OT cho nhân viên</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cần duyệt</p>
              <p className="text-2xl font-bold text-orange-600">{otForPayroll.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng đơn tháng</p>
              <p className="text-2xl font-bold text-blue-600">{payrollSummary.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng giờ OT</p>
              <p className="text-2xl font-bold text-purple-600">{payrollSummary.totalHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng chi phí</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(payrollSummary.totalPay)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* OT for Payroll Approval */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center justify-between">
          <h3 className="font-semibold text-orange-900">OT cần duyệt lương ({otForPayroll.length})</h3>
          {otForPayroll.length > 0 && (
            <button
              onClick={handleApproveAll}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <CheckCircle size={16} />
              <span>Duyệt tất cả</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {otForPayroll.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Không có OT nào cần duyệt lương</p>
          ) : (
            otForPayroll.map((ot) => {
              const otHours = ot.report?.actualHours || ot.plannedHours;
              const otPay = Math.round(otHours * hourlyRate * 1.5);

              return (
                <div key={ot.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ot.employeeName}</p>
                          <p className="text-sm text-gray-500">{ot.department} • {formatDate(ot.otDate)}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700">{ot.taskTitle}</p>

                      {/* Report info */}
                      {ot.report && (
                        <p className="text-sm text-gray-600 italic">
                          "{ot.report.completedWork.substring(0, 50)}..."
                        </p>
                      )}

                      {/* OT Details */}
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">
                          Giờ OT: <strong className="text-purple-600">{otHours}h</strong>
                        </span>
                        <span className="text-gray-600">
                          Rate: <strong>{formatCurrency(hourlyRate)}/h × 1.5</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-green-600">{formatCurrency(otPay)}</p>
                      <button
                        onClick={() => handleApproveForPayroll(ot.id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle size={14} />
                        <span>Duyệt</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Monthly Summary by Employee */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Tổng hợp OT theo nhân viên - Tháng {selectedMonth}</h3>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <Download size={16} />
            <span>Xuất CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nhân viên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phòng ban</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Số đơn</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Tổng giờ</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Tổng OT Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollSummary.employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Chưa có dữ liệu OT được duyệt trong tháng này
                  </td>
                </tr>
              ) : (
                payrollSummary.employees.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-900">{emp.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{emp.department}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{emp.requests.length}</td>
                    <td className="px-4 py-3 text-center font-semibold text-purple-600">{emp.totalHours}h</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {formatCurrency(emp.totalPay)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {payrollSummary.employees.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan="2" className="px-4 py-3 font-semibold text-gray-900">TỔNG CỘNG</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900">{payrollSummary.totalRequests}</td>
                  <td className="px-4 py-3 text-center font-bold text-purple-600">{payrollSummary.totalHours}h</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">
                    {formatCurrency(payrollSummary.totalPay)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* OT Calculation Formula */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Công thức tính lương OT</h4>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Hourly Rate</strong> = Lương cơ bản / 22 ngày / 8 giờ = {formatCurrency(hourlyRate)}/giờ</p>
          <p><strong>OT Pay</strong> = Số giờ OT × Hourly Rate × 1.5</p>
          <p className="text-blue-600 italic">Ví dụ: 3 giờ OT = 3 × {formatCurrency(hourlyRate)} × 1.5 = {formatCurrency(3 * hourlyRate * 1.5)}</p>
        </div>
      </div>
    </div>
  );
};

export default OTPayroll;
