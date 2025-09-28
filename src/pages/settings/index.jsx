import React from "react";
import Icon from "../../components/AppIcon";

export default function Settings() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Icon name="Settings" size={28} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Cài đặt hệ thống</h1>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all duration-300">
          <Icon name="User" size={22} className="text-accent mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Tài khoản</h2>
          <p className="text-sm text-muted-foreground">Quản lý thông tin cá nhân, mật khẩu và bảo mật đăng nhập.</p>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all duration-300">
          <Icon name="Bell" size={22} className="text-accent mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Thông báo</h2>
          <p className="text-sm text-muted-foreground">Tùy chỉnh cài đặt nhận email, SMS và thông báo trong ứng dụng.</p>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all duration-300">
          <Icon name="Shield" size={22} className="text-accent mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Quyền riêng tư</h2>
          <p className="text-sm text-muted-foreground">Điều chỉnh quyền truy cập và chia sẻ dữ liệu nhân sự.</p>
        </div>
      </div>
    </div>
  );
}
