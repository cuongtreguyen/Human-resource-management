import React, { useEffect, useState } from 'react';
import { Search, Plus, Award, Star, Eye, X, Save } from 'lucide-react';
import fakeApi from '../../services/fakeApi';

const SimpleEmployeeEvaluation = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Form đánh giá đơn giản
  const [formData, setFormData] = useState({
    reviewDate: new Date().toISOString().split('T')[0],
    workPerformance: 0,
    teamwork: 0,
    attitude: 0,
    strengths: '',
    improvements: '',
    comments: '',
    overallRating: 0
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getEmployees();
      // Thêm mock data đánh giá
      const employeesWithEval = response.data.map(emp => ({
        ...emp,
        lastEvaluation: {
          date: '2024-10-15',
          overallRating: Math.floor(Math.random() * 2) + 3 + Math.random(),
          workPerformance: Math.floor(Math.random() * 2) + 3,
          teamwork: Math.floor(Math.random() * 2) + 3,
          attitude: Math.floor(Math.random() * 2) + 3,
          strengths: 'Làm việc chăm chỉ, có tinh thần trách nhiệm',
          improvements: 'Cần cải thiện kỹ năng giao tiếp',
          comments: 'Nhân viên có tiềm năng phát triển tốt'
        }
      }));
      setEmployees(employeesWithEval);
      setFilteredEmployees(employeesWithEval);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const handleCreateEvaluation = (employee) => {
    setSelectedEmployee(employee);
    setIsViewMode(false);
    setFormData({
      reviewDate: new Date().toISOString().split('T')[0],
      workPerformance: 0,
      teamwork: 0,
      attitude: 0,
      strengths: '',
      improvements: '',
      comments: '',
      overallRating: 0
    });
    setShowModal(true);
  };

  const handleViewEvaluation = (employee) => {
    setSelectedEmployee(employee);
    setIsViewMode(true);
    if (employee.lastEvaluation) {
      setFormData({
        reviewDate: employee.lastEvaluation.date,
        workPerformance: employee.lastEvaluation.workPerformance,
        teamwork: employee.lastEvaluation.teamwork,
        attitude: employee.lastEvaluation.attitude,
        strengths: employee.lastEvaluation.strengths,
        improvements: employee.lastEvaluation.improvements,
        comments: employee.lastEvaluation.comments,
        overallRating: employee.lastEvaluation.overallRating
      });
    }
    setShowModal(true);
  };

  const calculateOverall = () => {
    const { workPerformance, teamwork, attitude } = formData;
    const ratings = [workPerformance, teamwork, attitude].filter(r => r > 0);
    return ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;
  };

  const handleSave = async () => {
    const evaluationData = {
      employeeId: selectedEmployee?.id,
      ...formData,
      overallRating: calculateOverall(),
      createdAt: new Date().toISOString()
    };

    console.log('Saving evaluation:', evaluationData);
    // TODO: Gọi API backend để lưu
    // await api.saveEvaluation(evaluationData);

    alert('Đã lưu đánh giá thành công!');
    setShowModal(false);
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-blue-600 bg-blue-100';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">Đánh giá nhân viên</h1>
        <p className="text-blue-100 mt-1">Quản lý đánh giá hiệu suất làm việc</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Điểm đánh giá</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lần đánh giá cuối</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {employee.name?.charAt(0) || '?'}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="text-yellow-500" size={16} />
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(employee.lastEvaluation?.overallRating)}`}>
                      {employee.lastEvaluation?.overallRating?.toFixed(1) || '-'}/5
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">
                  {employee.lastEvaluation?.date || '-'}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewEvaluation(employee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Xem đánh giá"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleCreateEvaluation(employee)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Tạo đánh giá mới"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Không tìm thấy nhân viên</p>
          </div>
        )}
      </div>

      {/* Modal Đánh giá */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {isViewMode ? 'Xem đánh giá' : 'Tạo đánh giá mới'}
                  </h2>
                  {selectedEmployee && (
                    <p className="text-blue-100">{selectedEmployee.name} - {selectedEmployee.department}</p>
                  )}
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Ngày đánh giá */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đánh giá</label>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                  disabled={isViewMode}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>

              {/* Điểm đánh giá */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Điểm đánh giá (1-5)</h3>
                <div className="space-y-4">
                  {[
                    { key: 'workPerformance', label: 'Hiệu suất công việc' },
                    { key: 'teamwork', label: 'Làm việc nhóm' },
                    { key: 'attitude', label: 'Thái độ làm việc' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label className="font-medium text-gray-700">{item.label}</label>
                      <div className="flex items-center gap-3">
                        {isViewMode ? (
                          <span className="text-lg font-bold">{formData[item.key]}/5</span>
                        ) : (
                          <>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={formData[item.key] || 1}
                              onChange={(e) => setFormData({ ...formData, [item.key]: parseInt(e.target.value) })}
                              className="w-32"
                            />
                            <span className="text-lg font-bold w-12">{formData[item.key] || 1}/5</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Điểm trung bình */}
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Điểm trung bình</p>
                <p className="text-3xl font-bold text-blue-600">{calculateOverall()}/5</p>
              </div>

              {/* Nhận xét */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Điểm mạnh</label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  disabled={isViewMode}
                  rows="2"
                  placeholder="Nhập điểm mạnh của nhân viên..."
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Điểm cần cải thiện</label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  disabled={isViewMode}
                  rows="2"
                  placeholder="Nhập điểm cần cải thiện..."
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét chung</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  disabled={isViewMode}
                  rows="3"
                  placeholder="Nhập nhận xét chung..."
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {isViewMode ? 'Đóng' : 'Hủy'}
              </button>
              {!isViewMode && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={18} />
                  Lưu đánh giá
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleEmployeeEvaluation;
