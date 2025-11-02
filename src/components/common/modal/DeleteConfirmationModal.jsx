import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ user, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Are you sure you want to delete <span className="font-medium">{user.username}</span>? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;