// src/services/kanbanService.js
// Kanban Board API Service Layer

import { JAVA_API, http } from './config';

const BASE_URL = `${JAVA_API}/kanban`;

// ============== BOARDS ==============

export const boardService = {
  // GET /boards - Lấy tất cả boards (ownedBoards + memberBoards)
  async getAll() {
    const res = await http(`${BASE_URL}/boards`);
    if (!res.ok) throw new Error('Failed to fetch boards');
    return res.json();
  },

  // GET /boards/:id - Lấy chi tiết board với lists & cards
  async getById(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}`);
    if (!res.ok) throw new Error('Failed to fetch board');
    return res.json();
  },

  // POST /boards - Tạo board mới
  async create(data) {
    const res = await http(`${BASE_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create board');
    return res.json();
  },

  // PUT /boards/:id - Cập nhật board
  async update(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update board');
    return res.json();
  },

  // DELETE /boards/:id - Xóa board
  async delete(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete board');
    return res.ok;
  },
};

// ============== MEMBERS ==============

export const memberService = {
  // GET /boards/:id/members - Lấy danh sách members
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/members`);
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  },

  // POST /boards/:id/members - Thêm member
  async add(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add member');
    return res.json();
  },

  // DELETE /boards/:id/members/:memberId - Xóa member
  async remove(boardId, memberId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/members/${memberId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove member');
    return res.ok;
  },
};

// ============== LISTS ==============

export const listService = {
  // GET /boards/:id/lists - Lấy lists của board
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/lists`);
    if (!res.ok) throw new Error('Failed to fetch lists');
    return res.json();
  },

  // POST /boards/:id/lists - Tạo list
  async create(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create list');
    return res.json();
  },

  // PUT /lists/:id - Cập nhật list
  async update(listId, data) {
    const res = await http(`${BASE_URL}/lists/${listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update list');
    return res.json();
  },

  // DELETE /lists/:id - Xóa list
  async delete(listId) {
    const res = await http(`${BASE_URL}/lists/${listId}`, {
      method: 'DELETE',
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create card');
    return res.json();
  },

  // GET /cards/:id - Lấy chi tiết card
  async getById(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}`);
    if (!res.ok) throw new Error('Failed to fetch card');
    return res.json();
  },

  // PUT /cards/:id - Cập nhật card
  async update(cardId, data) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update card');
    return res.json();
  },

  // DELETE /cards/:id - Xóa card
  async delete(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete card');
    return res.ok;
  },

  // PUT /cards/:id/move - Di chuyển card
  async move(cardId, targetListId, targetPosition) {
    const res = await http(`${BASE_URL}/cards/${cardId}/move`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetListId, targetPosition }),
    });
    if (!res.ok) throw new Error('Failed to move card');
    return res.json();
  },
};

// ============== COMMENTS ==============

export const commentService = {
  // GET /cards/:id/comments - Lấy comments
  async getByCard(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  // POST /cards/:id/comments - Tạo comment
  async create(cardId, data) {
    const res = await http(`${BASE_URL}/cards/${cardId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },

  // PUT /comments/:id - Cập nhật comment
  async update(commentId, data) {
    const res = await http(`${BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update comment');
    return res.json();
  },

  // DELETE /comments/:id - Xóa comment
  async delete(commentId) {
    const res = await http(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.ok;
  },
};

// ============== ATTACHMENTS ==============

export const attachmentService = {
  // GET /cards/:id/attachments - Lấy attachments
  async getByCard(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/attachments`);
    if (!res.ok) throw new Error('Failed to fetch attachments');
    return res.json();
  },

  // DELETE /attachments/:id - Xóa attachment
  async delete(attachmentId) {
    const res = await http(`${BASE_URL}/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete attachment');
    return res.ok;
  },
};

// ============== ACTIVITIES ==============

export const activityService = {
  // GET /cards/:id/activities - Lấy activities của card
  async getByCard(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  // GET /boards/:id/activities - Lấy activities của board
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },
};

// ============== LABELS ==============

export const labelService = {
  // GET /boards/:id/labels - Lấy labels
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/labels`);
    if (!res.ok) throw new Error('Failed to fetch labels');
    return res.json();
  },

  // POST /boards/:id/labels - Tạo label
  async create(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create label');
    return res.json();
  },

  // PUT /labels/:id - Cập nhật label
  async update(labelId, data) {
    const res = await http(`${BASE_URL}/labels/${labelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update label');
    return res.json();
  },

  // DELETE /labels/:id - Xóa label
  async delete(labelId) {
    const res = await http(`${BASE_URL}/labels/${labelId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete label');
    return res.ok;
  },

  // POST /cards/:cardId/labels/:labelId - Gán label vào card
  async assignToCard(cardId, labelId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels/${labelId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to assign label');
    return res.json();
  },

  // DELETE /cards/:cardId/labels/:labelId - Xóa label khỏi card
  async removeFromCard(cardId, labelId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels/${labelId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove label');
    return res.ok;
  },
};

// ============== EMPLOYEES (for assigning to cards) ==============

export const employeeService = {
  // GET /employees - Lấy tất cả nhân viên trong hệ thống
  async getAll() {
    const res = await http(`${JAVA_API}/employees`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /employees?department=IT - Lấy nhân viên theo phòng ban
  async getByDepartment(departmentId) {
    const res = await http(`${JAVA_API}/employees?department=${departmentId}`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /departments - Lấy danh sách phòng ban
  async getDepartments() {
    const res = await http(`${JAVA_API}/departments`);
    if (!res.ok) throw new Error('Failed to fetch departments');
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
};
