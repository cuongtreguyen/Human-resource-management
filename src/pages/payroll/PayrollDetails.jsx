import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, DollarSign, FileText, Download } from 'lucide-react';
import { getRole } from '../../utils/auth';
import { getEmployeeById } from '../../services/employeeService';
import { getPayrollCalculation } from '../../services/payrollService';

const PayrollDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const userRole = getRole();

  const [employee, setEmployee] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

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
    loadData();
  }, [employeeId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Gọi API lấy thông tin nhân viên
      const emp = await getEmployeeById(employeeId);

      if (emp) {
        setEmployee(emp);

        // Gọi API lấy thông tin payroll calculation
        try {
          const payrollData = await getPayrollCalculation(employeeId);
          setPayroll({
            month: new Date().toISOString().slice(0, 7),
            basicSalary: payrollData.baseSalary || emp.basicSalary || 0,
            allowances: payrollData.allowance || 0,
            bonuses: payrollData.bonus || 0,
            overtimePay: payrollData.otPay || 0,
            grossIncome: payrollData.grossIncome || 0,
            socialInsurance: payrollData.socialInsurance || 0,
            healthInsurance: payrollData.healthInsurance || 0,
            unemploymentInsurance: payrollData.unemploymentInsurance || 0,
            personalIncomeTax: payrollData.personalIncomeTax || 0,
            deductions: payrollData.generalDeductions || 0,
            totalDeductions: payrollData.totalDeductions || 0,
            netSalary: payrollData.netSalary || 0,
            status: payrollData.status || 'PENDING'
          });
        } catch (payrollError) {
          console.log('No payroll calculation found, using defaults');
          // Nếu chưa có payroll, hiển thị thông tin cơ bản
          setPayroll({
            month: new Date().toISOString().slice(0, 7),
            basicSalary: emp.basicSalary || emp.salary || 0,
            allowances: 0,
            bonuses: 0,
            overtimePay: 0,
            grossIncome: 0,
            socialInsurance: 0,
            healthInsurance: 0,
            unemploymentInsurance: 0,
            personalIncomeTax: 0,
            deductions: 0,
            totalDeductions: 0,
            netSalary: 0,
            status: 'NOT_CALCULATED'
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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

  if (!employee || !payroll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin lương</p>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/payroll')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-7 h-7" />
                Chi tiết bảng lương
              </h1>
              <p className="text-white/80 mt-1">
                {employee.name} - Tháng {payroll.month}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Thông tin nhân viên
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Họ tên:</span>
              <span className="font-medium">{employee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium text-sm">{employee.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phòng ban:</span>
              <span className="font-medium">{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Chức vụ:</span>
              <span className="font-medium">{employee.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                payroll.status === 'PAID'
                  ? 'bg-green-100 text-green-800'
                  : payroll.status === 'APPROVED'
                  ? 'bg-blue-100 text-blue-800'
                  : payroll.status === 'NOT_CALCULATED'
                  ? 'bg-gray-100 text-gray-800'
                  : payroll.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {payroll.status === 'PAID' ? 'Đã thanh toán' :
                 payroll.status === 'APPROVED' ? 'Đã duyệt' :
                 payroll.status === 'NOT_CALCULATED' ? 'Chưa tính' :
                 payroll.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ duyệt'}
              </span>
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Thu nhập
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Lương cơ bản:</span>
              <span className="font-medium">{payroll.basicSalary?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phụ cấp:</span>
              <span className="font-medium">{payroll.allowances?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tiền tăng ca:</span>
              <span className="font-medium">{payroll.overtimePay?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Thưởng:</span>
              <span className="font-medium">{payroll.bonuses?.toLocaleString()} VND</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Tổng thu nhập:</span>
              <span>{payroll.grossIncome?.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-red-700 mb-4">
            Khấu trừ
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">BHXH (8%):</span>
              <span className="font-medium">{payroll.socialInsurance?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">BHYT (1.5%):</span>
              <span className="font-medium">{payroll.healthInsurance?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">BHTN (1%):</span>
              <span className="font-medium">{payroll.unemploymentInsurance?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Thuế TNCN:</span>
              <span className="font-medium">{payroll.personalIncomeTax?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Khấu trừ khác:</span>
              <span className="font-medium">{payroll.deductions?.toLocaleString()} VND</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-red-600 font-semibold">
              <span>Tổng khấu trừ:</span>
              <span>{payroll.totalDeductions?.toLocaleString()} VND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-emerald-100">Lương thực nhận</h3>
            <p className="text-sm text-emerald-200 mt-1">Sau khi trừ tất cả các khoản khấu trừ</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{payroll.netSalary?.toLocaleString()}</p>
            <p className="text-emerald-200">VND</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => navigate('/payroll')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={() => navigate(`/payroll/calculate/${employeeId}`)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors"
        >
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};

export default PayrollDetails;
