import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import {
  Kanban, Building2, Users, TrendingUp, Briefcase, Search,
  ArrowLeft, CheckSquare, Clock, AlertCircle, Filter, Calendar, MessageSquare, Paperclip,
  X, Flag, User
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

// Task View Modal (read-only)
const TaskViewModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const priorityLabels = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  };

  const columnLabels = {
    todo: 'Cần làm',
    inProgress: 'Đang làm',
    review: 'Đang review',
    done: 'Hoàn thành',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa đặt';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.columnId !== 'done';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">Chi tiết công việc</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Tiêu đề</label>
            <p className="text-lg font-semibold text-gray-900">{task.title}</p>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Mô tả</label>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                <CheckSquare className="w-4 h-4 inline mr-1" />
                Trạng thái
              </label>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {columnLabels[task.columnId] || task.columnId}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Độ ưu tiên
              </label>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Hạn hoàn thành
            </label>
            <p className={`text-gray-700 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              {formatDate(task.dueDate)}
              {isOverdue && <span className="ml-2 text-sm">(Quá hạn)</span>}
            </p>
          </div>

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Người thực hiện
              </label>
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((assignee, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                      {assignee.charAt(0)}
                    </div>
                    {assignee}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 pt-4 border-t text-sm text-gray-500">
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {task.comments} bình luận
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-4 h-4" />
                {task.attachments} tệp đính kèm
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Read-only Task Card (no edit/delete menu)
const ReadOnlyTaskCard = ({ task, onViewTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  const priorityLabels = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const handleClick = (e) => {
    // Only trigger view if not dragging
    if (!isDragging && onViewTask) {
      onViewTask(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all ${
        isDragging ? 'shadow-lg ring-2 ring-blue-400 cursor-grabbing' : ''
      }`}
    >
      {/* Header with priority - NO menu */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
        <span className="text-xs text-gray-500">{priorityLabels[task.priority]}</span>
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Difficulty Badge */}
      {task.difficulty !== undefined && task.difficulty > 0 && (
        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            task.difficulty >= 80 ? 'bg-red-100 text-red-700' :
            task.difficulty >= 60 ? 'bg-orange-100 text-orange-700' :
            task.difficulty >= 40 ? 'bg-yellow-100 text-yellow-700' :
            task.difficulty >= 20 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {task.difficulty >= 80 ? 'Rất khó' :
             task.difficulty >= 60 ? 'Khó' :
             task.difficulty >= 40 ? 'Trung bình' :
             task.difficulty >= 20 ? 'Dễ' : 'Rất dễ'}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assignees && task.assignees.slice(0, 3).map((assignee, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={assignee}
            >
              {assignee.charAt(0)}
            </div>
          ))}
          {task.assignees && task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments}
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {task.attachments}
            </div>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Read-only Column (no add button)
const ReadOnlyTaskColumn = ({ column, tasks, onViewTask }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const columnColors = {
    todo: { header: 'from-gray-500 to-gray-600', bg: 'bg-gray-50' },
    inProgress: { header: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    review: { header: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    done: { header: 'from-green-500 to-green-600', bg: 'bg-green-50' },
  };

  const color = columnColors[column.id] || columnColors.todo;

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header - NO add button */}
      <div className={`bg-gradient-to-r ${color.header} rounded-t-xl p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>{column.title}</span>
            <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
              {tasks.length}
            </span>
          </h3>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`${color.bg} rounded-b-xl border-x border-b border-gray-200 p-3 min-h-[400px] max-h-[calc(100vh-320px)] overflow-y-auto transition-colors ${
          isOver ? 'ring-2 ring-blue-400 ring-inset' : ''
        }`}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <ReadOnlyTaskCard key={task.id} task={task} onViewTask={onViewTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Không có task</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EmployeeTaskBoard = () => {
  const navigate = useNavigate();
  const { departments, setDepartments } = useTaskContext();
  const [activeId, setActiveId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTask, setViewTask] = useState(null);

  // Columns
  const columns = [
    { id: 'todo', title: 'Cần làm' },
    { id: 'inProgress', title: 'Đang làm' },
    { id: 'review', title: 'Đang review' },
    { id: 'done', title: 'Hoàn thành' },
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', gradient: 'from-red-500 to-red-600' },
  };

  const IconComponent = ({ name, size = 24, className = '' }) => {
    const icons = { Building2, Users, Briefcase, TrendingUp };
    const Icon = icons[name] || Building2;
    return <Icon size={size} className={className} />;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Get current department
  const currentDepartment = selectedDepartment
    ? departments.find(d => d.id === selectedDepartment.id)
    : null;

  // Filter departments by search
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate overall stats
  const overallStats = {
    totalDepartments: departments.length,
    totalTasks: departments.reduce((sum, d) => sum + d.tasks.length, 0),
    todo: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'todo').length, 0),
    inProgress: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'inProgress').length, 0),
    review: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'review').length, 0),
    done: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'done').length, 0),
  };

  // Drag handlers - Employee can drag to update status
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !currentDepartment) return;

    const activeTaskId = active.id;
    const overId = over.id;
    if (activeTaskId === overId) return;

    const tasks = currentDepartment.tasks;
    const activeTask = tasks.find(task => task.id === activeTaskId);
    const overTask = tasks.find(task => task.id === overId);
    if (!activeTask) return;

    // Dropping over a column
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      setDepartments(prev => prev.map(dept => {
        if (dept.id === selectedDepartment.id) {
          return {
            ...dept,
            tasks: dept.tasks.map(task =>
              task.id === activeTaskId ? { ...task, columnId: overColumn.id } : task
            )
          };
        }
        return dept;
      }));
      return;
    }

    // Dropping over another task
    if (overTask && activeTask.columnId !== overTask.columnId) {
      setDepartments(prev => prev.map(dept => {
        if (dept.id === selectedDepartment.id) {
          return {
            ...dept,
            tasks: dept.tasks.map(task =>
              task.id === activeTaskId ? { ...task, columnId: overTask.columnId } : task
            )
          };
        }
        return dept;
      }));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !currentDepartment) {
      setActiveId(null);
      return;
    }

    const activeTaskId = active.id;
    const overId = over.id;

    const tasks = currentDepartment.tasks;
    const activeTask = tasks.find(task => task.id === activeTaskId);
    const overTask = tasks.find(task => task.id === overId);

    if (!activeTask) {
      setActiveId(null);
      return;
    }

    if (activeTask.columnId === overTask?.columnId) {
      const columnTasks = tasks.filter(task => task.columnId === activeTask.columnId);
      const oldIndex = columnTasks.findIndex(task => task.id === activeTaskId);
      const newIndex = columnTasks.findIndex(task => task.id === overId);

      if (oldIndex !== newIndex) {
        const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        setDepartments(prev => prev.map(dept => {
          if (dept.id === selectedDepartment.id) {
            const otherTasks = dept.tasks.filter(t => t.columnId !== activeTask.columnId);
            return {
              ...dept,
              tasks: [...otherTasks, ...newColumnTasks]
            };
          }
          return dept;
        }));
      }
    }

    setActiveId(null);
  };

  const activeTask = currentDepartment?.tasks.find(task => task.id === activeId);

  // Department Selection View
  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/employee')}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Kanban className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Công việc các phòng ban</h1>
            </div>
            <p className="text-gray-500 ml-20">Xem công việc của các phòng ban trong công ty</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalDepartments}</p>
                  <p className="text-sm text-gray-500">Phòng ban</p>
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
              placeholder="Tìm kiếm phòng ban..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => {
              const color = colorClasses[dept.color];
              const deptStats = {
                todo: dept.tasks.filter(t => t.columnId === 'todo').length,
                inProgress: dept.tasks.filter(t => t.columnId === 'inProgress').length,
                review: dept.tasks.filter(t => t.columnId === 'review').length,
                done: dept.tasks.filter(t => t.columnId === 'done').length,
              };

              // Calculate overall progress for department based on column status
              const getColumnProgress = (columnId) => {
                switch (columnId) {
                  case 'done': return 100;
                  case 'review': return 75;
                  case 'inProgress': return 50;
                  case 'todo': return 0;
                  default: return 0;
                }
              };
              const totalProgress = dept.tasks.length > 0
                ? Math.round(dept.tasks.reduce((sum, t) => sum + getColumnProgress(t.columnId), 0) / dept.tasks.length)
                : 0;

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`bg-white rounded-xl border ${color.border} p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${color.bg}`}>
                      <IconComponent name={dept.icon} size={24} className={color.text} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-500">{dept.code} • {dept.members} thành viên</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{dept.description}</p>

                  {/* Overall Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Tiến độ tổng</span>
                      <span className={`font-bold ${
                        totalProgress === 100 ? 'text-green-600' :
                        totalProgress >= 75 ? 'text-blue-600' :
                        totalProgress >= 50 ? 'text-yellow-600' :
                        totalProgress >= 25 ? 'text-orange-600' : 'text-red-600'
                      }`}>{totalProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          totalProgress === 100 ? 'bg-green-500' :
                          totalProgress >= 75 ? 'bg-blue-500' :
                          totalProgress >= 50 ? 'bg-yellow-500' :
                          totalProgress >= 25 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Stats */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-600">{deptStats.todo}</p>
                      <p className="text-xs text-gray-500">Cần làm</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{deptStats.inProgress}</p>
                      <p className="text-xs text-gray-500">Đang làm</p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded-lg">
                      <p className="text-lg font-bold text-amber-600">{deptStats.review}</p>
                      <p className="text-xs text-gray-500">Review</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{deptStats.done}</p>
                      <p className="text-xs text-gray-500">Xong</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Kanban Board View (Read-only - no add/edit/delete)
  const color = colorClasses[selectedDepartment.color];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${color.gradient} text-white px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedDepartment(null)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{currentDepartment?.name}</h1>
              <p className="text-white/80 text-sm">
                {currentDepartment?.tasks.length} công việc • {currentDepartment?.members} thành viên
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Tìm kiếm task..."
                className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
              />
            </div>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-max">
            {columns.map(column => {
              const columnTasks = currentDepartment?.tasks.filter(task => task.columnId === column.id) || [];
              return (
                <ReadOnlyTaskColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onViewTask={setViewTask}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-90">
                <ReadOnlyTaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task View Modal */}
      <TaskViewModal
        isOpen={!!viewTask}
        onClose={() => setViewTask(null)}
        task={viewTask}
      />
    </div>
  );
};

export default EmployeeTaskBoard;
