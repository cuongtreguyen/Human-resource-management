// src/components/kanban/AddListWidget.jsx
// Add List Widget - Trello-style inline list creation

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const AddListWidget = ({ onAddList }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = () => {
    if (listName.trim()) {
      onAddList({ name: listName.trim() });
      setListName('');
      // Keep input open for quick multiple adds
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setListName('');
    }
  };

  const handleClose = () => {
    setIsAdding(false);
    setListName('');
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-72 min-w-72 h-fit flex items-center gap-2 p-3 bg-white/60 hover:bg-white/80 border border-dashed border-gray-300 hover:border-gray-400 rounded-xl text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Thêm danh sách</span>
      </button>
    );
  }

  return (
    <div className="w-72 min-w-72 bg-gray-100 rounded-xl p-2">
      <input
        ref={inputRef}
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tên danh sách..."
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={!listName.trim()}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Thêm danh sách
        </button>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default AddListWidget;
