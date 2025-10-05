import React, { useEffect, useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeePayroll = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fakeApi.getPayrollRecords();
      setRecords(res.data);
      setLoading(false);
    };
    load();
  }, []);

  // Tính tổng thu nhập
  const totalIncome = records.reduce((sum, r) => sum + r.netSalary, 0);
  const avgSalary = records.length > 0 ? totalIncome / records.length : 0;
  const latestSalary = records.length > 0 ? records[0].netSalary : 0;

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
          <div>
            <h1 className="text-3xl font-bold mb-2">Bảng lương của tôi</h1>
            <p className="text-purple-100">Xem lịch sử lương và chi tiết thanh toán</p>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lương tháng gần nhất</p>
                <p className="text-2xl font-bold text-gray-900">{latestSalary.toLocaleString()}₫</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lương trung bình</p>
                <p className="text-2xl font-bold text-gray-900">{avgSalary.toLocaleString()}₫</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng thu nhập</p>
                <p className="text-2xl font-bold text-gray-900">{totalIncome.toLocaleString()}₫</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng lương */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Lịch sử bảng lương</h2>
              <p className="text-sm text-gray-500 mt-1">Hiển thị {records.length} bản ghi</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tháng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lương cơ bản</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phụ cấp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tăng ca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thưởng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khấu trừ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thực lĩnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.basicSalary.toLocaleString()}₫</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.allowance.toLocaleString()}₫</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.overtime.toLocaleString()}₫</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">+{r.bonus.toLocaleString()}₫</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">-{r.deduction.toLocaleString()}₫</td>
                    <td className="px-6 py-4 text-sm font-bold text-purple-600">{r.netSalary.toLocaleString()}₫</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        r.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedRecord(r)}
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={9}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && records.length === 0 && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={9}>
                      Chưa có dữ liệu bảng lương
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal chi tiết */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
                <h3 className="text-2xl font-bold">Chi tiết bảng lương</h3>
                <p className="text-purple-100 mt-1">{selectedRecord.month}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Lương cơ bản</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRecord.basicSalary.toLocaleString()}₫</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Phụ cấp</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRecord.allowance.toLocaleString()}₫</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Tăng ca</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRecord.overtime.toLocaleString()}₫</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Thưởng</p>
                    <p className="text-xl font-bold text-green-700">+{selectedRecord.bonus.toLocaleString()}₫</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 mb-1">Khấu trừ</p>
                    <p className="text-xl font-bold text-red-700">-{selectedRecord.deduction.toLocaleString()}₫</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Thực lĩnh</p>
                    <p className="text-xl font-bold text-purple-700">{selectedRecord.netSalary.toLocaleString()}₫</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                      selectedRecord.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedRecord.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
                    </span>
                    <button 
                      onClick={() => setSelectedRecord(null)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeePayroll;