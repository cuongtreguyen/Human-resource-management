import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { 
  DollarSign, 
  Calculator, 
  Download, 
  Eye, 
  Edit, 
  Calendar, 
  Users, 
  TrendingUp, 
  Building,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Payroll Calculation Modal
const PayrollCalculationModal = ({ isOpen, onClose, onCalculate, employee }) => {
  const [formData, setFormData] = useState({
    basicSalary: employee?.basicSalary || 0,
    workingDays: employee?.workingDays || 20,
    lateDays: employee?.lateDays || 0,
    overtimeHours: employee?.overtimeHours || 0,
    bonuses: 0,
    allowances:  []
  });

  const [calculatedPayroll, setCalculatedPayroll] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        basicSalary: employee.basicSalary || 0,
        workingDays: employee.workingDays || 20,
        lateDays: employee.lateDays || 0,
        overtimeHours: employee.overtimeHours || 0,
        bonuses: employee.bonuses || 0,
        allowances: employee.allowances || []
      });
    }
  }, [employee]);

  const calculatePayroll = () => {
    if (!employee) return;

    const basicSalary = Number(formData.basicSalary);
    const workingDays = Number(formData.workingDays);
    const lateDays = Number(formData.lateDays);
    const overtimeHours = Number(formData.overtimeHours);
    const bonuses = Number(formData.bonuses);

    // Tính toán theo quy định tư nhân
    const dailySalary = basicSalary / 22; // 22 ngày công chuẩn
    const actualWorkingDays = workingDays - lateDays * 0.5; // Trừ 50% ngày công cho ngày đi muộn
    const grossSalary = dailySalary * actualWorkingDays;
    
    // Phụ cấp làm thêm giờ (150% lương giờ chuẩn)
    const hourlyRate = dailySalary / 8; // 8 giờ/ngày
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    
    const allowances = formData.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    
    // Tổng thu nhập
    const totalEarnings = grossSalary + overtimePay + allowances + bonuses;
    
    // Thuế thu nhập cá nhân cho doanh nghiệp tư nhân (5% trên thu nhập > 11 triệu)
    const taxableIncome = Math.max(0, totalEarnings - 11000000);
    const personalIncomeTax = taxableIncome * 0.05;
    
    // Bảo hiểm (10.5% lương cơ bản cho lao động)
    const insurance = basicSalary * 0.105;
    
    // Tính tổng khấu trừ
    const totalDeductions = personalIncomeTax + insurance;
    
    // Lương thực lĩnh
    const netSalary = totalEarnings - totalDeductions;

    const calculation = {
      basicSalary,
      dailySalary: Math.round(dailySalary),
      actualWorkingDays: Math.round(actualWorkingDays * 10) / 10,
      grossSalary: Math.round(grossSalary),
      overtimeHours,
      overtimePay: Math.round(overtimePay),
      allowances: Math.round(allowances),
      bonuses: Math.round(bonuses),
      totalEarnings: Math.round(totalEarnings),
      personalIncomeTax: Math.round(personalIncomeTax),
      insurance: Math.round(insurance),
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary)
    };

    setCalculatedPayroll(calculation);
  };

  const handleSubmit = () => {
    if (calculatedPayroll) {
      onCalculate({ employeeId: employee.id, ...calculatedPayroll });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Payroll Calculation</h2>
              <p className="text-purple-100">Calculate salary for {employee?.name}</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-purple-600">
              ✕
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-96px)]">
          {/* Calculation Form */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (VND)</label>
                <Input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({...formData, basicSalary: Number(e.target.value)})}
                  placeholder="Enter basic salary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <Input
                  type="number"
                  value={formData.workingDays}
                  onChange={(e) => setFormData({...formData, workingDays: Number(e.target.value)})}
                  placeholder="Working days in month"
                  max={30}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Late Days</label>
                <Input
                  type="number"
                  value={formData.lateDays}
                  onChange={(e) => setFormData({...formData, lateDays: Number(e.target.value)})}
                  placeholder="Number of late days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Hours</label>
                <Input
                  type="number"
                  value={formData.overtimeHours}
                  onChange={(e) => setFormData({...formData, overtimeHours: Number(e.target.value)})}
                  placeholder="Total overtime hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bonuses (VND)</label>
                <Input
                  type="number"
                  value={formData.bonuses}
                  onChange={(e) => setFormData({...formData, bonuses: Number(e.target.value)})}
                  placeholder="Additional bonuses"
                />
              </div>

              <Button 
                onClick={calculatePayroll} 
                variant="primary" 
                icon={<Calculator className="h-4 w-4" />}
                className="w-full"
              >
                Calculate Payroll
              </Button>
            </form>
          </div>

          {/* Calculation Results */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {calculatedPayroll ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Results</h3>
                
                {/* Earnings */}
                <Card title="💰 Earnings" className="bg-green-50 border-green-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Salary:</span>
                      <span>{calculatedPayroll.dailySalary.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gross Salary:</span>
                      <span className="font-medium">{calculatedPayroll.grossSalary.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Pay:</span>
                      <span>{calculatedPayroll.overtimePay.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowances:</span>
                      <span>{calculatedPayroll.allowances.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonuses:</span>
                      <span>{calculatedPayroll.bonuses.toLocaleString()} VND</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium text-green-600">
                      <span>Total Earnings:</span>
                      <span>{calculatedPayroll.totalEarnings.toLocaleString()} VND</span>
                    </div>
                  </div>
                </Card>

                {/* Deductions */}
                <Card title="💸 Deductions" className="bg-red-50 border-red-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Personal Income Tax:</span>
                      <span>{calculatedPayroll.personalIncomeTax.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span>{calculatedPayroll.insurance.toLocaleString()} VND</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium text-red-600">
                      <span>Total Deductions:</span>
                      <span>{calculatedPayroll.totalDeductions.toLocaleString()} VND</span>
                    </div>
                  </div>
                </Card>

                {/* Net Salary */}
                <Card title="🎯 Net Salary" className="bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {calculatedPayroll.netSalary.toLocaleString()} VND
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Take home amount</div>
                  </div>
                </Card>

                <Button 
                  onClick={handleSubmit} 
                  variant="primary" 
                  className="w-full"
                >
                  Save Payroll
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Perform calculation to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Payroll Policies Modal
const PayrollPoliciesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Financial Policies</h2>
              <p className="text-purple-100">Company payroll policies and regulations</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-purple-600">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
          <div className="space-y-6">
            <Card title="💼 Salary Policy">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Working Days:</strong> Standard 22 days per month
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Late Penalty:</strong> 50% salary deduction per late day
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Overtime Rate:</strong> 150% of standard hourly rate
                  </div>
                </div>
              </div>
            </Card>

            <Card title="💸 Tax Regulations">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Taxable Income:</strong> Income above 11,000,000 VND
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Tax Rate:</strong> 5% for private enterprises
                  </div>
                </div>
              </div>
            </Card>

            <Card title="🛡️ Insurance">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Social Insurance:</strong> 10.5% of basic salary
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Health Insurance:</strong> Included in social insurance
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Unemployment Insurance:</strong> Included in social insurance
                  </div>
                </div>
              </div>
            </Card>

            <Card title="🎁 Benefits">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Allowances:</strong> Transport, meal, communication allowances
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Bonuses:</strong> Performance, attendance, productivity bonuses
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayrollList = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Sample employees data for payroll
  const employees = [
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
  ];

  // Generate payroll record for an employee
  const generatePayrollRecord = (employee) => {
    const basicSalary = employee.basicSalary;
    const dailySalary = basicSalary / 22;
    const actualWorkingDays = employee.workingDays - employee.lateDays * 0.5;
    const grossSalary = dailySalary * actualWorkingDays;
    
    const hourlyRate = dailySalary / 8;
    const overtimePay = employee.overtimeHours * hourlyRate * 1.5;
    
    const allowances = employee.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    
    const totalEarnings = grossSalary + overtimePay + allowances + employee.bonuses;
    
    const taxableIncome = Math.max(0, totalEarnings - 11000000);
    const personalIncomeTax = taxableIncome * 0.05;
    
    const insurance = basicSalary * 0.105;
    
    const totalDeductions = personalIncomeTax + insurance;
    
    const netSalary = totalEarnings - totalDeductions;

    return {
      ...employee,
      dailySalary: Math.round(dailySalary),
      grossSalary: Math.round(grossSalary),
      overtimePay: Math.round(overtimePay),
      totalEarnings: Math.round(totalEarnings),
      personalIncomeTax: Math.round(personalIncomeTax),
      insurance: Math.round(insurance),
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary),
      month: selectedMonth,
      status: 'Paid',
      paidDate: new Date().toLocaleDateString()
    };
  };

  // Generate all payroll records
  const generateAllPayrolls = () => {
    const payrolls = employees.map(employee => generatePayrollRecord(employee));
    setPayrollRecords(payrolls);
  };

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
    totalTax: stats.totalTax + payroll.personalIncomeTax,
    totalInsurance: stats.totalInsurance + payroll.insurance
  }), { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0 }) : 
  { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0 };

  useEffect(() => {
    generateAllPayrolls();
  }, []);

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
                  icon={<Calculator className="h-4 w-4" />}
                >
                  Generate Payrolls
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
                  {(payrollStats.totalTax / 1000000).toFixed(1)}M VND
                </div>
                <div className="text-sm text-gray-500">Tax collected</div>
              </div>
            </Card>
            
            <Card title="Total Insurance" icon={<Building className="h-5 w-5 text-purple-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(payrollStats.totalInsurance / 1000000).toFixed(1)}M VND
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
                    const employee = employees.find(e => e.id === payroll.id);
                    return (
                      <tr key={payroll.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {employee?.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{employee?.name}</div>
                              <div className="text-sm text-gray-500">{employee?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-700">{payroll.department}</div>
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
                              <Calculator className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
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

        <PayrollPoliciesModal
          isOpen={showPoliciesModal}
          onClose={() => setShowPoliciesModal(false)}
        />
      </div> 
    </Layout>
  );
};

export default PayrollList;
