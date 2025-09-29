import React, { useState } from 'react';
import { PieChart, BarChart3, Calculator, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';

const SalaryBreakdown = ({ breakdown, currency = 'USD' }) => {
  const [activeView, setActiveView] = useState('detailed'); // detailed, chart, summary

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  // Calculate percentages for visual representation
  const calculatePercentage = (amount, total) => {
    return ((amount / total) * 100)?.toFixed(1);
  };

  const earningsItems = [
    { label: 'Base Salary', amount: breakdown?.earnings?.baseSalary, color: 'bg-blue-500' },
    { label: 'Overtime', amount: breakdown?.earnings?.overtime, color: 'bg-green-500' },
    { label: 'Bonus', amount: breakdown?.earnings?.bonus, color: 'bg-yellow-500' },
    { label: 'Transport Allowance', amount: breakdown?.earnings?.allowances?.transport, color: 'bg-purple-500' },
    { label: 'Meal Allowance', amount: breakdown?.earnings?.allowances?.meals, color: 'bg-pink-500' },
    { label: 'Phone Allowance', amount: breakdown?.earnings?.allowances?.phone, color: 'bg-indigo-500' },
    { label: 'Internet Allowance', amount: breakdown?.earnings?.allowances?.internet, color: 'bg-teal-500' }
  ]?.filter(item => item?.amount > 0);

  const deductionItems = [
    { label: 'Federal Tax', amount: breakdown?.deductions?.taxes?.federal, color: 'bg-red-500' },
    { label: 'State Tax', amount: breakdown?.deductions?.taxes?.state, color: 'bg-red-400' },
    { label: 'Local Tax', amount: breakdown?.deductions?.taxes?.local, color: 'bg-red-300' },
    { label: '401(k) Contribution', amount: breakdown?.deductions?.retirement?.contribution401k, color: 'bg-orange-500' },
    { label: 'Health Insurance', amount: breakdown?.deductions?.insurance?.health, color: 'bg-cyan-500' },
    { label: 'Dental Insurance', amount: breakdown?.deductions?.insurance?.dental, color: 'bg-cyan-400' },
    { label: 'Vision Insurance', amount: breakdown?.deductions?.insurance?.vision, color: 'bg-cyan-300' },
    { label: 'Life Insurance', amount: breakdown?.deductions?.insurance?.life, color: 'bg-gray-500' },
    { label: 'Disability Insurance', amount: breakdown?.deductions?.insurance?.disability, color: 'bg-gray-400' }
  ]?.filter(item => item?.amount > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calculator className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Salary Breakdown</h3>
          <span className="text-sm text-gray-500">({breakdown?.payPeriod})</span>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('detailed')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeView === 'detailed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Detailed
          </button>
          <button
            onClick={() => setActiveView('chart')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeView === 'chart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveView('summary')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeView === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Summary
          </button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Total Earnings</span>
            <Plus className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-800">
            {formatCurrency(breakdown?.earnings?.totalEarnings)}
          </p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700">Total Deductions</span>
            <Minus className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-red-800">
            {formatCurrency(breakdown?.deductions?.totalDeductions)}
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Net Pay</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-blue-800">
            {formatCurrency(breakdown?.netPay)}
          </p>
        </div>
      </div>
      {/* Content based on active view */}
      {activeView === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Earnings Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Earnings</span>
            </h4>
            <div className="space-y-3">
              {earningsItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item?.color}`}></div>
                    <span className="text-sm text-gray-700">{item?.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(item?.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {calculatePercentage(item?.amount, breakdown?.earnings?.totalEarnings)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deductions Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span>Deductions</span>
            </h4>
            <div className="space-y-3">
              {deductionItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item?.color}`}></div>
                    <span className="text-sm text-gray-700">{item?.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      -{formatCurrency(item?.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {calculatePercentage(item?.amount, breakdown?.deductions?.totalDeductions)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeView === 'chart' && (
        <div className="space-y-6">
          
          {/* Visual Chart Representation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Earnings Chart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Earnings Distribution</h4>
              </div>
              <div className="space-y-3">
                {earningsItems?.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{item?.label}</span>
                      <span className="text-sm font-medium">{formatCurrency(item?.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item?.color}`}
                        style={{ 
                          width: `${calculatePercentage(item?.amount, breakdown?.earnings?.totalEarnings)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions Chart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-gray-900">Deductions Distribution</h4>
              </div>
              <div className="space-y-3">
                {deductionItems?.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{item?.label}</span>
                      <span className="text-sm font-medium">{formatCurrency(item?.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item?.color}`}
                        style={{ 
                          width: `${calculatePercentage(item?.amount, breakdown?.deductions?.totalDeductions)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeView === 'summary' && (
        <div className="space-y-6">
          
          {/* High-level Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Earnings Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Salary:</span>
                  <span className="font-medium">{formatCurrency(breakdown?.earnings?.baseSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variable Pay:</span>
                  <span className="font-medium">{formatCurrency(breakdown?.earnings?.overtime + breakdown?.earnings?.bonus)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allowances:</span>
                  <span className="font-medium">{formatCurrency(
                    breakdown?.earnings?.allowances?.transport + 
                    breakdown?.earnings?.allowances?.meals + 
                    breakdown?.earnings?.allowances?.phone + 
                    breakdown?.earnings?.allowances?.internet
                  )}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-700 pt-2 border-t">
                  <span>Total Earnings:</span>
                  <span>{formatCurrency(breakdown?.earnings?.totalEarnings)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Deductions Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="font-medium">{formatCurrency(breakdown?.deductions?.taxes?.totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="font-medium">{formatCurrency(breakdown?.deductions?.insurance?.totalInsurance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retirement:</span>
                  <span className="font-medium">{formatCurrency(breakdown?.deductions?.retirement?.totalRetirement)}</span>
                </div>
                <div className="flex justify-between font-semibold text-red-700 pt-2 border-t">
                  <span>Total Deductions:</span>
                  <span>{formatCurrency(breakdown?.deductions?.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Calculation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-900">Final Net Pay</h4>
                <p className="text-sm text-blue-700">After all deductions and taxes</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(breakdown?.netPay)}</p>
                <p className="text-sm text-blue-700">
                  {calculatePercentage(breakdown?.netPay, breakdown?.earnings?.totalEarnings)}% of gross
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryBreakdown;

