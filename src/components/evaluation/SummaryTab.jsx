import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Award, Target, Users, BookOpen, DollarSign } from 'lucide-react';

const SummaryTab = ({ formData, selectedEmployee }) => {
    // Calculate overall score from competencies
    const calculateOverallScore = () => {
        const allCompetencies = [
            ...(formData.coreCompetencies || []),
            ...(formData.technicalCompetencies || []),
            ...(formData.leadershipCompetencies || [])
        ];

        if (allCompetencies.length === 0) return 0;

        const totalWeight = allCompetencies.reduce((sum, comp) => sum + (comp.weight || 0), 0);
        const weightedSum = allCompetencies.reduce((sum, comp) =>
            sum + ((comp.rating || 0) * (comp.weight || 0)), 0
        );

        return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
    };

    const overallScore = calculateOverallScore();

    const getScoreLabel = (score) => {
        if (score >= 4.5) return { text: 'Xuất sắc', color: 'text-green-600', bg: 'bg-green-100' };
        if (score >= 4.0) return { text: 'Vượt mong đợi', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (score >= 3.0) return { text: 'Đạt yêu cầu', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        if (score >= 2.0) return { text: 'Cần cải thiện', color: 'text-orange-600', bg: 'bg-orange-100' };
        return { text: 'Không đạt', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const scoreInfo = getScoreLabel(overallScore);

    return (
        <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Tổng điểm đánh giá</h2>
                    <div className="text-6xl font-bold mb-2">{overallScore}</div>
                    <div className="text-xl opacity-90">/ 5.0</div>
                    <div className={`inline-block px-6 py-2 rounded-full mt-4 ${scoreInfo.bg} ${scoreInfo.color} font-semibold`}>
                        {scoreInfo.text}
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="text-blue-600" size={24} />
                        <h4 className="font-semibold text-gray-900">KPIs</h4>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                        {formData.kpis?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500">Mục tiêu đã đặt</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="text-purple-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Năng lực</h4>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                        {(formData.coreCompetencies?.length || 0) +
                            (formData.technicalCompetencies?.length || 0) +
                            (formData.leadershipCompetencies?.length || 0)}
                    </div>
                    <p className="text-sm text-gray-500">Đã đánh giá</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-green-600" size={24} />
                        <h4 className="font-semibold text-gray-900">360° Feedback</h4>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                        {(formData.peerRatings?.length || 0) + 2}
                    </div>
                    <p className="text-sm text-gray-500">Nguồn đánh giá</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-orange-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Phát triển</h4>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                        {formData.trainingNeeds?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500">Khóa đào tạo</p>
                </div>
            </div>

            {/* Strengths & Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={20} />
                        Điểm mạnh
                    </h3>
                    <textarea
                        value={formData.strengths || ''}
                        onChange={(e) => formData.setFormData?.({ ...formData, strengths: e.target.value })}
                        rows="6"
                        placeholder="Liệt kê các điểm mạnh nổi bật của nhân viên..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-orange-600" size={20} />
                        Cần cải thiện
                    </h3>
                    <textarea
                        value={formData.areasForImprovement || ''}
                        onChange={(e) => formData.setFormData?.({ ...formData, areasForImprovement: e.target.value })}
                        rows="6"
                        placeholder="Các lĩnh vực cần cải thiện và phát triển..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Key Accomplishments */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={20} />
                    Thành tích nổi bật
                </h3>
                <textarea
                    value={formData.keyAccomplishments || ''}
                    onChange={(e) => formData.setFormData?.({ ...formData, keyAccomplishments: e.target.value })}
                    rows="4"
                    placeholder="Mô tả các thành tích, dự án hoàn thành, đóng góp quan trọng..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Overall Comments */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhận xét tổng quát</h3>
                <textarea
                    value={formData.overallComments || ''}
                    onChange={(e) => formData.setFormData?.({ ...formData, overallComments: e.target.value })}
                    rows="5"
                    placeholder="Nhận xét tổng quan về hiệu suất làm việc trong kỳ đánh giá..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Khuyến nghị</h3>
                <textarea
                    value={formData.recommendations || ''}
                    onChange={(e) => formData.setFormData?.({ ...formData, recommendations: e.target.value })}
                    rows="4"
                    placeholder="Khuyến nghị cho kỳ đánh giá tiếp theo, hướng phát triển, cơ hội thăng tiến..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Compensation Summary */}
            {(formData.compensation?.salaryIncrease?.recommended ||
                formData.compensation?.bonus?.recommended ||
                formData.compensation?.promotion?.recommended) && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="text-green-600" size={20} />
                            Đề xuất Đãi ngộ
                        </h3>
                        <div className="space-y-2">
                            {formData.compensation.salaryIncrease.recommended && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <span className="font-medium">Tăng lương</span>
                                    <span className="text-green-600 font-bold">
                                        +{formData.compensation.salaryIncrease.percentage}%
                                    </span>
                                </div>
                            )}
                            {formData.compensation.bonus.recommended && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <span className="font-medium">Thưởng</span>
                                    <span className="text-yellow-600 font-bold">
                                        {(formData.compensation.bonus.amount || 0).toLocaleString('vi-VN')} VNĐ
                                    </span>
                                </div>
                            )}
                            {formData.compensation.promotion.recommended && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <span className="font-medium">Thăng chức</span>
                                    <span className="text-purple-600 font-bold">
                                        {formData.compensation.promotion.toPosition}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {/* Validation Warnings */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Lưu ý trước khi lưu
                </h4>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Đảm bảo đã điền đầy đủ thông tin ở tất cả các tabs</li>
                    <li>KPIs: Tổng trọng số phải = 100%</li>
                    <li>Năng lực: Đã đánh giá tất cả các năng lực bắt buộc</li>
                    <li>Nhận xét: Nên cụ thể, rõ ràng và mang tính xây dựng</li>
                </ul>
            </div>
        </div>
    );
};

export default SummaryTab;
