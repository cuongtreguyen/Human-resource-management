import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import fakeApi from '../services/fakeApi';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [reportParams, setReportParams] = useState({});
  const [generatedReports, setGeneratedReports] = useState([]);

  const reportTypes = [
    {
      id: 'employee_summary',
      name: 'Employee Summary Report',
      description: 'Tổng hợp thông tin nhân viên',
      icon: '👥',
      color: 'blue'
    },
    {
      id: 'attendance_summary',
      name: 'Attendance Summary Report',
      description: 'Báo cáo chấm công tổng hợp',
      icon: '⏰',
      color: 'green'
    },
    {
      id: 'payroll_summary',
      name: 'Payroll Summary Report',
      description: 'Báo cáo lương và phúc lợi',
      icon: '💰',
      color: 'yellow'
    },
    {
      id: 'department_analysis',
      name: 'Department Analysis Report',
      description: 'Phân tích hiệu suất phòng ban',
      icon: '📊',
      color: 'purple'
    }
  ];

  const generateReport = async (reportType, params = {}) => {
    setLoading(true);
    try {
      const response = await fakeApi.generateReport(reportType, params);
      setGeneratedReports(prev => [response.data, ...prev]);
      alert(`Report "${response.data.title}" generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = `#${report.filename}`;
    link.download = report.filename;
    link.click();
    alert(`Downloading ${report.filename}...`);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
      green: 'bg-green-600 hover:bg-green-700 border-green-500',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500',
      purple: 'bg-purple-600 hover:bg-purple-700 border-purple-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
              <p className="text-gray-400 text-sm">Dashboard / Reports</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Total Reports: {generatedReports.length}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Report Types Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Available Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportTypes.map((report) => (
                <div 
                  key={report.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{report.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{report.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{report.description}</p>
                    <button
                      onClick={() => generateReport(report.id)}
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${getColorClasses(report.color)} disabled:opacity-50`}
                    >
                      {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Reports */}
          {generatedReports.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Generated Reports</h2>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Recent Reports</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {generatedReports.map((report, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{report.title}</h4>
                            <p className="text-sm text-gray-400">
                              Generated: {new Date(report.generatedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Status: {report.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Ready
                          </span>
                          <button
                            onClick={() => downloadReport(report)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-6">Report Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg border border-blue-500 p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-100">Total Reports</p>
                    <p className="text-3xl font-bold">{generatedReports.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg border border-green-500 p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-100">This Month</p>
                    <p className="text-3xl font-bold">{Math.floor(generatedReports.length * 0.7)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl shadow-lg border border-yellow-500 p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-100">Success Rate</p>
                    <p className="text-3xl font-bold">98%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg border border-purple-500 p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-100">Downloads</p>
                    <p className="text-3xl font-bold">{generatedReports.length * 2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
