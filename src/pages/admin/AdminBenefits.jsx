import React from 'react';
import Layout from '../../components/layout/Layout';
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
    name: 'Corporate Health Care',
    coverage: '100% inpatient, 80% outpatient',
    budget: 480000000,
    owner: 'HR Team',
    participants: 128,
    status: 'active',
    nextReview: '2025-01-15'
  },
  {
    id: 2,
    name: 'Meal Allowance',
    coverage: '35,000 VNĐ / working day',
    budget: 220000000,
    owner: 'Payroll',
    participants: 154,
    status: 'active',
    nextReview: '2024-12-01'
  },
  {
    id: 3,
    name: 'Transportation Support',
    coverage: '700,000 VNĐ / month',
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
    type: 'Health Insurance',
    effective: '2024-01-01',
    expiry: '2024-12-31',
    coverage: '100%',
    status: 'active'
  },
  {
    id: 'BHTN-2024-02',
    provider: 'Bảo hiểm xã hội Việt Nam',
    type: 'Unemployment Insurance',
    effective: '2024-01-01',
    expiry: '2024-12-31',
    coverage: '100%',
    status: 'active'
  },
  {
    id: 'BH_TNGT-2024-03',
    provider: 'PTI Insurance',
    type: 'Accident Insurance',
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
    department: 'Engineering',
    type: 'Add new dependent',
    submitted: '2024-10-04',
    priority: 'high'
  },
  {
    id: 'REQ-2402',
    employee: 'Nguyễn Thị Hạnh',
    department: 'Finance',
    type: 'Update insurance coverage',
    submitted: '2024-10-02',
    priority: 'medium'
  },
  {
    id: 'REQ-2403',
    employee: 'Vũ Đức Thịnh',
    department: 'Sales',
    type: 'Cancel meal allowance',
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
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm text-purple-100 uppercase tracking-wider">Admin / Total Rewards</p>
              <h1 className="text-3xl font-bold mt-2">Benefits & Insurance Control Center</h1>
              <p className="text-purple-100 mt-3 max-w-2xl">
                Manage enterprise-wide benefit programs, insurance policies and employee requests in one workspace.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" size="md">
                Export Overview
              </Button>
              <Button
                size="md"
                icon={<Plus className="w-4 h-4" />}
              >
                New Benefit
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
              <p className="text-sm text-gray-500">Active Programs</p>
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
              <p className="text-sm text-gray-500">Insurance Policies</p>
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
              <p className="text-sm text-gray-500">Participants</p>
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
              <p className="text-sm text-gray-500">Annual Budget</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(totalBudget / 1000000).toFixed(1)}M VNĐ
              </p>
            </div>
          </div>
        </div>

        <Card
          title="Benefit Programs"
          subtitle="Company wide allowances and perks"
          icon={<Heart className="w-5 h-5" />}
          actions={
            <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
              Download Catalog
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Program</th>
                  <th className="pb-3">Coverage</th>
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Participants</th>
                  <th className="pb-3">Budget</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Next Review</th>
                </tr>
              </thead>
              <tbody>
                {benefitPrograms.map(program => (
                  <tr key={program.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-4">
                      <p className="font-medium text-gray-900">{program.name}</p>
                    </td>
                    <td className="py-4 text-gray-600 text-sm">{program.coverage}</td>
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
            title="Insurance Policies"
            subtitle="Tracking coverage and lifecycle"
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
                      <p className="text-gray-500">Policy ID</p>
                      <p className="font-medium text-gray-900">{policy.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Coverage</p>
                      <p className="font-medium text-gray-900">{policy.coverage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Effective</p>
                      <p className="font-medium text-gray-900">{policy.effective}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expiry</p>
                      <p className="font-medium text-gray-900">{policy.expiry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Pending Requests"
            subtitle="Actions that need approval"
            icon={<TrendingUp className="w-5 h-5" />}
            actions={
              <Button variant="outline" size="sm">
                View workflow
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
                      {request.priority} priority
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Submitted: {request.submitted}</p>
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button variant="secondary" size="sm">
                        Review
                      </Button>
                      <Button size="sm" icon={<CheckCircle className="w-4 h-4" />}>
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminBenefits;

