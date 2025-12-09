// src/services/kanbanService.js
// Kanban Board API Service Layer

import { JAVA_API, http } from './config';

// Note: BE uses /api/boards, not /api/kanban/boards
const BASE_URL = `${JAVA_API}`;

// Helper to get authentication headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

// ============== BOARDS ==============

export const boardService = {
  // GET /boards - Lấy tất cả boards (ownedBoards + memberBoards)
  async getAll() {
    const res = await http(`${BASE_URL}/boards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch boards');
    return res.json();
  },

  // GET /boards/:id - Lấy chi tiết board với lists & cards
  // ❌ CHƯA CÓ TRONG BE - API này chưa được implement
  // TODO: BE cần tạo API GET /api/boards/{id}
  // async getById(boardId) {
  //   if (!boardId || boardId === 'undefined') {
  //     throw new Error('Invalid boardId: boardId is required');
  //   }
  //   const res = await http(`${BASE_URL}/boards/${boardId}`, {
  //     method: 'GET',
  //     headers: getAuthHeaders(),
  //   });
  //   if (!res.ok) throw new Error('Failed to fetch board');
  //   return res.json();
  // },

  // POST /boards - Tạo board mới
  async create(data) {
    const res = await http(`${BASE_URL}/boards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create board');
    return res.json();
  },

  // PUT /boards/:id - Cập nhật board
  // ❌ CHƯA CÓ TRONG BE - API này chưa được implement
  // TODO: BE cần tạo API PUT /api/boards/{id}
  // async update(boardId, data) {
  //   const res = await http(`${BASE_URL}/boards/${boardId}`, {
  //     method: 'PUT',
  //     headers: getAuthHeaders(),
  //     body: JSON.stringify(data),
  //   });
  //   if (!res.ok) throw new Error('Failed to update board');
  //   return res.json();
  // },

  // DELETE /boards/:id - Xóa board
  async delete(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete board');
    return res.ok;
  },
};

// ============== MEMBERS ==============

export const memberService = {
  // GET /boards/:id/members - Lấy danh sách members
  // ❌ CHƯA CÓ TRONG BE - API này chưa được implement
  // TODO: BE cần tạo API GET /api/boards/{id}/members
  // async getByBoard(boardId) {
  //   const res = await http(`${BASE_URL}/boards/${boardId}/members`, {
  //     method: 'GET',
  //     headers: getAuthHeaders(),
  //   });
  //   if (!res.ok) throw new Error('Failed to fetch members');
  //   return res.json();
  // },

  // POST /boards/:id/members - Thêm member
  // ✅ CÓ TRONG BE - POST /api/boards/{id}/members
  async add(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add member');
    return res.json();
  },

  // DELETE /boards/:id/members/:memberId - Xóa member
  // ❌ CHƯA CÓ TRONG BE - API này chưa được implement
  // TODO: BE cần tạo API DELETE /api/boards/{id}/members/{memberId}
  // async remove(boardId, memberId) {
  //   const res = await http(`${BASE_URL}/boards/${boardId}/members/${memberId}`, {
  //     method: 'DELETE',
  //     headers: getAuthHeaders(),
  //   });
  //   if (!res.ok) throw new Error('Failed to remove member');
  //   return res.ok;
  // },
};

// ============== LISTS ==============

export const listService = {
  // GET /boards/:id/lists - Lấy lists của board
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/lists`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch lists');
    return res.json();
  },

  // POST /boards/:id/lists - Tạo list
  async create(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/lists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create list');
    return res.json();
  },

  // PUT /lists/:id - Cập nhật list
  async update(listId, data) {
    const res = await http(`${BASE_URL}/lists/${listId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update list');
    return res.json();
  },

  // DELETE /lists/:id - Xóa list
  async delete(listId) {
    const res = await http(`${BASE_URL}/lists/${listId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete list');
    return res.ok;
  },
};

// ============== CARDS ==============

export const cardService = {
  // POST /lists/:id/cards - Tạo card
  async create(listId, data) {
    const res = await http(`${BASE_URL}/lists/${listId}/cards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create card');
    return res.json();
  },

  // GET /lists/:id/cards - Lấy tất cả cards của list
  async getByList(listId) {
    const res = await http(`${BASE_URL}/lists/${listId}/cards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch cards');
    return res.json();
  },

  // GET /cards/:id - Lấy chi tiết card
  async getById(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch card');
    return res.json();
  },

  // PUT /cards/:id - Cập nhật card
  async update(cardId, data) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update card');
    return res.json();
  },

  // DELETE /cards/:id - Xóa card
  async delete(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete card');
    return res.ok;
  },

  // PUT /cards/:id/move - Di chuyển card
  async move(cardId, targetListId, targetPosition) {
    const res = await http(`${BASE_URL}/cards/${cardId}/move`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetListId, targetPosition }),
    });
    if (!res.ok) throw new Error('Failed to move card');
    return res.json();
  },
};

// ============== COMMENTS ==============
// ❌ TẤT CẢ COMMENT APIs CHƯA CÓ TRONG BE
// TODO: BE cần tạo các APIs sau:
// - GET /api/cards/{id}/comments
// - POST /api/cards/{id}/comments
// - PUT /api/comments/{id}
// - DELETE /api/comments/{id}

export const commentService = {
  // GET /cards/:id/comments - Lấy comments
  // ❌ CHƯA CÓ TRONG BE
  async getByCard(cardId) {
    console.warn('⚠️ Comment API not implemented in BE yet');
    return { data: [] }; // Return empty array as fallback
    // const res = await http(`${BASE_URL}/cards/${cardId}/comments`);
    // if (!res.ok) throw new Error('Failed to fetch comments');
    // return res.json();
  },

  // POST /cards/:id/comments - Tạo comment
  // ❌ CHƯA CÓ TRONG BE
  async create(cardId, data) {
    console.warn('⚠️ Comment API not implemented in BE yet');
    throw new Error('Comment API not implemented in backend yet');
    // const res = await http(`${BASE_URL}/cards/${cardId}/comments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error('Failed to create comment');
    // return res.json();
  },

  // PUT /comments/:id - Cập nhật comment
  // ❌ CHƯA CÓ TRONG BE
  async update(commentId, data) {
    console.warn('⚠️ Comment API not implemented in BE yet');
    throw new Error('Comment API not implemented in backend yet');
    // const res = await http(`${BASE_URL}/comments/${commentId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error('Failed to update comment');
    // return res.json();
  },

  // DELETE /comments/:id - Xóa comment
  // ❌ CHƯA CÓ TRONG BE
  async delete(commentId) {
    console.warn('⚠️ Comment API not implemented in BE yet');
    throw new Error('Comment API not implemented in backend yet');
    // const res = await http(`${BASE_URL}/comments/${commentId}`, {
    //   method: 'DELETE',
    // });
    // if (!res.ok) throw new Error('Failed to delete comment');
    // return res.ok;
  },
};

// ============== ATTACHMENTS ==============
// ❌ TẤT CẢ ATTACHMENT APIs CHƯA CÓ TRONG BE
// TODO: BE cần tạo các APIs sau:
// - GET /api/cards/{id}/attachments
// - DELETE /api/attachments/{id}

export const attachmentService = {
  // GET /cards/:id/attachments - Lấy attachments
  // ❌ CHƯA CÓ TRONG BE
  async getByCard(cardId) {
    console.warn('⚠️ Attachment API not implemented in BE yet');
    return { data: [] }; // Return empty array as fallback
    // const res = await http(`${BASE_URL}/cards/${cardId}/attachments`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // });
    // if (!res.ok) throw new Error('Failed to fetch attachments');
    // return res.json();
  },

  // DELETE /attachments/:id - Xóa attachment
  // ❌ CHƯA CÓ TRONG BE
  async delete(attachmentId) {
    console.warn('⚠️ Attachment API not implemented in BE yet');
    throw new Error('Attachment API not implemented in backend yet');
    // const res = await http(`${BASE_URL}/attachments/${attachmentId}`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    // });
    // if (!res.ok) throw new Error('Failed to delete attachment');
    // return res.ok;
  },
};

// ============== ACTIVITIES ==============
// ❌ TẤT CẢ ACTIVITY APIs CHƯA CÓ TRONG BE
// TODO: BE cần tạo các APIs sau:
// - GET /api/cards/{id}/activities
// - GET /api/boards/{id}/activities

export const activityService = {
  // GET /cards/:id/activities - Lấy activities của card
  // ❌ CHƯA CÓ TRONG BE
  async getByCard(cardId) {
    console.warn('⚠️ Activity API not implemented in BE yet');
    return { data: [] }; // Return empty array as fallback
    // const res = await http(`${BASE_URL}/cards/${cardId}/activities`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // });
    // if (!res.ok) throw new Error('Failed to fetch activities');
    // return res.json();
  },

  // GET /boards/:id/activities - Lấy activities của board
  // ❌ CHƯA CÓ TRONG BE
  async getByBoard(boardId) {
    console.warn('⚠️ Activity API not implemented in BE yet');
    return { data: [] }; // Return empty array as fallback
    // const res = await http(`${BASE_URL}/boards/${boardId}/activities`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // });
    // if (!res.ok) throw new Error('Failed to fetch activities');
    // return res.json();
  },
};

// ============== LABELS ==============
// ✅ TẤT CẢ LABEL APIs ĐÃ CÓ TRONG BE

export const labelService = {
  // GET /api/boards/{boardId}/labels - Lấy tất cả labels của board
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/labels`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch labels');
    return res.json();
  },

  // GET /api/labels/{labelId} - Lấy chi tiết label
  async getById(labelId) {
    const res = await http(`${BASE_URL}/labels/${labelId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch label');
    return res.json();
  },

  // POST /api/boards/{boardId}/labels - Tạo label mới cho board
  async create(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/labels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create label');
    return res.json();
  },

  // PUT /api/labels/{labelId} - Cập nhật label
  async update(labelId, data) {
    const res = await http(`${BASE_URL}/labels/${labelId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update label');
    return res.json();
  },

  // DELETE /api/labels/{labelId} - Xóa label
  async delete(labelId) {
    const res = await http(`${BASE_URL}/labels/${labelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete label');
    return res.ok;
  },

  // GET /api/cards/{cardId}/labels - Lấy danh sách labels của card
  async getByCard(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch card labels');
    return res.json();
  },

  // POST /api/cards/{cardId}/labels/{labelId} - Thêm label vào card
  async assignToCard(cardId, labelId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels/${labelId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to assign label to card');
    return res.json();
  },

  // DELETE /api/cards/{cardId}/labels/{labelId} - Xóa label khỏi card
  async removeFromCard(cardId, labelId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels/${labelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove label from card');
    return res.ok;
  },
};

// ============== EMPLOYEES (for assigning to cards) ==============

export const employeeService = {
  // GET /employees - Lấy tất cả nhân viên trong hệ thống
  async getAll() {
    const res = await http(`${JAVA_API}/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /employees?department=IT - Lấy nhân viên theo phòng ban
  async getByDepartment(departmentId) {
    const res = await http(`${JAVA_API}/employees?department=${departmentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /departments - Lấy danh sách phòng ban
  async getDepartments() {
    const res = await http(`${JAVA_API}/departments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },
};

// ============== TASKS ==============

const TASK_BASE_URL = `${JAVA_API}/tasks`;

export const taskService = {
  // GET /api/tasks - Lấy tất cả tasks với filters
  // Query params: status (new, in-progress, pending, complete), priority (high, medium, low), assigneeId, department
  async getAll(filters = {}) {
    const { status, priority, assigneeId, department } = filters;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (assigneeId) params.append('assigneeId', assigneeId);
    if (department) params.append('department', department);
    
    const queryString = params.toString();
    const url = queryString ? `${TASK_BASE_URL}?${queryString}` : TASK_BASE_URL;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  // POST /api/tasks - Tạo task mới
  async create(data) {
    const res = await http(`${TASK_BASE_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  // GET /api/tasks/:id - Lấy task theo ID
  async getById(taskId) {
    const res = await http(`${TASK_BASE_URL}/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
  },

  // PUT /api/tasks/:id - Cập nhật task
  // Request body: status (NEW, IN_PROGRESS, PENDING, DONE), priority (HIGH, MEDIUM, LOW)
  async update(taskId, data) {
    const res = await http(`${TASK_BASE_URL}/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  // DELETE /api/tasks/:id - Xóa task
  async delete(taskId) {
    const res = await http(`${TASK_BASE_URL}/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // GET /api/tasks/:id/progress - Lấy tiến độ task
  async getProgress(taskId) {
    const res = await http(`${TASK_BASE_URL}/${taskId}/progress`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task progress');
    return res.json();
  },

  // PUT /api/tasks/:id/progress - Cập nhật tiến độ task
  async updateProgress(taskId, data) {
    const res = await http(`${TASK_BASE_URL}/${taskId}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task progress');
    return res.json();
  },

  // GET /api/tasks/assignees - Lấy danh sách assignees
  async getAssignees() {
    const res = await http(`${TASK_BASE_URL}/assignees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch assignees');
    return res.json();
  },

  // GET /api/tasks/employee/:employeeId/summary - Lấy tóm tắt task của nhân viên
  async getEmployeeSummary(employeeId) {
    const res = await http(`${TASK_BASE_URL}/employee/${employeeId}/summary`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employee task summary');
    return res.json();
  },

  // GET /api/tasks/notifications - Lấy thông báo về task
  async getNotifications() {
    const res = await http(`${TASK_BASE_URL}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task notifications');
    return res.json();
  },

  // GET /api/tasks/timeline - Lấy timeline task
  async getTimeline(filters = {}) {
    const { year, month } = filters;
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    
    const queryString = params.toString();
    const url = queryString ? `${TASK_BASE_URL}/timeline?${queryString}` : `${TASK_BASE_URL}/timeline`;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task timeline');
    return res.json();
  },

  // GET /api/tasks/analytics - Lấy phân tích task
  async getAnalytics() {
    const res = await http(`${TASK_BASE_URL}/analytics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task analytics');
    return res.json();
  },

  // GET /api/tasks/metrics/evaluation - Lấy metrics để đánh giá nhân viên
  async getMetricsForEvaluation(employeeId, startDate, endDate) {
    const params = new URLSearchParams();
    params.append('employeeId', employeeId);
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    const res = await http(`${TASK_BASE_URL}/metrics/evaluation?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task metrics for evaluation');
    return res.json();
  },

  // POST /api/tasks/metrics - Tính toán metrics cho các task
  async calculateMetrics(data) {
    const res = await http(`${TASK_BASE_URL}/metrics`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to calculate task metrics');
    return res.json();
  },

  // GET /api/tasks/findTaskByStatus - Tìm task theo status
  async findByStatus(status) {
    const res = await http(`${TASK_BASE_URL}/findTaskByStatus?status=${status}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to find tasks by status');
    return res.json();
  },

  // GET /api/tasks/stats/general - Thống kê task tổng quát
  async getGeneralStats() {
    const res = await http(`${TASK_BASE_URL}/stats/general`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch general task stats');
    return res.json();
  },

  // GET /api/tasks/stats/board/:boardId - Thống kê task theo Board
  async getStatsByBoard(boardId) {
    const res = await http(`${TASK_BASE_URL}/stats/board/${boardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch board task stats');
    return res.json();
  },

  // GET /api/tasks/employee-completion-percent - Phần trăm hoàn thành của nhân viên
  async getEmployeeCompletionPercent(filters = {}) {
    const { startDate, endDate } = filters;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `${TASK_BASE_URL}/employee-completion-percent?${queryString}` : `${TASK_BASE_URL}/employee-completion-percent`;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employee completion percent');
    return res.json();
  },

  // GET /api/tasks/employee-efficiency - Hiệu suất nhân viên
  async getEmployeeEfficiency(filters = {}) {
    const { startDate, endDate } = filters;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `${TASK_BASE_URL}/employee-efficiency?${queryString}` : `${TASK_BASE_URL}/employee-efficiency`;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employee efficiency');
    return res.json();
  },

  // GET /api/tasks/average-days - Số ngày trung bình hoàn thành task
  async getAverageDays(filters = {}) {
    const { startDate, endDate } = filters;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `${TASK_BASE_URL}/average-days?${queryString}` : `${TASK_BASE_URL}/average-days`;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch average days');
    return res.json();
  },
};

// ============== TASK DELEGATION ==============

const DELEGATION_BASE_URL = `${JAVA_API}/task-delegation`;

export const taskDelegationService = {
  // POST /api/task-delegation - Tạo yêu cầu ủy quyền
  async create(data) {
    const res = await http(`${DELEGATION_BASE_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create delegation');
    return res.json();
  },

  // GET /api/task-delegation - Lấy danh sách ủy quyền
  // Query params: employeeId, status (pending, approved, rejected)
  async getAll(filters = {}) {
    const { employeeId, status } = filters;
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const url = queryString ? `${DELEGATION_BASE_URL}?${queryString}` : DELEGATION_BASE_URL;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch delegations');
    return res.json();
  },

  // PUT /api/task-delegation/:id/approve - Duyệt ủy quyền
  async approve(delegationId) {
    const res = await http(`${DELEGATION_BASE_URL}/${delegationId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to approve delegation');
    return res.json();
  },

  // PUT /api/task-delegation/:id/reject - Từ chối ủy quyền
  async reject(delegationId, data = {}) {
    const res = await http(`${DELEGATION_BASE_URL}/${delegationId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to reject delegation');
    return res.json();
  },
};

// Export all services
export default {
  board: boardService,
  member: memberService,
  list: listService,
  card: cardService,
  comment: commentService,
  attachment: attachmentService,
  activity: activityService,
  label: labelService,
  employee: employeeService,
  task: taskService,
  taskDelegation: taskDelegationService,
};
