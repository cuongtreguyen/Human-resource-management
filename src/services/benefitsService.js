// src/services/benefitsService.js
import { http, JAVA_API } from './config.js';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

// ============================================
// BENEFITS TEMPLATE APIs (Phúc lợi mẫu)
// ============================================

/**
 * 1. Lấy tất cả phúc lợi template
 * GET /api/benefits/all
 */
export const getAllBenefits = async () => {
  const response = await http(`${JAVA_API}/benefits/all`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách phúc lợi'}`);
  }

  return await response.json();
};

/**
 * 2. Tạo phúc lợi mới
 * POST /api/benefits/create
 */
export const createBenefit = async (benefitData) => {
  const response = await http(`${JAVA_API}/benefits/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(benefitData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tạo phúc lợi'}`);
  }

  return await response.json();
};

/**
 * 3. Cập nhật phúc lợi
 * PUT /api/benefits/{benefitId}
 */
export const updateBenefit = async (benefitId, benefitData) => {
  const response = await http(`${JAVA_API}/benefits/${benefitId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(benefitData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật phúc lợi'}`);
  }

  return await response.json();
};

/**
 * 4. Xóa phúc lợi
 * DELETE /api/benefits/{benefitId}
 */
export const deleteBenefit = async (benefitId) => {
  const response = await http(`${JAVA_API}/benefits/${benefitId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Lỗi khi xóa phúc lợi';
    let errorText = '';
    try {
      errorText = await response.text();
      if (errorText) {
        // Cố gắng parse JSON error response từ backend
        try {
          const errorObj = JSON.parse(errorText);
          errorMessage = errorObj.message || errorObj.errorCode || errorMessage;
        } catch {
          // Nếu không phải JSON, dùng text gốc
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.message = errorMessage;
    throw error;
  }

  return await response.json();
};

// ============================================
// EMPLOYEE BENEFITS APIs (Cấp phúc lợi cho NV)
// ============================================

/**
 * 5. Lấy phúc lợi của nhân viên
 * GET /api/employee-benefits/employee/{employeeId}
 */
export const getEmployeeBenefits = async (employeeId) => {
  const response = await http(`${JAVA_API}/employee-benefits/employee/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải phúc lợi nhân viên'}`);
  }

  return await response.json();
};

/**
 * 6. Cấp phúc lợi cho nhân viên (Grant)
 * POST /api/employee-benefits/employee/{employeeId}
 */
export const grantBenefitToEmployee = async (employeeId, grantData) => {
  const response = await http(`${JAVA_API}/employee-benefits/employee/${employeeId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(grantData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cấp phúc lợi cho nhân viên'}`);
  }

  return await response.json();
};

/**
 * 7. Cập nhật phúc lợi nhân viên
 * PUT /api/employee-benefits/employee/{employeeId}/benefit/{benefitId}
 */
export const updateEmployeeBenefit = async (employeeId, benefitId, updateData) => {
  const response = await http(`${JAVA_API}/employee-benefits/employee/${employeeId}/benefit/${benefitId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật phúc lợi nhân viên'}`);
  }

  return await response.json();
};

/**
 * 8. Xóa phúc lợi nhân viên
 * DELETE /api/employee-benefits/employee/{employeeId}/benefit/{benefitId}
 */
export const deleteEmployeeBenefit = async (employeeId, benefitId) => {
  const response = await http(`${JAVA_API}/employee-benefits/employee/${employeeId}/benefit/${benefitId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi xóa phúc lợi nhân viên'}`);
  }

  return await response.json();
};

// ============================================
// INSURANCE CONTRACTS APIs (Bảo hiểm mẫu)
// ============================================

/**
 * 9. Lấy tất cả bảo hiểm template
 * GET /api/insurance-contracts/all
 */
export const getAllInsuranceContracts = async () => {
  const response = await http(`${JAVA_API}/insurance-contracts/all`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách bảo hiểm'}`);
  }

  return await response.json();
};

/**
 * 10. Tạo bảo hiểm mới
 * POST /api/insurance-contracts/create
 */
export const createInsuranceContract = async (insuranceData) => {
  const response = await http(`${JAVA_API}/insurance-contracts/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(insuranceData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tạo bảo hiểm'}`);
  }

  return await response.json();
};

/**
 * 11. Cập nhật bảo hiểm
 * PUT /api/insurance-contracts/{insurenceName}
 */
export const updateInsuranceContract = async (insurenceName, insuranceData) => {
  // Encode tên bảo hiểm cho URL (hỗ trợ tiếng Việt)
  const encodedName = encodeURIComponent(insurenceName);
  console.log('📤 API updateInsuranceContract:', {
    url: `${JAVA_API}/insurance-contracts/${encodedName}`,
    data: insuranceData
  });

  const response = await http(`${JAVA_API}/insurance-contracts/${encodedName}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(insuranceData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API updateInsuranceContract error:', response.status, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật bảo hiểm'}`);
  }

  const result = await response.json();
  console.log('✅ API updateInsuranceContract success:', result);
  return result;
};

/**
 * 12. Xóa bảo hiểm
 * DELETE /api/insurance-contracts/{insurenceName}
 */
export const deleteInsuranceContract = async (insurenceName) => {
  // Encode tên bảo hiểm cho URL (hỗ trợ tiếng Việt)
  const encodedName = encodeURIComponent(insurenceName);

  const response = await http(`${JAVA_API}/insurance-contracts/${encodedName}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Lỗi khi xóa bảo hiểm';
    let errorText = '';
    try {
      errorText = await response.text();
      if (errorText) {
        // Cố gắng parse JSON error response từ backend
        try {
          const errorObj = JSON.parse(errorText);
          errorMessage = errorObj.message || errorObj.errorCode || errorMessage;
        } catch {
          // Nếu không phải JSON, dùng text gốc
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.response = errorText;
    throw error;
  }

  // DELETE trả về 200 OK với body rỗng (ResponseEntity<Void>), không cần parse JSON
  return { success: true };
};

// ============================================
// EMPLOYEE INSURANCE APIs (Cấp bảo hiểm cho NV)
// ============================================

/**
 * 13. Lấy bảo hiểm của nhân viên
 * GET /api/employee-insurance-contracts/employee/{employeeId}
 */
export const getEmployeeInsurance = async (employeeId) => {
  const response = await http(`${JAVA_API}/employee-insurance-contracts/employee/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải bảo hiểm nhân viên'}`);
  }

  return await response.json();
};

/**
 * 14. Cấp bảo hiểm cho nhân viên (Grant)
 * POST /api/employee-insurance-contracts/employee/{employeeId}
 */
export const grantInsuranceToEmployee = async (employeeId, grantData) => {
  const response = await http(`${JAVA_API}/employee-insurance-contracts/employee/${employeeId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(grantData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cấp bảo hiểm cho nhân viên'}`);
  }

  return await response.json();
};

/**
 * 15. Cập nhật bảo hiểm nhân viên
 * PUT /api/employee-insurance-contracts/employee/{employeeId}/contract/{contractId}
 */
export const updateEmployeeInsurance = async (employeeId, contractId, updateData) => {
  const response = await http(`${JAVA_API}/employee-insurance-contracts/employee/${employeeId}/contract/${contractId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật bảo hiểm nhân viên'}`);
  }

  return await response.json();
};

/**
 * 16. Xóa bảo hiểm nhân viên
 * DELETE /api/employee-insurance-contracts/employee/{employeeId}/contract/{contractId}
 */
export const deleteEmployeeInsurance = async (employeeId, contractId) => {
  const response = await http(`${JAVA_API}/employee-insurance-contracts/employee/${employeeId}/contract/${contractId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi xóa bảo hiểm nhân viên'}`);
  }

  return await response.json();
};

export default {
  // Benefits Template
  getAllBenefits,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  // Employee Benefits
  getEmployeeBenefits,
  grantBenefitToEmployee,
  updateEmployeeBenefit,
  deleteEmployeeBenefit,
  // Insurance Contracts
  getAllInsuranceContracts,
  createInsuranceContract,
  updateInsuranceContract,
  deleteInsuranceContract,
  // Employee Insurance
  getEmployeeInsurance,
  grantInsuranceToEmployee,
  updateEmployeeInsurance,
  deleteEmployeeInsurance,
};
