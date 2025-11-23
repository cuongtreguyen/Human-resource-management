// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save } from 'lucide-react';
// import EmployeeLayout from '../../components/layout/EmployeeLayout';
// import fakeApi from '../../services/fakeApi';

// const EmployeeProfile = () => {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const load = async () => {
//       const res = await fakeApi.getEmployees();
//       const emp = res.data[0];
//       setEmployee(emp);
//       setFormData({
//         address: emp.address || '',
//         phone: emp.phone || '',
//         email: emp.email || ''
//       });
//       setLoading(false);
//     };
//     load();
//   }, []);

//   const handleSave = () => {
//     alert('Đã lưu thay đổi (demo)');
//     setEmployee({ ...employee, ...formData });
//     setIsEditing(false);
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
//           <div className="flex items-center justify-between mb-4">
//             <a 
//               href="/employee" 
//               className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
//             >
//               <ArrowLeft size={18} />
//               <span>Quay lại</span>
//             </a>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
//             >
//               {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
//               <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
//             </button>
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
//             <p className="text-purple-100">Xem và cập nhật thông tin của bạn</p>
//           </div>
//         </div>

//         {employee && (
//           <>
//             {/* Thẻ thông tin chính */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//               <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
//                 <div className="flex items-center gap-6">
//                   <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
//                     {employee.name.split(' ').map(n=>n[0]).join('')}
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-1">{employee.name}</h2>
//                     <p className="text-purple-600 font-medium mb-2">{employee.position}</p>
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <span className="flex items-center gap-1">
//                         <Briefcase size={16} />
//                         {employee.department}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Calendar size={16} />
//                         Từ {employee.hireDate}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Thông tin liên hệ */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="p-4 bg-gray-50 border-b border-gray-200">
//                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                   <User size={20} />
//                   Thông tin liên hệ
//                 </h3>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <Mail size={16} />
//                       Email
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({...formData, email: e.target.value})}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.email}</div>
//                     )}
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <Phone size={16} />
//                       Số điện thoại
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.phone}</div>
//                     )}
//                   </div>
                  
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <MapPin size={16} />
//                       Địa chỉ
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={formData.address}
//                         onChange={(e) => setFormData({...formData, address: e.target.value})}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                         placeholder="Nhập địa chỉ của bạn"
//                       />
//                     ) : (
//                       <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">
//                         {employee.address || 'Chưa cập nhật'}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Thông tin công việc */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="p-4 bg-gray-50 border-b border-gray-200">
//                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                   <Briefcase size={20} />
//                   Thông tin công việc
//                 </h3>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
//                     <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.department}</div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Chức danh</label>
//                     <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.position}</div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Ngày vào làm</label>
//                     <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.hireDate}</div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
//                     <div className="px-4 py-2.5 bg-green-50 rounded-lg">
//                       <span className="text-green-700 font-medium">✓ Đang làm việc</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Nút lưu khi đang chỉnh sửa */}
//             {isEditing && (
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
//                 >
//                   <Save size={18} />
//                   Lưu thay đổi
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </EmployeeLayout>
//   );
// };

// export default EmployeeProfile;



import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const load = async () => {
      const res = await fakeApi.getEmployees();
      const emp = res.data[0];
      setEmployee(emp);
      setFormData({
        firstName: emp.firstName || 'Nguyễn',
        lastName: emp.lastName || 'Văn An',
        birthDate: emp.birthDate || '10-10-1990',
        gender: emp.gender || 'Nam',
        idNumber: emp.idNumber || '',
        taxCode: emp.taxCode || '',
        email: emp.email || '',
        phone: emp.phone || '',
        permanentAddress: emp.permanentAddress || '',
        temporaryAddress: emp.temporaryAddress || ''
      });
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = () => {
    alert('Đã lưu thay đổi (demo)');
    setEmployee({ ...employee, ...formData });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
              <p className="text-purple-100">Xem và cập nhật thông tin của bạn</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {employee && (
            <>
              {/* Thẻ thông tin chính */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6 transform hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {employee.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{employee.name}</h2>
                    <p className="text-xl text-purple-600 font-semibold mb-4">{employee.position}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        {employee.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Từ {employee.hireDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">
                  Thông tin chi tiết
                </h2>
                
                {/* Thông tin cá nhân cơ bản */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                    Thông tin cá nhân cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ <span className="text-red-500">*</span>
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800">
                        {formData.firstName}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800">
                        {formData.lastName}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800">
                        {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('vi-VN') : ''}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800">
                        {formData.gender}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số CMND/CCCD
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800">
                        {formData.idNumber || 'Chưa cập nhật'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã số thuế
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800">
                        {formData.taxCode || 'Chưa cập nhật'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Mã số thuế cá nhân (MST) - dùng để khấu trừ thuế thu nhập cá nhân
                      </p>
                    </div>
                  </div>
                </div>

                {/* Liên hệ & Địa chỉ */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                    Liên hệ & Địa chỉ
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email cá nhân <span className="text-red-500">*</span>
                        </label>
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {formData.email}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {formData.phone}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ thường trú
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {formData.permanentAddress || 'Chưa cập nhật'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ tạm trú
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {formData.temporaryAddress || 'Chưa cập nhật'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin công việc */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Thông tin công việc
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Phòng ban</p>
                    <p className="text-lg font-semibold text-gray-800">{employee.department}</p>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                    <p className="text-sm text-gray-600 mb-1">Chức danh</p>
                    <p className="text-lg font-semibold text-gray-800">{employee.position}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Ngày vào làm</p>
                    <p className="text-lg font-semibold text-gray-800">{employee.hireDate}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                    <p className="text-lg font-semibold text-green-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Đang làm việc
                    </p>
                  </div>
                </div>
              </div>

              {/* Nút lưu khi đang chỉnh sửa */}
              {isEditing && (
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;