import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  Search, Plus, Award, TrendingUp, Star, Eye, Edit, Calendar, Filter,
  X, Save, FileText, Target, Users, BookOpen, DollarSign, CheckCircle, ListTodo
} from 'lucide-react';
import {
  REVIEW_TYPES,
  CORE_COMPETENCIES,
  TECHNICAL_COMPETENCIES_BY_ROLE,
  LEADERSHIP_COMPETENCIES
} from '../../config/evaluationConfig';
import KPIsTab from '../../components/evaluation/KPIsTab';
import CompetenciesTab from '../../components/evaluation/CompetenciesTab';
import FeedbackTab from '../../components/evaluation/FeedbackTab';
import DevelopmentTab from '../../components/evaluation/DevelopmentTab';
import CompensationTab from '../../components/evaluation/CompensationTab';
import SummaryTab from '../../components/evaluation/SummaryTab';
import TaskPerformanceTab from '../../components/evaluation/TaskPerformanceTab';

const EmployeeEvaluation = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  // Form state
  const [formData, setFormData] = useState({
    reviewType: 'annual',
    reviewPeriod: { from: '', to: '' },
    reviewDate: new Date().toISOString().split('T')[0],

    kpis: [
      { objective: '', target: '', actual: '', unit: '', weight: 0, comments: '', achievement: 0 }
    ],

    coreCompetencies: [],
    technicalCompetencies: [],
    leadershipCompetencies: [],

    selfRating: 0,
    managerRating: 0,
    peerRatings: [],
    selfComments: '',
    managerComments: '',

    trainingNeeds: [
      { course: '', priority: 'medium', deadline: '', provider: '', cost: '' }
    ],
    careerGoals: {
      shortTerm: '',
      longTerm: ''
    },

    compensation: {
      salaryIncrease: { recommended: false, percentage: 0, reason: '' },
      bonus: { recommended: false, amount: 0, type: '', reason: '' },
      promotion: { recommended: false, toPosition: '', reason: '' }
    },

    strengths: '',
    areasForImprovement: '',
    keyAccomplishments: '',
    overallRating: 0,
    overallComments: '',
    recommendations: ''
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const mockEmployees = [
          {
            id: 'emp001',
            name: 'Nguyễn Văn An',
            position: 'Software Developer',
            department: 'IT',
            role: 'developer',
            isManager: false,
            avatar: null,
            overallScore: 4.5,
            lastReview: '2024-01-15',
            nextReview: '2024-07-15',
            reviewStatus: 'on-schedule',
            totalReviews: 8
          },
          {
            id: 'emp002',
            name: 'Trần Thị Bình',
            position: 'HR Manager',
            department: 'Human Resources',
            role: 'hr',
            isManager: true,
            avatar: null,
            overallScore: 4.2,
            lastReview: '2024-02-10',
            nextReview: '2024-08-10',
            reviewStatus: 'on-schedule',
            totalReviews: 6
          },
          {
            id: 'emp003',
            name: 'Lê Minh Chính',
            position: 'Marketing Specialist',
            department: 'Marketing',
            role: 'marketing',
            isManager: false,
            avatar: null,
            overallScore: 3.8,
            lastReview: '2023-12-20',
            nextReview: '2024-06-20',
            reviewStatus: 'upcoming',
            totalReviews: 4
          }
        ];

        setEmployees(mockEmployees);
        setFilteredEmployees(mockEmployees);
        setLoading(false);
      } catch (error) {
        console.error('Error loading employees:', error);
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(emp => emp.reviewStatus === filterStatus);
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, filterStatus, employees]);

  const initializeForm = (employee) => {
    if (!employee) return;

    // Initialize competencies based on employee role
    const coreComp = CORE_COMPETENCIES.map(comp => ({
      ...comp,
      rating: 0,
      comments: ''
    }));

    const techComp = employee.role && TECHNICAL_COMPETENCIES_BY_ROLE[employee.role]
      ? TECHNICAL_COMPETENCIES_BY_ROLE[employee.role].map(comp => ({
        ...comp,
        rating: 0,
        comments: ''
      }))
      : [];

    const leaderComp = employee.isManager
      ? LEADERSHIP_COMPETENCIES.map(comp => ({
        ...comp,
        rating: 0,
        comments: ''
      }))
      : [];

    setFormData(prev => ({
      ...prev,
      coreCompetencies: coreComp,
      technicalCompetencies: techComp,
      leadershipCompetencies: leaderComp
    }));
  };

  const handleCreateEvaluation = (employee) => {
    setSelectedEmployee(employee);
    if (employee) {
      initializeForm(employee);
    }
    setShowEvaluationModal(true);
    setActiveTab('info');
  };

  const handleViewDetail = (employee) => {
    navigate(`/employees/view/${employee.id}`);
  };

  const handleSaveEvaluation = async () => {
    try {
      const evaluationData = {
        employeeId: selectedEmployee?.id,
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      console.log('Saving evaluation:', evaluationData);
      // TODO: API call to save evaluation
      alert('Đánh giá đã được lưu thành công!');
      setShowEvaluationModal(false);
    } catch (error) {
      console.error('Error saving evaluation:', error);
      alert('Lỗi khi lưu đánh giá');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 4.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'on-schedule': { text: 'Đúng hạn', class: 'bg-green-100 text-green-700' },
      'upcoming': { text: 'Sắp tới', class: 'bg-blue-100 text-blue-700' },
      'overdue': { text: 'Trễ hạn', class: 'bg-red-100 text-red-700' }
    };
    return badges[status] || badges['on-schedule'];
  };

  const statistics = {
    totalEmployees: employees.length,
    averageScore: employees.length > 0
      ? (employees.reduce((sum, emp) => sum + emp.overallScore, 0) / employees.length).toFixed(1)
      : 0,
    upcomingReviews: employees.filter(emp => emp.reviewStatus === 'upcoming').length,
    overdueReviews: employees.filter(emp => emp.reviewStatus === 'overdue').length
  };

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: FileText },
    { id: 'task-performance', label: 'Công việc', icon: ListTodo },
    { id: 'kpis', label: 'KPIs', icon: Target },
    { id: 'competencies', label: 'Năng lực', icon: Award },
    { id: '360-feedback', label: '360° Feedback', icon: Users },
    { id: 'development', label: 'Phát triển', icon: BookOpen },
    { id: 'compensation', label: 'Đãi ngộ', icon: DollarSign },
    { id: 'summary', label: 'Tổng kết', icon: CheckCircle }
  ];

  const handleTaskKPIsLoaded = (metrics) => {
    // Optional callback when task KPIs are loaded
    console.log('Task metrics loaded:', metrics);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại đánh giá
                </label>
                <select
                  value={formData.reviewType}
                  onChange={(e) => setFormData({ ...formData, reviewType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(REVIEW_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày đánh giá
                </label>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={formData.reviewPeriod.from}
                  onChange={(e) => setFormData({
                    ...formData,
                    reviewPeriod: { ...formData.reviewPeriod, from: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={formData.reviewPeriod.to}
                  onChange={(e) => setFormData({
                    ...formData,
                    reviewPeriod: { ...formData.reviewPeriod, to: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 'task-performance':
        return (
          <TaskPerformanceTab
            formData={formData}
            setFormData={setFormData}
            selectedEmployee={selectedEmployee}
            onLoadTaskKPIs={handleTaskKPIsLoaded}
          />
        );
      case 'kpis':
        return <KPIsTab formData={formData} setFormData={setFormData} />;
      case 'competencies':
        return <CompetenciesTab formData={formData} setFormData={setFormData} selectedEmployee={selectedEmployee} />;
      case '360-feedback':
        return <FeedbackTab formData={formData} setFormData={setFormData} />;
      case 'development':
        return <DevelopmentTab formData={formData} setFormData={setFormData} />;
      case 'compensation':
        return <CompensationTab formData={formData} setFormData={setFormData} />;
      case 'summary':
        return <SummaryTab formData={formData} selectedEmployee={selectedEmployee} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Đánh giá nhân viên</h1>
              <p className="text-blue-100">Quản lý và theo dõi hiệu suất làm việc của nhân viên</p>
            </div>
            <button
              type="button"
              onClick={() => handleCreateEvaluation(null)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium shadow-lg cursor-pointer"
            >
              <Plus size={20} />
              <span>Tạo đánh giá mới</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm trung bình</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}/5.0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sắp đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.upcomingReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Calendar className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Trễ hạn</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.overdueReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, chức vụ, phòng ban..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="on-schedule">Đúng hạn</option>
                <option value="upcoming">Sắp tới</option>
                <option value="overdue">Trễ hạn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng ban
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm tổng thể
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá gần nhất
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá tiếp theo
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const statusBadge = getStatusBadge(employee.reviewStatus);
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {employee.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={employee.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Star className="text-yellow-500" size={16} />
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(employee.overallScore)}`}>
                            {employee.overallScore}/5.0
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {employee.lastReview}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {employee.nextReview}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDetail(employee)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCreateEvaluation(employee)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Tạo đánh giá mới"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy nhân viên</h3>
              <p className="mt-1 text-sm text-gray-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </div>

        {/* Evaluation Modal */}
        {showEvaluationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedEmployee ? `Đánh giá cho ${selectedEmployee.name}` : 'Tạo đánh giá mới'}
                    </h2>
                    {selectedEmployee && (
                      <p className="text-blue-100 mt-1">{selectedEmployee.position} - {selectedEmployee.department}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEvaluationModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-white text-blue-600 font-semibold'
                            : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderTabContent()}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Tab hiện tại: <span className="font-semibold">{tabs.find(t => t.id === activeTab)?.label}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEvaluationModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEvaluation}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Save size={18} />
                      Lưu đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeEvaluation;
