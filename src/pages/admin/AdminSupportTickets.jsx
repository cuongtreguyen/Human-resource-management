import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Clock, CheckCircle, AlertCircle, Search,
  Send, User, Calendar, X, ArrowUpRight, Bell
} from 'lucide-react';
import { toast } from 'react-toastify';
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';

const AdminSupportTickets = () => {
  const userRole = getRole();
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  // Màu sắc theo role
  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'manager':
        return 'from-purple-600 to-purple-700';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-100';
      case 'manager':
        return 'text-purple-100';
      case 'accountant':
        return 'text-emerald-100';
      default:
        return 'text-orange-100';
    }
  };
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [managerNote, setManagerNote] = useState(''); // Note khi Manager thông báo cho NV
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

  // Trạng thái mới cho flow: pending → forwarded → processing → admin_resolved → notified
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'forwarded': return 'bg-purple-100 text-purple-700';
      case 'in-progress':
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'admin_resolved': return 'bg-orange-100 text-orange-700';
      case 'resolved':
      case 'notified': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
      case 'pending': return 'Chờ xử lý';
      case 'forwarded': return 'Đã chuyển Admin';
      case 'in-progress':
      case 'processing': return 'Admin đang xử lý';
      case 'admin_resolved': return 'Admin đã xử lý';
      case 'resolved':
      case 'notified': return 'Đã thông báo NV';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  // Manager: Chuyển yêu cầu lên Admin
  const handleForwardToAdmin = async (ticketId) => {
    try {
      const res = await fakeApi.updateSupportTicket(ticketId, { status: 'forwarded' });
      if (res.success) {
        setTickets(tickets.map(t =>
          t.id === ticketId ? { ...t, status: 'forwarded' } : t
        ));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: 'forwarded' });
        }
        toast.success('Đã chuyển yêu cầu lên Admin');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Manager: Thông báo kết quả cho nhân viên
  const handleNotifyEmployee = async () => {
    try {
      const res = await fakeApi.updateSupportTicket(selectedTicket.id, {
        status: 'notified',
        managerNote: managerNote
      });

      if (res.success) {
        const updatedTicket = {
          ...selectedTicket,
          status: 'notified',
          managerNote: managerNote
        };
        setTickets(tickets.map(t =>
          t.id === selectedTicket.id ? updatedTicket : t
        ));
        setSelectedTicket(updatedTicket);
        setManagerNote('');
        toast.success('Đã thông báo kết quả cho nhân viên');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Admin: Bắt đầu xử lý
  const handleStartProcessing = async (ticketId) => {
    try {
      const res = await fakeApi.updateSupportTicket(ticketId, { status: 'processing' });
      if (res.success) {
        setTickets(tickets.map(t =>
          t.id === ticketId ? { ...t, status: 'processing' } : t
        ));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: 'processing' });
        }
        toast.success('Đã bắt đầu xử lý yêu cầu');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Admin: Gửi phản hồi và hoàn thành
  const handleAdminResolve = async () => {
    if (!responseText.trim()) {
      toast.error('Vui lòng nhập nội dung xử lý');
      return;
    }

    try {
      const res = await fakeApi.respondToTicket(selectedTicket.id, {
        adminResponse: responseText,
        status: 'admin_resolved'
      });

      if (res.success) {
        const updatedTicket = {
          ...selectedTicket,
          adminResponse: responseText,
          status: 'admin_resolved'
        };
        setTickets(tickets.map(t =>
          t.id === selectedTicket.id ? updatedTicket : t
        ));
        setSelectedTicket(updatedTicket);
        setResponseText('');
        toast.success('Đã xử lý xong và gửi về Manager');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Lọc tickets theo role
  // Manager: Chỉ thấy pending (cần chuyển), admin_resolved (cần thông báo), notified (lịch sử)
  // Admin: Chỉ thấy forwarded (cần xử lý), processing (đang làm), admin_resolved (đã xong)
  const filteredTickets = tickets.filter(ticket => {
    // Lọc theo role trước
    let matchRole = true;
    if (isManager) {
      matchRole = ['pending', 'open', 'admin_resolved', 'notified', 'resolved'].includes(ticket.status);
    } else if (isAdmin) {
      matchRole = ['forwarded', 'processing', 'in-progress', 'admin_resolved'].includes(ticket.status);
    }

    const matchStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchStatus && matchCategory && matchSearch;
  });

  // Stats theo role - chỉ đếm những tickets mà role có thể thấy
  const roleTickets = tickets.filter(t => {
    if (isManager) return ['pending', 'open', 'admin_resolved', 'notified', 'resolved'].includes(t.status);
    if (isAdmin) return ['forwarded', 'processing', 'in-progress', 'admin_resolved'].includes(t.status);
    return true;
  });

  const stats = {
    total: roleTickets.length,
    pending: tickets.filter(t => t.status === 'open' || t.status === 'pending').length,
    forwarded: tickets.filter(t => t.status === 'forwarded').length,
    processing: tickets.filter(t => t.status === 'in-progress' || t.status === 'processing').length,
    adminResolved: tickets.filter(t => t.status === 'admin_resolved').length,
    notified: tickets.filter(t => t.status === 'resolved' || t.status === 'notified').length
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
      <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-xl shadow-lg mb-6`}>
        <h1 className="text-2xl font-bold">Quản lý yêu cầu hỗ trợ</h1>
        <p className={`${getSubtitleColor()} mt-1`}>
          {isAdmin ? 'Xử lý các yêu cầu được Manager chuyển lên' : 'Xem và chuyển yêu cầu lên Admin xử lý'}
        </p>
      </div>

      {/* Stats - Phân theo role */}
      <div className={`grid grid-cols-1 ${isManager ? 'md:grid-cols-4' : 'md:grid-cols-4'} gap-4 mb-6`}>
        {/* Card Tổng - Cả 2 role đều thấy */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MessageCircle className="text-gray-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng yêu cầu</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* MANAGER: Chờ xử lý (pending) - cần chuyển lên Admin */}
        {isManager && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cần chuyển Admin</p>
                <p className="text-xl font-bold text-blue-600">{stats.pending}</p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: Cần xử lý (forwarded) - Manager chuyển lên */}
        {isAdmin && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowUpRight className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cần xử lý</p>
                <p className="text-xl font-bold text-purple-600">{stats.forwarded}</p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: Đang xử lý (processing) */}
        {isAdmin && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Đang xử lý</p>
                <p className="text-xl font-bold text-yellow-600">{stats.processing}</p>
              </div>
            </div>
          </div>
        )}

        {/* MANAGER: Admin đã xử lý (admin_resolved) - cần thông báo NV */}
        {isManager && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cần thông báo NV</p>
                <p className="text-xl font-bold text-orange-600">{stats.adminResolved}</p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: Đã xử lý xong (admin_resolved) */}
        {isAdmin && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Đã xử lý xong</p>
                <p className="text-xl font-bold text-green-600">{stats.adminResolved}</p>
              </div>
            </div>
          </div>
        )}

        {/* MANAGER: Hoàn thành (notified) */}
        {isManager && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Đã hoàn thành</p>
                <p className="text-xl font-bold text-green-600">{stats.notified}</p>
              </div>
            </div>
          </div>
        )}
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
              {/* Manager: Xem pending để chuyển Admin, xem admin_resolved để thông báo NV */}
              {isManager && (
                <>
                  <option value="pending">Chờ xử lý (cần chuyển Admin)</option>
                  <option value="admin_resolved">Admin đã xử lý (cần thông báo NV)</option>
                  <option value="notified">Đã hoàn thành</option>
                </>
              )}
              {/* Admin: Xem forwarded để xử lý, processing đang làm, admin_resolved đã xong */}
              {isAdmin && (
                <>
                  <option value="forwarded">Cần xử lý (Manager chuyển lên)</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="admin_resolved">Đã xử lý xong</option>
                </>
              )}
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
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
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
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                  {getStatusText(selectedTicket.status)}
                </span>
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
              </div>

              {/* Description */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Nội dung yêu cầu:</h5>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Admin Response (if exists) */}
              {selectedTicket.adminResponse && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Kết quả xử lý từ Admin:</h5>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.adminResponse}</p>
                  </div>
                </div>
              )}

              {/* Manager Note (if exists) */}
              {selectedTicket.managerNote && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Thông báo từ Manager:</h5>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.managerNote}</p>
                  </div>
                </div>
              )}

              {/* === MANAGER ACTIONS === */}
              {isManager && (
                <>
                  {/* Manager: Chuyển lên Admin (khi pending/open) */}
                  {(selectedTicket.status === 'open' || selectedTicket.status === 'pending') && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Hành động:</h5>
                      <button
                        onClick={() => handleForwardToAdmin(selectedTicket.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        <ArrowUpRight size={18} />
                        Chuyển lên Admin xử lý
                      </button>
                    </div>
                  )}

                  {/* Manager: Thông báo cho nhân viên (sau khi Admin xử lý xong) */}
                  {selectedTicket.status === 'admin_resolved' && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Thông báo cho nhân viên:</h5>
                      <textarea
                        value={managerNote}
                        onChange={(e) => setManagerNote(e.target.value)}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Nhập nội dung thông báo cho nhân viên..."
                      />
                      <button
                        onClick={handleNotifyEmployee}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Bell size={18} />
                        Thông báo cho nhân viên
                      </button>
                    </div>
                  )}

                  {/* Manager: Đang chờ Admin xử lý */}
                  {(selectedTicket.status === 'forwarded' || selectedTicket.status === 'processing') && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 text-center">
                        <Clock className="inline w-4 h-4 mr-1" />
                        Đang chờ Admin xử lý...
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* === ADMIN ACTIONS === */}
              {isAdmin && (
                <>
                  {/* Admin: Bắt đầu xử lý (khi forwarded) */}
                  {selectedTicket.status === 'forwarded' && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Hành động:</h5>
                      <button
                        onClick={() => handleStartProcessing(selectedTicket.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                      >
                        <Clock size={18} />
                        Bắt đầu xử lý
                      </button>
                    </div>
                  )}

                  {/* Admin: Gửi kết quả xử lý */}
                  {(selectedTicket.status === 'processing' || selectedTicket.status === 'forwarded') && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Kết quả xử lý:</h5>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Nhập kết quả xử lý yêu cầu..."
                      />
                      <button
                        onClick={handleAdminResolve}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Send size={18} />
                        Hoàn thành & Gửi về Manager
                      </button>
                    </div>
                  )}

                  {/* Admin: Đã xử lý xong, chờ Manager thông báo */}
                  {selectedTicket.status === 'admin_resolved' && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800 text-center">
                        <CheckCircle className="inline w-4 h-4 mr-1" />
                        Đã xử lý xong. Chờ Manager thông báo cho nhân viên.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Hoàn thành */}
              {(selectedTicket.status === 'notified' || selectedTicket.status === 'resolved') && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 text-center">
                    <CheckCircle className="inline w-4 h-4 mr-1" />
                    Yêu cầu đã được xử lý và thông báo cho nhân viên.
                  </p>
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
