import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

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
    const basicSalary = Number(formData.basicSalary) || 10000000;
    const workingDays = Number(formData.workingDays) || 30;
    const lateDays = Number(formData.lateDays) || 5;
    const overtimeHours = Number(formData.overtimeHours) || 2;
    const allowances = Number(formData.allowances) || 1000000;
    const deductions = Number(formData.deductions) || 0;
    const bonuses = Number(formData.bonuses) || 200000;

    const dailySalary = basicSalary / 22;
    const actualWorkingDays = workingDays - lateDays * 0.5;
    const adjustedBasicSalary = dailySalary * actualWorkingDays;

    const hourlyRate = dailySalary / 8;
    const overtimePay = overtimeHours * hourlyRate * 1.5;

    const grossIncome = adjustedBasicSalary + overtimePay + allowances + bonuses;

    const socialInsurance = basicSalary * 0.08;
    const healthInsurance = basicSalary * 0.015;
    const unemploymentInsurance = basicSalary * 0.01;
    const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

    const taxableIncome = Math.max(0, grossIncome - 11000000);
    const personalIncomeTax = taxableIncome * 0.05;

    const generalDeductions = deductions;

    const netSalary = grossIncome - totalInsurance - personalIncomeTax - generalDeductions;

    const calculation = {
      basicSalary: basicSalary,
      workingDays: workingDays,
      lateDays: lateDays,
      overtimeHours: overtimeHours,
      allowances: allowances,
      bonuses: bonuses,
      deductions: deductions,
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

          <div className="w-1/2 p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">📊 Calculation Results</h2>
            
            {calculatedPayroll ? (
              <div className="space-y-4">
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">✅ Lương thực nhận</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {calculatedPayroll.netSalary.toLocaleString()} VND
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Sau khi trừ tất cả các khoản khấu trừ</div>
                  </div>
                </div>

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

export default PayrollCalculationModal;

