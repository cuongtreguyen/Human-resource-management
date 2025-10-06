import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText, Search, Send, Clock, CheckCircle } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';

const EmployeeSupportHelp = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: ''
  });
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: 'Không thể đăng nhập vào hệ thống',
      category: 'Technical',
      priority: 'high',
      status: 'open',
      createdAt: '2024-02-15',
      updatedAt: '2024-02-15'
    },
    {
      id: 2,
      subject: 'Cập nhật thông tin cá nhân',
      category: 'General',
      priority: 'medium',
      status: 'in-progress',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-12'
    },
    {
      id: 3,
      subject: 'Vấn đề với bảng lương',
      category: 'Payroll',
      priority: 'high',
      status: 'resolved',
      createdAt: '2024-02-05',
      updatedAt: '2024-02-08'
    }
  ]);

  const faqData = [
    {
      id: 1,
      category: 'Technical',
      question: 'Làm thế nào để đổi mật khẩu?',
      answer: 'Bạn có thể đổi mật khẩu bằng cách vào trang Profile > Security Settings > Change Password. Nhập mật khẩu cũ và mật khẩu mới, sau đó nhấn Save.'
    },
    {
      id: 2,
      category: 'Technical',
      question: 'Tại sao tôi không thể chấm công?',
      answer: 'Có thể do một số nguyên nhân: 1) Kết nối internet không ổn định, 2) Camera không được cấp quyền, 3) Hệ thống đang bảo trì. Vui lòng thử lại sau hoặc liên hệ IT support.'
    },
    {
      id: 3,
      category: 'Payroll',
      question: 'Khi nào tôi nhận được bảng lương?',
      answer: 'Bảng lương được phát hành vào ngày 25 hàng tháng. Bạn sẽ nhận được thông báo qua email và có thể xem chi tiết trong mục Payroll.'
    },
    {
      id: 4,
      category: 'Leave',
      question: 'Làm thế nào để xin nghỉ phép?',
      answer: 'Bạn có thể xin nghỉ phép bằng cách vào mục Leave > Create Request. Điền đầy đủ thông tin và gửi yêu cầu. Quản lý sẽ xem xét và phản hồi trong vòng 2-3 ngày làm việc.'
    },
    {
      id: 5,
      category: 'General',
      question: 'Làm thế nào để cập nhật thông tin cá nhân?',
      answer: 'Bạn có thể cập nhật thông tin cá nhân trong mục Profile. Một số thông tin như ngày sinh, CMND cần liên hệ HR để thay đổi.'
    },
    {
      id: 6,
      category: 'Benefits',
      question: 'Tôi có những phúc lợi gì?',
      answer: 'Nhân viên được hưởng các phúc lợi: Bảo hiểm y tế, Bảo hiểm xã hội, Phụ cấp ăn trưa, Phụ cấp xăng xe, Thẻ gym. Chi tiết xem trong mục Benefits & Insurance.'
    }
  ];

  const categories = ['all', 'Technical', 'Payroll', 'Leave', 'General', 'Benefits'];
  
  const filteredFaq = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'faq' && (searchTerm === '' || matchesSearch);
    return matchesCategory;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'open': return 'Mới tạo';
      case 'in-progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    const newTicket = {
      id: tickets.length + 1,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTickets([newTicket, ...tickets]);
    setTicketForm({
      category: '',
      priority: 'medium',
      subject: '',
      description: ''
    });
    alert('Ticket đã được tạo thành công!');
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
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
            <p className="text-purple-100">Tìm kiếm câu trả lời hoặc liên hệ hỗ trợ</p>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <HelpCircle className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">FAQ</p>
                <p className="text-2xl font-bold text-gray-900">{faqData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ticket đã tạo</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang xử lý</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã giải quyết</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ticket hỗ trợ
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Liên hệ
            </button>
          </div>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* Tìm kiếm FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Danh sách FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Câu hỏi thường gặp</h3>
              <div className="space-y-4">
                {filteredFaq.map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{faq.question}</h4>
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Form tạo ticket */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo ticket hỗ trợ mới</h3>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Technical">Kỹ thuật</option>
                      <option value="Payroll">Lương thưởng</option>
                      <option value="Leave">Nghỉ phép</option>
                      <option value="General">Chung</option>
                      <option value="Benefits">Phúc lợi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mô tả ngắn gọn vấn đề"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Send size={16} />
                    Gửi ticket
                  </button>
                </div>
              </form>
            </div>

            {/* Danh sách tickets */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử tickets</h3>
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Danh mục: {ticket.category}</span>
                      <span>Tạo: {ticket.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Hotline hỗ trợ</h4>
                    <p className="text-sm text-gray-600">024-1234-5678</p>
                    <p className="text-xs text-gray-500">8:00 - 17:30 (Thứ 2 - Thứ 6)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email hỗ trợ</h4>
                    <p className="text-sm text-gray-600">support@company.com</p>
                    <p className="text-xs text-gray-500">Phản hồi trong 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Chat trực tuyến</h4>
                    <p className="text-sm text-gray-600">Có sẵn 24/7</p>
                    <p className="text-xs text-gray-500">Phản hồi tức thì</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn sử dụng</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Video hướng dẫn</h4>
                  <p className="text-sm text-blue-700">Xem các video hướng dẫn chi tiết về cách sử dụng hệ thống</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Xem ngay →
                  </button>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Tài liệu hướng dẫn</h4>
                  <p className="text-sm text-green-700">Tải về tài liệu hướng dẫn chi tiết</p>
                  <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                    Tải về →
                  </button>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">Đào tạo trực tiếp</h4>
                  <p className="text-sm text-purple-700">Đăng ký tham gia các buổi đào tạo trực tiếp</p>
                  <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Đăng ký →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSupportHelp;
