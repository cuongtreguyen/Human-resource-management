// src/pages/kanban/BoardList.jsx
// Board List Page - Grid of boards with search, progress bars

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import { useKanbanContext } from '../../context/KanbanContext';
import {
  Kanban,
  Search,
  Plus,
  Users,
  CheckSquare,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Edit2,
  LayoutGrid,
  X,
} from 'lucide-react';

const BoardList = () => {
  const navigate = useNavigate();
  const { boards, createBoard, deleteBoard, updateBoard, getBoardStats } = useKanbanContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Filter boards by search
  const filteredBoards = (boards || []).filter(board =>
    board?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board?.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate overall stats (safely)
  const overallStats = {
    totalBoards: (boards || []).length,
    totalTasks: (boards || []).reduce((sum, board) => {
      if (!board?.id) return sum;
      try {
        const stats = getBoardStats(board.id);
        return sum + (stats?.totalCards || 0);
      } catch (error) {
        console.warn('Error getting stats for board', board.id, error);
        return sum;
      }
    }, 0),
    todo: (boards || []).reduce((sum, board) => {
      if (!board?.id) return sum;
      try {
        const stats = getBoardStats(board.id);
        return sum + (stats?.todo || 0);
      } catch (error) {
        console.warn('Error getting stats for board', board.id, error);
        return sum;
      }
    }, 0),
    inProgress: (boards || []).reduce((sum, board) => {
      if (!board?.id) return sum;
      try {
        const stats = getBoardStats(board.id);
        return sum + (stats?.inProgress || 0);
      } catch (error) {
        console.warn('Error getting stats for board', board.id, error);
        return sum;
      }
    }, 0),
    review: (boards || []).reduce((sum, board) => {
      if (!board?.id) return sum;
      try {
        const stats = getBoardStats(board.id);
        return sum + (stats?.review || 0);
      } catch (error) {
        console.warn('Error getting stats for board', board.id, error);
        return sum;
      }
    }, 0),
    done: (boards || []).reduce((sum, board) => {
      if (!board?.id) return sum;
      try {
        const stats = getBoardStats(board.id);
        return sum + (stats?.done || 0);
      } catch (error) {
        console.warn('Error getting stats for board', board.id, error);
        return sum;
      }
    }, 0),
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const newBoard = await createBoard({ name: newBoardName.trim() });
      setNewBoardName('');
      setShowCreateModal(false);
      if (newBoard && newBoard.id) {
        navigate(`/kanban/${newBoard.id}`);
      } else {
        console.error('Created board does not have an id:', newBoard);
        toast.error('Tạo board thành công nhưng không thể chuyển trang');
      }
    } catch (error) {
      console.error('Error creating board:', error);
      // Error toast is already shown in createBoard
    }
  };

  const handleDeleteBoard = (boardId, e) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa board này?')) {
      deleteBoard(boardId);
    }
    setMenuOpenId(null);
  };

  const handleEditBoard = (board, e) => {
    e.stopPropagation();
    setEditingBoard(board);
    setNewBoardName(board.name);
    setShowEditModal(true);
    setMenuOpenId(null);
  };

  const handleSaveEdit = () => {
    if (!newBoardName.trim() || !editingBoard) return;
    updateBoard(editingBoard.id, { name: newBoardName.trim() });
    setEditingBoard(null);
    setNewBoardName('');
    setShowEditModal(false);
  };

  const boardColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-emerald-500 to-emerald-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600',
    'from-indigo-500 to-indigo-600',
    'from-rose-500 to-rose-600',
  ];

  const getBoardColor = (index) => boardColors[index % boardColors.length];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Kanban className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quản lý công việc</h1>
                  <p className="text-gray-500">Chọn board để xem và quản lý công việc</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo Board mới</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalBoards}</p>
                  <p className="text-sm text-gray-500">Boards</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalTasks}</p>
                  <p className="text-sm text-gray-500">Tổng tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.todo}</p>
                  <p className="text-sm text-gray-500">Cần làm</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.inProgress}</p>
                  <p className="text-sm text-gray-500">Đang làm</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.review}</p>
                  <p className="text-sm text-gray-500">Đang review</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.done}</p>
                  <p className="text-sm text-gray-500">Hoàn thành</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board, index) => {
              const stats = getBoardStats(board.id);
              const progress = stats?.progress || 0;
              const gradient = getBoardColor(index);

              return (
                <div
                  key={board.id}
                  onClick={() => navigate(`/kanban/${board.id}`)}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                >
                  {/* Board Header with gradient */}
                  <div className={`h-24 bg-gradient-to-r ${gradient} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-bold text-white text-lg truncate">{board.name}</h3>
                    </div>
                    {/* Menu button */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === board.id ? null : board.id);
                        }}
                        className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4 text-white" />
                      </button>
                      {menuOpenId === board.id && (
                        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg py-1 min-w-32 z-10">
                          <button
                            onClick={(e) => handleEditBoard(board, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Sửa tên</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteBoard(board.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa board</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Owner & Members */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{board.members?.length || 1} thành viên</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{stats?.totalCards || 0} tasks</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Tiến độ</span>
                        <span className={`font-bold ${
                          progress === 100 ? 'text-green-600' :
                          progress >= 75 ? 'text-blue-600' :
                          progress >= 50 ? 'text-yellow-600' :
                          progress >= 25 ? 'text-orange-600' : 'text-gray-500'
                        }`}>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress === 100 ? 'bg-green-500' :
                            progress >= 75 ? 'bg-blue-500' :
                            progress >= 50 ? 'bg-yellow-500' :
                            progress >= 25 ? 'bg-orange-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-600">{stats?.todo || 0}</p>
                        <p className="text-xs text-gray-500">Cần làm</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{stats?.inProgress || 0}</p>
                        <p className="text-xs text-gray-500">Đang làm</p>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded-lg">
                        <p className="text-lg font-bold text-amber-600">{stats?.review || 0}</p>
                        <p className="text-xs text-gray-500">Review</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{stats?.done || 0}</p>
                        <p className="text-xs text-gray-500">Xong</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create New Board Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="bg-white/50 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center justify-center min-h-[280px]"
            >
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Plus className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-600 font-medium">Tạo board mới</p>
              <p className="text-gray-400 text-sm mt-1">Bắt đầu quản lý công việc</p>
            </div>
          </div>

          {filteredBoards.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy board phù hợp với "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Tạo Board mới</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên board
              </label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Nhập tên board..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBoard();
                }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tạo board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Board Modal */}
      {showEditModal && editingBoard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Sửa tên Board</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBoard(null);
                  setNewBoardName('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên board
              </label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Nhập tên board..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBoard(null);
                  setNewBoardName('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!newBoardName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BoardList;
