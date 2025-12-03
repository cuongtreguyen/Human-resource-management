import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';
import { useOTContext } from '../../context/OTContext';

// OT Rate: 100,000 VND per hour
const OT_HOURLY_RATE = 100000;
import {
  DollarSign,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Building,
  FileText,
  Clock,
  X
} from 'lucide-react';
import {
  PayrollDetailsModal,
  PayrollCalculationModal,
  PayrollPoliciesModal
} from '../../components/payroll';

const PayrollList = () => {
  const userRole = getRole(); // Lấy role của user hiện tại
  const { otRequests } = useOTContext(); // Get OT data
  const navigate = useNavigate();

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
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showPayrollDetailsModal, setShowPayrollDetailsModal] = useState(false);
  const [selectedPayrollDetails, setSelectedPayrollDetails] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [restoredFromCanceled, setRestoredFromCanceled] = useState(new Set()); // Track payrolls restored from CANCELED

  useEffect(() => {
    loadEmployees();
  }, []);

  // Get approved OT hours for an employee in selected month
  // OT is visible when Manager approves (status: approved, completed, reviewed, payroll_approved)
  const getEmployeeOTData = useCallback((employeeId, month) => {
    const approvedOT = otRequests.filter(ot =>
      ot.employeeId === employeeId &&
      ot.otDate.startsWith(month) &&
      ['approved', 'completed', 'reviewed', 'payroll_approved'].includes(ot.status)
    );

    const totalHours = approvedOT.reduce((sum, ot) =>
      sum + (ot.report?.actualHours || ot.plannedHours), 0
    );

    const otPay = totalHours * OT_HOURLY_RATE;

    return {
      requests: approvedOT,
      totalHours,
      otPay
    };
  }, [otRequests]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Không thể tải dữ liệu nhân viên');
    } finally {
      setLoading(false);
    }
  };


  // Generate payroll record for an employee
  const generatePayrollRecord = useCallback((employee) => {
    const basicSalary = employee.salary || employee.basicSalary || 0;
    const allowances = 1000000; // Phụ cấp mặc định
    const bonuses = 0;
    const deductions = 0;

    // 🕐 Lấy thông tin OT từ context
    const otData = getEmployeeOTData(employee.id, selectedMonth);
    const otHours = otData.totalHours;
    const otPay = otData.otPay;

    // ⚠️ Khấu trừ chung (phạt đi trễ, nghỉ không phép)
    const generalDeductions = deductions;

    // Không tính BHXH, thuế TNCN, tổng lương - để BE xử lý

    return {
      id: employee.id,
      employeeId: employee.id, // Thêm employeeId để có thể tìm employee
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      basicSalary: basicSalary,
      allowances: allowances,
      bonuses: bonuses,
      deductions: deductions,
      otHours: otHours, // Số giờ OT
      otPay: Math.round(otPay), // Tiền OT
      generalDeductions: Math.round(generalDeductions),
      month: selectedMonth,
      status: 'PENDING', // Chưa save, trạng thái PENDING
      paidDate: null
    };
  }, [selectedMonth, getEmployeeOTData]);

  // Generate all payroll records (auto - no alert)
  const generateAllPayrolls = useCallback(() => {
    if (employees.length === 0) {
      return;
    }
    const payrolls = employees.map(employee => generatePayrollRecord(employee));
    setPayrollRecords(payrolls);
  }, [employees, generatePayrollRecord]);

  // Generate payroll with feedback (button click)
  const handleGeneratePayroll = async () => {
    if (employees.length === 0) {
      alert('Chưa có dữ liệu nhân viên để tạo bảng lương');
      return;
    }

    setIsGenerating(true);
    setGenerateSuccess(false);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const payrolls = employees.map(employee => generatePayrollRecord(employee));
    setPayrollRecords(payrolls);

    setIsGenerating(false);
    setGenerateSuccess(true);

    // Reset success state after 3 seconds
    setTimeout(() => setGenerateSuccess(false), 3000);
  };

  // Handle payroll calculation for specific employee
  const handleCalculatePayroll = async (payrollData) => {
    const updatedPayrolls = [...payrollRecords];
    const employeeIndex = updatedPayrolls.findIndex(p => p.employeeId === payrollData.employeeId);

    // Kiểm tra xem payroll này có phải đang được restore từ CANCELED không
    const isRestored = restoredFromCanceled.has(payrollData.employeeId);

    // Nếu đang restore từ CANCELED, cần xác nhận trước khi đổi thành PAID
    if (isRestored) {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn lưu và xác nhận thanh toán bảng lương đã hủy cho nhân viên ${employees.find(e => e.id === payrollData.employeeId)?.name}?\n\n` +
        `Sau khi xác nhận, trạng thái sẽ chuyển thành "Đã thanh toán" và không thể chỉnh sửa.`
      );

      if (!confirmed) {
        return; // Không làm gì nếu user không xác nhận
      }
    }

    // Không tự set status - để BE xử lý
    const payrollRecord = {
      ...payrollData
      // status và paidDate sẽ được BE set
    };

    if (employeeIndex !== -1) {
      updatedPayrolls[employeeIndex] = {
        ...updatedPayrolls[employeeIndex],
        ...payrollRecord
      };
    } else {
      updatedPayrolls.push({
        ...employees.find(e => e.id === payrollData.employeeId),
        ...payrollRecord,
        month: selectedMonth
      });
    }

    setPayrollRecords(updatedPayrolls);

    // Xóa flag restored sau khi đã save thành công
    if (isRestored) {
      setRestoredFromCanceled(prev => {
        const newSet = new Set(prev);
        newSet.delete(payrollData.employeeId);
        return newSet;
      });
    }

    // Show success message (in real app, would be toast notification)
    alert(`Đã tính và lưu bảng lương thành công cho nhân viên ${employees.find(e => e.id === payrollData.employeeId)?.name}`);
  };

  // Navigate to payroll calculation page
  const openPayrollModal = (employee) => {
    navigate(`/payroll/calculate/${employee.id}`);
  };

  // Rollback payroll record (đổi status thành Canceled, giữ data để chỉnh sửa)
  const handleRollbackPayroll = (payrollId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy bảng lương này? Dữ liệu sẽ được giữ lại để chỉnh sửa.')) {
      setPayrollRecords(payrollRecords.map(p =>
        p.id === payrollId
          ? { ...p, status: 'Canceled', paidDate: null }
          : p
      ));
    }
  };

  const openPayrollDetailsModal = (employee) => {
    console.log('Opening payroll details for:', employee);
    // Tìm payroll record của employee này
    const payrollRecord = payrollRecords.find(record => record.employeeId === employee.id);
    console.log('Found payroll record:', payrollRecord);
    if (payrollRecord) {
      setSelectedPayrollDetails({
        employee: employee,
        payroll: payrollRecord
      });
      setShowPayrollDetailsModal(true);
      console.log('Modal should open now');
    } else {
      console.log('No payroll record found for employee:', employee.id);
      alert('Chưa có dữ liệu payroll cho nhân viên này');
    }
  };

  // Export payroll data (chỉ export những record có status = 'Paid', không export Canceled)
  const exportPayrollData = () => {
    const filteredPayrolls = payrollRecords.filter(payroll => {
      // Chỉ export những record đã được save (status = 'Paid')
      if (payroll.status !== 'Paid') {
        return false;
      }
      if (selectedDepartment !== 'all') {
        return payroll.department === selectedDepartment;
      }
      return true;
    });

    if (filteredPayrolls.length === 0) {
      alert('Không có dữ liệu lương đã lưu để xuất. Vui lòng lưu bảng lương trước khi xuất.');
      return;
    }

    // Simulate CSV export
    const csvContent = [
      ['Employee', 'Department', 'Basic Salary', 'OT Hours', 'OT Pay', 'Net Salary', 'Status', 'Paid Date'],
      ...filteredPayrolls.map(payroll => [
        payroll.name,
        payroll.department,
        payroll.basicSalary.toLocaleString(),
        payroll.otHours || 0,
        (payroll.otPay || 0).toLocaleString(),
        (payroll.netSalary || 0).toLocaleString(),
        payroll.status,
        payroll.paidDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Xuất dữ liệu lương thành công!');
  };

  // Calculate total payroll statistics
  const payrollStats = payrollRecords.length > 0 ? payrollRecords.reduce((stats, payroll) => ({
    totalEmployees: stats.totalEmployees + 1,
    totalPayroll: stats.totalPayroll + (payroll.netSalary || 0),
    totalTax: stats.totalTax + ((payroll.socialInsurance || 0) + (payroll.healthInsurance || 0) + (payroll.unemploymentInsurance || 0)),
    totalInsurance: stats.totalInsurance + ((payroll.socialInsurance || 0) + (payroll.healthInsurance || 0) + (payroll.unemploymentInsurance || 0)),
    totalOTHours: stats.totalOTHours + (payroll.otHours || 0),
    totalOTPay: stats.totalOTPay + (payroll.otPay || 0)
  }), { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0, totalOTHours: 0, totalOTPay: 0 }) :
    { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0, totalOTHours: 0, totalOTPay: 0 };

  // Generate payrolls when employees are loaded or OT data changes
  useEffect(() => {
    if (employees.length > 0) {
      generateAllPayrolls();
    }
  }, [employees, generateAllPayrolls, otRequests]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} p-6`}>
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Quản lý Bảng lương</h1>
                <p className={`${getSubtitleColor()} mt-1`}>
                  {userRole === 'admin' ? 'Tính toán và chi trả lương cho doanh nghiệp' :
                    userRole === 'accountant' ? 'Tính toán lương cho nhân viên' :
                      'Xem thông tin lương của nhân viên'}
                </p>
              </div>
              <div className="flex gap-3">

                {/* Chỉ Accountant mới có quyền xuất dữ liệu */}
                {userRole === 'accountant' && (
                  <Button
                    onClick={exportPayrollData}
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-purple-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất dữ liệu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                <Select
                  options={[
                    { value: 'all', label: 'Tất cả phòng ban' },
                    { value: 'IT', label: 'IT' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Human Resources', label: 'Nhân sự' },
                    { value: 'Finance', label: 'Tài chính' },
                    { value: 'Sales', label: 'Kinh doanh' }
                  ]}
                  defaultValue={selectedDepartment}
                  onChange={(value) => setSelectedDepartment(value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tháng lương</label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  icon={<Calendar className="h-4 w-4" />}
                  className="w-full"
                />
              </div>
              {/* Chỉ Accountant mới có quyền tạo bảng lương */}
              {userRole === 'accountant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thao tác</label>
                  <Button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isGenerating}
                    variant="primary"
                    className={`w-full transition-all duration-300 ${generateSuccess
                        ? 'bg-green-600 hover:bg-green-700'
                        : ''
                      }`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Đang tạo...
                      </span>
                    ) : generateSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        ✅ Tạo thành công!
                      </span>
                    ) : (
                      '🧮 Tạo bảng lương'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card title="Tổng nhân viên" icon={<Users className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{payrollStats.totalEmployees}</div>
                <div className="text-sm text-gray-500">Nhân viên đang làm</div>
              </div>
            </Card>

            <Card title="Tổng lương" icon={<DollarSign className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(payrollStats.totalPayroll / 1000000).toFixed(1)}M VND
                </div>
                <div className="text-sm text-gray-500">Tháng này</div>
              </div>
            </Card>

            <Card title="Tiền OT" icon={<Clock className="h-5 w-5 text-purple-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {payrollStats.totalOTPay > 0 ? `${(payrollStats.totalOTPay / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">{payrollStats.totalOTHours}h OT tháng này</div>
              </div>
            </Card>

            <Card title="Tổng bảo hiểm" icon={<Building className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {payrollStats.totalInsurance > 0 ? `${(payrollStats.totalInsurance / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Bảo hiểm xã hội</div>
              </div>
            </Card>

            <Card title="Tổng thuế" icon={<TrendingUp className="h-5 w-5 text-red-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {payrollStats.totalTax > 0 ? `${(payrollStats.totalTax / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Thuế đã thu</div>
              </div>
            </Card>
          </div>

          {/* Payroll List */}
          <Card title="Bảng lương hàng tháng"
            actions={
              userRole === 'accountant' ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => generateAllPayrolls()}
                    variant="secondary"
                    size="sm"
                  >
                    Làm mới
                  </Button>
                </div>
              ) : null
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NHÂN VIÊN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">PHÒNG BAN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LƯƠNG CƠ BẢN</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ OT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TIỀN OT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LƯƠNG THỰC LĨNH</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRecords
                    .filter(payroll => {
                      if (selectedDepartment === 'all') return true;
                      return payroll.department === selectedDepartment;
                    })
                    .map((payroll) => {
                      const employee = employees.find(e => e.id === payroll.employeeId);
                      return (
                        <tr key={payroll.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {employee?.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{employee?.name || 'Unknown Employee'}</div>
                                <div className="text-sm text-gray-500">{employee?.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-700">{employee?.department || payroll.department || 'N/A'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">
                              {payroll.basicSalary?.toLocaleString()} VND
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {payroll.otHours > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                {payroll.otHours}h
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {payroll.otPay > 0 ? (
                              <div className="font-medium text-purple-600">
                                {payroll.otPay?.toLocaleString()} VND
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-green-600">
                              {(payroll.netSalary || 0).toLocaleString()} VND
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payroll.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : payroll.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : payroll.status === 'Canceled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                              {payroll.status === 'PENDING' ? 'Chờ xử lý' :
                                payroll.status === 'Paid' ? 'Đã thanh toán' :
                                  payroll.status === 'Canceled' ? 'Đã hủy' :
                                    payroll.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 relative z-10">
                              {employee ? (
                                <>
                                  {/* Chỉ Accountant mới có quyền tính lương */}
                                  {userRole === 'accountant' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Opening payroll modal for:', employee);
                                        openPayrollModal(employee);
                                      }}
                                      className="px-3 py-1.5 text-sm rounded-md bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 cursor-pointer"
                                      title="Tính toán lương"
                                    >
                                      🧮
                                    </button>
                                  )}
                                  {/* Tất cả role đều được xem chi tiết */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('Opening details modal for:', employee);
                                      openPayrollDetailsModal(employee);
                                    }}
                                    className="px-3 py-1.5 text-sm rounded-md bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {/* Chỉ Accountant mới có quyền hủy, và chỉ khi status là Paid */}
                                  {userRole === 'accountant' && payroll.status === 'Paid' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRollbackPayroll(payroll.id);
                                      }}
                                      className="px-3 py-1.5 text-sm rounded-md bg-white text-red-600 border border-red-300 hover:bg-red-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                      title="Hủy bảng lương"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                  {/* Hiển thị nút xóa disabled khi status là PENDING */}
                                  {userRole === 'accountant' && payroll.status === 'PENDING' && (
                                    <button
                                      disabled
                                      className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-400 border border-gray-200 font-medium transition-all duration-200 cursor-not-allowed flex items-center gap-1"
                                      title="Không thể hủy khi chưa lưu"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                  {/* Hiển thị nút chỉnh sửa khi status là Canceled */}
                                  {userRole === 'accountant' && payroll.status === 'Canceled' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Đánh dấu payroll này đang được restore từ CANCELED
                                        setRestoredFromCanceled(prev => new Set(prev).add(payroll.employeeId));
                                        // Mở modal chỉnh sửa và đổi status về PENDING để có thể save lại
                                        setPayrollRecords(payrollRecords.map(p =>
                                          p.id === payroll.id
                                            ? { ...p, status: 'PENDING' }
                                            : p
                                        ));
                                        openPayrollModal(employee);
                                      }}
                                      className="px-3 py-1.5 text-sm rounded-md bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                      title="Chỉnh sửa bảng lương đã hủy"
                                    >
                                      ✏️
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400 text-sm">Không có dữ liệu</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Modals */}
        <PayrollCalculationModal
          isOpen={showPayrollModal}
          onClose={() => setShowPayrollModal(false)}
          onCalculate={handleCalculatePayroll}
          employee={selectedEmployee}
        />

        <PayrollDetailsModal
          isOpen={showPayrollDetailsModal}
          onClose={() => setShowPayrollDetailsModal(false)}
          payrollData={selectedPayrollDetails}
        />

        <PayrollPoliciesModal
          isOpen={showPoliciesModal}
          onClose={() => setShowPoliciesModal(false)}
        />

        {/* Modal Xác nhận Tạo Bảng lương */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  🧮 Tạo bảng lương
                </h3>
                <p className="text-emerald-100 text-sm mt-1">Xác nhận thông tin trước khi tạo</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Thông tin tháng */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tháng lương
                    </span>
                    <span className="font-bold text-gray-900">{selectedMonth}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Số nhân viên
                    </span>
                    <span className="font-bold text-blue-600">{employees.length} người</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Phòng ban
                    </span>
                    <span className="font-bold text-gray-900">
                      {selectedDepartment === 'all' ? 'Tất cả' : selectedDepartment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-gray-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Tổng lương ước tính
                    </span>
                    <span className="font-bold text-green-600">
                      {(employees.reduce((sum, emp) => sum + (emp.salary || emp.basicSalary || 0), 0) / 1000000).toFixed(1)}M VND
                    </span>
                  </div>
                </div>

                {/* Lưu ý */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động tính lương dựa trên lương cơ bản, OT đã duyệt và các khoản bảo hiểm theo quy định.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleGeneratePayroll();
                  }}
                  variant="primary"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  ✅ Xác nhận tạo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PayrollList;

