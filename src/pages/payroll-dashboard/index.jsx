import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, Download, Calculator, FileText, CreditCard, PieChart, TrendingUp, AlertCircle } from 'lucide-react';
import PayrollHeader from './components/PayrollHeader';
import SalaryBreakdown from './components/SalaryBreakdown';
import PayslipHistory from './components/PayslipHistory';
import TaxCalculator from './components/TaxCalculator';
import BenefitsOverview from './components/BenefitsOverview';
import PayrollAnalytics from './components/PayrollAnalytics';
import BankIntegration from './components/BankIntegration';
import PayrollApproval from './components/PayrollApproval';

const PayrollDashboard = () => {
  // Current user and role data - fake API response
  const [currentUser] = useState({
    id: 'EMP001',
    name: "Sarah Johnson",
    email: "sarah.johnson@employeehub.com",
    role: "Senior Product Manager",
    department: "Product Development",
    employeeId: "EMP001",
    joinDate: "2022-03-15",
    payrollRole: "employee", // employee, hr_admin, payroll_officer, manager
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  });

  // Current salary information - fake API data
  const [currentSalary] = useState({
    baseSalary: 85000,
    currency: "USD",
    payFrequency: "Monthly",
    lastUpdated: "2024-01-01",
    effectiveDate: "2024-01-01",
    nextPayDate: "2025-02-01",
    ytdEarnings: 7083.33,
    grossPay: 7083.33,
    netPay: 5245.28,
    totalDeductions: 1838.05
  });

  // Detailed salary breakdown - fake API response
  const [salaryBreakdown] = useState({
    earnings: {
      baseSalary: 7083.33,
      overtime: 450.00,
      bonus: 1000.00,
      commission: 0.00,
      allowances: {
        transport: 200.00,
        meals: 150.00,
        phone: 50.00,
        internet: 75.00
      },
      totalEarnings: 9008.33
    },
    deductions: {
      taxes: {
        federal: 1265.50,
        state: 423.50,
        local: 180.25,
        totalTax: 1869.25
      },
      insurance: {
        health: 245.00,
        dental: 45.00,
        vision: 25.00,
        life: 15.00,
        disability: 35.00,
        totalInsurance: 365.00
      },
      retirement: {
        contribution401k: 708.33,
        employerMatch: 354.17,
        totalRetirement: 708.33
      },
      other: {
        unionDues: 0.00,
        garnishment: 0.00,
        loans: 0.00,
        totalOther: 0.00
      },
      totalDeductions: 2942.58
    },
    netPay: 6065.75,
    payPeriod: "January 2025"
  });

  // Payslip history - fake API data
  const [payslipHistory] = useState([
    {
      id: 'PS202501',
      period: 'January 2025',
      payDate: '2025-01-31',
      grossPay: 9008.33,
      netPay: 6065.75,
      deductions: 2942.58,
      status: 'processed',
      downloadUrl: '/api/payslips/PS202501.pdf'
    },
    {
      id: 'PS202412',
      period: 'December 2024',
      payDate: '2024-12-31',
      grossPay: 8750.00,
      netPay: 5892.45,
      deductions: 2857.55,
      status: 'processed',
      downloadUrl: '/api/payslips/PS202412.pdf'
    },
    {
      id: 'PS202411',
      period: 'November 2024',
      payDate: '2024-11-30',
      grossPay: 7583.33,
      netPay: 5245.28,
      deductions: 2338.05,
      status: 'processed',
      downloadUrl: '/api/payslips/PS202411.pdf'
    },
    {
      id: 'PS202410',
      period: 'October 2024',
      payDate: '2024-10-31',
      grossPay: 7583.33,
      netPay: 5245.28,
      deductions: 2338.05,
      status: 'processed',
      downloadUrl: '/api/payslips/PS202410.pdf'
    },
    {
      id: 'PS202409',
      period: 'September 2024',
      payDate: '2024-09-30',
      grossPay: 7583.33,
      netPay: 5245.28,
      deductions: 2338.05,
      status: 'processing',
      downloadUrl: null
    }
  ]);

  // Tax information and calculations - fake API data
  const [taxInformation] = useState({
    currentYear: 2025,
    filingStatus: 'Single',
    allowances: 1,
    additionalWithholding: 0,
    yearToDate: {
      grossIncome: 7083.33,
      federalTax: 1265.50,
      stateTax: 423.50,
      socialSecurity: 439.17,
      medicare: 102.71,
      totalTax: 2230.88,
      effectiveRate: 31.5
    },
    projectedAnnual: {
      grossIncome: 85000,
      estimatedRefund: 1250,
      taxOwed: 18750,
      effectiveRate: 22.1
    },
    taxDocuments: [
      { type: 'W-2', year: 2024, status: 'available', downloadUrl: '/tax/w2-2024.pdf' },
      { type: '1099-MISC', year: 2024, status: 'available', downloadUrl: '/tax/1099-2024.pdf' },
      { type: 'W-4', year: 2025, status: 'current', downloadUrl: '/tax/w4-2025.pdf' }
    ]
  });

  // Benefits information - fake API data
  const [benefitsData] = useState({
    healthInsurance: {
      plan: 'Premium Health Plan',
      coverage: 'Employee + Family',
      monthlyPremium: 245.00,
      employerContribution: 180.00,
      employeeContribution: 65.00,
      deductible: 2000,
      outOfPocketMax: 8000
    },
    retirement: {
      plan: '401(k) Plan',
      employeeContribution: '8.5%',
      employerMatch: '4.0%',
      vestedPercentage: 100,
      currentBalance: 45780.25,
      ytdContribution: 708.33,
      ytdEmployerMatch: 354.17
    },
    flexibleSpending: {
      healthFSA: {
        annualLimit: 3050,
        currentBalance: 2100.50,
        ytdUsed: 949.50
      },
      dependentCare: {
        annualLimit: 5000,
        currentBalance: 4200.00,
        ytdUsed: 800.00
      }
    },
    otherBenefits: {
      life: { coverage: '$170,000', monthlyPremium: 15.00 },
      disability: { coverage: '60% of salary', monthlyPremium: 35.00 },
      dental: { plan: 'Standard Dental', monthlyPremium: 45.00 },
      vision: { plan: 'Basic Vision', monthlyPremium: 25.00 }
    }
  });

  // Payroll analytics data - fake API response
  const [analyticsData] = useState({
    yearToDateSummary: {
      totalEarnings: 7083.33,
      totalDeductions: 2942.58,
      netPay: 4140.75,
      overtimePay: 450.00,
      bonusPay: 1000.00,
      taxesWithheld: 2230.88
    },
    monthlyComparison: [
      { month: 'Jan 2025', gross: 9008.33, net: 6065.75, deductions: 2942.58 },
      { month: 'Dec 2024', gross: 8750.00, net: 5892.45, deductions: 2857.55 },
      { month: 'Nov 2024', gross: 7583.33, net: 5245.28, deductions: 2338.05 },
      { month: 'Oct 2024', gross: 7583.33, net: 5245.28, deductions: 2338.05 },
      { month: 'Sep 2024', gross: 7583.33, net: 5245.28, deductions: 2338.05 },
      { month: 'Aug 2024', gross: 7583.33, net: 5245.28, deductions: 2338.05 }
    ],
    deductionBreakdown: [
      { category: 'Federal Tax', amount: 1265.50, percentage: 43.0 },
      { category: 'State Tax', amount: 423.50, percentage: 14.4 },
      { category: '401(k)', amount: 708.33, percentage: 24.1 },
      { category: 'Health Insurance', amount: 245.00, percentage: 8.3 },
      { category: 'Social Security', amount: 439.17, percentage: 14.9 },
      { category: 'Medicare', amount: 102.71, percentage: 3.5 },
      { category: 'Other', amount: 158.37, percentage: 5.4 }
    ]
  });

  // Bank integration information - fake API data
  const [bankIntegration] = useState({
    isConnected: true,
    bankName: "Chase Bank",
    accountType: "Checking",
    accountLast4: "4532",
    routingNumber: "021000021",
    directDepositEnabled: true,
    paymentHistory: [
      { date: '2025-01-31', amount: 6065.75, status: 'completed', transactionId: 'TXN001' },
      { date: '2024-12-31', amount: 5892.45, status: 'completed', transactionId: 'TXN002' },
      { date: '2024-11-30', amount: 5245.28, status: 'completed', transactionId: 'TXN003' }
    ],
    nextPayment: {
      date: '2025-02-28',
      estimatedAmount: 6065.75,
      status: 'scheduled'
    }
  });

  // Approval workflow data (for HR/Payroll officers) - fake API data
  const [approvalData] = useState({
    pendingApprovals: [
      {
        id: 'APR001',
        employeeId: 'EMP123',
        employeeName: 'John Smith',
        type: 'Salary Adjustment',
        currentSalary: 75000,
        proposedSalary: 80000,
        reason: 'Performance review increase',
        requestDate: '2025-01-20',
        requestedBy: 'Manager - Mike Johnson',
        department: 'Engineering'
      },
      {
        id: 'APR002',
        employeeId: 'EMP456',
        employeeName: 'Emma Davis',
        type: 'Bonus Payment',
        amount: 2500,
        reason: 'Project completion bonus',
        requestDate: '2025-01-18',
        requestedBy: 'Manager - Lisa Wang',
        department: 'Marketing'
      },
      {
        id: 'APR003',
        employeeId: 'EMP789',
        employeeName: 'David Kim',
        type: 'Overtime Payment',
        hours: 15,
        rate: 45.00,
        totalAmount: 675.00,
        period: 'January 2025',
        requestDate: '2025-01-15',
        requestedBy: 'Supervisor - Carol Brown',
        department: 'Operations'
      }
    ],
    recentApprovals: [
      {
        id: 'APR004',
        employeeName: 'Alice Wong',
        type: 'Salary Adjustment',
        amount: 5000,
        status: 'approved',
        approvedBy: 'HR Director',
        approvedDate: '2025-01-10'
      }
    ]
  });

  // Mock API functions - simulates backend calls
  const handleDownloadPayslip = async (payslipId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`�?Payslip ${payslipId} downloaded successfully! (Demo: File would be downloaded in real app)`);
      return { success: true, url: `/downloads/payslip_${payslipId}.pdf` };
    } catch (error) {
      alert('�?Failed to download payslip. Please try again.');
      return { success: false, error: 'Download failed' };
    }
  };

  const handleGenerateReport = async (reportType, dateRange) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`�?${reportType} report generated successfully for ${dateRange}! (Demo: Excel file would be created)`);
      return { success: true, reportId: `RPT_${Date.now()}` };
    } catch (error) {
      alert('�?Failed to generate report. Please try again.');
      return { success: false, error: 'Report generation failed' };
    }
  };

  const handleApprovePayroll = async (approvalId, decision) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`�?Payroll item ${approvalId} has been ${decision}! (Demo: Would update database)`);
      return { success: true, decision, timestamp: new Date() };
    } catch (error) {
      alert('�?Failed to process approval. Please try again.');
      return { success: false, error: 'Approval failed' };
    }
  };

  const handleBankUpdate = async (bankDetails) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('�?Bank information updated successfully! (Demo: Would integrate with banking API)');
      return { success: true, updated: bankDetails };
    } catch (error) {
      alert('�?Failed to update bank information. Please try again.');
      return { success: false, error: 'Bank update failed' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Payroll Dashboard - Employee Hub</title>
        <meta name="description" content="Comprehensive payroll management interface with salary calculations, tax reporting, and benefits integration." />
      </Helmet>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <PayrollHeader 
              user={currentUser}
              salary={currentSalary}
              onDownload={handleDownloadPayslip}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            
            {/* Left Column - Salary & Breakdown */}
            <div className="lg:col-span-8 space-y-8">
              {/* Salary Breakdown */}
              <SalaryBreakdown 
                breakdown={salaryBreakdown}
                currency={currentSalary?.currency}
              />
              
              {/* Payslip History */}
              <PayslipHistory 
                history={payslipHistory}
                onDownload={handleDownloadPayslip}
              />
              
              {/* Analytics Dashboard */}
              <PayrollAnalytics 
                analytics={analyticsData}
                onGenerateReport={handleGenerateReport}
              />
            </div>

            {/* Right Column - Tools & Information */}
            <div className="lg:col-span-4 space-y-8">
              {/* Tax Calculator */}
              <TaxCalculator 
                taxData={taxInformation}
                currentSalary={currentSalary}
              />
              
              {/* Benefits Overview */}
              <BenefitsOverview 
                benefits={benefitsData}
                currency={currentSalary?.currency}
              />
              
              {/* Bank Integration */}
              <BankIntegration 
                bankData={bankIntegration}
                onUpdateBank={handleBankUpdate}
              />
            </div>
          </div>

          {/* HR/Payroll Officer Section */}
          {(currentUser?.payrollRole === 'hr_admin' || currentUser?.payrollRole === 'payroll_officer') && (
            <div className="mb-8">
              <PayrollApproval 
                approvals={approvalData}
                onApprove={handleApprovePayroll}
                userRole={currentUser?.payrollRole}
              />
            </div>
          )}

          {/* Compliance & Reporting Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Compliance Dashboard */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Compliance & Documents
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Tax Compliance Status</p>
                    <p className="text-xs text-green-600">All tax documents up to date</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700">Compliant</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Available Documents</h4>
                  {taxInformation?.taxDocuments?.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-800">{doc?.type} - {doc?.year}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-700">Download</button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  View All Documents
                </button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <Calculator className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Tax Calculator</span>
                </button>
                
                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <PieChart className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Salary Analysis</span>
                </button>
                
                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <CreditCard className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Bank Settings</span>
                </button>
                
                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <TrendingUp className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Projections</span>
                </button>
              </div>

              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Generate Annual Report
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              🎯 <strong>Demo Note:</strong> This is a comprehensive payroll management system with fake API data for demonstration
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Features: Automated calculations �?Tax compliance �?Benefits integration �?Bank integration �?Multi-currency support �?Approval workflows
            </p>
            <div className="flex justify-center items-center mt-3 space-x-4">
              <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-600">RBAC enabled for different user roles</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-600">Multi-currency and regulation compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;

