import React, { useEffect, useState } from 'react';
import { ArrowLeft, Shield, Heart, Car, Home, Gift, Download, FileText, Calendar } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';

const EmployeeBenefitsInsurance = () => {
  const [benefits, setBenefits] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockBenefits = [
      {
        id: 1,
        name: 'Bảo hiểm y tế',
        type: 'Health',
        coverage: '100%',
        monthlyCost: 0,
        description: 'Bảo hiểm y tế toàn diện cho nhân viên và gia đình',
        status: 'active',
        icon: Heart,
        color: 'bg-red-100 text-red-600'
      },
      {
        id: 2,
        name: 'Bảo hiểm xã hội',
        type: 'Social',
        coverage: '100%',
        monthlyCost: 0,
        description: 'Bảo hiểm xã hội theo quy định của nhà nước',
        status: 'active',
        icon: Shield,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        id: 3,
        name: 'Bảo hiểm thất nghiệp',
        type: 'Unemployment',
        coverage: '100%',
        monthlyCost: 0,
        description: 'Bảo hiểm thất nghiệp theo quy định',
        status: 'active',
        icon: Shield,
        color: 'bg-green-100 text-green-600'
      },
      {
        id: 4,
        name: 'Phụ cấp ăn trưa',
        type: 'Meal',
        coverage: '30,000 VNĐ/ngày',
        monthlyCost: 0,
        description: 'Phụ cấp ăn trưa cho nhân viên',
        status: 'active',
        icon: Gift,
        color: 'bg-yellow-100 text-yellow-600'
      },
      {
        id: 5,
        name: 'Phụ cấp xăng xe',
        type: 'Transport',
        coverage: '500,000 VNĐ/tháng',
        monthlyCost: 0,
        description: 'Phụ cấp xăng xe cho nhân viên',
        status: 'active',
        icon: Car,
        color: 'bg-purple-100 text-purple-600'
      },
      {
        id: 6,
        name: 'Thẻ gym',
        type: 'Wellness',
        coverage: '100%',
        monthlyCost: 0,
        description: 'Thẻ tập gym miễn phí tại các phòng gym đối tác',
        status: 'active',
        icon: Heart,
        color: 'bg-pink-100 text-pink-600'
      }
    ];

    const mockInsurance = [
      {
        id: 1,
        policyNumber: 'BHXH-2024-001',
        type: 'Bảo hiểm xã hội',
        provider: 'Bảo hiểm xã hội Việt Nam',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        premium: 0,
        coverage: '100%',
        status: 'active',
        documents: ['Giấy chứng nhận BHXH', 'Thẻ BHYT']
      },
      {
        id: 2,
        policyNumber: 'BHYT-2024-001',
        type: 'Bảo hiểm y tế',
        provider: 'Bảo hiểm y tế Việt Nam',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        premium: 0,
        coverage: '100%',
        status: 'active',
        documents: ['Thẻ BHYT', 'Sổ khám bệnh']
      },
      {
        id: 3,
        policyNumber: 'BHTN-2024-001',
        type: 'Bảo hiểm thất nghiệp',
        provider: 'Bảo hiểm xã hội Việt Nam',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        premium: 0,
        coverage: '100%',
        status: 'active',
        documents: ['Giấy chứng nhận BHTN']
      }
    ];

    setBenefits(mockBenefits);
    setInsurance(mockInsurance);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Đang hoạt động' : 'Không hoạt động';
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
          <div className="flex items-center gap-4 mb-4">
            <a 
              href="/employee" 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Phúc lợi & Bảo hiểm</h1>
            <p className="text-purple-100">Thông tin về các chế độ phúc lợi và bảo hiểm của bạn</p>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Gift className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phúc lợi đang hưởng</p>
                <p className="text-2xl font-bold text-gray-900">{benefits.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bảo hiểm</p>
                <p className="text-2xl font-bold text-gray-900">{insurance.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tài liệu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {insurance.reduce((sum, ins) => sum + ins.documents.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phúc lợi */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phúc lợi của tôi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map(benefit => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${benefit.color}`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{benefit.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(benefit.status)}`}>
                        {getStatusText(benefit.status)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Mức độ bao phủ:</span>
                      <span className="font-medium text-gray-900">{benefit.coverage}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Chi phí hàng tháng:</span>
                      <span className="font-medium text-gray-900">
                        {benefit.monthlyCost === 0 ? 'Miễn phí' : `${benefit.monthlyCost.toLocaleString()} VNĐ`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bảo hiểm */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bảo hiểm</h3>
          <div className="space-y-4">
            {insurance.map(ins => (
              <div key={ins.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{ins.type}</h4>
                      <p className="text-sm text-gray-500">{ins.provider}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ins.status)}`}>
                    {getStatusText(ins.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Số hợp đồng</p>
                    <p className="font-medium text-gray-900">{ins.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                    <p className="font-medium text-gray-900">{ins.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày kết thúc</p>
                    <p className="font-medium text-gray-900">{ins.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mức độ bao phủ</p>
                    <p className="font-medium text-gray-900">{ins.coverage}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tài liệu liên quan:</p>
                    <div className="flex flex-wrap gap-2">
                      {ins.documents.map((doc, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <Download size={16} />
                    Tải về
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quy định phúc lợi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quy định phúc lợi</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Bảo hiểm y tế</h4>
                <p className="text-sm text-blue-700">
                  Công ty chi trả 100% phí bảo hiểm y tế cho nhân viên và 50% cho người thân.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Phụ cấp ăn trưa</h4>
                <p className="text-sm text-green-700">
                  Phụ cấp 30,000 VNĐ/ngày làm việc, thanh toán cùng lương hàng tháng.
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">Thẻ gym</h4>
                <p className="text-sm text-purple-700">
                  Miễn phí thẻ tập gym tại các phòng gym đối tác trong thành phố.
                </p>
              </div>
            </div>
          </div>

          {/* Liên hệ hỗ trợ */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hỗ trợ & Liên hệ</h3>
            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Phòng Nhân sự</h4>
                <p className="text-sm text-gray-600">Email: hr@company.com</p>
                <p className="text-sm text-gray-600">Điện thoại: 024-1234-5678</p>
                <p className="text-sm text-gray-600">Giờ làm việc: 8:00 - 17:30</p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Bảo hiểm xã hội</h4>
                <p className="text-sm text-gray-600">Hotline: 1900-1234</p>
                <p className="text-sm text-gray-600">Website: www.baohiemxahoi.gov.vn</p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Bảo hiểm y tế</h4>
                <p className="text-sm text-gray-600">Hotline: 1900-5678</p>
                <p className="text-sm text-gray-600">Website: www.baohiemyte.gov.vn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeBenefitsInsurance;
