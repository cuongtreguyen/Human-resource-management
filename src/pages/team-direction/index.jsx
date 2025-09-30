import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/ui/Layout';
import Header from '../../components/ui/Header';
import EmployeeCard from './components/EmployeeCard';
import EmployeeModal from './components/EmployeeModal';
import SearchFilters from './components/SearchFilters';
import ViewToggle from './components/ViewToggle';
import ExportOptions from './components/ExportOptions';
import OrganizationChart from './components/OrganizationChart';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TeamDirectory = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);

  // D�?liệu mẫu nhân viên
  const sampleEmployees = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyen.van.an@company.com',
      phone: '0901234567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'Trưởng phòng IT',
      department: 'Công ngh�?thông tin',
      status: 'available',
      location: 'H�?Chí Minh',
      skills: ['React', 'Node.js', 'Python', 'Leadership'],
      lastSeen: new Date(),
      employeeId: 'EMP001',
      joinDate: '2020-03-15',
      salary: 25000000,
      activities: [
        { type: 'checkin', time: '08:30', date: '2024-01-15', status: 'on-time' },
        { type: 'leave_request', time: '14:00', date: '2024-01-14', status: 'pending', reason: 'Ngh�?phép cá nhân' },
        { type: 'meeting', time: '10:00', date: '2024-01-15', status: 'completed', title: 'Họp team IT' }
      ]
    },
    {
      id: 2,
      name: 'Trần Th�?Bình',
      email: 'tran.thi.binh@company.com',
      phone: '0901234568',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      role: 'Nhân viên Marketing',
      department: 'Marketing',
      status: 'busy',
      location: 'Hà Nội',
      skills: ['Digital Marketing', 'SEO', 'Content Writing'],
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      employeeId: 'EMP002',
      joinDate: '2021-06-20',
      salary: 18000000,
      activities: [
        { type: 'checkin', time: '08:45', date: '2024-01-15', status: 'late' },
        { type: 'checkout', time: '17:30', date: '2024-01-14', status: 'on-time' },
        { type: 'overtime', time: '19:00', date: '2024-01-13', status: 'approved', hours: 2 }
      ]
    },
    {
      id: 3,
      name: 'Lê Văn Cường',
      email: 'le.van.cuong@company.com',
      phone: '0901234569',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'K�?toán trưởng',
      department: 'K�?toán',
      status: 'away',
      location: 'Đà Nẵng',
      skills: ['Accounting', 'Tax', 'Financial Analysis'],
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      employeeId: 'EMP003',
      joinDate: '2019-11-10',
      salary: 22000000,
      activities: [
        { type: 'checkin', time: '08:00', date: '2024-01-15', status: 'on-time' },
        { type: 'leave_request', time: '09:00', date: '2024-01-15', status: 'approved', reason: 'Ngh�?ốm' },
        { type: 'training', time: '14:00', date: '2024-01-12', status: 'completed', title: 'Khóa đào tạo thu�?mới' }
      ]
    },
    {
      id: 4,
      name: 'Phạm Th�?Dung',
      email: 'pham.thi.dung@company.com',
      phone: '0901234570',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'HR Manager',
      department: 'Nhân sự',
      status: 'available',
      location: 'H�?Chí Minh',
      skills: ['HR Management', 'Recruitment', 'Training'],
      lastSeen: new Date(),
      employeeId: 'EMP004',
      joinDate: '2018-08-05',
      salary: 28000000,
      activities: [
        { type: 'checkin', time: '08:15', date: '2024-01-15', status: 'on-time' },
        { type: 'interview', time: '10:30', date: '2024-01-15', status: 'scheduled', candidate: 'Nguyễn Văn X' },
        { type: 'meeting', time: '15:00', date: '2024-01-15', status: 'upcoming', title: 'Họp đánh giá nhân số' },
      ]
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      email: 'hoang.van.em@company.com',
      phone: '0901234571',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      role: 'Sales Executive',
      department: 'Kinh doanh',
      status: 'offline',
      location: 'Cần Thơ',
      skills: ['Sales', 'Customer Relations', 'Negotiation'],
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
      employeeId: 'EMP005',
      joinDate: '2022-01-15',
      salary: 16000000,
      activities: [
        { type: 'checkin', time: '08:20', date: '2024-01-14', status: 'on-time' },
        { type: 'checkout', time: '18:00', date: '2024-01-14', status: 'on-time' },
        { type: 'client_meeting', time: '14:00', date: '2024-01-14', status: 'completed', client: 'Công ty ABC' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setEmployees(sampleEmployees);
      setFilteredEmployees(sampleEmployees);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter employees based on search criteria
    let filtered = employees;

    if (filters.search) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }

    if (filters.role) {
      filtered = filtered.filter(emp => emp.role.includes(filters.role));
    }

    setFilteredEmployees(filtered);
  }, [employees, filters]);

  const handleViewProfile = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSendMessage = (employee) => {
    // Navigate to messaging or open chat
    console.log('Send message to:', employee.name);
  };

  const handleCall = (employee) => {
    // Open calling interface
    console.log('Call:', employee.name);
  };

  const handleEmail = (employee) => {
    // Open email client
    window.open(`mailto:${employee.email}`);
  };

  const handleAddEmployee = () => {
    navigate('/recruitment-portal');
  };

  const departments = [...new Set(employees.map(emp => emp.department))];
  const roles = [...new Set(employees.map(emp => emp.role))];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải d�?liệu nhân viên...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Quản lý nhân viên
                </h1>
                <p className="text-gray-600 mt-3 text-xl">
                  Quản lý thông tin, hoạt động và trạng thái của {employees.length} nhân viên
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowOrgChart(!showOrgChart)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                >
                  <Icon name="Network" size={20} />
                  <span>{showOrgChart ? 'Danh sách' : 'Sơ đ�?t�?chức'}</span>
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="btn-modern flex items-center space-x-2"
                >
                  <Icon name="UserPlus" size={20} />
                  <span>Thêm nhân viên</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              departments={departments}
              roles={roles}
            />
            <div className="flex items-center space-x-4">
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <ExportOptions employees={filteredEmployees} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {showOrgChart ? (
            <OrganizationChart employees={filteredEmployees} />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="card-modern office-animation">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Tổng nhân viên</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">{employees.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon name="Users" size={28} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="card-modern office-animation">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Đang online</p>
                      <p className="text-4xl font-bold text-green-600 mt-2">
                        {employees.filter(emp => emp.status === 'available').length}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon name="Circle" size={28} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="card-modern office-animation">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Ngh�?phép hôm nay</p>
                      <p className="text-4xl font-bold text-orange-600 mt-2">
                        {employees.filter(emp => 
                          emp.activities?.some(act => 
                            act.type === 'leave_request' && 
                            act.date === new Date().toISOString().split('T')[0] &&
                            act.status === 'approved'
                          )
                        ).length}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon name="Calendar" size={28} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="card-modern office-animation">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Phòng ban</p>
                      <p className="text-4xl font-bold text-purple-600 mt-2">{departments.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon name="Building2" size={28} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Grid/List */}
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Icon name="Users" size={64} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy nhân viên</h3>
                  <p className="text-gray-600 text-xl">Th�?thay đổi b�?lọc hoặc tìm kiếm khác</p>
                </div>
              ) : (
                <div className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      onViewProfile={handleViewProfile}
                      onSendMessage={handleSendMessage}
                      onCall={handleCall}
                      onEmail={handleEmail}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Employee Modal */}
        {isModalOpen && selectedEmployee && (
          <EmployeeModal
            employee={selectedEmployee}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEmployee(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default TeamDirectory;


