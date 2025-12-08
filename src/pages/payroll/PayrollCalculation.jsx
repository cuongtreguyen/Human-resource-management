import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calculator, DollarSign, Clock, Gift, AlertTriangle } from 'lucide-react';
import { getRole } from '../../utils/auth';
import { toast } from 'react-toastify';
import { calculatePayroll as calculatePayrollAPI, getPayrollCalculation, createSalaryRecord } from '../../services/payrollService';
import { getEmployeeById } from '../../services/employeeService';

// OT Rate: 100,000 VND per hour
const OT_HOURLY_RATE = 100000;

const PayrollCalculation = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getRole();

  // Lấy employee và payroll data từ navigation state (nếu có)
  const stateEmployee = location.state?.employee;
  const statePayroll = location.state?.payroll;
  const selectedMonth = location.state?.selectedMonth; // ⚠️ QUAN TRỌNG: Tháng đã chọn từ PayrollList
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
    // Nếu có payroll data từ state, dùng luôn
    if (statePayroll) {
      console.log('Using payroll from navigation state:', statePayroll);
      if (statePayroll.netSalary) {
        setCalculatedPayroll({
          basicSalary: statePayroll.basicSalary || statePayroll.baseSalary,
          adjustedBasicSalary: statePayroll.basicSalary || statePayroll.baseSalary,
          overtimeHours: statePayroll.otHours || 0,
          overtimePay: statePayroll.otPay || 0,
          allowances: statePayroll.allowance || statePayroll.allowances || 1000000,
          bonuses: statePayroll.bonus || statePayroll.bonuses || 0,
          generalDeductions: statePayroll.generalDeductions || 0,
          grossIncome: statePayroll.grossIncome,
          socialInsurance: statePayroll.socialInsurance,
          healthInsurance: statePayroll.healthInsurance,
          unemploymentInsurance: statePayroll.unemploymentInsurance,
          personalIncomeTax: statePayroll.personalIncomeTax,
          totalDeductions: statePayroll.totalDeductions,
          netSalary: statePayroll.netSalary
        });
      }
      return;
    }

    // Không gọi API nếu employeeId là fake
    const isFakeId = employeeId?.startsWith('payroll-');
    if (isFakeId) {
      console.log('Skipping API call for fake employeeId');
      return;
    }

    try {
      const calculation = await getPayrollCalculation(employeeId);

      if (calculation) {
        // Pre-fill form with existing data
        setCalculatedPayroll({
          basicSalary: calculation.baseSalary,
          adjustedBasicSalary: calculation.baseSalary,
          overtimeHours: calculation.otHours,
          overtimePay: calculation.otPay || 0,
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

      // Nếu có employee data từ navigation state, dùng luôn (không cần gọi API)
      if (stateEmployee) {
        console.log('Using employee from navigation state:', stateEmployee);
        setEmployee(stateEmployee);
        setFormData({
          basicSalary: stateEmployee.basicSalary || stateEmployee.salary || statePayroll?.basicSalary || 10000000,
          workingDays: stateEmployee.workingDays || 22,
          lateDays: stateEmployee.lateDays || 0,
          overtimeHours: statePayroll?.otHours || stateEmployee.overtimeHours || 0,
          allowances: stateEmployee.allowances?.reduce?.((sum, a) => sum + a.amount, 0) || stateEmployee.allowance || statePayroll?.allowance || 1000000,
          deductions: statePayroll?.generalDeductions || 0,
          bonuses: stateEmployee.bonuses || stateEmployee.bonus || statePayroll?.bonus || 0
        });
        return;
      }

      // Không có state, kiểm tra xem employeeId có phải là ID thật không
      const isFakeId = employeeId?.startsWith('payroll-');
      if (isFakeId) {
        console.error('Cannot load employee with fake ID:', employeeId);
        toast.error('Không có thông tin nhân viên. Vui lòng quay lại và thử lại.');
        return;
      }

      // Call API to get employee by ID
      const emp = await getEmployeeById(employeeId);

      if (emp) {
        setEmployee(emp);
        // ⚠️ QUAN TRỌNG: Lương cơ bản lấy từ EmployeeID (theo BE logic)
        setFormData({
          basicSalary: emp.basicSalary || emp.salary || 10000000, // Lấy từ Employee
          workingDays: emp.workingDays || 22,
          lateDays: emp.lateDays || 0, // BE sẽ tự động tính từ attendance
          overtimeHours: emp.overtimeHours || 0,
          allowances: emp.allowances?.reduce?.((sum, a) => sum + a.amount, 0) || emp.allowance || 1000000,
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
    // ⚠️ QUAN TRỌNG: Lấy employeeId thật (Number/Long) từ nhiều nguồn
    // Ưu tiên: stateEmployee (đã được match từ PayrollList) > employee (từ API) > URL param
    let realId = null;

    // 1. Từ stateEmployee (PayrollList đã truyền sang)
    if (stateEmployee?.employeeId != null) {
      realId = Number(stateEmployee.employeeId);
    } else if (stateEmployee?.id != null && !String(stateEmployee.id).startsWith('payroll-')) {
      realId = Number(stateEmployee.id);
    }

    // 2. Từ employee object (đã load từ API)
    if ((realId == null || isNaN(realId)) && employee) {
      if (employee.employeeId != null) {
        realId = Number(employee.employeeId);
      } else if (employee.id != null) {
        realId = Number(employee.id);
      }
    }

    // 3. Từ URL param (fallback cuối cùng)
    if ((realId == null || isNaN(realId)) && employeeId && !String(employeeId).startsWith('payroll-')) {
      realId = Number(employeeId);
    }

    // Kiểm tra nếu employeeId là fake hoặc không hợp lệ, tính local
    const isFakeId = realId == null || isNaN(realId);
    const numericEmployeeId = isFakeId ? null : realId;

    console.log('🔍 calculatePayroll - ID sources:', {
      stateEmployeeId: stateEmployee?.id,
      stateEmployeeEmployeeId: stateEmployee?.employeeId,
      employeeId: employee?.id,
      employeeEmployeeId: employee?.employeeId,
      urlEmployeeId: employeeId,
      resolvedId: numericEmployeeId
    });


    // Nếu không có employeeId thật, tính local
    if (isFakeId || isNaN(numericEmployeeId)) {
      console.log('Fake employeeId detected, calculating locally. realId:', realId);
      calculatePayrollLocally();
      toast.success('Đã tính lương thành công!');
      return;
    }

    try {

      // Prepare request data theo Backend DTO: PayrollCalculationForAccountantRequestDTO
      // Backend luôn tự động lưu vào database khi tính toán (không có preview mode)
      const requestData = {
        employeeId: numericEmployeeId, // Long (required) - ID của nhân viên
        fullName: employee?.name || employee?.fullName || '',
        baseSalary: Number(formData.basicSalary) || 0, // BigDecimal (required)
        otHours: Number(formData.overtimeHours) || 0, // BigDecimal - Số giờ OT (tự nhập)
        // dayOff và lateDay sẽ được backend tự động tính từ attendance, không cần gửi
        allowance: Number(formData.allowances) || 0, // BigDecimal - Phụ cấp (tự nhập)
        generalDeductions: Number(formData.deductions) || 0, // BigDecimal - Khấu trừ chung (tự nhập)
        bonus: Number(formData.bonuses) || 0, // BigDecimal - Thưởng (tự nhập)
        // payrollId: optional - Nếu có, sẽ gán Salary vào Payroll này
        month: selectedMonth || null // ⚠️ QUAN TRỌNG: Truyền tháng đã chọn để backend lưu đúng tháng
      };

      console.log('📤 Calling calculatePayroll API (will auto-save to DB):', requestData);

      const response = await calculatePayrollAPI(requestData);
      console.log('✅ CalculatePayroll API response:', response);

      // Map response to calculatedPayroll state
      // Backend luôn lưu vào database, response có đầy đủ thông tin đã tính toán
      setCalculatedPayroll({
        ...response,
        employeeId: numericEmployeeId, // ⚠️ LUÔN dùng numericEmployeeId (Long) từ request
        basicSalary: response.baseSalary,
        workingDays: formData.workingDays,
        lateDays: Number(response.lateDay) || 0, // BE tự động tính từ attendance (String -> Number)
        overtimeHours: response.otHours ? Number(response.otHours) : 0, // BigDecimal -> Number
        allowances: response.allowance ? Number(response.allowance) : 0, // BigDecimal -> Number
        bonuses: response.bonus ? Number(response.bonus) : 0, // BigDecimal -> Number
        deductions: response.generalDeductions ? Number(response.generalDeductions) : 0, // BigDecimal -> Number
        adjustedBasicSalary: response.baseSalary ? Number(response.baseSalary) : 0, // Dùng baseSalary từ response
        overtimePay: response.otPay ? Number(response.otPay) : 0, // BE tính: otHours × 100,000 VND
        generalDeductions: response.generalDeductions ? Number(response.generalDeductions) : 0,
        socialInsurance: response.socialInsurance ? Number(response.socialInsurance) : 0, // BHXH 8%
        healthInsurance: response.healthInsurance ? Number(response.healthInsurance) : 0, // BHYT 1.5%
        unemploymentInsurance: response.unemploymentInsurance ? Number(response.unemploymentInsurance) : 0, // BHTN 1%
        personalIncomeTax: response.personalIncomeTax ? Number(response.personalIncomeTax) : 0, // Thuế TNCN
        totalDeductions: response.totalDeductions ? Number(response.totalDeductions) : 0,
        grossIncome: response.grossIncome ? Number(response.grossIncome) : 0,
        netSalary: response.netSalary ? Number(response.netSalary) : 0,
        status: response.status || 'AWAITING' // Status từ response

      });

      toast.success('Đã tính và lưu lương thành công!');
    } catch (err) {
      console.error('Error calculating payroll:', err);
      
      // Error message đã được parse trong payrollService
      let errorMessage = err.message || 'Không thể tính lương. Vui lòng thử lại!';
      
      // Kiểm tra nếu là lỗi database constraint (payment_date)
      if (errorMessage.includes('payment_date') || errorMessage.includes('paymentDate') || 
          errorMessage.includes('null value in column')) {
        errorMessage = '⚠️ Lỗi hệ thống: Backend thiếu thông tin ngày thanh toán (payment_date). Vui lòng liên hệ quản trị viên để sửa lỗi này.';
      }
      
      toast.error(errorMessage);

      // Fallback to local calculation (chỉ hiển thị, không lưu)
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
    // ⚠️ LƯU Ý: Backend đã tự động lưu vào database khi tính lương (không có preview mode)
    // Nút "Lưu bảng lương" chỉ để quay lại trang danh sách
    if (!calculatedPayroll) {
      toast.warning('Vui lòng tính lương trước');
      return;
    }
    // Backend đã lưu rồi, chỉ cần quay lại trang danh sách
    toast.success(`Đã lưu bảng lương cho ${employee?.name || employee?.fullName || calculatedPayroll.fullName || 'nhân viên'}!`);
    navigate('/payroll');
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

  // Safe render với try-catch
  try {
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
              {employee.name || employee.fullName || 'N/A'} - {employee.department || 'N/A'}
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
                    <span className="font-medium">{((calculatedPayroll.adjustedBasicSalary || calculatedPayroll.basicSalary || 0)).toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền tăng ca:</span>
                    <span className="font-medium">{(calculatedPayroll.overtimePay || 0).toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phụ cấp:</span>
                    <span className="font-medium">{(calculatedPayroll.allowances || 0).toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thưởng:</span>
                    <span className="font-medium">{(calculatedPayroll.bonuses || 0).toLocaleString()} VND</span>
                  </div>
                </div>
              </div>

              {/* Khấu trừ */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-semibold text-red-800 mb-3">Khấu trừ</h3>
                <div className="space-y-2 text-sm">
                  {/* Kiểm tra xem có dữ liệu từ API không (có grossIncome hoặc totalDeductions từ API response) */}
                  {calculatedPayroll.grossIncome != null || calculatedPayroll.totalDeductions != null ? (
                    // Có dữ liệu từ API - hiển thị tất cả các field (backend luôn trả về, kể cả = 0)
                    <>
                      <div className="flex justify-between">
                        <span>BHXH (8%):</span>
                        <span className="font-medium">
                          {(calculatedPayroll.socialInsurance || 0).toLocaleString()} VND
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>BHYT (1.5%):</span>
                        <span className="font-medium">
                          {(calculatedPayroll.healthInsurance || 0).toLocaleString()} VND
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>BHTN (1%):</span>
                        <span className="font-medium">
                          {(calculatedPayroll.unemploymentInsurance || 0).toLocaleString()} VND
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thuế TNCN:</span>
                        <span className="font-medium">
                          {(calculatedPayroll.personalIncomeTax || 0).toLocaleString()} VND
                        </span>
                      </div>
                    </>
                  ) : (
                    // Không có dữ liệu từ API (tính local) - chỉ hiển thị ghi chú
                    <p className="text-xs text-gray-500 italic">
                      * BHXH, BHYT, BHTN và Thuế TNCN sẽ được hệ thống tính toán tự động khi lưu bảng lương
                    </p>
                  )}
                  {/* Khấu trừ chung - luôn hiển thị nếu có giá trị */}
                  {(calculatedPayroll.generalDeductions || 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Khấu trừ chung:</span>
                      <span className="font-medium">{(calculatedPayroll.generalDeductions || 0).toLocaleString()} VND</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tổng */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-3">Tổng kết</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tổng thu nhập:</span>
                    <span className="font-medium text-emerald-700">
                      {(calculatedPayroll.grossIncome || (
                        (calculatedPayroll.adjustedBasicSalary || calculatedPayroll.basicSalary || 0) +
                        (calculatedPayroll.overtimePay || 0) +
                        (calculatedPayroll.allowances || 0) +
                        (calculatedPayroll.bonuses || 0)
                      )).toLocaleString()} VND
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tổng khấu trừ:</span>
                    <span className="font-medium text-red-600">
                      -{(calculatedPayroll.totalDeductions != null ? calculatedPayroll.totalDeductions : (
                        (calculatedPayroll.socialInsurance || 0) +
                        (calculatedPayroll.healthInsurance || 0) +
                        (calculatedPayroll.unemploymentInsurance || 0) +
                        (calculatedPayroll.personalIncomeTax || 0) +
                        (calculatedPayroll.generalDeductions || 0)
                      )).toLocaleString()} VND
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-emerald-300">
                    <span>Lương thực lĩnh:</span>
                    <span className="text-emerald-600">
                      {(calculatedPayroll.netSalary != null ? calculatedPayroll.netSalary : (
                        (calculatedPayroll.adjustedBasicSalary || calculatedPayroll.basicSalary || 0) +
                        (calculatedPayroll.overtimePay || 0) +
                        (calculatedPayroll.allowances || 0) +
                        (calculatedPayroll.bonuses || 0) -
                        (
                          (calculatedPayroll.socialInsurance || 0) +
                          (calculatedPayroll.healthInsurance || 0) +
                          (calculatedPayroll.unemploymentInsurance || 0) +
                          (calculatedPayroll.personalIncomeTax || 0) +
                          (calculatedPayroll.generalDeductions || 0)
                        )
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
  } catch (error) {
    console.error('Error rendering PayrollCalculation:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Đã xảy ra lỗi khi tải trang</p>
          <p className="text-gray-500 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/payroll')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }
};

export default PayrollCalculation;
