import React, { useState } from 'react';
import {
  FileText, Users, Clock, DollarSign, Briefcase,
  Download, Calendar, TrendingUp, Filter, Search,
  BarChart2, PieChart
} from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Danh sách báo cáo
  const reports = [
    {
      id: 'employees',
      name: 'Báo cáo Nhân sự',
      description: 'Tổng hợp thông tin nhân viên theo phòng ban',
      icon: Users,
      color: 'blue',
      data: {
        total: 156,
        byDepartment: [
          { name: 'Phòng IT', count: 45 },
          { name: 'Phòng Marketing', count: 28 },
          { name: 'Phòng Nhân sự', count: 15 },
          { name: 'Phòng Kinh doanh', count: 38 },
          { name: 'Phòng Tài chính', count: 30 },
        ]
      }
    },
    {
      id: 'attendance',
      name: 'Báo cáo Chấm công',
      description: 'Thống kê giờ làm việc và nghỉ phép',
      icon: Clock,
      color: 'green',
      data: {
        totalWorkDays: 22,
        avgAttendance: 95.5,
        lateCount: 12,
        absentCount: 5
      }
    },
    {
      id: 'payroll',
      name: 'Báo cáo Lương',
      description: 'Tổng hợp chi phí lương tháng',
      icon: DollarSign,
      color: 'yellow',
      data: {
        totalSalary: 2850000000,
        avgSalary: 18269230,
        bonus: 150000000,
        deductions: 85000000
      }
    },
    {
      id: 'tasks',
      name: 'Báo cáo Công việc',
      description: 'Tiến độ và hiệu suất công việc',
      icon: Briefcase,
      color: 'purple',
      data: {
        totalTasks: 89,
        completed: 45,
        inProgress: 32,
        pending: 12
      }
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', gradient: 'from-green-500 to-green-600' },
    yellow: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleExport = (reportId) => {
    alert(`Đang xuất báo cáo ${reportId}...`);
  };

  const renderReportDetail = (report) => {
    const color = colorClasses[report.color];

    switch (report.id) {
      case 'employees':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={`${color.bg} rounded-lg p-4`}>
                <p className="text-sm text-gray-600">Tổng nhân viên</p>
                <p className={`text-3xl font-bold ${color.text}`}>{report.data.total}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Số phòng ban</p>
                <p className="text-3xl font-bold text-gray-700">{report.data.byDepartment.length}</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Phân bố theo phòng ban</h4>
              <div className="space-y-3">
                {report.data.byDepartment.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{dept.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${color.gradient} h-2 rounded-full`}
                          style={{ width: `${(dept.count / report.data.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className={`${color.bg} rounded-lg p-4`}>
              <p className="text-sm text-gray-600">Ngày công</p>
              <p className={`text-3xl font-bold ${color.text}`}>{report.data.totalWorkDays}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Tỷ lệ đi làm</p>
              <p className="text-3xl font-bold text-green-600">{report.data.avgAttendance}%</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Đi muộn</p>
              <p className="text-3xl font-bold text-amber-600">{report.data.lateCount}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Vắng mặt</p>
              <p className="text-3xl font-bold text-red-600">{report.data.absentCount}</p>
            </div>
          </div>
        );

      case 'payroll':
        return (
          <div className="space-y-4">
            <div className={`${color.bg} rounded-lg p-4`}>
              <p className="text-sm text-gray-600">Tổng chi phí lương</p>
              <p className={`text-2xl font-bold ${color.text}`}>{formatCurrency(report.data.totalSalary)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Lương TB</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(report.data.avgSalary)}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Thưởng</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(report.data.bonus)}</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Khấu trừ</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(report.data.deductions)}</p>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        const total = report.data.totalTasks;
        return (
          <div className="space-y-4">
            <div className={`${color.bg} rounded-lg p-4`}>
              <p className="text-sm text-gray-600">Tổng công việc</p>
              <p className={`text-3xl font-bold ${color.text}`}>{total}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{report.data.completed}</p>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-xs text-gray-500">{Math.round((report.data.completed / total) * 100)}%</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{report.data.inProgress}</p>
                <p className="text-sm text-gray-600">Đang làm</p>
                <p className="text-xs text-gray-500">{Math.round((report.data.inProgress / total) * 100)}%</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{report.data.pending}</p>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-xs text-gray-500">{Math.round((report.data.pending / total) * 100)}%</p>
              </div>
            </div>
            {/* Simple progress bar */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Tiến độ tổng thể</h4>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
                <div
                  className="bg-green-500 h-4"
                  style={{ width: `${(report.data.completed / total) * 100}%` }}
                />
                <div
                  className="bg-blue-500 h-4"
                  style={{ width: `${(report.data.inProgress / total) * 100}%` }}
                />
                <div
                  className="bg-gray-400 h-4"
                  style={{ width: `${(report.data.pending / total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Hoàn thành
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Đang làm
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span> Chờ xử lý
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo</h1>
          </div>
          <p className="text-gray-500 ml-12">Xem và xuất các báo cáo tổng hợp</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm báo cáo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports
            .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((report) => {
              const color = colorClasses[report.color];
              const Icon = report.icon;
              const isSelected = selectedReport === report.id;

              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-purple-500' : 'hover:shadow-md'
                  }`}
                >
                  {/* Report Header */}
                  <div
                    className={`bg-gradient-to-r ${color.gradient} p-4 cursor-pointer`}
                    onClick={() => setSelectedReport(isSelected ? null : report.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{report.name}</h3>
                          <p className="text-sm text-white/80">{report.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(report.id);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className={`p-4 transition-all duration-200 ${isSelected ? 'block' : 'hidden'}`}>
                    {renderReportDetail(report)}
                  </div>

                  {/* Quick Stats Preview (when not expanded) */}
                  {!isSelected && (
                    <div className="p-4 border-t">
                      <p className="text-sm text-gray-500">
                        Nhấn để xem chi tiết báo cáo
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Xuất báo cáo nhanh</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport('all')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất tất cả (Excel)
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Xuất PDF
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <PieChart className="w-4 h-4" />
              In báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
