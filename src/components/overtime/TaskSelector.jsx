import React from 'react';
import { Calendar, Flag, Clock } from 'lucide-react';

const priorityColors = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50'
};

const priorityLabels = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp'
};

const statusLabels = {
  todo: 'Chưa bắt đầu',
  inProgress: 'Đang làm',
  review: 'Đang review'
};

const TaskSelector = ({
  tasks = [],
  selectedTask,
  onSelect,
  disabled = false,
  placeholder = 'Chọn task cần làm OT...'
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-2">
      <select
        value={selectedTask?.id || ''}
        onChange={(e) => {
          const task = tasks.find(t => t.id === e.target.value);
          onSelect(task || null);
        }}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      >
        <option value="">{placeholder}</option>
        {tasks.map(task => (
          <option key={task.id} value={task.id}>
            {task.title} - Deadline: {formatDate(task.dueDate)} ({task.departmentName})
          </option>
        ))}
      </select>

      {/* Selected Task Details */}
      {selectedTask && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h4>

          <p className="text-sm text-gray-600 mb-3">{selectedTask.description}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            {/* Priority */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${priorityColors[selectedTask.priority]}`}>
              <Flag className="w-3 h-3" />
              {priorityLabels[selectedTask.priority]}
            </span>

            {/* Status */}
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600">
              <Clock className="w-3 h-3" />
              {statusLabels[selectedTask.columnId]}
            </span>

            {/* Deadline */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
              isOverdue(selectedTask.dueDate)
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Calendar className="w-3 h-3" />
              {formatDate(selectedTask.dueDate)}
              {(() => {
                const daysLeft = getDaysLeft(selectedTask.dueDate);
                if (daysLeft === null) return null;
                if (daysLeft < 0) return ` (Quá hạn ${Math.abs(daysLeft)} ngày)`;
                if (daysLeft === 0) return ' (Hôm nay)';
                if (daysLeft === 1) return ' (Ngày mai)';
                return ` (Còn ${daysLeft} ngày)`;
              })()}
            </span>

            {/* Department */}
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-600">
              {selectedTask.departmentName}
            </span>
          </div>

          {/* Tags */}
          {selectedTask.tags && selectedTask.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTask.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No tasks message */}
      {tasks.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Không có task nào phù hợp để đăng ký OT. Task phải có deadline và chưa hoàn thành.
        </p>
      )}
    </div>
  );
};

export default TaskSelector;
