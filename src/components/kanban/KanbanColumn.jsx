// src/components/kanban/KanbanColumn.jsx
// Kanban Column Component with inline card creation (Trello-style)

import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, X, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import KanbanCard from './KanbanCard';

// Column colors based on status/name
const getColumnStyles = (name) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('todo') || lowerName.includes('cần làm')) {
    return {
      headerBg: 'bg-gray-100',
      headerBorder: 'border-gray-300',
      badge: 'bg-gray-500',
      dropZone: 'border-gray-300',
    };
  }
  if (lowerName.includes('progress') || lowerName.includes('đang làm')) {
    return {
      headerBg: 'bg-blue-100',
      headerBorder: 'border-blue-300',
      badge: 'bg-blue-500',
      dropZone: 'border-blue-300',
    };
  }
  if (lowerName.includes('review')) {
    return {
      headerBg: 'bg-amber-100',
      headerBorder: 'border-amber-300',
      badge: 'bg-amber-500',
      dropZone: 'border-amber-300',
    };
  }
  if (lowerName.includes('done') || lowerName.includes('hoàn thành') || lowerName.includes('xong')) {
    return {
      headerBg: 'bg-green-100',
      headerBorder: 'border-green-300',
      badge: 'bg-green-500',
      dropZone: 'border-green-300',
    };
  }

  return {
    headerBg: 'bg-purple-100',
    headerBorder: 'border-purple-300',
    badge: 'bg-purple-500',
    dropZone: 'border-purple-300',
  };
};

const KanbanColumn = ({
  list,
  onAddCard,
  onCardClick,
  onUpdateList,
  onDeleteList,
  canManage = true, // Mặc định true, Employee sẽ truyền false
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const inputRef = useRef(null);
  const nameInputRef = useRef(null);

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  });

  const styles = getColumnStyles(list.name);

  useEffect(() => {
    if (isAddingCard && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCard]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(list.id, { title: newCardTitle.trim() });
      setNewCardTitle('');
      // Keep input open for quick multiple adds (Trello-style)
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    }
    if (e.key === 'Escape') {
      setIsAddingCard(false);
      setNewCardTitle('');
    }
  };

  const handleSaveName = () => {
    if (editName.trim() && editName.trim() !== list.name) {
      onUpdateList(list.id, { name: editName.trim() });
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
    if (e.key === 'Escape') {
      setEditName(list.name);
      setIsEditingName(false);
    }
  };

  const cardIds = list.cards.map(card => card.id);

  return (
    <div
      className={`flex flex-col w-72 min-w-72 bg-gray-50 rounded-xl border ${
        isOver ? `${styles.dropZone} border-2 bg-gray-100` : 'border-gray-200'
      } transition-colors`}
    >
      {/* Column Header */}
      <div className={`p-3 ${styles.headerBg} rounded-t-xl border-b ${styles.headerBorder}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleNameKeyDown}
                className="flex-1 px-2 py-1 text-sm font-semibold bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3
                className="font-semibold text-gray-800 truncate cursor-pointer hover:text-gray-600"
                onClick={() => setIsEditingName(true)}
              >
                {list.name}
              </h3>
            )}
            <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${styles.badge}`}>
              {list.cards.length}
            </span>
          </div>

          {/* Column Menu - Chỉ hiện cho Manager/Admin */}
          {canManage && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white/50 rounded transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-1 min-w-36 z-20">
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Đổi tên</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setIsAddingCard(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm thẻ</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (window.confirm(`Xóa danh sách "${list.name}" và tất cả thẻ trong đó?`)) {
                          onDeleteList && onDeleteList(list.id);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa danh sách</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-320px)] space-y-2"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {/* Drop zone indicator when empty */}
        {list.cards.length === 0 && !isAddingCard && (
          <div className={`border-2 border-dashed ${styles.dropZone} rounded-lg p-4 text-center ${
            isOver ? 'bg-white' : ''
          }`}>
            <p className="text-sm text-gray-400">
              {isOver ? 'Thả thẻ vào đây' : 'Chưa có thẻ nào'}
            </p>
          </div>
        )}
      </div>

      {/* Add Card Section - Chỉ hiện cho Manager/Admin */}
      {canManage && (
        <div className="p-2 border-t border-gray-200">
          {isAddingCard ? (
            <div className="space-y-2">
              <textarea
                ref={inputRef}
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tiêu đề cho thẻ này..."
                className="w-full p-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCard}
                  disabled={!newCardTitle.trim()}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Thêm thẻ
                </button>
                <button
                  onClick={() => {
                    setIsAddingCard(false);
                    setNewCardTitle('');
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCard(true)}
              className="w-full flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
