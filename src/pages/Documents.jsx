import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { getRole } from '../utils/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X, Eye, Download } from 'lucide-react';

const Documents = () => {
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

  const getAccentColor = () => {
    switch (userRole) {
      case 'admin':
        return { text: 'text-blue-600', bg: 'bg-blue-600', hover: 'hover:bg-blue-700', ring: 'focus:ring-blue-500', bgHover: 'hover:bg-blue-50' };
      case 'manager':
        return { text: 'text-purple-600', bg: 'bg-purple-600', hover: 'hover:bg-purple-700', ring: 'focus:ring-purple-500', bgHover: 'hover:bg-purple-50' };
      case 'accountant':
        return { text: 'text-emerald-600', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', ring: 'focus:ring-emerald-500', bgHover: 'hover:bg-emerald-50' };
      default:
        return { text: 'text-orange-600', bg: 'bg-orange-600', hover: 'hover:bg-orange-700', ring: 'focus:ring-orange-500', bgHover: 'hover:bg-orange-50' };
    }
  };

  const accentColor = getAccentColor();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả tài liệu', icon: '📁' },
    { id: 'contracts', name: 'Hợp đồng', icon: '📄' },
    { id: 'policies', name: 'Chính sách', icon: '📋' },
    { id: 'forms', name: 'Biểu mẫu', icon: '📝' },
    { id: 'certificates', name: 'Chứng chỉ', icon: '🏆' },
    { id: 'reports', name: 'Báo cáo', icon: '📊' }
  ];

  const mockDocuments = useMemo(() => [
    {
      id: 1,
      name: 'Mẫu Hợp Đồng Nhân Viên.pdf',
      category: 'contracts',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'Quản lý HR',
      downloads: 45
    },
    {
      id: 2,
      name: 'Sổ Tay Chính Sách Công Ty.pdf',
      category: 'policies',
      size: '5.8 MB',
      uploadDate: '2024-01-10',
      uploadedBy: 'Admin',
      downloads: 78
    },
    {
      id: 3,
      name: 'Đơn Xin Nghỉ Phép.docx',
      category: 'forms',
      size: '156 KB',
      uploadDate: '2024-01-08',
      uploadedBy: 'Đội HR',
      downloads: 123
    },
    {
      id: 4,
      name: 'Chứng Chỉ Đào Tạo.pdf',
      category: 'certificates',
      size: '1.2 MB',
      uploadDate: '2024-01-05',
      uploadedBy: 'Phòng Đào tạo',
      downloads: 34
    },
    {
      id: 5,
      name: 'Báo Cáo Tháng 01-2024.pdf',
      category: 'reports',
      size: '3.1 MB',
      uploadDate: '2024-01-01',
      uploadedBy: 'Quản lý',
      downloads: 56
    }
  ], []);

  useEffect(() => {
    setDocuments(mockDocuments);
  }, [mockDocuments]);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setLoading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newDocument = {
        id: Date.now(),
        name: uploadFile.name,
        category: 'contracts', // Default category
        size: `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User',
        downloads: 0
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setShowUploadModal(false);
      setUploadFile(null);
      setLoading(false);
      alert('Tải tài liệu lên thành công!');
    }, 2000);
  };

  // Tạo mẫu document content (fix cứng)
  const generateDocumentContent = (docName) => {
    const content = {
      'Mẫu Hợp Đồng Nhân Viên.pdf': `
HỢP ĐỒNG LAO ĐỘNG

Căn cứ Bộ luật Lao động Việt Nam;
Căn cứ nhu cầu và khả năng của các bên;

BÊN A: Công ty ABC
Địa chỉ: [Địa chỉ công ty]
Mã số thuế: [MST]

BÊN B: [Họ và tên nhân viên]
CMND/CCCD: [Số CMND]
Địa chỉ: [Địa chỉ]

Hai bên thỏa thuận ký kết hợp đồng lao động với các điều khoản sau:

Điều 1: Vị trí công việc
Bên B được nhận vào làm việc tại vị trí: [Vị trí]
Phòng ban: [Phòng ban]

Điều 2: Thời hạn hợp đồng
Từ ngày: [DD/MM/YYYY]
Đến ngày: [DD/MM/YYYY]

Điều 3: Mức lương
Lương cơ bản: [Số tiền] VNĐ/tháng
Các khoản phụ cấp: Theo quy định công ty

Điều 4: Quyền lợi và nghĩa vụ
- Tuân thủ nội quy công ty
- Được hưởng bảo hiểm đầy đủ
- Nghỉ phép theo quy định

Hai bên đã đọc, hiểu và đồng ý ký tên dưới đây.

Ngày [DD/MM/YYYY]

BÊN A                          BÊN B
[Chữ ký]                      [Chữ ký]
      `,
      'Sổ Tay Chính Sách Công Ty.pdf': `
SỔ TAY CHÍNH SÁCH CÔNG TY
Công ty ABC

PHẦN 1: GIỚI THIỆU
Công ty ABC là một tổ chức chuyên nghiệp, cam kết tạo môi trường làm việc tốt nhất cho nhân viên.

PHẦN 2: QUY ĐỊNH CHUNG
1. Giờ làm việc: 8:00 - 17:00 (Nghỉ trưa 12:00 - 13:00)
2. Nghỉ phép: 12 ngày/năm
3. Nghỉ ốm: Theo quy định pháp luật
4. Nghỉ thai sản: 6 tháng

PHẦN 3: QUYỀN LỢI
- Lương thưởng cạnh tranh
- Bảo hiểm đầy đủ (BHXH, BHYT, BHTN)
- Phúc lợi: Ăn trưa, xăng xe, gym
- Đào tạo và phát triển

PHẦN 4: NGHĨA VỤ
- Tuân thủ nội quy
- Hoàn thành công việc đúng hạn
- Bảo mật thông tin công ty

Ban hành: 10/01/2024
      `,
      'Đơn Xin Nghỉ Phép.docx': `
ĐƠN XIN NGHỈ PHÉP

Kính gửi: Ban Giám đốc / Quản lý trực tiếp

Tôi tên là: [Họ và tên]
Mã nhân viên: [Mã NV]
Phòng ban: [Phòng ban]
Chức vụ: [Chức vụ]

Tôi viết đơn này để xin nghỉ phép từ ngày [DD/MM/YYYY] đến ngày [DD/MM/YYYY]
Tổng số ngày nghỉ: [Số ngày] ngày
Lý do: [Lý do nghỉ phép]

Tôi cam kết:
- Hoàn thành công việc trước khi nghỉ
- Bàn giao công việc cho đồng nghiệp
- Quay lại làm việc đúng hạn

Xin cảm ơn!

Ngày [DD/MM/YYYY]
Người làm đơn
[Chữ ký]
      `,
      'Chứng Chỉ Đào Tạo.pdf': `
CHỨNG CHỈ ĐÀO TẠO

Công ty ABC xác nhận:

Ông/Bà: [Họ và tên]
Mã nhân viên: [Mã NV]
Phòng ban: [Phòng ban]

Đã hoàn thành khóa đào tạo:
Tên khóa học: [Tên khóa học]
Thời gian: Từ [DD/MM/YYYY] đến [DD/MM/YYYY]
Số giờ: [Số giờ] giờ
Kết quả: [Đạt/Không đạt]

Chứng chỉ này có giá trị trong hệ thống đào tạo nội bộ của công ty.

Ngày cấp: [DD/MM/YYYY]

Giám đốc Đào tạo
[Chữ ký]
      `,
      'Báo Cáo Tháng 01-2024.pdf': `
BÁO CÁO THÁNG 01/2024
Phòng ban: [Phòng ban]

I. TỔNG QUAN
- Tổng số nhân viên: [Số lượng]
- Nhân viên mới: [Số lượng]
- Nhân viên nghỉ việc: [Số lượng]

II. HOẠT ĐỘNG
1. Dự án hoàn thành: [Số lượng]
2. Dự án đang thực hiện: [Số lượng]
3. Tỷ lệ hoàn thành: [%]

III. TÀI CHÍNH
- Ngân sách: [Số tiền] VNĐ
- Chi phí: [Số tiền] VNĐ
- Còn lại: [Số tiền] VNĐ

IV. ĐÁNH GIÁ
- Điểm mạnh: [Nội dung]
- Điểm cần cải thiện: [Nội dung]

Ngày báo cáo: 01/02/2024
Người báo cáo: [Họ và tên]
      `
    };
    return content[docName] || 'Nội dung tài liệu';
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

  const [previewDoc, setPreviewDoc] = useState(null);

  const downloadDocument = (document) => {
    try {
      const content = generateDocumentContent(document.name);
      const extension = document.name.split('.').pop().toLowerCase();
      const mimeType = extension === 'pdf' 
        ? 'application/pdf' 
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      createDownloadFile(content, document.name, mimeType);
      toast.success(`Đang tải xuống ${document.name}`);
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Không thể tải xuống tài liệu');
    }
  };

  const handleView = (document) => {
    const content = generateDocumentContent(document.name);
    setPreviewDoc({ ...document, content });
  };

  const closePreview = () => {
    setPreviewDoc(null);
  };

  const deleteDocument = (documentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      alert('Đã xóa tài liệu thành công!');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📋';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📁';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      contracts: 'bg-blue-100 text-blue-800',
      policies: 'bg-green-100 text-green-800',
      forms: 'bg-yellow-100 text-yellow-800',
      certificates: 'bg-purple-100 text-purple-800',
      reports: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} text-white px-6 py-6 rounded-lg mx-6 mt-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Quản Lý Tài Liệu</h1>
              <p className={`${getSubtitleColor()} mt-1`}>Trang chủ / Tài liệu</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`bg-white ${accentColor.text} px-4 py-2 rounded-lg ${accentColor.bgHover} flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tải Lên Tài Liệu</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 ${accentColor.ring}`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 ${accentColor.ring}`}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh Mục</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? `${accentColor.bg} text-white`
                      : `bg-white text-gray-600 ${accentColor.bgHover} border border-gray-200`
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(document => (
              <div 
                key={document.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getFileIcon(document.name)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm truncate max-w-40">
                        {document.name}
                      </h3>
                      <p className="text-gray-500 text-xs">{document.size}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => downloadDocument(document)}
                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteDocument(document.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                      {document.category}
                    </span>
                    <span className="text-gray-400 text-xs">{document.downloads} lượt tải</span>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    <p>Ngày tải: {document.uploadDate}</p>
                    <p>Người tải: {document.uploadedBy}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => downloadDocument(document)}
                    className={`flex-1 px-3 py-2 ${accentColor.bg} text-white rounded-lg ${accentColor.hover} transition-all duration-200 text-sm flex items-center justify-center gap-2`}
                  >
                    <Download size={16} />
                    Tải xuống
                  </button>
                  <button
                    onClick={() => handleView(document)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Xem
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Tải Lên Tài Liệu</h2>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleFileUpload} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn Tệp</label>
                    <input
                      type="file"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none ${accentColor.ring} focus:border-gray-300 text-gray-900`}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                    <select
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none ${accentColor.ring} focus:border-gray-300 text-gray-900`}
                    >
                      <option value="contracts">Hợp đồng</option>
                      <option value="policies">Chính sách</option>
                      <option value="forms">Biểu mẫu</option>
                      <option value="certificates">Chứng chỉ</option>
                      <option value="reports">Báo cáo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !uploadFile}
                      className={`px-4 py-2 ${accentColor.bg} text-white rounded-md ${accentColor.hover} disabled:opacity-50 transition-all duration-200`}
                    >
                      {loading ? 'Đang tải...' : 'Tải lên'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Preview Modal */}
          {previewDoc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getFileIcon(previewDoc.name)}</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{previewDoc.name}</h2>
                      <p className="text-sm text-gray-500">{previewDoc.category} • {previewDoc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadDocument(previewDoc)}
                      className={`px-4 py-2 ${accentColor.bg} text-white rounded-lg ${accentColor.hover} transition-colors flex items-center gap-2`}
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
    </Layout>
  );
};

export default Documents;
