import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import fakeApi from '../services/fakeApi';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Documents', icon: '📁' },
    { id: 'contracts', name: 'Contracts', icon: '📄' },
    { id: 'policies', name: 'Policies', icon: '📋' },
    { id: 'forms', name: 'Forms', icon: '📝' },
    { id: 'certificates', name: 'Certificates', icon: '🏆' },
    { id: 'reports', name: 'Reports', icon: '📊' }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Employee Contract Template.pdf',
      category: 'contracts',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'HR Manager',
      downloads: 45
    },
    {
      id: 2,
      name: 'Company Policy Handbook.pdf',
      category: 'policies',
      size: '5.8 MB',
      uploadDate: '2024-01-10',
      uploadedBy: 'Admin',
      downloads: 78
    },
    {
      id: 3,
      name: 'Leave Request Form.docx',
      category: 'forms',
      size: '156 KB',
      uploadDate: '2024-01-08',
      uploadedBy: 'HR Team',
      downloads: 123
    },
    {
      id: 4,
      name: 'Training Certificate.pdf',
      category: 'certificates',
      size: '1.2 MB',
      uploadDate: '2024-01-05',
      uploadedBy: 'Training Dept',
      downloads: 34
    },
    {
      id: 5,
      name: 'Monthly Report Jan 2024.pdf',
      category: 'reports',
      size: '3.1 MB',
      uploadDate: '2024-01-01',
      uploadedBy: 'Manager',
      downloads: 56
    }
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
  }, []);

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
      alert('Document uploaded successfully!');
    }, 2000);
  };

  const downloadDocument = (document) => {
    // Simulate download
    alert(`Downloading ${document.name}...`);
  };

  const deleteDocument = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      alert('Document deleted successfully!');
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
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Document Management</h1>
              <p className="text-gray-400 text-sm">Dashboard / Documents</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Upload Document</span>
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
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getFileIcon(document.name)}</div>
                    <div>
                      <h3 className="font-semibold text-white text-sm truncate max-w-40">
                        {document.name}
                      </h3>
                      <p className="text-gray-400 text-xs">{document.size}</p>
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
                    <span className="text-gray-400 text-xs">{document.downloads} downloads</span>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    <p>Uploaded: {document.uploadDate}</p>
                    <p>By: {document.uploadedBy}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => downloadDocument(document)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => {/* View details */}}
                    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Upload Document</h2>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleFileUpload} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select File</label>
                    <input
                      type="file"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    >
                      <option value="contracts">Contracts</option>
                      <option value="policies">Policies</option>
                      <option value="forms">Forms</option>
                      <option value="certificates">Certificates</option>
                      <option value="reports">Reports</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !uploadFile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                    >
                      {loading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
