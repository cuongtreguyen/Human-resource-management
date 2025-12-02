import React, { useState, useEffect } from 'react';
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
  Eye,
  Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';

const AdminBenefits = () => {
  const userRole = getRole();
  const canApprove = userRole === 'accountant'; // Chỉ accountant được duyệt

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

  // States
  const [loading, setLoading] = useState(true);
  const [welfarePrograms, setWelfarePrograms] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [employeeInsurance, setEmployeeInsurance] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [welfareRes, insuranceRes, requestsRes] = await Promise.all([
        fakeApi.getWelfarePrograms(),
        fakeApi.getInsurancePolicies(),
        fakeApi.getBenefitRequests()
      ]);

      if (welfareRes.success) setWelfarePrograms(welfareRes.data);
      if (insuranceRes.success) setInsurancePolicies(insuranceRes.data);
      if (requestsRes.success) setRequests(requestsRes.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = welfarePrograms.reduce((sum, p) => sum + p.budget, 0);
  const totalParticipants = welfarePrograms.reduce((sum, p) => sum + p.participants, 0);

  const openDetail = async (req) => {
    setSelectedRequest(req);
    // Load employee insurance detail
    const insRes = await fakeApi.getEmployeeInsuranceDetail(req.employeeId);
    if (insRes.success) {
      setEmployeeInsurance(insRes.data);
    }
    setIsModalOpen(true);
  };

  const approveRequest = async (id) => {
    if (!canApprove) {
      toast.error('Bạn không có quyền phê duyệt yêu cầu này!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn PHÊ DUYỆT yêu cầu này?')) {
      const result = await fakeApi.approveBenefitRequest(id, 'Kế Toán Viên');
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.success(result.message);
        setIsModalOpen(false);
      }
    }
  };

  const rejectRequest = async (id) => {
    if (!canApprove) {
      toast.error('Bạn không có quyền từ chối yêu cầu này!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn TỪ CHỐI yêu cầu này?')) {
      const result = await fakeApi.rejectBenefitRequest(id, 'Kế Toán Viên', 'Không đủ điều kiện');
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.error(result.message);
        setIsModalOpen(false);
      }
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-600'
    };
    const labels = {
      high: 'Ưu tiên cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[priority]}`}>
        {labels[priority]}
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
    <>
      <div className="space-y-6 p-6 min-h-screen bg-gray-50">

        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-8 rounded-2xl shadow-xl`}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className={`${getSubtitleColor()} text-sm uppercase tracking-wider`}>Quản trị / HR</p>
                {!canApprove && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs">
                    <Eye size={14} />
                    Chế độ xem
                  </span>
                )}
                {canApprove && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded-full text-xs">
                    <CheckCircle size={14} />
                    Quyền duyệt
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mt-1">Quản Lý Phúc Lợi & Bảo Hiểm</h1>
              <p className={`${getSubtitleColor()} mt-3 max-w-3xl text-lg`}>
                {canApprove
                  ? 'Quản lý chế độ phúc lợi, chính sách bảo hiểm và xử lý yêu cầu nhân viên.'
                  : 'Xem thông tin phúc lợi và bảo hiểm. Liên hệ Kế toán để phê duyệt yêu cầu.'}
              </p>
            </div>
            {canApprove && (
              <div className="flex gap-3 flex-wrap">
                <Button variant="secondary" size="md">Xuất báo cáo</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />}>Thêm phúc lợi mới</Button>
              </div>
            )}
          </div>
        </div>

        {/* Thông báo quyền hạn cho Admin */}
        {!canApprove && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Lock className="text-amber-600" size={24} />
            <div>
              <p className="font-bold text-amber-800">Chế độ chỉ xem</p>
              <p className="text-sm text-amber-700">Bạn đang đăng nhập với role Admin. Chỉ Kế toán (Accountant) mới có quyền phê duyệt các yêu cầu phúc lợi & bảo hiểm.</p>
            </div>
          </div>
        )}

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
                <p className="text-3xl font-bold text-gray-900">{(totalBudget / 1_000_000).toFixed(0)} triệu</p>
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
                    <span className={`px-4 py-2 text-xs rounded-full font-bold ${policy.type === 'mandatory' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                      {policy.type === 'mandatory' ? 'Bắt buộc' : 'Tự nguyện'}
                    </span>
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
        </div>
      </div>

      {/* MODAL CHI TIẾT YÊU CẦU */}
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
                  <p className="text-2xl font-bold text-amber-800">{selectedRequest.typeLabel}</p>
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
                  {employeeInsurance.map((ins, idx) => (
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
                        {ins.hospitalName && (
                          <div className="flex justify-between"><span className="text-gray-600">Nơi KCB</span><span className="font-bold text-blue-600">{ins.hospitalName}</span></div>
                        )}
                      </div>

                      {ins.type === 'BHYT' && selectedRequest.type === 'add-dependent' && ins.dependents >= 4 && (
                        <div className="mt-6 p-6 bg-red-100 border-4 border-red-500 rounded-xl">
                          <p className="text-red-800 font-bold text-lg flex items-center gap-3">
                            <AlertCircle className="w-8 h-8" />
                            Không thể thêm người phụ thuộc! (Đã đạt tối đa 4 người)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-6 justify-end pt-8 border-t-4 border-gray-300">
                <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(false)} className="px-10">
                  Đóng
                </Button>

                {canApprove ? (
                  <>
                    <Button variant="danger" size="lg" icon={<XCircle className="w-6 h-6" />} onClick={() => rejectRequest(selectedRequest.id)} className="px-10">
                      Từ chối yêu cầu
                    </Button>
                    <Button size="lg" icon={<CheckCircle className="w-6 h-6" />} onClick={() => approveRequest(selectedRequest.id)} className="px-12 bg-green-600 hover:bg-green-700">
                      Phê duyệt ngay
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 px-6 py-4 bg-gray-100 rounded-xl text-gray-600">
                    <Lock size={20} />
                    <span>Chỉ Kế toán mới được phê duyệt</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBenefits;
