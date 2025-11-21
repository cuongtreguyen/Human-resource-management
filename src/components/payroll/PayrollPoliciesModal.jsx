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
              <h2 className="text-xl font-semibold">Chính sách tài chính</h2>
              <p className="text-purple-100">Chính sách và quy định lương của công ty</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-purple-600">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
          <div className="space-y-6">
            <Card title="💼 Chính sách lương">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Ngày công:</strong> Tiêu chuẩn 22 ngày/tháng
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Phạt đi trễ:</strong> Trừ 50% lương mỗi ngày trễ
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Lương làm thêm:</strong> 150% lương giờ tiêu chuẩn
                  </div>
                </div>
              </div>
            </Card>

            <Card title="💸 Quy định thuế">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Thu nhập chịu thuế:</strong> Thu nhập trên 11,000,000 VND
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Thuế suất:</strong> 5% cho doanh nghiệp tư nhân
                  </div>
                </div>
              </div>
            </Card>

            <Card title="🛡️ Bảo hiểm">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Bảo hiểm xã hội:</strong> 10.5% lương cơ bản
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Bảo hiểm y tế:</strong> Bao gồm trong BHXH
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Bảo hiểm thất nghiệp:</strong> Bao gồm trong BHXH
                  </div>
                </div>
              </div>
            </Card>

            <Card title="🎁 Phúc lợi">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Phụ cấp:</strong> Đi lại, ăn uống, liên lạc
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Thưởng:</strong> Hiệu suất, chuyên cần, năng suất
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

