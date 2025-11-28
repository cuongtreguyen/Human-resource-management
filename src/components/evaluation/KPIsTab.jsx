import React from 'react';
import { Plus, Trash2, Target, AlertCircle } from 'lucide-react';

const KPIsTab = ({ formData, setFormData }) => {
    const addKPI = () => {
        setFormData({
            ...formData,
            kpis: [...formData.kpis, {
                objective: '',
                target: '',
                actual: '',
                unit: '',
                weight: 0,
                comments: '',
                achievement: 0
            }]
        });
    };

    const removeKPI = (index) => {
        setFormData({
            ...formData,
            kpis: formData.kpis.filter((_, i) => i !== index)
        });
    };

    const updateKPI = (index, field, value) => {
        const newKPIs = [...formData.kpis];
        newKPIs[index][field] = value;

        // Auto-calculate achievement percentage
        if (field === 'target' || field === 'actual') {
            const target = parseFloat(newKPIs[index].target) || 0;
            const actual = parseFloat(newKPIs[index].actual) || 0;
            newKPIs[index].achievement = target > 0 ? ((actual / target) * 100).toFixed(1) : 0;
        }

        setFormData({ ...formData, kpis: newKPIs });
    };

    const getTotalWeight = () => {
        return formData.kpis.reduce((sum, kpi) => sum + (parseFloat(kpi.weight) || 0), 0);
    };

    const getAverageAchievement = () => {
        if (formData.kpis.length === 0) return 0;
        const totalWeightedAchievement = formData.kpis.reduce((sum, kpi) => {
            const achievement = parseFloat(kpi.achievement) || 0;
            const weight = parseFloat(kpi.weight) || 0;
            return sum + (achievement * weight / 100);
        }, 0);
        return totalWeightedAchievement.toFixed(1);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="text-blue-600" size={20} />
                        KPIs & Mục tiêu
                    </h3>
                    <button
                        onClick={addKPI}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Thêm KPI
                    </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                        <p className="text-sm text-gray-600">Tổng trọng số</p>
                        <p className={`text-xl font-bold ${getTotalWeight() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                            {getTotalWeight()}%
                        </p>
                        {getTotalWeight() !== 100 && (
                            <p className="text-xs text-red-600">Phải bằng 100%</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Mức đạt trung bình</p>
                        <p className="text-xl font-bold text-blue-600">
                            {getAverageAchievement()}%
                        </p>
                    </div>
                </div>

                {/* KPIs List */}
                <div className="space-y-4">
                    {formData.kpis.map((kpi, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium text-gray-900">KPI #{index + 1}</h4>
                                {formData.kpis.length > 1 && (
                                    <button
                                        onClick={() => removeKPI(index)}
                                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mục tiêu/Chỉ tiêu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={kpi.objective}
                                        onChange={(e) => updateKPI(index, 'objective', e.target.value)}
                                        placeholder="VD: Hoàn thành dự án X, Đạt doanh số Y triệu VNĐ"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mục tiêu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={kpi.target}
                                            onChange={(e) => updateKPI(index, 'target', e.target.value)}
                                            placeholder="100"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={kpi.unit}
                                            onChange={(e) => updateKPI(index, 'unit', e.target.value)}
                                            placeholder="Đơn vị"
                                            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thực tế đạt được <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={kpi.actual}
                                        onChange={(e) => updateKPI(index, 'actual', e.target.value)}
                                        placeholder="95"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trọng số (%) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={kpi.weight}
                                        onChange={(e) => updateKPI(index, 'weight', e.target.value)}
                                        placeholder="20"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mức đạt
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={`${kpi.achievement || 0}%`}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-semibold"
                                        />
                                        <div
                                            className="absolute left-0 bottom-0 h-1 bg-blue-600 rounded-b-lg transition-all"
                                            style={{ width: `${Math.min(parseFloat(kpi.achievement) || 0, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        value={kpi.comments}
                                        onChange={(e) => updateKPI(index, 'comments', e.target.value)}
                                        rows="2"
                                        placeholder="Ghi chú về KPI này..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {formData.kpis.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <Target className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có KPI</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Nhấn "Thêm KPI" để bắt đầu
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-medium text-amber-900 mb-2">Hướng dẫn</h4>
                        <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                            <li>Tổng trọng số của tất cả KPIs phải bằng 100%</li>
                            <li>Mức đạt được tự động tính = (Thực tế / Mục tiêu) × 100%</li>
                            <li>Nên có 3-5 KPIs chính cho mỗi nhân viên</li>
                            <li>KPIs phải SMART: Specific, Measurable, Achievable, Relevant, Time-bound</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIsTab;
