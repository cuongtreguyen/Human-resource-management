import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Award, Star, Eye, X, TrendingUp, Calendar, User } from 'lucide-react';
import fakeApi from '../../services/fakeApi';

const MyEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Mock current employee ID (trong thực tế lấy từ auth/token)
  const currentEmployeeId = 'emp001';

  useEffect(() => {
    loadMyEvaluations();
  }, []);

  const loadMyEvaluations = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getMyEvaluations(currentEmployeeId);
      if (response.success) {
        setEvaluations(response.data);
      }
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowModal(true);
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-blue-600 bg-blue-100';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score) => {
    if (score >= 4.5) return { text: 'Xuất sắc', color: 'bg-green-500' };
    if (score >= 4) return { text: 'Tốt', color: 'bg-blue-500' };
    if (score >= 3) return { text: 'Khá', color: 'bg-yellow-500' };
    if (score >= 2) return { text: 'Trung bình', color: 'bg-orange-500' };
    return { text: 'Cần cải thiện', color: 'bg-red-500' };
  };

  // Tính điểm trung bình tổng
  const averageScore = evaluations.length > 0
    ? (evaluations.reduce((sum, e) => sum + e.overallRating, 0) / evaluations.length).toFixed(1)
    : 0;

  // Tính xu hướng (so sánh 2 kỳ gần nhất)
  const getTrend = () => {
    if (evaluations.length < 2) return { text: 'Chưa đủ dữ liệu', color: 'text-gray-500', icon: '−' };
    const latest = evaluations[0].overallRating;
    const previous = evaluations[1].overallRating;
    if (latest > previous) return { text: 'Tiến bộ', color: 'text-green-600', icon: '↑' };
    if (latest < previous) return { text: 'Giảm', color: 'text-red-600', icon: '↓' };
    return { text: 'Ổn định', color: 'text-blue-600', icon: '→' };
  };

  const trend = getTrend();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">Đánh giá của tôi</h1>
        <p className="text-orange-100 mt-1">Xem lịch sử đánh giá hiệu suất làm việc từ quản lý</p>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Award className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Số kỳ đánh giá</p>
              <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Xu hướng</p>
              <p className={`text-lg font-bold ${trend.color}`}>{trend.text} {trend.icon}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Lịch sử đánh giá</h2>
        </div>

        <div className="divide-y">
          {evaluations.map((evaluation) => {
            const badge = getScoreBadge(evaluation.overallRating);
            return (
              <div key={evaluation.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Star className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{evaluation.period}</h3>
                      <p className="text-sm text-gray-500">Ngày đánh giá: {evaluation.reviewDate}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <User size={14} />
                        {evaluation.reviewer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={18} />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(evaluation.overallRating)}`}>
                          {evaluation.overallRating.toFixed(1)}/5
                        </span>
                      </div>
                      <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs text-white ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>

                    <button
                      onClick={() => handleViewEvaluation(evaluation)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="Xem chi tiết"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>

                {/* Preview điểm mạnh */}
                <div className="mt-3 pl-16">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium text-gray-700">Điểm mạnh:</span> {evaluation.strengths}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {evaluations.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Chưa có đánh giá nào từ quản lý</p>
            <p className="text-sm text-gray-400 mt-1">Đánh giá sẽ hiển thị ở đây khi quản lý hoàn thành đánh giá cho bạn</p>
          </div>
        )}
      </div>

      {/* Modal xem chi tiết đánh giá */}
      {showModal && selectedEvaluation && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Chi tiết đánh giá</h2>
                  <p className="text-orange-100">{selectedEvaluation.period}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Thông tin chung */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ngày đánh giá</label>
                  <p className="text-gray-900">{selectedEvaluation.reviewDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Người đánh giá</label>
                  <p className="text-gray-900">{selectedEvaluation.reviewer}</p>
                </div>
              </div>

              {/* Điểm đánh giá */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Điểm đánh giá chi tiết</h3>
                <div className="space-y-3">
                  {[
                    { key: 'workPerformance', label: 'Hiệu suất công việc' },
                    { key: 'teamwork', label: 'Làm việc nhóm' },
                    { key: 'attitude', label: 'Thái độ làm việc' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label className="font-medium text-gray-700">{item.label}</label>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(selectedEvaluation[item.key] / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-gray-900 w-12">{selectedEvaluation[item.key]}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Điểm trung bình */}
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Điểm trung bình</p>
                <p className="text-3xl font-bold text-orange-600">{selectedEvaluation.overallRating.toFixed(1)}/5</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded text-sm text-white ${getScoreBadge(selectedEvaluation.overallRating).color}`}>
                  {getScoreBadge(selectedEvaluation.overallRating).text}
                </span>
              </div>

              {/* Nhận xét */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Điểm mạnh</label>
                <div className="p-3 bg-green-50 rounded-lg text-gray-700 border border-green-100">
                  {selectedEvaluation.strengths}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu cải thiện</label>
                <div className="p-3 bg-yellow-50 rounded-lg text-gray-700 border border-yellow-100">
                  {selectedEvaluation.improvements}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MyEvaluation;
