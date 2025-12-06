import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, DollarSign, Clock, Gift, AlertTriangle } from 'lucide-react';
import { getRole } from '../../utils/auth';
import { toast } from 'react-toastify';
import { calculatePayroll as calculatePayrollAPI, getPayrollCalculation, createPayroll } from '../../services/payrollService';
import { getEmployeeById } from '../../services/employeeService';

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
    loadExistingCalculation();
  }, [employeeId]);

  // Load existing payroll calculation if available
  const loadExistingCalculation = async () => {
    try {
      const calculation = await getPayrollCalculation(employeeId);

      if (calculation) {
        // Pre-fill form with existing data
        setCalculatedPayroll({
          basicSalary: calculation.baseSalary,
          overtimeHours: calculation.otHours,
          allowances: calculation.allowance,
          bonuses: calculation.bonus,
          generalDeductions: calculation.generalDeductions,
          grossIncome: calculation.grossIncome,
          socialInsurance: calculation.socialInsurance,
          healthInsurance: calculation.healthInsurance,
          unemploymentInsurance: calculation.unemploymentInsurance,
          personalIncomeTax: calculation.personalIncomeTax,
          totalDeductions: calculation.totalDeductions,
          netSalary: calculation.netSalary
        });
      }
    } catch (err) {
      // No existing calculation, that's ok
      console.log('No existing calculation found');
    }
  };

  const loadEmployee = async () => {
    try {
      setLoading(true);

      // Call API to get employee by ID
      const emp = await getEmployeeById(employeeId);

      if (emp) {
        setEmployee(emp);
        setFormData({
          basicSalary: emp.basicSalary || emp.salary || 10000000,
          workingDays: emp.workingDays || 22,
          lateDays: emp.lateDays || 0,
          overtimeHours: emp.overtimeHours || 0,
          allowances: emp.allowances?.reduce((sum, a) => sum + a.amount, 0) || emp.allowance || 1000000,
          deductions: 0,
          bonuses: emp.bonuses || emp.bonus || 0
        });
      }
    } catch (error) {
      console.error('Error loading employee:', error);
      toast.error(error.message || 'Không thể tải thông tin nhân viên');
      // Không navigate để user có thể retry
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = async () => {
    try {
      // Prepare request data theo API spec
      const requestData = {
        employeeId: Number(employeeId),
        fullName: employee?.name || '',
        baseSalary: Number(formData.basicSalary) || 0,
        otHours: Number(formData.overtimeHours) || 0,
        dayOff: String(formData.lateDays),
        lateDay: String(formData.lateDays),
        allowance: Number(formData.allowances) || 0,
        generalDeductions: Number(formData.deductions) || 0,
        bonus: Number(formData.bonuses) || 0
      };

      // Call API to calculate payroll
      const response = await calculatePayrollAPI(requestData);

      // Map response to calculatedPayroll state
      setCalculatedPayroll({
        ...response,
        basicSalary: response.baseSalary,
        workingDays: formData.workingDays,
        lateDays: formData.lateDays,
        overtimeHours: response.otHours,
        allowances: response.allowance,
        bonuses: response.bonus,
        deductions: response.generalDeductions,
        adjustedBasicSalary: response.baseSalary, // API không trả adjusted, dùng baseSalary
        overtimePay: response.otHours * (response.baseSalary / 22 / 8) * 1.5, // Tính từ otHours
        generalDeductions: response.generalDeductions,
        grossIncome: response.grossIncome,
        netSalary: response.netSalary
      });

      toast.success('Đã tính lương thành công!');
    } catch (err) {
      console.error('Error calculating payroll:', err);
      toast.error(err.message || 'Không thể tính lương. Vui lòng thử lại!');

      // Fallback to local calculation
      calculatePayrollLocally();
    }
  };

  const calculatePayrollLocally = () => {
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
      // Prepare payroll data to save
      const payrollData = {
        employeeId: Number(employeeId),
        fullName: employee?.name || '',
        email: employee?.email || '',
        department: employee?.department || '',
        baseSalary: calculatedPayroll.basicSalary,
        otHours: calculatedPayroll.overtimeHours,
        otPay: calculatedPayroll.overtimePay,
        allowance: calculatedPayroll.allowances,
        bonus: calculatedPayroll.bonuses,
        generalDeductions: calculatedPayroll.generalDeductions,
        dayOff: String(formData.lateDays),
        lateDay: String(formData.lateDays),
        grossIncome: calculatedPayroll.grossIncome,
        netSalary: calculatedPayroll.netSalary
      };

      // Call API to create payroll
      await createPayroll(payrollData);

      toast.success(`Đã lưu bảng lương cho ${employee?.name}`);
      navigate('/payroll');
    } catch (error) {
      console.error('Error saving payroll:', error);
      toast.error(error.message || 'Không thể lưu bảng lương');
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
                  {calculatedPayroll.socialInsurance && (
                    <div className="flex justify-between">
                      <span>BHXH (8%):</span>
                      <span className="font-medium">{calculatedPayroll.socialInsurance.toLocaleString()} VND</span>
                    </div>
                  )}
                  {calculatedPayroll.healthInsurance && (
                    <div className="flex justify-between">
                      <span>BHYT (1.5%):</span>
                      <span className="font-medium">{calculatedPayroll.healthInsurance.toLocaleString()} VND</span>
                    </div>
                  )}
                  {calculatedPayroll.unemploymentInsurance && (
                    <div className="flex justify-between">
                      <span>BHTN (1%):</span>
                      <span className="font-medium">{calculatedPayroll.unemploymentInsurance.toLocaleString()} VND</span>
                    </div>
                  )}
                  {calculatedPayroll.personalIncomeTax && (
                    <div className="flex justify-between">
                      <span>Thuế TNCN:</span>
                      <span className="font-medium">{calculatedPayroll.personalIncomeTax.toLocaleString()} VND</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Khấu trừ chung:</span>
                    <span className="font-medium">{(calculatedPayroll.generalDeductions || 0).toLocaleString()} VND</span>
                  </div>
                  {!calculatedPayroll.socialInsurance && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      * BHXH, BHYT, BHTN và Thuế TNCN sẽ được hệ thống tính toán
                    </p>
                  )}
                </div>
              </div>

              {/* Tổng */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-3">Tổng kết</h3>
                <div className="space-y-2">
                  {calculatedPayroll.grossIncome && (
                    <div className="flex justify-between text-sm">
                      <span>Tổng thu nhập:</span>
                      <span className="font-medium text-emerald-700">
                        {calculatedPayroll.grossIncome.toLocaleString()} VND
                      </span>
                    </div>
                  )}
                  {calculatedPayroll.totalDeductions && (
                    <div className="flex justify-between text-sm">
                      <span>Tổng khấu trừ:</span>
                      <span className="font-medium text-red-600">
                        -{calculatedPayroll.totalDeductions.toLocaleString()} VND
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-emerald-300">
                    <span>Lương thực lĩnh:</span>
                    <span className="text-emerald-600">
                      {(calculatedPayroll.netSalary || (
                        calculatedPayroll.adjustedBasicSalary +
                        calculatedPayroll.overtimePay +
                        calculatedPayroll.allowances +
                        calculatedPayroll.bonuses -
                        (calculatedPayroll.generalDeductions || 0)
                      )).toLocaleString()} VND
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
