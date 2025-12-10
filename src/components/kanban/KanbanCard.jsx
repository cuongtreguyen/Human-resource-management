// src/components/kanban/KanbanCard.jsx
// Kanban Card Component with drag & drop support - Trello Style

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  GripVertical,
  CheckSquare,
  AlertTriangle,
  AlignLeft,
} from 'lucide-react';
import { PRIORITIES } from '../../context/KanbanContext';

const KanbanCard = ({ card, onClick, isDragging, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    disabled: isOverlay,
  });

  const style = isOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITIES[card.priority] || PRIORITIES.MEDIUM;

  // Check if overdue
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  // Parse checkItemStatus from BE (format: "completed/total" e.g. "2/5")
  const parseChecklistProgress = () => {
    if (card.checkListProgress) {
      return card.checkListProgress;
    }
    if (card.checkItemStatus) {
      const parts = card.checkItemStatus.split('/');
      if (parts.length === 2) {
        const completed = parseInt(parts[0], 10);
        const total = parseInt(parts[1], 10);
        if (!isNaN(completed) && !isNaN(total) && total > 0) {
          return { completed, total };
        }
      }
    }
    return null;
  };

  const checklistProgress = parseChecklistProgress();
  const isChecklistComplete = checklistProgress && checklistProgress.completed === checklistProgress.total && checklistProgress.total > 0;

  // Get label color class
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
      lime: 'bg-lime-500',
      gray: 'bg-gray-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const handleCardClick = (e) => {
    if (!isSortableDragging && onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group ${
        (isDragging || isSortableDragging) ? 'opacity-50 shadow-lg rotate-2' : ''
      } ${isOverlay ? 'shadow-2xl' : ''}`}
      onClick={handleCardClick}
    >
      {/* Labels - Trello style colored bars */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 pb-0">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className={`h-2 w-12 rounded-sm ${getLabelColorClass(label.color)} hover:h-4 transition-all cursor-pointer`}
              title={label.name}
            />
          ))}
        </div>
      )}

      <div className="p-3">
        {/* Drag Handle & Title */}
        <div className="flex items-start gap-2">
          <div className="p-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 leading-snug">{card.title}</h4>
          </div>
        </div>

        {/* Meta Info Row - Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {/* Priority Badge */}
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.color} text-white`}>
            {priority.label}
          </span>

          {/* Due Date */}
          {card.dueDate && (
            <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
              isOverdue ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              <Calendar className="w-3 h-3" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}

          {/* Description indicator */}
          {card.description && (
            <div className="flex items-center text-gray-400" title="Có mô tả">
              <AlignLeft className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Checklist Progress */}
          {checklistProgress && checklistProgress.total > 0 && (
            <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
              isChecklistComplete ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <CheckSquare className="w-3 h-3" />
              <span>{checklistProgress.completed}/{checklistProgress.total}</span>
            </div>
          )}

          {/* Comments */}
          {(card.commentCount > 0 || card.comments?.length > 0) && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>{card.commentCount || card.comments?.length || 0}</span>
            </div>
          )}

          {/* Attachments */}
          {(card.attachmentCount > 0 || card.attachments?.length > 0) && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Paperclip className="w-3 h-3" />
              <span>{card.attachmentCount || card.attachments?.length || 0}</span>
            </div>
          )}
        </div>

        {/* Assignees - Trello style avatars */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center justify-end gap-0 mt-3 -mb-1">
            {card.assignees.slice(0, 4).map((assignee, idx) => {
              const assigneeName = assignee.fullName || assignee.name || 'Unknown';
              return (
                <div
                  key={assignee.id || idx}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white -ml-2 first:ml-0 hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                  title={`${assigneeName}${assignee.department ? ` - ${assignee.department}` : ''}`}
                >
                  {assigneeName.charAt(0)?.toUpperCase() || '?'}
                </div>
              );
            })}
            {card.assignees.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white -ml-2">
                +{card.assignees.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
