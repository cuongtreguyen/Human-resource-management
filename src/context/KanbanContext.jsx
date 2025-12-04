// src/context/KanbanContext.jsx
// Kanban Board State Management with Context API

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

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
  // Initialize state from localStorage or use default
  const [boards, setBoards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultBoards;
    } catch {
      return defaultBoards;
    }
  });

  const [comments, setComments] = useState(defaultComments);
  const [activities, setActivities] = useState(defaultActivities);
  const [employees] = useState(defaultEmployees);
  const [departments] = useState(defaultDepartments);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  }, [boards]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setBoards(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ============== BOARD OPERATIONS ==============

  const createBoard = useCallback((data) => {
    const newBoard = {
      id: generateId(),
      name: data.name,
      ownerId: data.ownerId || 'current-user',
      ownerName: data.ownerName || 'Current User',
      ownerEmail: data.ownerEmail || 'user@company.com',
      status: data.status || 'ACTIVE',
      closed: false,
      members: [
        {
          id: generateId(),
          boardId: null, // Will be set below
          accountId: data.ownerId || 'current-user',
          name: data.ownerName || 'Current User',
          email: data.ownerEmail || 'user@company.com',
          role: 'OWNER',
        },
      ],
      labels: [
        { id: generateId(), boardId: null, name: 'Bug', color: 'red' },
        { id: generateId(), boardId: null, name: 'Feature', color: 'green' },
        { id: generateId(), boardId: null, name: 'Improvement', color: 'blue' },
      ],
      lists: [
        { id: generateId(), boardId: null, name: 'TODO', position: 1.0, cards: [] },
        { id: generateId(), boardId: null, name: 'In Progress', position: 2.0, cards: [] },
        { id: generateId(), boardId: null, name: 'Review', position: 3.0, cards: [] },
        { id: generateId(), boardId: null, name: 'Done', position: 4.0, cards: [] },
      ],
    };

    // Set boardId references
    newBoard.members = newBoard.members.map(m => ({ ...m, boardId: newBoard.id }));
    newBoard.labels = newBoard.labels.map(l => ({ ...l, boardId: newBoard.id }));
    newBoard.lists = newBoard.lists.map(l => ({ ...l, boardId: newBoard.id }));

    setBoards(prev => [...prev, newBoard]);
    toast.success('Tạo board thành công!');
    return newBoard;
  }, []);

  const updateBoard = useCallback((boardId, data) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? { ...board, ...data } : board
    ));
    toast.success('Cập nhật board thành công!');
  }, []);

  const deleteBoard = useCallback((boardId) => {
    setBoards(prev => prev.filter(board => board.id !== boardId));
    toast.success('Xóa board thành công!');
  }, []);

  const getBoardById = useCallback((boardId) => {
    return boards.find(board => board.id === boardId);
  }, [boards]);

  // ============== LIST OPERATIONS ==============

  const createList = useCallback((boardId, data) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return null;

    const maxPosition = Math.max(...board.lists.map(l => l.position), 0);
    const newList = {
      id: generateId(),
      boardId,
      name: data.name,
      position: data.position || maxPosition + 1.0,
      cards: [],
    };

    setBoards(prev => prev.map(b =>
      b.id === boardId ? { ...b, lists: [...b.lists, newList] } : b
    ));
    toast.success('Tạo danh sách thành công!');
    return newList;
  }, [boards]);

  const updateList = useCallback((boardId, listId, data) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        lists: board.lists.map(list =>
          list.id === listId ? { ...list, ...data } : list
        ),
      } : board
    ));
  }, []);

  const deleteList = useCallback((boardId, listId) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        lists: board.lists.filter(list => list.id !== listId),
      } : board
    ));
    toast.success('Xóa danh sách thành công!');
  }, []);

  // ============== CARD OPERATIONS ==============

  const createCard = useCallback((boardId, listId, data) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return null;

    const list = board.lists.find(l => l.id === listId);
    if (!list) return null;

    const maxPosition = Math.max(...list.cards.map(c => c.position), 0);
    const newCard = {
      id: generateId(),
      listId,
      title: data.title,
      description: data.description || '',
      position: data.position || maxPosition + 1.0,
      priority: data.priority || 'MEDIUM',
      dueDate: data.dueDate || null,
      assignees: data.assignees || [],
      labels: data.labels || [],
      attachmentCount: 0,
      commentCount: 0,
      checkListProgress: null,
    };

    setBoards(prev => prev.map(b =>
      b.id === boardId ? {
        ...b,
        lists: b.lists.map(l =>
          l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
        ),
      } : b
    ));
    toast.success('Tạo thẻ thành công!');
    return newCard;
  }, [boards]);

  const updateCard = useCallback((boardId, listId, cardId, data) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        lists: board.lists.map(list =>
          list.id === listId ? {
            ...list,
            cards: list.cards.map(card =>
              card.id === cardId ? { ...card, ...data } : card
            ),
          } : list
        ),
      } : board
    ));
  }, []);

  const deleteCard = useCallback((boardId, listId, cardId) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        lists: board.lists.map(list =>
          list.id === listId ? {
            ...list,
            cards: list.cards.filter(card => card.id !== cardId),
          } : list
        ),
      } : board
    ));
    toast.success('Xóa thẻ thành công!');
  }, []);

  const moveCard = useCallback((boardId, sourceListId, targetListId, cardId, targetPosition) => {
    setBoards(prev => prev.map(board => {
      if (board.id !== boardId) return board;

      let movedCard = null;
      const newLists = board.lists.map(list => {
        if (list.id === sourceListId) {
          const card = list.cards.find(c => c.id === cardId);
          if (card) {
            movedCard = { ...card, listId: targetListId, position: targetPosition };
          }
          return { ...list, cards: list.cards.filter(c => c.id !== cardId) };
        }
        return list;
      });

      if (!movedCard) return board;

      const finalLists = newLists.map(list => {
        if (list.id === targetListId) {
          const cards = [...list.cards, movedCard].sort((a, b) => a.position - b.position);
          return { ...list, cards };
        }
        return list;
      });

      return { ...board, lists: finalLists };
    }));

    if (sourceListId !== targetListId) {
      toast.success('Di chuyển thẻ thành công!');
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

  const addMember = useCallback((boardId, data) => {
    const newMember = {
      id: generateId(),
      boardId,
      accountId: data.accountId,
      name: data.name,
      email: data.email,
      role: data.role || 'MEMBER',
    };

    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        members: [...board.members, newMember],
      } : board
    ));
    toast.success('Thêm thành viên thành công!');
    return newMember;
  }, []);

  const removeMember = useCallback((boardId, memberId) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        members: board.members.filter(m => m.id !== memberId),
      } : board
    ));
    toast.success('Xóa thành viên thành công!');
  }, []);

  // ============== LABEL OPERATIONS ==============

  const createLabel = useCallback((boardId, data) => {
    const newLabel = {
      id: generateId(),
      boardId,
      name: data.name,
      color: data.color,
    };

    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        labels: [...board.labels, newLabel],
      } : board
    ));
    return newLabel;
  }, []);

  const updateLabel = useCallback((boardId, labelId, data) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        labels: board.labels.map(label =>
          label.id === labelId ? { ...label, ...data } : label
        ),
      } : board
    ));
  }, []);

  const deleteLabel = useCallback((boardId, labelId) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        labels: board.labels.filter(l => l.id !== labelId),
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => ({
            ...card,
            labels: card.labels.filter(l => l.id !== labelId),
          })),
        })),
      } : board
    ));
  }, []);

  const assignLabelToCard = useCallback((boardId, listId, cardId, label) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        lists: board.lists.map(list =>
          list.id === listId ? {
            ...list,
            cards: list.cards.map(card =>
              card.id === cardId && !card.labels.find(l => l.id === label.id)
                ? { ...card, labels: [...card.labels, label] }
                : card
            ),
          } : list
        ),
      } : board
    ));
  }, []);

  const removeLabelFromCard = useCallback((boardId, listId, cardId, labelId) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId ? {
        ...board,
        lists: board.lists.map(list =>
          list.id === listId ? {
            ...list,
            cards: list.cards.map(card =>
              card.id === cardId
                ? { ...card, labels: card.labels.filter(l => l.id !== labelId) }
                : card
            ),
          } : list
        ),
      } : board
    ));
  }, []);

  // ============== COMMENT OPERATIONS ==============

  const addComment = useCallback((cardId, data) => {
    const newComment = {
      id: generateId(),
      cardId,
      authorId: data.authorId || 'current-user',
      authorName: data.authorName || 'Current User',
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    setComments(prev => ({
      ...prev,
      [cardId]: [...(prev[cardId] || []), newComment],
    }));

    // Update comment count on card
    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: list.cards.map(card =>
          card.id === cardId
            ? { ...card, commentCount: card.commentCount + 1 }
            : card
        ),
      })),
    })));

    return newComment;
  }, []);

  const updateComment = useCallback((cardId, commentId, content) => {
    setComments(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || []).map(comment =>
        comment.id === commentId
          ? { ...comment, content, updatedAt: new Date().toISOString() }
          : comment
      ),
    }));
  }, []);

  const deleteComment = useCallback((cardId, commentId) => {
    setComments(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || []).filter(c => c.id !== commentId),
    }));

    // Update comment count on card
    setBoards(prev => prev.map(board => ({
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: list.cards.map(card =>
          card.id === cardId
            ? { ...card, commentCount: Math.max(0, card.commentCount - 1) }
            : card
        ),
      })),
    })));
  }, []);

  const getCommentsByCard = useCallback((cardId) => {
    return comments[cardId] || [];
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

  const getActivitiesByCard = useCallback((cardId) => {
    return (activities[cardId] || []).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [activities]);

  // ============== EMPLOYEE OPERATIONS ==============

  const getAllEmployees = useCallback(() => {
    return employees;
  }, [employees]);

  const getEmployeesByDepartment = useCallback((departmentId) => {
    if (!departmentId || departmentId === 'all') {
      return employees;
    }
    return employees.filter(emp => emp.departmentId === departmentId);
  }, [employees]);

  const getAllDepartments = useCallback(() => {
    return departments;
  }, [departments]);

  const searchEmployees = useCallback((query, departmentId = null) => {
    let result = employees;

    if (departmentId && departmentId !== 'all') {
      result = result.filter(emp => emp.departmentId === departmentId);
    }

    if (query && query.trim()) {
      const searchLower = query.toLowerCase().trim();
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower)
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

    board.lists.forEach(list => {
      const listStatus = LIST_STATUS_MAP[list.name] || 'TODO';
      const cardCount = list.cards.length;
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
