import React from 'react';
import { X } from 'lucide-react';

const ViewUserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-blue-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold">{user.username}</p>
                <p className="text-sm text-gray-600">{user.name || 'No full name'}</p>
              </div>
          </div>
          <hr/>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <span className="font-medium">{user.role.toUpperCase()}</span></p>
          <p><strong>Status:</strong> <span className="font-medium">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></p>
          <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Never'}</p>
        </div>
        
        <div className="text-right mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;