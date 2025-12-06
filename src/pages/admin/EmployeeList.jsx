import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { EmployeeSummaryCards, Pagination } from '../../components/employee';
import { getRole, isAdmin } from '../../utils/auth';
import { canViewSalary } from '../../utils/fieldPermissions';
import { logDeleteEmployee, logViewDetail } from '../../utils/systemLogger';
import { UserPlus } from 'lucide-react';
import { http, JAVA_API } from '../../services/config';

const EmployeeList = () => {
  const navigate = useNavigate();
  const userRole = getRole();

  const getBannerColor = () => {
    switch (userRole) {
      case 'admin': return 'from-blue-500 to-blue-600';
      case 'manager': return 'from-purple-600 to-purple-700';
      case 'accountant': return 'from-emerald-600 to-emerald-700';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin': return 'text-blue-100';
      case 'manager': return 'text-purple-100';
      case 'accountant': return 'text-emerald-100';
      default: return 'text-orange-100';
    }
  };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    department: 'Tất cả phòng ban',
    position: 'Tất cả chức vụ',
    salaryRange: 'Tất cả mức lương'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // ===== TẢI DỮ LIỆU TỪ API JAVA =====
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await http(`${JAVA_API}/employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Không thể tải danh sách`);
      }

      const result = await response.json();
      
      // Backend trả về: { success: true, data: [...] }
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data);
      } else {
        throw new Error('Dữ liệu không hợp lệ từ server');
      }
    } catch (err) {
      console.error('Load employees error:', err);
      setError(err.message || 'Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Tất cả phòng ban', 'Công nghệ thông tin', 'Marketing', 'Kinh doanh', 'Nhân sự', 'Tài chính'];
  const positions = ['Tất cả chức vụ', 'Lập trình viên', 'Quản lý', 'Chuyên viên', 'Phân tích viên', 'Giám đốc'];
  const salaryRanges = ['Tất cả mức lương', '10 - 15 triệu', '15 - 20 triệu', '20 - 30 triệu', 'Trên 30 triệu'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.email?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDepartment = filters.department === 'Tất cả phòng ban' || employee.department === filters.department;
    const matchesPosition = filters.position === 'Tất cả chức vụ' || employee.position === filters.position;

    let matchesSalary = true;
    const salary = employee.salary || employee.baseSalary || 0;
    if (filters.salaryRange === '10 - 15 triệu') {
      matchesSalary = salary >= 10000000 && salary < 15000000;
    } else if (filters.salaryRange === '15 - 20 triệu') {
      matchesSalary = salary >= 15000000 && salary < 20000000;
    } else if (filters.salaryRange === '20 - 30 triệu') {
      matchesSalary = salary >= 20000000 && salary < 30000000;
    } else if (filters.salaryRange === 'Trên 30 triệu') {
      matchesSalary = salary >= 30000000;
    }

    return matchesSearch && matchesDepartment && matchesPosition && matchesSalary;
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      department: 'Tất cả phòng ban',
      position: 'Tất cả chức vụ',
      salaryRange: 'Tất cả mức lương'
    });
  };

  const handleEditEmployee = (employeeId) => {
    if (!employeeId) {
      alert('ID nhân viên không hợp lệ');
      return;
    }
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!employeeId) {
      alert('ID nhân viên không hợp lệ');
      return;
    }

    const employee = employees.find(emp => emp.id === employeeId);
    const employeeName = employee?.name || 'Unknown';

    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await http(`${JAVA_API}/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa nhân viên');
      }

      // Xóa thành công → cập nhật UI
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      logDeleteEmployee(employeeId, employeeName);
      alert('Xóa nhân viên thành công');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    navigate('/employees/add');
  };

  const handleViewEmployee = (employeeId) => {
    if (!employeeId) {
      alert('ID nhân viên không hợp lệ');
      return;
    }
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      logViewDetail('employee', employeeId, employee.name);
    }
    navigate(`/employees/view/${employeeId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'inactive';
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Đang làm việc' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Nghỉ việc' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Chờ duyệt' }
    };

    const config = statusConfig[normalizedStatus] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const calculateSeniority = (hireDate) => {
    if (!hireDate) return 'N/A';
    
    const hire = new Date(hireDate);
    const now = new Date();
    
    if (isNaN(hire.getTime())) return 'N/A';
    
    const diffTime = Math.abs(now - hire);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears === 0 && diffMonths === 0) {
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ngày`;
    } else if (diffYears === 0) {
      return `${diffMonths} tháng`;
    } else if (diffMonths === 0) {
      return `${diffYears} năm`;
    } else {
      return `${diffYears} năm ${diffMonths} tháng`;
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status?.toLowerCase() === 'active').length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải danh sách nhân viên...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải danh sách</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadEmployees}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-lg mb-6`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Nhân viên</h1>
            <p className={`${getSubtitleColor()} mt-1`}>Quản lý lực lượng lao động của tổ chức</p>
          </div>
          <div className="flex space-x-3">
            {isAdmin() && (
              <button
                onClick={handleAddEmployee}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Thêm nhân viên
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <EmployeeSummaryCards
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
      />

      {/* Search and Filters */}
      <Card title="Tìm kiếm & Lọc" className="mb-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                label="Tìm kiếm"
                placeholder="Tìm nhân viên..."
                value={filters.search}
                onChange={(value) => handleFilterChange('search', value)}
              />
            </div>
            <Select
              label="Phòng ban"
              options={departments.map(dept => ({ value: dept, label: dept }))}
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
            <Select
              label="Chức vụ"
              options={positions.map(pos => ({ value: pos, label: pos }))}
              value={filters.position}
              onChange={(value) => handleFilterChange('position', value)}
            />
            {canViewSalary(userRole) && (
              <Select
                label="Mức lương"
                options={salaryRanges.map(range => ({ value: range, label: range }))}
                value={filters.salaryRange}
                onChange={(value) => handleFilterChange('salaryRange', value)}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Employee List */}
      <Card title="Danh sách nhân viên">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thâm niên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.position || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateSeniority(employee.hireDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200"
                        onClick={() => handleViewEmployee(employee.id)}
                        title="Xem chi tiết"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {isAdmin() && (
                        <>
                          <button
                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                            onClick={() => handleEditEmployee(employee.id)}
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            title="Xóa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhân viên</h3>
              <p className="text-gray-500">Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredEmployees.length}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </Card>
    </Layout>
  );
};

export default EmployeeList;