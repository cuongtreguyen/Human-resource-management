import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const empRes = await fakeApi.getEmployees();
        const current = empRes.data[0];
        setEmployee(current);
        const summary = await fakeApi.getEmployeeTaskSummary(current.id);
        setTaskSummary(summary.data);
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
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Ảnh nền văn phòng
            alt="office background"
            className="w-full h-full object-cover"
          />
          {/* Lớp phủ gradient màu tím mờ hơn để giao diện vẫn rõ ràng */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 opacity-70"></div>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <div className="text-gray-500">Không có dữ liệu nhiệm vụ</div>
                )}
                <div className="mt-4 flex gap-3">
                  <Button variant="primary" className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => navigate("/employee/tasks")}>
                    Xem nhiệm vụ
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
    </EmployeeLayout>
  );
};

export default EmployeePortal;