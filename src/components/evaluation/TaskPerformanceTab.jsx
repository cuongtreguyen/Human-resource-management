import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Clock, AlertTriangle, TrendingUp, ListTodo,
  Target, Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  RefreshCw, Info
} from 'lucide-react';
import {
  calculateComprehensiveMetrics,
  getPerformanceRating,
  generateRecommendations
} from '../../utils/taskMetrics';

const TaskPerformanceTab = ({ formData, setFormData, selectedEmployee, onLoadTaskKPIs }) => {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  // Mock data for demonstration - in real app, this would come from API
  const mockEmployeeTasks = [
    { id: 't1', columnId: 'done', title: 'Thiết kế giao diện dashboard', priority: 'high', dueDate: '2024-12-10', completedDate: '2024-12-09' },
    { id: 't2', columnId: 'done', title: 'Viết API documentation', priority: 'medium', dueDate: '2024-12-12', completedDate: '2024-12-11' },
    { id: 't3', columnId: 'done', title: 'Fix responsive issues', priority: 'low', dueDate: '2024-12-08', completedDate: '2024-12-10' },
    { id: 't4', columnId: 'inProgress', title: 'Implement authentication', priority: 'high', dueDate: '2024-12-20' },
    { id: 't5', columnId: 'review', title: 'Database optimization', priority: 'medium', dueDate: '2024-12-18' },
    { id: 't6', columnId: 'todo', title: 'Setup CI/CD pipeline', priority: 'high', dueDate: '2024-12-25' },
    { id: 't7', columnId: 'done', title: 'Code review PR #123', priority: 'medium', dueDate: '2024-12-05', completedDate: '2024-12-05' },
    { id: 't8', columnId: 'done', title: 'Unit tests for auth module', priority: 'high', dueDate: '2024-12-07', completedDate: '2024-12-06' },
  ];

  useEffect(() => {
    loadTaskData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee?.id]);

  const loadTaskData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app, fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500));

      setTaskData(mockEmployeeTasks);
      const calculatedMetrics = calculateComprehensiveMetrics(mockEmployeeTasks);
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error loading task data:', error);
    }
    setLoading(false);
  };

  const handleApplyTaskKPIs = () => {
    if (!metrics) return;

    // Add task-based KPIs to the form
    const existingKPIs = formData.kpis.filter(kpi => kpi.objective !== '');
    const taskKPIs = metrics.suggestedKPIs;

    setFormData({
      ...formData,
      kpis: [...existingKPIs, ...taskKPIs],
      // Also update recommendations
      areasForImprovement: formData.areasForImprovement +
        (formData.areasForImprovement ? '\n' : '') +
        generateRecommendations(metrics).join('\n')
    });

    if (onLoadTaskKPIs) {
      onLoadTaskKPIs(metrics);
    }

    alert('Đã thêm KPIs từ dữ liệu công việc vào đánh giá!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-gray-600">Đang tải dữ liệu công việc...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <ListTodo className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu công việc</h3>
        <p className="mt-1 text-sm text-gray-500">
          Không tìm thấy công việc nào cho nhân viên này trong kỳ đánh giá
        </p>
      </div>
    );
  }

  const rating = getPerformanceRating(metrics.productivityScore);
  const recommendations = generateRecommendations(metrics);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Hiệu suất công việc</h3>
            <p className="text-blue-100 text-sm">
              Dựa trên {metrics.stats.total} công việc trong kỳ đánh giá
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg bg-white/20`}>
            <span className="text-2xl font-bold">{metrics.productivityScore}</span>
            <span className="text-sm ml-1">/100</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${rating.color}-100 text-${rating.color}-700`}
            style={{
              backgroundColor: rating.color === 'green' ? '#dcfce7' :
                rating.color === 'blue' ? '#dbeafe' :
                  rating.color === 'yellow' ? '#fef9c3' :
                    rating.color === 'orange' ? '#ffedd5' : '#fee2e2',
              color: rating.color === 'green' ? '#15803d' :
                rating.color === 'blue' ? '#1d4ed8' :
                  rating.color === 'yellow' ? '#a16207' :
                    rating.color === 'orange' ? '#c2410c' : '#b91c1c'
            }}>
            {rating.label}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= rating.stars ? 'text-yellow-400' : 'text-white/30'}>
                ★
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleApplyTaskKPIs}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          <Target size={18} />
          Áp dụng vào KPIs đánh giá
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Hoàn thành</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.stats.done}</p>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} />
            {metrics.completionRate}%
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Đang làm</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.stats.inProgress}</p>
          <p className="text-sm text-blue-600 mt-1">+ {metrics.stats.review} review</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Đúng hạn</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.onTimeRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Tỷ lệ giao đúng hạn</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Ưu tiên cao</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.highPriorityRate}%</p>
          <p className="text-sm text-gray-500 mt-1">{metrics.priorityDistribution.high} task quan trọng</p>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          Phân bố theo độ ưu tiên
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600">Cao</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all"
                style={{ width: `${(metrics.priorityDistribution.high / metrics.stats.total) * 100}%` }}
              />
            </div>
            <span className="w-8 text-sm font-medium">{metrics.priorityDistribution.high}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600">Trung bình</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${(metrics.priorityDistribution.medium / metrics.stats.total) * 100}%` }}
              />
            </div>
            <span className="w-8 text-sm font-medium">{metrics.priorityDistribution.medium}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600">Thấp</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all"
                style={{ width: `${(metrics.priorityDistribution.low / metrics.stats.total) * 100}%` }}
              />
            </div>
            <span className="w-8 text-sm font-medium">{metrics.priorityDistribution.low}</span>
          </div>
        </div>
      </div>

      {/* Task List Preview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ListTodo className="text-blue-600" size={20} />
          Danh sách công việc trong kỳ
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {taskData?.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-2 h-2 rounded-full ${task.columnId === 'done' ? 'bg-green-500' :
                  task.columnId === 'inProgress' ? 'bg-blue-500' :
                    task.columnId === 'review' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                <p className="text-xs text-gray-500">Hạn: {task.dueDate}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                }`}>
                {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'TB' : 'Thấp'}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${task.columnId === 'done' ? 'bg-green-100 text-green-700' :
                  task.columnId === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                    task.columnId === 'review' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                }`}>
                {task.columnId === 'done' ? 'Xong' :
                  task.columnId === 'inProgress' ? 'Đang làm' :
                    task.columnId === 'review' ? 'Review' : 'Chờ'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <TrendingUp className="text-amber-600" size={20} />
          Đề xuất cải thiện
        </h4>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
              <span className="text-amber-600 mt-0.5">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Lưu ý</h4>
            <p className="text-sm text-blue-800">
              Dữ liệu công việc được tổng hợp từ hệ thống quản lý công việc. Nhấn "Áp dụng vào KPIs đánh giá"
              để tự động thêm các chỉ số này vào phần KPIs của đánh giá nhân viên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPerformanceTab;
