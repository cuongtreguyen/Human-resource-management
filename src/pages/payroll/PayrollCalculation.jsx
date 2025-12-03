import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, DollarSign, Clock, Gift, AlertTriangle } from 'lucide-react';
import { getRole } from '../../utils/auth';
import fakeApi from '../../services/fakeApi';
import { toast } from 'react-toastify';

const PayrollCalculation = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const userRole = getRole();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    basicSalary: 10000000,
    workingDays: 22,
    lateDays: 0,
    overtimeHours: 0,
    allowances: 1000000,
    deductions: 0,
    bonuses: 0
  });
  const [calculatedPayroll, setCalculatedPayroll] = useState(null);

  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-purple-600 to-purple-700';
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [employeeId]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getEmployees();
      const employees = response.data || [];
      const emp = employees.find(e => e.id === employeeId || e.id === String(employeeId));

      if (emp) {
        setEmployee(emp);
        setFormData({
          basicSalary: emp.basicSalary || 10000000,
          workingDays: emp.workingDays || 22,
          lateDays: emp.lateDays || 0,
          overtimeHours: emp.overtimeHours || 0,
          allowances: emp.allowances?.reduce((sum, a) => sum + a.amount, 0) || 1000000,
          deductions: 0,
          bonuses: emp.bonuses || 0
        });
      }
    } catch (error) {
      console.error('Error loading employee:', error);
      toast.error('Không thể tải thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = () => {
    const basicSalary = Number(formData.basicSalary) || 0;
    const workingDays = Number(formData.workingDays) || 22;
    const lateDays = Number(formData.lateDays) || 0;
    const overtimeHours = Number(formData.overtimeHours) || 0;
    const allowances = Number(formData.allowances) || 0;
    const deductions = Number(formData.deductions) || 0;
    const bonuses = Number(formData.bonuses) || 0;

    const dailySalary = basicSalary / 22;
    const actualWorkingDays = workingDays - lateDays * 0.5;
    const adjustedBasicSalary = dailySalary * actualWorkingDays;

    const hourlyRate = dailySalary / 8;
    const overtimePay = overtimeHours * hourlyRate * 1.5;

    const calculation = {
      basicSalary,
      workingDays,
      lateDays,
      overtimeHours,
      allowances,
      bonuses,
      deductions,
      adjustedBasicSalary: Math.round(adjustedBasicSalary),
      overtimePay: Math.round(overtimePay),
      generalDeductions: Math.round(deductions)
    };

    setCalculatedPayroll(calculation);
  };

  const handleSubmit = async () => {
    if (!calculatedPayroll) {
      toast.warning('Vui lòng tính lương trước');
      return;
    }

    try {
      // TODO: Call API to save payroll
      toast.success(`Đã lưu bảng lương cho ${employee?.name}`);
      navigate('/payroll');
    } catch (error) {
      toast.error('Không thể lưu bảng lương');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy nhân viên</p>
          <button
            onClick={() => navigate('/payroll')}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-2xl shadow-xl mb-6`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/payroll')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-7 h-7" />
              Tính lương nhân viên
            </h1>
            <p className="text-white/80 mt-1">
              {employee.name} - {employee.department}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Nhập dữ liệu
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lương cơ bản (VND)
              </label>
              <input
                type="text"
                value={formData.basicSalary.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, basicSalary: Number(value) || 0 });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày công
                </label>
                <input
                  type="number"
                  value={formData.workingDays}
                  onChange={(e) => setFormData({ ...formData, workingDays: Number(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày đi trễ
                </label>
                <input
                  type="number"
                  value={formData.lateDays}
                  onChange={(e) => setFormData({ ...formData, lateDays: Number(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Giờ tăng ca
              </label>
              <input
                type="number"
                value={formData.overtimeHours}
                onChange={(e) => setFormData({ ...formData, overtimeHours: Number(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phụ cấp (VND)
              </label>
              <input
                type="text"
                value={formData.allowances.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, allowances: Number(value) || 0 });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Thưởng (VND)
              </label>
              <input
                type="text"
                value={formData.bonuses.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, bonuses: Number(value) || 0 });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Khấu trừ (VND)
              </label>
              <input
                type="text"
                value={formData.deductions.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, deductions: Number(value) || 0 });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={calculatePayroll}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Tính lương
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Kết quả tính lương</h2>

          {calculatedPayroll ? (
            <div className="space-y-4">
              {/* Thu nhập */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3">Thu nhập</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lương cơ bản (điều chỉnh):</span>
                    <span className="font-medium">{calculatedPayroll.adjustedBasicSalary.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền tăng ca:</span>
                    <span className="font-medium">{calculatedPayroll.overtimePay.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phụ cấp:</span>
                    <span className="font-medium">{calculatedPayroll.allowances.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thưởng:</span>
                    <span className="font-medium">{calculatedPayroll.bonuses.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>

              {/* Khấu trừ */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-semibold text-red-800 mb-3">Khấu trừ</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Khấu trừ chung:</span>
                    <span className="font-medium">{calculatedPayroll.generalDeductions.toLocaleString()} VND</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    * BHXH, BHYT, BHTN và Thuế TNCN sẽ được hệ thống tính toán
                  </p>
                </div>
              </div>

              {/* Tổng */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-3">Tổng kết (tạm tính)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng thu nhập:</span>
                    <span className="text-emerald-600">
                      {(
                        calculatedPayroll.adjustedBasicSalary +
                        calculatedPayroll.overtimePay +
                        calculatedPayroll.allowances +
                        calculatedPayroll.bonuses
                      ).toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate('/payroll')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors"
                >
                  Lưu bảng lương
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl">
              <Calculator className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Nhập dữ liệu và bấm "Tính lương"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculation;
