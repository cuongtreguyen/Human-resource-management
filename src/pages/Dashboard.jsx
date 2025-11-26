import React, { useState, useEffect } from 'react';
import { FaceRecognitionWidget } from '../components/features';
import {
  StatsCard,
  DepartmentDistribution,
  AttendanceRate,
  QuickActions,
  RecentActivity
} from '../components/dashboard';
import fakeApi from '../services/fakeApi';
import { isAdmin } from '../utils/auth';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu bảng điều khiển');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải bảng điều khiển</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
      
        </div>  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-12 0v1zm2-14a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Tổng nhân viên"
            value={stats?.totalEmployees}
            iconBgColor="bg-blue-500"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Nhân viên đang làm"
            value={stats?.activeEmployees}
            iconBgColor="bg-green-500"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.657 0 3 .995 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z" />
              </svg>
            }
            label="Nhân viên mới tháng này"
            value={stats?.newHiresThisMonth}
            iconBgColor="bg-purple-500"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Lương chờ xử lý"
            value={stats?.pendingPayroll}
            iconBgColor="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DepartmentDistribution departments={stats?.departments || []} />
          <AttendanceRate rate={stats?.averageAttendance || 0} />
        </div>

        {/* Quick Actions - Ẩn cho Admin */}
        {!isAdmin() && (
          <QuickActions onFaceRecognitionClick={() => setShowFaceRecognition(true)} />
        )}

        {/* Recent Activity - Ẩn cho Admin */}
        {!isAdmin() && (
          <div className="mt-8">
            <RecentActivity activities={stats?.recentActivities || []} />
          </div>
        )}
      </div>

      {/* Face Recognition Widget */}
      <FaceRecognitionWidget 
        isOpen={showFaceRecognition} 
        onClose={() => setShowFaceRecognition(false)} 
      />
    </div>
  );
};

export default Dashboard;