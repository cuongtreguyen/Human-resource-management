import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

// Key for localStorage
const STORAGE_KEY = 'hrm_tasks_data';

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Default departments data
const defaultDepartments = [
    {
      id: 'it',
      name: 'Công nghệ thông tin',
      code: 'IT',
      description: 'Phát triển và bảo trì hệ thống công nghệ',
      icon: 'Briefcase',
      color: 'blue',
      members: 15,
      tasks: [
        { id: 't1', columnId: 'todo', title: 'Thiết kế giao diện dashboard mới', description: 'Tạo wireframe và mockup cho dashboard phiên bản 2.0', priority: 'high', dueDate: '2024-12-15', tags: ['UI/UX', 'Design'], assignees: ['Nguyễn Văn An', 'Trần Thị Bình'], comments: 3, attachments: 2, difficulty: 80 },
        { id: 't2', columnId: 'todo', title: 'Viết API documentation', description: 'Cập nhật tài liệu API cho các endpoints mới', priority: 'medium', dueDate: '2024-12-18', tags: ['Documentation'], assignees: ['Lê Văn Cường'], comments: 1, attachments: 0, difficulty: 20 },
        { id: 't3', columnId: 'inProgress', title: 'Implement authentication system', description: 'Xây dựng hệ thống đăng nhập với JWT và OAuth', priority: 'high', dueDate: '2024-12-20', tags: ['Backend', 'Security'], assignees: ['Phạm Thị Dung', 'Hoàng Văn Em'], comments: 5, attachments: 1, difficulty: 100 },
        { id: 't4', columnId: 'inProgress', title: 'Fix responsive issues', description: 'Sửa các vấn đề hiển thị trên mobile', priority: 'low', dueDate: '2024-12-16', tags: ['Frontend', 'Bug'], assignees: ['Nguyễn Văn An'], comments: 2, attachments: 0, difficulty: 40 },
        { id: 't5', columnId: 'review', title: 'Database optimization', description: 'Tối ưu hóa queries và indexes', priority: 'medium', dueDate: '2024-12-14', tags: ['Database', 'Performance'], assignees: ['Hoàng Văn Em'], comments: 4, attachments: 3, difficulty: 60 },
        { id: 't6', columnId: 'done', title: 'Setup CI/CD pipeline', description: 'Cấu hình GitHub Actions cho auto deployment', priority: 'high', dueDate: '2024-12-10', tags: ['DevOps'], assignees: ['Phạm Thị Dung'], comments: 2, attachments: 1, difficulty: 80 },
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      code: 'MKT',
      description: 'Quảng bá thương hiệu và phát triển chiến lược marketing',
      icon: 'TrendingUp',
      color: 'purple',
      members: 8,
      tasks: [
        { id: 't7', columnId: 'todo', title: 'Lên kế hoạch content tháng 12', description: 'Xây dựng content calendar cho tháng 12', priority: 'high', dueDate: '2024-12-12', tags: ['Content', 'Planning'], assignees: ['Vũ Thị Phương'], comments: 2, attachments: 1, difficulty: 40 },
        { id: 't8', columnId: 'inProgress', title: 'Thiết kế banner quảng cáo', description: 'Tạo banner cho chiến dịch Giáng sinh', priority: 'medium', dueDate: '2024-12-18', tags: ['Design', 'Ads'], assignees: ['Ngô Văn Giang', 'Đặng Thị Hương'], comments: 4, attachments: 5, difficulty: 60 },
        { id: 't9', columnId: 'inProgress', title: 'Phân tích đối thủ cạnh tranh', description: 'Nghiên cứu chiến lược marketing của đối thủ', priority: 'low', dueDate: '2024-12-20', tags: ['Research'], assignees: ['Vũ Thị Phương'], comments: 1, attachments: 0, difficulty: 20 },
        { id: 't10', columnId: 'done', title: 'Chạy campaign Facebook Ads', description: 'Launch chiến dịch quảng cáo Q4', priority: 'high', dueDate: '2024-12-05', tags: ['Ads', 'Social'], assignees: ['Ngô Văn Giang'], comments: 6, attachments: 2, difficulty: 80 },
      ]
    },
    {
      id: 'hr',
      name: 'Nhân sự',
      code: 'HR',
      description: 'Tuyển dụng và quản lý nhân sự',
      icon: 'Users',
      color: 'emerald',
      members: 6,
      tasks: [
        { id: 't11', columnId: 'todo', title: 'Đăng tin tuyển dụng Developer', description: 'Tuyển 2 Frontend Developer và 1 Backend Developer', priority: 'high', dueDate: '2024-12-15', tags: ['Recruitment'], assignees: ['Bùi Văn Khoa'], comments: 3, attachments: 1, difficulty: 40 },
        { id: 't12', columnId: 'inProgress', title: 'Phỏng vấn ứng viên', description: 'Phỏng vấn 5 ứng viên cho vị trí Marketing', priority: 'medium', dueDate: '2024-12-14', tags: ['Interview'], assignees: ['Lý Thị Lan', 'Bùi Văn Khoa'], comments: 2, attachments: 0, difficulty: 60 },
        { id: 't13', columnId: 'review', title: 'Review chính sách lương', description: 'Đánh giá và đề xuất điều chỉnh chính sách lương 2025', priority: 'high', dueDate: '2024-12-20', tags: ['Policy', 'Salary'], assignees: ['Lý Thị Lan'], comments: 5, attachments: 3, difficulty: 80 },
        { id: 't14', columnId: 'done', title: 'Tổ chức team building Q4', description: 'Lên kế hoạch và tổ chức team building cho công ty', priority: 'low', dueDate: '2024-12-01', tags: ['Event'], assignees: ['Bùi Văn Khoa'], comments: 8, attachments: 4, difficulty: 40 },
      ]
    },
    {
      id: 'sales',
      name: 'Kinh doanh',
      code: 'SALES',
      description: 'Phát triển khách hàng và doanh số',
      icon: 'Briefcase',
      color: 'amber',
      members: 12,
      tasks: [
        { id: 't15', columnId: 'todo', title: 'Liên hệ khách hàng tiềm năng', description: 'Gọi điện và gửi email cho 50 leads mới', priority: 'high', dueDate: '2024-12-16', tags: ['Leads', 'Outreach'], assignees: ['Mai Văn Nam', 'Trịnh Thị Oanh'], comments: 2, attachments: 0, difficulty: 20 },
        { id: 't16', columnId: 'inProgress', title: 'Chuẩn bị proposal cho ABC Corp', description: 'Soạn đề xuất hợp tác với ABC Corporation', priority: 'high', dueDate: '2024-12-18', tags: ['Proposal', 'B2B'], assignees: ['Mai Văn Nam'], comments: 4, attachments: 2, difficulty: 80 },
        { id: 't17', columnId: 'inProgress', title: 'Follow up deals tháng 11', description: 'Theo dõi các deals còn pending từ tháng 11', priority: 'medium', dueDate: '2024-12-15', tags: ['Follow-up'], assignees: ['Trịnh Thị Oanh'], comments: 1, attachments: 0, difficulty: 40 },
        { id: 't18', columnId: 'done', title: 'Ký hợp đồng với XYZ Ltd', description: 'Hoàn tất ký kết hợp đồng dịch vụ', priority: 'high', dueDate: '2024-12-08', tags: ['Contract', 'Deal'], assignees: ['Mai Văn Nam'], comments: 3, attachments: 5, difficulty: 60 },
      ]
    },
    {
      id: 'finance',
      name: 'Tài chính',
      code: 'FIN',
      description: 'Quản lý tài chính và kế toán',
      icon: 'TrendingUp',
      color: 'red',
      members: 5,
      tasks: [
        { id: 't19', columnId: 'todo', title: 'Lập báo cáo tài chính Q4', description: 'Tổng hợp và lập báo cáo tài chính quý 4/2024', priority: 'high', dueDate: '2024-12-25', tags: ['Report', 'Finance'], assignees: ['Phan Văn Quân'], comments: 2, attachments: 1, difficulty: 80 },
        { id: 't20', columnId: 'inProgress', title: 'Kiểm tra công nợ', description: 'Rà soát và đối chiếu công nợ phải thu/phải trả', priority: 'medium', dueDate: '2024-12-18', tags: ['Audit', 'AR/AP'], assignees: ['Đinh Thị Uyên', 'Phan Văn Quân'], comments: 3, attachments: 2, difficulty: 60 },
        { id: 't21', columnId: 'done', title: 'Thanh toán lương tháng 11', description: 'Hoàn tất thanh toán lương cho toàn bộ nhân viên', priority: 'high', dueDate: '2024-12-05', tags: ['Payroll'], assignees: ['Đinh Thị Uyên'], comments: 1, attachments: 0, difficulty: 40 },
      ]
    }
  ];

export const TaskProvider = ({ children }) => {
  // Initialize state from localStorage or use default
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultDepartments;
    } catch {
      return defaultDepartments;
    }
  });

  // Save to localStorage whenever departments change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
  }, [departments]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setDepartments(newData);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add a new task to a department
  const addTask = (departmentId, task) => {
    const newTask = {
      ...task,
      id: `t${Date.now()}`,
      columnId: task.columnId || 'todo',
      comments: 0,
      attachments: 0,
      difficulty: task.difficulty || 40,
    };

    setDepartments(prev => prev.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          tasks: [...dept.tasks, newTask]
        };
      }
      return dept;
    }));

    return newTask;
  };

  // Update an existing task
  const updateTask = (departmentId, taskId, updates) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          tasks: dept.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return dept;
    }));
  };

  // Delete a task
  const deleteTask = (departmentId, taskId) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          tasks: dept.tasks.filter(task => task.id !== taskId)
        };
      }
      return dept;
    }));
  };

  // Move task to another column (change status)
  const moveTask = (departmentId, taskId, newColumnId) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          tasks: dept.tasks.map(task =>
            task.id === taskId ? { ...task, columnId: newColumnId } : task
          )
        };
      }
      return dept;
    }));
  };

  // Get tasks for a specific employee
  const getTasksForEmployee = (employeeName) => {
    const allTasks = [];
    departments.forEach(dept => {
      dept.tasks.forEach(task => {
        if (task.assignees?.some(a => a.toLowerCase().includes(employeeName.toLowerCase()))) {
          allTasks.push({ ...task, departmentId: dept.id, departmentName: dept.name });
        }
      });
    });
    return allTasks;
  };

  // Calculate stats
  const getOverallStats = () => ({
    totalDepartments: departments.length,
    totalTasks: departments.reduce((sum, d) => sum + d.tasks.length, 0),
    todo: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'todo').length, 0),
    inProgress: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'inProgress').length, 0),
    review: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'review').length, 0),
    done: departments.reduce((sum, d) => sum + d.tasks.filter(t => t.columnId === 'done').length, 0),
  });

  // Calculate department progress based on column status
  const getDepartmentProgress = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    if (!dept || dept.tasks.length === 0) return 0;

    const getColumnProgress = (columnId) => {
      switch (columnId) {
        case 'done': return 100;
        case 'review': return 75;
        case 'inProgress': return 50;
        case 'todo': return 0;
        default: return 0;
      }
    };

    return Math.round(
      dept.tasks.reduce((sum, t) => sum + getColumnProgress(t.columnId), 0) / dept.tasks.length
    );
  };

  // Reset to default data
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDepartments(defaultDepartments);
  };

  const value = {
    departments,
    setDepartments,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksForEmployee,
    getOverallStats,
    getDepartmentProgress,
    resetToDefault,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
