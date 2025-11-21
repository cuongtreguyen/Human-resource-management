import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Shield,
  Heart,
  FileText,
  CheckCircle,
  TrendingUp,
  Plus,
  Users,
  Wallet
} from 'lucide-react';

const benefitPrograms = [
  {
    id: 1,
    name: 'Bảo hiểm sức khỏe doanh nghiệp',
    allowance: '100% nội trú, 80% ngoại trú',
    budget: 480000000,
    owner: 'HR Team',
    participants: 128,
    status: 'active',
    nextReview: '2025-01-15'
  },
  {
    id: 2,
    name: 'Phụ cấp ăn trưa',
    allowance: '35,000 VNĐ / ngày làm việc',
    budget: 220000000,
    owner: 'Payroll',
    participants: 154,
    status: 'active',
    nextReview: '2024-12-01'
  },
  {
    id: 3,
    name: 'Phụ cấp đi lại',
    allowance: '700,000 VNĐ / tháng',
    budget: 96000000,
    owner: 'Operations',
    participants: 86,
    status: 'draft',
    nextReview: '2024-11-20'
  }
];

const insurancePolicies = [
  {
    id: 'BHYT-2024-01',
    provider: 'Bảo hiểm xã hội Việt Nam',
    type: 'Bảo hiểm y tế',
    effective: '2024-01-01',
    expiry: '2024-12-31',
    coverage: '100%',
    status: 'active'
  },
  {
    id: 'BHTN-2024-02',
    provider: 'Bảo hiểm xã hội Việt Nam',
    type: 'Bảo hiểm thất nghiệp',
    effective: '2024-01-01',
    expiry: '2024-12-31',
    coverage: '100%',
    status: 'active'
  },
  {
    id: 'BH_TNGT-2024-03',
    provider: 'PTI Insurance',
    type: 'Bảo hiểm tai nạn',
    effective: '2024-02-01',
    expiry: '2025-01-31',
    coverage: '500,000,000 VNĐ',
    status: 'in-review'
  }
];

const pendingRequests = [
  {
    id: 'REQ-2401',
    employee: 'Trần Hoàng Nam',
    department: 'Kỹ thuật',
    type: 'Thêm người phụ thuộc',
    submitted: '2024-10-04',
    priority: 'high'
  },
  {
    id: 'REQ-2402',
    employee: 'Nguyễn Thị Hạnh',
    department: 'Tài chính',
    type: 'Cập nhật bảo hiểm',
    submitted: '2024-10-02',
    priority: 'medium'
  },
  {
    id: 'REQ-2403',
    employee: 'Vũ Đức Thịnh',
    department: 'Kinh doanh',
    type: 'Hủy phụ cấp ăn trưa',
    submitted: '2024-09-30',
    priority: 'low'
  }
];

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  draft: 'bg-gray-100 text-gray-600'
};

const AdminBenefits = () => {
  const totalBudget = benefitPrograms.reduce((sum, item) => sum + item.budget, 0);
  const totalParticipants = benefitPrograms.reduce((sum, item) => sum + item.participants, 0);

  return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm text-purple-100 uppercase tracking-wider">Quản trị / Phúc Lợi</p>
              <h1 className="text-3xl font-bold mt-2">Trung Tâm Quản Lý Phúc Lợi & Bảo Hiểm</h1>
              <p className="text-purple-100 mt-3 max-w-2xl">
                Quản lý các chương trình phúc lợi, chính sách bảo hiểm và yêu cầu của nhân viên trong một không gian làm việc.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" size="md">
                Xuất Tổng Quan
              </Button>
              <Button
                size="md"
                icon={<Plus className="w-4 h-4" />}
              >
                Thêm Phúc Lợi
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Heart className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chương trình hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">
                {benefitPrograms.filter(item => item.status === 'active').length}
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chính sách bảo hiểm</p>
              <p className="text-2xl font-semibold text-gray-900">
                {insurancePolicies.length}
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Người tham gia</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalParticipants}
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Wallet className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngân sách năm</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(totalBudget / 1000000).toFixed(1)}M VNĐ
              </p>
            </div>
          </div>
        </div>

        <Card
          title="Chương Trình Phúc Lợi"
          subtitle="Phụ cấp và đặc quyền toàn công ty"
          icon={<Heart className="w-5 h-5" />}
          actions={
            <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
              Tải Danh Mục
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Chương trình</th>
                  <th className="pb-3">Mức hỗ trợ</th>
                  <th className="pb-3">Phụ trách</th>
                  <th className="pb-3">Số người</th>
                  <th className="pb-3">Ngân sách</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3">Đánh giá tiếp</th>
                </tr>
              </thead>
              <tbody>
                {benefitPrograms.map(program => (
                  <tr key={program.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-4">
                      <p className="font-medium text-gray-900">{program.name}</p>
                    </td>
                    <td className="py-4 text-gray-600 text-sm">{program.allowance}</td>
                    <td className="py-4 text-gray-600 text-sm">{program.owner}</td>
                    <td className="py-4 text-gray-900">{program.participants}</td>
                    <td className="py-4 text-gray-900">{program.budget.toLocaleString()} VNĐ</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[program.status]}`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 text-sm">{program.nextReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Chính Sách Bảo Hiểm"
            subtitle="Theo dõi phạm vi bảo hiểm và vòng đời"
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="space-y-4">
              {insurancePolicies.map(policy => (
                <div key={policy.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{policy.type}</p>
                      <p className="text-sm text-gray-500">{policy.provider}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[policy.status]}`}>
                      {policy.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                    <div>
                      <p className="text-gray-500">Mã bảo hiểm</p>
                      <p className="font-medium text-gray-900">{policy.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phạm vi</p>
                      <p className="font-medium text-gray-900">{policy.coverage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Hiệu lực</p>
                      <p className="font-medium text-gray-900">{policy.effective}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Hết hạn</p>
                      <p className="font-medium text-gray-900">{policy.expiry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Yêu Cầu Chờ Duyệt"
            subtitle="Các yêu cầu cần phê duyệt"
            icon={<TrendingUp className="w-5 h-5" />}
            actions={
              <Button variant="outline" size="sm">
                Xem quy trình
              </Button>
            }
          >
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div key={request.id} className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{request.employee}</p>
                    <p className="text-sm text-gray-500">{request.department}</p>
                    <p className="text-sm text-gray-600 mt-1">{request.type}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${
                        request.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : request.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {request.priority === 'high' ? 'Ưu tiên cao' : request.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Ngày gửi: {request.submitted}</p>
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button variant="secondary" size="sm">
                        Xem xét
                      </Button>
                      <Button size="sm" icon={<CheckCircle className="w-4 h-4" />}>
                        Phê duyệt
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
  );
};

export default AdminBenefits;

