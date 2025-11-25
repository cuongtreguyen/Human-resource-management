// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, Shield, Heart, Car, Home, Gift, Download, FileText, Calendar } from 'lucide-react';
// import EmployeeLayout from '../../components/layout/EmployeeLayout';

// const EmployeeBenefitsInsurance = () => {
//   const [benefits, setBenefits] = useState([]);
//   const [insurance, setInsurance] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Mock data
//     const mockBenefits = [
//       {
//         id: 1,
//         name: 'Bảo hiểm y tế',
//         type: 'Health',
//         coverage: '100%',
//         monthlyCost: 0,
//         description: 'Bảo hiểm y tế toàn diện cho nhân viên và gia đình',
//         status: 'active',
//         icon: Heart,
//         color: 'bg-red-100 text-red-600'
//       },
//       {
//         id: 2,
//         name: 'Bảo hiểm xã hội',
//         type: 'Social',
//         coverage: '100%',
//         monthlyCost: 0,
//         description: 'Bảo hiểm xã hội theo quy định của nhà nước',
//         status: 'active',
//         icon: Shield,
//         color: 'bg-blue-100 text-blue-600'
//       },
//       {
//         id: 3,
//         name: 'Bảo hiểm thất nghiệp',
//         type: 'Unemployment',
//         coverage: '100%',
//         monthlyCost: 0,
//         description: 'Bảo hiểm thất nghiệp theo quy định',
//         status: 'active',
//         icon: Shield,
//         color: 'bg-green-100 text-green-600'
//       },
//       {
//         id: 4,
//         name: 'Phụ cấp ăn trưa',
//         type: 'Meal',
//         coverage: '30,000 VNĐ/ngày',
//         monthlyCost: 0,
//         description: 'Phụ cấp ăn trưa cho nhân viên',
//         status: 'active',
//         icon: Gift,
//         color: 'bg-yellow-100 text-yellow-600'
//       },
//       {
//         id: 5,
//         name: 'Phụ cấp xăng xe',
//         type: 'Transport',
//         coverage: '500,000 VNĐ/tháng',
//         monthlyCost: 0,
//         description: 'Phụ cấp xăng xe cho nhân viên',
//         status: 'active',
//         icon: Car,
//         color: 'bg-purple-100 text-purple-600'
//       },
//       {
//         id: 6,
//         name: 'Thẻ gym',
//         type: 'Wellness',
//         coverage: '100%',
//         monthlyCost: 0,
//         description: 'Thẻ tập gym miễn phí tại các phòng gym đối tác',
//         status: 'active',
//         icon: Heart,
//         color: 'bg-pink-100 text-pink-600'
//       }
//     ];

//     const mockInsurance = [
//       {
//         id: 1,
//         policyNumber: 'BHXH-2024-001',
//         type: 'Bảo hiểm xã hội',
//         provider: 'Bảo hiểm xã hội Việt Nam',
//         startDate: '2024-01-01',
//         endDate: '2024-12-31',
//         premium: 0,
//         coverage: '100%',
//         status: 'active',
//         documents: ['Giấy chứng nhận BHXH', 'Thẻ BHYT']
//       },
//       {
//         id: 2,
//         policyNumber: 'BHYT-2024-001',
//         type: 'Bảo hiểm y tế',
//         provider: 'Bảo hiểm y tế Việt Nam',
//         startDate: '2024-01-01',
//         endDate: '2024-12-31',
//         premium: 0,
//         coverage: '100%',
//         status: 'active',
//         documents: ['Thẻ BHYT', 'Sổ khám bệnh']
//       },
//       {
//         id: 3,
//         policyNumber: 'BHTN-2024-001',
//         type: 'Bảo hiểm thất nghiệp',
//         provider: 'Bảo hiểm xã hội Việt Nam',
//         startDate: '2024-01-01',
//         endDate: '2024-12-31',
//         premium: 0,
//         coverage: '100%',
//         status: 'active',
//         documents: ['Giấy chứng nhận BHTN']
//       }
//     ];

//     setBenefits(mockBenefits);
//     setInsurance(mockInsurance);
//     setLoading(false);
//   }, []);

//   const getStatusColor = (status) => {
//     return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
//   };

//   const getStatusText = (status) => {
//     return status === 'active' ? 'Đang hoạt động' : 'Không hoạt động';
//   };

//   if (loading) {
//     return (
//       <EmployeeLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="flex items-center gap-2">
//             <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
//             <span>Đang tải...</span>
//           </div>
//         </div>
//       </EmployeeLayout>
//     );
//   }

//   return (
//     <EmployeeLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
//           <div className="flex items-center gap-4 mb-4">
//             <a 
//               href="/employee" 
//               className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
//             >
//               <ArrowLeft size={18} />
//               <span>Quay lại</span>
//             </a>
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Phúc lợi & Bảo hiểm</h1>
//             <p className="text-purple-100">Thông tin về các chế độ phúc lợi và bảo hiểm của bạn</p>
//           </div>
//         </div>

//         {/* Thống kê */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <Gift className="text-green-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Phúc lợi đang hưởng</p>
//                 <p className="text-2xl font-bold text-gray-900">{benefits.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Shield className="text-blue-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Bảo hiểm</p>
//                 <p className="text-2xl font-bold text-gray-900">{insurance.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <FileText className="text-purple-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Tài liệu</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {insurance.reduce((sum, ins) => sum + ins.documents.length, 0)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Phúc lợi */}
//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Phúc lợi của tôi</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {benefits.map(benefit => {
//               const IconComponent = benefit.icon;
//               return (
//                 <div key={benefit.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className={`p-2 rounded-lg ${benefit.color}`}>
//                       <IconComponent size={20} />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-medium text-gray-900">{benefit.name}</h4>
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(benefit.status)}`}>
//                         {getStatusText(benefit.status)}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                  
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-500">Mức độ bao phủ:</span>
//                       <span className="font-medium text-gray-900">{benefit.coverage}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-500">Chi phí hàng tháng:</span>
//                       <span className="font-medium text-gray-900">
//                         {benefit.monthlyCost === 0 ? 'Miễn phí' : `${benefit.monthlyCost.toLocaleString()} VNĐ`}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bảo hiểm */}
//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bảo hiểm</h3>
//           <div className="space-y-4">
//             {insurance.map(ins => (
//               <div key={ins.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <Shield className="text-blue-600" size={20} />
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">{ins.type}</h4>
//                       <p className="text-sm text-gray-500">{ins.provider}</p>
//                     </div>
//                   </div>
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ins.status)}`}>
//                     {getStatusText(ins.status)}
//                   </span>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
//                   <div>
//                     <p className="text-sm text-gray-500">Số hợp đồng</p>
//                     <p className="font-medium text-gray-900">{ins.policyNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Ngày bắt đầu</p>
//                     <p className="font-medium text-gray-900">{ins.startDate}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Ngày kết thúc</p>
//                     <p className="font-medium text-gray-900">{ins.endDate}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Mức độ bao phủ</p>
//                     <p className="font-medium text-gray-900">{ins.coverage}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Tài liệu liên quan:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {ins.documents.map((doc, index) => (
//                         <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//                           {doc}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
//                     <Download size={16} />
//                     Tải về
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Thông tin bổ sung */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Quy định phúc lợi */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quy định phúc lợi</h3>
//             <div className="space-y-3">
//               <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <h4 className="font-medium text-blue-900 mb-1">Bảo hiểm y tế</h4>
//                 <p className="text-sm text-blue-700">
//                   Công ty chi trả 100% phí bảo hiểm y tế cho nhân viên và 50% cho người thân.
//                 </p>
//               </div>
              
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                 <h4 className="font-medium text-green-900 mb-1">Phụ cấp ăn trưa</h4>
//                 <p className="text-sm text-green-700">
//                   Phụ cấp 30,000 VNĐ/ngày làm việc, thanh toán cùng lương hàng tháng.
//                 </p>
//               </div>
              
//               <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
//                 <h4 className="font-medium text-purple-900 mb-1">Thẻ gym</h4>
//                 <p className="text-sm text-purple-700">
//                   Miễn phí thẻ tập gym tại các phòng gym đối tác trong thành phố.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Liên hệ hỗ trợ */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Hỗ trợ & Liên hệ</h3>
//             <div className="space-y-4">
//               <div className="p-3 border border-gray-200 rounded-lg">
//                 <h4 className="font-medium text-gray-900 mb-1">Phòng Nhân sự</h4>
//                 <p className="text-sm text-gray-600">Email: hr@company.com</p>
//                 <p className="text-sm text-gray-600">Điện thoại: 024-1234-5678</p>
//                 <p className="text-sm text-gray-600">Giờ làm việc: 8:00 - 17:30</p>
//               </div>
              
//               <div className="p-3 border border-gray-200 rounded-lg">
//                 <h4 className="font-medium text-gray-900 mb-1">Bảo hiểm xã hội</h4>
//                 <p className="text-sm text-gray-600">Hotline: 1900-1234</p>
//                 <p className="text-sm text-gray-600">Website: www.baohiemxahoi.gov.vn</p>
//               </div>
              
//               <div className="p-3 border border-gray-200 rounded-lg">
//                 <h4 className="font-medium text-gray-900 mb-1">Bảo hiểm y tế</h4>
//                 <p className="text-sm text-gray-600">Hotline: 1900-5678</p>
//                 <p className="text-sm text-gray-600">Website: www.baohiemyte.gov.vn</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </EmployeeLayout>
//   );
// };

// export default EmployeeBenefitsInsurance;




import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Shield, Heart, Car, Home, Gift, Download, FileText, Calendar, DollarSign,
  Plus, Upload, X, CheckCircle, AlertCircle, UserPlus, MapPin, XCircle as XCircleIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto p-6">
      {children}
    </div>
  </div>
);

const EmployeeBenefitsInsurance = () => {
  const [benefits, setBenefits] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal gửi yêu cầu
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách loại yêu cầu phổ biến
  const requestTypes = [
    { value: 'add-dependent', label: 'Thêm người phụ thuộc vào BHYT (vợ/con)', icon: UserPlus },
    { value: 'change-hospital', label: 'Thay đổi nơi khám chữa bệnh ban đầu', icon: MapPin },
    { value: 'update-info', label: 'Cập nhật thông tin bảo hiểm', icon: FileText },
    { value: 'cancel-benefit', label: 'Hủy phụ cấp (ăn trưa, xăng xe, v.v.)', icon: XCircleIcon },
    { value: 'reactivate-benefit', label: 'Kích hoạt lại phụ cấp đã hủy', icon: CheckCircle },
    { value: 'request-card', label: 'Yêu cầu cấp lại thẻ BHYT/BHXH', icon: Shield },
    { value: 'remote-work', label: 'Chuyển sang làm remote (hủy phụ cấp đi lại)', icon: Home },
    { value: 'other', label: 'Yêu cầu khác', icon: AlertCircle },
  ];

  useEffect(() => {
    const mockBenefits = [
      { id: 1, name: 'Phụ cấp ăn trưa', amount: '1,000,000 VNĐ/tháng', description: 'Phụ cấp ăn trưa cho nhân viên, thanh toán cùng lương', status: 'active', icon: Gift, color: 'bg-yellow-100 text-yellow-600' },
      { id: 2, name: 'Phụ cấp xăng xe', amount: '500,000 VNĐ/tháng', description: 'Hỗ trợ chi phí đi lại cho nhân viên', status: 'active', icon: Car, color: 'bg-purple-100 text-purple-600' },
      { id: 3, name: 'Thẻ gym', amount: 'Miễn phí', description: 'Thẻ tập gym miễn phí tại các phòng gym đối tác', status: 'active', icon: Heart, color: 'bg-pink-100 text-pink-600' },
      { id: 4, name: 'Phụ cấp điện thoại', amount: '200,000 VNĐ/tháng', description: 'Hỗ trợ chi phí điện thoại và internet', status: 'active', icon: DollarSign, color: 'bg-green-100 text-green-600' }
    ];

    const mockInsurance = [
      { id: 1, policyNumber: 'BHXH-2024-001', name: 'Bảo hiểm xã hội', provider: 'Bảo hiểm xã hội Việt Nam', startDate: '01/01/2024', endDate: '31/12/2024', employerPays: '17.5%', employeePays: '8%', description: 'Bảo hiểm xã hội theo quy định của nhà nước', status: 'active', documents: ['Giấy chứng nhận BHXH', 'Sổ BHXH'] },
      { id: 2, policyNumber: 'BHYT-2024-001', name: 'Bảo hiểm y tế', provider: 'Bảo hiểm y tế Việt Nam', startDate: '01/01/2024', endDate: '31/12/2024', employerPays: '3%', employeePays: '1.5%', description: 'Bảo hiểm y tế cho nhân viên và người thân', status: 'active', documents: ['Thẻ BHYT', 'Sổ khám bệnh'] },
      { id: 3, policyNumber: 'BHTN-2024-001', name: 'Bảo hiểm thất nghiệp', provider: 'Bảo hiểm xã hội Việt Nam', startDate: '01/01/2024', endDate: '31/12/2024', employerPays: '1%', employeePays: '1%', description: 'Bảo hiểm thất nghiệp theo quy định', status: 'active', documents: ['Giấy chứng nhận BHTN'] }
    ];

    setBenefits(mockBenefits);
    setInsurance(mockInsurance);
    setLoading(false);
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitRequest = () => {
    if (!selectedType || !reason.trim()) {
      toast.error('Vui lòng chọn loại yêu cầu và nhập lý do!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Yêu cầu đã được gửi thành công! HR sẽ xử lý trong 1-3 ngày làm việc.');
      setIsRequestModalOpen(false);
      setSelectedType('');
      setReason('');
      setFiles([]);
      setIsSubmitting(false);
    }, 1500);
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-8">

        {/* Header + Nút gửi yêu cầu */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-3xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <a href="/employee" className="flex items-center gap-2 px-5 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all w-fit">
              <ArrowLeft size={20} />
              <span className="font-medium">Quay lại</span>
            </a>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center gap-3 px-6 py-4 bg-white text-purple-700 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus size={24} />
              Gửi yêu cầu mới
            </button>
          </div>
          <h1 className="text-4xl font-bold mt-6">Phúc lợi & Bảo hiểm</h1>
          <p className="text-purple-100 text-lg mt-2">Xem chi tiết chế độ và gửi yêu cầu thay đổi</p>
        </div>

        {/* Tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-xl"><Gift className="text-green-600" size={32} /></div>
              <div>
                <p className="text-sm text-gray-500">Phúc lợi đang hưởng</p>
                <p className="text-3xl font-bold text-gray-900">{benefits.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl"><Shield className="text-blue-600" size={32} /></div>
              <div>
                <p className="text-sm text-gray-500">Bảo hiểm tham gia</p>
                <p className="text-3xl font-bold text-gray-900">{insurance.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-xl"><FileText className="text-purple-600" size={32} /></div>
              <div>
                <p className="text-sm text-gray-500">Tài liệu liên quan</p>
                <p className="text-3xl font-bold text-gray-900">
                  {insurance.reduce((sum, ins) => sum + ins.documents.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phúc lợi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="text-purple-600" size={28} />
            <h3 className="text-2xl font-bold text-gray-900">Các khoản phúc lợi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map(benefit => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${benefit.color}`}>
                      <Icon size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{benefit.name}</h4>
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Đang áp dụng</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                      <p className="text-2xl font-bold text-purple-600">{benefit.amount}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bảo hiểm */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-blue-600" size={28} />
            <h3 className="text-2xl font-bold text-gray-900">Bảo hiểm</h3>
          </div>
          <div className="space-y-6">
            {insurance.map(ins => (
              <div key={ins.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="text-blue-600" size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{ins.name}</h4>
                      <p className="text-gray-600">{ins.provider}</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 text-sm font-bold rounded-full bg-green-100 text-green-700">Đang hoạt động</span>
                </div>

                <p className="text-gray-700 mb-6">{ins.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Số hợp đồng</p>
                    <p className="font-bold text-gray-900">{ins.policyNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Thời hạn</p>
                    <p className="font-bold">{ins.startDate} → {ins.endDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Công ty đóng</p>
                    <p className="font-bold text-green-600">{ins.employerPays}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Bạn đóng</p>
                    <p className="font-bold text-orange-600">{ins.employeePays}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Tài liệu liên quan:</p>
                    <div className="flex flex-wrap gap-2">
                      {ins.documents.map((doc, i) => (
                        <span key={i} className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 flex items-center gap-1">
                          <FileText size={14} />
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                    <Download size={18} />
                    Tải về
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL GỬI YÊU CẦU */}
        {isRequestModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <h3 className="text-3xl font-bold text-gray-900">Gửi yêu cầu mới</h3>
                <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl">
                  <X size={32} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-4">Chọn loại yêu cầu</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                            selectedType === type.value
                              ? 'border-purple-600 bg-purple-50 shadow-lg'
                              : 'border-gray-200 hover:border-purple-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={selectedType === type.value}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-6 h-6 text-purple-600"
                          />
                          <Icon size={28} className={selectedType === type.value ? 'text-purple-600' : 'text-gray-500'} />
                          <span className="font-medium text-gray-800">{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">Lý do chi tiết</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={6}
                    placeholder="Mô tả rõ lý do bạn cần thay đổi..."
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 resize-none text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    <Upload size={24} className="inline mr-2" />
                    Đính kèm tài liệu (tối đa 5 file)
                  </label>
                  <div className="border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-purple-400 transition">
                    <input type="file" multiple onChange={handleFileChange} className="hidden" id="upload" />
                    <label htmlFor="upload" className="cursor-pointer">
                      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Kéo thả file vào đây hoặc <span className="text-purple-600 font-bold">chọn từ máy</span></p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                          <div className="flex items-center gap-3">
                            <FileText size={24} className="text-blue-600" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(i)} className="text-red-600 hover:text-red-800">
                            <X size={24} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-end pt-6 border-t">
                  <button
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-bold hover:bg-gray-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={submitRequest}
                    disabled={isSubmitting || !selectedType || !reason.trim()}
                    className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {isSubmitting ? 'Đang gửi...' : (
                      <>
                        <CheckCircle size={24} />
                        Gửi yêu cầu ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeBenefitsInsurance;