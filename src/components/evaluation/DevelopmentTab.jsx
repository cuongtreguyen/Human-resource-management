import React from 'react';
import { BookOpen, Plus, Trash2, TrendingUp, Target } from 'lucide-react';
import { TRAINING_PRIORITIES } from '../../config/evaluationConfig';

const DevelopmentTab = ({ formData, setFormData }) => {
    const addTraining = () => {
        setFormData({
            ...formData,
            trainingNeeds: [...formData.trainingNeeds, { course: '', priority: 'medium', deadline: '', provider: '', cost: '' }]
        });
    };

    const removeTraining = (index) => {
        setFormData({
            ...formData,
            trainingNeeds: formData.trainingNeeds.filter((_, i) => i !== index)
        });
    };

    const updateTraining = (index, field, value) => {
        const newTrainings = [...formData.trainingNeeds];
        newTrainings[index][field] = value;
        setFormData({ ...formData, trainingNeeds: newTrainings });
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[priority] || colors.medium;
    };

    return (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Kế hoạch Phát triển Cá nhân (IDP)</h4>
                <p className="text-sm text-green-800">
                    Xác định các kỹ năng cần phát triển, khóa đào tạo cần thiết và lộ trình nghề nghiệp của nhân viên.
                </p>
            </div>

            {/* Training Needs */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={20} />
                        Nhu cầu Đào tạo
                    </h3>
                    <button
                        type="button"
                        onClick={addTraining}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Thêm khóa học
                    </button>
                </div>

                {formData.trainingNeeds && formData.trainingNeeds.length > 0 ? (
                    <div className="space-y-4">
                        {formData.trainingNeeds.map((training, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">Khóa học #{index + 1}</h4>
                                    {formData.trainingNeeds.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTraining(index)}
                                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên khóa học <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={training.course || ''}
                                            onChange={(e) => updateTraining(index, 'course', e.target.value)}
                                            placeholder="VD: Advanced React & Redux, Leadership Training, Excel Advanced"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Độ ưu tiên
                                        </label>
                                        <select
                                            value={training.priority || 'medium'}
                                            onChange={(e) => updateTraining(index, 'priority', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${getPriorityColor(training.priority)}`}
                                        >
                                            <option value="high">🔴 Cao - Cần gấp</option>
                                            <option value="medium">🟡 Trung bình</option>
                                            <option value="low">🟢 Thấp - Có thể chờ</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            value={training.deadline || ''}
                                            onChange={(e) => updateTraining(index, 'deadline', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nhà cung cấp
                                        </label>
                                        <input
                                            type="text"
                                            value={training.provider || ''}
                                            onChange={(e) => updateTraining(index, 'provider', e.target.value)}
                                            placeholder="VD: Udemy, Coursera, Internal Training"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chi phí ước tính (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            value={training.cost || ''}
                                            onChange={(e) => updateTraining(index, 'cost', e.target.value)}
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Training Summary */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {formData.trainingNeeds.filter(t => t.priority === 'high').length}
                                </div>
                                <div className="text-sm text-gray-600">Ưu tiên cao</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {formData.trainingNeeds.filter(t => t.priority === 'medium').length}
                                </div>
                                <div className="text-sm text-gray-600">Ưu tiên trung bình</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {formData.trainingNeeds.filter(t => t.priority === 'low').length}
                                </div>
                                <div className="text-sm text-gray-600">Ưu tiên thấp</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có nhu cầu đào tạo</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Nhấn "Thêm khóa học" để bắt đầu lập kế hoạch đào tạo
                        </p>
                    </div>
                )}
            </div>

            {/* Career Goals */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="text-green-600" size={20} />
                    Mục tiêu Nghề nghiệp
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mục tiêu ngắn hạn (6-12 tháng)
                        </label>
                        <textarea
                            value={formData.careerGoals?.shortTerm || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                careerGoals: { ...formData.careerGoals, shortTerm: e.target.value }
                            })}
                            rows="4"
                            placeholder="VD: Trở thành Senior Developer, Hoàn thành certification AWS, Lead 1 dự án lớn..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mục tiêu dài hạn (2-5 năm)
                        </label>
                        <textarea
                            value={formData.careerGoals?.longTerm || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                careerGoals: { ...formData.careerGoals, longTerm: e.target.value }
                            })}
                            rows="4"
                            placeholder="VD: Technical Lead/Engineering Manager, Chuyên gia trong lĩnh vực X, Mở công ty riêng..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Development Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="text-green-600" size={20} />
                    Tổng quan Phát triển
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">
                            {formData.trainingNeeds?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Khóa học cần thiết</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">
                            {formData.trainingNeeds?.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0).toLocaleString('vi-VN')}
                        </div>
                        <div className="text-sm text-gray-600">Tổng chi phí (VNĐ)</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-green-600">
                            {formData.careerGoals?.shortTerm && formData.careerGoals?.longTerm ? '✓' : '—'}
                        </div>
                        <div className="text-sm text-gray-600">Mục tiêu đã đặt</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentTab;
