import React from 'react';
import { DollarSign, Download, FileText, Calendar, TrendingUp } from 'lucide-react';

const PayrollHeader = ({ user, salary, onDownload, onGenerateReport }) => {
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const handleQuickDownload = async () => {
    await onDownload('PS202501');
  };

  const handleQuickReport = async () => {
    await onGenerateReport('Monthly Payroll Summary', 'January 2025');
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div className="mb-6 lg:mb-0">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payroll Dashboard</h1>
              <p className="text-gray-600">Comprehensive salary management and financial overview</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>Employee ID:</span>
            <span className="font-medium text-gray-900">{user?.employeeId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Next Pay Date:</span>
            <span className="font-medium text-gray-900">
              {new Date(salary?.nextPayDate)?.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Pay Frequency:</span>
            <span className="font-medium text-gray-900">{salary?.payFrequency}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats & Actions */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
        
        {/* Current Salary Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-64">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Current Net Pay</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(salary?.netPay, salary?.currency)}
            </p>
            <p className="text-sm text-gray-500">
              Gross: {formatCurrency(salary?.grossPay, salary?.currency)}
            </p>
            <p className="text-xs text-gray-400">
              YTD Earnings: {formatCurrency(salary?.ytdEarnings, salary?.currency)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleQuickDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Latest Payslip</span>
          </button>
          
          <button
            onClick={handleQuickReport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollHeader;

