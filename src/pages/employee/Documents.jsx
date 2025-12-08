import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, Search, Filter, File, X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Tạo mẫu document content (fix cứng)
const generateDocumentContent = (docName, type) => {
  if (type === 'PDF') {
    // Tạo PDF content đơn giản (dạng text có thể convert sang PDF)
    const content = {
      'Quy chế công ty.pdf': `
QUY CHẾ CÔNG TY
Công ty ABC

Điều 1: Tổng quan
Công ty ABC được thành lập với mục tiêu phát triển bền vững và tạo môi trường làm việc chuyên nghiệp.

Điều 2: Quy định chung
- Nhân viên phải tuân thủ giờ làm việc từ 8:00 - 17:00
- Nghỉ trưa: 12:00 - 13:00
- Nghỉ phép: Theo quy định của pháp luật

Điều 3: Quyền lợi
- Lương thưởng theo năng lực
- Bảo hiểm đầy đủ
- Phúc lợi công ty

Ban hành ngày: 15/01/2025
      `,
      'Hướng dẫn chấm công.pdf': `
HƯỚNG DẪN CHẤM CÔNG
Công ty ABC

1. Cách chấm công:
   - Chấm công vào: 8:00 sáng
   - Chấm công ra: 17:00 chiều
   - Quá 15 phút sẽ bị tính là đi muộn

2. Chấm công từ xa:
   - Sử dụng hệ thống chấm công khuôn mặt
   - Đảm bảo kết nối internet ổn định

3. Xử lý sự cố:
   - Liên hệ HR nếu có vấn đề
   - Email: hr@company.com

Ban hành ngày: 05/01/2025
      `,
      'Quy trình làm việc từ xa.pdf': `
QUY TRÌNH LÀM VIỆC TỪ XA
Công ty ABC

1. Đăng ký làm việc từ xa:
   - Gửi đơn xin phép trước 3 ngày
   - Được quản lý phê duyệt

2. Yêu cầu:
   - Máy tính có webcam
   - Kết nối internet ổn định
   - Tham gia đầy đủ các cuộc họp online

3. Báo cáo:
   - Báo cáo công việc hàng ngày
   - Gửi qua email hoặc hệ thống

Ban hành ngày: 20/12/2024
      `,
      'Chính sách bảo mật.pdf': `
CHÍNH SÁCH BẢO MẬT
Công ty ABC

1. Bảo mật thông tin:
   - Không chia sẻ thông tin công ty ra ngoài
   - Bảo mật mật khẩu tài khoản
   - Không sử dụng USB cá nhân

2. Quy định:
   - Mọi thông tin đều được mã hóa
   - Backup dữ liệu định kỳ
   - Kiểm tra bảo mật hàng tháng

3. Vi phạm:
   - Cảnh cáo lần 1
   - Kỷ luật lần 2
   - Chấm dứt hợp đồng lần 3

Ban hành ngày: 15/12/2024
      `
    };
    return content[docName] || 'Nội dung tài liệu';
  } else {
    // DOCX content
    const content = {
      'Mẫu đơn xin nghỉ phép.docx': `
ĐƠN XIN NGHỈ PHÉP

Kính gửi: Ban Giám đốc / Quản lý trực tiếp

Tôi tên là: [Họ và tên]
Mã nhân viên: [Mã NV]
Phòng ban: [Phòng ban]

Tôi viết đơn này để xin nghỉ phép từ ngày [DD/MM/YYYY] đến ngày [DD/MM/YYYY]
Lý do: [Lý do nghỉ phép]

Tôi cam kết hoàn thành công việc trước khi nghỉ và sẽ bàn giao cho đồng nghiệp.

Xin cảm ơn!

Ngày [DD/MM/YYYY]
Người làm đơn
[Chữ ký]
      `,
      'Mẫu đề xuất công việc.docx': `
MẪU ĐỀ XUẤT CÔNG VIỆC

Người đề xuất: [Họ và tên]
Mã nhân viên: [Mã NV]
Phòng ban: [Phòng ban]
Ngày đề xuất: [DD/MM/YYYY]

1. Tên đề xuất:
   [Tên đề xuất]

2. Mô tả:
   [Mô tả chi tiết đề xuất]

3. Lợi ích:
   - [Lợi ích 1]
   - [Lợi ích 2]
   - [Lợi ích 3]

4. Ngân sách dự kiến:
   [Số tiền]

5. Thời gian thực hiện:
   [Thời gian]

Xin cảm ơn!
      `
    };
    return content[docName] || 'Nội dung tài liệu';
  }
};

// Tạo file download
const createDownloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const docs = [
  { id: 1, name: 'Quy chế công ty.pdf', type: 'PDF', size: '1.2MB', category: 'Quy định', date: '15/01/2025' },
  { id: 2, name: 'Mẫu đơn xin nghỉ phép.docx', type: 'DOCX', size: '120KB', category: 'Biểu mẫu', date: '10/01/2025' },
  { id: 3, name: 'Hướng dẫn chấm công.pdf', type: 'PDF', size: '900KB', category: 'Hướng dẫn', date: '05/01/2025' },
  { id: 4, name: 'Quy trình làm việc từ xa.pdf', type: 'PDF', size: '750KB', category: 'Quy định', date: '20/12/2024' },
  { id: 5, name: 'Mẫu đề xuất công việc.docx', type: 'DOCX', size: '95KB', category: 'Biểu mẫu', date: '18/12/2024' },
  { id: 6, name: 'Chính sách bảo mật.pdf', type: 'PDF', size: '1.5MB', category: 'Quy định', date: '15/12/2024' }
];

const EmployeeDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);

  const categories = ['all', 'Quy định', 'Biểu mẫu', 'Hướng dẫn'];

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    return type === 'PDF' ? '📄' : '📝';
  };

  const handleDownload = (doc) => {
    try {
      const content = generateDocumentContent(doc.name, doc.type);
      const mimeType = doc.type === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      // Tạo file và download
      createDownloadFile(content, doc.name, mimeType);
      toast.success(`Đang tải xuống ${doc.name}`);
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Không thể tải xuống tài liệu');
    }
  };

  const handleView = (doc) => {
    const content = generateDocumentContent(doc.name, doc.type);
    setPreviewDoc({ ...doc, content });
  };

  const closePreview = () => {
    setPreviewDoc(null);
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-2xl shadow-lg">
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
            <h1 className="text-3xl font-bold mb-2">Tài liệu</h1>
            <p className="text-orange-100">Văn bản, quy định và biểu mẫu dành cho nhân viên</p>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tài liệu</p>
                <p className="text-2xl font-bold text-gray-900">{docs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <File className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quy định</p>
                <p className="text-2xl font-bold text-gray-900">{docs.filter(d => d.category === 'Quy định').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Biểu mẫu</p>
                <p className="text-2xl font-bold text-gray-900">{docs.filter(d => d.category === 'Biểu mẫu').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tìm kiếm và Lọc */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${selectedCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Danh sách tài liệu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(d => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{getFileIcon(d.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 mb-1 truncate">{d.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">{d.type}</span>
                    <span>{d.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded font-medium">{d.category}</span>
                <span>{d.date}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleView(d)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Eye size={16} />
                  Xem
                </button>
                <button 
                  onClick={() => handleDownload(d)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
                >
                  <Download size={16} />
                  Tải
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-3 py-12 text-center text-gray-500">
              Không tìm thấy tài liệu nào
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getFileIcon(previewDoc.type)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{previewDoc.name}</h2>
                    <p className="text-sm text-gray-500">{previewDoc.category} • {previewDoc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    Tải xuống
                  </button>
                  <button
                    onClick={closePreview}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {previewDoc.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDocuments;
