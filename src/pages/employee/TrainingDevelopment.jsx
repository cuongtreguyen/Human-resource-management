import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Play, CheckCircle, Clock, Award, Download, Search, Filter } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';

const EmployeeTrainingDevelopment = () => {
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock data
    const mockCourses = [
      {
        id: 1,
        title: 'React.js Advanced Development',
        category: 'Technical',
        duration: '40 hours',
        progress: 75,
        status: 'in-progress',
        instructor: 'Nguyễn Văn A',
        description: 'Khóa học nâng cao về React.js, hooks, context API và performance optimization',
        thumbnail: 'https://via.placeholder.com/300x200?text=React+Course'
      },
      {
        id: 2,
        title: 'Leadership & Team Management',
        category: 'Management',
        duration: '24 hours',
        progress: 100,
        status: 'completed',
        instructor: 'Trần Thị B',
        description: 'Phát triển kỹ năng lãnh đạo và quản lý nhóm hiệu quả',
        thumbnail: 'https://via.placeholder.com/300x200?text=Leadership+Course'
      },
      {
        id: 3,
        title: 'Project Management Fundamentals',
        category: 'Management',
        duration: '30 hours',
        progress: 0,
        status: 'not-started',
        instructor: 'Lê Văn C',
        description: 'Các nguyên tắc cơ bản về quản lý dự án và công cụ hỗ trợ',
        thumbnail: 'https://via.placeholder.com/300x200?text=PM+Course'
      },
      {
        id: 4,
        title: 'Data Analysis with Python',
        category: 'Technical',
        duration: '35 hours',
        progress: 45,
        status: 'in-progress',
        instructor: 'Phạm Thị D',
        description: 'Phân tích dữ liệu sử dụng Python, pandas, numpy và matplotlib',
        thumbnail: 'https://via.placeholder.com/300x200?text=Python+Course'
      }
    ];

    const mockCertificates = [
      {
        id: 1,
        name: 'React.js Advanced Development',
        issuer: 'Tech Academy',
        issueDate: '2024-01-15',
        expiryDate: '2026-01-15',
        credentialId: 'TA-REACT-2024-001',
        status: 'active'
      },
      {
        id: 2,
        name: 'Leadership & Team Management',
        issuer: 'Business School',
        issueDate: '2023-12-10',
        expiryDate: null,
        credentialId: 'BS-LEAD-2023-045',
        status: 'active'
      },
      {
        id: 3,
        name: 'Agile Scrum Master',
        issuer: 'Scrum Alliance',
        issueDate: '2023-08-20',
        expiryDate: '2025-08-20',
        credentialId: 'SA-CSM-2023-789',
        status: 'active'
      }
    ];

    const mockSkills = [
      { name: 'React.js', level: 85, category: 'Technical' },
      { name: 'JavaScript', level: 90, category: 'Technical' },
      { name: 'Leadership', level: 70, category: 'Soft Skills' },
      { name: 'Project Management', level: 65, category: 'Management' },
      { name: 'Python', level: 60, category: 'Technical' },
      { name: 'Communication', level: 80, category: 'Soft Skills' }
    ];

    setCourses(mockCourses);
    setCertificates(mockCertificates);
    setSkills(mockSkills);
    setLoading(false);
  }, []);

  const categories = ['all', 'Technical', 'Management', 'Soft Skills'];
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'not-started': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang học';
      case 'not-started': return 'Chưa bắt đầu';
      default: return 'Không xác định';
    }
  };

  const getSkillLevelColor = (level) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải...</span>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">Đào tạo & Phát triển</h1>
            <p className="text-purple-100">Nâng cao kỹ năng và kiến thức chuyên môn</p>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Khóa học đang học</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Khóa học hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chứng chỉ</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Giờ học</p>
                <p className="text-2xl font-bold text-gray-900">129h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tìm kiếm và lọc */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Danh sách khóa học */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Khóa học của tôi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <BookOpen className="text-gray-400" size={48} />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded">
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Giảng viên: {course.instructor}</span>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                  
                  {course.status === 'in-progress' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Tiến độ</span>
                        <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {course.status === 'not-started' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        <Play size={16} />
                        Bắt đầu
                      </button>
                    )}
                    {course.status === 'in-progress' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <Play size={16} />
                        Tiếp tục
                      </button>
                    )}
                    {course.status === 'completed' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <Download size={16} />
                        Tải chứng chỉ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kỹ năng */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng của tôi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.category}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Mức độ</span>
                  <span className="text-sm font-medium text-gray-900">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chứng chỉ */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chứng chỉ đã có</h3>
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-500">{cert.issuer}</p>
                    <p className="text-xs text-gray-400">ID: {cert.credentialId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Cấp ngày: {cert.issueDate}</p>
                  {cert.expiryDate && (
                    <p className="text-sm text-gray-600">Hết hạn: {cert.expiryDate}</p>
                  )}
                  <button className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                    Tải về
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTrainingDevelopment;
