import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Calendar, Clock } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeeAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fakeApi.getAttendanceRecords();
      setRecords(res.data.slice(0, 10));
      setLoading(false);
    };
    load();
  }, []);

  // Tính tổng số giờ làm việc
  const totalHours = records.reduce((sum, r) => sum + (parseFloat(r.hoursWorked) || 0), 0);
  const presentDays = records.filter(r => r.status === 'present' || r.status === 'overtime').length;

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header với nút quay lại */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <a 
              href="/employee" 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <Download size={18} />
              <span>Tải báo cáo</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chấm công của tôi</h1>
              <p className="text-purple-100">Theo dõi lịch sử điểm danh, đi muộn, nghỉ phép</p>
            </div>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày làm việc</p>
                <p className="text-2xl font-bold text-gray-900">{presentDays}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng giờ làm</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bản ghi</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng lịch sử */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="font-semibold text-gray-700">Lịch sử gần đây</div>
            <div className="text-sm text-gray-500">Hiển thị {records.length} mục</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ làm</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.checkIn || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.checkOut || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        r.status==='present'?'bg-green-100 text-green-700':
                        r.status==='late'?'bg-yellow-100 text-yellow-700':
                        r.status==='overtime'?'bg-purple-100 text-purple-700':
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.hoursWorked}h</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && records.length === 0 && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      Chưa có dữ liệu chấm công
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeAttendance;
