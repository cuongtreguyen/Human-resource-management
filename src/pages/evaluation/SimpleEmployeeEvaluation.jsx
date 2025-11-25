import React, { useEffect, useState } from 'react';
import { Search, Plus, Award, TrendingUp, Star, Eye, Calendar, Filter, X, Save, ChevronRight, TrendingDown, Minus } from 'lucide-react';

const SimpleEmployeeEvaluation = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Form state - Simplified for HR
  const [formData, setFormData] = useState({
    // Basic Info
    reviewPeriod: { from: '', to: '' },
    reviewDate: new Date().toISOString().split('T')[0],

    // Work Performance (Công việc đã làm)
    completedTasks: [
      { task: '', completion: 100, quality: 5, comments: '' }
    ],

    // Competency Ratings (Đánh giá năng lực)
    workPerformance: 0,       // Hiệu suất công việc
    communication: 0,          // Kỹ năng giao tiếp
    teamwork: 0,               // Làm việc nhóm
    initiative: 0,             // Chủ động & sáng tạo
    timeManagement: 0,         // Quản lý thời gian
    problemSolving: 0,         // Giải quyết vấn đề

    // Summary
    strengths: '',             // Điểm mạnh
    improvements: '',          // Điểm cần cải thiện
    overallRating: 0,          // Đánh giá chung
    managerComments: '',       // Nhận xét của quản lý

    // Recommendations
    salaryIncrease: false,     // Đề xuất tăng lương
    increasePercentage: 0,
    promotion: false,          // Đề xuất thăng tiến
    promotionTo: '',
    training: ''               // Đề xuất đào tạo
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const mockEmployees = [
          {
            id: 1,
            name: 'Nguyễn Văn An',
            position: 'Lập trình viên',
            department: 'Công nghệ',
            avatar: null,
            overallScore: 4.5,
            lastReview: '2024-01-15',
            nextReview: '2024-07-15',
            reviewStatus: 'on-schedule',
            totalReviews: 8
          },
          {
            id: 2,
            name: 'Trần Thị Bình',
            position: 'Quản lý nhân sự',
            department: 'Nhân sự',
            avatar: null,
            overallScore: 4.2,
            lastReview: '2024-02-10',
            nextReview: '2024-08-10',
            reviewStatus: 'on-schedule',
            totalReviews: 6
          },
          {
            id: 3,
            name: 'Lê Minh Chính',
            position: 'Chuyên viên Marketing',
            department: 'Marketing',
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

  const handleViewEvaluation = (employee) => {
    console.log('Viewing evaluation for:', employee);
    setSelectedEmployee(employee);

    // Mock evaluation history data
    const mockHistory = [
      {
        id: 1,
        reviewDate: '2024-10-15',
        reviewPeriod: { from: '2024-07-01', to: '2024-09-30' },
        overallRating: 4.5,
        completedTasks: [
          { task: 'Hoàn thành module đăng nhập', completion: 100, quality: 5, comments: 'Làm tốt, code sạch' },
          { task: 'Phát triển API REST', completion: 95, quality: 4, comments: 'Cần cải thiện documentation' }
        ],
        workPerformance: 4.5,
        communication: 4.0,
        teamwork: 5.0,
        initiative: 4.0,
        timeManagement: 4.5,
        problemSolving: 4.5,
        strengths: 'Kỹ năng lập trình tốt, code quality cao, chủ động học hỏi',
        improvements: 'Cần cải thiện kỹ năng viết tài liệu kỹ thuật',
        managerComments: 'Nhân viên xuất sắc, có tiềm năng phát triển',
        salaryIncrease: true,
        increasePercentage: 10,
        promotion: false,
        promotionTo: '',
        training: 'Khóa học về technical writing',
        evaluator: 'Nguyễn Văn A'
      },
      {
        id: 2,
        reviewDate: '2024-07-15',
        reviewPeriod: { from: '2024-04-01', to: '2024-06-30' },
        overallRating: 4.2,
        completedTasks: [
          { task: 'Tối ưu database queries', completion: 100, quality: 5, comments: 'Xuất sắc' },
          { task: 'Fix bugs module thanh toán', completion: 90, quality: 4, comments: 'Hoàn thành tốt' }
        ],
        workPerformance: 4.0,
        communication: 4.0,
        teamwork: 4.5,
        initiative: 4.0,
        timeManagement: 4.5,
        problemSolving: 4.5,
        strengths: 'Giải quyết vấn đề hiệu quả, làm việc nhóm tốt',
        improvements: 'Cần chủ động hơn trong việc đề xuất ý tưởng mới',
        managerComments: 'Nhân viên ổn định, đáng tin cậy',
        salaryIncrease: false,
        increasePercentage: 0,
        promotion: false,
        promotionTo: '',
        training: 'Khóa học về system design',
        evaluator: 'Nguyễn Văn A'
      },
      {
        id: 3,
        reviewDate: '2024-04-10',
        reviewPeriod: { from: '2024-01-01', to: '2024-03-31' },
        overallRating: 4.0,
        completedTasks: [
          { task: 'Phát triển dashboard analytics', completion: 85, quality: 4, comments: 'Cần thêm thời gian' },
          { task: 'Refactor codebase legacy', completion: 80, quality: 3, comments: 'Công việc khó, đã cố gắng' }
        ],
        workPerformance: 4.0,
        communication: 3.5,
        teamwork: 4.0,
        initiative: 4.0,
        timeManagement: 4.0,
        problemSolving: 4.5,
        strengths: 'Khả năng học hỏi nhanh, tiếp thu tốt',
        improvements: 'Cần cải thiện kỹ năng ước lượng thời gian',
        managerComments: 'Đang phát triển tốt, cần thêm kinh nghiệm',
        salaryIncrease: false,
        increasePercentage: 0,
        promotion: false,
        promotionTo: '',
        training: 'Khóa học về project management',
        evaluator: 'Nguyễn Văn A'
      }
    ];

    setEvaluationHistory(mockHistory);
    setShowHistoryModal(true);
  };

  const handleCreateEvaluation = (employee) => {
    setSelectedEmployee(employee);
    setShowEvaluationModal(true);
    // Reset form
    setFormData({
      ...formData,
      completedTasks: [{ task: '', completion: 100, quality: 5, comments: '' }]
    });
  };

  const handleSaveEvaluation = async () => {
    try {
      // Calculate overall rating from competencies
      const competencyRatings = [
        formData.workPerformance,
        formData.communication,
        formData.teamwork,
        formData.initiative,
        formData.timeManagement,
        formData.problemSolving
      ].filter(r => r > 0);

      const averageRating = competencyRatings.length > 0
        ? (competencyRatings.reduce((a, b) => a + b, 0) / competencyRatings.length).toFixed(1)
        : 0;

      const evaluationData = {
        employeeId: selectedEmployee?.id,
        employeeName: selectedEmployee?.name,
        ...formData,
        overallRating: averageRating,
        createdAt: new Date().toISOString(),
        status: 'completed'
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

  const addCompletedTask = () => {
    setFormData({
      ...formData,
      completedTasks: [...formData.completedTasks, { task: '', completion: 100, quality: 5, comments: '' }]
    });
  };

  const removeCompletedTask = (index) => {
    setFormData({
      ...formData,
      completedTasks: formData.completedTasks.filter((_, i) => i !== index)
    });
  };

  const updateCompletedTask = (index, field, value) => {
    const newTasks = [...formData.completedTasks];
    newTasks[index][field] = value;
    setFormData({ ...formData, completedTasks: newTasks });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
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
                          onClick={() => handleViewEvaluation(employee)}
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
                          <Plus size={18} />
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

      {/* Evaluation Modal - SIMPLIFIED VERSION */}
      {showEvaluationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-xl">
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
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Period Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thời gian đánh giá</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đánh giá</label>
                      <input
                        type="date"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Performance */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Công việc đã hoàn thành</h3>
                    <button
                      type="button"
                      onClick={addCompletedTask}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                    >
                      <Plus size={16} />
                      Thêm công việc
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.completedTasks.map((task, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <input
                            type="text"
                            placeholder="Tên công việc (VD: Hoàn thành module đăng nhập)"
                            value={task.task}
                            onChange={(e) => updateCompletedTask(index, 'task', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.completedTasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCompletedTask(index)}
                              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mức độ hoàn thành: {task.completion}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={task.completion}
                              onChange={(e) => updateCompletedTask(index, 'completion', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chất lượng: {task.quality}/5
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={task.quality}
                              onChange={(e) => updateCompletedTask(index, 'quality', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <textarea
                          placeholder="Ghi chú về công việc này..."
                          value={task.comments}
                          onChange={(e) => updateCompletedTask(index, 'comments', e.target.value)}
                          rows="2"
                          className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competency Ratings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá năng lực</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'workPerformance', label: 'Hiệu suất công việc' },
                      { key: 'communication', label: 'Kỹ năng giao tiếp' },
                      { key: 'teamwork', label: 'Làm việc nhóm' },
                      { key: 'initiative', label: 'Chủ động & sáng tạo' },
                      { key: 'timeManagement', label: 'Quản lý thời gian' },
                      { key: 'problemSolving', label: 'Giải quyết vấn đề' }
                    ].map((comp) => (
                      <div key={comp.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <label className="text-sm font-medium text-gray-700 flex-1">{comp.label}</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={formData[comp.key]}
                            onChange={(e) => setFormData({ ...formData, [comp.key]: parseFloat(e.target.value) })}
                            className="w-48"
                          />
                          <span className="text-lg font-bold text-gray-900 min-w-[3rem]">
                            {formData[comp.key]}/5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng kết</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Điểm mạnh</label>
                      <textarea
                        placeholder="Những điểm mạnh của nhân viên..."
                        value={formData.strengths}
                        onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Điểm cần cải thiện</label>
                      <textarea
                        placeholder="Những điểm cần cải thiện..."
                        value={formData.improvements}
                        onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét của quản lý</label>
                      <textarea
                        placeholder="Nhận xét chung về nhân viên..."
                        value={formData.managerComments}
                        onChange={(e) => setFormData({ ...formData, managerComments: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Đề xuất</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.salaryIncrease}
                        onChange={(e) => setFormData({ ...formData, salaryIncrease: e.target.checked })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Đề xuất tăng lương</label>
                        {formData.salaryIncrease && (
                          <div className="mt-2">
                            <input
                              type="number"
                              placeholder="Tỷ lệ % tăng lương"
                              value={formData.increasePercentage}
                              onChange={(e) => setFormData({ ...formData, increasePercentage: parseFloat(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.promotion}
                        onChange={(e) => setFormData({ ...formData, promotion: e.target.checked })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Đề xuất thăng tiến</label>
                        {formData.promotion && (
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Chức vụ đề xuất"
                              value={formData.promotionTo}
                              onChange={(e) => setFormData({ ...formData, promotionTo: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Đề xuất đào tạo</label>
                      <textarea
                        placeholder="Các khóa đào tạo cần thiết..."
                        value={formData.training}
                        onChange={(e) => setFormData({ ...formData, training: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl flex justify-end gap-3">
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
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Lịch sử đánh giá - {selectedEmployee?.name}
                  </h2>
                  <p className="text-purple-100 mt-1">{selectedEmployee?.position} - {selectedEmployee?.department}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowHistoryModal(false);
                    setSelectedHistoryItem(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {!selectedHistoryItem ? (
                /* History List View */
                <div className="space-y-4">
                  {evaluationHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Award className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đánh giá</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Nhân viên này chưa có lịch sử đánh giá
                      </p>
                    </div>
                  ) : (
                    evaluationHistory.map((item, index) => {
                      const ratingChange = index < evaluationHistory.length - 1
                        ? item.overallRating - evaluationHistory[index + 1].overallRating
                        : 0;

                      return (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => setSelectedHistoryItem(item)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                  #{evaluationHistory.length - index}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.reviewPeriod.from} → {item.reviewPeriod.to}
                                </span>
                                <span className="text-sm text-gray-400">
                                  Đánh giá ngày: {item.reviewDate}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Star className="text-yellow-500" size={20} />
                                  <div>
                                    <p className="text-xs text-gray-500">Điểm tổng thể</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xl font-bold text-gray-900">{item.overallRating}/5.0</p>
                                      {ratingChange !== 0 && (
                                        <span className={`flex items-center gap-1 text-xs font-medium ${
                                          ratingChange > 0 ? 'text-green-600' : ratingChange < 0 ? 'text-red-600' : 'text-gray-500'
                                        }`}>
                                          {ratingChange > 0 ? <TrendingUp size={14} /> : ratingChange < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                                          {Math.abs(ratingChange).toFixed(1)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Công việc hoàn thành</p>
                                  <p className="text-lg font-semibold text-gray-900">{item.completedTasks.length} công việc</p>
                                  <p className="text-xs text-gray-500">
                                    Trung bình: {(item.completedTasks.reduce((sum, t) => sum + t.completion, 0) / item.completedTasks.length).toFixed(0)}%
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Người đánh giá</p>
                                  <p className="text-sm font-medium text-gray-900">{item.evaluator}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {item.salaryIncrease && (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    💰 Tăng lương {item.increasePercentage}%
                                  </span>
                                )}
                                {item.promotion && (
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    🚀 Đề xuất thăng tiến
                                  </span>
                                )}
                                {item.training && (
                                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                    📚 Đào tạo
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2">
                                <strong>Nhận xét:</strong> {item.managerComments}
                              </p>
                            </div>

                            <ChevronRight className="text-gray-400 flex-shrink-0 ml-4" size={24} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* Detailed View */
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryItem(null)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    ← Quay lại danh sách
                  </button>

                  {/* Period Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Kỳ đánh giá</p>
                        <p className="font-semibold text-gray-900">{selectedHistoryItem.reviewPeriod.from} → {selectedHistoryItem.reviewPeriod.to}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Ngày đánh giá</p>
                        <p className="font-semibold text-gray-900">{selectedHistoryItem.reviewDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Người đánh giá</p>
                        <p className="font-semibold text-gray-900">{selectedHistoryItem.evaluator}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="text-yellow-500" />
                      Điểm tổng thể
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-bold text-purple-600">
                        {selectedHistoryItem.overallRating}
                      </div>
                      <div className="text-2xl text-gray-400">/5.0</div>
                    </div>
                  </div>

                  {/* Completed Tasks */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Công việc đã hoàn thành</h3>
                    <div className="space-y-3">
                      {selectedHistoryItem.completedTasks.map((task, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 mb-2">{task.task}</p>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <p className="text-sm text-gray-600">Hoàn thành: <span className="font-semibold text-blue-600">{task.completion}%</span></p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Chất lượng: <span className="font-semibold text-green-600">{task.quality}/5</span></p>
                            </div>
                          </div>
                          {task.comments && (
                            <p className="text-sm text-gray-600 italic">💬 {task.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competency Ratings */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá năng lực</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'workPerformance', label: 'Hiệu suất công việc', value: selectedHistoryItem.workPerformance },
                        { key: 'communication', label: 'Kỹ năng giao tiếp', value: selectedHistoryItem.communication },
                        { key: 'teamwork', label: 'Làm việc nhóm', value: selectedHistoryItem.teamwork },
                        { key: 'initiative', label: 'Chủ động & sáng tạo', value: selectedHistoryItem.initiative },
                        { key: 'timeManagement', label: 'Quản lý thời gian', value: selectedHistoryItem.timeManagement },
                        { key: 'problemSolving', label: 'Giải quyết vấn đề', value: selectedHistoryItem.problemSolving }
                      ].map((comp) => (
                        <div key={comp.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{comp.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                style={{ width: `${(comp.value / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-900 min-w-[3rem]">{comp.value}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng kết</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">✅ Điểm mạnh</p>
                        <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg border border-green-200">
                          {selectedHistoryItem.strengths}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">📈 Điểm cần cải thiện</p>
                        <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          {selectedHistoryItem.improvements}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">💬 Nhận xét của quản lý</p>
                        <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          {selectedHistoryItem.managerComments}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Đề xuất</h3>
                    <div className="space-y-3">
                      {selectedHistoryItem.salaryIncrease && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="font-medium text-green-900">💰 Đề xuất tăng lương</p>
                          <p className="text-sm text-green-700 mt-1">Tỷ lệ: {selectedHistoryItem.increasePercentage}%</p>
                        </div>
                      )}
                      {selectedHistoryItem.promotion && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-medium text-blue-900">🚀 Đề xuất thăng tiến</p>
                          <p className="text-sm text-blue-700 mt-1">Chức vụ: {selectedHistoryItem.promotionTo || 'Chưa xác định'}</p>
                        </div>
                      )}
                      {selectedHistoryItem.training && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="font-medium text-purple-900">📚 Đào tạo đề xuất</p>
                          <p className="text-sm text-purple-700 mt-1">{selectedHistoryItem.training}</p>
                        </div>
                      )}
                      {!selectedHistoryItem.salaryIncrease && !selectedHistoryItem.promotion && !selectedHistoryItem.training && (
                        <p className="text-sm text-gray-500 text-center py-4">Không có đề xuất đặc biệt</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(false);
                  setSelectedHistoryItem(null);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleEmployeeEvaluation;
