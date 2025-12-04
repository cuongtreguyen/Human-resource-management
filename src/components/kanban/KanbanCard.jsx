// src/components/kanban/KanbanCard.jsx
// Kanban Card Component with drag & drop support

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
    disabled: isOverlay, // Disable sortable for overlay
  });

  const style = isOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITIES[card.priority] || PRIORITIES.MEDIUM;

  // Check if overdue
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && card.listId !== 'done';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

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
    // Only trigger click if not dragging
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
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 pb-0">
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
        {/* Drag Handle & Title */}
        <div className="flex items-start gap-2">
          <div className="p-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 leading-snug">{card.title}</h4>
            {card.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
            )}
          </div>
        </div>

        {/* Meta Info Row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {/* Priority Badge */}
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.color} text-white`}>
            {priority.label}
          </span>

          {/* Due Date */}
          {card.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-gray-500'}`}>
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              <Calendar className="w-3 h-3" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}

          {/* Checklist Progress */}
          {card.checkListProgress && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <CheckSquare className="w-3 h-3" />
              <span>{card.checkListProgress.completed}/{card.checkListProgress.total}</span>
            </div>
          )}

          {/* Comments */}
          {card.commentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>{card.commentCount}</span>
            </div>
          )}

          {/* Attachments */}
          {card.attachmentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Paperclip className="w-3 h-3" />
              <span>{card.attachmentCount}</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center justify-end gap-1 mt-3 -mb-1">
            {card.assignees.slice(0, 3).map((assignee, idx) => (
              <div
                key={assignee.id || idx}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white -ml-2 first:ml-0"
                title={assignee.name}
              >
                {assignee.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white -ml-2">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
