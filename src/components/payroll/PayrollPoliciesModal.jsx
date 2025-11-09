import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { CheckCircle, AlertCircle, Building } from 'lucide-react';

const PayrollPoliciesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Financial Policies</h2>
              <p className="text-purple-100">Company payroll policies and regulations</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-purple-600">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
          <div className="space-y-6">
            <Card title="💼 Salary Policy">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Working Days:</strong> Standard 22 days per month
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Late Penalty:</strong> 50% salary deduction per late day
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Overtime Rate:</strong> 150% of standard hourly rate
                  </div>
                </div>
              </div>
            </Card>

            <Card title="💸 Tax Regulations">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Taxable Income:</strong> Income above 11,000,000 VND
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Tax Rate:</strong> 5% for private enterprises
                  </div>
                </div>
              </div>
            </Card>

            <Card title="🛡️ Insurance">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Social Insurance:</strong> 10.5% of basic salary
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Health Insurance:</strong> Included in social insurance
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Unemployment Insurance:</strong> Included in social insurance
                  </div>
                </div>
              </div>
            </Card>

            <Card title="🎁 Benefits">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Allowances:</strong> Transport, meal, communication allowances
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Bonuses:</strong> Performance, attendance, productivity bonuses
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPoliciesModal;

