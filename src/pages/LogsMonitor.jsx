import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Calendar, BarChart3, Activity, AlertTriangle, CheckCircle, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';

const LogsMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Mock data for logs
  useEffect(() => {
    const mockLogs = [
      {
        id: 1,
        timestamp: '2024-10-06T23:22:29Z',
        user: 'admin',
        type: 'View',
        action: 'View user management page',
        details: 'Accessed user management dashboard',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 2,
        timestamp: '2024-10-06T23:22:15Z',
        user: 'admin',
        type: 'View',
        action: 'View edit user form for: admin',
        details: 'Opened edit form for user admin',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 3,
        timestamp: '2024-10-06T23:21:45Z',
        user: 'admin',
        type: 'View',
        action: 'View user management page',
        details: 'Accessed user management dashboard',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 4,
        timestamp: '2024-10-06T23:21:30Z',
        user: 'admin',
        type: 'View',
        action: 'View user management page',
        details: 'Accessed user management dashboard',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 5,
        timestamp: '2024-10-06T23:21:10Z',
        user: 'admin',
        type: 'View',
        action: 'View user management page',
        details: 'Accessed user management dashboard',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 6,
        timestamp: '2024-10-05T15:30:00Z',
        user: 'manager',
        type: 'Create',
        action: 'Created new employee: Nguyen Van C',
        details: 'Added new employee to the system',
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 7,
        timestamp: '2024-10-05T14:15:00Z',
        user: 'employee',
        type: 'Update',
        action: 'Updated personal profile',
        details: 'Modified personal information',
        ip: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        id: 8,
        timestamp: '2024-10-05T10:00:00Z',
        user: 'admin',
        type: 'Error',
        action: 'Failed login attempt',
        details: 'Invalid password for user: testuser',
        ip: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];

    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Calculate statistics
  const stats = {
    total: filteredLogs.length,
    view: filteredLogs.filter(l => l.type === 'View').length,
    navigate: filteredLogs.filter(l => l.type === 'Navigate').length,
    update: filteredLogs.filter(l => l.type === 'Update').length,
    create: filteredLogs.filter(l => l.type === 'Create').length,
    error: filteredLogs.filter(l => l.type === 'Error').length
  };

  // Chart data for action distribution
  const chartData = [
    { name: 'View', value: stats.view, color: '#10B981' },
    { name: 'Navigate', value: stats.navigate, color: '#3B82F6' },
    { name: 'Update', value: stats.update, color: '#F59E0B' },
    { name: 'Create', value: stats.create, color: '#8B5CF6' },
    { name: 'Error', value: stats.error, color: '#EF4444' }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'View': return 'bg-green-100 text-green-700';
      case 'Navigate': return 'bg-blue-100 text-blue-700';
      case 'Update': return 'bg-yellow-100 text-yellow-700';
      case 'Create': return 'bg-purple-100 text-purple-700';
      case 'Delete': return 'bg-red-100 text-red-700';
      case 'Error': return 'bg-red-100 text-red-700';
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
            <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
            <p className="text-gray-600 mt-1">Tracking system behaviors and user actions</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Calendar size={20} />
              Export Logs
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <BarChart3 size={20} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Distribution Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Distribution</h3>
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
                    <div className="text-sm text-gray-500">Total Actions</div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities</h3>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">All</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.view}</div>
              <div className="text-sm text-gray-500">View</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.navigate}</div>
              <div className="text-sm text-gray-500">Navigate</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.update}</div>
              <div className="text-sm text-gray-500">Update</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.create}</div>
              <div className="text-sm text-gray-500">Create</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.error}</div>
              <div className="text-sm text-gray-500">Error</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Find by user</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="View">View</option>
                <option value="Navigate">Navigate</option>
                <option value="Update">Update</option>
                <option value="Create">Create</option>
                <option value="Delete">Delete</option>
                <option value="Error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Filter
              </button>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setDateFilter('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      No logs found
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
                        <button className="text-blue-600 hover:text-blue-700 p-1 rounded">
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
              Showing 1 - {filteredLogs.length} of {filteredLogs.length} results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogsMonitor;
