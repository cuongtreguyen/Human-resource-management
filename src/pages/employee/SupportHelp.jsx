import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText,
  Search, Send, Clock, CheckCircle, User, AlertCircle, Plus, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';

const EmployeeSupportHelp = () => {
  const userRole = getRole();

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
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    category: '',
    subject: '',
    description: ''
  });
  const [tickets, setTickets] = useState([]);

  // Load tickets khi component mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fakeApi.getSupportTickets();
      if (res.success) {
        setTickets(res.data);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqData = [
    {
      id: 1,
      category: 'HR',
      question: 'Làm thế nào để cập nhật thông tin cá nhân?',
      answer: 'Để cập nhật thông tin cá nhân (địa chỉ, số điện thoại, CCCD, v.v.), bạn cần tạo ticket hỗ trợ trong mục "Ticket hỗ trợ" với danh mục "Cập nhật thông tin cá nhân". Phòng Nhân sự sẽ xử lý trong 1-2 ngày làm việc.'
    },
    {
      id: 2,
      category: 'Technical',
      question: 'Làm thế nào để đổi mật khẩu?',
      answer: 'Hiện tại bạn cần liên hệ phòng IT để được hỗ trợ đổi mật khẩu. Tạo ticket với danh mục "Kỹ thuật" và mô tả yêu cầu đổi mật khẩu.'
    },
    {
      id: 3,
      category: 'Technical',
      question: 'Tại sao tôi không thể chấm công?',
      answer: 'Có thể do: 1) Kết nối internet không ổn định, 2) Camera không được cấp quyền, 3) Hệ thống đang bảo trì. Vui lòng thử lại sau hoặc tạo ticket hỗ trợ.'
    },
    {
      id: 4,
      category: 'Payroll',
      question: 'Khi nào tôi nhận được bảng lương?',
      answer: 'Bảng lương được phát hành vào ngày 25 hàng tháng. Bạn sẽ nhận được thông báo và có thể xem chi tiết trong mục "Bảng lương".'
    },
    {
      id: 5,
      category: 'Leave',
      question: 'Làm thế nào để xin nghỉ phép?',
      answer: 'Vào mục "Nghỉ phép" > "Tạo đơn mới". Điền đầy đủ thông tin và gửi. Quản lý sẽ xem xét và phản hồi trong vòng 2-3 ngày làm việc.'
    },
    {
      id: 6,
      category: 'Benefits',
      question: 'Tôi có những phúc lợi gì?',
      answer: 'Xem chi tiết trong mục "Phúc lợi & Bảo hiểm". Bạn được hưởng: BHXH, BHYT, BHTN (bắt buộc) và các phụ cấp như ăn trưa, xăng xe, thẻ gym (tùy điều kiện).'
    },
    {
      id: 7,
      category: 'HR',
      question: 'Làm thế nào để thêm người phụ thuộc vào BHYT?',
      answer: 'Vào mục "Phúc lợi & Bảo hiểm" > "Yêu cầu thay đổi" > Chọn "Thêm người phụ thuộc vào BHYT". Đính kèm giấy tờ cần thiết (giấy khai sinh, đăng ký kết hôn...).'
    }
  ];

  // Danh mục ticket
  const ticketCategories = [
    { value: 'profile-update', label: 'Cập nhật thông tin cá nhân', icon: User },
    { value: 'technical', label: 'Kỹ thuật / IT', icon: AlertCircle },
    { value: 'payroll', label: 'Lương thưởng', icon: FileText },
    { value: 'leave', label: 'Nghỉ phép', icon: Clock },
    { value: 'benefits', label: 'Phúc lợi & Bảo hiểm', icon: HelpCircle },
    { value: 'other', label: 'Khác', icon: MessageCircle }
  ];

  const filteredFaq = faqData.filter(faq => {
    return faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Trạng thái mới: pending → forwarded → processing → admin_resolved → notified
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
      case 'notified': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const getCategoryLabel = (value) => {
    const cat = ticketCategories.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!ticketForm.category || !ticketForm.subject || !ticketForm.description) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      setLoading(true);
      const res = await fakeApi.createSupportTicket({
        ...ticketForm,
        categoryLabel: getCategoryLabel(ticketForm.category)
      });

      if (res.success) {
        toast.success('Yêu cầu đã được gửi thành công! Manager sẽ xem xét và chuyển Admin xử lý.');
        setTickets([res.data, ...tickets]);
        setTicketForm({
          category: '',
          subject: '',
          description: ''
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 shadow-lg`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/employee"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Hỗ trợ & Trợ giúp</h1>
            <p className={getSubtitleColor()}>Tạo yêu cầu hỗ trợ hoặc tìm kiếm câu trả lời</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageCircle className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng ticket</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => ['open', 'pending', 'forwarded', 'processing', 'in-progress'].includes(t.status)).length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => ['resolved', 'notified', 'admin_resolved'].includes(t.status)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HelpCircle className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Câu hỏi FAQ</p>
                <p className="text-2xl font-bold text-gray-900">{faqData.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageCircle size={20} />
              Ticket hỗ trợ
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HelpCircle size={20} />
              Câu hỏi thường gặp
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Phone size={20} />
              Liên hệ trực tiếp
            </button>
          </div>
        </div>

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Nút tạo ticket và refresh */}
            {!showCreateForm && (
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Danh sách yêu cầu hỗ trợ</h3>
                <div className="flex gap-3">
                  
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Plus size={20} />
                    Tạo yêu cầu mới
                  </button>
                </div>
              </div>
            )}

            {/* Form tạo ticket */}
            {showCreateForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Tạo yêu cầu hỗ trợ mới</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-5">
                  {/* Chọn danh mục */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ticketCategories.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <label
                            key={cat.value}
                            className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              ticketForm.category === cat.value
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="category"
                              value={cat.value}
                              checked={ticketForm.category === cat.value}
                              onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                              className="sr-only"
                            />
                            <Icon size={20} className={ticketForm.category === cat.value ? 'text-purple-600' : 'text-gray-400'} />
                            <span className={`font-medium ${ticketForm.category === cat.value ? 'text-purple-700' : 'text-gray-700'}`}>
                              {cat.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mô tả ngắn gọn vấn đề của bạn"
                    />
                  </div>

                  {/* Mô tả chi tiết */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      rows="5"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Mô tả chi tiết vấn đề, thông tin cần cập nhật, hoặc yêu cầu của bạn..."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                    >
                      <Send size={18} />
                      {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Danh sách tickets */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {tickets.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-bold">Chưa có yêu cầu nào</p>
                  <p className="text-sm mt-2">Tạo yêu cầu hỗ trợ mới khi bạn cần giúp đỡ</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{ticket.subject}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {getCategoryLabel(ticket.category)} • Tạo ngày {ticket.createdDate || ticket.createdAt}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </div>

                      {ticket.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                      )}

                      {/* Phản hồi từ Manager */}
                      {ticket.managerNote && (
                        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <p className="text-sm text-purple-800">
                            <strong>Thông báo từ Manager:</strong> {ticket.managerNote}
                          </p>
                        </div>
                      )}

                      {/* Phản hồi từ Admin */}
                      {ticket.adminResponse && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Kết quả xử lý:</strong> {ticket.adminResponse}
                          </p>
                        </div>
                      )}

                      {ticket.response && !ticket.adminResponse && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Phản hồi:</strong> {ticket.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* Tìm kiếm */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Danh sách FAQ */}
            <div className="space-y-4">
              {filteredFaq.map(faq => (
                <div key={faq.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <HelpCircle className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{faq.question}</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredFaq.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Không tìm thấy câu hỏi phù hợp</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Hotline HR</h4>
                    <p className="text-lg text-blue-600 font-medium">024-1234-5678</p>
                    <p className="text-sm text-gray-500">8:00 - 17:30 (Thứ 2 - Thứ 6)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Mail className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email HR</h4>
                    <p className="text-lg text-green-600 font-medium">hr@company.com</p>
                    <p className="text-sm text-gray-500">Phản hồi trong 24h làm việc</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MessageCircle className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Chat nội bộ</h4>
                    <a href="/employee/chat" className="text-lg text-purple-600 font-medium hover:underline">
                      Mở Chat →
                    </a>
                    <p className="text-sm text-gray-500">Nhắn tin trực tiếp với HR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hướng dẫn */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quy trình xử lý yêu cầu</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2">1. Gửi yêu cầu</h4>
                  <p className="text-sm text-blue-700">
                    Tạo yêu cầu với đầy đủ thông tin. Yêu cầu sẽ được gửi đến Manager để xem xét.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <h4 className="font-bold text-purple-900 mb-2">2. Manager xem xét</h4>
                  <p className="text-sm text-purple-700">
                    Manager sẽ xem xét và chuyển yêu cầu lên Admin để xử lý.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h4 className="font-bold text-orange-900 mb-2">3. Admin xử lý</h4>
                  <p className="text-sm text-orange-700">
                    Admin sẽ xử lý yêu cầu và gửi kết quả về Manager.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-bold text-green-900 mb-2">4. Thông báo kết quả</h4>
                  <p className="text-sm text-green-700">
                    Manager sẽ thông báo kết quả xử lý cho bạn. Theo dõi trong tab "Ticket hỗ trợ".
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSupportHelp;
