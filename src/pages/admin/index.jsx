import React from "react";
import Icon from "../../components/AppIcon";

export default function Admin() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Icon name="Shield" size={28} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Trang quản trị</h1>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all">
          <Icon name="Users" size={22} className="text-accent mb-3" />
          <h2 className="font-semibold mb-2">Quản lý người dùng</h2>
          <p className="text-sm text-muted-foreground">Thêm, chỉnh sửa, phân quyền cho nhân sự.</p>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all">
          <Icon name="Database" size={22} className="text-accent mb-3" />
          <h2 className="font-semibold mb-2">Cấu hình dữ liệu</h2>
          <p className="text-sm text-muted-foreground">Quản lý dữ liệu công ty và các bảng tham chiếu.</p>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all">
          <Icon name="BarChart3" size={22} className="text-accent mb-3" />
          <h2 className="font-semibold mb-2">Báo cáo hệ thống</h2>
          <p className="text-sm text-muted-foreground">Xem thống kê sử dụng, audit logs và logs bảo mật.</p>
        </div>
      </div>
    </div>
  );
}
