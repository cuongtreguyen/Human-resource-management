import React from 'react';
import { DollarSign, TrendingUp, Award, AlertCircle } from 'lucide-react';

const CompensationTab = ({ formData, setFormData }) => {
  const handleCompensationChange = (type, field, value) => {
    setFormData({
      ...formData,
      compensation: {
        ...formData.compensation,
        [type]: {
          ...formData.compensation[type],
          [field]: value
        }
      }
    });
  };

  const bonusTypes = [
    { value: 'performance', label: '🎯 Thưởng hiệu suất' },
    { value: 'project', label: '📁 Thưởng dự án' },
    { value: 'quarterly', label: '📅 Thưởng quý' },
    { value: 'annual', label: '🎁 Thưởng năm (13th month)' },
    { value: 'special', label: '⭐ Thưởng đặc biệt' }
  ];

  return (
    <div className="space-y-6">
      < div className="bg-amber-50 border border-amber-200 rounded-lg p-4" >
        <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Thông tin quan trọng
        </h4>
        <p className="text-sm text-amber-800">
          Phần này chỉ mang tính chất ĐỀ XUẤT. Quyết định cuối cùng sẽ được xem xét và phê duyệt bởi Ban Giám Đốc và Phòng Nhân Sự.
        </p>
      </div >

      {/* Salary Increase */}
      < div className="bg-white p-6 rounded-xl border border-gray-200" >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          Đề xuất Tăng lương
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="salaryIncrease"
              checked={formData.compensation.salaryIncrease.recommended}
              onChange={(e) => handleCompensationChange('salaryIncrease', 'recommended', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="salaryIncrease" className="text-sm font-medium text-gray-700 cursor-pointer">
              Đề xuất tăng lương cho nhân viên này
            </label>
          </div>

          {formData.compensation.salaryIncrease.recommended && (
            <div className="pl-9 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỷ lệ tăng (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formData.compensation.salaryIncrease.percentage || ''}
                    onChange={(e) => handleCompensationChange('salaryIncrease', 'percentage', parseFloat(e.target.value))}
                    placeholder="VD: 10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nhập số % tăng so với mức lương hiện tại
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg w-full">
                    <div className="text-sm text-gray-600">Mức tăng đề xuất</div>
                    <div className="text-2xl font-bold text-green-600">
                      +{formData.compensation.salaryIncrease.percentage || 0}%
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do đề xuất tăng lương <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.compensation.salaryIncrease.reason || ''}
                  onChange={(e) => handleCompensationChange('salaryIncrease', 'reason', e.target.value)}
                  rows="3"
                  placeholder="VD: Hiệu suất xuất sắc, Hoàn thành vượt mức KPIs, Đóng góp quan trọng cho dự án X..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div >

      {/* Bonus */}
      < div className="bg-white p-6 rounded-xl border border-gray-200" >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="text-yellow-600" size={20} />
          Đề xuất Thưởng
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="bonus"
              checked={formData.compensation.bonus.recommended}
              onChange={(e) => handleCompensationChange('bonus', 'recommended', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="bonus" className="text-sm font-medium text-gray-700 cursor-pointer">
              Đề xuất thưởng cho nhân viên này
            </label>
          </div>

          {formData.compensation.bonus.recommended && (
            <div className="pl-9 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền thưởng (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={formData.compensation.bonus.amount || ''}
                    onChange={(e) => handleCompensationChange('bonus', 'amount', parseFloat(e.target.value))}
                    placeholder="VD: 5000000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại thưởng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.compensation.bonus.type || ''}
                    onChange={(e) => handleCompensationChange('bonus', 'type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn loại thưởng</option>
                    {bonusTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-gray-600">Tổng tiền thưởng đề xuất</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {(formData.compensation.bonus.amount || 0).toLocaleString('vi-VN')} VNĐ
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do đề xuất thưởng <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.compensation.bonus.reason || ''}
                  onChange={(e) => handleCompensationChange('bonus', 'reason', e.target.value)}
                  rows="3"
                  placeholder="VD: Hoàn thành dự án X đúng hạn, Đóng góp tăng doanh thu 20%, Giải quyết vấn đề kỹ thuật nghiêm trọng..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div >

      {/* Promotion */}
      < div className="bg-white p-6 rounded-xl border border-gray-200" >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="text-purple-600" size={20} />
          Đề xuất Thăng chức
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="promotion"
              checked={formData.compensation.promotion.recommended}
              onChange={(e) => handleCompensationChange('promotion', 'recommended', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="promotion" className="text-sm font-medium text-gray-700 cursor-pointer">
              Đề xuất thăng chức cho nhân viên này
            </label>
          </div>

          {formData.compensation.promotion.recommended && (
            <div className="pl-9 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ mới đề xuất <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.compensation.promotion.toPosition || ''}
                  onChange={(e) => handleCompensationChange('promotion', 'toPosition', e.target.value)}
                  placeholder="VD: Senior Developer, Team Lead, Manager"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Lộ trình thăng chức</div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span className="text-gray-600">Hiện tại: Developer</span>
                  <span className="text-purple-600">→</span>
                  <span className="text-purple-600">
                    {formData.compensation.promotion.toPosition || 'Chưa xác định'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do đề xuất thăng chức <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.compensation.promotion.reason || ''}
                  onChange={(e) => handleCompensationChange('promotion', 'reason', e.target.value)}
                  rows="4"
                  placeholder="VD: Đã chứng minh năng lực lãnh đạo xuất sắc, Có kỹ năng quản lý team tốt, Sẵn sàng cho vai trò cao hơn..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div >

      {/* Summary */}
      < div className="bg-gradient-to-r from-green-50 to-purple-50 p-6 rounded-xl border border-green-200" >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan Đề xuất Đãi ngộ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${formData.compensation.salaryIncrease.recommended
              ? 'bg-green-100 border-green-300'
              : 'bg-gray-100 border-gray-300'
            }`}>
            <div className="font-semibold text-gray-900">Tăng lương</div>
            <div className="text-2xl font-bold text-green-600">
              {formData.compensation.salaryIncrease.recommended
                ? `+${formData.compensation.salaryIncrease.percentage || 0}%`
                : '—'}
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${formData.compensation.bonus.recommended
              ? 'bg-yellow-100 border-yellow-300'
              : 'bg-gray-100 border-gray-300'
            }`}>
            <div className="font-semibold text-gray-900">Thưởng</div>
            <div className="text-2xl font-bold text-yellow-600">
              {formData.compensation.bonus.recommended
                ? `${(formData.compensation.bonus.amount || 0).toLocaleString('vi-VN')}đ`
                : '—'}
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${formData.compensation.promotion.recommended
              ? 'bg-purple-100 border-purple-300'
              : 'bg-gray-100 border-gray-300'
            }`}>
            <div className="font-semibold text-gray-900">Thăng chức</div>
            <div className="text-lg font-bold text-purple-600">
              {formData.compensation.promotion.recommended
                ? formData.compensation.promotion.toPosition || 'Có'
                : '—'}
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default CompensationTab;
