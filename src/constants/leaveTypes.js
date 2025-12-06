/**
 * Leave type constants matching backend OnLeaveType enum
 * Backend enum: SICK_LEAVE, CASUAL_LEAVE, MATERNITY_LEAVE, ANNUAL_LEAVE,
 *               BEREAVEMENT_LEAVE, STUDY_LEAVE, MARRIAGE_LEAVE
 */

// Values phải match với backend API (lowercase)
export const LEAVE_TYPES = {
  SICK_LEAVE: 'sick',
  CASUAL_LEAVE: 'unpaid',
  MATERNITY_LEAVE: 'maternity',
  ANNUAL_LEAVE: 'annual',
  BEREAVEMENT_LEAVE: 'bereavement',
  STUDY_LEAVE: 'study',
  MARRIAGE_LEAVE: 'special'
};

export const LEAVE_TYPE_OPTIONS = [
  { value: 'annual', label: 'Nghỉ phép năm' },
  { value: 'sick', label: 'Nghỉ ốm' },
  { value: 'unpaid', label: 'Nghỉ không lương' },
  { value: 'maternity', label: 'Nghỉ thai sản' },
  { value: 'special', label: 'Nghỉ đặc biệt (cưới, tang...)' }
];

export const getLeaveTypeName = (type) => {
  const typeMap = {
    'annual': 'Nghỉ phép năm',
    'sick': 'Nghỉ ốm',
    'unpaid': 'Nghỉ không lương',
    'maternity': 'Nghỉ thai sản',
    'special': 'Nghỉ đặc biệt',
    // Backward compatibility với format cũ
    'ANNUAL_LEAVE': 'Nghỉ phép năm',
    'SICK_LEAVE': 'Nghỉ ốm',
    'CASUAL_LEAVE': 'Nghỉ việc riêng',
    'MATERNITY_LEAVE': 'Nghỉ thai sản',
  };
  return typeMap[type] || 'Khác';
};

export const getLeaveTypeColor = (type) => {
  const colorMap = {
    'annual': 'bg-blue-100 text-blue-800',
    'sick': 'bg-red-100 text-red-800',
    'unpaid': 'bg-yellow-100 text-yellow-800',
    'maternity': 'bg-purple-100 text-purple-800',
    'special': 'bg-pink-100 text-pink-800',
  };
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

export const getLeaveTypeInfo = (type) => {
  const infoMap = {
    'annual': {
      name: 'Nghỉ phép năm',
      color: 'blue',
      description: 'Nghỉ phép hàng năm, cần bàn giao công việc'
    },
    'sick': {
      name: 'Nghỉ ốm',
      color: 'red',
      description: 'Nghỉ ốm, công việc cần xử lý khẩn cấp'
    },
    'unpaid': {
      name: 'Nghỉ không lương',
      color: 'yellow',
      description: 'Nghỉ không hưởng lương'
    },
    'maternity': {
      name: 'Nghỉ thai sản',
      color: 'purple',
      description: 'Nghỉ thai sản dài hạn, cần kế hoạch chi tiết'
    },
    'special': {
      name: 'Nghỉ đặc biệt',
      color: 'pink',
      description: 'Nghỉ cưới, tang, hoặc việc đặc biệt khác'
    }
  };
  return infoMap[type] || { name: 'Khác', color: 'gray', description: '' };
};
