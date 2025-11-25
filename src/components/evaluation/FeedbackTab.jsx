import React from 'react';
import { Users, MessageSquare, User as UserIcon } from 'lucide-react';

const FeedbackTab = ({ formData, setFormData }) => {
    const handleRatingChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: parseFloat(value) || 0
        });
    };

    const addPeerRating = () => {
        setFormData({
            ...formData,
            peerRatings: [...formData.peerRatings, { name: '', rating: 0, comments: '' }]
        });
    };

    const removePeerRating = (index) => {
        setFormData({
            ...formData,
            peerRatings: formData.peerRatings.filter((_, i) => i !== index)
        });
    };

    const updatePeerRating = (index, field, value) => {
        const newPeerRatings = [...formData.peerRatings];
        newPeerRatings[index][field] = value;
        setFormData({ ...formData, peerRatings: newPeerRatings });
    };

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">360° Feedback là gì?</h4>
                <p className="text-sm text-purple-800">
                    Đánh giá từ nhiều nguồn: Tự đánh giá, Manager, Đồng nghiệp, và Cấp dưới (nếu có).
                    Cách tiếp cận này giúp có cái nhìn toàn diện về hiệu suất làm việc.
                </p>
            </div>

            {/* Self Rating */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="text-green-600" size={20} />
                    Tự đánh giá (Self-Assessment)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Điểm tự đánh giá
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.selfRating}
                            onChange={(e) => handleRatingChange('selfRating', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.0"
                        />
                    </div>
                    <div className="flex items-end">
                        <div className={`px-4 py-2 rounded-lg font-semibold ${formData.selfRating >= 4.5 ? 'bg-green-100 text-green-700' :
                                formData.selfRating >= 4 ? 'bg-blue-100 text-blue-700' :
                                    formData.selfRating >= 3 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                            }`}>
                            {formData.selfRating > 0 ? `${formData.selfRating}/5.0` : 'Chưa đánh giá'}
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhận xét tự đánh giá
                    </label>
                    <textarea
                        value={formData.selfComments || ''}
                        onChange={(e) => setFormData({ ...formData, selfComments: e.target.value })}
                        rows="3"
                        placeholder="Nhân viên tự nhận xét về hiệu suất của mình..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Manager Rating */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="text-blue-600" size={20} />
                    Đánh giá của Manager
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Điểm đánh giá
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.managerRating}
                            onChange={(e) => handleRatingChange('managerRating', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.0"
                        />
                    </div>
                    <div className="flex items-end">
                        <div className={`px-4 py-2 rounded-lg font-semibold ${formData.managerRating >= 4.5 ? 'bg-green-100 text-green-700' :
                                formData.managerRating >= 4 ? 'bg-blue-100 text-blue-700' :
                                    formData.managerRating >= 3 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                            }`}>
                            {formData.managerRating > 0 ? `${formData.managerRating}/5.0` : 'Chưa đánh giá'}
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhận xét của Manager
                    </label>
                    <textarea
                        value={formData.managerComments || ''}
                        onChange={(e) => setFormData({ ...formData, managerComments: e.target.value })}
                        rows="3"
                        placeholder="Manager nhận xét về hiệu suất nhân viên..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Peer Ratings */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="text-purple-600" size={20} />
                        Đánh giá từ đồng nghiệp (Peer Reviews)
                    </h3>
                    <button
                        type="button"
                        onClick={addPeerRating}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        + Thêm đồng nghiệp
                    </button>
                </div>

                {formData.peerRatings && formData.peerRatings.length > 0 ? (
                    <div className="space-y-4">
                        {formData.peerRatings.map((peer, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">Đồng nghiệp #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removePeerRating(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Xóa
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên đồng nghiệp
                                        </label>
                                        <input
                                            type="text"
                                            value={peer.name || ''}
                                            onChange={(e) => updatePeerRating(index, 'name', e.target.value)}
                                            placeholder="VD: Trần Văn B"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Điểm đánh giá
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={peer.rating || 0}
                                            onChange={(e) => updatePeerRating(index, 'rating', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nhận xét
                                    </label>
                                    <textarea
                                        value={peer.comments || ''}
                                        onChange={(e) => updatePeerRating(index, 'comments', e.target.value)}
                                        rows="2"
                                        placeholder="Nhận xét từ đồng nghiệp..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <Users className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                            Chưa có đánh giá từ đồng nghiệp. Nhấn "Thêm đồng nghiệp" để bắt đầu.
                        </p>
                    </div>
                )}

                {formData.peerRatings && formData.peerRatings.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Điểm trung bình từ đồng nghiệp:</strong>{' '}
                            {(formData.peerRatings.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / formData.peerRatings.length).toFixed(2)}/5.0
                        </p>
                    </div>
                )}
            </div>

            {/* Overall 360 Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="text-blue-600" size={20} />
                    Tổng kết 360° Feedback
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{formData.selfRating || 0}</div>
                        <div className="text-sm text-gray-600">Tự đánh giá</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{formData.managerRating || 0}</div>
                        <div className="text-sm text-gray-600">Manager</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {formData.peerRatings && formData.peerRatings.length > 0
                                ? (formData.peerRatings.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / formData.peerRatings.length).toFixed(1)
                                : 0}
                        </div>
                        <div className="text-sm text-gray-600">Đồng nghiệp</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                            {(() => {
                                const self = parseFloat(formData.selfRating) || 0;
                                const manager = parseFloat(formData.managerRating) || 0;
                                const peerAvg = formData.peerRatings && formData.peerRatings.length > 0
                                    ? formData.peerRatings.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / formData.peerRatings.length
                                    : 0;
                                const count = (self > 0 ? 1 : 0) + (manager > 0 ? 1 : 0) + (peerAvg > 0 ? 1 : 0);
                                return count > 0 ? ((self + manager + peerAvg) / count).toFixed(2) : 0;
                            })()}
                        </div>
                        <div className="text-sm text-gray-600">Trung bình</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackTab;
