import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import fakeApi from '../../services/fakeApi';
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
  const [payrollRecords, setPayrollRecords] = useState([]);
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
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getPayrollRecords();
      setPayrollRecords(response.data);
    } catch (err) {
      setError('Failed to load payroll records');
      console.error('Payroll data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sample employees data for payroll
  const employees = useMemo(() => [
    {
      id: 1,
      name: 'Nguyễn Văn Bình',
      department: 'Phòng phát triển Phần mềm',
      position: 'Senior Developer',
      email: 'binh.nguyen@company.com',
      phone: '090123456',
      basicSalary: 15000000,
      workingDays: 20,
      lateDays: 2,
      overtimeHours: 8,
      bonuses: 2000000,
      allowances: [{ name: 'Transportation', amount: 500000 }, { name: 'Meals', amount: 300000 }]
    },
    {
      id: 2,
      name: 'Trần Thị Mai',
      department: 'Phòng Marketing',
      position: 'Marketing Coordinator',
      email: 'mai.tran@company.com',
      phone: '090234567',
      basicSalary: 12000000,
      workingDays: 22,
      lateDays: 1,
      overtimeHours: 4,
      bonuses: 1500000,
      allowances: [{ name: 'Transportation', amount: 400000 }, { name: 'Communication', amount: 200000 }]
    },
    {
      id: 3,
      name: 'Lê Văn Hùng',
      department: 'Phòng HR',
      position: 'HR Specialist',
      email: 'hung.le@company.com',
      phone: '090345678',
      basicSalary: 10000000,
      workingDays: 21,
      lateDays: 0,
      overtimeHours: 6,
      bonuses: 1000000,
      allowances: [{ name: 'Transportation', amount: 350000 }, { name: 'Meals', amount: 250000 }]
    },
    {
      id: 4,
      name: 'Phạm Thị Lan',
      department: 'Phòng Phát triển Phần mềm',
      position: 'Junior Developer',
      email: 'lan.pham@company.com',
      phone: '090456789',
      basicSalary: 8000000,
      workingDays: 19,
      lateDays: 3,
      overtimeHours: 12,
      bonuses: 800000,
      allowances: [{ name: 'Transportation', amount: 300000 }, { name: 'Learning', amount: 1000000 }]
    }
  ], []);

  // Generate payroll record for an employee
  const generatePayrollRecord = useCallback((employee) => {
    const basicSalary = employee.basicSalary;
    const allowances = employee.allowances?.reduce((sum, allowance) => sum + allowance.amount, 0) || 0;
    const bonuses = employee.bonuses || 0;
    const deductions = 0; // Không có deductions trong employee data

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
      ...employee,
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
    alert(`Payroll calculated and saved successfully for employee ${employees.find(e => e.id === payrollData.employeeId)?.name}`);
  };

  // Open payroll calculation modal
  const openPayrollModal = (employee) => {
    setSelectedEmployee(employee);
    setShowPayrollModal(true);
  };

  const openPayrollDetailsModal = (employee) => {
    // Tìm payroll record của employee này
    const payrollRecord = payrollRecords.find(record => record.employeeId === employee.id);
    if (payrollRecord) {
      setSelectedPayrollDetails({
        employee: employee,
        payroll: payrollRecord
      });
      setShowPayrollDetailsModal(true);
    } else {
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
      alert('No payroll data to export');
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

    alert('Payroll data exported successfully!');
  };

  // Calculate total payroll statistics
  const payrollStats = payrollRecords.length > 0 ? payrollRecords.reduce((stats, payroll) => ({
    totalEmployees: stats.totalEmployees + 1,
    totalPayroll: stats.totalPayroll + payroll.netSalary,
    totalTax: stats.totalTax + (payroll.socialInsurance + payroll.healthInsurance + payroll.unemploymentInsurance),
    totalInsurance: stats.totalInsurance + (payroll.socialInsurance + payroll.healthInsurance + payroll.unemploymentInsurance)
  }), { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0 }) : 
  { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0 };

  useEffect(() => {
    generateAllPayrolls();
  }, [generateAllPayrolls]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header with purple background */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Payroll Management</h1>
                <p className="text-purple-100 mt-1">Private enterprise salary calculation and disbursement</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowPoliciesModal(true)}
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Policies
                </Button>
                <Button 
                  onClick={exportPayrollData}
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <Select
                  options={[
                    { value: 'all', label: 'All Departments' },
                    { value: 'Phòng phát triển Phần mềm', label: 'Development' },
                    { value: 'Phòng Marketing', label: 'Marketing' },
                    { value: 'Phòng HR', label: 'Human Resources' }
                  ]}
                  defaultValue={selectedDepartment}
                  onChange={(value) => setSelectedDepartment(value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Month</label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  icon={<Calendar className="h-4 w-4" />}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => generateAllPayrolls()}
                  variant="primary"
                  className="w-full"
                >
                  🧮 Generate Payrolls
                </Button>
              </div>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card title="Total Employees" icon={<Users className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{payrollStats.totalEmployees}</div>
                <div className="text-sm text-gray-500">Active employees</div>
              </div>
            </Card>
            
            <Card title="Total Payroll" icon={<DollarSign className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(payrollStats.totalPayroll / 1000000).toFixed(1)}M VND
                </div>
                <div className="text-sm text-gray-500">This month</div>
              </div>
            </Card>
            
            <Card title="Total Tax" icon={<TrendingUp className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {payrollStats.totalTax > 0 ? `${(payrollStats.totalTax / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Tax collected</div>
              </div>
            </Card>
            
            <Card title="Total Insurance" icon={<Building className="h-5 w-5 text-purple-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {payrollStats.totalInsurance > 0 ? `${(payrollStats.totalInsurance / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Social insurance</div>
              </div>
            </Card>
          </div>

          {/* Payroll List */}
          <Card title="Monthly Payroll List" 
            actions={
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => generateAllPayrolls()}
                  variant="secondary"
                  size="sm"
                >
                  Refresh
                </Button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">EMPLOYEE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">DEPARTMENT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">BASIC SALARY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NET SALARY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRecords.map((payroll) => {
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payroll.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payroll.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => openPayrollModal(employee)}
                            >
                              🧮
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => openPayrollDetailsModal(employee)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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

