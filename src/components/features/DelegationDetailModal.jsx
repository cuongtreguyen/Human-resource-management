import React from 'react';
import { X, Calendar, User, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const DelegationDetailModal = ({ delegation, isOpen, onClose }) => {
  if (!isOpen || !delegation) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'maternity': return 'text-purple-600 bg-purple-100';
      case 'annual': return 'text-blue-600 bg-blue-100';
      case 'sick': return 'text-red-600 bg-red-100';
      case 'emergency': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết bàn giao công việc</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Thông tin công việc</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công việc</label>
                <p className="text-gray-900 font-medium">{delegation.task.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(delegation.task.priority)}`}>
                  {delegation.task.priority}
                </span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú bàn giao</label>
                <p className="text-gray-600">{delegation.handoverNotes}</p>
              </div>
            </div>
          </div>

          {/* People Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Người giao */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center space-x-2">
                <User className="h-5 w-5 text-red-600" />
                <span>Người giao</span>
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">Tên</label>
                  <p className="text-red-900 font-medium">{delegation.originalAssignee.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">Chức vụ</label>
                  <p className="text-red-800">{delegation.originalAssignee.position}</p>
                </div>
              </div>
            </div>

            {/* Người nhận */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Người nhận</span>
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Tên</label>
                  <p className="text-blue-900 font-medium">{delegation.delegatedTo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Chức vụ</label>
                  <p className="text-blue-800">{delegation.delegatedTo.position}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Information */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Thông tin nghỉ phép</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Loại nghỉ phép</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(delegation.leaveRequest.type)}`}>
                  {delegation.leaveRequest.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Số ngày nghỉ</label>
                <p className="text-purple-900 font-medium">{delegation.leaveRequest.days} ngày</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Lý do nghỉ phép</label>
                <p className="text-purple-800">{delegation.leaveRequest.reason}</p>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-purple-700 mb-1">Thời gian nghỉ phép</label>
                <p className="text-purple-800">
                  Từ {new Date(delegation.leaveRequest.startDate).toLocaleDateString('vi-VN')} 
                  đến {new Date(delegation.leaveRequest.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Progress and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>Tiến độ công việc</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Tiến độ hiện tại</span>
                  <span className="text-lg font-bold text-green-900">{delegation.progress}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      delegation.progress >= 100 ? 'bg-green-500' :
                      delegation.progress >= 75 ? 'bg-blue-500' :
                      delegation.progress >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${delegation.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-green-700">
                  {delegation.progress === 0 && 'Chưa bắt đầu'}
                  {delegation.progress > 0 && delegation.progress < 100 && 'Đang thực hiện'}
                  {delegation.progress === 100 && 'Đã hoàn thành'}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-gray-600" />
                <span>Trạng thái</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái bàn giao</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delegation.status)}`}>
                    {delegation.status === 'active' && 'Đang thực hiện'}
                    {delegation.status === 'completed' && 'Hoàn thành'}
                    {delegation.status === 'pending' && 'Chờ xử lý'}
                    {delegation.status === 'overdue' && 'Quá hạn'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bàn giao</label>
                  <p className="text-gray-900">{new Date(delegation.delegatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            {delegation.status === 'active' && (
              <button
                onClick={() => {
                  const newProgress = prompt('Nhập tiến độ mới (0-100):', delegation.progress);
                  if (newProgress && !isNaN(newProgress)) {
                    // Handle progress update
                    alert('Cập nhật tiến độ thành công!');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cập nhật tiến độ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegationDetailModal;
