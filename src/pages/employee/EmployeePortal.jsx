// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { X, Eye, Edit, CheckCircle, Clock, AlertCircle, Calendar, User, TrendingUp } from "lucide-react";
// import Card from "../../components/ui/Card";
// import Button from "../../components/ui/Button";
// import fakeApi from "../../services/fakeApi";
// import { clearRole, getCurrentEmployeeId } from "../../utils/auth";
// import { motion } from "framer-motion";

// const EmployeePortal = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [employee, setEmployee] = useState(null);
//   const [taskSummary, setTaskSummary] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [taskFilter, setTaskFilter] = useState('all');
//   const [taskProgress, setTaskProgress] = useState({});
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showTaskDetail, setShowTaskDetail] = useState(false);
//   const [showTaskUpdate, setShowTaskUpdate] = useState(false);
//   const [updateStatus, setUpdateStatus] = useState('');
//   const [updateProgress, setUpdateProgress] = useState(0);
//   const [updateNote, setUpdateNote] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const employeeId = getCurrentEmployeeId();
//         // Lấy thông tin employee hiện tại
//         const empRes = await fakeApi.getEmployeeById(employeeId);
//         if (empRes.success && empRes.data) {
//           setEmployee(empRes.data);
//           const summary = await fakeApi.getEmployeeTaskSummary(employeeId);
//           setTaskSummary(summary.data);
//         } else {
//           // Fallback: lấy employee đầu tiên nếu không tìm thấy
//           const allEmpRes = await fakeApi.getEmployees();
//           if (allEmpRes.success && allEmpRes.data.length > 0) {
//             const current = allEmpRes.data[0];
//             setEmployee(current);
//             const summary = await fakeApi.getEmployeeTaskSummary(current.id);
//             setTaskSummary(summary.data);
//           }
//         }

//         const tasksRes = await fakeApi.getTasks();
//         const loadedTasks = tasksRes.data;
//         setTasks(loadedTasks);

//         loadedTasks.forEach(task => {
//           fakeApi.getTaskProgress(task.id).then(res => {
//             setTaskProgress(prev => ({
//               ...prev,
//               [task.id]: res.data
//             }));
//           }).catch(err => console.error('Error loading task progress:', err));
//         });
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const handleUpdateTask = async () => {
//     if (!selectedTask) return;

//     try {
//       await fakeApi.updateTask(selectedTask.id, { status: updateStatus });

//       if (updateProgress !== (taskProgress[selectedTask.id]?.currentProgress || 0)) {
//         await fakeApi.updateTaskProgress(selectedTask.id, {
//           currentProgress: updateProgress,
//           note: updateNote
//         });
//       }

//       setTasks(prev => prev.map(task =>
//         task.id === selectedTask.id ? { ...task, status: updateStatus } : task
//       ));

//       setTaskProgress(prev => ({
//         ...prev,
//         [selectedTask.id]: {
//           ...prev[selectedTask.id],
//           currentProgress: updateProgress,
//           note: updateNote
//         }
//       }));

//       if (employee?.id) {
//         const summary = await fakeApi.getEmployeeTaskSummary(employee.id);
//         setTaskSummary(summary.data);
//       }

//       setShowTaskUpdate(false);
//       setSelectedTask(null);
//       alert('Cập nhật nhiệm vụ thành công!');
//     } catch (error) {
//       console.error('Error updating task:', error);
//       alert('Có lỗi xảy ra khi cập nhật nhiệm vụ');
//     }
//   };

//   const quickActions = [
//     { title: "Chấm công", desc: "Xem lịch sử chấm công", action: () => navigate("/employee/attendance") },
//     { title: "Xin nghỉ phép", desc: "Gửi yêu cầu nghỉ phép", action: () => navigate("/employee/leave") },
//     { title: "Bảng lương", desc: "Xem bảng lương của bạn", action: () => navigate("/employee/payroll") },
//     { title: "Nhiệm vụ", desc: "Công việc được giao", action: () => navigate("/employee/tasks") },
//     { title: "Tài liệu", desc: "Văn bản & biểu mẫu", action: () => navigate("/employee/documents") },
//     { title: "Hồ sơ cá nhân", desc: "Cập nhật thông tin", action: () => navigate("/employee/profile") },
//     { title: "Phúc lợi", desc: "Bảo hiểm & phúc lợi", action: () => navigate("/employee/benefits") },
//     { title: "Hỗ trợ", desc: "FAQ & ticket hỗ trợ", action: () => navigate("/employee/support") },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto" />
//           <p className="text-gray-600 mt-6 text-lg">Đang tải cổng nhân viên...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
//       {/* Background hiệu ứng */}
//       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 -left-10 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-2xl mb-8 shadow-2xl"
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
//                 Xin chào{employee ? `, ${employee.name}` : ""} 
//               </h1>
//               <p className="text-orange-100 mt-3 text-lg">
//                 Chúc bạn một ngày làm việc thật hiệu quả và vui vẻ!
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <Button variant="secondary" className="bg-white text-orange-700 hover:bg-orange-50 font-medium" onClick={() => navigate("/employee/leave")}>
//                 Xin nghỉ phép
//               </Button>
//               <Button variant="outline" className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30" onClick={() => navigate("/employee/tasks")}>
//                 Xem nhiệm vụ
//               </Button>
//               <Button variant="primary" className="bg-orange-600 hover:bg-orange-700 font-medium" onClick={() => navigate("/employee/attendance")}>
//                 Chấm công
//               </Button>
//               <Button variant="danger" className="bg-red-500 hover:bg-red-600 font-medium" onClick={() => { clearRole(); navigate("/login"); }}>
//                 Đăng xuất
//               </Button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {[
//             { label: "Phòng ban", value: employee?.department || "Chưa xác định"},
//             { label: "Chức danh", value: employee?.position || "Nhân viên"},
//             { label: "Lương cơ bản", value: employee ? `${employee.salary?.toLocaleString()}₫` : "0₫"},
//           ].map((item, index) => (
//             <motion.div
//               key={item.label}
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.15 }}
//             >
//               <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">{item.label}</p>
//                     <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
//                   </div>
//                   <div className={`w-14 h-14 rounded-full bg-${item.color}-100 flex items-center justify-center text-3xl`}>
//                     {item.emoji}
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>

//         {/* Quick Actions */}
//         <Card title="Tác vụ nhanh" className="bg-white/95 backdrop-blur mb-8 shadow-lg">
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {quickActions.map((qa, index) => (
//               <motion.button
//                 key={qa.title}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.05 }}
//                 onClick={qa.action}
//                 className="p-6 border border-gray-200 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left group"
//               >
//                 <div className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
//                   {qa.title}
//                 </div>
//                 <div className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">
//                   {qa.desc}
//                 </div>
//               </motion.button>
//             ))}
//           </div>
//         </Card>

//         {/* Tasks & Profile Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: Tasks + Notifications */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Task Overview */}
//             <Card title="Tổng quan nhiệm vụ" className="bg-white/95 backdrop-blur shadow-lg">
//               {taskSummary ? (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 bg-gray-50 rounded-xl text-center">
//                     <p className="text-gray-500 text-sm">Tổng số</p>
//                     <p className="text-3xl font-bold text-gray-800">{taskSummary.totalTasks}</p>
//                   </motion.div>
//                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 bg-green-50 rounded-xl text-center">
//                     <p className="text-green-600 text-sm">Hoàn thành</p>
//                     <p className="text-3xl font-bold text-green-700">{taskSummary.completedTasks}</p>
//                   </motion.div>
//                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 bg-blue-50 rounded-xl text-center">
//                     <p className="text-blue-600 text-sm">Đang làm</p>
//                     <p className="text-3xl font-bold text-blue-700">{taskSummary.inProgressTasks}</p>
//                   </motion.div>
//                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-5 bg-red-50 rounded-xl text-center">
//                     <p className="text-red-600 text-sm">Quá hạn</p>
//                     <p className="text-3xl font-bold text-red-700">{taskSummary.overdueTasks}</p>
//                   </motion.div>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">Không có dữ liệu nhiệm vụ</p>
//               )}

//               {/* Filter */}
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {['all', 'new', 'in-progress', 'pending', 'complete'].map(filter => (
//                   <button
//                     key={filter}
//                     onClick={() => setTaskFilter(filter)}
//                     className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
//                       taskFilter === filter
//                         ? 'bg-orange-500 text-white shadow-lg'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {filter === 'all' ? 'Tất cả' : filter === 'new' ? 'Mới' : filter === 'in-progress' ? 'Đang làm' : filter === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
//                   </button>
//                 ))}
//               </div>

//               {/* Task List */}
//               <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                 {tasks
//                   .filter(task => taskFilter === 'all' || task.status === taskFilter)
//                   .map(task => {
//                     const progress = taskProgress[task.id];
//                     const getStatusColor = (s) => {
//                       if (s === 'complete') return 'bg-green-100 text-green-700 border-green-200';
//                       if (s === 'in-progress') return 'bg-blue-100 text-blue-700 border-blue-200';
//                       if (s === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//                       return 'bg-gray-100 text-gray-700 border-gray-200';
//                     };

//                     return (
//                       <motion.div
//                         key={task.id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
//                       >
//                         <div className="flex justify-between items-start mb-3">
//                           <h4 className="font-semibold text-gray-900">{task.title}</h4>
//                           <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
//                             {task.status === 'complete' ? 'Hoàn thành' : task.status === 'in-progress' ? 'Đang làm' : task.status === 'pending' ? 'Chờ xử lý' : 'Mới'}
//                           </span>
//                         </div>
//                         {progress && (
//                           <div className="mt-3">
//                             <div className="flex justify-between text-sm mb-1">
//                               <span className="text-gray-600">Tiến độ</span>
//                               <span className="font-bold text-orange-600">{progress.currentProgress}%</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                               <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all" style={{ width: `${progress.currentProgress}%` }}></div>
//                             </div>
//                           </div>
//                         )}
//                         <div className="flex gap-3 mt-4">
//                           <Button size="sm" variant="outline" onClick={() => { setSelectedTask(task); setShowTaskDetail(true); }}>
//                             <Eye size={16} className="mr-1" /> Chi tiết
//                           </Button>
//                           {task.status !== 'complete' && (
//                             <Button size="sm" onClick={() => { setSelectedTask(task); setUpdateStatus(task.status); setUpdateProgress(progress?.currentProgress || 0); setShowTaskUpdate(true); }}>
//                               <Edit size={16} className="mr-1" /> Cập nhật
//                             </Button>
//                           )}
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//               </div>
//             </Card>

//             {/* Notifications */}
//             <Card title="Thông báo gần đây" className="bg-white/95 backdrop-blur shadow-lg">
//               <div className="space-y-4">
//                 {[
//                   { text: "Bảng lương tháng 10 đã sẵn sàng!", icon: "Money", color: "green" },
//                   { text: "Bạn có 2 nhiệm vụ sắp đến hạn", icon: "Warning", color: "yellow" },
//                   { text: "Cuộc họp toàn công ty vào thứ 6 lúc 14:00", icon: "Calendar", color: "blue" },
//                 ].map((n, i) => (
//                   <div key={i} className={`p-4 rounded-xl bg-${n.color}-50 border border-${n.color}-200 flex items-center gap-4`}>
//                     <div className={`w-10 h-10 rounded-full bg-${n.color}-200 flex items-center justify-center text-${n.color}-600`}>
//                       {n.icon === "Money" && "Money"}
//                       {n.icon === "Warning" && "Warning"}
//                       {n.icon === "Calendar" && "Calendar"}
//                     </div>
//                     <p className={`text-${n.color}-800 font-medium`}>{n.text}</p>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           </div>

//           {/* Right: Profile */}
//           <div className="space-y-6">
//             <Card title="Thông tin cá nhân" className="bg-white/95 backdrop-blur shadow-lg">
//               <div className="flex items-center gap-5 mb-6">
//                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
//                   {employee?.name?.split(" ").map(n => n[0]).join("") || "NV"}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">{employee?.name}</h3>
//                   <p className="text-gray-600">{employee?.email}</p>
//                   <p className="text-gray-500 text-sm">{employee?.phone}</p>
//                 </div>
//               </div>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between"><span className="text-gray-500">Ngày vào làm</span><span className="font-medium">{employee?.hireDate || "Chưa có"}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">Trạng thái</span><span className="font-medium text-green-600">Đang làm việc</span></div>
//               </div>
//               <Button className="w-full mt-6" variant="secondary" onClick={() => navigate("/employee/profile")}>
//                 Cập nhật hồ sơ
//               </Button>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Task Detail Modal */}
//       {showTaskDetail && selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-2xl flex justify-between items-center sticky top-0">
//               <div>
//                 <h2 className="text-2xl font-bold">Chi tiết nhiệm vụ</h2>
//                 <p className="text-orange-100">{selectedTask.title}</p>
//               </div>
//               <button onClick={() => { setShowTaskDetail(false); setSelectedTask(null); }} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
//                 <X size={28} />
//               </button>
//             </div>
//             <div className="p-6 space-y-6">
//               <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
//               {/* Các phần còn lại của modal giữ nguyên như cũ */}
//               <div className="flex gap-3">
//                 <Button variant="outline" onClick={() => setShowTaskDetail(false)}>Đóng</Button>
//                 {selectedTask.status !== 'complete' && (
//                   <Button onClick={() => { setShowTaskDetail(false); setShowTaskUpdate(true); }}>
//                     <Edit size={16} className="mr-2" /> Cập nhật nhiệm vụ
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Task Update Modal */}
//       {showTaskUpdate && selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
//             <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-2xl font-bold">Cập nhật nhiệm vụ</h2>
//                   <p className="text-orange-100 text-sm mt-1">{selectedTask.title}</p>
//                 </div>
//                 <button onClick={() => { setShowTaskUpdate(false); setSelectedTask(null); }} className="text-white hover:bg-white/20 p-2 rounded-lg">
//                   <X size={28} />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
//                 <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
//                   <option value="new">Mới</option>
//                   <option value="in-progress">Đang làm</option>
//                   <option value="pending">Chờ xử lý</option>
//                   <option value="complete">Hoàn thành</option>
//                 </select>
//               </div>
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <label className="text-sm font-medium text-gray-700">Tiến độ: {updateProgress}%</label>
//                 </div>
//                 <input type="range" min="0" max="100" value={updateProgress} onChange={e => setUpdateProgress(+e.target.value)} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
//                 <textarea value={updateNote} onChange={e => setUpdateNote(e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Nhập ghi chú..."></textarea>
//               </div>
//               <div className="flex gap-3">
//                 <Button variant="outline" onClick={() => setShowTaskUpdate(false)}>Hủy</Button>
//                 <Button onClick={handleUpdateTask}>Lưu cập nhật</Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeePortal;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, Edit } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import fakeApi from "../../services/fakeApi";
import { clearRole, getCurrentEmployeeId } from "../../utils/auth";
import { motion } from "framer-motion";

const EmployeePortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const employeeId = getCurrentEmployeeId();
        // Lấy thông tin employee hiện tại
        const empRes = await fakeApi.getEmployeeById(employeeId);
        if (empRes.success && empRes.data) {
          setEmployee(empRes.data);
        } else {
          // Fallback: lấy employee đầu tiên nếu không tìm thấy
          const allEmpRes = await fakeApi.getEmployees();
          if (allEmpRes.success && allEmpRes.data.length > 0) {
            const current = allEmpRes.data[0];
            setEmployee(current);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const quickActions = [
    { title: "Chấm công", desc: "Xem lịch sử chấm công", action: () => navigate("/employee/attendance") },
    { title: "Xin nghỉ phép", desc: "Gửi yêu cầu nghỉ phép", action: () => navigate("/employee/leave") },
    { title: "Bảng lương", desc: "Xem bảng lương của bạn", action: () => navigate("/employee/payroll") },
    { title: "Nhiệm vụ", desc: "Công việc được giao", action: () => navigate("/employee/tasks") },
    { title: "Tài liệu", desc: "Văn bản & biểu mẫu", action: () => navigate("/employee/documents") },
    { title: "Hồ sơ cá nhân", desc: "Cập nhật thông tin", action: () => navigate("/employee/profile") },
    { title: "Phúc lợi", desc: "Bảo hiểm & phúc lợi", action: () => navigate("/employee/benefits") },
    { title: "Hỗ trợ", desc: "FAQ & ticket hỗ trợ", action: () => navigate("/employee/support") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto" />
          <p className="text-gray-600 mt-6 text-lg">Đang tải cổng nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Background hiệu ứng */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 -left-10 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-2xl mb-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Xin chào{employee ? `, ${employee.name}` : ""} 
              </h1>
              <p className="text-orange-100 mt-3 text-lg">
                Chúc bạn một ngày làm việc thật hiệu quả và vui vẻ!
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-white text-orange-700 hover:bg-orange-50 font-medium" onClick={() => navigate("/employee/leave")}>
                Xin nghỉ phép
              </Button>
              <Button variant="outline" className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30" onClick={() => navigate("/employee/tasks")}>
                Xem nhiệm vụ
              </Button>
              <Button variant="primary" className="bg-orange-600 hover:bg-orange-700 font-medium" onClick={() => navigate("/employee/attendance")}>
                Chấm công
              </Button>
              <Button variant="danger" className="bg-red-500 hover:bg-red-600 font-medium" onClick={() => { clearRole(); navigate("/login"); }}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Phòng ban", value: employee?.department || "Chưa xác định"},
            { label: "Chức danh", value: employee?.position || "Nhân viên"},
            { label: "Lương cơ bản", value: employee ? `${employee.salary?.toLocaleString()}₫` : "0₫"},
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card title="Tác vụ nhanh" className="bg-white/95 backdrop-blur mb-8 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {quickActions.map((qa, index) => (
              <motion.button
                key={qa.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={qa.action}
                className="p-6 border border-gray-200 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left group"
              >
                <div className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {qa.title}
                </div>
                <div className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">
                  {qa.desc}
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Profile Section - Centered with better layout */}
        <div className="max-w-3xl mx-auto">
          <Card title="Thông tin cá nhân" className="bg-white/95 backdrop-blur shadow-lg">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Avatar and basic info */}
              <div className="flex flex-col items-center md:items-start gap-4 md:border-r md:pr-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                  {employee?.name?.split(" ").map(n => n[0]).join("") || "NV"}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800">{employee?.name}</h3>
                  <p className="text-gray-600 mt-1">{employee?.position || "Nhân viên"}</p>
                  <p className="text-orange-600 font-medium mt-1">{employee?.department || "Chưa xác định"}</p>
                </div>
              </div>

              {/* Right: Detailed info */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="font-medium text-gray-800 break-all">{employee?.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
                    <p className="font-medium text-gray-800">{employee?.phone || "Chưa cập nhật"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Ngày vào làm</p>
                    <p className="font-medium text-gray-800">{employee?.hireDate || "Chưa có"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Trạng thái</p>
                    <p className="font-medium text-green-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Đang làm việc
                    </p>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="secondary" onClick={() => navigate("/employee/profile")}>
                  Cập nhật hồ sơ
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;