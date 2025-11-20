import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, Edit, CheckCircle, Clock, AlertCircle, Calendar, User, TrendingUp, FileText } from "lucide-react";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import fakeApi from "../../services/fakeApi";
import { clearRole } from "../../utils/auth";
import { motion } from "framer-motion"; // Import motion từ Framer Motion

const EmployeePortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [taskSummary, setTaskSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskProgress, setTaskProgress] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showTaskUpdate, setShowTaskUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateNote, setUpdateNote] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const empRes = await fakeApi.getEmployees();
        const current = empRes.data[0];
        setEmployee(current);
        const summary = await fakeApi.getEmployeeTaskSummary(current.id);
        setTaskSummary(summary.data);
        
        // Load tasks
        const tasksRes = await fakeApi.getTasks();
        // Filter tasks for current employee (in real app, filter by employeeId)
        const loadedTasks = tasksRes.data;
        setTasks(loadedTasks);
        
        // Load progress for each task
        loadedTasks.forEach(task => {
          fakeApi.getTaskProgress(task.id).then(res => {
            setTaskProgress(prev => ({
              ...prev,
              [task.id]: res.data
            }));
          }).catch(err => console.error('Error loading task progress:', err));
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Handle task status update
  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    
    try {
      // Update task status
      await fakeApi.updateTask(selectedTask.id, { 
        status: updateStatus
      });
      
      // Update progress if changed
      if (updateProgress !== (taskProgress[selectedTask.id]?.currentProgress || 0)) {
        await fakeApi.updateTaskProgress(selectedTask.id, {
          currentProgress: updateProgress,
          note: updateNote
        });
      }
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: updateStatus }
          : task
      ));
      
      // Update progress
      setTaskProgress(prev => ({
        ...prev,
        [selectedTask.id]: {
          ...prev[selectedTask.id],
          currentProgress: updateProgress,
          note: updateNote
        }
      }));
      
      // Update summary
      if (employee?.id) {
        const summary = await fakeApi.getEmployeeTaskSummary(employee.id);
        setTaskSummary(summary.data);
      }
      
      setShowTaskUpdate(false);
      setSelectedTask(null);
      alert('Cập nhật nhiệm vụ thành công!');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật nhiệm vụ');
    }
  };

  const quickActions = [
    { title: "Chấm công", desc: "Xem lịch sử chấm công", action: () => navigate("/employee/attendance") },
    { title: "Xin nghỉ phép", desc: "Gửi yêu cầu nghỉ phép", action: () => navigate("/employee/leave") },
    { title: "Bảng lương", desc: "Xem bảng lương của bạn", action: () => navigate("/employee/payroll") },
    { title: "Nhiệm vụ", desc: "Công việc được giao", action: () => navigate("/employee/tasks") },
    { title: "Tài liệu", desc: "Văn bản & biểu mẫu", action: () => navigate("/employee/documents") },
    { title: "Hồ sơ cá nhân", desc: "Cập nhật thông tin", action: () => navigate("/employee/profile") },
    { title: "Đánh giá hiệu suất", desc: "Xem kết quả đánh giá", action: () => navigate("/employee/performance") },
    { title: "Đào tạo", desc: "Khóa học & phát triển", action: () => navigate("/employee/training") },
    { title: "Phúc lợi", desc: "Bảo hiểm & phúc lợi", action: () => navigate("/employee/benefits") },
    { title: "Hỗ trợ", desc: "FAQ & ticket hỗ trợ", action: () => navigate("/employee/support") },
  ];

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            {/* Spinner với màu tím hiện đại hơn */}
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto" />
            <p className="text-gray-600 mt-4">Đang tải cổng nhân viên...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-0 relative overflow-hidden min-h-screen">
        {/* Background animation/image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Ảnh nền văn phòng mờ */}
          {/* <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Ảnh nền văn phòng
            alt="office background"
            className="w-full h-full object-cover"
          /> */}
          {/* Lớp phủ gradient màu tím mờ hơn để giao diện vẫn rõ ràng */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 opacity-70"></div> */}
          {/* Thêm một vài vòng tròn/hình dạng trừu tượng để tạo hiệu ứng động nhẹ nhàng */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500 opacity-10 rounded-full mix-blend-screen animate-blob filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500 opacity-10 rounded-full mix-blend-screen animate-blob animation-delay-2000 filter blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-fuchsia-500 opacity-10 rounded-full mix-blend-screen animate-blob animation-delay-4000 filter blur-3xl"></div>
        </div>

        <div className="relative z-10 p-4 md:p-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white p-8 rounded-2xl mb-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Xin chào{employee ? `, ${employee.name}` : ""} 👋
                </h1>
                <p className="text-purple-200 mt-2 text-sm md:text-base">
                  Chúc bạn một ngày làm việc hiệu quả và vui vẻ!
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" className="bg-white text-purple-700 hover:bg-purple-50" onClick={() => navigate("/employee/leave")}>
                  Xin nghỉ phép
                </Button>
                <Button variant="outline" className="bg-white text-purple-700 hover:bg-purple-50" onClick={() => navigate("/employee/tasks")}>
                  Xem nhiệm vụ
                </Button>
                <Button variant="primary" className="bg-fuchsia-500 text-white hover:bg-fuchsia-600" onClick={() => navigate("/employee/attendance")}>
                  Chấm công
                </Button>
                <Button variant="outline" className="bg-white text-purple-700 hover:bg-purple-50" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
                <Button variant="danger" className="bg-red-500 text-white hover:bg-red-600" onClick={() => { clearRole(); navigate("/login"); }}>
                  Đăng xuất
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Phòng ban", value: employee?.department, emoji: "🏢", color: "indigo" },
              { label: "Chức danh", value: employee?.position, emoji: "🧑‍💼", color: "fuchsia" },
              { label: "Lương cơ bản", value: employee ? `${employee.salary?.toLocaleString()}₫` : "-", emoji: "💰", color: "purple" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 bg-white bg-opacity-95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{item.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center`}>
                      {item.emoji}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <Card title="Tác vụ nhanh" className="bg-white bg-opacity-95 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {quickActions.map((qa, index) => (
                <motion.button
                  key={qa.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.4 }}
                  onClick={qa.action}
                  className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group"
                >
                  <div className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">
                    {qa.title}
                  </div>
                  <div className="text-gray-500 text-sm mt-1 group-hover:text-gray-700">
                    {qa.desc}
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Tasks & profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <Card title="Tổng quan nhiệm vụ" className="bg-white bg-opacity-95 backdrop-blur-sm">
                {taskSummary ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                      <p className="text-gray-500 text-sm">Tổng số</p>
                      <p className="text-2xl font-bold text-gray-900">{taskSummary.totalTasks}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }} className="p-4 bg-green-50 rounded-lg hover:shadow-md transition-all">
                      <p className="text-gray-600 text-sm">Hoàn thành</p>
                      <p className="text-2xl font-bold text-green-700">{taskSummary.completedTasks}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }} className="p-4 bg-blue-50 rounded-lg hover:shadow-md transition-all">
                      <p className="text-gray-600 text-sm">Đang làm</p>
                      <p className="text-2xl font-bold text-blue-700">{taskSummary.inProgressTasks}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.9 }} className="p-4 bg-red-50 rounded-lg hover:shadow-md transition-all">
                      <p className="text-gray-600 text-sm">Quá hạn</p>
                      <p className="text-2xl font-bold text-red-700">{taskSummary.overdueTasks}</p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-gray-500 mb-6">Không có dữ liệu nhiệm vụ</div>
                )}

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { id: 'all', label: 'Tất cả', count: tasks.length },
                    { id: 'new', label: 'Mới', count: tasks.filter(t => t.status === 'new').length },
                    { id: 'in-progress', label: 'Đang làm', count: tasks.filter(t => t.status === 'in-progress').length },
                    { id: 'pending', label: 'Chờ xử lý', count: tasks.filter(t => t.status === 'pending').length },
                    { id: 'complete', label: 'Hoàn thành', count: tasks.filter(t => t.status === 'complete').length }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setTaskFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        taskFilter === filter.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>

                {/* Tasks list */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasks
                    .filter(task => taskFilter === 'all' || task.status === taskFilter)
                    .map(task => {
                      const progress = taskProgress[task.id];
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
                          case 'in-progress': return 'bg-teal-100 text-teal-700 border-teal-200';
                          case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
                          case 'complete': return 'bg-green-100 text-green-700 border-green-200';
                          default: return 'bg-gray-100 text-gray-700 border-gray-200';
                        }
                      };
                      const getPriorityColor = (priority) => {
                        switch (priority) {
                          case 'high': return 'bg-red-100 text-red-800';
                          case 'medium': return 'bg-yellow-100 text-yellow-800';
                          case 'low': return 'bg-green-100 text-green-800';
                          default: return 'bg-gray-100 text-gray-800';
                        }
                      };
                      const getStatusText = (status) => {
                        switch (status) {
                          case 'new': return 'Mới';
                          case 'in-progress': return 'Đang làm';
                          case 'pending': return 'Chờ xử lý';
                          case 'complete': return 'Hoàn thành';
                          default: return status;
                        }
                      };
                      const getPriorityText = (priority) => {
                        switch (priority) {
                          case 'high': return 'Cao';
                          case 'medium': return 'Trung bình';
                          case 'low': return 'Thấp';
                          default: return priority;
                        }
                      };

                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 text-sm mb-1">{task.title}</h3>
                              <p className="text-gray-600 text-xs line-clamp-2">{task.description}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)} ml-3 whitespace-nowrap`}>
                              {getStatusText(task.status)}
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          {progress && (
                            <div className="mb-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Tiến độ</span>
                                <span className="text-xs text-gray-500">{progress.currentProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress.currentProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              {task.assignee?.avatar && (
                                <img
                                  src={task.assignee.avatar}
                                  alt={task.assignee.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs text-gray-500">{task.assignee?.name || 'Chưa giao'}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {getPriorityText(task.priority)}
                            </span>
                          </div>
                          
                          {task.startDate && task.endDate && (
                            <div className="mt-2 text-xs text-gray-500">
                              <div>Bắt đầu: {task.startDate}</div>
                              <div>Kết thúc: {task.endDate}</div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskDetail(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-gray-700"
                            >
                              <Eye size={16} />
                              Chi tiết
                            </button>
                            {task.status !== 'complete' && (
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setUpdateStatus(task.status);
                                  setUpdateProgress(progress?.currentProgress || 0);
                                  setUpdateNote('');
                                  setShowTaskUpdate(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
                              >
                                <Edit size={16} />
                                Cập nhật
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  
                  {tasks.filter(task => taskFilter === 'all' || task.status === taskFilter).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Không có nhiệm vụ nào
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button variant="primary" className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => navigate("/employee/tasks")}>
                    Xem tất cả nhiệm vụ
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => navigate("/employee/chat")}>
                    Trao đổi với quản lý
                  </Button>
                </div>
              </Card>

              <Card title="Thông báo" className="bg-white bg-opacity-95 backdrop-blur-sm">
                <div className="space-y-3">
                  {[
                    { text: "Bảng lương tháng mới đã có sẵn.", color: "blue" },
                    { text: "Bạn có 1 nhiệm vụ cần hoàn thành trong hôm nay.", color: "yellow" },
                    { text: "Cuộc họp phòng vào 15:00 chiều nay.", color: "purple" },
                  ].map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 1.0 }}
                      className={`p-3 bg-${n.color}-50 border border-${n.color}-200 rounded-lg text-${n.color}-800 hover:shadow-md transition-all`}
                    >
                      {n.text}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Profile section */}
            <div className="space-y-6">
              <Card title="Thông tin cá nhân" className="bg-white bg-opacity-95 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center text-xl font-bold shadow-md"
                  >
                    {employee?.name?.split(" ").map((n) => n[0]).join("")}
                  </motion.div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{employee?.name}</div>
                    <div className="text-gray-600 text-sm">{employee?.email}</div>
                    <div className="text-gray-600 text-sm">{employee?.phone}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-500">Ngày vào làm</div>
                  <div className="text-gray-900">{employee?.hireDate}</div>
                  <div className="text-gray-500">Trạng thái</div>
                  <div className="text-gray-900 capitalize">{employee?.status}</div>
                </div>
                <div className="mt-4">
                  <Button variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={() => navigate("/employee/profile")}>
                    Cập nhật hồ sơ
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">Chi tiết nhiệm vụ</h2>
                <p className="text-purple-100 text-sm">Thông tin đầy đủ về nhiệm vụ</p>
              </div>
              <button
                onClick={() => {
                  setShowTaskDetail(false);
                  setSelectedTask(null);
                }}
                className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Task Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTask.title}</h3>
                <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Trạng thái</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTask.status === 'complete' ? 'bg-green-100 text-green-700' :
                    selectedTask.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    selectedTask.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedTask.status === 'complete' && <CheckCircle size={16} />}
                    {selectedTask.status === 'in-progress' && <Clock size={16} />}
                    {selectedTask.status === 'pending' && <AlertCircle size={16} />}
                    {selectedTask.status === 'new' ? 'Mới' :
                     selectedTask.status === 'in-progress' ? 'Đang làm' :
                     selectedTask.status === 'pending' ? 'Chờ xử lý' :
                     selectedTask.status === 'complete' ? 'Hoàn thành' : selectedTask.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Ưu tiên</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTask.priority === 'high' ? 'bg-red-100 text-red-700' :
                    selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    <TrendingUp size={16} />
                    {selectedTask.priority === 'high' ? 'Cao' :
                     selectedTask.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
              </div>

              {/* Progress */}
              {taskProgress[selectedTask.id] && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Tiến độ</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {taskProgress[selectedTask.id].currentProgress}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress[selectedTask.id].currentProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Assignee */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-3">Người được giao</p>
                <div className="flex items-center gap-3">
                  {selectedTask.assignee?.avatar ? (
                    <img
                      src={selectedTask.assignee.avatar}
                      alt={selectedTask.assignee.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <User size={24} className="text-purple-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedTask.assignee?.name || 'Chưa giao'}</p>
                    <p className="text-sm text-gray-500">{selectedTask.assignee?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              {(selectedTask.startDate || selectedTask.endDate) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-3">Thời gian</p>
                  <div className="space-y-2">
                    {selectedTask.startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-600">Bắt đầu:</span>
                        <span className="font-medium text-gray-900">{selectedTask.startDate}</span>
                      </div>
                    )}
                    {selectedTask.endDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-600">Kết thúc:</span>
                        <span className="font-medium text-gray-900">{selectedTask.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {taskProgress[selectedTask.id]?.milestones && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-3">Các mốc quan trọng</p>
                  <div className="space-y-2">
                    {taskProgress[selectedTask.id].milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {milestone.completed ? <CheckCircle size={14} /> : <span>{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${milestone.completed ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
                            {milestone.name}
                          </p>
                          {milestone.completedAt && (
                            <p className="text-xs text-gray-500">
                              Hoàn thành: {new Date(milestone.completedAt).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowTaskDetail(false);
                    setSelectedTask(null);
                  }}
                >
                  Đóng
                </Button>
                {selectedTask.status !== 'complete' && (
                  <Button
                    variant="primary"
                    className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => {
                      setShowTaskDetail(false);
                      setUpdateStatus(selectedTask.status);
                      setUpdateProgress(taskProgress[selectedTask.id]?.currentProgress || 0);
                      setUpdateNote('');
                      setShowTaskUpdate(true);
                    }}
                  >
                    <Edit size={16} className="inline mr-2" />
                    Cập nhật
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Task Update Modal */}
      {showTaskUpdate && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">Cập nhật nhiệm vụ</h2>
                <p className="text-purple-100 text-sm">{selectedTask.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowTaskUpdate(false);
                  setSelectedTask(null);
                }}
                className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                >
                  <option value="new">Mới</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="in-progress">Đang làm</option>
                  <option value="complete">Hoàn thành</option>
                </select>
              </div>

              {/* Progress Update */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tiến độ <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm font-semibold text-purple-600">{updateProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={updateProgress}
                  onChange={(e) => setUpdateProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Progress Bar Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Xem trước tiến độ</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${updateProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  rows={4}
                  placeholder="Nhập ghi chú về tiến độ công việc..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowTaskUpdate(false);
                    setSelectedTask(null);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleUpdateTask}
                >
                  <CheckCircle size={16} className="inline mr-2" />
                  Lưu cập nhật
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </EmployeeLayout>
  );
};

export default EmployeePortal;