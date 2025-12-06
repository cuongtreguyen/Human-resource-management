/**
 * Leave type constants matching backend OnLeaveType enum
 * Backend enum: SICK_LEAVE, CASUAL_LEAVE, MATERNITY_LEAVE, ANNUAL_LEAVE,
 *               BEREAVEMENT_LEAVE, STUDY_LEAVE, MARRIAGE_LEAVE
 */

export const LEAVE_TYPES = {
  SICK_LEAVE: 'SICK_LEAVE',
  CASUAL_LEAVE: 'CASUAL_LEAVE',
  MATERNITY_LEAVE: 'MATERNITY_LEAVE',
  ANNUAL_LEAVE: 'ANNUAL_LEAVE',
  BEREAVEMENT_LEAVE: 'BEREAVEMENT_LEAVE',
  STUDY_LEAVE: 'STUDY_LEAVE',
  MARRIAGE_LEAVE: 'MARRIAGE_LEAVE'
};

export const LEAVE_TYPE_OPTIONS = [
  { value: LEAVE_TYPES.ANNUAL_LEAVE, label: 'Nghỉ phép năm' },
  { value: LEAVE_TYPES.SICK_LEAVE, label: 'Nghỉ ốm' },
  { value: LEAVE_TYPES.CASUAL_LEAVE, label: 'Nghỉ việc riêng' },
  { value: LEAVE_TYPES.MATERNITY_LEAVE, label: 'Nghỉ thai sản' },
  { value: LEAVE_TYPES.BEREAVEMENT_LEAVE, label: 'Nghỉ tang' },
  { value: LEAVE_TYPES.STUDY_LEAVE, label: 'Nghỉ học tập' },
  { value: LEAVE_TYPES.MARRIAGE_LEAVE, label: 'Nghỉ cưới' }
];

export const getLeaveTypeName = (type) => {
  const typeMap = {
    [LEAVE_TYPES.ANNUAL_LEAVE]: 'Nghỉ phép năm',
    [LEAVE_TYPES.SICK_LEAVE]: 'Nghỉ ốm',
    [LEAVE_TYPES.CASUAL_LEAVE]: 'Nghỉ việc riêng',
    [LEAVE_TYPES.MATERNITY_LEAVE]: 'Nghỉ thai sản',
    [LEAVE_TYPES.BEREAVEMENT_LEAVE]: 'Nghỉ tang',
    [LEAVE_TYPES.STUDY_LEAVE]: 'Nghỉ học tập',
    [LEAVE_TYPES.MARRIAGE_LEAVE]: 'Nghỉ cưới'
  };
  return typeMap[type] || 'Khác';
};

export const getLeaveTypeColor = (type) => {
  const colorMap = {
    [LEAVE_TYPES.ANNUAL_LEAVE]: 'bg-blue-100 text-blue-800',
    [LEAVE_TYPES.SICK_LEAVE]: 'bg-red-100 text-red-800',
    [LEAVE_TYPES.CASUAL_LEAVE]: 'bg-yellow-100 text-yellow-800',
    [LEAVE_TYPES.MATERNITY_LEAVE]: 'bg-purple-100 text-purple-800',
    [LEAVE_TYPES.BEREAVEMENT_LEAVE]: 'bg-gray-100 text-gray-800',
    [LEAVE_TYPES.STUDY_LEAVE]: 'bg-green-100 text-green-800',
    [LEAVE_TYPES.MARRIAGE_LEAVE]: 'bg-pink-100 text-pink-800'
  };
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

export const getLeaveTypeInfo = (type) => {
  const infoMap = {
    [LEAVE_TYPES.ANNUAL_LEAVE]: {
      name: 'Nghỉ phép năm',
      color: 'blue',
      description: 'Nghỉ phép hàng năm, cần bàn giao công việc'
    },
    [LEAVE_TYPES.SICK_LEAVE]: {
      name: 'Nghỉ ốm',
      color: 'red',
      description: 'Nghỉ ốm, công việc cần xử lý khẩn cấp'
    },
    [LEAVE_TYPES.CASUAL_LEAVE]: {
      name: 'Nghỉ việc riêng',
      color: 'yellow',
      description: 'Nghỉ để giải quyết công việc cá nhân'
    },
    [LEAVE_TYPES.MATERNITY_LEAVE]: {
      name: 'Nghỉ thai sản',
      color: 'purple',
      description: 'Nghỉ thai sản dài hạn, cần kế hoạch chi tiết'
    },
    [LEAVE_TYPES.BEREAVEMENT_LEAVE]: {
      name: 'Nghỉ tang',
      color: 'gray',
      description: 'Nghỉ để lo hậu sự cho người thân'
    },
    [LEAVE_TYPES.STUDY_LEAVE]: {
      name: 'Nghỉ học tập',
      color: 'green',
      description: 'Nghỉ để tham gia khóa học hoặc đào tạo'
    },
    [LEAVE_TYPES.MARRIAGE_LEAVE]: {
      name: 'Nghỉ cưới',
      color: 'pink',
      description: 'Nghỉ để chuẩn bị và tổ chức lễ cưới'
    }
  };
  return infoMap[type] || { name: 'Khác', color: 'gray', description: '' };
};
