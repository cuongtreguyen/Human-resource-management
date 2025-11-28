import React from 'react';
import { Award, Star } from 'lucide-react';
import { CORE_COMPETENCIES, TECHNICAL_COMPETENCIES_BY_ROLE, LEADERSHIP_COMPETENCIES } from '../../config/evaluationConfig';

const CompetenciesTab = ({ formData, setFormData, selectedEmployee }) => {
    const updateCompetencyRating = (category, index, field, value) => {
        const competencies = [...formData[category]];
        competencies[index][field] = value;
        setFormData({ ...formData, [category]: competencies });
    };

    const getRatingColor = (rating) => {
        const colors = {
            5: 'bg-green-500',
            4: 'bg-blue-500',
            3: 'bg-yellow-500',
            2: 'bg-orange-500',
            1: 'bg-red-500'
        };
        return colors[Math.round(rating)] || 'bg-gray-300';
    };

    const renderCompetencySection = (title, competencies, category) => {
        if (!competencies || competencies.length === 0) return null;

        return (
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="text-blue-600" size={20} />
                    {title}
                </h3>
                <div className="space-y-4">
                    {competencies.map((comp, index) => (
                        <div key={comp.id || index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{comp.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{comp.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">Trọng số: {comp.weight}%</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {comp.rating || 0.0}
                                    </div>
                                    <div className="text-xs text-gray-500">/ 5.0</div>
                                </div>
                            </div>

                            {/* Rating Slider */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm đánh giá
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={comp.rating || 0}
                                        onChange={(e) => updateCompetencyRating(category, index, 'rating', parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, ${getRatingColor(comp.rating || 0)} 0%, ${getRatingColor(comp.rating || 0)} ${(comp.rating || 0) * 20}%, #e5e7eb ${(comp.rating || 0) * 20}%, #e5e7eb 100%)`
                                        }}
                                    />
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => updateCompetencyRating(category, index, 'rating', star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={20}
                                                    className={`${(comp.rating || 0) >= star
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        } cursor-pointer hover:scale-110 transition-transform`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Labels */}
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Không đạt (1)</span>
                                    <span>Cần cải thiện (2)</span>
                                    <span>Đạt yêu cầu (3)</span>
                                    <span>Vượt mong đợi (4)</span>
                                    <span>Xuất sắc (5)</span>
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhận xét chi tiết
                                </label>
                                <textarea
                                    value={comp.comments || ''}
                                    onChange={(e) => updateCompetencyRating(category, index, 'comments', e.target.value)}
                                    rows="2"
                                    placeholder={`Nhận xét về ${comp.name.toLowerCase()}...`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn đánh giá</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Sử dụng slider hoặc click vào ngôi sao để cho điểm</li>
                    <li>Điểm từ 1-5: 1 = Không đạt, 3 = Đạt yêu cầu, 5 = Xuất sắc</li>
                    <li>Mỗi năng lực có trọng số khác nhau trong tổng điểm</li>
                    <li>Nên thêm nhận xét chi tiết để nhân viên hiểu rõ điểm mạnh/yếu</li>
                </ul>
            </div>

            {renderCompetencySection(
                'Năng lực nền tảng (Core Competencies)',
                formData.coreCompetencies,
                'coreCompetencies'
            )}

            {renderCompetencySection(
                'Năng lực chuyên môn (Technical Competencies)',
                formData.technicalCompetencies,
                'technicalCompetencies'
            )}

            {renderCompetencySection(
                'Năng lực lãnh đạo (Leadership Competencies)',
                formData.leadershipCompetencies,
                'leadershipCompetencies'
            )}

            {formData.coreCompetencies.length === 0 &&
                formData.technicalCompetencies.length === 0 &&
                formData.leadershipCompetencies.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <Award className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có năng lực để đánh giá</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Vui lòng chọn nhân viên để tự động load các năng lực cần đánh giá
                        </p>
                    </div>
                )}
        </div>
    );
};

export default CompetenciesTab;
