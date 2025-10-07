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
        address: emp.address || '',
        phone: emp.phone || '',
        email: emp.email || ''
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
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải...</span>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <a 
              href="/employee" 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
              <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
            <p className="text-purple-100">Xem và cập nhật thông tin của bạn</p>
          </div>
        </div>

        {employee && (
          <>
            {/* Thẻ thông tin chính */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                    {employee.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{employee.name}</h2>
                    <p className="text-purple-600 font-medium mb-2">{employee.position}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {employee.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        Từ {employee.hireDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={20} />
                  Thông tin liên hệ
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.email}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone size={16} />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.phone}</div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nhập địa chỉ của bạn"
                      />
                    ) : (
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">
                        {employee.address || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase size={20} />
                  Thông tin công việc
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                    <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.department}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chức danh</label>
                    <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.position}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày vào làm</label>
                    <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">{employee.hireDate}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <div className="px-4 py-2.5 bg-green-50 rounded-lg">
                      <span className="text-green-700 font-medium">✓ Đang làm việc</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút lưu khi đang chỉnh sửa */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  Lưu thay đổi
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;
