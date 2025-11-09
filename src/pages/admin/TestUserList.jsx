import React from 'react';

const TestUserList = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User List Test Page</h1>
        <p className="text-gray-600">Nếu bạn thấy trang này, có nghĩa là route hoạt động!</p>
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800">✅ UserList route đang hoạt động bình thường!</p>
        </div>
        <div className="mt-4">
          <a href="/admin/users" className="text-blue-600 hover:text-blue-800 underline">
            ← Quay lại UserList
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestUserList;
