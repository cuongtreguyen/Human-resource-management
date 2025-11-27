import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, Search, Filter, File } from 'lucide-react';

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

  const categories = ['all', 'Quy định', 'Biểu mẫu', 'Hướng dẫn'];

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
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                  <Eye size={16} />
                  Xem
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium">
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
      </div>
    </div>
  );
};

export default EmployeeDocuments;
