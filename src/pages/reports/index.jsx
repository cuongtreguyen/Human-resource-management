import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/AppIcon";

export default function Reports() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Báo cáo</h1>
        </div>
        <Link
          to="/reports/submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
        >
          + Gửi báo cáo mới
        </Link>
      </div>

      {/* List reports */}
      <div className="bg-card rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách báo cáo gần đây</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-muted-foreground border-b">
            <tr>
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Tiêu đề</th>
              <th className="py-2 px-3">Ngày gửi</th>
              <th className="py-2 px-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-muted/30 transition-all">
              <td className="py-2 px-3">1</td>
              <td className="py-2 px-3">Báo cáo hiệu suất tháng 9</td>
              <td className="py-2 px-3">28/09/2025</td>
              <td className="py-2 px-3 text-success">Đã duyệt</td>
            </tr>
            <tr className="hover:bg-muted/30 transition-all">
              <td className="py-2 px-3">2</td>
              <td className="py-2 px-3">Đề xuất nhân sự mới</td>
              <td className="py-2 px-3">25/09/2025</td>
              <td className="py-2 px-3 text-warning">Chờ duyệt</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
