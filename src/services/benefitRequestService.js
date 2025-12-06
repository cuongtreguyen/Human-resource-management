// src/services/benefitRequestService.js
// Service tạm thời để quản lý yêu cầu phúc lợi (dùng localStorage)
// TODO: Thay bằng API thật khi backend có

const STORAGE_KEY = 'hrm_benefit_requests';

// Lấy tất cả requests từ storage
const getAllRequests = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Lưu requests vào storage
const saveRequests = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

/**
 * Employee: Tạo yêu cầu mới
 */
export const createBenefitRequest = async (requestData) => {
  const requests = getAllRequests();

  const newRequest = {
    id: `REQ${Date.now()}`,
    ...requestData,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
  };

  requests.push(newRequest);
  saveRequests(requests);

  console.log('✅ Created benefit request:', newRequest);
  return { success: true, data: newRequest };
};

/**
 * Employee: Lấy yêu cầu của mình
 */
export const getMyBenefitRequests = async (employeeId) => {
  const requests = getAllRequests();
  const myRequests = requests.filter(r => r.employeeId === employeeId);
  return { success: true, data: myRequests };
};

/**
 * Accountant: Lấy tất cả yêu cầu chờ duyệt
 */
export const getPendingBenefitRequests = async () => {
  const requests = getAllRequests();
  const pending = requests.filter(r => r.status === 'pending');
  return { success: true, data: pending };
};

/**
 * Accountant: Lấy tất cả yêu cầu
 */
export const getAllBenefitRequests = async () => {
  const requests = getAllRequests();
  return { success: true, data: requests };
};

/**
 * Accountant: Duyệt yêu cầu
 */
export const approveBenefitRequest = async (requestId) => {
  const requests = getAllRequests();
  const index = requests.findIndex(r => r.id === requestId);

  if (index === -1) {
    return { success: false, message: 'Không tìm thấy yêu cầu' };
  }

  requests[index].status = 'approved';
  requests[index].approvedAt = new Date().toISOString().split('T')[0];
  saveRequests(requests);

  console.log('✅ Approved request:', requestId);
  return { success: true, data: requests[index] };
};

/**
 * Accountant: Từ chối yêu cầu
 */
export const rejectBenefitRequest = async (requestId, reason = '') => {
  const requests = getAllRequests();
  const index = requests.findIndex(r => r.id === requestId);

  if (index === -1) {
    return { success: false, message: 'Không tìm thấy yêu cầu' };
  }

  requests[index].status = 'rejected';
  requests[index].rejectedAt = new Date().toISOString().split('T')[0];
  requests[index].rejectReason = reason;
  saveRequests(requests);

  console.log('❌ Rejected request:', requestId);
  return { success: true, data: requests[index] };
};

/**
 * Xóa yêu cầu (nếu cần)
 */
export const deleteBenefitRequest = async (requestId) => {
  const requests = getAllRequests();
  const filtered = requests.filter(r => r.id !== requestId);
  saveRequests(filtered);
  return { success: true };
};

export default {
  createBenefitRequest,
  getMyBenefitRequests,
  getPendingBenefitRequests,
  getAllBenefitRequests,
  approveBenefitRequest,
  rejectBenefitRequest,
  deleteBenefitRequest,
};
