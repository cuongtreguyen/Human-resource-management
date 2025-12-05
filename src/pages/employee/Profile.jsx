// import React, { useEffect, useState } from 'react';
// import {
//   User, Mail, Phone, MapPin, Briefcase,
//   Building2, CreditCard, Heart, FileText, Users
// } from 'lucide-react';

// import { getEmployeeProfile } from '../../services/api';
// import { getCurrentEmployeeId, isAuthenticated } from '../../utils/auth';

// const EmployeeProfile = () => {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         if (!isAuthenticated()) {
//           window.location.href = '/login';
//           return;
//         }

//         const employeeId = getCurrentEmployeeId();
//         if (!employeeId) {
//           console.error('Không tìm thấy employeeId trong session');
//           return;
//         }

//         const data = await getEmployeeProfile(employeeId); // data là object employee
//         setEmployee(data);
//       } catch (error) {
//         console.error('Error loading employee:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   };

//   const getStatusBadge = (status) => {
//     const config = {
//       ACTIVE:   { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Đang làm việc' },
//       INACTIVE: { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Nghỉ việc' },
//       ON_LEAVE: { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Nghỉ phép' },
//     }[status?.toUpperCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Không xác định' };

//     return (
//       <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
//         {config.label}
//       </span>
//     );
//   };

//   const InfoRow = ({ label, value, icon: Icon }) => (
//     <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
//       <span className="text-gray-500 flex items-center gap-2">
//         {Icon && <Icon className="w-4 h-4" />}
//         {label}
//       </span>
//       <span className="text-gray-900 font-medium text-right">{value || 'Chưa cập nhật'}</span>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải thông tin...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!employee) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-600">Không tìm thấy thông tin nhân viên</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 px-6 shadow-lg">
//         <div className="max-w-5xl mx-auto">
//           <div className="flex items-center justify-between mb-4"></div>
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
//             <p className="text-orange-100">Thông tin chi tiết của bạn trong hệ thống</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-6 py-8">
//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
//           <div className="flex items-center gap-6">
//             <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//               {employee.fullName?.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase() || 'NV'}
//             </div>

//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <h2 className="text-2xl font-bold text-gray-900">{employee.fullName}</h2>
//                 {getStatusBadge(employee.status)}
//               </div>
//               <p className="text-xl text-orange-600 font-semibold mb-3">{employee.position || 'Chưa cập nhật'}</p>
//               <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <Building2 className="w-4 h-4 text-orange-500" />
//                   {employee.department || 'Chưa cập nhật'}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CreditCard className="w-4 h-4 text-orange-500" />
//                   ID: {employee.employeeCode || employee.id}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Grid thông tin */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           {/* Thông tin cá nhân */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
//               <User className="w-5 h-5 text-orange-600" />
//               Thông tin cá nhân
//             </h3>
//             <div className="space-y-1">
//               <InfoRow label="Ngày sinh" value={formatDate(employee.birthDate || employee.date_of_birth)} />
//               <InfoRow label="Giới tính" value={
//                 employee.gender === 'male' ? 'Nam' :
//                 employee.gender === 'female' ? 'Nữ' : employee.gender || 'Chưa cập nhật'
//               } />
//               <InfoRow label="Tình trạng hôn nhân" value={employee.maritalStatus} />
//             </div>
//           </div>

//           {/* Thông tin liên hệ */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
//               <Mail className="w-5 h-5 text-blue-600" />
//               Thông tin liên hệ
//             </h3>
//             <div className="space-y-1">
//               <InfoRow label="Email" value={employee.email} icon={Mail} />
//               <InfoRow label="Số điện thoại" value={employee.phone} icon={Phone} />
//             </div>
//           </div>

//           {/* Giấy tờ tùy thân */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
//               <CreditCard className="w-5 h-5 text-green-600" />
//               Giấy tờ tùy thân
//             </h3>
//             <div className="space-y-1">
//               <InfoRow label="Số CCCD/CMND" value={employee.idNumber || employee.idCard} />
//               <InfoRow label="Ngày cấp" value={formatDate(employee.idIssueDate || employee.idCardIssueDate)} />
//               <InfoRow label="Nơi cấp" value={employee.idIssuePlace || employee.idCardIssuePlace} />
//               <InfoRow label="Mã số thuế" value={employee.taxCode} />
//             </div>
//           </div>

//           {/* Thông tin công việc */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
//               <Briefcase className="w-5 h-5 text-orange-600" />
//               Thông tin công việc
//             </h3>
//             <div className="space-y-1">
//               <InfoRow label="Phòng ban" value={employee.department} />
//               <InfoRow label="Chức vụ" value={employee.position} />
//               <InfoRow label="Quản lý trực tiếp" value={employee.manager || employee.directManager} />
//               <InfoRow label="Địa điểm làm việc" value={employee.workLocation} />
//               <InfoRow label="Loại nhân viên" value={employee.employeeType} />
//               <InfoRow label="Loại hợp đồng" value={employee.contractType} />
//               <InfoRow label="Ngày vào làm" value={formatDate(employee.hireDate)} />
//             </div>
//           </div>

//           {/* Địa chỉ */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
//               <MapPin className="w-5 h-5 text-red-600" />
//               Địa chỉ
//             </h3>
//             <div className="space-y-1">
//               <InfoRow label="Địa chỉ thường trú" value={employee.permanentAddress || employee.address} />
//               <InfoRow label="Địa chỉ tạm trú" value={employee.temporaryAddress} />
//             </div>
//           </div>

//           {/* Liên hệ khẩn cấp - Full width */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-2">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
//               <Heart className="w-5 h-5 text-red-600" />
//               Liên hệ khẩn cấp
//             </h3>
//             {employee.emergencyContact ? (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
//                   <p className="text-gray-900 font-medium">{employee.emergencyContact.name || 'Chưa cập nhật'}</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p className="text-sm text-gray-500 mb-1">Mối quan hệ</p>
//                   <p className="text-gray-900 font-medium">{employee.emergencyContact.relationship || 'Chưa cập nhật'}</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
//                   <p className="text-gray-900 font-medium">{employee.emergencyContact.phone || 'Chưa cập nhật'}</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                 <p>Chưa cập nhật thông tin liên hệ khẩn cấp</p>
//                 <p className="text-sm mt-1">Vui lòng liên hệ phòng Nhân sự để bổ sung</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Ghi chú */}
//         <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
//           <div className="flex items-start justify-between gap-3">
//             <div className="flex items-start gap-3">
//               <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
//               <div>
//                 <p className="font-medium text-blue-900">Cần cập nhật thông tin?</p>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Nếu có thay đổi về thông tin cá nhân, vui lòng gửi yêu cầu để phòng Nhân sự hỗ trợ cập nhật.
//                 </p>
//               </div>
//             </div>
//             <a
//               href="/employee/support"
//               className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
//             >
//               Liên hệ Admin
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeProfile;



import React, { useEffect, useState } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase,
  Building2, CreditCard, Heart, FileText, Users
} from 'lucide-react';

import { getEmployeeProfile } from '../../services/api';
import { getCurrentEmployeeId, isAuthenticated } from '../../utils/auth';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAuthenticated()) {
          window.location.href = '/login';
          return;
        }

        const employeeId = getCurrentEmployeeId();
        if (!employeeId) {
          console.error('Không tìm thấy employeeId trong session');
          return;
        }

        const response = await getEmployeeProfile(employeeId);
        // API trả về { data: { ... }, success: true }
        if (response.success && response.data) {
          setEmployee(response.data);
        }
      } catch (error) {
        console.error('Error loading employee:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const config = {
      ACTIVE:   { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Đang làm việc' },
      INACTIVE: { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Nghỉ việc' },
      ON_LEAVE: { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Nghỉ phép' },
    }[status?.toUpperCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Không xác định' };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </span>
      <span className="text-gray-900 font-medium text-right">{value || 'Chưa cập nhật'}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy thông tin nhân viên</p>
        </div>
      </div>
    );
  }

  // Tạo fullName từ firstName + lastName (ưu tiên name nếu có)
  const fullName = employee.name || `${employee.lastName || ''} ${employee.firstName || ''}`.trim() || 'Nhân viên';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
            <p className="text-orange-100">Thông tin chi tiết của bạn trong hệ thống</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {fullName.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                {getStatusBadge(employee.status)}
              </div>
              <p className="text-xl text-orange-600 font-semibold mb-3">{employee.position || 'Chưa cập nhật'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  {employee.department || 'Chưa cập nhật'}
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  ID: {employee.employeeCode || employee.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Thông tin cá nhân */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
              <User className="w-5 h-5 text-orange-600" />
              Thông tin cá nhân
            </h3>
            <div className="space-y-1">
              <InfoRow label="Ngày sinh" value={formatDate(employee.dateOfBirth)} />
              <InfoRow label="Giới tính" value={
                employee.gender === 'male' ? 'Nam' :
                employee.gender === 'female' ? 'Nữ' :
                employee.gender || 'Chưa cập nhật'
              } />
              <InfoRow label="Tình trạng hôn nhân" value={employee.maritalStatus} />
              <InfoRow label="Quốc tịch" value={employee.nationality} />
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
              <Mail className="w-5 h-5 text-blue-600" />
              Thông tin liên hệ
            </h3>
            <div className="space-y-1">
              <InfoRow label="Email công ty" value={employee.email} icon={Mail} />
              <InfoRow label="Email cá nhân" value={employee.personalEmail} icon={Mail} />
              <InfoRow label="Số điện thoại" value={employee.phone} icon={Phone} />
            </div>
          </div>

          {/* Giấy tờ tùy thân */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
              <CreditCard className="w-5 h-5 text-green-600" />
              Giấy tờ tùy thân
            </h3>
            <div className="space-y-1">
              <InfoRow label="Số CCCD/CMND" value={employee.idCard} />
              <InfoRow label="Mã số thuế" value={employee.taxCode} />
            </div>
          </div>

          {/* Thông tin công việc */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Thông tin công việc
            </h3>
            <div className="space-y-1">
              <InfoRow label="Phòng ban" value={employee.department} />
              <InfoRow label="Chức vụ" value={employee.position} />
              <InfoRow label="Quản lý trực tiếp" value={employee.manager} />
              <InfoRow label="Địa điểm làm việc" value={employee.workLocation} />
              <InfoRow label="Loại nhân viên" value={employee.employeeType} />
              <InfoRow label="Loại hợp đồng" value={employee.contractType} />
              <InfoRow label="Mã hợp đồng" value={employee.contractCode} />
              <InfoRow label="Ngày vào làm" value={formatDate(employee.hireDate)} />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
              <MapPin className="w-5 h-5 text-red-600" />
              Địa chỉ
            </h3>
            <div className="space-y-1">
              <InfoRow label="Địa chỉ thường trú" value={employee.address} />
              <InfoRow label="Địa chỉ tạm trú" value={employee.temporaryAddress} />
            </div>
          </div>

          {/* Trình độ học vấn */}
          {(employee.education || employee.educationDetails) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <FileText className="w-5 h-5 text-purple-600" />
                Trình độ học vấn
              </h3>
              <div className="space-y-1">
                <InfoRow label="Trình độ" value={employee.education} />
                <InfoRow label="Chi tiết" value={employee.educationDetails} />
              </div>
            </div>
          )}

          {/* Tài khoản ngân hàng */}
          {(employee.bankAccount || employee.bankName) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Tài khoản ngân hàng
              </h3>
              <div className="space-y-1">
                <InfoRow label="Số tài khoản" value={employee.bankAccount} />
                <InfoRow label="Ngân hàng" value={employee.bankName} />
                <InfoRow label="Chi nhánh" value={employee.bankBranch} />
              </div>
            </div>
          )}

          {/* Liên hệ khẩn cấp - Full width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
              <Heart className="w-5 h-5 text-red-600" />
              Liên hệ khẩn cấp
            </h3>
            {employee.emergencyContact ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.name || 'Chưa cập nhật'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Mối quan hệ</p>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.relationship || 'Chưa cập nhật'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa cập nhật thông tin liên hệ khẩn cấp</p>
                <p className="text-sm mt-1">Vui lòng liên hệ phòng Nhân sự để bổ sung</p>
              </div>
            )}
          </div>
        </div>

        {/* Ghi chú */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Cần cập nhật thông tin?</p>
                <p className="text-sm text-blue-700 mt-1">
                  Nếu có thay đổi về thông tin cá nhân, vui lòng gửi yêu cầu để phòng Nhân sự hỗ trợ cập nhật.
                </p>
              </div>
            </div>
            <a
              href="/employee/support"
              className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Liên hệ Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;