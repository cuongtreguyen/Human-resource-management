import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, Search, Filter, File, X } from 'lucide-react';

// Nội dung tài liệu mẫu
const documentContents = {
  1: {
    title: 'QUY CHẾ CÔNG TY ABC',
    content: `
CHƯƠNG I: QUY ĐỊNH CHUNG

Điều 1. Phạm vi áp dụng
Quy chế này áp dụng cho toàn thể cán bộ, nhân viên đang làm việc tại Công ty ABC.

Điều 2. Giờ làm việc
- Thời gian làm việc: Từ 8:00 đến 17:30, từ Thứ Hai đến Thứ Sáu
- Nghỉ trưa: Từ 12:00 đến 13:30
- Tổng số giờ làm việc: 40 giờ/tuần

CHƯƠNG II: QUY ĐỊNH VỀ CHẤM CÔNG

Điều 3. Hình thức chấm công
- Nhân viên phải chấm công bằng hệ thống nhận diện khuôn mặt
- Chấm công khi đến và khi ra về

Điều 4. Đi trễ, về sớm
- Đi trễ quá 15 phút mà không có lý do: Trừ 0.5 ngày công
- Về sớm quá 30 phút: Trừ 0.5 ngày công

CHƯƠNG III: CHẾ ĐỘ NGHỈ PHÉP

Điều 5. Nghỉ phép năm
- Nhân viên có 12 ngày phép/năm
- Thâm niên 5 năm: +1 ngày phép
- Thâm niên 10 năm: +2 ngày phép

Điều 6. Nghỉ ốm
- Có giấy xác nhận của bác sĩ
- Tối đa 30 ngày/năm có lương

CHƯƠNG IV: ĐIỀU KHOẢN THI HÀNH

Quy chế này có hiệu lực từ ngày 01/01/2025.
Mọi quy định trước đây trái với quy chế này đều bị bãi bỏ.

                                        GIÁM ĐỐC
                                      (Đã ký)
                                    Nguyễn Văn A
    `
  },
  2: {
    title: 'ĐƠN XIN NGHỈ PHÉP',
    content: `
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        Độc lập - Tự do - Hạnh phúc
                              ---------------

                        ĐƠN XIN NGHỈ PHÉP

Kính gửi: - Ban Giám đốc Công ty ABC
          - Phòng Nhân sự
          - Trưởng phòng/Quản lý trực tiếp

Tên tôi là: ................................................................
Chức vụ: ...................................................................
Phòng/Ban: .................................................................
Mã nhân viên: ..............................................................

Nay tôi làm đơn này kính xin Ban Giám đốc cho phép tôi được nghỉ phép:

Từ ngày: ...../...../20.....  đến ngày: ...../...../20.....
Tổng số ngày nghỉ: ......... ngày

Lý do xin nghỉ:
...............................................................................
...............................................................................
...............................................................................

Trong thời gian nghỉ, công việc sẽ được bàn giao cho:
Họ tên: ....................................................................
Chức vụ: ...................................................................

Tôi xin cam kết hoàn thành đầy đủ công việc trước khi nghỉ phép.

Kính mong Ban Giám đốc xem xét và chấp thuận.

                                        TP.HCM, ngày ..... tháng ..... năm 20....
    Ý kiến của Trưởng phòng              Người làm đơn
                                              (Ký, ghi rõ họ tên)




...................................      ...................................
    `
  },
  3: {
    title: 'HƯỚNG DẪN CHẤM CÔNG',
    content: `
                    HƯỚNG DẪN SỬ DỤNG HỆ THỐNG CHẤM CÔNG
                         NHẬN DIỆN KHUÔN MẶT

1. GIỚI THIỆU
Hệ thống chấm công nhận diện khuôn mặt được triển khai nhằm đảm bảo
tính chính xác và minh bạch trong việc quản lý thời gian làm việc.

2. CÁCH SỬ DỤNG

Bước 1: Đứng trước máy chấm công
- Khoảng cách: 30-50cm
- Nhìn thẳng vào camera

Bước 2: Chờ hệ thống nhận diện
- Thời gian nhận diện: 1-3 giây
- Màn hình hiển thị kết quả

Bước 3: Xác nhận chấm công
- Xanh: Chấm công thành công
- Đỏ: Thất bại, thử lại

3. LƯU Ý QUAN TRỌNG

✓ Không đeo khẩu trang khi chấm công
✓ Tháo kính râm
✓ Đảm bảo đủ ánh sáng
✓ Không để tóc che mặt

4. XỬ LÝ SỰ CỐ

Nếu không chấm công được:
- Liên hệ IT Support: 1900-xxxx
- Hoặc email: it@company.com

5. QUY ĐỊNH

- Chấm công IN: Trước 8:15
- Chấm công OUT: Sau 17:30
- Quên chấm công: Báo HR trong 24h

                                    Phòng Nhân sự
    `
  },
  4: {
    title: 'QUY TRÌNH LÀM VIỆC TỪ XA',
    content: `
                    QUY TRÌNH LÀM VIỆC TỪ XA (REMOTE WORK)

1. ĐIỀU KIỆN ÁP DỤNG

Nhân viên được làm việc từ xa khi:
- Đã qua thời gian thử việc
- Được sự đồng ý của Quản lý trực tiếp
- Có đầy đủ thiết bị làm việc

2. QUY TRÌNH ĐĂNG KÝ

Bước 1: Gửi đơn đăng ký
- Trước 3 ngày làm việc
- Qua hệ thống HR Portal

Bước 2: Chờ phê duyệt
- Quản lý trực tiếp: 24h
- Phòng HR: 24h

3. YÊU CẦU KỸ THUẬT

- Internet: Tối thiểu 10Mbps
- Máy tính có camera, micro
- Cài đặt phần mềm: Teams, VPN

4. QUY ĐỊNH THỜI GIAN

- Giờ làm việc: 8:00 - 17:30
- Online trên Teams trong giờ hành chính
- Tham gia đầy đủ các cuộc họp

5. BÁO CÁO CÔNG VIỆC

- Báo cáo cuối ngày qua email
- Check-in đầu ngày với team
- Weekly report vào thứ Sáu

6. BẢO MẬT THÔNG TIN

- Không làm việc ở nơi công cộng
- Sử dụng VPN công ty
- Không lưu dữ liệu trên thiết bị cá nhân

                                    Ban Giám đốc
    `
  },
  5: {
    title: 'MẪU ĐỀ XUẤT CÔNG VIỆC',
    content: `
                        PHIẾU ĐỀ XUẤT CÔNG VIỆC

Số: .............../ĐX
Ngày: ...../...../20.....

I. THÔNG TIN NGƯỜI ĐỀ XUẤT
Họ và tên: .................................................................
Phòng/Ban: .................................................................
Chức vụ: ...................................................................

II. NỘI DUNG ĐỀ XUẤT

1. Tên đề xuất:
...............................................................................

2. Mô tả chi tiết:
...............................................................................
...............................................................................
...............................................................................

3. Lý do đề xuất:
...............................................................................
...............................................................................

4. Lợi ích dự kiến:
...............................................................................
...............................................................................

5. Chi phí ước tính (nếu có):
...............................................................................

6. Thời gian thực hiện:
Từ ngày: ...../...../20.....  đến ngày: ...../...../20.....

III. PHÊ DUYỆT

□ Đồng ý          □ Không đồng ý          □ Cần xem xét thêm

Ý kiến:
...............................................................................

    Trưởng phòng                         Giám đốc
   (Ký, ghi rõ họ tên)                 (Ký, ghi rõ họ tên)




...........................             ...........................
    `
  },
  6: {
    title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN',
    content: `
                    CHÍNH SÁCH BẢO MẬT THÔNG TIN
                           CÔNG TY ABC

1. MỤC ĐÍCH
Chính sách này nhằm bảo vệ thông tin của công ty, khách hàng và nhân viên.

2. PHẠM VI ÁP DỤNG
Áp dụng cho tất cả nhân viên, đối tác, và bên thứ ba có quyền truy cập
vào hệ thống thông tin của công ty.

3. PHÂN LOẠI THÔNG TIN

Mức 1 - Tối mật:
- Chiến lược kinh doanh
- Thông tin tài chính chưa công bố
- Dữ liệu khách hàng nhạy cảm

Mức 2 - Bí mật:
- Quy trình nội bộ
- Thông tin nhân sự
- Hợp đồng, thỏa thuận

Mức 3 - Nội bộ:
- Thông báo công ty
- Tài liệu đào tạo
- Quy định, hướng dẫn

4. QUY ĐỊNH SỬ DỤNG

✓ Mật khẩu tối thiểu 8 ký tự
✓ Đổi mật khẩu mỗi 90 ngày
✓ Không chia sẻ tài khoản
✓ Khóa máy khi rời bàn
✓ Không cài phần mềm không rõ nguồn gốc

5. XỬ LÝ VI PHẠM

- Lần 1: Cảnh cáo bằng văn bản
- Lần 2: Kỷ luật theo quy chế
- Vi phạm nghiêm trọng: Sa thải

6. TRÁCH NHIỆM BÁO CÁO

Phát hiện sự cố bảo mật -> Báo IT Security ngay lập tức
Email: security@company.com
Hotline: 1900-xxxx

                                    Phòng IT Security
    `
  }
};

const docs = [
  { id: 1, name: 'Quy chế công ty.pdf', type: 'PDF', size: '1.2MB', category: 'Quy định', date: '15/01/2025' },
  { id: 2, name: 'Mẫu đơn xin nghỉ phép.pdf', type: 'PDF', size: '120KB', category: 'Biểu mẫu', date: '10/01/2025' },
  { id: 3, name: 'Hướng dẫn chấm công.pdf', type: 'PDF', size: '900KB', category: 'Hướng dẫn', date: '05/01/2025' },
  { id: 4, name: 'Quy trình làm việc từ xa.pdf', type: 'PDF', size: '750KB', category: 'Quy định', date: '20/12/2024' },
  { id: 5, name: 'Mẫu đề xuất công việc.pdf', type: 'PDF', size: '95KB', category: 'Biểu mẫu', date: '18/12/2024' },
  { id: 6, name: 'Chính sách bảo mật.pdf', type: 'PDF', size: '1.5MB', category: 'Quy định', date: '15/12/2024' }
];

const EmployeeDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const categories = ['all', 'Quy định', 'Biểu mẫu', 'Hướng dẫn'];

  // Hàm tạo và tải PDF
  const handleDownload = async (doc) => {
    setDownloading(doc.id);
    try {
      const content = documentContents[doc.id];
      if (!content) {
        alert('Không tìm thấy nội dung tài liệu!');
        return;
      }

      // Tạo nội dung HTML cho PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${content.title}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 14px;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 30px;
            }
            pre {
              white-space: pre-wrap;
              font-family: 'Times New Roman', serif;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>${content.title}</h1>
          <pre>${content.content}</pre>
        </body>
        </html>
      `;

      // Tạo Blob và tải xuống dưới dạng HTML (có thể in thành PDF)
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name.replace('.pdf', '.html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Lỗi tải tài liệu:', error);
      alert('Có lỗi xảy ra khi tải tài liệu!');
    } finally {
      setDownloading(null);
    }
  };

  // Hàm xem tài liệu
  const handlePreview = (doc) => {
    setPreviewDoc(doc);
  };

  // Đóng modal xem trước
  const closePreview = () => {
    setPreviewDoc(null);
  };

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    return type === 'PDF' ? '📄' : '📝';
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
                  onClick={() => handlePreview(d)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Eye size={16} />
                  Xem
                </button>
                <button
                  onClick={() => handleDownload(d)}
                  disabled={downloading === d.id}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading === d.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Tải
                    </>
                  )}
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
      </div>

      {/* Modal xem trước tài liệu */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{previewDoc.type === 'PDF' ? '📄' : '📝'}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{previewDoc.name}</h3>
                  <p className="text-sm text-gray-500">{previewDoc.category} • {previewDoc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  disabled={downloading === previewDoc.id}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                >
                  {downloading === previewDoc.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Tải về
                    </>
                  )}
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Nội dung xem trước */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {documentContents[previewDoc.id] ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-center text-gray-900 mb-6 pb-4 border-b border-gray-200">
                    {documentContents[previewDoc.id].title}
                  </h2>
                  <pre className="whitespace-pre-wrap font-serif text-sm text-gray-800 leading-relaxed">
                    {documentContents[previewDoc.id].content}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Không tìm thấy nội dung tài liệu
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Vui lòng tải về để xem nội dung tệp này
                  </p>
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    disabled={downloading === previewDoc.id}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {downloading === previewDoc.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        Tải về ngay
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Ngày tải lên: {previewDoc.date}</span>
                <span>Kích thước: {previewDoc.size}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocuments;
