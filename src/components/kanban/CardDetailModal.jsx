// src/components/kanban/CardDetailModal.jsx
// Card Detail Modal with comments, labels, assignees, activities

import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  AlignLeft,
  Tag,
  Users,
  Calendar,
  MessageSquare,
  Activity,
  Paperclip,
  CheckSquare,
  Clock,
  Trash2,
  Send,
  Edit2,
  AlertTriangle,
  Flag,
  Search,
  Building2,
} from 'lucide-react';
import { PRIORITIES, LABEL_COLORS, useKanbanContext } from '../../context/KanbanContext';

const CardDetailModal = ({
  isOpen,
  onClose,
  card,
  list,
  board,
  onUpdateCard,
  onDeleteCard,
}) => {
  const {
    getCommentsByCard,
    addComment,
    deleteComment,
    getActivitiesByCard,
    assignLabelToCard,
    removeLabelFromCard,
    searchEmployees,
    getAllDepartments,
  } = useKanbanContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setPriority(card.priority || 'MEDIUM');
      setDueDate(card.dueDate || '');
    }
  }, [card]);

  // Load comments and activities when card changes
  useEffect(() => {
    if (!isOpen || !card) {
      setComments([]);
      setActivities([]);
      return;
    }

    // Load comments (async)
    setIsLoadingComments(true);
    getCommentsByCard(card.id)
      .then(data => {
        setComments(Array.isArray(data) ? data : []);
        setIsLoadingComments(false);
      })
      .catch(error => {
        console.warn('Failed to load comments:', error);
        setComments([]);
        setIsLoadingComments(false);
      });

    // Load activities (async)
    setIsLoadingActivities(true);
    getActivitiesByCard(card.id)
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
        setIsLoadingActivities(false);
      })
      .catch(error => {
        console.warn('Failed to load activities:', error);
        setActivities([]);
        setIsLoadingActivities(false);
      });
  }, [isOpen, card, getCommentsByCard, getActivitiesByCard]);

  if (!isOpen || !card) return null;
  
  // Safety checks
  if (!board || !list) {
    console.warn('CardDetailModal: Missing board or list data');
    return null;
  }
  
  const currentPriority = PRIORITIES[priority] || PRIORITIES.MEDIUM;
  const isOverdue = dueDate && new Date(dueDate) < new Date();

  const handleSaveTitle = () => {
    if (title.trim() && title !== card.title) {
      onUpdateCard({ title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (description !== card.description) {
      onUpdateCard({ description });
    }
    setIsEditingDesc(false);
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    onUpdateCard({ priority: newPriority });
  };

  const handleDueDateChange = (newDate) => {
    setDueDate(newDate);
    onUpdateCard({ dueDate: newDate || null });
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await addComment(card.id, {
          content: newComment.trim(),
          authorName: 'Current User',
        });
        setNewComment('');
        // Reload comments after adding
        const updatedComments = await getCommentsByCard(card.id);
        setComments(Array.isArray(updatedComments) ? updatedComments : []);
      } catch (error) {
        console.warn('Failed to add comment:', error);
        // Comment API chưa có trong BE, nhưng không crash app
      }
    }
  };

  const handleToggleLabel = async (label) => {
    try {
      const hasLabel = card.labels?.some(l => l.id === label.id);
      if (hasLabel) {
        await removeLabelFromCard(board.id, list.id, card.id, label.id);
      } else {
        await assignLabelToCard(board.id, list.id, card.id, label.id);
      }
    } catch (error) {
      console.error('Failed to toggle label:', error);
      toast.error('Có lỗi xảy ra khi thay đổi label');
    }
  };

  const handleToggleAssignee = (employee) => {
    // BE cần assigneeIds là mảng Long (number) - đây là Employee.id (primary key)
    // Employee.id là Long, employeeId là String (mã nhân viên như "EMP003")
    const employeeId = employee.id != null ? Number(employee.id) : null;
    
    if (!employeeId || isNaN(employeeId)) {
      console.error('❌ Invalid employee ID:', employee);
      toast.error('ID nhân viên không hợp lệ');
      return;
    }
    
    // Get current assigneeIds from card (Long IDs)
    const currentAssigneeIds = (card.assigneeIds || []).map(id => Number(id)).filter(id => !isNaN(id));
    
    const isAssigned = currentAssigneeIds.includes(employeeId);
    
    const newAssigneeIds = isAssigned
      ? currentAssigneeIds.filter(id => id !== employeeId)
      : [...currentAssigneeIds, employeeId];
    
    // BE chỉ nhận assigneeIds (mảng Long/number) - Employee.id
    onUpdateCard({ assigneeIds: newAssigneeIds });
  };

  // Get filtered employees list
  const departments = getAllDepartments();
  const filteredEmployees = searchEmployees(employeeSearch, selectedDepartment);

  const getLabelColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-500 hover:bg-green-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      red: 'bg-red-500 hover:bg-red-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      blue: 'bg-blue-500 hover:bg-blue-600',
      cyan: 'bg-cyan-500 hover:bg-cyan-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
      lime: 'bg-lime-500 hover:bg-lime-600',
      gray: 'bg-gray-500 hover:bg-gray-600',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-3xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <CreditCard className="w-6 h-6 text-gray-500 mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') {
                      setTitle(card.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-full text-xl font-semibold px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded -ml-2"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {card.title}
                </h2>
              )}
              <p className="text-sm text-gray-500 mt-1 px-2">
                trong danh sách <span className="font-medium">{list?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6 space-y-6">
            {/* Labels */}
            {card.labels && card.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Nhãn</h3>
                <div className="flex flex-wrap gap-2">
                  {card.labels.map((label) => (
                    <span
                      key={label.id}
                      className={`px-3 py-1 rounded text-white text-sm font-medium ${getLabelColorClass(label.color)}`}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assignees */}
            {card.assignees && card.assignees.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Thành viên được giao</h3>
                <div className="flex flex-wrap gap-2">
                  {card.assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                      title={`${assignee.department || ''} • ${assignee.position || ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {assignee.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assignee.name}</p>
                        {assignee.department && (
                          <p className="text-xs text-gray-500">{assignee.department}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Due Date & Priority */}
            <div className="flex flex-wrap gap-4">
              {dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</h3>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isOverdue && <AlertTriangle className="w-4 h-4" />}
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatDate(dueDate)}</span>
                    {isOverdue && <span className="text-xs">(Quá hạn)</span>}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</h3>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentPriority.color} text-white`}>
                  <Flag className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentPriority.label}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-gray-900">Mô tả</h3>
              </div>
              {isEditingDesc ? (
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Thêm mô tả chi tiết..."
                    autoFocus
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleSaveDescription}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setDescription(card.description || '');
                        setIsEditingDesc(false);
                      }}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm rounded-lg"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 min-h-20"
                  onClick={() => setIsEditingDesc(true)}
                >
                  {description ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400">Thêm mô tả chi tiết...</p>
                  )}
                </div>
              )}
            </div>

            {/* Tabs for Comments and Activity */}
            <div>
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Bình luận ({comments.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Hoạt động
                  </div>
                </button>
              </div>

              {activeTab === 'details' && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                      U
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
                        className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Gửi
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                        {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{comment.content}</p>
                        <button
                          onClick={async () => {
                            try {
                              await deleteComment(card.id, comment.id);
                              // Reload comments after deleting
                              const updatedComments = await getCommentsByCard(card.id);
                              setComments(Array.isArray(updatedComments) ? updatedComments : []);
                            } catch (error) {
                              console.warn('Failed to delete comment:', error);
                              // Comment API chưa có trong BE, nhưng không crash app
                            }
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 mt-1"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Chưa có bình luận nào</p>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium shrink-0">
                        {activity.actorName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium text-gray-900">{activity.actorName}</span>
                          {' '}<span className="text-gray-600">{activity.description}</span>
                        </p>
                        <span className="text-xs text-gray-400">{formatDateTime(activity.createdAt)}</span>
                      </div>
                    </div>
                  ))}

                  {activities.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Chưa có hoạt động nào</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:w-52 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l bg-gray-50 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thêm vào thẻ</h4>

            {/* Labels */}
            <div className="relative">
              <button
                onClick={() => setShowLabelPicker(!showLabelPicker)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <Tag className="w-4 h-4" />
                <span>Nhãn</span>
              </button>
              {showLabelPicker && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLabelPicker(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg p-3 z-20">
                    <p className="text-xs font-medium text-gray-500 mb-2">Chọn nhãn</p>
                    <div className="space-y-1">
                      {board?.labels?.map((label) => {
                        const isSelected = card.labels?.some(l => l.id === label.id);
                        return (
                          <button
                            key={label.id}
                            onClick={() => handleToggleLabel(label)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                              isSelected ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <span className={`flex-1 h-7 rounded ${getLabelColorClass(label.color)} flex items-center px-2 text-white text-sm`}>
                              {label.name}
                            </span>
                            {isSelected && <CheckSquare className="w-4 h-4 text-blue-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Members */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMemberPicker(!showMemberPicker);
                  if (!showMemberPicker) {
                    setEmployeeSearch('');
                    setSelectedDepartment('all');
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Thành viên</span>
              </button>
              {showMemberPicker && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMemberPicker(false)} />
                  <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-1 bg-white rounded-lg shadow-lg p-3 z-20 w-72 max-h-96 overflow-hidden flex flex-col">
                    <p className="text-xs font-medium text-gray-500 mb-2">Chọn nhân viên</p>

                    {/* Search Input */}
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        placeholder="Tìm theo tên, email..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>

                    {/* Department Filter */}
                    <div className="relative mb-2">
                      <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả phòng ban</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Employee List */}
                    <div className="space-y-1 overflow-y-auto flex-1 max-h-52">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => {
                          const isAssigned = card.assignees?.some(a => a.id === employee.id);
                          return (
                            <button
                              key={employee.id}
                              onClick={() => handleToggleAssignee(employee)}
                              className={`w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
                                isAssigned ? 'bg-blue-50 ring-1 ring-blue-200' : ''
                              }`}
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                                {employee.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
                                <p className="text-xs text-gray-500 truncate">{employee.department} • {employee.position}</p>
                              </div>
                              {isAssigned && <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">Không tìm thấy nhân viên</p>
                      )}
                    </div>

                    {/* Selected count */}
                    {card.assignees && card.assignees.length > 0 && (
                      <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                        Đã chọn: {card.assignees.length} nhân viên
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span>Ngày hết hạn</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className="absolute opacity-0 w-0 h-0"
                />
              </label>
              {dueDate && (
                <div className="flex items-center justify-between mt-1 px-2">
                  <span className="text-xs text-gray-500">{formatDate(dueDate)}</span>
                  <button
                    onClick={() => handleDueDateChange('')}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>

            <hr className="my-4" />

            {/* Priority */}
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Độ ưu tiên</h4>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(PRIORITIES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handlePriorityChange(key)}
                  className={`px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                    priority === key
                      ? `${value.color} text-white`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <hr className="my-4" />

            {/* Actions */}
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</h4>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa thẻ này?')) {
                  onDeleteCard();
                  onClose();
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa thẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
