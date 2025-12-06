import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { getEmployeeById } from "../../services/api"; // ✅ Đã sửa đúng tên hàm
import {
  clearRole,
  getCurrentEmployeeId,
  isAuthenticated,
} from "../../utils/auth";

const EmployeePortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated()) {
          navigate("/login");
          return;
        }

        const employeeId = getCurrentEmployeeId();
        if (!employeeId) {
          console.error("Không tìm thấy employeeId trong session");
          setLoading(false);
          return;
        }

        // ✅ Gọi API thật – dùng getEmployeeById
        const data = await getEmployeeById(employeeId);
        setEmployee(data);
      } catch (e) {
        console.error("Lỗi tải thông tin nhân viên:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

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
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 -left-10 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-2xl mb-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Xin chào{employee ? `, ${employee.fullName}` : ""}
              </h1>
              <p className="text-orange-100 mt-3 text-lg">
                Chúc bạn một ngày làm việc thật hiệu quả và vui vẻ!
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className="bg-white text-orange-700 hover:bg-orange-50 font-medium"
                onClick={() => navigate("/employee/leave")}
              >
                Xin nghỉ phép
              </Button>
              <Button
                variant="outline"
                className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30"
                onClick={() => navigate("/employee/tasks")}
              >
                Xem nhiệm vụ
              </Button>
              <Button
                variant="primary"
                className="bg-orange-600 hover:bg-orange-700 font-medium"
                onClick={() => navigate("/employee/attendance")}
              >
                Chấm công
              </Button>
              <Button
                variant="danger"
                className="bg-red-500 hover:bg-red-600 font-medium"
                onClick={() => {
                  clearRole();
                  navigate("/login");
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Thông tin tóm tắt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Phòng ban", value: employee?.department || "Chưa xác định" },
            { label: "Chức danh", value: employee?.position || "Nhân viên" },
            {
              label: "Lương cơ bản",
              value: employee?.salary
                ? `${Number(employee.salary).toLocaleString()}₫`
                : "0₫",
            },
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

        {/* Tác vụ nhanh */}
        <Card
          title="Tác vụ nhanh"
          className="bg-white/95 backdrop-blur mb-8 shadow-lg"
        >
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

        {/* Hồ sơ cá nhân */}
        <div className="max-w-3xl mx-auto">
          <Card
            title="Thông tin cá nhân"
            className="bg-white/95 backdrop-blur shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar và thông tin cơ bản */}
              <div className="flex flex-col items-center md:items-start gap-4 md:border-r md:pr-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                  {employee?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "NV"}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {employee?.fullName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {employee?.position || "Nhân viên"}
                  </p>
                  <p className="text-orange-600 font-medium mt-1">
                    {employee?.department || "Chưa xác định"}
                  </p>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="font-medium text-gray-800 break-all">
                      {employee?.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
                    <p className="font-medium text-gray-800">
                      {employee?.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Ngày vào làm</p>
                    <p className="font-medium text-gray-800">
                      {employee?.hireDate
                        ? new Date(employee.hireDate).toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Trạng thái</p>
                    <p className="font-medium text-green-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Đang làm việc
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  variant="secondary"
                  onClick={() => navigate("/employee/profile")}
                >
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
