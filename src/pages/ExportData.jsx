import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { Download, FileText, FileSpreadsheet, File, Calendar, Filter, Users, Building, Briefcase } from 'lucide-react';

const ExportData = () => {
  const [exportOptions, setExportOptions] = useState({
    format: 'excel',
    department: 'all',
    position: 'all',
    status: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    includeColumns: {
      personalInfo: true,
      contactInfo: true,
      employmentInfo: true,
      salaryInfo: false,
      performanceInfo: false
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleInputChange = (field, value) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColumnToggle = (column) => {
    setExportOptions(prev => ({
      ...prev,
      includeColumns: {
        ...prev.includeColumns,
        [column]: !prev.includeColumns[column]
      }
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In real app, this would trigger file download
      alert('Xuất dữ liệu hoàn tất! File sẽ được tải về.');
    }, 3000);
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { value: 'csv', label: 'CSV (.csv)', icon: FileText },
    { value: 'pdf', label: 'PDF (.pdf)', icon: File }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Tất cả phòng ban' },
    { value: 'it', label: 'Phòng IT' },
    { value: 'hr', label: 'Phòng Nhân sự' },
    { value: 'finance', label: 'Phòng Tài chính' },
    { value: 'marketing', label: 'Phòng Marketing' },
    { value: 'sales', label: 'Phòng Kinh doanh' },
    { value: 'operations', label: 'Phòng Vận hành' }
  ];

  const positionOptions = [
    { value: 'all', label: 'Tất cả chức vụ' },
    { value: 'manager', label: 'Quản lý' },
    { value: 'developer', label: 'Lập trình viên' },
    { value: 'accountant', label: 'Kế toán' },
    { value: 'specialist', label: 'Chuyên viên' },
    { value: 'assistant', label: 'Trợ lý' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang làm việc' },
    { value: 'inactive', label: 'Nghỉ việc' },
    { value: 'probation', label: 'Thử việc' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'this_month', label: 'Tháng này' },
    { value: 'last_month', label: 'Tháng trước' },
    { value: 'this_year', label: 'Năm nay' },
    { value: 'custom', label: 'Tùy chỉnh' }
  ];

  const columnOptions = [
    { key: 'personalInfo', label: 'Thông tin cá nhân', description: 'Họ tên, Ngày sinh, Giới tính, CMND' },
    { key: 'contactInfo', label: 'Thông tin liên hệ', description: 'Email, Số điện thoại, Địa chỉ' },
    { key: 'employmentInfo', label: 'Thông tin công việc', description: 'Phòng ban, Chức vụ, Ngày bắt đầu' },
    { key: 'salaryInfo', label: 'Thông tin lương', description: 'Lương cơ bản, Phụ cấp' },
    { key: 'performanceInfo', label: 'Dữ liệu hiệu suất', description: 'Đánh giá, Xếp loại' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Xuất dữ liệu nhân viên</h1>
              <p className="text-purple-100 mt-1">Xuất thông tin nhân viên với nhiều định dạng để báo cáo và phân tích</p>
            </div>
            <Download className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <Card>
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Định dạng xuất</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.value}
                    onClick={() => handleInputChange('format', format.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      exportOptions.format === format.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <format.icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-center">{format.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card>
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Phòng ban"
                  value={exportOptions.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  options={departmentOptions}
                />
                <Select
                  label="Chức vụ"
                  value={exportOptions.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  options={positionOptions}
                />
                <Select
                  label="Trạng thái"
                  value={exportOptions.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statusOptions}
                />
                <Select
                  label="Khoảng thời gian"
                  value={exportOptions.dateRange}
                  onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  options={dateRangeOptions}
                />
              </div>

              {/* Custom Date Range */}
              {exportOptions.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Từ ngày"
                    type="date"
                    value={exportOptions.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                  <Input
                    label="Đến ngày"
                    type="date"
                    value={exportOptions.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              )}
            </Card>

            {/* Column Selection */}
            <Card>
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Chọn cột dữ liệu</h3>
              </div>
              <div className="space-y-3">
                {columnOptions.map((column) => (
                  <div key={column.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeColumns[column.key]}
                          onChange={() => handleColumnToggle(column.key)}
                          className="mr-3"
                        />
                        <span className="font-medium text-gray-900">{column.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 ml-6">{column.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Export Summary & Actions */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt xuất dữ liệu</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Định dạng:</span>
                  <span className="font-medium">
                    {formatOptions.find(f => f.value === exportOptions.format)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phòng ban:</span>
                  <span className="font-medium">
                    {departmentOptions.find(d => d.value === exportOptions.department)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chức vụ:</span>
                  <span className="font-medium">
                    {positionOptions.find(p => p.value === exportOptions.position)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium">
                    {statusOptions.find(s => s.value === exportOptions.status)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số bản ghi ước tính:</span>
                  <span className="font-medium text-purple-600">~150 nhân viên</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setExportOptions({
                      format: 'excel',
                      department: 'all',
                      position: 'all',
                      status: 'all',
                      dateRange: 'all',
                      startDate: '',
                      endDate: '',
                      includeColumns: {
                        personalInfo: true,
                        contactInfo: true,
                        employmentInfo: true,
                        salaryInfo: false,
                        performanceInfo: false
                      }
                    });
                  }}
                >
                  Đặt lại
                </Button>
              </div>
            </Card>

            {/* Export History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Xuất gần đây</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Danh sách NV - Excel</p>
                    <p className="text-xs text-gray-500">2 giờ trước</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Phòng IT - CSV</p>
                    <p className="text-xs text-gray-500">1 ngày trước</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Báo cáo tháng - PDF</p>
                    <p className="text-xs text-gray-500">3 ngày trước</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExportData;
