import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Target, Award, Star, BarChart3, Calendar } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeePerformanceReview = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Mock data for performance
        const mockPerformance = {
          overallScore: 4.2,
          lastReview: '2024-01-15',
          nextReview: '2024-07-15',
          categories: [
            { name: 'Hiệu suất công việc', score: 4.5, maxScore: 5 },
            { name: 'Kỹ năng giao tiếp', score: 4.0, maxScore: 5 },
            { name: 'Tinh thần làm việc nhóm', score: 4.3, maxScore: 5 },
            { name: 'Sáng tạo & đổi mới', score: 3.8, maxScore: 5 },
            { name: 'Quản lý thời gian', score: 4.1, maxScore: 5 }
          ]
        };

        const mockGoals = [
          { id: 1, title: 'Hoàn thành dự án ABC', progress: 75, target: 100, deadline: '2024-03-15', status: 'in-progress' },
          { id: 2, title: 'Cải thiện kỹ năng lãnh đạo', progress: 60, target: 100, deadline: '2024-06-30', status: 'in-progress' },
          { id: 3, title: 'Hoàn thành khóa đào tạo React', progress: 100, target: 100, deadline: '2024-02-28', status: 'completed' },
          { id: 4, title: 'Tăng doanh số 20%', progress: 45, target: 100, deadline: '2024-12-31', status: 'in-progress' }
        ];

        const mockReviews = [
          { id: 1, date: '2024-01-15', reviewer: 'Nguyễn Văn A', score: 4.2, comment: 'Nhân viên có hiệu suất tốt, cần cải thiện kỹ năng thuyết trình.' },
          { id: 2, date: '2023-07-15', reviewer: 'Trần Thị B', score: 3.9, comment: 'Tiến bộ rõ rệt trong công việc, tích cực học hỏi.' },
          { id: 3, date: '2023-01-15', reviewer: 'Lê Văn C', score: 3.7, comment: 'Cần tự tin hơn trong giao tiếp với khách hàng.' }
        ];

        setPerformanceData(mockPerformance);
        setGoals(mockGoals);
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error('Error loading performance data:', error);
        setLoading(false);
      }
    };
    load();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600 bg-green-50';
    if (score >= 4.0) return 'text-blue-600 bg-blue-50';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải...</span>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <a 
              href="/employee" 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Đánh giá hiệu suất</h1>
            <p className="text-purple-100">Theo dõi và cải thiện hiệu suất làm việc của bạn</p>
          </div>
        </div>

        {/* Tổng quan điểm số */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm tổng thể</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData?.overallScore}/5.0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đánh giá gần nhất</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData?.lastReview}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đánh giá tiếp theo</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData?.nextReview}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết điểm số theo danh mục */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Điểm số theo danh mục</h3>
          <div className="space-y-4">
            {performanceData?.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(category.score)}`}>
                      {category.score}/{category.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getScoreColor(category.score).split(' ')[1]}`}
                      style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mục tiêu cá nhân */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mục tiêu cá nhân</h3>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Thêm mục tiêu
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                    goal.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {goal.status === 'completed' ? 'Hoàn thành' :
                     goal.status === 'in-progress' ? 'Đang thực hiện' :
                     'Chưa bắt đầu'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Tiến độ</span>
                    <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Hạn chót: {goal.deadline}</span>
                  <span>Mục tiêu: {goal.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lịch sử đánh giá */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đánh giá</h3>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      {review.reviewer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.reviewer}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={16} />
                    <span className="font-medium text-gray-900">{review.score}/5.0</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gợi ý cải thiện */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gợi ý cải thiện</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-blue-600" size={20} />
                <h4 className="font-medium text-blue-900">Kỹ năng giao tiếp</h4>
              </div>
              <p className="text-sm text-blue-700">Tham gia khóa học thuyết trình và giao tiếp hiệu quả</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-green-600" size={20} />
                <h4 className="font-medium text-green-900">Sáng tạo & đổi mới</h4>
              </div>
              <p className="text-sm text-green-700">Tham gia các workshop về tư duy sáng tạo</p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-purple-600" size={20} />
                <h4 className="font-medium text-purple-900">Quản lý thời gian</h4>
              </div>
              <p className="text-sm text-purple-700">Sử dụng các công cụ quản lý dự án hiệu quả hơn</p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-yellow-600" size={20} />
                <h4 className="font-medium text-yellow-900">Lãnh đạo</h4>
              </div>
              <p className="text-sm text-yellow-700">Tham gia các dự án nhóm để phát triển kỹ năng lãnh đạo</p>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeePerformanceReview;
