import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import fakeApi from '../services/fakeApi';
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
  Award
} from 'lucide-react';

const PayrollPolicies = () => {
  const [, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getPolicies();
      setPolicies(response.data);
    } catch (err) {
      setError('Failed to load policies');
      console.error('Policies error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fakeApi.generateReport('payroll_summary');
      alert(`PDF generated successfully! Download link: ${response.data.url}`);
    } catch (err) {
      alert('Failed to generate PDF');
      console.error('PDF generation error:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading policies...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Policies</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadPolicies}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Financial Policies</h1>
                <p className="text-purple-100 mt-1">Company payroll policies and regulations</p>
              </div>
              <Button 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-purple-50"
                onClick={handleDownloadPDF}
                icon={<FileText className="h-4 w-4 mr-2" />}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card title="Standard Working Days" icon={<Calendar className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">22</div>
                <div className="text-sm text-gray-600">Days per month</div>
              </div>
            </Card>

            <Card title="Basic Tax Rate" icon={<Calculator className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">5%</div>
                <div className="text-sm text-gray-600">Above 11M VND</div>
              </div>
            </Card>

            <Card title="Overtime Rate" icon={<DollarSign className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">150%</div>
                <div className="text-sm text-gray-600">Of hourly rate</div>
              </div>
            </Card>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {/* Salary Policy */}
            <Card title="💼 Salary Policy" icon={<DollarSign className="h-5 w-5 text-blue-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Salary Components
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 ml-6">
                      <li>• Basic salary as primary component</li>
                      <li>• Allowances (transport, meals, communication)</li>
                      <li>• Bonuses (performance, attendance, productivity)</li>
                      <li>• Overtime compensation at 150% rate</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      Deductions
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 ml-6">
                      <li>• Personal Income Tax (5% above 11M VND)</li>
                      <li>• Social Insurance (10.5% of basic salary)</li>
                      <li>• Late penalty (50% per late day)</li>
                      <li>• Absence penalty (full daily salary)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-800 mb-2">📋 Salary Calculation Formula</h5>
                  <div className="text-sm text-yellow-700">
                    <p><strong>Daily Salary:</strong> Basic Salary ÷ 22 days</p>
                    <p><strong>Gross Salary:</strong> Daily Salary × Actual Working Days</p>
                    <p><strong>Actual Working Days:</strong> Working Days - (Late Days × 0.5)</p>
                    <p><strong>Overtime Pay:</strong> Overtime Hours × Hourly Rate × 1.5</p>
                    <p><strong>Net Salary:</strong> Total Earnings - Deductions</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tax Regulations */}
            <Card title="💸 Tax Regulations" icon={<TrendingUp className="h-5 w-5 text-orange-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Personal Income Tax</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>No Tax:</span>
                          <span>0 - 11,000,000 VND</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax Rate:</span>
                          <span className="font-medium text-orange-600">5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Applies to:</span>
                          <span>Above 11M VND</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Tax Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Monthly calculation and deduction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span>Annual reconciliation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span>Private enterprise compliance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Insurance Policies */}
            <Card title="🛡️ Insurance Policies" icon={<Building className="h-5 w-5 text-green-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Social Insurance</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-green-600">10.5%</div>
                      <div>of basic salary</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Health Insurance</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-blue-600">Included</div>
                      <div>in social insurance</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Unemployment</h4>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-purple-600">Included</div>
                      <div>in social insurance</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">📋 Insurance Coverage</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <p><strong>Healthcare:</strong> Hospital treatment, medications</p>
                      <p><strong>Accident:</strong> Work-related injuries coverage</p>
                    </div>
                    <div>
                      <p><strong>Maternity:</strong> Maternity leave benefits</p>
                      <p><strong>Retirement:</strong> Pension upon retirement</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Benefits and Allowances */}
            <Card title="🎁 Benefits & Allowances" icon={<Award className="h-5 w-5 text-purple-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Transportation Allowance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Development Staff:</span>
                        <span className="font-medium">500,000 VND/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Marketing Staff:</span>
                        <span className="font-medium">400,000 VND/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>HR Staff:</span>
                        <span className="font-medium">350,000 VND/month</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Meal Allowance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Breakfast:</span>
                        <span className="font-medium">50,000 VND/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lunch:</span>
                        <span className="font-medium">70,000 VND/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dinner:</span>
                        <span className="font-medium">60,000 VND/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 mb-2">🏆 Performance Bonus Structure</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                    <div>
                      <p><strong>Perfect Attendance:</strong> 500,000 VND/month</p>
                      <p><strong>Project Completion:</strong> 10% of project value</p>
                    </div>
                    <div>
                      <p><strong>Client Satisfaction:</strong> 1,000,000 VND</p>
                      <p><strong>Innovation Award:</strong> 2,000,000 VND</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Leave Policies */}
            <Card title="🏖️ Leave Policies" icon={<Calendar className="h-5 w-5 text-teal-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Paid Leave</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Annual Leave:</span>
                        <span className="font-medium">12 days/year</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sick Leave:</span>
                        <span className="font-medium">10 days/year</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Personal Leave:</span>
                        <span className="font-medium">5 days/year</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Special Leave</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Wedding:</span>
                        <span className="font-medium">3 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Family Death:</span>
                        <span className="font-medium">3 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Maternity:</span>
                        <span className="font-medium">180 days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="font-medium text-orange-800 mb-2">⚠️ Leave Regulations</h5>
                  <div className="text-sm text-orange-700 space-y-1">
                    <p>• Leave must be requested 2 days in advance</p>
                    <p>• Sick leave requires medical certificate</p>
                    <p>• Unused annual leave can be carried forward</p>
                    <p>• Emergency leave can be retroactively approved</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Compensation Policy */}
            <Card title="💰 Compensation Policy" icon={<DollarSign className="h-5 w-5 text-yellow-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Salary Grade Structure</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Junior Developer:</span>
                        <span className="font-medium">8-12M VND/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Senior Developer:</span>
                        <span className="font-medium">15-25M VND/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Team Lead:</span>
                        <span className="font-medium">25-35M VND/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Project Manager:</span>
                        <span className="font-medium">30-45M VND/month</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Overtime Compensation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Regular Hours:</span>
                        <span className="font-medium">Standard Rate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Weekend:</span>
                        <span className="font-medium text-green-600">150% of hourly rate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Holidays:</span>
                        <span className="font-medium text-blue-600">200% of hourly rate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Night Shift:</span>
                        <span className="font-medium text-purple-600">130% of hourly rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 mb-2">⚠️ Termination Compensation</h5>
                  <div className="text-sm text-red-700 space-y-1">
                    <p>• Severance pay: 0.5 month salary per year of service</p>
                    <p>• Notice period: Minimum 30 days notice</p>
                    <p>• Confidentiality agreement: 12 months non-compete</p>
                    <p>• Final settlement: All outstanding payments within 7 days</p>
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
