/**
 * Task Metrics Calculator
 * Utility functions to calculate task performance metrics for employee evaluation
 */

/**
 * Calculate task completion rate
 * @param {Array} tasks - Array of tasks
 * @returns {number} - Completion rate percentage
 */
export const calculateCompletionRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.columnId === 'done' || task.status === 'complete').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Calculate on-time delivery rate
 * @param {Array} tasks - Array of tasks with dueDate
 * @returns {number} - On-time rate percentage
 */
export const calculateOnTimeRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.columnId === 'done' || task.status === 'complete');
  if (completedTasks.length === 0) return 0;

  const onTimeTasks = completedTasks.filter(task => {
    if (!task.dueDate || !task.completedDate) return true; // Assume on-time if no dates
    return new Date(task.completedDate) <= new Date(task.dueDate);
  });

  return Math.round((onTimeTasks.length / completedTasks.length) * 100);
};

/**
 * Calculate task statistics by status
 * @param {Array} tasks - Array of tasks
 * @returns {Object} - Task counts by status
 */
export const calculateTaskStats = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {
      total: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0
    };
  }

  return {
    total: tasks.length,
    todo: tasks.filter(t => t.columnId === 'todo').length,
    inProgress: tasks.filter(t => t.columnId === 'inProgress').length,
    review: tasks.filter(t => t.columnId === 'review').length,
    done: tasks.filter(t => t.columnId === 'done').length
  };
};

/**
 * Calculate task priority distribution
 * @param {Array} tasks - Array of tasks
 * @returns {Object} - Task counts by priority
 */
export const calculatePriorityDistribution = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return { high: 0, medium: 0, low: 0 };
  }

  return {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };
};

/**
 * Calculate high priority completion rate
 * @param {Array} tasks - Array of tasks
 * @returns {number} - High priority completion rate
 */
export const calculateHighPriorityCompletionRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  if (highPriorityTasks.length === 0) return 100; // No high priority = 100%

  const completedHighPriority = highPriorityTasks.filter(t => t.columnId === 'done').length;
  return Math.round((completedHighPriority / highPriorityTasks.length) * 100);
};

/**
 * Calculate productivity score based on multiple factors
 * @param {Array} tasks - Array of tasks
 * @returns {number} - Productivity score (0-100)
 */
export const calculateProductivityScore = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const completionRate = calculateCompletionRate(tasks);
  const onTimeRate = calculateOnTimeRate(tasks);
  const highPriorityRate = calculateHighPriorityCompletionRate(tasks);

  // Weighted average: Completion 40%, On-time 35%, High Priority 25%
  const score = (completionRate * 0.4) + (onTimeRate * 0.35) + (highPriorityRate * 0.25);
  return Math.round(score);
};

/**
 * Get tasks for a specific employee within a date range
 * @param {Array} allTasks - All tasks from all departments
 * @param {string} employeeName - Employee name to filter
 * @param {string} startDate - Period start date
 * @param {string} endDate - Period end date
 * @returns {Array} - Filtered tasks
 */
export const getEmployeeTasks = (allTasks, employeeName, startDate, endDate) => {
  if (!allTasks || !employeeName) return [];

  return allTasks.filter(task => {
    // Check if employee is assigned to task
    const isAssigned = task.assignees?.some(
      assignee => assignee.toLowerCase().includes(employeeName.toLowerCase())
    );

    if (!isAssigned) return false;

    // Filter by date range if provided
    if (startDate && endDate && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      return taskDate >= new Date(startDate) && taskDate <= new Date(endDate);
    }

    return true;
  });
};

/**
 * Get all tasks from all departments (flattened)
 * @param {Array} departments - Array of department objects with tasks
 * @returns {Array} - Flattened array of all tasks
 */
export const getAllTasksFromDepartments = (departments) => {
  if (!departments || departments.length === 0) return [];
  return departments.flatMap(dept => dept.tasks || []);
};

/**
 * Calculate comprehensive task metrics for evaluation
 * @param {Array} tasks - Array of tasks for the employee
 * @returns {Object} - Comprehensive metrics object
 */
export const calculateComprehensiveMetrics = (tasks) => {
  const stats = calculateTaskStats(tasks);
  const completionRate = calculateCompletionRate(tasks);
  const onTimeRate = calculateOnTimeRate(tasks);
  const priorityDistribution = calculatePriorityDistribution(tasks);
  const highPriorityRate = calculateHighPriorityCompletionRate(tasks);
  const productivityScore = calculateProductivityScore(tasks);

  return {
    stats,
    completionRate,
    onTimeRate,
    priorityDistribution,
    highPriorityRate,
    productivityScore,

    // Pre-formatted KPI suggestions based on task data
    suggestedKPIs: [
      {
        objective: 'Tỷ lệ hoàn thành công việc',
        target: 100,
        actual: completionRate,
        unit: '%',
        weight: 30,
        achievement: completionRate,
        comments: `Hoàn thành ${stats.done}/${stats.total} công việc được giao`
      },
      {
        objective: 'Tỷ lệ hoàn thành đúng hạn',
        target: 100,
        actual: onTimeRate,
        unit: '%',
        weight: 25,
        achievement: onTimeRate,
        comments: 'Đánh giá khả năng quản lý thời gian'
      },
      {
        objective: 'Hoàn thành công việc ưu tiên cao',
        target: 100,
        actual: highPriorityRate,
        unit: '%',
        weight: 25,
        achievement: highPriorityRate,
        comments: `Xử lý ${priorityDistribution.high} công việc quan trọng`
      },
      {
        objective: 'Điểm năng suất tổng hợp',
        target: 100,
        actual: productivityScore,
        unit: 'điểm',
        weight: 20,
        achievement: productivityScore,
        comments: 'Đánh giá tổng hợp dựa trên nhiều yếu tố'
      }
    ]
  };
};

/**
 * Get performance rating based on productivity score
 * @param {number} score - Productivity score (0-100)
 * @returns {Object} - Rating info with label and color
 */
export const getPerformanceRating = (score) => {
  if (score >= 90) return { label: 'Xuất sắc', color: 'green', stars: 5 };
  if (score >= 80) return { label: 'Tốt', color: 'blue', stars: 4 };
  if (score >= 70) return { label: 'Khá', color: 'yellow', stars: 3 };
  if (score >= 60) return { label: 'Trung bình', color: 'orange', stars: 2 };
  return { label: 'Cần cải thiện', color: 'red', stars: 1 };
};

/**
 * Generate task-based recommendations for development
 * @param {Object} metrics - Comprehensive metrics object
 * @returns {Array} - Array of recommendation strings
 */
export const generateRecommendations = (metrics) => {
  const recommendations = [];

  if (metrics.completionRate < 80) {
    recommendations.push('Cần cải thiện tỷ lệ hoàn thành công việc. Xem xét đào tạo về quản lý công việc.');
  }

  if (metrics.onTimeRate < 80) {
    recommendations.push('Cần cải thiện khả năng hoàn thành đúng deadline. Đề xuất khóa học quản lý thời gian.');
  }

  if (metrics.highPriorityRate < 90) {
    recommendations.push('Cần ưu tiên xử lý các công việc quan trọng trước.');
  }

  if (metrics.stats.inProgress > metrics.stats.done) {
    recommendations.push('Có nhiều công việc đang dở dang. Cần tập trung hoàn thành trước khi nhận việc mới.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Hiệu suất công việc tốt. Tiếp tục duy trì và có thể đảm nhận thêm trách nhiệm.');
  }

  return recommendations;
};

export default {
  calculateCompletionRate,
  calculateOnTimeRate,
  calculateTaskStats,
  calculatePriorityDistribution,
  calculateHighPriorityCompletionRate,
  calculateProductivityScore,
  getEmployeeTasks,
  getAllTasksFromDepartments,
  calculateComprehensiveMetrics,
  getPerformanceRating,
  generateRecommendations
};
