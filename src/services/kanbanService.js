// src/services/kanbanService.js
// Kanban Board API Service Layer - RESTful Version

import { JAVA_API, http } from './config';

const BASE_URL = `${JAVA_API}`;

// Helper to get authentication headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

// ============== BOARDS ==============

export const boardService = {
  // GET /api/boards - Lấy tất cả boards
  async getAll(search = null) {
    const url = search ? `${BASE_URL}/boards?search=${encodeURIComponent(search)}` : `${BASE_URL}/boards`;
    const res = await http(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch boards');
    return res.json();
  },

  // GET /api/boards/my-boards - Lấy các boards mà employee hiện tại là member
  async getMyBoards() {
    const res = await http(`${BASE_URL}/boards/my-boards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch my boards');
    return res.json();
  },

  // GET /api/boards/{id} - Lấy chi tiết board với lists & cards
  async getById(boardId) {
    if (!boardId || boardId === 'undefined' || boardId === 'null') {
      throw new Error('Invalid boardId: boardId is required');
    }

    const boardIdNum = typeof boardId === 'string' ? Number(boardId) : boardId;
    if (isNaN(boardIdNum) || boardIdNum <= 0) {
      throw new Error(`Invalid board ID: ${boardId}. Must be a positive number.`);
    }

    const res = await http(`${BASE_URL}/boards/${boardIdNum}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Board không tồn tại (boardId: ${boardIdNum})`);
      }
      throw new Error('Failed to fetch board');
    }

    return res.json();
  },

  // POST /api/boards - Tạo board mới
  async create(data) {
    const res = await http(`${BASE_URL}/boards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create board');
    return res.json();
  },

  // PUT /api/boards/{id} - Cập nhật board
  async update(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update board');
    return res.json();
  },

  // DELETE /api/boards/{id} - Xóa board
  async delete(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Failed to delete board';

      if (errorText) {
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          if (errorText.includes('foreign key') || errorText.includes('kanban_lists')) {
            errorMessage = 'Không thể xóa board này vì còn có danh sách. Vui lòng xóa tất cả danh sách trước.';
          }
        }
      }

      throw new Error(errorMessage);
    }

    return true;
  },
};

// ============== BOARD MEMBERS ==============

export const memberService = {
  // GET /api/boards/{id}/members - Lấy danh sách members
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/members`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  },

  // POST /api/boards/{id}/members - Thêm member
  async add(boardId, data) {
    if (!boardId) throw new Error('Board ID is required');
    if (!data.email) throw new Error('Email is required to add member');

    const res = await http(`${BASE_URL}/boards/${boardId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email: data.email.trim() }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Failed to add member';

      if (errorText) {
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText;
        }
      }

      if (errorMessage.includes('đã là thành viên') || errorMessage.includes('already a member')) {
        errorMessage = 'Nhân viên này đã là thành viên của Board';
      }

      throw new Error(errorMessage);
    }

    return res.json();
  },

  // DELETE /api/boards/{boardId}/members/{memberId} - Xóa member
  async remove(boardId, memberId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/members/${memberId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove member');
    return true;
  },
};

// ============== LISTS ==============

export const listService = {
  // GET /api/boards/{id}/lists - Lấy lists của board
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/lists`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch lists');
    return res.json();
  },

  // POST /api/boards/{id}/lists - Tạo list
  async create(boardId, data) {
    const res = await http(`${BASE_URL}/boards/${boardId}/lists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create list');
    return res.json();
  },

  // PUT /api/lists/{id} - Cập nhật list
  async update(listId, data) {
    const res = await http(`${BASE_URL}/lists/${listId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update list');
    return res.json();
  },

  // DELETE /api/lists/{id} - Xóa list
  async delete(listId) {
    const res = await http(`${BASE_URL}/lists/${listId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete list');
    return true;
  },

  // PATCH /api/lists/{id}/archive - Archive/unarchive list
  async archive(listId, archived = true) {
    const res = await http(`${BASE_URL}/lists/${listId}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ archived }),
    });
    if (!res.ok) throw new Error('Failed to archive list');
    return res.json();
  },

  // PATCH /api/lists/{id}/move - Di chuyển list
  async move(listId, newPosition) {
    const res = await http(`${BASE_URL}/lists/${listId}/move`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ position: newPosition }),
    });
    if (!res.ok) throw new Error('Failed to move list');
    return res.json();
  },
};

// ============== CARDS ==============

export const cardService = {
  // POST /api/lists/{id}/cards - Tạo card
  async create(listId, data) {
    const res = await http(`${BASE_URL}/lists/${listId}/cards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create card');
    return res.json();
  },

  // GET /api/lists/{id}/cards - Lấy tất cả cards của list
  async getByList(listId) {
    const res = await http(`${BASE_URL}/lists/${listId}/cards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch cards');
    return res.json();
  },

  // GET /api/cards/{id} - Lấy chi tiết card
  async getById(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch card');
    return res.json();
  },

  // PUT /api/cards/{id} - Cập nhật card
  async update(cardId, data) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update card');
    return res.json();
  },

  // DELETE /api/cards/{id} - Xóa card
  async delete(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete card');
    return true;
  },

  // PUT /api/cards/{id}/move - Di chuyển card
  async move(cardId, targetListId, targetPosition) {
    const res = await http(`${BASE_URL}/cards/${cardId}/move`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        listId: targetListId,
        position: targetPosition
      }),
    });
    if (!res.ok) throw new Error('Failed to move card');
    return res.json();
  },

  // PUT /api/cards/{id}/archive - Archive/unarchive card
  async archive(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/archive`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to archive card');
    return res.json();
  },
};

// ============== COMMENTS ==============

export const commentService = {
  // GET /api/cards/{cardId}/comments - Lấy comments của card
  async getByCard(cardId) {
    if (!cardId) return [];

    const res = await http(`${BASE_URL}/cards/${cardId}/comments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch comments');
    }

    return res.json();
  },

  // POST /api/cards/{cardId}/comments - Tạo comment cho card
  async create(cardId, data) {
    if (!cardId) throw new Error('Card ID is required');

    const content = typeof data === 'string' ? data : (data?.content || data);
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content is required');
    }

    const res = await http(`${BASE_URL}/cards/${cardId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content: content.trim() }),
    });

    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },

  // PUT /api/comments/{id} - Cập nhật comment
  async update(commentId, data) {
    if (!commentId) throw new Error('Comment ID is required');

    const content = typeof data === 'string' ? data : (data?.content || data);
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content is required');
    }

    const res = await http(`${BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content: content.trim() }),
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Bạn không có quyền cập nhật comment này');
      }
      throw new Error('Failed to update comment');
    }

    return res.json();
  },

  // DELETE /api/comments/{id} - Xóa comment
  async delete(commentId) {
    if (!commentId) throw new Error('Comment ID is required');

    const res = await http(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Bạn không có quyền xóa comment này. Chỉ người tạo comment mới có quyền xóa.');
      }
      if (res.status === 404) {
        throw new Error('Comment không tồn tại hoặc đã bị xóa.');
      }
      throw new Error('Xóa comment thất bại');
    }

    return true;
  },
};

// ============== CHECKLISTS ==============

export const checklistService = {
  // GET /api/cards/{cardId}/checklists - Lấy checklists của card
  async getByCard(cardId) {
    if (!cardId) return [];

    const res = await http(`${BASE_URL}/cards/${cardId}/checklists`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch checklists');
    }

    return res.json();
  },

  // POST /api/cards/{cardId}/checklists - Tạo checklist item
  async create(cardId, data) {
    if (!cardId) throw new Error('Card ID is required');

    const res = await http(`${BASE_URL}/cards/${cardId}/checklists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create checklist');
    return res.json();
  },

  // PUT /api/checklists/{id} - Cập nhật checklist
  async update(checklistId, data) {
    const res = await http(`${BASE_URL}/checklists/${checklistId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update checklist');
    return res.json();
  },

  // PATCH /api/checklists/{id}/toggle - Toggle completed status
  async toggle(checklistId) {
    const res = await http(`${BASE_URL}/checklists/${checklistId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to toggle checklist');
    return res.json();
  },

  // DELETE /api/checklists/{id} - Xóa checklist
  async delete(checklistId) {
    const res = await http(`${BASE_URL}/checklists/${checklistId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to delete checklist');
    return true;
  },
};

// ============== ATTACHMENTS ==============

export const attachmentService = {
  // GET /api/cards/{cardId}/attachments - Lấy attachments của card
  async getByCard(cardId) {
    if (!cardId) return [];

    const res = await http(`${BASE_URL}/cards/${cardId}/attachments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch attachments');
    }

    return res.json();
  },

  // POST /api/cards/{cardId}/attachments - Upload attachment
  async upload(cardId, file) {
    if (!cardId) throw new Error('Card ID is required');
    if (!file) throw new Error('File is required');

    const formData = new FormData();
    formData.append('file', file);

    const res = await http(`${BASE_URL}/cards/${cardId}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        // Note: Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload attachment');
    return res.json();
  },

  // GET /api/attachments/{id}/download - Download attachment
  async download(attachmentId) {
    const res = await http(`${BASE_URL}/attachments/${attachmentId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
    });

    if (!res.ok) throw new Error('Failed to download attachment');
    return res.blob();
  },

  // DELETE /api/attachments/{id} - Xóa attachment
  async delete(attachmentId) {
    const res = await http(`${BASE_URL}/attachments/${attachmentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to delete attachment');
    return true;
  },
};

// ============== ACTIVITIES ==============

export const activityService = {
  // GET /api/cards/{cardId}/activities - Lấy activities của card
  async getByCard(cardId) {
    if (!cardId) return [];

    const res = await http(`${BASE_URL}/cards/${cardId}/activities`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch activities');
    }

    return res.json();
  },

  // GET /api/boards/{boardId}/activities - Lấy activities của board
  async getByBoard(boardId) {
    if (!boardId) return [];

    const res = await http(`${BASE_URL}/boards/${boardId}/activities`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch activities');
    }

    return res.json();
  },
};

// ============== LABELS ==============

export const labelService = {
  // GET /api/boards/{boardId}/labels - Lấy labels của board
  async getByBoard(boardId) {
    const res = await http(`${BASE_URL}/boards/${boardId}/labels`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch labels');
    return res.json();
  },

  // POST /api/boards/{boardId}/labels - Tạo label
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
    return true;
  },

  // GET /api/cards/{cardId}/labels - Lấy labels của card
  async getByCard(cardId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch card labels');
    return res.json();
  },

  // POST /api/cards/{cardId}/labels/{labelId} - Gắn label vào card
  async assignToCard(cardId, labelId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels/${labelId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to assign label to card');
    return res.json();
  },

  // DELETE /api/cards/{cardId}/labels/{labelId} - Gỡ label khỏi card
  async removeFromCard(cardId, labelId) {
    const res = await http(`${BASE_URL}/cards/${cardId}/labels/${labelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove label from card');
    return true;
  },
};

// ============== EMPLOYEES ==============

export const employeeService = {
  // GET /api/employees - Lấy tất cả nhân viên
  async getAll() {
    const res = await http(`${JAVA_API}/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /api/employees?department=IT - Lấy nhân viên theo phòng ban
  async getByDepartment(departmentId) {
    const res = await http(`${JAVA_API}/employees?department=${departmentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /api/departments - Lấy danh sách phòng ban
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
  // GET /api/tasks - Lấy tất cả tasks
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

  // POST /api/tasks - Tạo task
  async create(data) {
    const res = await http(TASK_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  // GET /api/tasks/{id} - Lấy task theo ID
  async getById(taskId) {
    const res = await http(`${TASK_BASE_URL}/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
  },

  // PUT /api/tasks/{id} - Cập nhật task
  async update(taskId, data) {
    const res = await http(`${TASK_BASE_URL}/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  // DELETE /api/tasks/{id} - Xóa task
  async delete(taskId) {
    const res = await http(`${TASK_BASE_URL}/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // GET /api/tasks/{id}/progress
  async getProgress(taskId) {
    const res = await http(`${TASK_BASE_URL}/${taskId}/progress`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch task progress');
    return res.json();
  },

  // PUT /api/tasks/{id}/progress
  async updateProgress(taskId, data) {
    const res = await http(`${TASK_BASE_URL}/${taskId}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task progress');
    return res.json();
  },

  // GET /api/tasks/assignees
  async getAssignees() {
    const res = await http(`${TASK_BASE_URL}/assignees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch assignees');
    return res.json();
  },

  // GET /api/tasks/employee/{employeeId}/summary
  async getEmployeeSummary(employeeId) {
    const res = await http(`${TASK_BASE_URL}/employee/${employeeId}/summary`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch employee task summary');
    return res.json();
  },

  // GET /api/tasks/stats/general
  async getGeneralStats() {
    const res = await http(`${TASK_BASE_URL}/stats/general`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch general task stats');
    return res.json();
  },

  // GET /api/tasks/stats/board/{boardId}
  async getStatsByBoard(boardId) {
    const res = await http(`${TASK_BASE_URL}/stats/board/${boardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch board task stats');
    return res.json();
  },
};

// ============== TASK DELEGATION ==============

const DELEGATION_BASE_URL = `${JAVA_API}/task-delegation`;

export const taskDelegationService = {
  // POST /api/task-delegation
  async create(data) {
    const res = await http(DELEGATION_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create delegation');
    return res.json();
  },

  // GET /api/task-delegation
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

  // PUT /api/task-delegation/{id}/approve
  async approve(delegationId) {
    const res = await http(`${DELEGATION_BASE_URL}/${delegationId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to approve delegation');
    return res.json();
  },

  // PUT /api/task-delegation/{id}/reject
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
  checklist: checklistService,
  attachment: attachmentService,
  activity: activityService,
  label: labelService,
  employee: employeeService,
  task: taskService,
  taskDelegation: taskDelegationService,
};
