import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Calendar, BarChart3, Activity, AlertTriangle, CheckCircle, XCircle, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import logsApi from '../../services/logsApi';
<<<<<<< HEAD
import adminLogService from '../../services/adminLogService';

// Mock data để demo
const MOCK_LOGS = [
  {
    id: 1,
    timestamp: new Date().toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'Create',
    action: 'Thêm nhân viên mới: Trần Thị B',
    details: 'ID: NV005, Phòng: IT'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'Update',
    action: 'Cập nhật lương nhân viên: Lê Văn C',
    details: 'Lương cơ bản: 15,000,000 → 18,000,000'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: 'Manager Phạm Thị D',
    type: 'Update',
    action: 'Duyệt đơn nghỉ phép: Hoàng Văn E',
    details: 'Ngày nghỉ: 02/12/2025 - 04/12/2025'
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'Delete',
    action: 'Xóa nhân viên: Ngô Văn F',
    details: 'ID: NV002, Lý do: Nghỉ việc'
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'View',
    action: 'Xem báo cáo lương tháng 11/2025',
    details: 'Tổng số nhân viên: 50'
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: 'System',
    type: 'Attendance',
    action: 'Chấm công vào: Nguyễn Văn Cường',
    details: 'Giờ vào: 08:15:00, Ca: Sáng'
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'Update',
    action: 'Sửa chấm công: Trần Văn G',
    details: 'Giờ ra: 17:00 → 18:30 (OT)'
  },
  {
    id: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: 'Manager Phạm Thị D',
    type: 'Update',
    action: 'Từ chối đăng ký OT: Lê Thị H',
    details: 'Lý do: Không đủ điều kiện'
  },
  {
    id: 9,
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'Create',
    action: 'Tạo phòng ban mới: Marketing',
    details: 'Trưởng phòng: Võ Văn I'
  },
  {
    id: 10,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    user: 'System',
    type: 'Error',
    action: 'Lỗi kết nối camera chấm công',
    details: 'Camera ID: CAM001, Retry: 3 lần'
  },
  {
    id: 11,
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    user: 'Admin Nguyễn Văn A',
    type: 'Navigate',
    action: 'Truy cập trang Quản lý nhân viên',
    details: '/employees'
  },
  {
    id: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    user: 'Accountant Trần Thị K',
    type: 'View',
    action: 'Xem bảng lương nhân viên: Nguyễn Văn L',
    details: 'Tháng: 11/2025'
  },
];
=======
import { getFilteredLogs, getAllLogs, clearAllLogs, cleanOldLogs } from '../../utils/systemLogger';
>>>>>>> 1ca03c9fc33ead406f505540c84dc2bd4a86c0b7

const LogsMonitor = () => {
  const [logs, setLogs] = useState(MOCK_LOGS); // Sử dụng mock data
  const [loading, setLoading] = useState(false); // Không loading vì dùng mock
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState(null); // Log đang xem chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);

<<<<<<< HEAD
  // Load logs - kết hợp mock data và real data
  const loadLogs = async () => {
    try {
      setLoading(true);

      // Get local admin logs
      const localLogs = adminLogService.getLogs(typeFilter, searchTerm, 200);

      // Kết hợp mock data + local logs
      const combinedLogs = [...MOCK_LOGS, ...localLogs].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Remove duplicates by id
      const uniqueLogs = combinedLogs.filter((log, index, self) =>
        index === self.findIndex(l => l.id === log.id)
      );

      // Filter by type
      let filteredLogs = uniqueLogs;
      if (typeFilter !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.type === typeFilter);
=======
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
>>>>>>> 1ca03c9fc33ead406f505540c84dc2bd4a86c0b7
      }

      // Filter by search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredLogs = filteredLogs.filter(log =>
          log.action.toLowerCase().includes(search) ||
          log.user.toLowerCase().includes(search)
        );
      }

      // Filter by date if specified
      if (dateFilter) {
        filteredLogs = filteredLogs.filter(log => log.timestamp.startsWith(dateFilter));
      }

      setLogs(filteredLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
      setLogs(MOCK_LOGS); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Xem chi tiết log
  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nhật Ký Hệ Thống</h1>
            <p className="text-gray-600 mt-1">Theo dõi các thay đổi và hoạt động của Admin</p>
          </div>
          <div className="flex gap-3">
<<<<<<< HEAD
            <button
              onClick={loadLogs}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Làm mới
=======
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
>>>>>>> 1ca03c9fc33ead406f505540c84dc2bd4a86c0b7
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

          {/* Activities Chart - 7 ngày gần nhất */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt Động 7 Ngày Gần Nhất</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {(() => {
                // Tạo 7 ngày gần nhất
                const last7Days = [];
                for (let i = 6; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  last7Days.push({
                    dateObj: date,
                    label: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                    dateStr: date.toLocaleDateString('vi-VN')
                  });
                }

                // Tính số lượng log mỗi ngày
                const dailyCounts = last7Days.map(day => {
                  const count = filteredLogs.filter(log => {
                    const logDate = new Date(log.timestamp).toLocaleDateString('vi-VN');
                    return logDate === day.dateStr;
                  }).length;
                  return { ...day, count };
                });

                const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);

                return dailyCounts.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                        style={{
                          height: `${(day.count / maxCount) * 180}px`,
                          minHeight: day.count > 0 ? '20px' : '4px'
                        }}
                      >
                        {day.count > 0 && (
                          <div className="text-center text-white text-xs font-medium pt-1">
                            {day.count}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium">{day.label}</div>
                  </div>
                ));
              })()}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Tổng hoạt động trong 7 ngày: <span className="font-semibold text-blue-600">{filteredLogs.length}</span>
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
<<<<<<< HEAD
                        <button
                          onClick={() => handleViewDetail(log)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
=======
                        <button 
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          onClick={() => {
                            const detailsStr = log.details ? JSON.stringify(log.details, null, 2) : 'Không có chi tiết';
                            alert(`Chi tiết hành động:\n${detailsStr}\n\nUser Agent: ${log.userAgent || 'N/A'}\nIP: ${log.ip || 'N/A'}`);
                          }}
>>>>>>> 1ca03c9fc33ead406f505540c84dc2bd4a86c0b7
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

        {/* Modal Chi tiết Log */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Chi tiết nhật ký</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Thời gian */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Thời gian</div>
                    <div className="font-medium">{formatTimestamp(selectedLog.timestamp)}</div>
                  </div>
                </div>

                {/* Người thực hiện */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {selectedLog.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Người thực hiện</div>
                    <div className="font-medium">{selectedLog.user}</div>
                  </div>
                </div>

                {/* Loại hành động */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Activity size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Loại hành động</div>
                    <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(selectedLog.type)}`}>
                      {selectedLog.type}
                    </span>
                  </div>
                </div>

                {/* Hành động */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Hành động</div>
                  <div className="font-medium text-gray-900">{selectedLog.action}</div>
                </div>

                {/* Chi tiết */}
                {selectedLog.details && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600 mb-1">Chi tiết</div>
                    <div className="text-blue-900">{selectedLog.details}</div>
                  </div>
                )}

                {/* Target Info */}
                {selectedLog.targetId && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>ID đối tượng:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded">{selectedLog.targetId}</code>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// export default LogsMonitor;
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