import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Search, Plus, Award, Star, Eye, X, Save } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getRole } from '../../utils/auth';
import * as api from '../../services/api';

const SimpleEmployeeEvaluation = () => {
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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    evaluationDate: new Date().toISOString().split('T')[0],
    performanceScore: 0,
    teamworkScore: 0,
    attitudeScore: 0,
    strengths: '',
    goals: ''
  });

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const result = await api.getEvaluations();
      setEmployees(result || []);
      setFilteredEmployees(result || []);
    } catch (err) {
      toast.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp =>
        emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      evaluationDate: new Date().toISOString().split('T')[0],
      performanceScore: 0,
      teamworkScore: 0,
      attitudeScore: 0,
      strengths: '',
      goals: ''
    });
    setShowModal(true);
  };

  const handleViewEvaluation = async (emp) => {
  // ✅ Lấy trực tiếp lastEvaluationId từ response
  const evalId = emp.lastEvaluationId;

  if (!evalId) {
    toast.warning('Nhân viên này chưa có đánh giá nào');
    return;
  }

  try {
    const toastId = toast.loading('Đang tải chi tiết đánh giá...');
    
    // ✅ Gọi API GET /api/evaluations/{id}
    const detail = await api.getEvaluationById(evalId);

    setSelectedEmployee(emp);
    setIsViewMode(true);
    setFormData({
      evaluationDate: detail.evaluationDate || '',
      performanceScore: detail.workPerformanceScore || 0,
      teamworkScore: detail.teamworkScore || 0,
      attitudeScore: detail.attitudeScore || 0,
      strengths: detail.strengths || '',
      goals: detail.goals || ''
    });
    setShowModal(true);
    
    toast.update(toastId, {
      render: 'Tải dữ liệu đánh giá thành công!',
      type: 'success',
      isLoading: false,
      autoClose: 2000
    });
  } catch (err) {
    toast.dismiss();
    toast.error('Không thể tải chi tiết đánh giá');
    console.error(err);
  }
};


  const calculateOverall = () => {
    const { performanceScore, teamworkScore, attitudeScore } = formData;
    const ratings = [performanceScore, teamworkScore, attitudeScore].filter(r => r > 0);
    return ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;
  };

  const handleSave = async () => {
    if (saving) return;

    const payload = {
      employeeId: selectedEmployee?.employeeId,
      evaluationDate: formData.evaluationDate,
      workPerformanceScore: formData.performanceScore,
      teamworkScore: formData.teamworkScore,
      attitudeScore: formData.attitudeScore,
      strengths: formData.strengths,
      goals: formData.goals
    };

    setSaving(true);
    const toastId = toast.loading('Đang lưu đánh giá...');

    try {
      const res = await api.createEvaluation(payload);

      const isSuccess =
        res === true ||
        res?.success ||
        res?.status === 'success' ||
        res?.id ||
        res?.evaluationId ||
        (res && !res.error);

      if (isSuccess) {
        toast.update(toastId, {
          render: 'Đánh giá đã được lưu thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        setShowModal(false);
        loadEvaluations();
      } else {
        throw new Error('API không báo thành công');
      }
    } catch (err) {
      toast.update(toastId, {
        render: 'Lưu đánh giá thất bại!',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
      console.error(err);
    } finally {
      setSaving(false);
    }
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
    <>
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="space-y-6">
        {/* Header - giữ nguyên */}
        <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-xl`}>
          <h1 className="text-2xl font-bold">Đánh giá nhân viên</h1>
          <p className={`${getSubtitleColor()} mt-1`}>Quản lý đánh giá hiệu suất làm việc</p>
        </div>

        {/* Search - giữ nguyên */}
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

        {/* Table - giữ nguyên hoàn toàn */}
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
  {filteredEmployees.map((emp) => (
    <tr key={emp.employeeId} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            {emp.fullName?.charAt(0) || '?'}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{emp.fullName}</div>
            <div className="text-sm text-gray-500">{emp.position}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
      
      {/* Cột Điểm - Ẩn ngôi sao nếu chưa có */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <Star 
            className={emp.latestScore ? "text-yellow-500" : "text-gray-300"} 
            size={16} 
          />
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            emp.latestScore 
              ? getScoreColor(emp.latestScore) 
              : 'text-gray-400 bg-gray-50'
          }`}>
            {emp.latestScore ? emp.latestScore.toFixed(1) : '-'} /5
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 text-center text-sm text-gray-500">
        {emp.lastEvaluationDate ? emp.lastEvaluationDate.split('T')[0] : '-'}
      </td>
      
      {/* Cột Thao tác - Nút mắt invisible nếu chưa có đánh giá */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleViewEvaluation(emp)}
            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
              !emp.lastEvaluationId ? 'invisible' : ''
            }`}
            title="Xem đánh giá"
            disabled={!emp.lastEvaluationId}
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleCreateEvaluation(emp)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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

        {/* MODAL - giữ nguyên 100% giao diện cũ của bạn */}
        {showModal && ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-t-xl flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{isViewMode ? 'Xem đánh giá' : 'Tạo đánh giá mới'}</h2>
                  <p className="text-blue-100">{selectedEmployee?.fullName} - {selectedEmployee?.department}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đánh giá</label>
                  <input
                    type="date"
                    value={formData.evaluationDate}
                    disabled={isViewMode}
                    onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>

                {['performanceScore', 'teamworkScore', 'attitudeScore'].map((key, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <label className="font-medium text-gray-700">
                      {key === 'performanceScore' ? 'Hiệu suất' : key === 'teamworkScore' ? 'Làm việc nhóm' : 'Thái độ'}
                    </label>
                    {isViewMode ? (
                      <span className="font-semibold">{formData[key]}/5</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
                        />
                        <span className="font-semibold">{formData[key]}/5</span>
                      </div>
                    )}
                  </div>
                ))}

                <div className="text-center bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Điểm trung bình</p>
                  <p className="text-3xl font-bold text-blue-600">{calculateOverall()}/5</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Điểm mạnh</label>
                  <textarea
                    rows="2"
                    value={formData.strengths}
                    onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                    disabled={isViewMode}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                    placeholder="Nhập điểm mạnh..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu</label>
                  <textarea
                    rows="2"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    disabled={isViewMode}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                    placeholder="Nhập mục tiêu hoặc cải thiện..."
                  />
                </div>
              </div>

              <div className="border-t p-4 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {isViewMode ? 'Đóng' : 'Hủy'}
                </button>
                {!isViewMode && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg rounded hover:bg-blue-700 disabled:opacity-70"
                  >
                    {saving ? 'Đang lưu...' : <><Save size={18} /> Lưu đánh giá</>}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default SimpleEmployeeEvaluation;