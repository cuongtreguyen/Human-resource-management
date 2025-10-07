import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import fakeApi from '../services/fakeApi';
import { 
  DollarSign, 
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
  AlertCircle,
  X
} from 'lucide-react';

// Payroll Details Modal
const PayrollDetailsModal = ({ isOpen, onClose, payrollData }) => {
  if (!isOpen || !payrollData) return null;

  const { employee, payroll } = payrollData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">📊 Payroll Details</h2>
              <p className="text-purple-100">Chi tiết lương của {employee.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">👤 Thông tin nhân viên</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium">{employee.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{employee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phòng ban:</span>
                  <span className="font-medium">{employee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chức vụ:</span>
                  <span className="font-medium">{employee.position}</span>
                </div>
              </div>
            </div>

            {/* Payroll Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">💰 Tổng quan lương</h3>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tháng:</span>
                  <span className="font-medium">{payroll.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lương cơ bản:</span>
                  <span className="font-medium">{payroll.basicSalary?.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lương thực nhận:</span>
                  <span className="font-medium text-green-600">{payroll.netSalary?.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    payroll.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payroll.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Chi tiết tính toán</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">💰 Thu nhập</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lương cơ bản:</span>
                    <span>{payroll.basicSalary?.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phụ cấp:</span>
                    <span>{payroll.allowances?.toLocaleString() || '0'} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thưởng:</span>
                    <span>{payroll.bonuses?.toLocaleString() || '0'} VND</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium text-green-600">
                    <span>Tổng thu nhập:</span>
                    <span>{payroll.grossIncome?.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">💸 Khấu trừ</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>BHXH (8%):</span>
                    <span>{payroll.socialInsurance?.toLocaleString() || '0'} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BHYT (1.5%):</span>
                    <span>{payroll.healthInsurance?.toLocaleString() || '0'} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BHTN (1%):</span>
                    <span>{payroll.unemploymentInsurance?.toLocaleString() || '0'} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khấu trừ chung:</span>
                    <span>{payroll.deductions?.toLocaleString() || '0'} VND</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium text-red-600">
                    <span>Tổng khấu trừ:</span>
                    <span>{((payroll.socialInsurance || 0) + (payroll.healthInsurance || 0) + (payroll.unemploymentInsurance || 0) + (payroll.deductions || 0)).toLocaleString()} VND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">✅ Lương thực nhận</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {payroll.netSalary?.toLocaleString()} VND
                </div>
                <div className="text-sm text-gray-600 mt-2">Sau khi trừ tất cả các khoản khấu trừ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <Button 
            onClick={onClose} 
            variant="secondary"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

// Payroll Calculation Modal
const PayrollCalculationModal = ({ isOpen, onClose, onCalculate, employee }) => {
  const [formData, setFormData] = useState({
    basicSalary: 10000000,
    workingDays: 30,
    lateDays: 5,
    overtimeHours: 2,
    allowances: 1000000,
    deductions: 0,
    bonuses: 200000
  });

  const [calculatedPayroll, setCalculatedPayroll] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        basicSalary: employee.basicSalary || 10000000,
        workingDays: employee.workingDays || 30,
        lateDays: employee.lateDays || 5,
        overtimeHours: employee.overtimeHours || 2,
        allowances: employee.allowances?.reduce((sum, allowance) => sum + allowance.amount, 0) || 1000000,
        deductions: 0,
        bonuses: employee.bonuses || 200000
      });
    }
  }, [employee]);

  const calculatePayroll = () => {
    console.log('Calculate Payroll clicked!');
    console.log('Employee:', employee);
    console.log('Form Data:', formData);
    
    const basicSalary = Number(formData.basicSalary) || 10000000;
    const workingDays = Number(formData.workingDays) || 30;
    const lateDays = Number(formData.lateDays) || 5;
    const overtimeHours = Number(formData.overtimeHours) || 2;
    const allowances = Number(formData.allowances) || 1000000;
    const deductions = Number(formData.deductions) || 0;
    const bonuses = Number(formData.bonuses) || 200000;

    // 💰 Tính lương cơ bản (đã điều chỉnh theo ngày làm việc)
    const dailySalary = basicSalary / 22; // Lương theo ngày
    const actualWorkingDays = workingDays - lateDays * 0.5; // Trừ 50% lương cho mỗi ngày đi trễ
    const adjustedBasicSalary = dailySalary * actualWorkingDays;

    // ⏰ Tính lương làm thêm giờ
    const hourlyRate = dailySalary / 8; // Lương theo giờ
    const overtimePay = overtimeHours * hourlyRate * 1.5; // Làm thêm giờ tính 150%

    // 💰 Tính tổng thu nhập
    const grossIncome = adjustedBasicSalary + overtimePay + allowances + bonuses;

    // 🧾 Bảo hiểm (BHXH 8% + BHYT 1.5% + BHTN 1% = 10.5%)
    const socialInsurance = basicSalary * 0.08; // BHXH 8%
    const healthInsurance = basicSalary * 0.015; // BHYT 1.5%
    const unemploymentInsurance = basicSalary * 0.01; // BHTN 1%
    const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

    // 💼 Thuế TNCN (5% cho thu nhập trên 11,000,000 VND)
    const taxableIncome = Math.max(0, grossIncome - 11000000);
    const personalIncomeTax = taxableIncome * 0.05;

    // ⚠️ Khấu trừ chung (phạt đi trễ, nghỉ không phép)
    const generalDeductions = deductions;

    // ✅ Lương thực nhận
    const netSalary = grossIncome - totalInsurance - personalIncomeTax - generalDeductions;

    const calculation = {
      // Input data
      basicSalary: basicSalary,
      workingDays: workingDays,
      lateDays: lateDays,
      overtimeHours: overtimeHours,
      allowances: allowances,
      bonuses: bonuses,
      deductions: deductions,
      
      // Calculated amounts
      adjustedBasicSalary: Math.round(adjustedBasicSalary),
      overtimePay: Math.round(overtimePay),
      grossIncome: Math.round(grossIncome),
      socialInsurance: Math.round(socialInsurance),
      healthInsurance: Math.round(healthInsurance),
      unemploymentInsurance: Math.round(unemploymentInsurance),
      totalInsurance: Math.round(totalInsurance),
      personalIncomeTax: Math.round(personalIncomeTax),
      generalDeductions: Math.round(generalDeductions),
      netSalary: Math.round(netSalary)
    };

    console.log('Calculation result:', calculation);
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
              <h2 className="text-xl font-semibold">🧮 Payroll Calculation</h2>
              <p className="text-purple-100">Calculate salary for {employee?.name}</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-purple-600">
              ✕
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-96px)]">
          {/* Input Form */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">📝 Input Data</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (VND)</label>
                <input
                  type="text"
                  value={formData.basicSalary}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, basicSalary: Number(value) || 0});
                  }}
                  placeholder="Enter basic salary"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <input
                  type="text"
                  value={formData.workingDays}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, workingDays: Number(value) || 0});
                  }}
                  placeholder="Working days in month"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Late Days</label>
                <input
                  type="text"
                  value={formData.lateDays}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, lateDays: Number(value) || 0});
                  }}
                  placeholder="Number of late days"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Hours</label>
                <input
                  type="text"
                  value={formData.overtimeHours}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, overtimeHours: Number(value) || 0});
                  }}
                  placeholder="Total overtime hours"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">💸 Phụ cấp (VND)</label>
                <input
                  type="text"
                  value={formData.allowances}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, allowances: Number(value) || 0});
                  }}
                  placeholder="Phụ cấp ăn trưa, điện thoại, xăng xe..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">⚠️ Khấu trừ chung (VND)</label>
                <input
                  type="text"
                  value={formData.deductions}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, deductions: Number(value) || 0});
                  }}
                  placeholder="Phạt đi trễ, nghỉ không phép..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bonuses (VND)</label>
                <input
                  type="text"
                  value={formData.bonuses}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, bonuses: Number(value) || 0});
                  }}
                  placeholder="Additional bonuses"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <button 
                onClick={calculatePayroll} 
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 font-medium"
              >
                🧮 Calculate Payroll
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">📊 Calculation Results</h2>
            
            {calculatedPayroll ? (
              <div className="space-y-4">
                
                {/* Earnings */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3">💰 Thu nhập</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>💰 Lương cơ bản:</span>
                      <span>{calculatedPayroll.adjustedBasicSalary.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⏰ Làm thêm giờ:</span>
                      <span>{calculatedPayroll.overtimePay.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💸 Phụ cấp:</span>
                      <span>{calculatedPayroll.allowances.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🎁 Thưởng:</span>
                      <span>{calculatedPayroll.bonuses.toLocaleString()} VND</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium text-green-600">
                      <span>Tổng thu nhập:</span>
                      <span>{calculatedPayroll.grossIncome.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-3">💸 Khấu trừ</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>⚠️ Khấu trừ chung:</span>
                      <span>{calculatedPayroll.generalDeductions.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🧾 Bảo hiểm (10.5%):</span>
                      <span>{calculatedPayroll.totalInsurance.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💼 Thuế TNCN:</span>
                      <span>{calculatedPayroll.personalIncomeTax.toLocaleString()} VND</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium text-red-600">
                      <span>Tổng khấu trừ:</span>
                      <span>{(calculatedPayroll.totalInsurance + calculatedPayroll.personalIncomeTax + calculatedPayroll.generalDeductions).toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">✅ Lương thực nhận</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {calculatedPayroll.netSalary.toLocaleString()} VND
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Sau khi trừ tất cả các khoản khấu trừ</div>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📋 Công thức tính toán</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-800 mb-2">Công thức:</div>
                      <div className="text-sm">
                        Lương thực nhận = Lương cơ bản + Phụ cấp + Thưởng - (BHXH + BHYT + BHTN + Khấu trừ chung)
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-800 mb-2">Tính toán cụ thể:</div>
                      <div className="text-sm">
                        {calculatedPayroll.basicSalary.toLocaleString()} + {calculatedPayroll.allowances.toLocaleString()} + {calculatedPayroll.bonuses.toLocaleString()} - ({calculatedPayroll.socialInsurance.toLocaleString()} + {calculatedPayroll.healthInsurance.toLocaleString()} + {calculatedPayroll.unemploymentInsurance.toLocaleString()} + {calculatedPayroll.generalDeductions.toLocaleString()}) = {calculatedPayroll.netSalary.toLocaleString()} VND
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  variant="primary" 
                  className="w-full"
                >
                  Save Payroll
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🧮</div>
                  <p className="text-lg">Perform calculation to see results</p>
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
  const [showPayrollDetailsModal, setShowPayrollDetailsModal] = useState(false);
  const [selectedPayrollDetails, setSelectedPayrollDetails] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

