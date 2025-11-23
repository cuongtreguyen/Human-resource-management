// import React from 'react';
// import Card from '../../components/ui/Card';
// import Button from '../../components/ui/Button';
// import {
//   Shield,
//   Heart,
//   FileText,
//   CheckCircle,
//   TrendingUp,
//   Plus,
//   Users,
//   Wallet
// } from 'lucide-react';

// const benefitPrograms = [
//   {
//     id: 1,
//     name: 'Bảo hiểm sức khỏe doanh nghiệp',
//     allowance: '100% nội trú, 80% ngoại trú',
//     budget: 480000000,
//     owner: 'HR Team',
//     participants: 128,
//     status: 'active',
//     nextReview: '2025-01-15'
//   },
//   {
//     id: 2,
//     name: 'Phụ cấp ăn trưa',
//     allowance: '35,000 VNĐ / ngày làm việc',
//     budget: 220000000,
//     owner: 'Payroll',
//     participants: 154,
//     status: 'active',
//     nextReview: '2024-12-01'
//   },
//   {
//     id: 3,
//     name: 'Phụ cấp đi lại',
//     allowance: '700,000 VNĐ / tháng',
//     budget: 96000000,
//     owner: 'Operations',
//     participants: 86,
//     status: 'draft',
//     nextReview: '2024-11-20'
//   }
// ];

// const insurancePolicies = [
//   {
//     id: 'BHYT-2024-01',
//     provider: 'Bảo hiểm xã hội Việt Nam',
//     type: 'Bảo hiểm y tế',
//     effective: '2024-01-01',
//     expiry: '2024-12-31',
//     coverage: '100%',
//     status: 'active'
//   },
//   {
//     id: 'BHTN-2024-02',
//     provider: 'Bảo hiểm xã hội Việt Nam',
//     type: 'Bảo hiểm thất nghiệp',
//     effective: '2024-01-01',
//     expiry: '2024-12-31',
//     coverage: '100%',
//     status: 'active'
//   },
//   {
//     id: 'BH_TNGT-2024-03',
//     provider: 'PTI Insurance',
//     type: 'Bảo hiểm tai nạn',
//     effective: '2024-02-01',
//     expiry: '2025-01-31',
//     coverage: '500,000,000 VNĐ',
//     status: 'in-review'
//   }
// ];

// const pendingRequests = [
//   {
//     id: 'REQ-2401',
//     employee: 'Trần Hoàng Nam',
//     department: 'Kỹ thuật',
//     type: 'Thêm người phụ thuộc',
//     submitted: '2024-10-04',
//     priority: 'high'
//   },
//   {
//     id: 'REQ-2402',
//     employee: 'Nguyễn Thị Hạnh',
//     department: 'Tài chính',
//     type: 'Cập nhật bảo hiểm',
//     submitted: '2024-10-02',
//     priority: 'medium'
//   },
//   {
//     id: 'REQ-2403',
//     employee: 'Vũ Đức Thịnh',
//     department: 'Kinh doanh',
//     type: 'Hủy phụ cấp ăn trưa',
//     submitted: '2024-09-30',
//     priority: 'low'
//   }
// ];

// const statusStyles = {
//   active: 'bg-green-100 text-green-700',
//   'in-review': 'bg-yellow-100 text-yellow-700',
//   draft: 'bg-gray-100 text-gray-600'
// };

// const AdminBenefits = () => {
//   const totalBudget = benefitPrograms.reduce((sum, item) => sum + item.budget, 0);
//   const totalParticipants = benefitPrograms.reduce((sum, item) => sum + item.participants, 0);

//   return (
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
//           <div className="flex items-start justify-between gap-6 flex-wrap">
//             <div>
//               <p className="text-sm text-purple-100 uppercase tracking-wider">Quản trị / Phúc Lợi</p>
//               <h1 className="text-3xl font-bold mt-2">Trung Tâm Quản Lý Phúc Lợi & Bảo Hiểm</h1>
//               <p className="text-purple-100 mt-3 max-w-2xl">
//                 Quản lý các chương trình phúc lợi, chính sách bảo hiểm và yêu cầu của nhân viên trong một không gian làm việc.
//               </p>
//             </div>
//             <div className="flex gap-3 flex-wrap">
//               <Button variant="secondary" size="md">
//                 Xuất Tổng Quan
//               </Button>
//               <Button
//                 size="md"
//                 icon={<Plus className="w-4 h-4" />}
//               >
//                 Thêm Phúc Lợi
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <Heart className="text-purple-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Chương trình hoạt động</p>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {benefitPrograms.filter(item => item.status === 'active').length}
//               </p>
//             </div>
//           </div>
//           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Shield className="text-blue-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Chính sách bảo hiểm</p>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {insurancePolicies.length}
//               </p>
//             </div>
//           </div>
//           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <Users className="text-green-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Người tham gia</p>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {totalParticipants}
//               </p>
//             </div>
//           </div>
//           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-amber-100 rounded-lg">
//               <Wallet className="text-amber-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Ngân sách năm</p>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {(totalBudget / 1000000).toFixed(1)}M VNĐ
//               </p>
//             </div>
//           </div>
//         </div>

//         <Card
//           title="Chương Trình Phúc Lợi"
//           subtitle="Phụ cấp và đặc quyền toàn công ty"
//           icon={<Heart className="w-5 h-5" />}
//           actions={
//             <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
//               Tải Danh Mục
//             </Button>
//           }
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
//                   <th className="pb-3">Chương trình</th>
//                   <th className="pb-3">Mức hỗ trợ</th>
//                   <th className="pb-3">Phụ trách</th>
//                   <th className="pb-3">Số người</th>
//                   <th className="pb-3">Ngân sách</th>
//                   <th className="pb-3">Trạng thái</th>
//                   <th className="pb-3">Đánh giá tiếp</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {benefitPrograms.map(program => (
//                   <tr key={program.id} className="border-b border-gray-100 last:border-0">
//                     <td className="py-4">
//                       <p className="font-medium text-gray-900">{program.name}</p>
//                     </td>
//                     <td className="py-4 text-gray-600 text-sm">{program.allowance}</td>
//                     <td className="py-4 text-gray-600 text-sm">{program.owner}</td>
//                     <td className="py-4 text-gray-900">{program.participants}</td>
//                     <td className="py-4 text-gray-900">{program.budget.toLocaleString()} VNĐ</td>
//                     <td className="py-4">
//                       <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[program.status]}`}>
//                         {program.status}
//                       </span>
//                     </td>
//                     <td className="py-4 text-gray-600 text-sm">{program.nextReview}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card
//             title="Chính Sách Bảo Hiểm"
//             subtitle="Theo dõi phạm vi bảo hiểm và vòng đời"
//             icon={<Shield className="w-5 h-5" />}
//           >
//             <div className="space-y-4">
//               {insurancePolicies.map(policy => (
//                 <div key={policy.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-semibold text-gray-900">{policy.type}</p>
//                       <p className="text-sm text-gray-500">{policy.provider}</p>
//                     </div>
//                     <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[policy.status]}`}>
//                       {policy.status}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
//                     <div>
//                       <p className="text-gray-500">Mã bảo hiểm</p>
//                       <p className="font-medium text-gray-900">{policy.id}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Phạm vi</p>
//                       <p className="font-medium text-gray-900">{policy.coverage}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Hiệu lực</p>
//                       <p className="font-medium text-gray-900">{policy.effective}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Hết hạn</p>
//                       <p className="font-medium text-gray-900">{policy.expiry}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           <Card
//             title="Yêu Cầu Chờ Duyệt"
//             subtitle="Các yêu cầu cần phê duyệt"
//             icon={<TrendingUp className="w-5 h-5" />}
//             actions={
//               <Button variant="outline" size="sm">
//                 Xem quy trình
//               </Button>
//             }
//           >
//             <div className="space-y-4">
//               {pendingRequests.map(request => (
//                 <div key={request.id} className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
//                   <div>
//                     <p className="font-semibold text-gray-900">{request.employee}</p>
//                     <p className="text-sm text-gray-500">{request.department}</p>
//                     <p className="text-sm text-gray-600 mt-1">{request.type}</p>
//                   </div>
//                   <div className="text-right">
//                     <span
//                       className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${
//                         request.priority === 'high'
//                           ? 'bg-red-100 text-red-700'
//                           : request.priority === 'medium'
//                             ? 'bg-yellow-100 text-yellow-700'
//                             : 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {request.priority === 'high' ? 'Ưu tiên cao' : request.priority === 'medium' ? 'Trung bình' : 'Thấp'}
//                     </span>
//                     <p className="text-xs text-gray-500 mt-1">Ngày gửi: {request.submitted}</p>
//                     <div className="flex gap-2 mt-3 justify-end">
//                       <Button variant="secondary" size="sm">
//                         Xem xét
//                       </Button>
//                       <Button size="sm" icon={<CheckCircle className="w-4 h-4" />}>
//                         Phê duyệt
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//   );
// };

// export default AdminBenefits;

import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Heart,
  Shield,
  Users,
  Wallet,
  FileText,
  Plus,
  TrendingUp,
  CheckCircle,
  XCircle,
  User,
  Clock,
  AlertCircle,
  Calendar,
  Paperclip,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// === DỮ LIỆU PHÚC LỢI ===
const welfarePrograms = [
  { id: 1, name: 'Phụ cấp ăn trưa', amount: '35.000 VNĐ/ngày làm việc', budget: 220_000_000, participants: 154, owner: 'Phòng Hành chính', status: 'active', nextReview: '01/12/2024' },
  { id: 2, name: 'Phụ cấp xăng xe / đi lại', amount: '700.000 VNĐ/tháng', budget: 96_000_000, participants: 86, owner: 'Phòng Hành chính', status: 'active', nextReview: '20/11/2024' },
  { id: 3, name: 'Thẻ tập gym & wellness', amount: 'Miễn phí 100%', budget: 180_000_000, participants: 92, owner: 'HR - Văn hóa doanh nghiệp', status: 'active', nextReview: '15/01/2025' },
  { id: 4, name: 'Phụ cấp điện thoại', amount: '300.000 VNĐ/tháng', budget: 72_000_000, participants: 68, owner: 'IT Support', status: 'draft', nextReview: '30/11/2024' }
];

// === DỮ LIỆU BẢO HIỂM CHUNG ===
const insurancePolicies = [
  { id: 'BHXH-2024', name: 'Bảo hiểm xã hội (BHXH)', provider: 'Bảo hiểm xã hội Việt Nam', employerRate: '17.5%', employeeRate: '8%', effective: '01/01/2024', expiry: '31/12/2024' },
  { id: 'BHYT-2024', name: 'Bảo hiểm y tế (BHYT)', provider: 'Bảo hiểm xã hội Việt Nam', employerRate: '3%', employeeRate: '1.5%', effective: '01/01/2024', expiry: '31/12/2024' },
  { id: 'BHTN-2024', name: 'Bảo hiểm thất nghiệp (BHTN)', provider: 'Bảo hiểm xã hội Việt Nam', employerRate: '1%', employeeRate: '1%', effective: '01/01/2024', expiry: '31/12/2024' },
  { id: 'BH-TN-2024', name: 'Bảo hiểm tai nạn 24/24', provider: 'Bảo hiểm PTI', employerRate: '100% công ty đóng', employeeRate: '0%', effective: '01/02/2024', expiry: '31/01/2025' },
];

// === BẢO HIỂM HIỆN TẠI CỦA TỪNG NHÂN VIÊN (giả lập) ===
const employeeInsuranceData = {
  'REQ-2401': [
    { type: 'BHXH', start: '01/03/2022', end: null, dependents: 1 },
    { type: 'BHYT', start: '01/03/2022', end: null, dependents: 2 },
    { type: 'BHTN', start: '01/03/2022', end: null, dependents: 0 },
    { type: 'Bảo hiểm tai nạn 24/24', start: '01/02/2024', end: '31/01/2025', dependents: 0 },
  ],
  'REQ-2402': [
    { type: 'BHXH', start: '15/06/2021', end: null, dependents: 0 },
    { type: 'BHYT', start: '15/06/2021', end: null, dependents: 1 },
    { type: 'BHTN', start: '15/06/2021', end: null, dependents: 0 },
  ],
  'REQ-2403': [
    { type: 'BHXH', start: '10/08/2023', end: null, dependents: 0 },
    { type: 'BHYT', start: '10/08/2023', end: null, dependents: 0 },
    { type: 'BHTN', start: '10/08/2023', end: null, dependents: 0 },
  ],
};

// === YÊU CẦU CHỜ DUYỆT ===
const initialRequests = [
  {
    id: 'REQ-2401',
    employee: 'Trần Hoàng Nam',
    department: 'Kỹ thuật',
    type: 'Thêm người phụ thuộc (vợ) vào BHYT',
    submitted: '04/10/2024',
    reason: 'Vợ mới sinh con cần thêm vào thẻ BHYT gia đình để hưởng quyền lợi khám chữa bệnh.',
    attachments: 2
  },
  {
    id: 'REQ-2402',
    employee: 'Nguyễn Thị Hạnh',
    department: 'Tài chính',
    type: 'Cập nhật thông tin thẻ BHYT',
    submitted: '02/10/2024',
    reason: 'Thay đổi nơi khám chữa bệnh ban đầu từ BV Bạch Mai sang BV Vinmec.',
    attachments: 1
  },
  {
    id: 'REQ-2403',
    employee: 'Vũ Đức Thịnh',
    department: 'Kinh doanh',
    type: 'Hủy phụ cấp ăn trưa (làm remote)',
    submitted: '30/09/2024',
    reason: 'Chuyển sang làm việc full remote từ ngày 01/10/2024 nên không còn nhu cầu nhận phụ cấp ăn trưa.',
    attachments: 0
  }
];

const AdminBenefits = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalBudget = welfarePrograms.reduce((sum, p) => sum + p.budget, 0);
  const totalParticipants = welfarePrograms.reduce((sum, p) => sum + p.participants, 0);

  const openDetail = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const approveRequest = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn PHÊ DUYỆT yêu cầu này?')) {
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success(`Đã phê duyệt yêu cầu ${id}`, { autoClose: 3000 });
      setIsModalOpen(false);
    }
  };

  const rejectRequest = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn TỪ CHỐI yêu cầu này?')) {
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.error(`Đã từ chối yêu cầu ${id}`, { autoClose: 3000 });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-6 p-6 min-h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <p className="text-purple-100 text-sm uppercase tracking-wider">Quản trị • HR</p>
              <h1 className="text-4xl font-bold mt-1">Quản Lý Phúc Lợi & Bảo Hiểm</h1>
              <p className="text-purple-100 mt-3 max-w-3xl text-lg">
                Trung tâm điều hành các chế độ phúc lợi đơn vị, chính sách bảo hiểm và xử lý yêu cầu nhân viên.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" size="md">Xuất báo cáo</Button>
              <Button size="md" icon={<Plus className="w-5 h-5" />}>Thêm phúc lợi mới</Button>
            </div>
          </div>
        </div>

        {/* Tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-xl"><Heart className="text-purple-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Phúc lợi đang áp dụng</p>
                <p className="text-3xl font-bold text-gray-900">{welfarePrograms.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl"><Shield className="text-blue-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Loại bảo hiểm</p>
                <p className="text-3xl font-bold text-gray-900">{insurancePolicies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-xl"><Users className="text-green-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Người hưởng phúc lợi</p>
                <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-100 rounded-xl"><Wallet className="text-amber-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Ngân sách phúc lợi năm</p>
                <p className="text-3xl font-bold text-gray-900">{(totalBudget / 1_000_000).toFixed(1)} tỷ VNĐ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phúc lợi đơn vị */}
        <Card title="Các khoản phúc lợi đơn vị" subtitle="Phụ cấp, hỗ trợ và đặc quyền cho nhân viên" icon={<Heart className="w-6 h-6 text-purple-600" />}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  <th className="pb-3">Tên phúc lợi</th>
                  <th className="pb-3">Mức hỗ trợ</th>
                  <th className="pb-3">Người phụ trách</th>
                  <th className="pb-3">Số người hưởng</th>
                  <th className="pb-3">Ngân sách năm</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3">Xem xét lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {welfarePrograms.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="py-4 text-gray-700">{p.amount}</td>
                    <td className="py-4 text-gray-600">{p.owner}</td>
                    <td className="py-4 text-gray-900 font-medium">{p.participants}</td>
                    <td className="py-4 text-gray-900">{(p.budget / 1_000_000).toFixed(0)} triệu</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status === 'active' ? 'Đang áp dụng' : 'Soạn thảo'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">{p.nextReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bảo hiểm & Yêu cầu chờ duyệt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chính sách bảo hiểm */}
          <Card title="Chính sách bảo hiểm" subtitle="Bảo hiểm bắt buộc & tự nguyện" icon={<Shield className="w-6 h-6 text-blue-600" />}>
            <div className="space-y-4">
              {insurancePolicies.map(policy => (
                <div key={policy.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{policy.name}</h4>
                        <p className="text-sm text-gray-500">{policy.provider}</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 text-xs rounded-full bg-green-100 text-green-700 font-bold">Đang hoạt động</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500">Công ty đóng</p><p className="font-bold text-green-600">{policy.employerRate}</p></div>
                    <div><p className="text-gray-500">Nhân viên đóng</p><p className="font-bold text-orange-600">{policy.employeeRate}</p></div>
                    <div><p className="text-gray-500">Hiệu lực</p><p className="font-medium">{policy.effective}</p></div>
                    <div><p className="text-gray-500">Hết hạn</p><p className="font-medium">{policy.expiry}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Yêu cầu chờ duyệt */}
          <Card title="Yêu cầu đang chờ duyệt" subtitle="Xử lý nhanh các thay đổi phúc lợi & bảo hiểm" icon={<TrendingUp className="w-6 h-6 text-amber-600" />}>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-400 opacity-50" />
                  <p className="text-xl font-bold">Không có yêu cầu nào đang chờ duyệt</p>
                  <p className="text-sm mt-2">Tất cả đã được xử lý!</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="p-6 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-all">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900">{req.employee}</p>
                      <p className="text-sm text-gray-600 mt-1">{req.department} • {req.type}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Gửi ngày: {req.submitted}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm" onClick={() => openDetail(req)}>Xem chi tiết</Button>
                      <Button size="sm" icon={<CheckCircle className="w-5 h-5" />} onClick={() => approveRequest(req.id)}>Phê duyệt</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL CHI TIẾT YÊU CẦU - SIÊU XỊN */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Chi tiết yêu cầu #{selectedRequest.id}</h3>
                <p className="text-gray-500 mt-1">Yêu cầu thay đổi phúc lợi & bảo hiểm</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-10">

              {/* Thông tin nhân viên */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <h4 className="font-bold text-xl text-blue-900 mb-6 flex items-center gap-3">
                  <User className="w-7 h-7" /> Thông tin nhân viên
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div><p className="text-sm text-gray-600">Họ và tên</p><p className="text-2xl font-bold text-gray-900">{selectedRequest.employee}</p></div>
                  <div><p className="text-sm text-gray-600">Phòng ban</p><p className="text-2xl font-bold text-blue-700">{selectedRequest.department}</p></div>
                  <div><p className="text-sm text-gray-600">Mã yêu cầu</p><p className="text-2xl font-mono text-gray-800">{selectedRequest.id}</p></div>
                </div>
              </div>

              {/* Loại yêu cầu */}
              <div className="bg-amber-50 rounded-2xl p-8 border border-amber-300">
                <h4 className="font-bold text-xl text-amber-900 mb-5">Loại yêu cầu</h4>
                <div className="bg-white rounded-xl p-6 border-4 border-amber-400">
                  <p className="text-2xl font-bold text-amber-800">{selectedRequest.type}</p>
                </div>
              </div>

              {/* Lý do */}
              <div>
                <h4 className="font-bold text-xl mb-5 flex items-center gap-3">
                  <FileText className="w-7 h-7" /> Lý do yêu cầu
                </h4>
                <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-8">
                  <p className="text-gray-800 text-lg leading-relaxed">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Tệp đính kèm */}
              {selectedRequest.attachments > 0 && (
                <div>
                  <h4 className="font-bold text-xl mb-5 flex items-center gap-3">
                    <Paperclip className="w-7 h-7" /> Tệp đính kèm ({selectedRequest.attachments})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(selectedRequest.attachments)].map((_, i) => (
                      <div key={i} className="bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-500 cursor-pointer group transition-all">
                        <FileText className="w-16 h-16 mx-auto text-gray-400 group-hover:text-blue-600" />
                        <p className="mt-4 text-sm font-bold text-gray-700">Tệp đính kèm {i + 1}</p>
                        <p className="text-xs text-gray-500">Nhấp để xem</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BẢO HIỂM HIỆN TẠI */}
              <div className="border-t-8 border-blue-600 pt-10 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8">
                <h4 className="font-bold text-3xl mb-8 text-center text-blue-900 flex items-center justify-center gap-4">
                  <Shield className="w-10 h-10" />
                  Bảo hiểm hiện tại của {selectedRequest.employee.split(' ').pop()}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {employeeInsuranceData[selectedRequest.id]?.map((ins, idx) => (
                    <div key={idx} className="bg-white border-4 border-green-300 rounded-2xl p-8 shadow-lg">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h5 className="text-2xl font-bold text-green-800">{ins.type}</h5>
                          <span className="inline-block mt-3 px-5 py-2 text-sm font-bold rounded-full bg-green-600 text-white">
                            Đang tham gia
                          </span>
                        </div>
                        {ins.dependents > 0 && (
                          <div className="text-right">
                            <p className="text-5xl font-bold text-blue-600">{ins.dependents}</p>
                            <p className="text-sm text-gray-600 font-medium">người phụ thuộc</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 text-lg">
                        <div className="flex justify-between"><span className="text-gray-600">Từ ngày</span><span className="font-bold">{ins.start}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Đến ngày</span><span className="font-bold">{ins.end || 'Vô thời hạn'}</span></div>
                      </div>

                      {ins.type === 'BHYT' && selectedRequest.type.includes('Thêm người phụ thuộc') && ins.dependents >= 4 && (
                        <div className="mt-6 p-6 bg-red-100 border-4 border-red-500 rounded-xl">
                          <p className="text-red-800 font-bold text-lg flex items-center gap-3">
                            <AlertCircle className="w-8 h-8" />
                            Không thể thêm người phụ thuộc! (Đã đạt tối đa 4 người theo quy định BHXH Việt Nam)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-6 justify-end pt-8 border-t-4 border-gray-300">
                <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(false)} className="px-10">Đóng</Button>
                <Button variant="danger" size="lg" icon={<XCircle className="w-6 h-6" />} onClick={() => rejectRequest(selectedRequest.id)} className="px-10">
                  Từ chối yêu cầu
                </Button>
                <Button size="lg" icon={<CheckCircle className="w-6 h-6" />} onClick={() => approveRequest(selectedRequest.id)} className="px-12 bg-green-600 hover:bg-green-700">
                  Phê duyệt ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBenefits;