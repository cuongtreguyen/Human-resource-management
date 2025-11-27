import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Shield, Heart, Car, Gift, Download, FileText,
  Plus, Upload, X, CheckCircle, AlertCircle, UserPlus, MapPin,
  XCircle as XCircleIcon, DollarSign, Clock, History, Phone
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';

const EmployeeBenefitsInsurance = () => {
  const userRole = getRole();

  // Màu sắc theo role
  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'manager':
        return 'from-purple-600 to-purple-700';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-100';
      case 'manager':
        return 'text-purple-100';
      case 'accountant':
        return 'text-emerald-100';
      default:
        return 'text-orange-100';
    }
  };
  const [loading, setLoading] = useState(true);
  const [benefits, setBenefits] = useState([]);
  const [mandatoryInsurance, setMandatoryInsurance] = useState([]);
  const [voluntaryInsurance, setVoluntaryInsurance] = useState([]);
  const [availableVoluntary, setAvailableVoluntary] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [totalBenefitValue, setTotalBenefitValue] = useState(0);

  // Modal states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('benefits');

  // Danh sách loại yêu cầu
  const requestTypes = [
    { value: 'add-dependent', label: 'Thêm người phụ thuộc vào BHYT (vợ/chồng/con)', icon: UserPlus },
    { value: 'change-hospital', label: 'Đổi nơi khám chữa bệnh ban đầu', icon: MapPin },
    { value: 'update-info', label: 'Cập nhật thông tin bảo hiểm', icon: FileText },
    { value: 'cancel-benefit', label: 'Hủy phụ cấp (ăn trưa, xăng xe, v.v.)', icon: XCircleIcon },
    { value: 'reactivate-benefit', label: 'Kích hoạt lại phụ cấp đã hủy', icon: CheckCircle },
    { value: 'request-card', label: 'Yêu cầu cấp lại thẻ BHYT/BHXH', icon: Shield },
    { value: 'enroll-voluntary', label: 'Đăng ký bảo hiểm tự nguyện', icon: Heart },
    { value: 'other', label: 'Yêu cầu khác', icon: AlertCircle },
  ];

  // Icon mapping cho benefits
  const benefitIcons = {
    'wf001': { icon: Gift, color: 'bg-yellow-100 text-yellow-600' },
    'wf002': { icon: Car, color: 'bg-purple-100 text-purple-600' },
    'wf003': { icon: Heart, color: 'bg-pink-100 text-pink-600' },
    'wf004': { icon: Phone, color: 'bg-green-100 text-green-600' },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Gọi API lấy dữ liệu
      const [benefitsRes, voluntaryRes, requestsRes] = await Promise.all([
        fakeApi.getEmployeeBenefits('emp001'),
        fakeApi.getVoluntaryInsurance(),
        fakeApi.getEmployeeBenefitRequests('emp001')
      ]);

      if (benefitsRes.success) {
        setBenefits(benefitsRes.data.benefits);
        setMandatoryInsurance(benefitsRes.data.mandatoryInsurance);
        setVoluntaryInsurance(benefitsRes.data.voluntaryInsurance);
        setTotalBenefitValue(benefitsRes.data.totalBenefitValue);
      }

      if (voluntaryRes.success) {
        // Lọc ra các BH tự nguyện chưa đăng ký
        const enrolled = benefitsRes.data.voluntaryInsurance.map(v => v.id);
        setAvailableVoluntary(voluntaryRes.data.filter(v => !enrolled.includes(v.id)));
      }

      if (requestsRes.success) {
        setMyRequests(requestsRes.data);
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitRequest = async () => {
    if (!selectedType || !reason.trim()) {
      toast.error('Vui lòng chọn loại yêu cầu và nhập lý do!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await fakeApi.createBenefitRequest({
        employeeId: 'emp001',
        type: selectedType,
        typeLabel: requestTypes.find(t => t.value === selectedType)?.label,
        reason,
        attachments: files.length
      });

      if (result.success) {
        toast.success(result.message);
        setIsRequestModalOpen(false);
        setSelectedType('');
        setReason('');
        setFiles([]);
        // Reload requests
        const requestsRes = await fakeApi.getEmployeeBenefitRequests('emp001');
        if (requestsRes.success) {
          setMyRequests(requestsRes.data);
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const labels = {
      approved: 'Đã duyệt',
      pending: 'Chờ duyệt',
      rejected: 'Từ chối'
    };
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-8 rounded-3xl shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <a href="/employee" className="flex items-center gap-2 px-5 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all w-fit">
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại</span>
          </a>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-white text-gray-700 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus size={24} />
            Yêu cầu thay đổi
          </button>
        </div>
        <h1 className="text-4xl font-bold mt-6">Phúc lợi & Bảo hiểm</h1>
        <p className={`${getSubtitleColor()} text-lg mt-2`}>Xem chi tiết chế độ phúc lợi và bảo hiểm của bạn</p>
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-3xl font-bold text-gray-900">{mandatoryInsurance.length + voluntaryInsurance.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-xl"><DollarSign className="text-purple-600" size={32} /></div>
            <div>
              <p className="text-sm text-gray-500">Giá trị phúc lợi/tháng</p>
              <p className="text-2xl font-bold text-gray-900">{totalBenefitValue.toLocaleString()}đ</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 rounded-xl"><History className="text-amber-600" size={32} /></div>
            <div>
              <p className="text-sm text-gray-500">Yêu cầu đã gửi</p>
              <p className="text-3xl font-bold text-gray-900">{myRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'benefits', label: 'Phúc lợi', icon: Gift },
            { id: 'insurance', label: 'Bảo hiểm', icon: Shield },
            { id: 'requests', label: 'Yêu cầu của tôi', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-bold transition-all ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={24} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* Tab Phúc lợi */}
          {activeTab === 'benefits' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Gift className="text-purple-600" size={28} />
                <h3 className="text-2xl font-bold text-gray-900">Các khoản phúc lợi công ty cấp</h3>
              </div>
              <p className="text-gray-600 mb-6">Đây là các phúc lợi bạn được hưởng tự động khi làm việc tại công ty.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map(benefit => {
                  const iconData = benefitIcons[benefit.id] || { icon: Gift, color: 'bg-gray-100 text-gray-600' };
                  const Icon = iconData.icon;
                  return (
                    <div key={benefit.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${iconData.color}`}>
                          <Icon size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{benefit.name}</h4>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              benefit.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {benefit.status === 'active' ? 'Đang áp dụng' : 'Đã hủy'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-purple-600">{benefit.amount}</p>
                            <p className="text-sm text-gray-500">Từ: {benefit.startDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Bảo hiểm */}
          {activeTab === 'insurance' && (
            <div className="space-y-8">
              {/* Bảo hiểm bắt buộc */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-blue-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900">Bảo hiểm bắt buộc</h3>
                </div>
                <p className="text-gray-600 mb-6">Các loại bảo hiểm bắt buộc theo quy định của nhà nước.</p>

                <div className="space-y-4">
                  {mandatoryInsurance.map(ins => (
                    <div key={ins.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Shield className="text-blue-600" size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{ins.name}</h4>
                            <p className="text-gray-600">{ins.provider}</p>
                          </div>
                        </div>
                        <span className="px-4 py-2 text-sm font-bold rounded-full bg-green-100 text-green-700">Đang tham gia</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500">Số hợp đồng</p>
                          <p className="font-bold text-gray-900">{ins.policyNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500">Công ty đóng</p>
                          <p className="font-bold text-green-600">{ins.employerPays}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500">Bạn đóng</p>
                          <p className="font-bold text-orange-600">{ins.employeePays}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500">Người phụ thuộc</p>
                          <p className="font-bold text-blue-600">{ins.dependents} người</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500">Hiệu lực</p>
                          <p className="font-bold">{ins.startDate} - {ins.endDate}</p>
                        </div>
                      </div>

                      {ins.hospitalName && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Nơi khám chữa bệnh ban đầu:</strong> {ins.hospitalName}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-2">
                          {ins.documents?.map((doc, i) => (
                            <span key={i} className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1">
                              <FileText size={14} />
                              {doc}
                            </span>
                          ))}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                          <Download size={18} />
                          Tải về
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bảo hiểm tự nguyện đã đăng ký */}
              {voluntaryInsurance.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="text-pink-600" size={28} />
                    <h3 className="text-2xl font-bold text-gray-900">Bảo hiểm tự nguyện đã đăng ký</h3>
                  </div>

                  <div className="space-y-4">
                    {voluntaryInsurance.map(ins => (
                      <div key={ins.id} className="p-6 border border-pink-200 bg-pink-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
                              <Heart className="text-pink-600" size={28} />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{ins.name}</h4>
                              <p className="text-gray-600">{ins.provider}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-pink-600">{ins.monthlyPremium.toLocaleString()}đ/tháng</p>
                            <p className="text-sm text-gray-500">{ins.startDate} - {ins.endDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bảo hiểm tự nguyện có thể đăng ký */}
              {availableVoluntary.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Plus className="text-green-600" size={28} />
                    <h3 className="text-2xl font-bold text-gray-900">Bảo hiểm tự nguyện có thể đăng ký</h3>
                  </div>
                  <p className="text-gray-600 mb-6">Công ty hỗ trợ các gói bảo hiểm tự nguyện sau. Bạn có thể gửi yêu cầu đăng ký.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableVoluntary.map(ins => (
                      <div key={ins.id} className="p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Heart className="text-green-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900">{ins.name}</h4>
                            <p className="text-sm text-gray-500">{ins.provider}</p>
                            <p className="text-gray-600 text-sm mt-2">{ins.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Phí hàng tháng</p>
                                <p className="text-xl font-bold text-green-600">{ins.monthlyPremium.toLocaleString()}đ</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedType('enroll-voluntary');
                                  setReason(`Đăng ký ${ins.name} - ${ins.provider}`);
                                  setIsRequestModalOpen(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                              >
                                Đăng ký
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Yêu cầu của tôi */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <History className="text-amber-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900">Lịch sử yêu cầu</h3>
                </div>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
                >
                  <Plus size={20} />
                  Tạo yêu cầu mới
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-bold">Chưa có yêu cầu nào</p>
                  <p className="text-sm mt-2">Bạn chưa gửi yêu cầu thay đổi phúc lợi/bảo hiểm nào.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map(req => (
                    <div key={req.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-mono font-bold text-gray-700">{req.id}</span>
                          {getStatusBadge(req.status)}
                        </div>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={16} />
                          {req.submitted}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{req.typeLabel}</h4>
                      <p className="text-gray-600">{req.reason}</p>

                      {req.status === 'approved' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Đã duyệt bởi:</strong> {req.approvedBy} - {req.approvedDate}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL GỬI YÊU CẦU */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h3 className="text-3xl font-bold text-gray-900">Yêu cầu thay đổi</h3>
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
                      Gửi yêu cầu
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeBenefitsInsurance;
