import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskColumn = ({ column, tasks, onAddTask, onEditTask, onDeleteTask }) => {
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
      {/* Column Header */}
      <div className={`bg-gradient-to-r ${color.header} rounded-t-xl p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>{column.title}</span>
            <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
              {tasks.length}
            </span>
          </h3>
          {column.id === 'todo' && (
            <button
              onClick={() => onAddTask(column.id)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <Plus size={18} />
            </button>
          )}
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
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Không có task</p>
            {column.id === 'todo' && (
              <button
                onClick={() => onAddTask(column.id)}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 mx-auto mt-2"
              >
                <Plus size={14} />
                Thêm task mới
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
