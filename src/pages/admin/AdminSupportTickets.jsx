import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Clock, CheckCircle, AlertCircle, Search,
  Filter, Send, User, Calendar, ChevronDown, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import fakeApi from '../../services/fakeApi';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fakeApi.getAllSupportTickets();
      if (res.success) {
        setTickets(res.data);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Không thể tải danh sách ticket');
    } finally {
      setLoading(false);
    }
  };

  const ticketCategories = [
    { value: 'profile-update', label: 'Cập nhật thông tin cá nhân' },
    { value: 'technical', label: 'Kỹ thuật / IT' },
    { value: 'payroll', label: 'Lương thưởng' },
    { value: 'leave', label: 'Nghỉ phép' },
    { value: 'benefits', label: 'Phúc lợi & Bảo hiểm' },
    { value: 'other', label: 'Khác' }
  ];

  const getCategoryLabel = (value) => {
    const cat = ticketCategories.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Mới';
      case 'in-progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await fakeApi.updateSupportTicket(ticketId, { status: newStatus });
      if (res.success) {
        setTickets(tickets.map(t =>
          t.id === ticketId ? { ...t, status: newStatus } : t
        ));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
        toast.success('Đã cập nhật trạng thái');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    try {
      const res = await fakeApi.respondToTicket(selectedTicket.id, {
        response: responseText,
        status: 'resolved'
      });

      if (res.success) {
        const updatedTicket = {
          ...selectedTicket,
          response: responseText,
          status: 'resolved'
        };
        setTickets(tickets.map(t =>
          t.id === selectedTicket.id ? updatedTicket : t
        ));
        setSelectedTicket(updatedTicket);
        setResponseText('');
        toast.success('Đã gửi phản hồi và đánh dấu hoàn thành');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu hỗ trợ</h1>
        <p className="text-gray-600 mt-1">Xem và xử lý các yêu cầu hỗ trợ từ nhân viên</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng ticket</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mới</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã giải quyết</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="open">Mới</option>
              <option value="in-progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {ticketCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Ticket List */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-bold">Không có ticket nào</p>
                <p className="text-sm mt-2">Chưa có yêu cầu hỗ trợ từ nhân viên</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? 'bg-purple-50 border-l-4 border-purple-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <User size={14} />
                          <span>{ticket.employeeName || 'Nhân viên'}</span>
                          <span>•</span>
                          <Calendar size={14} />
                          <span>{ticket.createdDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {getCategoryLabel(ticket.category)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        {selectedTicket && (
          <div className="w-[450px] bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Chi tiết ticket</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Ticket Info */}
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedTicket.subject}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {getStatusText(selectedTicket.status)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(selectedTicket.priority)}`}>
                    {getPriorityLabel(selectedTicket.priority)}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nhân viên:</span>
                  <span className="font-medium">{selectedTicket.employeeName || 'Không xác định'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Danh mục:</span>
                  <span className="font-medium">{getCategoryLabel(selectedTicket.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="font-medium">{selectedTicket.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật:</span>
                  <span className="font-medium">{selectedTicket.lastUpdate}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Nội dung yêu cầu:</h5>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Response (if exists) */}
              {selectedTicket.response && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Phản hồi của HR:</h5>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.response}</p>
                  </div>
                </div>
              )}

              {/* Status Actions */}
              {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Cập nhật trạng thái:</h5>
                  <div className="flex gap-2">
                    {selectedTicket.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'in-progress')}
                        className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                      >
                        Bắt đầu xử lý
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Đánh dấu hoàn thành
                    </button>
                  </div>
                </div>
              )}

              {/* Response Form */}
              {!selectedTicket.response && selectedTicket.status !== 'closed' && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Gửi phản hồi:</h5>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Nhập nội dung phản hồi cho nhân viên..."
                  />
                  <button
                    onClick={handleSendResponse}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Send size={18} />
                    Gửi phản hồi
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportTickets;
