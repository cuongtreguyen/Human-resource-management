import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';
import {
  DollarSign,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Building,
  FileText
} from 'lucide-react';
import {
  PayrollDetailsModal,
  PayrollCalculationModal,
  PayrollPoliciesModal
} from '../../components/payroll';

const PayrollList = () => {
  const userRole = getRole(); // Lấy role của user hiện tại

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

  useEffect(() => {
    loadEmployees();
  }, []);

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

    // 💰 Tính tổng thu nhập
    const grossIncome = basicSalary + allowances + bonuses;

    // 🧾 Bảo hiểm (BHXH 8% + BHYT 1.5% + BHTN 1% = 10.5%)
    const socialInsurance = basicSalary * 0.08; // BHXH 8%
    const healthInsurance = basicSalary * 0.015; // BHYT 1.5%
    const unemploymentInsurance = basicSalary * 0.01; // BHTN 1%
    const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

    // ⚠️ Khấu trừ chung (phạt đi trễ, nghỉ không phép)
    const generalDeductions = deductions;

    // ✅ Lương thực nhận
    const netSalary = grossIncome - totalInsurance - generalDeductions;

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
      grossIncome: Math.round(grossIncome),
      socialInsurance: Math.round(socialInsurance),
      healthInsurance: Math.round(healthInsurance),
      unemploymentInsurance: Math.round(unemploymentInsurance),
      totalInsurance: Math.round(totalInsurance),
      generalDeductions: Math.round(generalDeductions),
      netSalary: Math.round(netSalary),
      month: selectedMonth,
      status: 'Paid',
      paidDate: new Date().toLocaleDateString()
    };
  }, [selectedMonth]);

  // Generate all payroll records
  const generateAllPayrolls = useCallback(() => {
    if (employees.length === 0) {
      return;
    }
    const payrolls = employees.map(employee => generatePayrollRecord(employee));
    setPayrollRecords(payrolls);
  }, [employees, generatePayrollRecord]);

  // Handle payroll calculation for specific employee
  const handleCalculatePayroll = (payrollData) => {
    const updatedPayrolls = [...payrollRecords];
    const employeeIndex = updatedPayrolls.findIndex(p => p.employeeId === payrollData.employeeId);

    if (employeeIndex !== -1) {
      updatedPayrolls[employeeIndex] = {
        ...updatedPayrolls[employeeIndex],
        ...payrollData,
        status: 'Paid',
        paidDate: new Date().toLocaleDateString()
      };
    } else {
      updatedPayrolls.push({
        ...employees.find(e => e.id === payrollData.employeeId),
        ...payrollData,
        month: selectedMonth,
        status: 'Paid',
        paidDate: new Date().toLocaleDateString()
      });
    }

    setPayrollRecords(updatedPayrolls);

    // Show success message (in real app, would be toast notification)
    alert(`Đã tính và lưu bảng lương thành công cho nhân viên ${employees.find(e => e.id === payrollData.employeeId)?.name}`);
  };

  // Open payroll calculation modal
  const openPayrollModal = (employee) => {
    setSelectedEmployee(employee);
    setShowPayrollModal(true);
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

  // Export payroll data
  const exportPayrollData = () => {
    const filteredPayrolls = payrollRecords.filter(payroll => {
      if (selectedDepartment !== 'all') {
        return payroll.department === selectedDepartment;
      }
      return true;
    });

    if (filteredPayrolls.length === 0) {
      alert('Không có dữ liệu lương để xuất');
      return;
    }

    // Simulate CSV export
    const csvContent = [
      ['Employee', 'Department', 'Basic Salary', 'Net Salary', 'Status', 'Paid Date'],
      ...filteredPayrolls.map(payroll => [
        payroll.name,
        payroll.department,
        payroll.basicSalary.toLocaleString(),
        payroll.netSalary.toLocaleString(),
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
    totalPayroll: stats.totalPayroll + payroll.netSalary,
    totalTax: stats.totalTax + (payroll.socialInsurance + payroll.healthInsurance + payroll.unemploymentInsurance),
    totalInsurance: stats.totalInsurance + (payroll.socialInsurance + payroll.healthInsurance + payroll.unemploymentInsurance)
  }), { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0 }) :
    { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0 };

  // Generate payrolls when employees are loaded
  useEffect(() => {
    if (employees.length > 0) {
      generateAllPayrolls();
    }
  }, [employees, generateAllPayrolls]);

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
              <div className="flex items-end">
                {/* Chỉ Accountant mới có quyền tạo bảng lương */}
                {userRole === 'accountant' ? (
                  <Button
                    onClick={() => generateAllPayrolls()}
                    variant="primary"
                    className="w-full"
                  >
                    🧮 Tạo bảng lương
                  </Button>
                ) : (
                  <div>

                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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

            <Card title="Tổng thuế" icon={<TrendingUp className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {payrollStats.totalTax > 0 ? `${(payrollStats.totalTax / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Thuế đã thu</div>
              </div>
            </Card>

            <Card title="Tổng bảo hiểm" icon={<Building className="h-5 w-5 text-purple-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {payrollStats.totalInsurance > 0 ? `${(payrollStats.totalInsurance / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Bảo hiểm xã hội</div>
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
                          <td className="py-3 px-4">
                            <div className="font-medium text-green-600">
                              {payroll.netSalary?.toLocaleString()} VND
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payroll.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {payroll.status}
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
      </div>
    </Layout>
  );
};

export default PayrollList;

