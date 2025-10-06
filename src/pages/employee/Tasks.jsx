import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ListTodo, TrendingUp, Calendar } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      const res = await fakeApi.getTasks();
      setTasks(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  
  const completedCount = tasks.filter(t => t.status === 'complete').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'complete':
        return { icon: CheckCircle, text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
      case 'in-progress':
        return { icon: Clock, text: 'Đang làm', color: 'bg-blue-100 text-blue-700' };
      case 'pending':
        return { icon: AlertCircle, text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' };
      default:
        return { icon: ListTodo, text: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Nhiệm vụ của tôi</h1>
            <p className="text-purple-100">Công việc được giao và tiến độ thực hiện</p>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang thực hiện</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chờ xử lý ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in-progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang làm ({inProgressCount})
            </button>
            <button
              onClick={() => setFilter('complete')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'complete' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoàn thành ({completedCount})
            </button>
          </div>
        </div>

        {/* Danh sách nhiệm vụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!loading && filteredTasks.map(t => {
            const statusInfo = getStatusInfo(t.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg mb-2">{t.title}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{t.description}</div>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color} whitespace-nowrap ml-3`}>
                    <StatusIcon size={14} />
                    {statusInfo.text}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${getPriorityColor(t.priority)}`}>
                    <TrendingUp size={14} />
                    Ưu tiên: {t.priority === 'high' ? 'Cao' : t.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </div>
                  {t.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={14} />
                      {t.dueDate}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                    Chi tiết
                  </button>
                  {t.status !== 'complete' && (
                    <button className="flex-1 px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium">
                      Cập nhật
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="col-span-2 py-12 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải...</span>
              </div>
            </div>
          )}
          
          {!loading && filteredTasks.length === 0 && (
            <div className="col-span-2 py-12 text-center text-gray-500">
              Không có nhiệm vụ nào
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTasks;
