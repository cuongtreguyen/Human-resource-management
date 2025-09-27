import React, { useState } from 'react';
import { Icon } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PayslipHistory = ({ payslips = [], onDownload, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processed': return 'Đã xử lý';
      case 'processing': return 'Đang xử lý';
      case 'failed': return 'Lỗi';
      default: return 'Chưa xác định';
    }
  };

  const handleDownload = async (payslipId) => {
    setIsDownloading(payslipId);
    try {
      await onDownload(payslipId);
    } finally {
      setIsDownloading(null);
    }
  };

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !filterMonth || payslip.month === filterMonth;
    const matchesStatus = !filterStatus || payslip.status === filterStatus;
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const months = [
    { value: '', label: 'Tất cả tháng' },
    { value: '2024-01', label: 'Tháng 1/2024' },
    { value: '2024-02', label: 'Tháng 2/2024' },
    { value: '2024-03', label: 'Tháng 3/2024' },
    { value: '2024-04', label: 'Tháng 4/2024' },
    { value: '2024-05', label: 'Tháng 5/2024' },
    { value: '2024-06', label: 'Tháng 6/2024' },
  ];

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'processed', label: 'Đã xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'failed', label: 'Lỗi' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử phiếu lương</h2>
          <p className="text-gray-600 mt-1">Quản lý và tải xuống phiếu lương</p>
        </div>
        <div className="text-sm text-gray-500">
          Tổng: {payslips.length} phiếu lương
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Tìm kiếm theo tên nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconName="Search"
        />
        <Select
          value={filterMonth}
          onValueChange={setFilterMonth}
          options={months}
          placeholder="Chọn tháng"
        />
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
          options={statusOptions}
          placeholder="Chọn trạng thái"
        />
      </div>

      {/* Payslips List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        {filteredPayslips.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy phiếu lương</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPayslips.map((payslip) => (
              <div key={payslip.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon name="FileText" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{payslip.employeeName}</h3>
                      <p className="text-sm text-gray-600">Tháng {payslip.month}</p>
                      <p className="text-sm text-gray-500">ID: {payslip.employeeId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {payslip.grossSalary?.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className="text-sm text-gray-600">Tổng lương</p>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payslip.status)}`}>
                      <div className="flex items-center space-x-1">
                        <Icon name={getStatusIcon(payslip.status)} size={14} />
                        <span>{getStatusText(payslip.status)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(payslip)}
                        iconName="Eye"
                        iconPosition="left"
                      >
                        Xem
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownload(payslip.id)}
                        disabled={isDownloading === payslip.id}
                        iconName={isDownloading === payslip.id ? "Loader2" : "Download"}
                        iconPosition="left"
                      >
                        {isDownloading === payslip.id ? 'Đang tải...' : 'Tải xuống'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Payslip Details */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Lương cơ bản</p>
                    <p className="font-medium">{payslip.basicSalary?.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phụ cấp</p>
                    <p className="font-medium">{payslip.allowances?.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Khấu trừ</p>
                    <p className="font-medium text-red-600">{payslip.deductions?.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thực lĩnh</p>
                    <p className="font-medium text-green-600">{payslip.netSalary?.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayslipHistory;
