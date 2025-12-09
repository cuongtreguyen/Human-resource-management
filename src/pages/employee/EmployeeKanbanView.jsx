// src/pages/employee/EmployeeKanbanView.jsx
// Employee Kanban View - Shows tasks assigned to the employee

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Kanban,
  ArrowLeft,
  Search,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Paperclip,
  Flag,
  X,
  User,
  Send,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react';
import { useKanbanContext, PRIORITIES, LIST_STATUS_MAP } from '../../context/KanbanContext';
import { getUserInfo } from '../../utils/auth';
import { toast } from 'react-toastify';

// Employee Card Component
const EmployeeCard = ({ card, board, list, onClick, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: isOverlay,
  });

  const style = isOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITIES[card.priority] || PRIORITIES.MEDIUM;
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const getLabelColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      cyan: 'bg-cyan-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onClick?.()}
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 shadow-lg rotate-2' : ''
      } ${isOverlay ? 'shadow-2xl' : ''}`}
    >
      {/* Board indicator */}
      <div className="px-3 py-1.5 bg-gray-50 border-b rounded-t-lg">
        <span className="text-xs text-gray-500 font-medium">{board?.name}</span>
      </div>

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pt-2">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className={`h-2 w-10 rounded-sm ${getLabelColorClass(label.color)}`}
              title={label.name}
            />
          ))}
        </div>
      )}

      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{card.title}</h4>
        {card.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{card.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.color} text-white`}>
            {priority.label}
          </span>

          {card.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}

          {card.commentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>{card.commentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Column Component
const EmployeeColumn = ({ column, cards, onCardClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const columnStyles = {
    TODO: { headerBg: 'bg-gray-100', headerBorder: 'border-gray-300', badge: 'bg-gray-500' },
    IN_PROGRESS: { headerBg: 'bg-blue-100', headerBorder: 'border-blue-300', badge: 'bg-blue-500' },
    REVIEW: { headerBg: 'bg-amber-100', headerBorder: 'border-amber-300', badge: 'bg-amber-500' },
    DONE: { headerBg: 'bg-green-100', headerBorder: 'border-green-300', badge: 'bg-green-500' },
  };

  const style = columnStyles[column.status] || columnStyles.TODO;

  return (
    <div className={`flex flex-col w-80 min-w-80 bg-gray-50 rounded-xl border ${
      isOver ? 'border-blue-400 border-2' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-3 ${style.headerBg} rounded-t-xl border-b ${style.headerBorder}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{column.title}</h3>
          <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${style.badge}`}>
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-350px)] space-y-2"
      >
        <SortableContext items={cards.map(c => c.card.id)} strategy={verticalListSortingStrategy}>
          {cards.map(({ card, board, list }) => (
            <EmployeeCard
              key={card.id}
              card={card}
              board={board}
              list={list}
              onClick={() => onCardClick(card, board, list)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Không có task nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Card Detail Modal for Employee
const EmployeeCardDetailModal = ({ isOpen, onClose, card, board, list }) => {
  const { getCommentsByCard, addComment, moveCard, updateCard } = useKanbanContext();
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !card) return null;

  const comments = getCommentsByCard(card.id);
  const priority = PRIORITIES[card.priority] || PRIORITIES.MEDIUM;
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa đặt';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const userInfo = getUserInfo();
      addComment(card.id, {
        content: newComment.trim(),
        authorName: userInfo?.name || 'Nhân viên',
        authorId: userInfo?.id || 'employee',
      });
      setNewComment('');
      toast.success('Đã thêm bình luận');
    }
  };

  const getLabelColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      cyan: 'bg-cyan-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <p className="text-sm text-gray-500">{board?.name}</p>
            <h2 className="text-xl font-bold text-gray-900">{card.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status Info */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trạng thái:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {list?.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Độ ưu tiên:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${priority.color}`}>
                {priority.label}
              </span>
            </div>
            {card.dueDate && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Hạn:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {formatDate(card.dueDate)}
                  {isOverdue && ' (Quá hạn)'}
                </span>
              </div>
            )}
          </div>

          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div>
              <span className="text-sm text-gray-500 block mb-2">Nhãn:</span>
              <div className="flex flex-wrap gap-2">
                {card.labels.map((label) => (
                  <span
                    key={label.id}
                    className={`px-3 py-1 rounded text-white text-sm ${getLabelColorClass(label.color)}`}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {card.description && (
            <div>
              <span className="text-sm text-gray-500 block mb-2">Mô tả:</span>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                {card.description}
              </p>
            </div>
          )}

          {/* Assignees */}
          {card.assignees && card.assignees.length > 0 && (
            <div>
              <span className="text-sm text-gray-500 block mb-2">Người thực hiện:</span>
              <div className="flex flex-wrap gap-2">
                {card.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                      {assignee.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{assignee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Bình luận ({comments.length})</span>
            </div>

            {/* Add Comment */}
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                N
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Gửi
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                    {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{comment.authorName}</span>
                      <span className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded-lg">{comment.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">Chưa có bình luận nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const EmployeeKanbanView = () => {
  const navigate = useNavigate();
  const { boards, moveCard, updateCard, loading, employees } = useKanbanContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeSourceData, setActiveSourceData] = useState(null);

  // Get current user info
  const userInfo = getUserInfo();
  const employeeName = userInfo?.name || userInfo?.email?.split('@')[0] || 'employee';
  
  // Get current employee ID for matching assignees
  // Try to get Long ID (Employee.id) from userInfo or employees list
  const currentEmployeeId = useMemo(() => {
    // First try: userInfo.id (Long - primary key)
    if (userInfo?.id) {
      return Number(userInfo.id);
    }
    
    // Second try: find employee in employees list by employeeId (String) and get their id (Long)
    if (userInfo?.employeeId && employees && Array.isArray(employees)) {
      const emp = employees.find(e => 
        e.employeeId === userInfo.employeeId || 
        String(e.employeeId) === String(userInfo.employeeId)
      );
      if (emp?.id) {
        return Number(emp.id);
      }
    }
    
    // Fallback: try userInfo.employeeId as number (if it's already a Long)
    if (userInfo?.employeeId) {
      const numId = Number(userInfo.employeeId);
      if (!isNaN(numId)) {
        return numId;
      }
    }
    
    return null;
  }, [userInfo, employees]);

  // Columns definition
  const columns = [
    { id: 'TODO', status: 'TODO', title: 'Cần làm' },
    { id: 'IN_PROGRESS', status: 'IN_PROGRESS', title: 'Đang làm' },
    { id: 'REVIEW', status: 'REVIEW', title: 'Đang review' },
    { id: 'DONE', status: 'DONE', title: 'Hoàn thành' },
  ];

  // Get all cards assigned to current employee
  const myCards = useMemo(() => {
    if (!boards || !Array.isArray(boards)) return [];
    
    const cards = [];
    boards.forEach(board => {
      if (!board?.lists || !Array.isArray(board.lists)) return;
      
      board.lists.forEach(list => {
        if (!list?.cards || !Array.isArray(list.cards)) return;
        
        list.cards.forEach(card => {
          // Check if employee is assigned to this card
          // First try to match by employee ID (Long) - more reliable
          let isAssigned = false;
          
          if (currentEmployeeId && card.assigneeIds && Array.isArray(card.assigneeIds)) {
            const empIdNum = Number(currentEmployeeId);
            isAssigned = card.assigneeIds.includes(empIdNum);
          }
          
          // Fallback: match by name or email if ID matching fails
          if (!isAssigned && card.assignees && Array.isArray(card.assignees)) {
            isAssigned = card.assignees.some(a =>
              a.name?.toLowerCase().includes(employeeName.toLowerCase()) ||
              a.email?.toLowerCase().includes(employeeName.toLowerCase()) ||
              (currentEmployeeId && (Number(a.id) === Number(currentEmployeeId) || Number(a.employeeId) === Number(currentEmployeeId)))
            );
          }
          
          if (isAssigned) {
            cards.push({ card, board, list });
          }
        });
      });
    });
    return cards;
  }, [boards, employeeName, currentEmployeeId]);

  // Group cards by status
  const cardsByStatus = useMemo(() => {
    const grouped = {
      TODO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
    };

    myCards.forEach(item => {
      const status = LIST_STATUS_MAP[item.list.name] || 'TODO';
      if (grouped[status]) {
        // Filter by search
        if (!searchQuery ||
            item.card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.card.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
          grouped[status].push(item);
        }
      }
    });

    return grouped;
  }, [myCards, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: myCards.length,
    todo: cardsByStatus.TODO.length,
    inProgress: cardsByStatus.IN_PROGRESS.length,
    review: cardsByStatus.REVIEW.length,
    done: cardsByStatus.DONE.length,
  }), [myCards, cardsByStatus]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const collisionDetectionStrategy = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return rectIntersection(args);
  };

  // Find card data by id
  const findCardData = (cardId) => {
    if (!boards || !Array.isArray(boards)) return null;
    
    for (const board of boards) {
      if (!board?.lists || !Array.isArray(board.lists)) continue;
      
      for (const list of board.lists) {
        if (!list?.cards || !Array.isArray(list.cards)) continue;
        
        const card = list.cards.find(c => c.id === cardId);
        if (card) return { card, board, list };
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const data = findCardData(active.id);
    if (data) {
      setActiveCard(data.card);
      setActiveSourceData(data);
    }
  };

  const handleDragOver = (event) => {
    // Don't move during drag over
  };

  const handleDragEnd = (event) => {
    const { over } = event;

    const cardId = activeId;
    const sourceData = activeSourceData;

    setActiveId(null);
    setActiveCard(null);
    setActiveSourceData(null);

    if (!over || !sourceData) return;

    const targetColumnId = over.id;
    const targetColumn = columns.find(c => c.id === targetColumnId);

    if (!targetColumn) return;

    // Get current list status
    const currentStatus = LIST_STATUS_MAP[sourceData.list.name] || 'TODO';
    if (currentStatus === targetColumn.status) return;

    // Find target list in the same board with matching status
    const targetList = sourceData.board.lists.find(l =>
      LIST_STATUS_MAP[l.name] === targetColumn.status
    );

    if (!targetList) {
      toast.error('Không tìm thấy danh sách phù hợp');
      return;
    }

    // Move card
    const targetPosition = targetList.cards.length > 0
      ? Math.max(...targetList.cards.map(c => c.position)) + 1
      : 1;

    moveCard(
      sourceData.board.id,
      sourceData.list.id,
      targetList.id,
      cardId,
      targetPosition
    );
  };

  const handleCardClick = (card, board, list) => {
    setSelectedCard(card);
    setSelectedBoard(board);
    setSelectedList(list);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/employee')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Kanban className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Công việc của tôi</h1>
                <p className="text-sm text-gray-500">{stats.total} task được giao</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <CheckSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Cần làm: <span className="font-semibold">{stats.todo}</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600">Đang làm: <span className="font-semibold">{stats.inProgress}</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-600">Review: <span className="font-semibold">{stats.review}</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">Hoàn thành: <span className="font-semibold">{stats.done}</span></span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải công việc...</p>
          </div>
        </div>
      )}

      {/* Empty State - No boards */}
      {!loading && (!boards || !Array.isArray(boards) || boards.length === 0) && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Kanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Chưa có board nào</p>
            <p className="text-gray-500 text-sm mt-2">Vui lòng liên hệ quản lý để được giao công việc</p>
          </div>
        </div>
      )}

      {/* Board */}
      {!loading && boards && Array.isArray(boards) && boards.length > 0 && (
        <div className="p-6 overflow-x-auto">
          {myCards.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có task nào</h3>
              <p className="text-gray-500">Bạn chưa được giao task nào. Liên hệ quản lý để được phân công công việc.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetectionStrategy}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4">
                {columns.map(column => (
                  <EmployeeColumn
                    key={column.id}
                    column={column}
                    cards={cardsByStatus[column.status]}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeCard && activeSourceData ? (
                  <div className="rotate-3 w-80">
                    <EmployeeCard
                      card={activeCard}
                      board={activeSourceData.board}
                      list={activeSourceData.list}
                      isOverlay
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      )}

      {/* Card Detail Modal */}
      <EmployeeCardDetailModal
        isOpen={!!selectedCard}
        onClose={() => {
          setSelectedCard(null);
          setSelectedBoard(null);
          setSelectedList(null);
        }}
        card={selectedCard}
        board={selectedBoard}
        list={selectedList}
      />
    </div>
  );
};

export default EmployeeKanbanView;
