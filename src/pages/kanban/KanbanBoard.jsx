// src/pages/kanban/KanbanBoard.jsx
// Main Kanban Board Page with drag & drop

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { toast } from 'react-toastify';

const KanbanBoard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
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
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);

  // Load board data when boardId changes
  useEffect(() => {
    if (!boardId || loading) return;
    
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
  }, [boardId, loading, getBoardById]);
  
  // Update board when boards context changes (for progressive card loading)
  useEffect(() => {
    if (!boardId || !boards?.length) return;
    const updatedBoard = boards.find(b => String(b.id) === String(boardId));
    if (updatedBoard && updatedBoard.lists?.length > 0) {
      setBoard(prev => {
        // Only update if cards have changed
        if (!prev || JSON.stringify(prev.lists?.map(l => l.cards?.length)) !== JSON.stringify(updatedBoard.lists?.map(l => l.cards?.length))) {
          return updatedBoard;
        }
        return prev;
      });
    }
  }, [boards, boardId]);

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
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Đang tải board...</p>
          {!board && !isLoadingBoard && (
            <button
              onClick={() => navigate('/kanban')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Quay lại danh sách board
            </button>
          )}
        </div>
      </Layout>
    );
  }

  // NOTE: Không tạo default lists với temporary IDs ở đây nữa!
  // getBoardById trong KanbanContext đã tự động tạo default lists qua API nếu board chưa có lists
  // Tất cả lists phải có real IDs từ BE (Long), không phải temporary string IDs

  // Safely get board stats
  let stats = null;
  try {
    if (boardId) {
      stats = getBoardStats(boardId);
    }
  } catch (error) {
    console.warn('Error getting board stats:', error);
    stats = null;
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
    const list = (board?.lists || []).find(l => (l.cards || []).some(c => c.id === card.id));
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

  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      // In a real app, you'd validate the email and get user info
      addMember(boardId, {
        accountId: `user-${Date.now()}`,
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail.trim(),
        role: 'MEMBER',
      });
      setNewMemberEmail('');
    }
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này khỏi board?')) {
      removeMember(boardId, memberId);
    }
  };

  return (
    <Layout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-100 to-blue-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/kanban')}
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
                  {board.members?.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      title={member.name}
                    >
                      {member.name?.charAt(0)?.toUpperCase()}
                    </div>
                  ))}
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
                  onAddCard={handleAddCard}
                  onCardClick={handleCardClick}
                  onUpdateList={handleUpdateList}
                  onDeleteList={handleDeleteList}
                />
              ))}

              {/* Add List Widget */}
              <AddListWidget onAddList={handleAddList} />
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

        {/* Members Modal */}
        {showMembersModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Thành viên Board</h2>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500 rotate-180" />
                </button>
              </div>

              {/* Add Member */}
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Email thành viên mới..."
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMember();
                  }}
                />
                <button
                  onClick={handleAddMember}
                  disabled={!newMemberEmail.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {board.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        member.role === 'OWNER' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.role === 'OWNER' ? 'Chủ sở hữu' : 'Thành viên'}
                      </span>
                      {member.role !== 'OWNER' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default KanbanBoard;
