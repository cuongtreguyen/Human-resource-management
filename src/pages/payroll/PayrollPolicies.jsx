import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getRole } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getPolicies } from '../../services/payrollService';
import {
  FileText,
  DollarSign,
  Users,
  Building,
  Calculator,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
  Shield,
  Percent,
  Gift,
  RefreshCw
} from 'lucide-react';

const PayrollPolicies = () => {
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

  const getAccentColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-600';
      case 'manager':
        return 'text-purple-600';
      case 'accountant':
        return 'text-emerald-600';
      default:
        return 'text-orange-600';
    }
  };

  // State cho policies từ API
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load policies từ API
  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPolicies();
      // API trả về { success: true, data: [...] }
      setPolicies(response.data || response || []);
    } catch (err) {
      console.error('Error loading policies:', err);
      setError('Không thể tải danh sách chính sách');
      toast.error('Không thể tải danh sách chính sách');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF export when backend API is available
    toast.info('Tính năng xuất PDF đang được phát triển');
  };

  // Helper function để lấy icon theo loại policy
  const getPolicyIcon = (type) => {
    switch (type) {
      case 'INSURANCE':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'TAX':
        return <Percent className="h-5 w-5 text-orange-500" />;
      case 'ALLOWANCE':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'SALARY':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function để lấy màu badge theo status
  const getStatusBadge = (status) => {
    if (status === 'ACTIVE') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Đang áp dụng</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Không hoạt động</span>;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} p-6`}>
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Chính sách tài chính</h1>
                <p className={`${getSubtitleColor()} mt-1`}>Chính sách và quy định lương của công ty</p>
              </div>
              <Button
                variant="secondary"
                className={`bg-white ${getAccentColor()} hover:bg-gray-50`}
                onClick={handleDownloadPDF}
                icon={<FileText className="h-4 w-4 mr-2" />}
              >
                Tải PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card title="Ngày làm việc tiêu chuẩn" icon={<Calendar className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">22</div>
                <div className="text-sm text-gray-600">Ngày/tháng</div>
              </div>
            </Card>

            <Card title="Thuế suất cơ bản" icon={<Calculator className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">5%</div>
                <div className="text-sm text-gray-600">Trên 11 triệu VND</div>
              </div>
            </Card>

            <Card title="Tỷ lệ làm thêm giờ" icon={<DollarSign className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">150%</div>
                <div className="text-sm text-gray-600">Theo giờ</div>
              </div>
            </Card>
          </div>

          {/* Dynamic Policies from API */}
          <Card
            title="📋 Danh sách chính sách"
            className="mb-8"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={loadPolicies}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Đang tải...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600">{error}</p>
                <Button variant="secondary" size="sm" onClick={loadPolicies} className="mt-3">
                  Thử lại
                </Button>
              </div>
            ) : policies.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có chính sách nào được thiết lập</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getPolicyIcon(policy.type)}
                        <span className="text-xs font-medium text-gray-500 uppercase">{policy.type}</span>
                      </div>
                      {getStatusBadge(policy.status)}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{policy.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Hiệu lực từ: {policy.effectiveDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Policy Sections */}
          <div className="space-y-6">
            {/* Salary Policy */}
            <Card title="💼 Chính sách lương" icon={<DollarSign className="h-5 w-5 text-blue-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Thành phần lương
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 ml-6">
                      <li>• Lương cơ bản là thành phần chính</li>
                      <li>• Phụ cấp (đi lại, ăn uống, liên lạc)</li>
                      <li>• Thưởng (hiệu suất, chuyên cần, năng suất)</li>
                      <li>• Làm thêm giờ với tỷ lệ 150%</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      Các khoản khấu trừ
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 ml-6">
                      <li>• Thuế TNCN (5% trên 11 triệu VND)</li>
                      <li>• Bảo hiểm xã hội (10.5% lương cơ bản)</li>
                      <li>• Phạt đi trễ (50% mỗi ngày trễ)</li>
                      <li>• Phạt vắng mặt (trừ nguyên ngày lương)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-800 mb-2">📋 Công thức tính lương</h5>
                  <div className="text-sm text-yellow-700">
                    <p><strong>Lương ngày:</strong> Lương cơ bản ÷ 22 ngày</p>
                    <p><strong>Lương gộp:</strong> Lương ngày × Ngày làm việc thực tế</p>
                    <p><strong>Ngày làm việc thực tế:</strong> Ngày công - (Ngày trễ × 0.5)</p>
                    <p><strong>Lương làm thêm:</strong> Giờ làm thêm × Lương giờ × 1.5</p>
                    <p><strong>Lương thực nhận:</strong> Tổng thu nhập - Các khoản khấu trừ</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tax Regulations */}
            <Card title="💸 Quy định thuế" icon={<TrendingUp className="h-5 w-5 text-orange-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Thuế thu nhập cá nhân</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Không thuế:</span>
                          <span>0 - 11,000,000 VND</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thuế suất:</span>
                          <span className="font-medium text-orange-600">5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Áp dụng cho:</span>
                          <span>Trên 11 triệu VND</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Lịch nộp thuế</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Tính và khấu trừ hàng tháng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span>Quyết toán hàng năm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span>Tuân thủ doanh nghiệp tư nhân</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Insurance Policies */}
            <Card title="🛡️ Chính sách bảo hiểm" icon={<Building className="h-5 w-5 text-green-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bảo hiểm xã hội</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-green-600">10.5%</div>
                      <div>lương cơ bản</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bảo hiểm y tế</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-blue-600">Bao gồm</div>
                      <div>trong BHXH</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bảo hiểm thất nghiệp</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-purple-600">Bao gồm</div>
                      <div>trong BHXH</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">📋 Phạm vi bảo hiểm</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <p><strong>Y tế:</strong> Điều trị bệnh viện, thuốc men</p>
                      <p><strong>Tai nạn:</strong> Bảo hiểm tai nạn lao động</p>
                    </div>
                    <div>
                      <p><strong>Thai sản:</strong> Chế độ nghỉ thai sản</p>
                      <p><strong>Hưu trí:</strong> Lương hưu khi nghỉ hưu</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Benefits and Allowances */}
            <Card title="🎁 Phúc lợi & Phụ cấp" icon={<Award className="h-5 w-5 text-purple-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Phụ cấp đi lại</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Nhân viên phát triển:</span>
                        <span className="font-medium">500,000 VND/tháng</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nhân viên marketing:</span>
                        <span className="font-medium">400,000 VND/tháng</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nhân viên nhân sự:</span>
                        <span className="font-medium">350,000 VND/tháng</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Phụ cấp ăn uống</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bữa sáng:</span>
                        <span className="font-medium">50,000 VND/ngày</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bữa trưa:</span>
                        <span className="font-medium">70,000 VND/ngày</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bữa tối:</span>
                        <span className="font-medium">60,000 VND/ngày</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 mb-2">🏆 Cơ cấu thưởng hiệu suất</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                    <div>
                      <p><strong>Chuyên cần:</strong> 500,000 VND/tháng</p>
                      <p><strong>Hoàn thành dự án:</strong> 10% giá trị dự án</p>
                    </div>
                    <div>
                      <p><strong>Khách hàng hài lòng:</strong> 1,000,000 VND</p>
                      <p><strong>Giải thưởng sáng tạo:</strong> 2,000,000 VND</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Leave Policies */}
            <Card title="🏖️ Chính sách nghỉ phép" icon={<Calendar className="h-5 w-5 text-teal-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Nghỉ có lương</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Phép năm:</span>
                        <span className="font-medium">12 ngày/năm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nghỉ ốm:</span>
                        <span className="font-medium">10 ngày/năm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nghỉ việc riêng:</span>
                        <span className="font-medium">5 ngày/năm</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Nghỉ đặc biệt</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kết hôn:</span>
                        <span className="font-medium">3 ngày</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tang gia:</span>
                        <span className="font-medium">3 ngày</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Thai sản:</span>
                        <span className="font-medium">180 ngày</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="font-medium text-orange-800 mb-2">⚠️ Quy định nghỉ phép</h5>
                  <div className="text-sm text-orange-700 space-y-1">
                    <p>• Phải xin phép trước 2 ngày</p>
                    <p>• Nghỉ ốm cần giấy xác nhận y tế</p>
                    <p>• Phép năm chưa dùng có thể chuyển sang năm sau</p>
                    <p>• Nghỉ khẩn cấp có thể được duyệt sau</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Compensation Policy */}
            <Card title="💰 Chính sách đãi ngộ" icon={<DollarSign className="h-5 w-5 text-yellow-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Cơ cấu bậc lương</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lập trình viên mới:</span>
                        <span className="font-medium">8-12 triệu/tháng</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lập trình viên cao cấp:</span>
                        <span className="font-medium">15-25 triệu/tháng</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Trưởng nhóm:</span>
                        <span className="font-medium">25-35 triệu/tháng</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quản lý dự án:</span>
                        <span className="font-medium">30-45 triệu/tháng</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Lương làm thêm giờ</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Giờ bình thường:</span>
                        <span className="font-medium">Mức chuẩn</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cuối tuần:</span>
                        <span className="font-medium text-green-600">150% lương giờ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ngày lễ:</span>
                        <span className="font-medium text-blue-600">200% lương giờ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ca đêm:</span>
                        <span className="font-medium text-purple-600">130% lương giờ</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 mb-2">⚠️ Đền bù khi nghỉ việc</h5>
                  <div className="text-sm text-red-700 space-y-1">
                    <p>• Trợ cấp thôi việc: 0.5 tháng lương/năm làm việc</p>
                    <p>• Thời gian báo trước: Tối thiểu 30 ngày</p>
                    <p>• Thỏa thuận bảo mật: 12 tháng không cạnh tranh</p>
                    <p>• Thanh toán cuối cùng: Trong vòng 7 ngày</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PayrollPolicies;
