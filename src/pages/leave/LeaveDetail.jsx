import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import {
    Clock,
    AlertCircle,
    CheckCircle,
    FileText,
    X,
    User,
    Calendar,
    MessageSquare,
    ArrowLeft
} from 'lucide-react';
import { getLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../../services/leaveService';
import { toast } from 'react-toastify';
import { getRole } from '../../utils/auth';
import { logApproveLeave, logRejectLeave } from '../../utils/systemLogger';
import { getLeaveTypeName, getLeaveTypeColor } from '../../constants/leaveTypes';

const LeaveDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userRole = getRole();

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadLeaveDetail();
    }, [id]);

    const loadLeaveDetail = async () => {
        try {
            setLoading(true);
            const response = await getLeaveRequests();
            const leaveData = Array.isArray(response) ? response : response.data || [];

            // Tìm đơn nghỉ phép theo id
            const request = leaveData.find(r => String(r.leaveId || r.id) === String(id));

            if (request) {
                // Map data từ API sang format FE
                setSelectedRequest({
                    id: request.leaveId || request.id,
                    employeeId: request.employeeId,
                    employeeName: request.employeeName || request.fullName || 'N/A',
                    department: request.department || 'Chưa xác định',
                    type: request.leaveType || request.type,
                    startDate: request.startDate,
                    endDate: request.endDate,
                    days: request.days || request.totalDays || 1,
                    reason: request.reason || '',
                    status: (request.status || 'PENDING').toLowerCase(),
                    submittedDate: request.submittedDate || request.createdAt || new Date().toISOString(),
                    approvedBy: request.approvedBy,
                    rejectReason: request.rejectReason,
                });
            } else {
                toast.error('Không tìm thấy đơn nghỉ phép');
                navigate('/leaves');
            }
        } catch (error) {
            console.error('Error loading leave detail:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const canApproveRequest = (request) => {
        if (userRole === 'admin') return true;
        if (userRole === 'manager') return true;
        if (userRole === 'accountant') return false;
        return false;
    };

    const handleApprove = async () => {
        try {
            if (!selectedRequest) return;

            // Gọi API duyệt đơn
            await approveLeaveRequest(selectedRequest.id);

            // Log hành động duyệt đơn nghỉ phép
            logApproveLeave(selectedRequest.id, selectedRequest.employeeName || 'Unknown', selectedRequest.days || 0);

            toast.success('Đã duyệt đơn nghỉ phép thành công!');
            navigate('/leaves');
        } catch (error) {
            console.error('Error approving leave:', error);
            toast.error('Có lỗi xảy ra khi duyệt đơn');
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.warning('Vui lòng nhập lý do từ chối!');
            return;
        }

        try {
            if (!selectedRequest) return;

            // Gọi API từ chối đơn
            await rejectLeaveRequest(selectedRequest.id, rejectReason);

            // Log hành động từ chối đơn nghỉ phép
            logRejectLeave(selectedRequest.id, selectedRequest.employeeName || 'Unknown', rejectReason);

            setShowRejectModal(false);
            toast.success('Đã từ chối đơn nghỉ phép thành công!');
            navigate('/leaves');
        } catch (error) {
            console.error('Error rejecting leave:', error);
            toast.error('Có lỗi xảy ra khi từ chối đơn');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusName = (status) => {
        const statuses = {
            'approved': 'Đã duyệt',
            'pending': 'Chờ duyệt',
            'rejected': 'Từ chối',
            'cancelled': 'Đã hủy'
        };
        return statuses[status] || status;
    };


    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!selectedRequest) {
        return null;
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/leaves')}
                        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại danh sách</span>
                    </button>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
                            <h1 className="text-3xl font-bold">Chi tiết đơn nghỉ phép</h1>
                            <p className="text-blue-100 mt-2">Mã đơn: #{selectedRequest.id}</p>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            {/* Thông tin nhân viên */}
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                    {selectedRequest.employeeName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold text-gray-900">{selectedRequest.employeeName}</h2>
                                    <p className="text-gray-600">Mã NV: {selectedRequest.employeeId}</p>
                                    <p className="text-gray-600">Phòng ban: {selectedRequest.department || 'Chưa xác định'}</p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                                        {getStatusName(selectedRequest.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Chi tiết đơn */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <FileText className="w-5 h-5" />
                                        <span className="text-sm font-medium">Loại nghỉ</span>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-base font-medium ${getLeaveTypeColor(selectedRequest.type)}`}>
                                        {getLeaveTypeName(selectedRequest.type)}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <Clock className="w-5 h-5" />
                                        <span className="text-sm font-medium">Số ngày nghỉ</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{selectedRequest.days} ngày</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-sm font-medium">Ngày bắt đầu</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(selectedRequest.startDate).toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-sm font-medium">Ngày kết thúc</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(selectedRequest.endDate).toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Lý do nghỉ */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-600 mb-3">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="text-sm font-medium">Lý do nghỉ phép</span>
                                </div>
                                <p className="text-gray-900 text-lg leading-relaxed">{selectedRequest.reason}</p>
                            </div>

                            {/* Lý do từ chối (nếu bị từ chối) */}
                            {selectedRequest.status === 'rejected' && selectedRequest.rejectReason && (
                                <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                                    <div className="flex items-center gap-2 text-red-600 mb-3">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-sm font-semibold">Lý do từ chối</span>
                                    </div>
                                    <p className="text-red-800 text-lg">{selectedRequest.rejectReason}</p>
                                </div>
                            )}

                            {/* Thông tin bổ sung */}
                            <div className="flex items-center justify-between text-sm text-gray-600 pt-6 border-t-2 border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Ngày nộp đơn: <span className="font-medium">{new Date(selectedRequest.submittedDate).toLocaleDateString('vi-VN')}</span></span>
                                </div>
                                {selectedRequest.approvedBy && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Người duyệt: <span className="font-medium">{selectedRequest.approvedBy}</span></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-4 p-8 border-t-2 border-gray-200 bg-gray-50">
                            {selectedRequest.status === 'pending' && canApproveRequest(selectedRequest) ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={() => setShowRejectModal(true)}
                                        className="bg-red-100 text-red-700 hover:bg-red-200 border-red-300"
                                    >
                                        <AlertCircle className="w-5 h-5 mr-2" />
                                        Từ chối đơn
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="lg"
                                        onClick={handleApprove}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Duyệt đơn
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => navigate('/leaves')}
                                >
                                    Đóng
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal nhập lý do từ chối */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Từ chối đơn nghỉ phép</h3>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lý do từ chối <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Nhập lý do từ chối đơn nghỉ phép..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                    rows={4}
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                Lý do này sẽ được gửi đến nhân viên để họ biết tại sao đơn bị từ chối.
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default LeaveDetail;
