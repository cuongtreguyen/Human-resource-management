// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
// import fakeApi from '../../services/fakeApi';

// const EmployeePayroll = () => {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fakeApi.getPayrollRecords();
//       setRecords(res.data);
//       setLoading(false);
//     };
//     load();
//   }, []);

//   // Tính tổng thu nhập
//   const totalIncome = records.reduce((sum, r) => sum + r.netSalary, 0);
//   const avgSalary = records.length > 0 ? totalIncome / records.length : 0;
//   const latestSalary = records.length > 0 ? records[0].netSalary : 0;

//   return (
//     <div>
//       <div className="space-y-6">
//         {/* Header với nút quay lại */}
//         <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
//           <div className="flex items-center justify-between mb-4">
//             <a 
//               href="/employee" 
//               className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
//             >
//               <ArrowLeft size={18} />
//               <span>Quay lại</span>
//             </a>
//             <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
//               <Download size={18} />
//               <span>Tải báo cáo</span>
//             </button>
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Bảng lương của tôi</h1>
//             <p className="text-purple-100">Xem lịch sử lương và chi tiết thanh toán</p>
//           </div>
//         </div>

//         {/* Thẻ thống kê */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <DollarSign className="text-green-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Lương tháng gần nhất</p>
//                 <p className="text-2xl font-bold text-gray-900">{latestSalary.toLocaleString()}₫</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <TrendingUp className="text-blue-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Lương trung bình</p>
//                 <p className="text-2xl font-bold text-gray-900">{avgSalary.toLocaleString()}₫</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <Calendar className="text-purple-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Tổng thu nhập</p>
//                 <p className="text-2xl font-bold text-gray-900">{totalIncome.toLocaleString()}₫</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bảng lương */}
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//           <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
//             <div>
//               <h2 className="font-semibold text-gray-900">Lịch sử bảng lương</h2>
//               <p className="text-sm text-gray-500 mt-1">Hiển thị {records.length} bản ghi</p>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tháng</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lương cơ bản</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phụ cấp</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tăng ca</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thưởng</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khấu trừ</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thực lĩnh</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {!loading && records.map(r => (
//                   <tr key={r.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.month}</td>
//                     <td className="px-6 py-4 text-sm text-gray-700">{r.basicSalary.toLocaleString()}₫</td>
//                     <td className="px-6 py-4 text-sm text-gray-700">{r.allowance.toLocaleString()}₫</td>
//                     <td className="px-6 py-4 text-sm text-gray-700">{r.overtime.toLocaleString()}₫</td>
//                     <td className="px-6 py-4 text-sm text-green-600 font-medium">+{r.bonus.toLocaleString()}₫</td>
//                     <td className="px-6 py-4 text-sm text-red-600 font-medium">-{r.deduction.toLocaleString()}₫</td>
//                     <td className="px-6 py-4 text-sm font-bold text-purple-600">{r.netSalary.toLocaleString()}₫</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${
//                         r.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'
//                       }`}>
//                         {r.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button 
//                         onClick={() => setSelectedRecord(r)}
//                         className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
//                       >
//                         <Eye size={16} />
//                         <span>Xem</span>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {loading && (
//                   <tr>
//                     <td className="px-6 py-12 text-center text-gray-500" colSpan={9}>
//                       <div className="flex items-center justify-center gap-2">
//                         <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
//                         <span>Đang tải...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//                 {!loading && records.length === 0 && (
//                   <tr>
//                     <td className="px-6 py-12 text-center text-gray-500" colSpan={9}>
//                       Chưa có dữ liệu bảng lương
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modal chi tiết */}
//         {selectedRecord && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
//             <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
//               <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
//                 <h3 className="text-2xl font-bold">Chi tiết bảng lương</h3>
//                 <p className="text-purple-100 mt-1">{selectedRecord.month}</p>
//               </div>
              
//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <p className="text-sm text-gray-500 mb-1">Lương cơ bản</p>
//                     <p className="text-xl font-bold text-gray-900">{selectedRecord.basicSalary.toLocaleString()}₫</p>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <p className="text-sm text-gray-500 mb-1">Phụ cấp</p>
//                     <p className="text-xl font-bold text-gray-900">{selectedRecord.allowance.toLocaleString()}₫</p>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <p className="text-sm text-gray-500 mb-1">Tăng ca</p>
//                     <p className="text-xl font-bold text-gray-900">{selectedRecord.overtime.toLocaleString()}₫</p>
//                   </div>
//                   <div className="p-4 bg-green-50 rounded-lg">
//                     <p className="text-sm text-green-600 mb-1">Thưởng</p>
//                     <p className="text-xl font-bold text-green-700">+{selectedRecord.bonus.toLocaleString()}₫</p>
//                   </div>
//                   <div className="p-4 bg-red-50 rounded-lg">
//                     <p className="text-sm text-red-600 mb-1">Khấu trừ</p>
//                     <p className="text-xl font-bold text-red-700">-{selectedRecord.deduction.toLocaleString()}₫</p>
//                   </div>
//                   <div className="p-4 bg-purple-50 rounded-lg">
//                     <p className="text-sm text-purple-600 mb-1">Thực lĩnh</p>
//                     <p className="text-xl font-bold text-purple-700">{selectedRecord.netSalary.toLocaleString()}₫</p>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <span className={`px-4 py-2 text-sm font-medium rounded-full ${
//                       selectedRecord.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'
//                     }`}>
//                       {selectedRecord.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
//                     </span>
//                     <button 
//                       onClick={() => setSelectedRecord(null)}
//                       className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                     >
//                       Đóng
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeePayroll;




// src/components/employee/EmployeePayroll.jsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
import {
  getMyLatestSalary,
  getMyAverageSalary,
  getMyTotalIncome,
  getMySalarySummary,
  getPayrollRecords
} from '../../services/api';
import { JAVA_API } from '../../services/config'; // optional: only if you need direct fetch

const EmployeePayroll = () => {
  const [records, setRecords] = useState([]); // history rows if available
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [latestSalary, setLatestSalary] = useState(0);
  const [avgSalary, setAvgSalary] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("TOKEN CLIENT ĐANG DÙNG:", localStorage.getItem("accessToken"));
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // Call the endpoints in parallel
        const [latestRes, avgRes, totalRes, summaryRes] = await Promise.allSettled([
          getMyLatestSalary(),
          getMyAverageSalary(),
          getMyTotalIncome(),
          getMySalarySummary(),
        ]);

        // latest
        if (latestRes.status === 'fulfilled' && latestRes.value != null) {
          const v = latestRes.value;
          setLatestSalary(typeof v === 'number' ? v : (v.netSalary || v.amount || 0));
        } else {
          console.warn('getMyLatestSalary failed', latestRes.reason);
          setLatestSalary(0);
        }

        // avg
        if (avgRes.status === 'fulfilled' && avgRes.value != null) {
          const v = avgRes.value;
          setAvgSalary(typeof v === 'number' ? v : (v.average || v.amount || 0));
        } else {
          console.warn('getMyAverageSalary failed', avgRes.reason);
          setAvgSalary(0);
        }

        // total
        if (totalRes.status === 'fulfilled' && totalRes.value != null) {
          const v = totalRes.value;
          setTotalIncome(typeof v === 'number' ? v : (v.total || v.amount || 0));
        } else {
          console.warn('getMyTotalIncome failed', totalRes.reason);
          setTotalIncome(0);
        }

        // summary (may be numbers or object or array)
        if (summaryRes.status === 'fulfilled' && summaryRes.value != null) {
          const v = summaryRes.value;
          setSummary(v);

          if (Array.isArray(v)) {
            setRecords(v);
          } else if (Array.isArray(v.data)) {
            setRecords(v.data);
          } else if (v.monthly || v.records) {
            setRecords(v.monthly || v.records);
          } else {
            setRecords([]);
          }
        } else {
          console.warn('getMySalarySummary failed', summaryRes.reason);
          setSummary(null);
          setRecords([]);
        }
      } catch (err) {
        console.error('Load payroll error', err);
        setError('Không thể tải dữ liệu bảng lương. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const fmt = (v) => {
    if (v == null) return '0';
    const num = Number(v) || 0;
    return num.toLocaleString();
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <a href="/employee" className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
            <button onClick={() => alert('Tải báo cáo: tính năng chưa bật.')} className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <Download size={18} />
              <span>Tải báo cáo</span>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Bảng lương của tôi</h1>
            <p className="text-purple-100">Xem lịch sử lương và chi tiết thanh toán</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lương tháng gần nhất</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `${fmt(latestSalary)}₫`}</p>
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
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `${fmt(avgSalary)}₫`}</p>
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
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `${fmt(totalIncome)}₫`}</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {/* Table / Summary */}
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

                {!loading && records.length === 0 && summary ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-700">{summary.month || '—'}</td>
                    <td className="px-6 py-6 text-sm text-gray-700">{fmt(summary.basicSalary)}₫</td>
                    <td className="px-6 py-6 text-sm text-gray-700">{fmt(summary.allowance)}₫</td>
                    <td className="px-6 py-6 text-sm text-gray-700">{fmt(summary.overtime)}₫</td>
                    <td className="px-6 py-6 text-sm text-green-600 font-medium">+{fmt(summary.bonus)}₫</td>
                    <td className="px-6 py-6 text-sm text-red-600 font-medium">-{fmt(summary.deduction)}₫</td>
                    <td className="px-6 py-6 text-sm font-bold text-purple-600">{fmt(summary.netSalary)}₫</td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${summary.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {summary.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <button onClick={() => setSelectedRecord(summary)} className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                        <Eye size={16} />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ) : null}

                {!loading && records.length > 0 && records.map(r => (
                  <tr key={r.id || `${r.month}-${r.netSalary}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{fmt(r.basicSalary)}₫</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{fmt(r.allowance)}₫</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{fmt(r.overtime)}₫</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">+{fmt(r.bonus)}₫</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">-{fmt(r.deduction)}₫</td>
                    <td className="px-6 py-4 text-sm font-bold text-purple-600">{fmt(r.netSalary)}₫</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${r.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {r.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedRecord(r)} className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                        <Eye size={16} />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ))}
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
                <p className="text-purple-100 mt-1">{selectedRecord.month || selectedRecord.reportMonth || '—'}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Lương cơ bản</p>
                    <p className="text-xl font-bold text-gray-900">{fmt(selectedRecord.basicSalary)}₫</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Phụ cấp</p>
                    <p className="text-xl font-bold text-gray-900">{fmt(selectedRecord.allowance)}₫</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Tăng ca</p>
                    <p className="text-xl font-bold text-gray-900">{fmt(selectedRecord.overtime)}₫</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Thưởng</p>
                    <p className="text-xl font-bold text-green-700">+{fmt(selectedRecord.bonus)}₫</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 mb-1">Khấu trừ</p>
                    <p className="text-xl font-bold text-red-700">-{fmt(selectedRecord.deduction)}₫</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Thực lĩnh</p>
                    <p className="text-xl font-bold text-purple-700">{fmt(selectedRecord.netSalary)}₫</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${selectedRecord.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {selectedRecord.status === 'paid' ? '✓ Đã thanh toán' : '⏱ Chờ thanh toán'}
                    </span>
                    <button onClick={() => setSelectedRecord(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayroll;

