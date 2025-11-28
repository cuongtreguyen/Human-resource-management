import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import fakeApi from '../../services/fakeApi';

const AttendanceCreate = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await fakeApi.getEmployees();
      setEmployees(response.data);

      // Khởi tạo dữ liệu chấm công mặc định cho tất cả nhân viên
      const initialData = {};
      response.data.forEach(emp => {
        initialData[emp.id] = {
          date: new Date().toISOString().split('T')[0],
          clockIn: '08:00',
          clockOut: '17:00',
          overtime: '0',
          status: 'Present'
        };
      });
      setAttendanceData(initialData);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Lấy danh sách phòng ban unique
  const departments = ['all', ...new Set(employees.map(emp => emp.department).filter(Boolean))];

  // Lọc nhân viên theo search và phòng ban
  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.id.toString().includes(searchTerm);
    const matchDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchSearch && matchDept;
  });

  const updateAttendanceRecord = (employeeId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value
      }
    }));
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);

      // Lưu chấm công cho tất cả nhân viên đang hiển thị
      for (const emp of filteredEmployees) {
        const record = attendanceData[emp.id];
        if (record) {
          await fakeApi.createAttendanceRecord({
            employeeId: emp.id,
            date: record.date,
            checkIn: record.clockIn,
            checkOut: record.clockOut,
            status: record.status,
            overtime: parseFloat(record.overtime) || 0
          });
        }
      }

      alert('Lưu chấm công thành công!');
      navigate('/dashboard');
    } catch (err) {
      alert('Không thể lưu chấm công');
      console.error('Save attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700';
      case 'Late': return 'bg-yellow-100 text-yellow-700';
      case 'Absent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bảng Chấm Công</h1>
            <p className="text-purple-100 mt-1">Quản lý chấm công nhân viên</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="success"
              size="md"
              onClick={saveAttendance}
              disabled={loading || filteredEmployees.length === 0}
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {loading ? 'Đang lưu...' : 'Lưu chấm công'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tất cả phòng ban</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {filteredEmployees.length} nhân viên
            </span>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        {loadingEmployees ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-500">Đang tải danh sách nhân viên...</span>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500">Không tìm thấy nhân viên</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phòng ban</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giờ vào</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giờ ra</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tăng ca (h)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const record = attendanceData[employee.id] || {};
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      {/* Employee Info */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium mr-3">
                            {employee.name.split(' ').slice(-1)[0]?.[0] || 'N'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-xs text-gray-500">#{employee.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{employee.department || '-'}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="date"
                          value={record.date || ''}
                          onChange={(e) => updateAttendanceRecord(employee.id, 'date', e.target.value)}
                          className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>

                      {/* Clock In */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="time"
                          value={record.clockIn || ''}
                          onChange={(e) => updateAttendanceRecord(employee.id, 'clockIn', e.target.value)}
                          className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>

                      {/* Clock Out */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="time"
                          value={record.clockOut || ''}
                          onChange={(e) => updateAttendanceRecord(employee.id, 'clockOut', e.target.value)}
                          className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>

                      {/* Overtime */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={record.overtime || '0'}
                          onChange={(e) => updateAttendanceRecord(employee.id, 'overtime', e.target.value)}
                          className="w-16 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={record.status || 'Present'}
                          onChange={(e) => updateAttendanceRecord(employee.id, 'status', e.target.value)}
                          className={`text-sm px-3 py-1 rounded-full border-0 font-medium ${getStatusColor(record.status)}`}
                        >
                          <option value="Present">Có mặt</option>
                          <option value="Late">Đi trễ</option>
                          <option value="Absent">Vắng mặt</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default AttendanceCreate;
