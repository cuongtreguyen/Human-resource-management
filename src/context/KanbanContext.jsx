// src/context/KanbanContext.jsx
// Kanban Board State Management with Context API

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import kanbanService from '../services/kanbanService';
import { getCurrentEmployeeId } from '../utils/auth';

const KanbanContext = createContext();

const STORAGE_KEY = 'hrm_kanban_data';

export const useKanbanContext = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanbanContext must be used within a KanbanProvider');
  }
  return context;
};

// Priority levels
export const PRIORITIES = {
  LOW: { value: 'LOW', label: 'Thấp', color: 'bg-gray-400', textColor: 'text-gray-600' },
  MEDIUM: { value: 'MEDIUM', label: 'Trung bình', color: 'bg-blue-400', textColor: 'text-blue-600' },
  HIGH: { value: 'HIGH', label: 'Cao', color: 'bg-orange-400', textColor: 'text-orange-600' },
  URGENT: { value: 'URGENT', label: 'Khẩn cấp', color: 'bg-red-500', textColor: 'text-red-600' },
};

// List status mapping
export const LIST_STATUS_MAP = {
  'TODO': 'TODO',
  'To Do': 'TODO',
  'Cần làm': 'TODO',
  'In Progress': 'IN_PROGRESS',
  'Đang làm': 'IN_PROGRESS',
  'Review': 'REVIEW',
  'Đang review': 'REVIEW',
  'Done': 'DONE',
  'Hoàn thành': 'DONE',
};

// Default labels colors
export const LABEL_COLORS = [
  { name: 'green', bg: 'bg-green-500', text: 'text-white' },
  { name: 'yellow', bg: 'bg-yellow-500', text: 'text-white' },
  { name: 'orange', bg: 'bg-orange-500', text: 'text-white' },
  { name: 'red', bg: 'bg-red-500', text: 'text-white' },
  { name: 'purple', bg: 'bg-purple-500', text: 'text-white' },
  { name: 'blue', bg: 'bg-blue-500', text: 'text-white' },
  { name: 'cyan', bg: 'bg-cyan-500', text: 'text-white' },
  { name: 'pink', bg: 'bg-pink-500', text: 'text-white' },
  { name: 'lime', bg: 'bg-lime-500', text: 'text-white' },
  { name: 'gray', bg: 'bg-gray-500', text: 'text-white' },
];

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Default board data for demo
const defaultBoards = [
  {
    id: 'board-1',
    name: 'Dự án Website Công ty',
    ownerId: 'user-1',
    ownerName: 'Nguyễn Văn An',
    ownerEmail: 'an.nguyen@company.com',
    status: 'ACTIVE',
    closed: false,
    members: [
      { id: 'member-1', boardId: 'board-1', accountId: 'user-1', name: 'Nguyễn Văn An', email: 'an.nguyen@company.com', role: 'OWNER' },
      { id: 'member-2', boardId: 'board-1', accountId: 'user-2', name: 'Trần Thị Bình', email: 'binh.tran@company.com', role: 'MEMBER' },
      { id: 'member-3', boardId: 'board-1', accountId: 'user-3', name: 'Lê Văn Cường', email: 'cuong.le@company.com', role: 'MEMBER' },
    ],
    labels: [
      { id: 'label-1', boardId: 'board-1', name: 'Bug', color: 'red' },
      { id: 'label-2', boardId: 'board-1', name: 'Feature', color: 'green' },
      { id: 'label-3', boardId: 'board-1', name: 'Improvement', color: 'blue' },
      { id: 'label-4', boardId: 'board-1', name: 'Documentation', color: 'yellow' },
    ],
    lists: [
      {
        id: 'list-1',
        boardId: 'board-1',
        name: 'TODO',
        position: 1.0,
        cards: [
          {
            id: 'card-1',
            listId: 'list-1',
            title: 'Thiết kế trang chủ',
            description: 'Tạo wireframe và mockup cho trang chủ website mới',
            position: 1.0,
            priority: 'HIGH',
            dueDate: '2024-12-20',
            assignees: [
              { id: 'user-2', name: 'Trần Thị Bình', email: 'binh.tran@company.com' }
            ],
            labels: [{ id: 'label-2', name: 'Feature', color: 'green' }],
            attachmentCount: 2,
            commentCount: 3,
            checkListProgress: { completed: 2, total: 5 },
          },
          {
            id: 'card-2',
            listId: 'list-1',
            title: 'Setup database schema',
            description: 'Thiết kế và tạo database schema cho các bảng chính',
            position: 2.0,
            priority: 'URGENT',
            dueDate: '2024-12-15',
            assignees: [
              { id: 'user-3', name: 'Lê Văn Cường', email: 'cuong.le@company.com' }
            ],
            labels: [{ id: 'label-2', name: 'Feature', color: 'green' }],
            attachmentCount: 0,
            commentCount: 1,
            checkListProgress: null,
          },
        ],
      },
      {
        id: 'list-2',
        boardId: 'board-1',
        name: 'In Progress',
        position: 2.0,
        cards: [
          {
            id: 'card-3',
            listId: 'list-2',
            title: 'Implement authentication',
            description: 'Xây dựng hệ thống đăng nhập với JWT',
            position: 1.0,
            priority: 'HIGH',
            dueDate: '2024-12-18',
            assignees: [
              { id: 'user-1', name: 'Nguyễn Văn An', email: 'an.nguyen@company.com' },
              { id: 'user-3', name: 'Lê Văn Cường', email: 'cuong.le@company.com' }
            ],
            labels: [{ id: 'label-2', name: 'Feature', color: 'green' }],
            attachmentCount: 1,
            commentCount: 5,
            checkListProgress: { completed: 3, total: 4 },
          },
        ],
      },
      {
        id: 'list-3',
        boardId: 'board-1',
        name: 'Review',
        position: 3.0,
        cards: [
          {
            id: 'card-4',
            listId: 'list-3',
            title: 'Fix responsive issues',
            description: 'Sửa các vấn đề hiển thị trên thiết bị mobile',
            position: 1.0,
            priority: 'MEDIUM',
            dueDate: '2024-12-16',
            assignees: [
              { id: 'user-2', name: 'Trần Thị Bình', email: 'binh.tran@company.com' }
            ],
            labels: [{ id: 'label-1', name: 'Bug', color: 'red' }],
            attachmentCount: 0,
            commentCount: 2,
            checkListProgress: null,
          },
        ],
      },
      {
        id: 'list-4',
        boardId: 'board-1',
        name: 'Done',
        position: 4.0,
        cards: [
          {
            id: 'card-5',
            listId: 'list-4',
            title: 'Setup CI/CD pipeline',
            description: 'Cấu hình GitHub Actions cho auto deployment',
            position: 1.0,
            priority: 'HIGH',
            dueDate: '2024-12-10',
            assignees: [
              { id: 'user-1', name: 'Nguyễn Văn An', email: 'an.nguyen@company.com' }
            ],
            labels: [{ id: 'label-3', name: 'Improvement', color: 'blue' }],
            attachmentCount: 1,
            commentCount: 4,
            checkListProgress: { completed: 3, total: 3 },
          },
        ],
      },
    ],
  },
  {
    id: 'board-2',
    name: 'Marketing Campaign Q4',
    ownerId: 'user-4',
    ownerName: 'Phạm Thị Dung',
    ownerEmail: 'dung.pham@company.com',
    status: 'ACTIVE',
    closed: false,
    members: [
      { id: 'member-4', boardId: 'board-2', accountId: 'user-4', name: 'Phạm Thị Dung', email: 'dung.pham@company.com', role: 'OWNER' },
      { id: 'member-5', boardId: 'board-2', accountId: 'user-5', name: 'Hoàng Văn Em', email: 'em.hoang@company.com', role: 'MEMBER' },
    ],
    labels: [
      { id: 'label-5', boardId: 'board-2', name: 'Social Media', color: 'cyan' },
      { id: 'label-6', boardId: 'board-2', name: 'Content', color: 'purple' },
      { id: 'label-7', boardId: 'board-2', name: 'Ads', color: 'orange' },
    ],
    lists: [
      {
        id: 'list-5',
        boardId: 'board-2',
        name: 'Cần làm',
        position: 1.0,
        cards: [
          {
            id: 'card-6',
            listId: 'list-5',
            title: 'Lên content plan tháng 12',
            description: 'Xây dựng content calendar cho tháng 12',
            position: 1.0,
            priority: 'HIGH',
            dueDate: '2024-12-12',
            assignees: [{ id: 'user-4', name: 'Phạm Thị Dung', email: 'dung.pham@company.com' }],
            labels: [{ id: 'label-6', name: 'Content', color: 'purple' }],
            attachmentCount: 1,
            commentCount: 2,
            checkListProgress: null,
          },
        ],
      },
      {
        id: 'list-6',
        boardId: 'board-2',
        name: 'Đang làm',
        position: 2.0,
        cards: [
          {
            id: 'card-7',
            listId: 'list-6',
            title: 'Thiết kế banner Giáng sinh',
            description: 'Tạo banner quảng cáo cho chiến dịch Giáng sinh',
            position: 1.0,
            priority: 'MEDIUM',
            dueDate: '2024-12-18',
            assignees: [{ id: 'user-5', name: 'Hoàng Văn Em', email: 'em.hoang@company.com' }],
            labels: [{ id: 'label-7', name: 'Ads', color: 'orange' }],
            attachmentCount: 3,
            commentCount: 4,
            checkListProgress: { completed: 2, total: 4 },
          },
        ],
      },
      {
        id: 'list-7',
        boardId: 'board-2',
        name: 'Đang review',
        position: 3.0,
        cards: [],
      },
      {
        id: 'list-8',
        boardId: 'board-2',
        name: 'Hoàn thành',
        position: 4.0,
        cards: [
          {
            id: 'card-8',
            listId: 'list-8',
            title: 'Chạy Facebook Ads Q4',
            description: 'Launch chiến dịch quảng cáo Facebook',
            position: 1.0,
            priority: 'HIGH',
            dueDate: '2024-12-05',
            assignees: [{ id: 'user-4', name: 'Phạm Thị Dung', email: 'dung.pham@company.com' }],
            labels: [{ id: 'label-7', name: 'Ads', color: 'orange' }, { id: 'label-5', name: 'Social Media', color: 'cyan' }],
            attachmentCount: 2,
            commentCount: 6,
            checkListProgress: { completed: 5, total: 5 },
          },
        ],
      },
    ],
  },
  {
    id: 'board-3',
    name: 'Tuyển dụng IT 2024',
    ownerId: 'user-6',
    ownerName: 'Vũ Thị Giang',
    ownerEmail: 'giang.vu@company.com',
    status: 'ACTIVE',
    closed: false,
    members: [
      { id: 'member-6', boardId: 'board-3', accountId: 'user-6', name: 'Vũ Thị Giang', email: 'giang.vu@company.com', role: 'OWNER' },
    ],
    labels: [
      { id: 'label-8', boardId: 'board-3', name: 'Frontend', color: 'blue' },
      { id: 'label-9', boardId: 'board-3', name: 'Backend', color: 'green' },
      { id: 'label-10', boardId: 'board-3', name: 'Senior', color: 'red' },
    ],
    lists: [
      { id: 'list-9', boardId: 'board-3', name: 'TODO', position: 1.0, cards: [] },
      { id: 'list-10', boardId: 'board-3', name: 'In Progress', position: 2.0, cards: [] },
      { id: 'list-11', boardId: 'board-3', name: 'Review', position: 3.0, cards: [] },
      { id: 'list-12', boardId: 'board-3', name: 'Done', position: 4.0, cards: [] },
    ],
  },
];

// Default comments data
const defaultComments = {
  'card-1': [
    { id: 'comment-1', cardId: 'card-1', authorId: 'user-1', authorName: 'Nguyễn Văn An', content: 'Đã xem qua design, cần thêm phần hero section', createdAt: '2024-12-01T10:30:00Z', updatedAt: null },
    { id: 'comment-2', cardId: 'card-1', authorId: 'user-2', authorName: 'Trần Thị Bình', content: 'Đã cập nhật wireframe mới', createdAt: '2024-12-02T14:20:00Z', updatedAt: null },
  ],
  'card-3': [
    { id: 'comment-3', cardId: 'card-3', authorId: 'user-3', authorName: 'Lê Văn Cường', content: 'JWT đã implement xong, đang test', createdAt: '2024-12-03T09:15:00Z', updatedAt: null },
  ],
};

// Default activities
const defaultActivities = {
  'card-1': [
    { id: 'activity-1', cardId: 'card-1', boardId: 'board-1', actorId: 'user-1', actorName: 'Nguyễn Văn An', action: 'CREATED', description: 'đã tạo thẻ này', createdAt: '2024-11-28T08:00:00Z' },
    { id: 'activity-2', cardId: 'card-1', boardId: 'board-1', actorId: 'user-1', actorName: 'Nguyễn Văn An', action: 'ASSIGNED', description: 'đã gán Trần Thị Bình vào thẻ', createdAt: '2024-11-28T08:05:00Z' },
  ],
};

// Default departments
const defaultDepartments = [
  { id: 'dept-it', name: 'Công nghệ thông tin', code: 'IT' },
  { id: 'dept-hr', name: 'Nhân sự', code: 'HR' },
  { id: 'dept-marketing', name: 'Marketing', code: 'MKT' },
  { id: 'dept-finance', name: 'Tài chính', code: 'FIN' },
  { id: 'dept-sales', name: 'Kinh doanh', code: 'SALES' },
];

// Default employees - Danh sách nhân viên từ hệ thống
const defaultEmployees = [
  { id: 'emp-1', name: 'Nguyễn Văn An', email: 'an.nguyen@company.com', department: 'Công nghệ thông tin', departmentId: 'dept-it', position: 'Senior Developer', avatar: null },
  { id: 'emp-2', name: 'Trần Thị Bình', email: 'binh.tran@company.com', department: 'Công nghệ thông tin', departmentId: 'dept-it', position: 'Frontend Developer', avatar: null },
  { id: 'emp-3', name: 'Lê Văn Cường', email: 'cuong.le@company.com', department: 'Công nghệ thông tin', departmentId: 'dept-it', position: 'Backend Developer', avatar: null },
  { id: 'emp-4', name: 'Phạm Thị Dung', email: 'dung.pham@company.com', department: 'Marketing', departmentId: 'dept-marketing', position: 'Marketing Manager', avatar: null },
  { id: 'emp-5', name: 'Hoàng Văn Em', email: 'em.hoang@company.com', department: 'Marketing', departmentId: 'dept-marketing', position: 'Content Creator', avatar: null },
  { id: 'emp-6', name: 'Vũ Thị Giang', email: 'giang.vu@company.com', department: 'Nhân sự', departmentId: 'dept-hr', position: 'HR Manager', avatar: null },
  { id: 'emp-7', name: 'Đặng Văn Hùng', email: 'hung.dang@company.com', department: 'Tài chính', departmentId: 'dept-finance', position: 'Accountant', avatar: null },
  { id: 'emp-8', name: 'Ngô Thị Kim', email: 'kim.ngo@company.com', department: 'Kinh doanh', departmentId: 'dept-sales', position: 'Sales Executive', avatar: null },
  { id: 'emp-9', name: 'Bùi Văn Long', email: 'long.bui@company.com', department: 'Công nghệ thông tin', departmentId: 'dept-it', position: 'DevOps Engineer', avatar: null },
  { id: 'emp-10', name: 'Trương Thị Mai', email: 'mai.truong@company.com', department: 'Marketing', departmentId: 'dept-marketing', position: 'Graphic Designer', avatar: null },
];

export const KanbanProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [comments, setComments] = useState({});
  const [activities, setActivities] = useState({});
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadingBoardsRef = useRef(new Set()); // Track which boards are being loaded (use ref to avoid re-renders)

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading Kanban data from API...');
        
        // Load boards from API
        try {
          console.log('📋 Fetching boards...');
          const boardsRes = await kanbanService.board.getAll();
          console.log('✅ Boards response:', boardsRes);
          const boardsData = Array.isArray(boardsRes?.data) ? boardsRes.data : 
                           Array.isArray(boardsRes) ? boardsRes : [];
          console.log('📊 Boards data:', boardsData);
          setBoards(boardsData);
        } catch (boardsError) {
          console.error('❌ Error loading boards:', boardsError);
          setBoards([]);
        }
        
        // Load employees from API
        try {
          console.log('👥 Fetching employees...');
          const employeesRes = await kanbanService.employee.getAll();
          console.log('✅ Employees response:', employeesRes);
          const employeesData = Array.isArray(employeesRes?.data) ? employeesRes.data : 
                               Array.isArray(employeesRes) ? employeesRes : [];
          setEmployees(employeesData);
        } catch (employeesError) {
          console.error('❌ Error loading employees:', employeesError);
          setEmployees([]);
        }
        
        // Load departments from API
        try {
          console.log('🏢 Fetching departments...');
          const departmentsRes = await kanbanService.employee.getDepartments();
          console.log('✅ Departments response:', departmentsRes);
          const departmentsData = Array.isArray(departmentsRes?.data) ? departmentsRes.data : 
                                 Array.isArray(departmentsRes) ? departmentsRes : [];
          setDepartments(departmentsData);
        } catch (departmentsError) {
          console.error('❌ Error loading departments:', departmentsError);
          setDepartments([]);
        }
        
        console.log('✅ All Kanban data loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
        // Fallback to empty arrays on error
        setBoards([]);
        setEmployees([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // ============== BOARD OPERATIONS ==============

  const createBoard = useCallback(async (data) => {
    try {
      // BE chỉ cần name, ownerId/employeeId tự lấy từ token
      const createData = { name: data.name };
      
      console.log('📤 Creating board with data:', createData);
      const response = await kanbanService.board.create(createData);
      const newBoard = response.data || response;
      console.log('✅ Board created:', newBoard);
      
      // Reload all boards to get updated list
      try {
        const boardsRes = await kanbanService.board.getAll();
        const boardsData = Array.isArray(boardsRes?.data) ? boardsRes.data : 
                         Array.isArray(boardsRes) ? boardsRes : [];
        setBoards(boardsData);
        console.log('✅ Boards reloaded:', boardsData);
      } catch (reloadError) {
        console.warn('⚠️ Failed to reload boards, adding new board to state:', reloadError);
        // Fallback: add the new board to state even if reload fails
        setBoards(prev => [...prev, newBoard]);
      }
      
      toast.success('Tạo board thành công!');
      return newBoard;
    } catch (error) {
      console.error('Error creating board:', error);
      // Try to get error message from response
      let errorMessage = 'Có lỗi xảy ra khi tạo board';
      try {
        if (error.response) {
          const errorData = await error.response.json();
          errorMessage = errorData.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        // Ignore parse errors
      }
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const updateBoard = useCallback(async (boardId, data) => {
    try {
      // NOTE: API PUT /api/boards/{id} có thể chưa có, cần kiểm tra với BE
      // Tạm thời chỉ update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? { ...board, ...data } : board
      ));
      toast.success('Cập nhật board thành công!');
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Có lỗi xảy ra khi cập nhật board');
      throw error;
    }
  }, []);

  const deleteBoard = useCallback(async (boardId) => {
    try {
      await kanbanService.board.delete(boardId);
      setBoards(prev => prev.filter(board => board.id !== boardId));
      toast.success('Xóa board thành công!');
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Có lỗi xảy ra khi xóa board');
      throw error;
    }
  }, []);

  const getBoardById = useCallback(async (boardId) => {
    if (!boardId || boardId === 'undefined') {
      return { id: boardId, name: 'Unknown Board', lists: [] };
    }
    
    const boardIdStr = String(boardId);
    
    // Quick check: if already loading, return cached board if available
    if (loadingBoardsRef.current.has(boardIdStr)) {
      const cached = boards.find(b => String(b.id) === boardIdStr);
      if (cached?.lists?.length > 0) {
        return cached;
      }
    }
    
    // Find board in local state
    let localBoard = boards.find(b => String(b.id) === boardIdStr);
    
    // If not found, reload boards list once
    if (!localBoard) {
      try {
        const boardsRes = await kanbanService.board.getAll();
        const boardsData = Array.isArray(boardsRes?.data) ? boardsRes.data : Array.isArray(boardsRes) ? boardsRes : [];
        setBoards(boardsData);
        localBoard = boardsData.find(b => String(b.id) === boardIdStr);
        if (!localBoard) {
          return { id: boardId, name: 'Unknown Board', lists: [] };
        }
      } catch {
        return { id: boardId, name: 'Unknown Board', lists: [] };
      }
    }
    
    // If board already has valid lists with cards, return immediately
    if (localBoard.lists?.length > 0 && localBoard.lists.every(l => l.cards !== undefined)) {
      return localBoard;
    }
    
    // Mark as loading
    loadingBoardsRef.current.add(boardIdStr);
    
    try {
      // Load lists and labels in parallel
      const [listsRes, labelsRes] = await Promise.all([
        kanbanService.list.getByBoard(boardId),
        kanbanService.label.getByBoard(boardId).catch(() => ({ data: [] })), // Fallback to empty if labels fail
      ]);
      
      let listsData = Array.isArray(listsRes?.data) ? listsRes.data : Array.isArray(listsRes) ? listsRes : [];
      const labelsData = Array.isArray(labelsRes?.data) ? labelsRes.data : Array.isArray(labelsRes) ? labelsRes : [];
      
      // Create default lists if needed (parallel)
      if (listsData.length === 0) {
        const defaultListNames = ['TODO', 'In Progress', 'Review', 'Done'];
        const createdLists = await Promise.all(
          defaultListNames.map((name, index) =>
            kanbanService.list.create(boardId, { name, position: index + 1 })
              .then(res => res.data || res)
              .catch(() => null)
          )
        );
        const validLists = createdLists.filter(Boolean);
        if (validLists.length > 0) {
          const reloadedRes = await kanbanService.list.getByBoard(boardId);
          listsData = Array.isArray(reloadedRes?.data) ? reloadedRes.data : Array.isArray(reloadedRes) ? reloadedRes : [];
        }
      }
      
      // Return board with lists and labels immediately (progressive loading)
      const boardWithLists = { 
        ...localBoard, 
        lists: listsData.map(l => ({ ...l, cards: [] })),
        labels: labelsData,
      };
      
      // Update state immediately with lists and labels (without cards)
      setBoards(prev => prev.map(b => String(b.id) === boardIdStr ? boardWithLists : b));
      
      // Load cards in parallel (non-blocking)
      Promise.all(
        listsData.map(async (list) => {
          try {
            const cardsRes = await kanbanService.card.getByList(list.id);
            const cards = Array.isArray(cardsRes?.data) ? cardsRes.data : Array.isArray(cardsRes) ? cardsRes : [];
            
            // Map assigneeIds (Long) to assignees objects from employees list
            // BE trả về assigneeIds là mảng Long (id của Employee entity), không phải employeeId string
            const cardsWithAssignees = cards.map(card => {
              if (card.assigneeIds && Array.isArray(card.assigneeIds) && card.assigneeIds.length > 0) {
                const assignees = employees
                  .filter(emp => {
                    // Employee.id là Long (primary key), đây là field BE dùng trong assigneeIds
                    const empId = emp.id != null ? Number(emp.id) : null;
                    return empId != null && !isNaN(empId) && card.assigneeIds.includes(empId);
                  })
                  .map(emp => ({
                    id: Number(emp.id), // Long ID từ Employee entity
                    employeeId: emp.employeeId || emp.id, // String employeeId hoặc fallback
                    name: emp.fullName || emp.name || 'Unknown',
                    email: emp.email || '',
                    department: emp.department || '',
                    position: emp.position || '',
                  }))
                  .filter(a => a.id != null);
                
                return { ...card, assignees };
              }
              return { ...card, assignees: [] };
            });
            
            return { listId: list.id, cards: cardsWithAssignees };
          } catch {
            return { listId: list.id, cards: [] };
          }
        })
      ).then(cardsResults => {
        // Update state with cards after they load
        setBoards(prev => prev.map(b => {
          if (String(b.id) === boardIdStr) {
            return {
              ...b,
              lists: b.lists.map(list => {
                const cardsResult = cardsResults.find(cr => String(cr.listId) === String(list.id));
                return cardsResult ? { ...list, cards: cardsResult.cards } : list;
              })
            };
          }
          return b;
        }));
      });
      
      loadingBoardsRef.current.delete(boardIdStr);
      return boardWithLists;
    } catch (error) {
      loadingBoardsRef.current.delete(boardIdStr);
      return { ...localBoard, lists: [] };
    }
  }, [boards, employees]); // Add employees to dependencies for assignee mapping

  // ============== LIST OPERATIONS ==============

  const createList = useCallback(async (boardId, data) => {
    if (!boardId || boardId === 'undefined') {
      console.error('Invalid boardId for createList:', boardId);
      toast.error('Board ID không hợp lệ');
      return null;
    }
    
    try {
      const response = await kanbanService.list.create(boardId, { name: data.name });
      const newList = response.data || response;
      
      // Update local state - add new list to board
      setBoards(prev => prev.map(b => {
        if (b.id === boardId || String(b.id) === String(boardId)) {
          const currentLists = b.lists || [];
          return {
            ...b,
            lists: [...currentLists, newList]
          };
        }
        return b;
      }));
      
      toast.success('Tạo danh sách thành công!');
      return newList;
    } catch (error) {
      console.error('Error creating list:', error);
      toast.error('Có lỗi xảy ra khi tạo danh sách');
      throw error;
    }
  }, []);

  const updateList = useCallback(async (boardId, listId, data) => {
    try {
      await kanbanService.list.update(listId, data);
      
      // Update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          lists: board.lists.map(list =>
            list.id === listId ? { ...list, ...data } : list
          ),
        } : board
      ));
    } catch (error) {
      console.error('Error updating list:', error);
      toast.error('Có lỗi xảy ra khi cập nhật danh sách');
      throw error;
    }
  }, []);

  const deleteList = useCallback(async (boardId, listId) => {
    try {
      await kanbanService.list.delete(listId);
      
      // Update local state - remove list from board
      setBoards(prev => prev.map(board => {
        if (board.id === boardId || String(board.id) === String(boardId)) {
          return {
            ...board,
            lists: (board.lists || []).filter(list => list.id !== listId)
          };
        }
        return board;
      }));
      
      toast.success('Xóa danh sách thành công!');
    } catch (error) {
      console.error('Error deleting list:', error);
      toast.error('Có lỗi xảy ra khi xóa danh sách');
      throw error;
    }
  }, []);

  // ============== CARD OPERATIONS ==============

  const createCard = useCallback(async (boardId, listId, data) => {
    try {
      // Validate listId - must be a number (Long), not a temporary string ID
      if (typeof listId === 'string' && (listId.startsWith('list-todo') || listId.startsWith('list-in-progress') || listId.startsWith('list-review') || listId.startsWith('list-done'))) {
        console.error('❌ Invalid listId:', listId, '- Cannot use temporary IDs. List must be created via API first.');
        toast.error('Danh sách chưa được tạo. Vui lòng tải lại trang.');
        throw new Error('Invalid listId: temporary ID not allowed');
      }
      
      console.log('📤 Creating card with listId:', listId, 'data:', data);
      // BE chỉ nhận 'title', không nhận 'description' khi tạo card
      const response = await kanbanService.card.create(listId, {
        title: data.title
      });
      const newCard = response.data || response;
      console.log('✅ Card created:', newCard);
      
      // Reload cards for the list to get updated data from BE
      try {
        const cardsRes = await kanbanService.card.getByList(listId);
        const cards = Array.isArray(cardsRes?.data) ? cardsRes.data : Array.isArray(cardsRes) ? cardsRes : [];
        
            // Map assigneeIds (Long) to assignees objects
            // BE trả về assigneeIds là mảng Long (id của Employee entity)
            const cardsWithAssignees = cards.map(card => {
              if (card.assigneeIds && Array.isArray(card.assigneeIds) && card.assigneeIds.length > 0) {
                const assignees = employees
                  .filter(emp => {
                    // Employee.id là Long (primary key)
                    const empId = emp.id != null ? Number(emp.id) : null;
                    return empId != null && !isNaN(empId) && card.assigneeIds.includes(empId);
                  })
                  .map(emp => ({
                    id: Number(emp.id), // Long ID từ Employee entity
                    employeeId: emp.employeeId || emp.id, // String employeeId hoặc fallback
                    name: emp.fullName || emp.name || 'Unknown',
                    email: emp.email || '',
                    department: emp.department || '',
                    position: emp.position || '',
                  }))
                  .filter(a => a.id != null);
                
                return { ...card, assignees };
              }
              return { ...card, assignees: [] };
            });
        
        // Update local state - replace cards for the list
        setBoards(prev => prev.map(b => {
          if (b.id === boardId || String(b.id) === String(boardId)) {
            return {
              ...b,
              lists: (b.lists || []).map(list => {
                if (list.id === listId || String(list.id) === String(listId)) {
                  return {
                    ...list,
                    cards: cardsWithAssignees
                  };
                }
                return list;
              })
            };
          }
          return b;
        }));
      } catch (reloadError) {
        console.warn('⚠️ Failed to reload cards, updating local state only:', reloadError);
        // Fallback: update local state directly
        setBoards(prev => prev.map(b => {
          if (b.id === boardId || String(b.id) === String(boardId)) {
            return {
              ...b,
              lists: (b.lists || []).map(list => {
                if (list.id === listId || String(list.id) === String(listId)) {
                  return {
                    ...list,
                    cards: [...(list.cards || []), { ...newCard, assignees: [] }]
                  };
                }
                return list;
              })
            };
          }
          return b;
        }));
      }
      
      toast.success('Tạo thẻ thành công!');
      return newCard;
    } catch (error) {
      console.error('Error creating card:', error);
      let errorMessage = 'Có lỗi xảy ra khi tạo thẻ';
      try {
        if (error.response) {
          const errorData = await error.response.json();
          errorMessage = errorData.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        // Ignore parse errors
      }
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const updateCard = useCallback(async (boardId, listId, cardId, data) => {
    try {
      // Transform data to match BE API format
      const updateData = { ...data };
      
      // If assignees is provided, convert to assigneeIds (must be numbers/Long)
      // assigneeIds phải là Employee.id (Long), không phải employeeId (String)
      if (data.assignees && Array.isArray(data.assignees)) {
        updateData.assigneeIds = data.assignees.map(a => {
          // a.id là Long (Employee.id), không phải employeeId string
          const id = a.id != null ? Number(a.id) : null;
          if (id == null || isNaN(id)) {
            console.warn('⚠️ Invalid assignee ID:', a);
            return null;
          }
          return id;
        }).filter(id => id != null);
        delete updateData.assignees;
      }
      
      // Ensure assigneeIds are numbers (not strings) - Employee.id (Long)
      if (data.assigneeIds && Array.isArray(data.assigneeIds)) {
        updateData.assigneeIds = data.assigneeIds.map(id => {
          const numId = typeof id === 'string' ? Number(id) : id;
          if (isNaN(numId)) {
            console.warn('⚠️ Invalid assigneeId (not a number):', id);
            return null;
          }
          return numId;
        }).filter(id => id != null);
      }
      
      // If labels is provided, convert to labelIds
      if (data.labels && Array.isArray(data.labels)) {
        updateData.labelIds = data.labels.map(l => l.id || l);
        delete updateData.labels;
      }
      
      // Only send fields that BE accepts: title, description, priority, dueDate, assigneeIds, labelIds, reminderDate
      const allowedFields = ['title', 'description', 'priority', 'dueDate', 'assigneeIds', 'labelIds', 'reminderDate'];
      const filteredData = Object.keys(updateData).reduce((acc, key) => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          acc[key] = updateData[key];
        }
        return acc;
      }, {});
      
      console.log('📤 Updating card:', cardId, 'with data:', filteredData);
      await kanbanService.card.update(cardId, filteredData);
      
      // Reload card from BE to get updated data (including assigneeIds)
      try {
        const updatedCardRes = await kanbanService.card.getById(cardId);
        const updatedCard = updatedCardRes.data || updatedCardRes;
        
        // Map assigneeIds (Long) to assignees objects
        // BE trả về assigneeIds là mảng Long (id của Employee entity)
        if (updatedCard.assigneeIds && Array.isArray(updatedCard.assigneeIds) && updatedCard.assigneeIds.length > 0) {
          updatedCard.assignees = employees
            .filter(emp => {
              // Employee.id là Long (primary key)
              const empId = emp.id != null ? Number(emp.id) : null;
              return empId != null && !isNaN(empId) && updatedCard.assigneeIds.includes(empId);
            })
            .map(emp => ({
              id: Number(emp.id), // Long ID từ Employee entity
              employeeId: emp.employeeId || emp.id, // String employeeId hoặc fallback
              name: emp.fullName || emp.name || 'Unknown',
              email: emp.email || '',
              department: emp.department || '',
              position: emp.position || '',
            }))
            .filter(a => a.id != null);
        } else {
          updatedCard.assignees = [];
        }
        
        // Update local state with full card data
        setBoards(prev => prev.map(board =>
          board.id === boardId ? {
            ...board,
            lists: board.lists.map(list =>
              list.id === listId ? {
                ...list,
                cards: list.cards.map(card =>
                  card.id === cardId ? updatedCard : card
                ),
              } : list
            ),
          } : board
        ));
      } catch (reloadError) {
        console.warn('⚠️ Failed to reload card, updating local state only:', reloadError);
        // Fallback: update local state with assigneeIds mapped to assignees
        setBoards(prev => prev.map(board =>
          board.id === boardId ? {
            ...board,
            lists: board.lists.map(list =>
              list.id === listId ? {
                ...list,
                cards: list.cards.map(card => {
                  if (card.id === cardId) {
                    const updatedCard = { ...card, ...data };
                    // If assigneeIds was sent, map to assignees
                    // assigneeIds là Employee.id (Long)
                    if (data.assigneeIds && Array.isArray(data.assigneeIds)) {
                      updatedCard.assigneeIds = data.assigneeIds;
                      updatedCard.assignees = employees
                        .filter(emp => {
                          // Employee.id là Long (primary key)
                          const empId = emp.id != null ? Number(emp.id) : null;
                          return empId != null && !isNaN(empId) && data.assigneeIds.includes(empId);
                        })
                        .map(emp => ({
                          id: Number(emp.id), // Long ID từ Employee entity
                          employeeId: emp.employeeId || emp.id, // String employeeId hoặc fallback
                          name: emp.fullName || emp.name || 'Unknown',
                          email: emp.email || '',
                          department: emp.department || '',
                          position: emp.position || '',
                        }))
                        .filter(a => a.id != null);
                    }
                    return updatedCard;
                  }
                  return card;
                }),
              } : list
            ),
          } : board
        ));
      }
      
      toast.success('Cập nhật thẻ thành công!');
    } catch (error) {
      console.error('Error updating card:', error);
      let errorMessage = 'Có lỗi xảy ra khi cập nhật thẻ';
      try {
        if (error.response) {
          const errorData = await error.response.json();
          errorMessage = errorData.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        // Ignore parse errors
      }
      toast.error(errorMessage);
      throw error;
    }
  }, [employees]);

  const deleteCard = useCallback(async (boardId, listId, cardId) => {
    if (!boardId || boardId === 'undefined') {
      console.error('Invalid boardId for deleteCard:', boardId);
      toast.error('Board ID không hợp lệ');
      return;
    }
    
    try {
      await kanbanService.card.delete(cardId);
      
      // Update local state - remove card from list
      setBoards(prev => prev.map(board => {
        if (board.id === boardId || String(board.id) === String(boardId)) {
          return {
            ...board,
            lists: (board.lists || []).map(list => {
              if (list.id === listId) {
                return {
                  ...list,
                  cards: (list.cards || []).filter(card => card.id !== cardId)
                };
              }
              return list;
            })
          };
        }
        return board;
      }));
      
      toast.success('Xóa thẻ thành công!');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Có lỗi xảy ra khi xóa thẻ');
      throw error;
    }
  }, []);

  const moveCard = useCallback(async (boardId, sourceListId, targetListId, cardId, targetPosition) => {
    if (!boardId || boardId === 'undefined') {
      console.error('Invalid boardId for moveCard:', boardId);
      toast.error('Board ID không hợp lệ');
      return;
    }
    
    try {
      // Call API to move card
      await kanbanService.card.move(cardId, targetListId, targetPosition);
      
      // Update local state - move card from source list to target list
      setBoards(prev => prev.map(board => {
        if (board.id === boardId || String(board.id) === String(boardId)) {
          let movedCard = null;
          const updatedLists = (board.lists || []).map(list => {
            if (list.id === sourceListId) {
              // Remove card from source list
              const cards = (list.cards || []).filter(card => {
                if (card.id === cardId) {
                  movedCard = { ...card, listId: targetListId, position: targetPosition };
                  return false;
                }
                return true;
              });
              return { ...list, cards };
            }
            return list;
          });
          
          // Add card to target list
          const finalLists = updatedLists.map(list => {
            if (list.id === targetListId && movedCard) {
              return {
                ...list,
                cards: [...(list.cards || []), movedCard].sort((a, b) => (a.position || 0) - (b.position || 0))
              };
            }
            return list;
          });
          
          return { ...board, lists: finalLists };
        }
        return board;
      }));
      
      if (sourceListId !== targetListId) {
        toast.success('Di chuyển thẻ thành công!');
      }
    } catch (error) {
      console.error('Error moving card:', error);
      toast.error('Có lỗi xảy ra khi di chuyển thẻ');
      throw error;
    }
  }, []);

  const getCardById = useCallback((boardId, cardId) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return null;

    for (const list of board.lists) {
      const card = list.cards.find(c => c.id === cardId);
      if (card) return { ...card, listName: list.name };
    }
    return null;
  }, [boards]);

  // ============== MEMBER OPERATIONS ==============

  const addMember = useCallback(async (boardId, data) => {
    try {
      const response = await kanbanService.member.add(boardId, {
        employeeId: data.accountId || data.employeeId,
        role: data.role || 'MEMBER'
      });
      const newMember = response.data || response;
      
      // Update local state - add member to board
      setBoards(prev => prev.map(board => {
        if (board.id === boardId || String(board.id) === String(boardId)) {
          const currentMembers = board.members || [];
          return {
            ...board,
            members: [...currentMembers, newMember],
            memberCount: (board.memberCount || 0) + 1
          };
        }
        return board;
      }));
      
      toast.success('Thêm thành viên thành công!');
      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Có lỗi xảy ra khi thêm thành viên');
      throw error;
    }
  }, []);

  const removeMember = useCallback(async (boardId, memberId) => {
    try {
      await kanbanService.member.remove(boardId, memberId);
      
      // Update local state - remove member from board
      setBoards(prev => prev.map(board => {
        if (board.id === boardId || String(board.id) === String(boardId)) {
          return {
            ...board,
            members: (board.members || []).filter(m => m.id !== memberId),
            memberCount: Math.max(0, (board.memberCount || 0) - 1)
          };
        }
        return board;
      }));
      
      toast.success('Xóa thành viên thành công!');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Có lỗi xảy ra khi xóa thành viên');
      throw error;
    }
  }, []);

  // ============== LABEL OPERATIONS ==============

  const createLabel = useCallback(async (boardId, data) => {
    try {
      const response = await kanbanService.label.create(boardId, {
        name: data.name,
        color: data.color,
      });
      const newLabel = response.data || response;
      
      // Reload labels for the board
      const labelsRes = await kanbanService.label.getByBoard(boardId);
      const labelsData = Array.isArray(labelsRes?.data) ? labelsRes.data : Array.isArray(labelsRes) ? labelsRes : [];
      
      // Update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          labels: labelsData,
        } : board
      ));
      
      toast.success('Tạo label thành công!');
      return newLabel;
    } catch (error) {
      console.error('Error creating label:', error);
      toast.error('Có lỗi xảy ra khi tạo label');
      throw error;
    }
  }, []);

  const updateLabel = useCallback(async (boardId, labelId, data) => {
    try {
      const response = await kanbanService.label.update(labelId, {
        name: data.name,
        color: data.color,
      });
      const updatedLabel = response.data || response;
      
      // Reload labels for the board
      const labelsRes = await kanbanService.label.getByBoard(boardId);
      const labelsData = Array.isArray(labelsRes?.data) ? labelsRes.data : Array.isArray(labelsRes) ? labelsRes : [];
      
      // Update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          labels: labelsData,
        } : board
      ));
      
      toast.success('Cập nhật label thành công!');
      return updatedLabel;
    } catch (error) {
      console.error('Error updating label:', error);
      toast.error('Có lỗi xảy ra khi cập nhật label');
      throw error;
    }
  }, []);

  const deleteLabel = useCallback(async (boardId, labelId) => {
    try {
      await kanbanService.label.delete(labelId);
      
      // Reload labels for the board
      const labelsRes = await kanbanService.label.getByBoard(boardId);
      const labelsData = Array.isArray(labelsRes?.data) ? labelsRes.data : Array.isArray(labelsRes) ? labelsRes : [];
      
      // Update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          labels: labelsData,
          lists: board.lists.map(list => ({
            ...list,
            cards: list.cards.map(card => ({
              ...card,
              labels: (card.labels || []).filter(l => l.id !== labelId),
            })),
          })),
        } : board
      ));
      
      toast.success('Xóa label thành công!');
    } catch (error) {
      console.error('Error deleting label:', error);
      toast.error('Có lỗi xảy ra khi xóa label');
      throw error;
    }
  }, []);

  const assignLabelToCard = useCallback(async (boardId, listId, cardId, labelId) => {
    try {
      await kanbanService.label.assignToCard(cardId, labelId);
      
      // Reload card labels
      const labelsRes = await kanbanService.label.getByCard(cardId);
      const cardLabels = Array.isArray(labelsRes?.data) ? labelsRes.data : Array.isArray(labelsRes) ? labelsRes : [];
      
      // Update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          lists: board.lists.map(list =>
            list.id === listId ? {
              ...list,
              cards: list.cards.map(card =>
                card.id === cardId
                  ? { ...card, labels: cardLabels }
                  : card
              ),
            } : list
          ),
        } : board
      ));
      
      toast.success('Thêm label vào card thành công!');
    } catch (error) {
      console.error('Error assigning label to card:', error);
      toast.error('Có lỗi xảy ra khi thêm label');
      throw error;
    }
  }, []);

  const removeLabelFromCard = useCallback(async (boardId, listId, cardId, labelId) => {
    try {
      await kanbanService.label.removeFromCard(cardId, labelId);
      
      // Reload card labels
      const labelsRes = await kanbanService.label.getByCard(cardId);
      const cardLabels = Array.isArray(labelsRes?.data) ? labelsRes.data : Array.isArray(labelsRes) ? labelsRes : [];
      
      // Update local state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? {
          ...board,
          lists: board.lists.map(list =>
            list.id === listId ? {
              ...list,
              cards: list.cards.map(card =>
                card.id === cardId
                  ? { ...card, labels: cardLabels }
                  : card
              ),
            } : list
          ),
        } : board
      ));
      
      toast.success('Xóa label khỏi card thành công!');
    } catch (error) {
      console.error('Error removing label from card:', error);
      toast.error('Có lỗi xảy ra khi xóa label');
      throw error;
    }
  }, []);

  // ============== COMMENT OPERATIONS ==============

  const addComment = useCallback(async (cardId, data) => {
    try {
      const response = await kanbanService.comment.create(cardId, {
        content: data.content
      });
      const newComment = response.data || response;
      
      // Reload comments for this card
      const commentsRes = await kanbanService.comment.getByCard(cardId);
      const commentsData = commentsRes.data || commentsRes || [];
      
      setComments(prev => ({
        ...prev,
        [cardId]: commentsData
      }));

      // Update local state - increment comment count on card
      setBoards(prev => prev.map(b => ({
        ...b,
        lists: (b.lists || []).map(list => ({
          ...list,
          cards: (list.cards || []).map(card => 
            card.id === cardId 
              ? { ...card, commentCount: (card.commentCount || 0) + 1 }
              : card
          )
        }))
      })));

      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Có lỗi xảy ra khi thêm comment');
      throw error;
    }
  }, [boards]);

  const updateComment = useCallback(async (cardId, commentId, content) => {
    try {
      await kanbanService.comment.update(commentId, { content });
      
      // Reload comments
      const commentsRes = await kanbanService.comment.getByCard(cardId);
      const commentsData = commentsRes.data || commentsRes || [];
      
      setComments(prev => ({
        ...prev,
        [cardId]: commentsData
      }));
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Có lỗi xảy ra khi cập nhật comment');
      throw error;
    }
  }, []);

  const deleteComment = useCallback(async (cardId, commentId) => {
    try {
      await kanbanService.comment.delete(commentId);
      
      // Reload comments
      const commentsRes = await kanbanService.comment.getByCard(cardId);
      const commentsData = commentsRes.data || commentsRes || [];
      
      setComments(prev => ({
        ...prev,
        [cardId]: commentsData
      }));
      
      // Update local state - decrement comment count on card
      setBoards(prev => prev.map(b => ({
        ...b,
        lists: (b.lists || []).map(list => ({
          ...list,
          cards: (list.cards || []).map(card => 
            card.id === cardId 
              ? { ...card, commentCount: Math.max(0, (card.commentCount || 0) - 1) }
              : card
          )
        }))
      })));
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Có lỗi xảy ra khi xóa comment');
      throw error;
    }
  }, [boards]);

  const getCommentsByCard = useCallback(async (cardId) => {
    // Check cache first
    if (comments[cardId]) {
      return comments[cardId];
    }
    
    // Load from API
    try {
      const response = await kanbanService.comment.getByCard(cardId);
      const commentsData = response.data || response || [];
      
      setComments(prev => ({
        ...prev,
        [cardId]: commentsData
      }));
      
      return commentsData;
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  }, [comments]);

  // ============== ACTIVITY OPERATIONS ==============

  const addActivity = useCallback((boardId, cardId, data) => {
    const newActivity = {
      id: generateId(),
      cardId,
      boardId,
      actorId: data.actorId || 'current-user',
      actorName: data.actorName || 'Current User',
      action: data.action,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    setActivities(prev => ({
      ...prev,
      [cardId]: [...(prev[cardId] || []), newActivity],
    }));

    return newActivity;
  }, []);

  const getActivitiesByCard = useCallback(async (cardId) => {
    // Check cache first
    if (activities[cardId]) {
      return (activities[cardId] || []).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    
    // Load from API
    try {
      const response = await kanbanService.activity.getByCard(cardId);
      const activitiesData = response.data || response || [];
      
      setActivities(prev => ({
        ...prev,
        [cardId]: activitiesData
      }));
      
      return activitiesData.sort((a, b) =>
        new Date(b.createdAt || b.createdAt) - new Date(a.createdAt || a.createdAt)
      );
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }, [activities]);

  // ============== EMPLOYEE OPERATIONS ==============

  const getAllEmployees = useCallback(() => {
    return employees;
  }, [employees]);

  const getEmployeesByDepartment = useCallback((departmentId) => {
    if (!departmentId || departmentId === 'all') {
      return employees;
    }
    return employees.filter(emp => emp.departmentId === departmentId || emp.department === departmentId);
  }, [employees]);

  const getAllDepartments = useCallback(() => {
    return departments;
  }, [departments]);

  const searchEmployees = useCallback((query, departmentId = null) => {
    let result = employees;

    if (departmentId && departmentId !== 'all') {
      result = result.filter(emp => emp.departmentId === departmentId || emp.department === departmentId);
    }

    if (query && query.trim()) {
      const searchLower = query.toLowerCase().trim();
      result = result.filter(emp =>
        emp.name?.toLowerCase().includes(searchLower) ||
        emp.email?.toLowerCase().includes(searchLower) ||
        emp.department?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [employees]);

  // ============== UTILITY FUNCTIONS ==============

  const getBoardStats = useCallback((boardId) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return null;

    const stats = {
      totalCards: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0,
    };

    // Safety check: ensure lists exists and is an array
    if (!board.lists || !Array.isArray(board.lists)) {
      return stats;
    }

    board.lists.forEach(list => {
      if (!list) return;
      const listStatus = LIST_STATUS_MAP[list.name] || 'TODO';
      const cardCount = (list.cards && Array.isArray(list.cards)) ? list.cards.length : 0;
      stats.totalCards += cardCount;

      switch (listStatus) {
        case 'TODO':
          stats.todo += cardCount;
          break;
        case 'IN_PROGRESS':
          stats.inProgress += cardCount;
          break;
        case 'REVIEW':
          stats.review += cardCount;
          break;
        case 'DONE':
          stats.done += cardCount;
          break;
        default:
          stats.todo += cardCount;
      }
    });

    stats.progress = stats.totalCards > 0
      ? Math.round((stats.done / stats.totalCards) * 100)
      : 0;

    return stats;
  }, [boards]);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setBoards(defaultBoards);
    setComments(defaultComments);
    setActivities(defaultActivities);
    toast.info('Đã reset về dữ liệu mặc định');
  }, []);

  const value = {
    // State
    boards,
    currentBoard,
    loading,
    setCurrentBoard,
    setLoading,

    // Board operations
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardById,
    getBoardStats,

    // List operations
    createList,
    updateList,
    deleteList,

    // Card operations
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    getCardById,

    // Member operations
    addMember,
    removeMember,

    // Label operations
    createLabel,
    updateLabel,
    deleteLabel,
    assignLabelToCard,
    removeLabelFromCard,

    // Comment operations
    addComment,
    updateComment,
    deleteComment,
    getCommentsByCard,

    // Activity operations
    addActivity,
    getActivitiesByCard,

    // Employee operations
    employees,
    departments,
    getAllEmployees,
    getEmployeesByDepartment,
    getAllDepartments,
    searchEmployees,

    // Utilities
    resetToDefault,
    PRIORITIES,
    LABEL_COLORS,
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};

export default KanbanContext;
