// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Users, UserCheck, Calendar, Clock, CheckSquare, FileText,
//   TrendingUp, AlertCircle, ClipboardList, Star, Target,
//   MessageCircle, Bell, ChevronRight, BarChart3
// } from 'lucide-react';
// import fakeApi from '../../services/fakeApi';

// const ManagerDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       // Giả lập data cho Manager
//       const managerStats = {
//         // Nhân viên trong team
//         teamMembers: 24,
//         presentToday: 21,
//         onLeaveToday: 2,
//         absentToday: 1,

//         // Nghỉ phép
//         pendingLeaveRequests: 5,
//         approvedThisMonth: 12,
//         rejectedThisMonth: 2,

//         // Công việc
//         totalTasks: 45,
//         completedTasks: 32,
//         inProgressTasks: 10,
//         overdueTasks: 3,

//         // Đánh giá
//         pendingEvaluations: 8,
//         completedEvaluations: 16,

//         // Chấm công team tuần này
//         weeklyTeamAttendance: [
//           { day: 'T2', present: 22, absent: 2 },
//           { day: 'T3', present: 23, absent: 1 },
//           { day: 'T4', present: 21, absent: 3 },
//           { day: 'T5', present: 24, absent: 0 },
//           { day: 'T6', present: 22, absent: 2 },
//           { day: 'T7', present: 10, absent: 0 },
//           { day: 'CN', present: 0, absent: 0 }
//         ],

//         // Đơn nghỉ phép chờ duyệt
//         pendingLeaves: [
//           { id: 1, name: 'Nguyễn Văn A', department: 'Công nghệ thông tin', type: 'Nghỉ phép năm', days: 3, startDate: '2024-02-01' },
//           { id: 2, name: 'Trần Thị B', department: 'Marketing', type: 'Nghỉ ốm', days: 1, startDate: '2024-01-28' },
//           { id: 3, name: 'Lê Minh C', department: 'Kinh doanh', type: 'Nghỉ phép năm', days: 5, startDate: '2024-02-05' },
//         ],

//         // Công việc sắp đến hạn
//         upcomingTasks: [
//           { id: 1, title: 'Báo cáo tháng 1', assignee: 'Nguyễn Văn A', dueDate: '2024-01-30', priority: 'high' },
//           { id: 2, title: 'Review code module X', assignee: 'Trần Thị B', dueDate: '2024-01-31', priority: 'medium' },
//           { id: 3, title: 'Họp với khách hàng', assignee: 'Team', dueDate: '2024-02-01', priority: 'high' },
//         ],

//         // Hiệu suất team
//         teamPerformance: [
//           { name: 'Nguyễn Văn A', completion: 95, tasks: 12 },
//           { name: 'Trần Thị B', completion: 88, tasks: 10 },
//           { name: 'Lê Minh C', completion: 75, tasks: 8 },
//           { name: 'Phạm Thu D', completion: 92, tasks: 11 },
//         ]
//       };
//       setStats(managerStats);
//     } catch (err) {
//       console.error('Dashboard error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
//           <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header Banner */}
//       <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl mb-6 shadow-lg">
//         <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Quản lý</h1>
//         <p className="text-purple-100">Tổng quan team và công việc</p>
//       </div>

//       {/* Main Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {/* Team Members */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Nhân viên trong team</p>
//               <p className="text-2xl font-bold text-gray-900">{stats?.teamMembers}</p>
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
//                   {stats?.presentToday} có mặt
//                 </span>
//               </div>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//               <Users className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         {/* Pending Leaves */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Đơn nghỉ phép chờ duyệt</p>
//               <p className="text-2xl font-bold text-gray-900">{stats?.pendingLeaveRequests}</p>
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
//                   Cần xử lý
//                 </span>
//               </div>
//             </div>
//             <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
//               <Calendar className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//         </div>

//         {/* Tasks */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Công việc đang thực hiện</p>
//               <p className="text-2xl font-bold text-gray-900">{stats?.inProgressTasks}</p>
//               <div className="flex items-center gap-2 mt-2">
//                 {stats?.overdueTasks > 0 && (
//                   <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
//                     {stats?.overdueTasks} quá hạn
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//               <CheckSquare className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Evaluations */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Đánh giá chờ xử lý</p>
//               <p className="text-2xl font-bold text-gray-900">{stats?.pendingEvaluations}</p>
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
//                   {stats?.completedEvaluations} đã hoàn thành
//                 </span>
//               </div>
//             </div>
//             <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
//               <Star className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Attendance Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
//           <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//             <UserCheck className="w-5 h-5 text-green-600" />
//           </div>
//           <div>
//             <p className="text-xs text-gray-500">Có mặt hôm nay</p>
//             <p className="text-lg font-bold text-gray-900">{stats?.presentToday}/{stats?.teamMembers}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
//           <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//             <Calendar className="w-5 h-5 text-orange-600" />
//           </div>
//           <div>
//             <p className="text-xs text-gray-500">Đang nghỉ phép</p>
//             <p className="text-lg font-bold text-gray-900">{stats?.onLeaveToday}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
//           <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//           </div>
//           <div>
//             <p className="text-xs text-gray-500">Vắng mặt</p>
//             <p className="text-lg font-bold text-gray-900">{stats?.absentToday}</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Pending Leave Requests */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Đơn nghỉ phép chờ duyệt</h3>
//             <Calendar className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="space-y-3">
//             {stats?.pendingLeaves?.map((leave) => (
//               <div
//                 key={leave.id}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
//                     {leave.name.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{leave.name}</p>
//                     <p className="text-xs text-gray-500">{leave.department}</p>
//                     <p className="text-xs text-gray-400">{leave.type} - {leave.days} ngày</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-600">{leave.startDate}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => navigate('/leaves')}
//             className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
//           >
//             Xem tất cả & Duyệt đơn
//           </button>
//         </div>

//         {/* Upcoming Tasks */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Công việc sắp đến hạn</h3>
//             <Target className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="space-y-3">
//             {stats?.upcomingTasks?.map((task) => (
//               <div
//                 key={task.id}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`w-2 h-10 rounded-full ${
//                     task.priority === 'high' ? 'bg-red-500' :
//                     task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                   }`}></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{task.title}</p>
//                     <p className="text-xs text-gray-500">{task.assignee}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className={`text-xs font-medium ${
//                     task.priority === 'high' ? 'text-red-600' : 'text-gray-600'
//                   }`}>{task.dueDate}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => navigate('/tasks')}
//             className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
//           >
//             Quản lý công việc
//           </button>
//         </div>
//       </div>

//       {/* Team Performance & Weekly Attendance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Team Performance */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Hiệu suất team</h3>
//             <TrendingUp className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="space-y-4">
//             {stats?.teamPerformance?.map((member, index) => (
//               <div key={index} className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
//                   {member.name.charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-sm text-gray-700">{member.name}</span>
//                     <span className="text-sm font-medium text-gray-900">{member.completion}%</span>
//                   </div>
//                   <div className="w-full bg-gray-100 rounded-full h-2">
//                     <div
//                       className={`h-2 rounded-full ${
//                         member.completion >= 90 ? 'bg-green-500' :
//                         member.completion >= 70 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${member.completion}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => navigate('/evaluations')}
//             className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
//           >
//             Đánh giá nhân viên
//           </button>
//         </div>

//         {/* Weekly Team Attendance Chart */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Chấm công team tuần này</h3>
//           <div className="flex items-end justify-between h-40 px-2">
//             {stats?.weeklyTeamAttendance?.map((day, index) => (
//               <div key={index} className="flex flex-col items-center gap-2">
//                 <div className="flex flex-col gap-1">
//                   <div
//                     className="w-8 bg-purple-400 rounded-t"
//                     style={{ height: `${(day.present / 24) * 100}px` }}
//                     title={`Có mặt: ${day.present}`}
//                   ></div>
//                   <div
//                     className="w-8 bg-red-400 rounded-b"
//                     style={{ height: `${(day.absent / 24) * 100}px` }}
//                     title={`Vắng: ${day.absent}`}
//                   ></div>
//                 </div>
//                 <span className="text-xs text-gray-500 font-medium">{day.day}</span>
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-purple-400 rounded"></div>
//               <span className="text-xs text-gray-600">Có mặt</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-red-400 rounded"></div>
//               <span className="text-xs text-gray-600">Vắng mặt</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
//           <button
//             onClick={() => navigate('/leaves')}
//             className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
//           >
//             <Calendar className="w-6 h-6 text-orange-600" />
//             <span className="text-xs font-medium text-orange-700">Duyệt nghỉ phép</span>
//           </button>

//           <button
//             onClick={() => navigate('/tasks')}
//             className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
//           >
//             <CheckSquare className="w-6 h-6 text-blue-600" />
//             <span className="text-xs font-medium text-blue-700">Quản lý công việc</span>
//           </button>

//           <button
//             onClick={() => navigate('/evaluations')}
//             className="flex flex-col items-center gap-2 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors"
//           >
//             <Star className="w-6 h-6 text-yellow-600" />
//             <span className="text-xs font-medium text-yellow-700">Đánh giá</span>
//           </button>

//           <button
//             onClick={() => navigate('/reports')}
//             className="flex flex-col items-center gap-2 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
//           >
//             <BarChart3 className="w-6 h-6 text-indigo-600" />
//             <span className="text-xs font-medium text-indigo-700">Báo cáo</span>
//           </button>

//           <button
//             onClick={() => navigate('/employees')}
//             className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
//           >
//             <Users className="w-6 h-6 text-purple-600" />
//             <span className="text-xs font-medium text-purple-700">Nhân viên</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;








import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Calendar, Clock, CheckSquare, FileText,
  TrendingUp, AlertCircle, ClipboardList, Star, Target,
  MessageCircle, Bell, ChevronRight, BarChart3
} from 'lucide-react';
// ❌ Bỏ fakeApi
// import fakeApi from '../../services/fakeApi';
// ✅ Dùng API thật
import { getManagerStatisticsSummary } from '../../services/api';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Gọi BE
      const res = await getManagerStatisticsSummary();
      console.log('Manager summary:', res);

      // Map dữ liệu BE -> shape cũ mà UI của bạn đang dùng
      const managerStats = {
        // Nhân viên trong team
        teamMembers: res.totalEmployees ?? 0,
        presentToday: res.currentActiveEmployees ?? 0,
        onLeaveToday: res.employeesOnLeaveToday ?? 0,
        absentToday: res.absentEmployeesToday ?? 0,

        // Nghỉ phép
        pendingLeaveRequests: res.pendingLeaveRequests ?? 0,
        approvedThisMonth: 0,  // BE chưa trả -> để 0
        rejectedThisMonth: 0,

        // Công việc
        totalTasks: (res.inProgressTasks ?? 0) + (res.overdueTasks ?? 0),
        completedTasks: 0, // BE chưa trả
        inProgressTasks: res.inProgressTasks ?? 0,
        overdueTasks: res.overdueTasks ?? 0,

        // Đánh giá
        pendingEvaluations: 0,    // BE chưa trả
        completedEvaluations: 0,  // BE chưa trả

        // Chấm công team tuần này (BE trả %)
        weeklyTeamAttendance:
          res.weeklyAttendancePercentage?.dailyPercentages?.map((d) => ({
            day: d.dayOfWeek,
            // dùng trực tiếp % để vẽ cột, scale 0–100px
            present: d.presentPercentage ?? 0,
            absent: d.absentPercentage ?? 0,
          })) ?? [],

        // Đơn nghỉ phép chờ duyệt – BE chưa có list chi tiết, tạm để trống
        pendingLeaves: [],

        // Công việc sắp đến hạn (map từ BE)
        upcomingTasks: (res.upcomingTasks ?? []).map((t, idx) => ({
          id: idx,
          title: t.title,
          assignee: t.employeeName,
          dueDate: t.deadline,
          priority: 'medium', // BE chưa có priority -> gán mặc định
        })),

        // Hiệu suất team (map từ employeeEvaluationScores)
        teamPerformance: (res.employeeEvaluationScores ?? []).map((e) => ({
          name: e.employeeName,
          completion: e.percentage ?? 0,
          tasks: 0,
        })),
      };

      setStats(managerStats);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Quản lý</h1>
        <p className="text-purple-100">Tổng quan team và công việc</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nhân viên trong team</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.teamMembers}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stats?.presentToday} có mặt
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Đơn nghỉ phép chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingLeaveRequests}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Cần xử lý
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Công việc đang thực hiện</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.inProgressTasks}</p>
              <div className="flex items-center gap-2 mt-2">
                {stats?.overdueTasks > 0 && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {stats?.overdueTasks} quá hạn
                  </span>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Evaluations */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Đánh giá chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingEvaluations}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {stats?.completedEvaluations} đã hoàn thành
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Có mặt hôm nay</p>
            <p className="text-lg font-bold text-gray-900">{stats?.presentToday}/{stats?.teamMembers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Đang nghỉ phép</p>
            <p className="text-lg font-bold text-gray-900">{stats?.onLeaveToday}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Vắng mặt</p>
            <p className="text-lg font-bold text-gray-900">{stats?.absentToday}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Đơn nghỉ phép chờ duyệt</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.pendingLeaves?.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                Chưa có danh sách chi tiết từ API
              </div>
            ) : (
              stats.pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                      {leave.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{leave.name}</p>
                      <p className="text-xs text-gray-500">{leave.department}</p>
                      <p className="text-xs text-gray-400">{leave.type} - {leave.days} ngày</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{leave.startDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => navigate('/leaves')}
            className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            Xem tất cả & Duyệt đơn
          </button>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Công việc sắp đến hạn</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.upcomingTasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${
                    task.priority === 'high' ? 'text-red-600' : 'text-gray-600'
                  }`}>{task.dueDate}</p>
                </div>
              </div>
            ))}
            {(!stats?.upcomingTasks || stats.upcomingTasks.length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Không có công việc sắp đến hạn
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Quản lý công việc
          </button>
        </div>
      </div>

      {/* Team Performance & Weekly Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Performance */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất team</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats?.teamPerformance?.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                Chưa có dữ liệu đánh giá
              </div>
            ) : (
              stats.teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{member.name}</span>
                      <span className="text-sm font-medium text-gray-900">{member.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          member.completion >= 90 ? 'bg-green-500' :
                          member.completion >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${member.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => navigate('/evaluations')}
            className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            Đánh giá nhân viên
          </button>
        </div>

        {/* Weekly Team Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chấm công team tuần này</h3>
          <div className="flex items-end justify-between h-40 px-2">
            {stats?.weeklyTeamAttendance?.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1">
                  {/* dùng % làm pixel, tối đa ~100px */}
                  <div
                    className="w-8 bg-purple-400 rounded-t"
                    style={{ height: `${day.present}px` }}
                    title={`Có mặt: ${day.present}%`}
                  ></div>
                  <div
                    className="w-8 bg-red-400 rounded-b"
                    style={{ height: `${day.absent}px` }}
                    title={`Vắng: ${day.absent}%`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{day.day}</span>
              </div>
            ))}
            {(!stats?.weeklyTeamAttendance || stats.weeklyTeamAttendance.length === 0) && (
              <div className="text-center w-full text-gray-500 text-sm">
                Chưa có dữ liệu chấm công tuần này
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded"></div>
              <span className="text-xs text-gray-600">Có mặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-xs text-gray-600">Vắng mặt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <button
            onClick={() => navigate('/leaves')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-orange-600" />
            <span className="text-xs font-medium text-orange-700">Duyệt nghỉ phép</span>
          </button>

          <button
            onClick={() => navigate('/tasks')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Quản lý công việc</span>
          </button>

          <button
            onClick={() => navigate('/evaluations')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors"
          >
            <Star className="w-6 h-6 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-700">Đánh giá</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Báo cáo</span>
          </button>

          <button
            onClick={() => navigate('/employees')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Nhân viên</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
