import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import fakeApi from "../../services/fakeApi";
import { clearRole } from "../../utils/auth";

const EmployeePortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [taskSummary, setTaskSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // For demo, pick the first employee as the logged-in employee
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
    {
      title: "Chấm công",
      desc: "Xem lịch sử chấm công",
      action: () => navigate("/employee/attendance"),
    },
    {
      title: "Xin nghỉ phép",
      desc: "Gửi yêu cầu nghỉ phép",
      action: () => navigate("/employee/leave"),
    },
    {
      title: "Bảng lương",
      desc: "Xem bảng lương của bạn",
      action: () => navigate("/employee/payroll"),
    },
    {
      title: "Nhiệm vụ",
      desc: "Công việc được giao",
      action: () => navigate("/employee/tasks"),
    },
    {
      title: "Tài liệu",
      desc: "Văn bản & biểu mẫu",
      action: () => navigate("/employee/documents"),
    },
    {
      title: "Hồ sơ cá nhân",
      desc: "Cập nhật thông tin",
      action: () => navigate("/employee/profile"),
    },
    {
      title: "Đánh giá hiệu suất",
      desc: "Xem kết quả đánh giá",
      action: () => navigate("/employee/performance"),
    },
    {
      title: "Đào tạo",
      desc: "Khóa học & phát triển",
      action: () => navigate("/employee/training"),
    },
    {
      title: "Phúc lợi",
      desc: "Bảo hiểm & phúc lợi",
      action: () => navigate("/employee/benefits"),
    },
    {
      title: "Hỗ trợ",
      desc: "FAQ & ticket hỗ trợ",
      action: () => navigate("/employee/support"),
    },
  ];

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto" />
            <p className="text-gray-600 mt-4">Đang tải cổng nhân viên...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-0">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl mb-8 shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Xin chào{employee ? `, ${employee.name}` : ""} 👋
              </h1>
              <p className="text-purple-100 mt-2">
                Chúc bạn một ngày làm việc hiệu quả!
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/employee/leave")}
              >
                Xin nghỉ phép
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/employee/tasks")}
              >
                Xem nhiệm vụ
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/employee/attendance")}
              >
                Chấm công
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  clearRole();
                  navigate("/login");
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Phòng ban</p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee?.department}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                🏢
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Chức danh</p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee?.position}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                🧑‍💼
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Lương cơ bản</p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee ? `${employee.salary?.toLocaleString()}₫` : "-"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                💰
              </div>
            </div>
          </Card>
        </div>

        {/* Quick actions grid */}
        <Card title="Tác vụ nhanh">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quickActions.map((qa) => (
              <button
                key={qa.title}
                onClick={qa.action}
                className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition text-left bg-white"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {qa.title}
                </div>
                <div className="text-gray-500 text-sm mt-1">{qa.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Two columns: tasks & profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Tổng quan nhiệm vụ">
              {taskSummary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Tổng số</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {taskSummary.totalTasks}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Hoàn thành</p>
                    <p className="text-2xl font-bold text-green-700">
                      {taskSummary.completedTasks}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Đang làm</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {taskSummary.inProgressTasks}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Quá hạn</p>
                    <p className="text-2xl font-bold text-red-700">
                      {taskSummary.overdueTasks}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Không có dữ liệu nhiệm vụ</div>
              )}
              <div className="mt-4 flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate("/employee/tasks")}
                >
                  Xem nhiệm vụ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/employee/chat")}
                >
                  Trao đổi với quản lý
                </Button>
              </div>
            </Card>

            <Card title="Thông báo">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  Bảng lương tháng mới đã có sẵn.
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  Bạn có 1 nhiệm vụ cần hoàn thành trong hôm nay.
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-800">
                  Cuộc họp phòng vào 15:00 chiều nay.
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Thông tin cá nhân">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                  {employee?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {employee?.name}
                  </div>
                  <div className="text-gray-600 text-sm">{employee?.email}</div>
                  <div className="text-gray-600 text-sm">{employee?.phone}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-500">Ngày vào làm</div>
                <div className="text-gray-900">{employee?.hireDate}</div>
                <div className="text-gray-500">Trạng thái</div>
                <div className="text-gray-900 capitalize">
                  {employee?.status}
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/employee/profile")}
                >
                  Cập nhật hồ sơ
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeePortal;
