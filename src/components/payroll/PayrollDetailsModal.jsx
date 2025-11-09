import React from 'react';
import Button from '../ui/Button';
import { X } from 'lucide-react';

const PayrollDetailsModal = ({ isOpen, onClose, payrollData }) => {
  if (!isOpen || !payrollData) return null;

  const { employee, payroll } = payrollData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Chi tiết tính toán</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default PayrollDetailsModal;

