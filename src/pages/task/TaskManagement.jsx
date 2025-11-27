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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Layout from '../../components/layout/Layout';
import TaskCard from '../../components/task/TaskCard';
import TaskModal from '../../components/task/TaskModal';
import TaskColumn from '../../components/task/TaskColumn';
import {
  Kanban, Building2, Users, TrendingUp, Briefcase, Search,
  ArrowLeft, CheckSquare, Clock, AlertCircle, Filter
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

const TaskManagement = () => {
  const { departments, setDepartments } = useTaskContext();
  const [activeId, setActiveId] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Add or Edit Task
  const handleSaveTask = (taskData) => {
    if (currentTask) {
      // Edit existing task
      setDepartments(prev => prev.map(dept => {
        if (dept.id === selectedDepartment.id) {
          return {
            ...dept,
            tasks: dept.tasks.map(t => t.id === taskData.id ? taskData : t)
          };
        }
        return dept;
      }));
    } else {
      // Add new task
      const newTask = {
        ...taskData,
        id: `t${Date.now()}`,
        columnId: currentColumnId || 'todo'
      };
      setDepartments(prev => prev.map(dept => {
        if (dept.id === selectedDepartment.id) {
          return {
            ...dept,
            tasks: [...dept.tasks, newTask]
          };
        }
        return dept;
      }));
    }
    setTaskModalOpen(false);
    setCurrentTask(null);
    setCurrentColumnId(null);
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    if (!window.confirm('Bạn có chắc muốn xóa task này?')) return;
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment.id) {
        return {
          ...dept,
          tasks: dept.tasks.filter(t => t.id !== taskId)
        };
      }
      return dept;
    }));
  };

  // Edit Task
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setTaskModalOpen(true);
  };

  // Add Task
  const handleAddTask = (columnId) => {
    setCurrentColumnId(columnId);
    setCurrentTask(null);
    setTaskModalOpen(true);
  };

  // Drag handlers
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
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Kanban className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý công việc</h1>
              </div>
              <p className="text-gray-500">Chọn phòng ban để xem và quản lý công việc</p>
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
      </Layout>
    );
  }

  // Kanban Board View
  const color = colorClasses[selectedDepartment.color];

  return (
    <Layout>
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
                  <TaskColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="rotate-3 opacity-90">
                  <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setCurrentTask(null);
          setCurrentColumnId(null);
        }}
        onSave={handleSaveTask}
        task={currentTask}
        columnId={currentColumnId}
      />
    </Layout>
  );
};

export default TaskManagement;
