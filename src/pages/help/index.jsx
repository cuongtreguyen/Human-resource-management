import React from "react";
import Icon from "../../components/AppIcon";

export default function Help() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Icon name="HelpCircle" size={28} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Trợ giúp & Hỗ trợ</h1>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all duration-300">
          <h2 className="text-lg font-semibold mb-2">📘 Tài liệu hướng dẫn</h2>
          <p className="text-sm text-muted-foreground mb-4">Xem chi tiết cách sử dụng hệ thống HRM.</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all">Xem tài liệu</button>
        </div>

        <div className="p-6 bg-card rounded-xl shadow-soft hover:shadow-strong transition-all duration-300">
          <h2 className="text-lg font-semibold mb-2">💬 Liên hệ hỗ trợ</h2>
          <p className="text-sm text-muted-foreground mb-4">Gửi yêu cầu hoặc chat với đội hỗ trợ.</p>
          <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all">Liên hệ ngay</button>
        </div>
      </div>
    </div>
  );
}
