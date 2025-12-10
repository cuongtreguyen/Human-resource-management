// src/pages/kanban/KanbanBoard.jsx
// Main Kanban Board Page with drag & drop - Trello-style

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Layout from '../../components/layout/Layout';
import KanbanColumn from '../../components/kanban/KanbanColumn';
import KanbanCard from '../../components/kanban/KanbanCard';
import CardDetailModal from '../../components/kanban/CardDetailModal';
import AddListWidget from '../../components/kanban/AddListWidget';
import { useKanbanContext } from '../../context/KanbanContext';
import kanbanService from '../../services/kanbanService';
import {
  ArrowLeft,
  Search,
  Users,
  Plus,
  Settings,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  UserPlus,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { isManager, isAdmin } from '../../utils/auth';

const KanbanBoard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in employee route (already wrapped in EmployeeLayout)
  const isEmployeeRoute = location.pathname.startsWith('/employee/kanban');

  // Check if user can manage board (only Manager/Admin)
  // Employee chỉ được xem, không được tạo list/card/member
  const canManageBoard = isManager() || isAdmin();

  const {
    boards,
    loading,
    getBoardById,
    getBoardStats,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    addMember,
    removeMember,
  } = useKanbanContext();

  const [board, setBoard] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeSourceListId, setActiveSourceListId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);

  // State cho danh sách nhân viên và tìm kiếm
  const [allEmployees, setAllEmployees] = useState([]);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  // Load board data when boardId changes - only once per boardId
  useEffect(() => {
    if (!boardId || loading) return;
    
    // Check if we already have this board loaded with complete data
    const existingBoard = boards.find(b => String(b.id) === String(boardId));
    if (existingBoard?.lists?.length > 0 && existingBoard.lists.every(l => l.cards !== undefined && Array.isArray(l.cards))) {
      setBoard(existingBoard);
      setIsLoadingBoard(false);
      return;
    }
    
    let isMounted = true;
    setIsLoadingBoard(true);
    
    const loadBoard = async () => {
      try {
        const boardData = await getBoardById(boardId);
        if (isMounted && boardData?.id) {
          setBoard(boardData);
          setIsLoadingBoard(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoadingBoard(false);
          toast.error('Không thể tải board. Vui lòng thử lại.');
        }
      }
    };
    
    loadBoard();
    return () => { isMounted = false; };
  }, [boardId, loading]); // Removed getBoardById and boards from dependencies to prevent infinite loops
  
  // Update board when boards context changes (for progressive card loading)
  useEffect(() => {
    if (!boardId || !boards?.length) return;
    
    const updatedBoard = boards.find(b => String(b.id) === String(boardId));
    if (!updatedBoard) return;
    
    // Simple update - just check if board data changed
    setBoard(prev => {
      if (!prev) return updatedBoard;
      
      // Check if lists count changed
      if (prev.lists?.length !== updatedBoard.lists?.length) {
        return updatedBoard;
      }
      
      // Check if any list's card count changed
      const prevCardCounts = prev.lists?.map(l => l.cards?.length || 0) || [];
      const newCardCounts = updatedBoard.lists?.map(l => l.cards?.length || 0) || [];
      if (JSON.stringify(prevCardCounts) !== JSON.stringify(newCardCounts)) {
        return updatedBoard;
      }
      
      // No changes, keep previous board
      return prev;
    });
  }, [boards, boardId]);

  // Load danh sách nhân viên khi mở Members Modal
  useEffect(() => {
    if (showMembersModal && canManageBoard && allEmployees.length === 0) {
      loadAllEmployees();
    }
  }, [showMembersModal, canManageBoard]);

  const loadAllEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await kanbanService.employee.getAll();
      const employees = Array.isArray(response) ? response : (response?.data || []);
      setAllEmployees(employees);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Lọc nhân viên chưa có trong board và theo search query
  const availableEmployees = useMemo(() => {
    const memberIds = (board?.members || []).map(m => m.id);
    return allEmployees.filter(emp => {
      // Loại bỏ những người đã là member
      if (memberIds.includes(emp.id)) return false;
      // Lọc theo search query
      if (employeeSearchQuery) {
        const query = employeeSearchQuery.toLowerCase();
        return (
          emp.fullName?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.employeeId?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allEmployees, board?.members, employeeSearchQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom collision detection - prefer cards over lists for better UX
  const collisionDetectionStrategy = (args) => {
    // First check for pointer within any droppable
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Fall back to rect intersection
    return rectIntersection(args);
  };

  if (!board || isLoadingBoard) {
    const loadingContent = (
      <div className="flex flex-col items-center justify-center h-full gap-4 min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500">Đang tải board...</p>
        {!board && !isLoadingBoard && (
          <button
            onClick={() => navigate(isEmployeeRoute ? '/employee/kanban' : '/kanban')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Quay lại danh sách board
          </button>
        )}
      </div>
    );
    
    // If employee route, don't wrap in Layout (already in EmployeeLayout)
    if (isEmployeeRoute) {
      return loadingContent;
    }
    
    return <Layout>{loadingContent}</Layout>;
  }

  // NOTE: Không tạo default lists với temporary IDs ở đây nữa!
  // getBoardById trong KanbanContext đã tự động tạo default lists qua API nếu board chưa có lists
  // Tất cả lists phải có real IDs từ BE (Long), không phải temporary string IDs

  // Calculate board stats - recalculate when board or boards change
  // Calculate board stats - recalculate when board or boards change
  // Calculate board stats - recalculate when board or boards change
  let stats = null;
  try {
    if (boardId && getBoardStats) {
      stats = getBoardStats(boardId);
    }
  } catch (error) {
    console.warn('Error getting board stats:', error);
    stats = null;
  }
  
  // Default stats if null
  if (!stats) {
    stats = {
      totalCards: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0,
      progress: 0,
    };
  }

  // Sort lists by position (safely) - don't mutate board object
  const sortedLists = Array.isArray(board?.lists) 
    ? [...board.lists].sort((a, b) => (a.position || 0) - (b.position || 0))
    : [];

  // Filter cards by search
  const getFilteredCards = (cards) => {
    if (!searchQuery) return cards;
    return cards.filter(card =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Find card by id across all lists
  const findCardById = (cardId) => {
    if (!board?.lists) return { card: null, list: null };
    for (const list of board.lists) {
      const card = (list.cards || []).find(c => c.id === cardId);
      if (card) return { card, list };
    }
    return { card: null, list: null };
  };

  // Drag handlers
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const { card, list } = findCardById(active.id);
    setActiveCard(card);
    setActiveSourceListId(list?.id || null);
  };

  const handleDragOver = (event) => {
    // We don't move cards during drag over anymore
    // This prevents state conflicts
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    const draggedCardId = activeId;
    const sourceListId = activeSourceListId;
    const draggedCard = activeCard;

    // Reset drag state
    setActiveId(null);
    setActiveCard(null);
    setActiveSourceListId(null);

    if (!over || !draggedCard || !sourceListId) return;

    const overId = over.id;

    if (draggedCardId === overId) return;

    // Check if dropping over a list (column)
    const overList = (board?.lists || []).find(l => l.id === overId);
    if (overList) {
      if (sourceListId !== overList.id) {
        // Move card to the new list at the end
        const targetPosition = (overList.cards || []).length > 0
          ? Math.max(...(overList.cards || []).map(c => c.position || 0)) + 1
          : 1;
        moveCard(boardId, sourceListId, overList.id, draggedCardId, targetPosition);
      }
      return;
    }

    // Check if dropping over another card
    const { card: overCard, list: targetList } = findCardById(overId);
    if (!overCard || !targetList) return;

    if (sourceListId !== targetList.id) {
      // Move card to different list at the position of the over card
      moveCard(boardId, sourceListId, targetList.id, draggedCardId, overCard.position || 0);
    } else {
      // Reorder within the same list
      const sourceList = (board?.lists || []).find(l => l.id === sourceListId);
      if (!sourceList) return;

      const cards = [...(sourceList.cards || [])].sort((a, b) => (a.position || 0) - (b.position || 0));
      const oldIndex = cards.findIndex(c => c.id === draggedCardId);
      const newIndex = cards.findIndex(c => c.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        // Calculate new position between adjacent cards
        let newPosition;

        if (oldIndex < newIndex) {
          // Moving down
          if (newIndex === cards.length - 1) {
            newPosition = cards[newIndex].position + 1;
          } else {
            newPosition = (cards[newIndex].position + cards[newIndex + 1].position) / 2;
          }
        } else {
          // Moving up
          if (newIndex === 0) {
            newPosition = cards[0].position / 2;
          } else {
            newPosition = (cards[newIndex - 1].position + cards[newIndex].position) / 2;
          }
        }

        updateCard(boardId, sourceListId, draggedCardId, { position: newPosition });
      }
    }
  };

  const handleAddCard = (listId, data) => {
    createCard(boardId, listId, data);
  };

  const handleCardClick = (card) => {
    if (!card || !board) {
      console.warn('handleCardClick: Missing card or board', { card, board });
      return;
    }
    
    const list = (board?.lists || []).find(l => (l.cards || []).some(c => c.id === card.id));
    
    if (!list) {
      console.warn('handleCardClick: Could not find list for card', { cardId: card.id, boardId: board.id, lists: board.lists });
      toast.error('Không tìm thấy danh sách chứa task này');
      return;
    }
    
    setSelectedCard(card);
    setSelectedList(list);
    setShowCardModal(true);
  };

  const handleUpdateCard = (updates) => {
    if (selectedCard && selectedList) {
      updateCard(boardId, selectedList.id, selectedCard.id, updates);
      // Update local state
      setSelectedCard(prev => ({ ...prev, ...updates }));
    }
  };

  const handleDeleteCard = () => {
    if (selectedCard && selectedList) {
      deleteCard(boardId, selectedList.id, selectedCard.id);
      setShowCardModal(false);
      setSelectedCard(null);
      setSelectedList(null);
    }
  };

  const handleAddList = (data) => {
    createList(boardId, data);
  };

  const handleUpdateList = (listId, data) => {
    updateList(boardId, listId, data);
  };

  const handleDeleteList = (listId) => {
    deleteList(boardId, listId);
  };

  // Thêm member vào board từ danh sách nhân viên
  const handleAddMember = async (employee) => {
    if (!employee?.email) {
      toast.error('Không tìm thấy email nhân viên');
      return;
    }

    setAddingMember(true);
    try {
      await addMember(boardId, {
        email: employee.email,
      });
      // Reload employees list để cập nhật danh sách available
      // (employee vừa thêm sẽ bị lọc ra khỏi availableEmployees tự động)
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này khỏi board?')) {
      removeMember(boardId, memberId);
    }
  };

  const boardContent = (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-100 to-blue-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(isEmployeeRoute ? '/employee/kanban' : '/kanban')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{board.name}</h1>
                <p className="text-sm text-gray-500">
                  {stats?.totalCards || 0} thẻ • {board.members?.length || 1} thành viên
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thẻ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>

              {/* Members Button */}
              <button
                onClick={() => setShowMembersModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4 text-gray-600" />
                <div className="flex -space-x-2">
                  {board.members?.slice(0, 3).map((member) => {
                    const memberName = member.fullName || member.name || 'Unknown';
                    return (
                      <div
                        key={member.id}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        title={memberName}
                      >
                        {memberName.charAt(0)?.toUpperCase()}
                      </div>
                    );
                  })}
                  {board.members?.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                      +{board.members.length - 3}
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <CheckSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Cần làm: <span className="font-semibold">{stats?.todo || 0}</span></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600">Đang làm: <span className="font-semibold">{stats?.inProgress || 0}</span></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600">Review: <span className="font-semibold">{stats?.review || 0}</span></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Hoàn thành: <span className="font-semibold">{stats?.done || 0}</span></span>
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full items-start">
              {sortedLists.map((list) => (
                <KanbanColumn
                  key={list.id}
                  list={{
                    ...list,
                    cards: getFilteredCards(
                      [...(list.cards || [])].sort((a, b) => (a.position || 0) - (b.position || 0))
                    ),
                  }}
                  onAddCard={canManageBoard ? handleAddCard : null}
                  onCardClick={handleCardClick}
                  onUpdateList={canManageBoard ? handleUpdateList : null}
                  onDeleteList={canManageBoard ? handleDeleteList : null}
                  canManage={canManageBoard}
                />
              ))}

              {/* Add List Widget - Chỉ Manager/Admin mới thấy */}
              {canManageBoard && <AddListWidget onAddList={handleAddList} />}
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="rotate-3 w-72">
                  <KanbanCard card={activeCard} isDragging isOverlay />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Card Detail Modal */}
        <CardDetailModal
          isOpen={showCardModal}
          onClose={() => {
            setShowCardModal(false);
            setSelectedCard(null);
            setSelectedList(null);
          }}
          card={selectedCard}
          list={selectedList}
          board={board}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        />

        {/* Members Modal - Trello Style */}
        {showMembersModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">Thành viên Board</h2>
                <button
                  onClick={() => {
                    setShowMembersModal(false);
                    setEmployeeSearchQuery('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Current Members Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Thành viên hiện tại ({board.members?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {board.members?.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {(member.fullName || member.name)?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.fullName || member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Remove button - only for Manager/Admin */}
                          {canManageBoard && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa khỏi board"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!board.members || board.members.length === 0) && (
                      <p className="text-gray-500 text-sm italic">Chưa có thành viên nào</p>
                    )}
                  </div>
                </div>

                {/* Add Member Section - only for Manager/Admin */}
                {canManageBoard && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Thêm thành viên
                    </h3>

                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm nhân viên theo tên, email..."
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Employee List */}
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                      {loadingEmployees ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-500">Đang tải...</span>
                        </div>
                      ) : availableEmployees.length > 0 ? (
                        <div className="divide-y">
                          {availableEmployees.map((employee) => (
                            <div
                              key={employee.id}
                              className="flex items-center justify-between p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                              onClick={() => !addingMember && handleAddMember(employee)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-medium">
                                  {employee.fullName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{employee.fullName}</p>
                                  <p className="text-sm text-gray-500">{employee.email}</p>
                                  {employee.position && (
                                    <p className="text-xs text-gray-400">{employee.position}</p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddMember(employee);
                                }}
                                disabled={addingMember}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                <UserPlus className="w-4 h-4" />
                                <span>Thêm</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          {employeeSearchQuery ? (
                            <p>Không tìm thấy nhân viên phù hợp</p>
                          ) : (
                            <p>Tất cả nhân viên đã được thêm vào board</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Total count */}
                    {!loadingEmployees && (
                      <p className="text-xs text-gray-500 mt-2">
                        Có {availableEmployees.length} nhân viên có thể thêm
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  );
  
  // If employee route, don't wrap in Layout (already in EmployeeLayout)
  if (isEmployeeRoute) {
    return boardContent;
  }
  
  return <Layout>{boardContent}</Layout>;
};

export default KanbanBoard;
