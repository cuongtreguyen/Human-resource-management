import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Calendar, BarChart3, Activity, AlertTriangle, CheckCircle, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import logsApi from '../../services/logsApi';
import { getFilteredLogs, getAllLogs, clearAllLogs, cleanOldLogs } from '../../utils/systemLogger';

const LogsMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Load logs from localStorage
  useEffect(() => {
    const loadLogs = () => {
      try {
        setLoading(true);
        // Lấy logs từ localStorage với filter
        const logsData = getFilteredLogs(searchTerm, typeFilter, dateFilter);
        setLogs(logsData);
      } catch (error) {
        console.error('Failed to load logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
    
    // Refresh logs mỗi 2 giây để cập nhật real-time
    const interval = setInterval(loadLogs, 2000);
    return () => clearInterval(interval);
  }, [searchTerm, typeFilter, dateFilter]);

  // Filter logs (now handled by API, but keep for fallback)
  const filteredLogs = logs;

  // Calculate statistics
  const stats = {
    total: filteredLogs.length,
    view: filteredLogs.filter(l => l.type === 'View').length,
    navigate: filteredLogs.filter(l => l.type === 'Navigate').length,
    update: filteredLogs.filter(l => l.type === 'Update').length,
    create: filteredLogs.filter(l => l.type === 'Create').length,
    delete: filteredLogs.filter(l => l.type === 'Delete').length,
    approve: filteredLogs.filter(l => l.type === 'Approve').length,
    reject: filteredLogs.filter(l => l.type === 'Reject').length,
    error: filteredLogs.filter(l => l.type === 'Error').length,
    attendance: filteredLogs.filter(l => l.type === 'Attendance').length
  };

  // Chart data for action distribution
  const chartData = [
    { name: 'Xem', value: stats.view, color: '#10B981' },
    { name: 'Điều hướng', value: stats.navigate, color: '#3B82F6' },
    { name: 'Cập nhật', value: stats.update, color: '#F59E0B' },
    { name: 'Tạo mới', value: stats.create, color: '#8B5CF6' },
    { name: 'Lỗi', value: stats.error, color: '#EF4444' },
    { name: 'Chấm công', value: stats.attendance || 0, color: '#6366F1' }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'View': return 'bg-green-100 text-green-700';
      case 'Navigate': return 'bg-blue-100 text-blue-700';
      case 'Update': return 'bg-yellow-100 text-yellow-700';
      case 'Create': return 'bg-purple-100 text-purple-700';
      case 'Delete': return 'bg-red-100 text-red-700';
      case 'Approve': return 'bg-emerald-100 text-emerald-700';
      case 'Reject': return 'bg-orange-100 text-orange-700';
      case 'Error': return 'bg-red-100 text-red-700';
      case 'Attendance': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nhật Ký Hệ Thống</h1>
            <p className="text-gray-600 mt-1">Theo dõi hành vi hệ thống và hoạt động người dùng</p>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa tất cả logs? Hành động này không thể hoàn tác.')) {
                  clearAllLogs();
                  setLogs([]);
                  alert('Đã xóa tất cả logs thành công!');
                  window.location.reload();
                }
              }}
            >
              <Trash2 size={20} />
              Xóa Tất Cả
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              onClick={() => {
                const daysToKeep = prompt('Xóa logs cũ hơn bao nhiêu ngày? (Nhập số ngày, mặc định: 30)', '30');
                if (daysToKeep) {
                  const deleted = cleanOldLogs(parseInt(daysToKeep) || 30);
                  alert(`Đã xóa ${getAllLogs().length - deleted} logs cũ!`);
                  window.location.reload();
                }
              }}
            >
              <Filter size={20} />
              Xóa Logs Cũ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Calendar size={20} />
              Xuất Nhật Ký
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Distribution Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Bổ Hành Động</h3>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Simple donut chart representation */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {chartData.map((item, index) => {
                    const percentage = (item.value / stats.total) * 100;
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const strokeDashoffset = chartData.slice(0, index).reduce((acc, prev) => acc - (prev.value / stats.total) * 100, 0);
                    
                    return (
                      <circle
                        key={item.name}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-500">Tổng Hành Động</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt Động</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {['30/09', '01/10', '02/10', '03/10', '04/10', '05/10', '06/10'].map((date) => {
                const dayLogs = logs.filter(log => formatDate(log.timestamp) === date);
                const maxHeight = Math.max(...chartData.map(d => d.value));
                // Calculate height for chart visualization - removed unused variable
                
                return (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-end gap-1" style={{ height: '200px' }}>
                      {chartData.map((item) => {
                        const count = dayLogs.filter(log => log.type === item.name).length;
                        const itemHeight = count > 0 ? (count / maxHeight) * 200 : 0;
                        
                        return (
                          <div
                            key={item.name}
                            className="w-full rounded-t"
                            style={{ 
                              height: `${itemHeight}px`,
                              backgroundColor: item.color,
                              opacity: 0.8
                            }}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">{date}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Tất cả</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.view}</div>
              <div className="text-sm text-gray-500">Xem</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.navigate}</div>
              <div className="text-sm text-gray-500">Điều hướng</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.update}</div>
              <div className="text-sm text-gray-500">Cập nhật</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.create}</div>
              <div className="text-sm text-gray-500">Tạo mới</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.error}</div>
              <div className="text-sm text-gray-500">Lỗi</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.attendance}</div>
              <div className="text-sm text-gray-500">Chấm công</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm theo người dùng</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm theo tên người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="View">Xem</option>
                <option value="Navigate">Điều hướng</option>
                <option value="Update">Cập nhật</option>
                <option value="Create">Tạo mới</option>
                <option value="Update">Cập nhật</option>
                <option value="Delete">Xóa</option>
                <option value="Approve">Duyệt</option>
                <option value="Reject">Từ chối</option>
                <option value="Error">Lỗi</option>
                <option value="Attendance">Chấm công</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Lọc
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setDateFilter('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải nhật ký...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      Không tìm thấy nhật ký
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {log.user.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{log.user}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(log.type)}`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          onClick={() => {
                            const detailsStr = log.details ? JSON.stringify(log.details, null, 2) : 'Không có chi tiết';
                            alert(`Chi tiết hành động:\n${detailsStr}\n\nUser Agent: ${log.userAgent || 'N/A'}\nIP: ${log.ip || 'N/A'}`);
                          }}
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị 1 - {filteredLogs.length} của {filteredLogs.length} kết quả
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Trước
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogsMonitor;

// Trang "Nhật ký hệ thống" (Admin > Nhật ký hệ thống) hiện:
// Lưu lại tất cả các hành động quan trọng
// Hiển thị logs từ localStorage
// Có thể filter, search và quản lý logs
// Tự động refresh để cập nhật real-time
// Các hành động được log bao gồm:
// Tạo/Sửa/Xóa nhân viên
// Duyệt/Từ chối đơn nghỉ phép
// Tạo đơn nghỉ phép mới
// Xem chi tiết nhân viên