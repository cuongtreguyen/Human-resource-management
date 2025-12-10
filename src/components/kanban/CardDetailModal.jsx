// src/components/kanban/CardDetailModal.jsx
// Card Detail Modal with Checklist, Attachments, Comments, Activities - Trello Style

import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Upload,
  Download,
  File,
  Image,
  FileText,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { PRIORITIES, LABEL_COLORS, useKanbanContext } from '../../context/KanbanContext';
import {
  checklistService,
  attachmentService,
  activityService,
  commentService
} from '../../services/kanbanService';
import { toast } from 'react-toastify';

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

  // Basic card state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // UI state
  const [newComment, setNewComment] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Data state
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Loading state
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoadingChecklists, setIsLoadingChecklists] = useState(false);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);

  // Checklist state
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [showChecklistSection, setShowChecklistSection] = useState(true);

  // Attachment state
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentSection, setShowAttachmentSection] = useState(true);
  const fileInputRef = useRef(null);

  // Initialize card data
  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setPriority(card.priority || 'MEDIUM');
      setDueDate(card.dueDate || '');
    }
  }, [card]);

  // Load all data when card changes
  useEffect(() => {
    if (!isOpen || !card) {
      setComments([]);
      setActivities([]);
      setChecklists([]);
      setAttachments([]);
      return;
    }

    loadComments();
    loadActivities();
    loadChecklists();
    loadAttachments();
  }, [isOpen, card?.id]);

  // Load functions
  const loadComments = async () => {
    if (!card?.id) return;
    setIsLoadingComments(true);
    try {
      const data = await getCommentsByCard(card.id);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('Failed to load comments:', error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const loadActivities = async () => {
    if (!card?.id) return;
    setIsLoadingActivities(true);
    try {
      const data = await activityService.getByCard(card.id);
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('Failed to load activities:', error);
      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const loadChecklists = async () => {
    if (!card?.id) return;
    setIsLoadingChecklists(true);
    try {
      const data = await checklistService.getByCard(card.id);
      setChecklists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('Failed to load checklists:', error);
      setChecklists([]);
    } finally {
      setIsLoadingChecklists(false);
    }
  };

  const loadAttachments = async () => {
    if (!card?.id) return;
    setIsLoadingAttachments(true);
    try {
      const data = await attachmentService.getByCard(card.id);
      setAttachments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('Failed to load attachments:', error);
      setAttachments([]);
    } finally {
      setIsLoadingAttachments(false);
    }
  };

  if (!isOpen || !card) return null;

  // Safety checks
  if (!board || !list) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lỗi</h2>
          <p className="text-gray-600 mb-4">Không thể tải thông tin task. Vui lòng thử lại.</p>
          <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const currentPriority = PRIORITIES[priority] || PRIORITIES.MEDIUM;
  const isOverdue = dueDate && new Date(dueDate) < new Date();

  // Calculate checklist progress
  const checklistProgress = checklists.length > 0
    ? {
        completed: checklists.filter(c => c.completed).length,
        total: checklists.length,
        percent: Math.round((checklists.filter(c => c.completed).length / checklists.length) * 100)
      }
    : null;

  // Handlers
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
    // BE expects LocalDateTime format, append time if only date provided
    const formattedDate = newDate ? `${newDate}T23:59:59` : null;
    onUpdateCard({ dueDate: formattedDate });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(card.id, { content: newComment.trim() });
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.warn('Failed to add comment:', error);
    }
  };

  // Checklist handlers
  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    try {
      await checklistService.create(card.id, { title: newChecklistTitle.trim() });
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
      await loadChecklists();
      toast.success('Thêm checklist thành công!');
    } catch (error) {
      console.error('Failed to add checklist:', error);
      toast.error('Không thể thêm checklist');
    }
  };

  const handleToggleChecklist = async (checklistId) => {
    try {
      await checklistService.toggle(checklistId);
      await loadChecklists();
    } catch (error) {
      console.error('Failed to toggle checklist:', error);
      toast.error('Không thể cập nhật checklist');
    }
  };

  const handleDeleteChecklist = async (checklistId) => {
    try {
      await checklistService.delete(checklistId);
      await loadChecklists();
      toast.success('Đã xóa checklist');
    } catch (error) {
      console.error('Failed to delete checklist:', error);
      toast.error('Không thể xóa checklist');
    }
  };

  // Attachment handlers
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File quá lớn. Tối đa 10MB');
      return;
    }

    setIsUploading(true);
    try {
      await attachmentService.upload(card.id, file);
      await loadAttachments();
      toast.success('Upload file thành công!');
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error('Không thể upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadAttachment = async (attachment) => {
    try {
      const blob = await attachmentService.download(attachment.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error('Không thể tải file');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa file này?')) return;
    try {
      await attachmentService.delete(attachmentId);
      await loadAttachments();
      toast.success('Đã xóa file');
    } catch (error) {
      console.error('Failed to delete attachment:', error);
      toast.error('Không thể xóa file');
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
    // BE trả về numericId (Long DB ID) và id (String mã NV như EMP001)
    // Ưu tiên dùng numericId cho Kanban assignee
    let employeeId = employee.numericId != null ? Number(employee.numericId) :
                     (employee.id != null ? Number(employee.id) : null);

    if (!employeeId || isNaN(employeeId) || employeeId <= 0) {
      toast.error(`Không thể thêm nhân viên - ID không hợp lệ`);
      return;
    }

    const currentAssigneeIds = (card.assigneeIds || []).map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
    const isAssigned = currentAssigneeIds.includes(employeeId);

    const newAssigneeIds = isAssigned
      ? currentAssigneeIds.filter(id => id !== employeeId)
      : [...currentAssigneeIds, employeeId];

    onUpdateCard({ assigneeIds: newAssigneeIds });
  };

  // Get filtered employees
  const departments = getAllDepartments();
  const filteredEmployees = searchEmployees(employeeSearch, selectedDepartment);

  // Helper functions
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
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />;
    if (fileType?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <CreditCard className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
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
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-white/50 px-2 py-1 rounded -ml-2"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {card.title}
                </h2>
              )}
              <p className="text-sm text-gray-500 mt-1 px-2">
                trong danh sách <span className="font-medium text-blue-600">{list?.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto max-h-[70vh]">
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
                  {card.assignees.map((assignee) => {
                    const assigneeName = assignee.fullName || assignee.name || 'Unknown';
                    return (
                      <div key={assignee.id} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {assigneeName.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assigneeName}</p>
                          {assignee.department && <p className="text-xs text-gray-500">{assignee.department}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Due Date & Priority */}
            <div className="flex flex-wrap gap-4">
              {dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</h3>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
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
                    <button onClick={handleSaveDescription} className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                      Lưu
                    </button>
                    <button onClick={() => { setDescription(card.description || ''); setIsEditingDesc(false); }} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm rounded-lg">
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 min-h-20" onClick={() => setIsEditingDesc(true)}>
                  {description ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400">Thêm mô tả chi tiết...</p>
                  )}
                </div>
              )}
            </div>

            {/* Checklist Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowChecklistSection(!showChecklistSection)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Checklist</span>
                  {checklistProgress && (
                    <span className="text-sm text-gray-500">({checklistProgress.completed}/{checklistProgress.total})</span>
                  )}
                </div>
                {showChecklistSection ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {showChecklistSection && (
                <div className="p-3 space-y-3">
                  {/* Progress Bar */}
                  {checklistProgress && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">{checklistProgress.percent}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${checklistProgress.percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${checklistProgress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Checklist Items */}
                  {isLoadingChecklists ? (
                    <div className="text-center py-4 text-gray-400">Đang tải...</div>
                  ) : (
                    <div className="space-y-2">
                      {checklists.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleChecklist(item.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {item.title}
                          </span>
                          <button
                            onClick={() => handleDeleteChecklist(item.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Checklist Item */}
                  {isAddingChecklist ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newChecklistTitle}
                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddChecklist();
                          if (e.key === 'Escape') { setIsAddingChecklist(false); setNewChecklistTitle(''); }
                        }}
                        placeholder="Nhập nội dung..."
                        className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button onClick={handleAddChecklist} className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Thêm
                      </button>
                      <button onClick={() => { setIsAddingChecklist(false); setNewChecklistTitle(''); }} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingChecklist(true)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm mục
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Attachments Section */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowAttachmentSection(!showAttachmentSection)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Đính kèm</span>
                  {attachments.length > 0 && <span className="text-sm text-gray-500">({attachments.length})</span>}
                </div>
                {showAttachmentSection ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {showAttachmentSection && (
                <div className="p-3 space-y-3">
                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors w-full justify-center"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-600">Đang upload...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Thêm file đính kèm</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Attachment List */}
                  {isLoadingAttachments ? (
                    <div className="text-center py-4 text-gray-400">Đang tải...</div>
                  ) : attachments.length > 0 ? (
                    <div className="space-y-2">
                      {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100">
                          {getFileIcon(attachment.fileType)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)} • {formatDateTime(attachment.uploadedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDownloadAttachment(attachment)}
                              className="p-1 hover:bg-blue-100 rounded"
                              title="Tải xuống"
                            >
                              <Download className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttachment(attachment.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 text-sm py-2">Chưa có file đính kèm</p>
                  )}
                </div>
              )}
            </div>

            {/* Tabs for Comments and Activity */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex border-b bg-gray-50">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === 'details' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Bình luận ({comments.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === 'activity' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" />
                    Hoạt động ({activities.length})
                  </div>
                </button>
              </div>

              <div className="p-4">
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
                    {isLoadingComments ? (
                      <div className="text-center py-4 text-gray-400">Đang tải...</div>
                    ) : comments.length > 0 ? (
                      comments.map((comment) => (
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
                                  await loadComments();
                                } catch (error) {
                                  console.warn('Failed to delete comment:', error);
                                }
                              }}
                              className="text-xs text-gray-400 hover:text-red-500 mt-1"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-4">Chưa có bình luận nào</p>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3">
                    {isLoadingActivities ? (
                      <div className="text-center py-4 text-gray-400">Đang tải...</div>
                    ) : activities.length > 0 ? (
                      activities.map((activity) => (
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
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-4">Chưa có hoạt động nào</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:w-56 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l bg-gray-50 space-y-3">
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
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
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
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Employee List */}
                    <div className="space-y-1 overflow-y-auto flex-1 max-h-52">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => {
                          // BE trả về numericId (Long DB ID) và id (String mã NV như EMP001)
                          const employeeId = employee.numericId != null ? Number(employee.numericId) :
                                            (employee.id != null ? Number(employee.id) : null);
                          const isValidEmployee = employeeId && !isNaN(employeeId) && employeeId > 0;
                          const isAssigned = isValidEmployee && (
                            (card.assigneeIds || []).some(id => Number(id) === employeeId) ||
                            (card.assignees || []).some(a => Number(a.id) === employeeId || Number(a.numericId) === employeeId)
                          );
                          // BE returns fullName or name - support both
                          const displayName = employee.fullName || employee.name || 'Unknown';

                          return (
                            <button
                              key={employee.id}
                              onClick={() => isValidEmployee && handleToggleAssignee(employee)}
                              disabled={!isValidEmployee}
                              className={`w-full flex items-center gap-2 px-2 py-2 rounded transition-colors ${
                                !isValidEmployee ? 'opacity-50 cursor-not-allowed bg-gray-50' :
                                isAssigned ? 'bg-blue-50 ring-1 ring-blue-200 hover:bg-blue-100' : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                                {displayName.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
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

                    {card.assignees && card.assignees.length > 0 && (
                      <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                        Đã chọn: {card.assignees.length} nhân viên
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Checklist Button */}
            <button
              onClick={() => { setShowChecklistSection(true); setIsAddingChecklist(true); }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Checklist</span>
            </button>

            {/* Attachment Button */}
            <button
              onClick={() => { setShowAttachmentSection(true); fileInputRef.current?.click(); }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              <span>Đính kèm</span>
            </button>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors">
                <Calendar className="w-4 h-4" />
                <span className="flex-1">Ngày hết hạn</span>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {dueDate && (
                <button
                  onClick={() => handleDueDateChange('')}
                  className="w-full mt-1 text-xs text-red-500 hover:text-red-700 text-center py-1"
                >
                  Xóa ngày hết hạn
                </button>
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
                    priority === key ? `${value.color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
