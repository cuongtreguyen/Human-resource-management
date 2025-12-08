import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getRole } from '../../utils/auth';
import { useOTContext } from '../../context/OTContext';
import { getMonthlyPayroll, getPayrollSummary, createPayroll, updatePayroll, cancelPayroll as cancelPayrollAPI, payPayroll } from '../../services/payrollService';
import { searchEmployeesForAccountant, getAllEmployees } from '../../services/employeeService';

// OT Rate: 100,000 VND per hour
const OT_HOURLY_RATE = 100000;
import {
  DollarSign,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Building,
  FileText,
  Clock,
  X
} from 'lucide-react';
import {
  PayrollDetailsModal,
  PayrollCalculationModal,
  PayrollPoliciesModal
} from '../../components/payroll';

const PayrollList = () => {
  const userRole = getRole(); // Lấy role của user hiện tại
  const { otRequests } = useOTContext(); // Get OT data
  const navigate = useNavigate();

  // Màu sắc theo role
  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'manager':
        return 'from-purple-600 to-purple-700';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-100';
      case 'manager':
        return 'text-purple-100';
      case 'accountant':
        return 'text-emerald-100';
      default:
        return 'text-orange-100';
    }
  };
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showPayrollDetailsModal, setShowPayrollDetailsModal] = useState(false);
  const [selectedPayrollDetails, setSelectedPayrollDetails] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [restoredFromCanceled, setRestoredFromCanceled] = useState(new Set()); // Track payrolls restored from CANCELED

  useEffect(() => {
    // Reset payrollRecords khi đổi tháng/phòng ban để load data mới
    setPayrollRecords([]);
    loadEmployees();
    loadMonthlyPayrollData();
  }, [selectedMonth, selectedDepartment]);

  // Get approved OT hours for an employee in selected month
  // OT is visible when Manager approves (status: approved, completed, reviewed, payroll_approved)
  const getEmployeeOTData = useCallback((employeeId, month) => {
    const approvedOT = otRequests.filter(ot =>
      ot.employeeId === employeeId &&
      ot.otDate.startsWith(month) &&
      ['approved', 'completed', 'reviewed', 'payroll_approved'].includes(ot.status)
    );

    const totalHours = approvedOT.reduce((sum, ot) =>
      sum + (ot.report?.actualHours || ot.plannedHours), 0
    );

    const otPay = totalHours * OT_HOURLY_RATE;

    return {
      requests: approvedOT,
      totalHours,
      otPay
    };
  }, [otRequests]);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      // Nếu là Accountant, dùng API chuyên dụng với filter lương
      const response = userRole === 'accountant'
        ? await searchEmployeesForAccountant({
            department: selectedDepartment !== 'all' ? selectedDepartment : undefined
          })
        : await getAllEmployees({
            department: selectedDepartment !== 'all' ? selectedDepartment : undefined
          });

      // API có thể trả về array trực tiếp hoặc { data: [...] }
      const employeeData = Array.isArray(response) ? response : response.data || [];

      // Debug: xem API trả về gì
      console.log('📋 Raw employee data from API:', employeeData);

      // Map data từ API để phù hợp với component
      const mappedEmployees = employeeData.map(emp => {
        // Tìm salary từ nhiều field có thể có
        const salary = emp.salary || emp.baseSalary || emp.basicSalary || emp.base_salary || emp.monthlySalary || 0;

        // ⚠️ QUAN TRỌNG: Lấy employeeId từ nhiều nguồn và đảm bảo là Number
        const empId = emp.employeeId != null ? Number(emp.employeeId) : (emp.id != null ? Number(emp.id) : null);
        
        // Validate employeeId
        if (empId == null || isNaN(empId)) {
          console.warn('⚠️ Employee missing valid ID:', {
            employee: emp,
            employeeId: emp.employeeId,
            id: emp.id
          });
        }

        return {
          id: empId,
          employeeId: empId, // ⚠️ LUÔN là Number hoặc null
          name: emp.fullName || emp.name || `${emp.lastName || ''} ${emp.firstName || ''}`.trim(),
          email: emp.email || '',
          phone: emp.phone || emp.phoneNumber || '',
          department: emp.department || emp.departmentName || 'N/A',
          position: emp.position || emp.jobTitle || 'N/A',
          salary: salary,
          basicSalary: salary,
          status: emp.status || 'active',
        };
      });

      // Filter out employees without valid ID
      const validEmployees = mappedEmployees.filter(emp => emp.employeeId != null && !isNaN(emp.employeeId));
      
      if (validEmployees.length < mappedEmployees.length) {
        console.warn(`⚠️ Filtered out ${mappedEmployees.length - validEmployees.length} employees without valid ID`);
      }

      console.log('✅ Mapped employees for payroll:', validEmployees);
      console.log('📊 Employee IDs:', validEmployees.map(e => ({ name: e.name, employeeId: e.employeeId })));
      setEmployees(validEmployees);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Không thể tải dữ liệu nhân viên');
      // Fallback: empty array nếu API lỗi
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Lưu salary cache từ payroll history để dùng khi generate
  const [salaryCache, setSalaryCache] = useState({});

  // Load monthly payroll from API
  const loadMonthlyPayrollData = async () => {
    try {
      setLoading(true);
      // Format month to YYYY-MM
      const formattedMonth = selectedMonth;

      // Call API to get monthly payroll
      const response = await getMonthlyPayroll(formattedMonth);

      // API có thể trả về array trực tiếp hoặc { data: [...] }
      const payrollData = Array.isArray(response) ? response : response.data || [];

      console.log('📋 Raw payroll data from API for month', formattedMonth, ':', payrollData);

      if (payrollData.length > 0) {
        // Map API data to component state format
        // ⚠️ QUAN TRỌNG: Phân biệt rõ:
        // - salaryId: ID của bản ghi Salary trong DB (dùng cho update/delete salary record)
        // - employeeId: ID của nhân viên (Long, dùng để tính lương)
        const mappedPayrolls = payrollData.map((item, index) => {
          // employeeId từ API có thể là Number hoặc String, cần convert về Number
          const empId = item.employeeId != null ? Number(item.employeeId) : null;
          const salaryId = item.id || item.salaryId; // ID của Salary record

          return {
            id: salaryId || `payroll-${index}-${Date.now()}`, // ID của salary record (để update/delete)
            salaryId: salaryId, // Lưu riêng salaryId để rõ ràng
            payrollId: item.payrollId || null, // ⚠️ QUAN TRỌNG: ID của Payroll entity (dùng để pay/cancel)
            employeeId: empId, // ⚠️ LUÔN là Number - ID thật của nhân viên
            name: item.fullName || item.employeeName || item.name,
            fullName: item.fullName, // Giữ nguyên fullName từ API
            email: item.email || '',
            department: item.department || item.departmentName || 'N/A',
            basicSalary: item.baseSalary || item.basicSalary || 0,
            otHours: item.otHours || 0,
            otPay: item.otPay || 0,
            netSalary: item.netSalary || item.totalSalary || 0,
            status: item.status || 'PENDING', // PENDING | APPROVED | PAID | CANCELLED | FAILED
            month: formattedMonth,
            paidDate: item.paidDate || null
          };
        });

        console.log('✅ Loaded payroll from API:', mappedPayrolls);
        setPayrollRecords(mappedPayrolls);

        // Cache salary theo email để dùng khi generate cho tháng khác
        const newCache = { ...salaryCache };
        mappedPayrolls.forEach(p => {
          if (p.email && p.basicSalary > 0) {
            newCache[p.email.toLowerCase()] = p.basicSalary;
          }
        });
        setSalaryCache(newCache);
      } else {
        console.log('📋 No payroll data from API for month', formattedMonth, '- will generate from employees');
        // Không có data cho tháng này, để useEffect generate từ employees
      }
    } catch (err) {
      console.error('Error loading monthly payroll:', err);
      // Nếu API lỗi hoặc chưa có data, fallback về generate local
      console.log('Fallback to generate payroll locally');
    } finally {
      setLoading(false);
    }
  };


  // Generate payroll record for an employee
  // Nếu đã có payroll từ API, ưu tiên giữ lại baseSalary từ API
  const generatePayrollRecord = useCallback((employee, existingPayroll = null) => {
    // ⚠️ QUAN TRỌNG: Đảm bảo employeeId là Number hợp lệ
    const empId = employee.employeeId != null && !isNaN(Number(employee.employeeId)) 
      ? Number(employee.employeeId) 
      : (employee.id != null && !isNaN(Number(employee.id)) ? Number(employee.id) : null);
    
    if (empId == null || isNaN(empId)) {
      console.error('❌ Cannot generate payroll - invalid employeeId:', employee);
      return null; // Skip employees without valid ID
    }

    // Ưu tiên: existingPayroll > employee.salary > salaryCache (theo email) > default
    const cachedSalary = employee.email ? salaryCache[employee.email.toLowerCase()] : 0;
    const basicSalary = existingPayroll?.basicSalary || existingPayroll?.baseSalary || employee.salary || employee.basicSalary || cachedSalary || 10000000; // Default 10M nếu không có data
    const allowances = 1000000; // Phụ cấp mặc định
    const bonuses = 0;
    const deductions = 0;

    // 🕐 Lấy thông tin OT từ context (dùng empId thật)
    const otData = getEmployeeOTData(empId, selectedMonth);
    const otHours = otData.totalHours;
    const otPay = otData.otPay;

    // ⚠️ Khấu trừ chung (phạt đi trễ, nghỉ không phép)
    const generalDeductions = deductions;

    // Không tính BHXH, thuế TNCN, tổng lương - để BE xử lý

    return {
      id: `payroll-${empId}-${Date.now()}`, // Temporary ID cho payroll record (chưa lưu vào DB)
      employeeId: empId, // ⚠️ LUÔN là Number - ID thật của nhân viên
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      basicSalary: basicSalary,
      allowances: allowances,
      bonuses: bonuses,
      deductions: deductions,
      otHours: otHours, // Số giờ OT
      otPay: Math.round(otPay), // Tiền OT
      generalDeductions: Math.round(generalDeductions),
      month: selectedMonth,
      status: existingPayroll?.status || 'PENDING', // Giữ status từ API nếu có
      paidDate: existingPayroll?.paidDate || null,
      netSalary: existingPayroll?.netSalary || 0 // Giữ netSalary từ API nếu có
    };
  }, [selectedMonth, getEmployeeOTData, salaryCache]);

  // Generate all payroll records (auto - no alert)
  // Merge với existing data từ API để giữ lại baseSalary
  const generateAllPayrolls = useCallback(() => {
    if (employees.length === 0) {
      return;
    }
    const payrolls = employees
      .map(employee => {
        // Tìm payroll đã có từ API (nếu có) - so sánh bằng employeeId (Number)
        const existingPayroll = payrollRecords.find(p => {
          const pEmpId = Number(p.employeeId);
          const eEmpId = Number(employee.employeeId || employee.id);
          return pEmpId === eEmpId && !isNaN(pEmpId) && !isNaN(eEmpId);
        });
        return generatePayrollRecord(employee, existingPayroll);
      })
      .filter(p => p != null); // Filter out null records (employees without valid ID)
    
    console.log('✅ Generated payrolls:', payrolls.length, 'records');
    setPayrollRecords(payrolls);
  }, [employees, generatePayrollRecord, payrollRecords]);

  // Generate payroll with feedback (button click)
  const handleGeneratePayroll = async () => {
    if (employees.length === 0) {
      alert('Chưa có dữ liệu nhân viên để tạo bảng lương');
      return;
    }

    setIsGenerating(true);
    setGenerateSuccess(false);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Merge với existing data từ API để giữ lại baseSalary
    const payrolls = employees.map(employee => {
      const existingPayroll = payrollRecords.find(p =>
        p.employeeId === employee.id || p.id === employee.id
      );
      return generatePayrollRecord(employee, existingPayroll);
    });
    setPayrollRecords(payrolls);

    setIsGenerating(false);
    setGenerateSuccess(true);

    // Reset success state after 3 seconds
    setTimeout(() => setGenerateSuccess(false), 3000);
  };

  // Handle payroll calculation for specific employee
  const handleCalculatePayroll = async (payrollData) => {
    const updatedPayrolls = [...payrollRecords];
    const employeeIndex = updatedPayrolls.findIndex(p => p.employeeId === payrollData.employeeId);

    // Kiểm tra xem payroll này có phải đang được restore từ CANCELED không
    const isRestored = restoredFromCanceled.has(payrollData.employeeId);

    // Nếu đang restore từ CANCELED, cần xác nhận trước khi đổi thành PAID
    if (isRestored) {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn lưu và xác nhận thanh toán bảng lương đã hủy cho nhân viên ${employees.find(e => e.id === payrollData.employeeId)?.name}?\n\n` +
        `Sau khi xác nhận, trạng thái sẽ chuyển thành "Đã thanh toán" và không thể chỉnh sửa.`
      );

      if (!confirmed) {
        return; // Không làm gì nếu user không xác nhận
      }
    }

    // Không tự set status - để BE xử lý
    const payrollRecord = {
      ...payrollData
      // status và paidDate sẽ được BE set
    };

    if (employeeIndex !== -1) {
      updatedPayrolls[employeeIndex] = {
        ...updatedPayrolls[employeeIndex],
        ...payrollRecord
      };
    } else {
      updatedPayrolls.push({
        ...employees.find(e => e.id === payrollData.employeeId),
        ...payrollRecord,
        month: selectedMonth
      });
    }

    setPayrollRecords(updatedPayrolls);

    // Xóa flag restored sau khi đã save thành công
    if (isRestored) {
      setRestoredFromCanceled(prev => {
        const newSet = new Set(prev);
        newSet.delete(payrollData.employeeId);
        return newSet;
      });
    }

    // Show success message (in real app, would be toast notification)
    alert(`Đã tính và lưu bảng lương thành công cho nhân viên ${employees.find(e => e.id === payrollData.employeeId)?.name}`);
  };

  // Navigate to payroll calculation page
  // Truyền employee data qua state để không cần gọi API nếu không có employeeId thật
  const openPayrollModal = (employee, payrollData = null) => {
    // ⚠️ QUAN TRỌNG: Đảm bảo employeeId là Number trước khi navigate
    let empId = null;
    
    // 1. Thử lấy từ payrollData.employeeId (ưu tiên cao nhất - từ API)
    if (payrollData?.employeeId != null && !isNaN(Number(payrollData.employeeId))) {
      empId = Number(payrollData.employeeId);
    }
    // 2. Thử lấy từ employee.employeeId
    else if (employee.employeeId != null && !isNaN(Number(employee.employeeId))) {
      empId = Number(employee.employeeId);
    }
    // 3. Thử lấy từ employee.id
    else if (employee.id != null && !isNaN(Number(employee.id))) {
      empId = Number(employee.id);
    }
    // 4. Nếu vẫn không có, thử tìm từ employees list bằng email hoặc name
    else if (employee.email || employee.name || payrollData?.email || payrollData?.name) {
      const searchEmail = employee.email || payrollData?.email;
      const searchName = employee.name || payrollData?.name;
      
      const foundEmployee = employees.find(e => {
        if (searchEmail && e.email?.toLowerCase() === searchEmail?.toLowerCase()) {
          return true;
        }
        if (searchName && e.name?.toLowerCase() === searchName?.toLowerCase()) {
          return true;
        }
        return false;
      });
      
      if (foundEmployee) {
        empId = Number(foundEmployee.id || foundEmployee.employeeId);
      }
    }
    
    // 5. Nếu vẫn không tìm được, cảnh báo và không navigate
    if (empId == null || isNaN(empId)) {
      console.error('❌ Cannot navigate - missing valid employeeId:', {
        employee,
        payrollData,
        employeesList: employees.length,
        employees: employees.map(e => ({ id: e.id, employeeId: e.employeeId, email: e.email, name: e.name }))
      });
      alert('Không thể tính lương vì thiếu thông tin nhân viên. Vui lòng thử lại sau khi tải lại trang.');
      return;
    }

    console.log('🚀 Navigating to PayrollCalculation:', {
      employeeId: empId,
      employeeName: employee.name,
      payrollData: payrollData
    });

    navigate(`/payroll/calculate/${empId}`, {
      state: {
        employee: {
          ...employee,
          id: empId,
          employeeId: empId // Đảm bảo cả id và employeeId đều là Number
        },
        payroll: payrollData,
        selectedMonth: selectedMonth // ⚠️ QUAN TRỌNG: Truyền tháng đã chọn để backend lưu đúng tháng
      }
    });
  };

  // Xác nhận thanh toán payroll (đổi status thành PAID)
  // ⚠️ LƯU Ý: Backend payPayroll đang update TẤT CẢ Salary records của Payroll
  // Nên cần update tất cả records có cùng payrollId trong frontend
  const handlePayPayroll = async (payrollId, salaryId = null) => {
    if (window.confirm('Bạn có chắc chắn muốn xác nhận thanh toán bảng lương này? Sau khi xác nhận, trạng thái sẽ chuyển thành "Đã thanh toán" và không thể chỉnh sửa.')) {
      try {
        // Call API to pay payroll
        // ⚠️ LƯU Ý: API payPayroll nhận payrollId (ID của Payroll entity)
        // Backend sẽ update TẤT CẢ Salary records của Payroll này thành SUCCESS
        await payPayroll(payrollId);

        // ⚠️ FIX: Update tất cả records có cùng payrollId (vì backend update tất cả Salary của Payroll)
        // Nếu có salaryId, chỉ update record đó (nhưng backend vẫn update tất cả)
        setPayrollRecords(payrollRecords.map(p =>
          p.payrollId === payrollId
            ? { ...p, status: 'PAID', paidDate: new Date().toISOString().split('T')[0] }
            : p
        ));

        // Reload từ API để đảm bảo data chính xác
        await loadMonthlyPayrollData();

        alert('Đã xác nhận thanh toán bảng lương thành công!');
      } catch (err) {
        console.error('Error paying payroll:', err);
        alert('Không thể xác nhận thanh toán. Vui lòng thử lại!');
      }
    }
  };

  // Rollback payroll record (đổi status thành Canceled, giữ data để chỉnh sửa)
  const handleRollbackPayroll = async (payrollId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy bảng lương này? Dữ liệu sẽ được giữ lại để chỉnh sửa.')) {
      try {
        // Call API to cancel payroll
        // ⚠️ QUAN TRỌNG: payrollId là ID của Payroll entity, không phải Salary entity
        await cancelPayrollAPI(payrollId);

        // Update local state - tìm payroll record bằng payrollId
        setPayrollRecords(payrollRecords.map(p =>
          p.payrollId === payrollId
            ? { ...p, status: 'CANCELLED', paidDate: null }
            : p
        ));

        // Reload từ API để đảm bảo data chính xác
        await loadMonthlyPayrollData();

        alert('Đã hủy bảng lương thành công!');
      } catch (err) {
        console.error('Error canceling payroll:', err);
        alert('Không thể hủy bảng lương. Vui lòng thử lại!');
      }
    }
  };

  const openPayrollDetailsModal = (employee, payrollRecord = null) => {
    console.log('Opening payroll details for:', employee);
    
    // Nếu đã truyền payrollRecord trực tiếp, dùng luôn
    if (payrollRecord) {
      setSelectedPayrollDetails({
        employee: employee,
        payroll: payrollRecord
      });
      setShowPayrollDetailsModal(true);
      console.log('Modal should open now');
      return;
    }
    
    // Tìm payroll record bằng nhiều cách
    let foundPayroll = null;
    
    // 1. Tìm bằng employeeId (nếu employee.id hợp lệ)
    if (employee.id != null && !isNaN(employee.id)) {
      foundPayroll = payrollRecords.find(record => {
        const recordEmpId = Number(record.employeeId);
        const empId = Number(employee.id);
        return recordEmpId === empId;
      });
    }
    
    // 2. Nếu không tìm được, thử tìm bằng email
    if (!foundPayroll && employee.email) {
      foundPayroll = payrollRecords.find(record =>
        record.email?.toLowerCase() === employee.email?.toLowerCase()
      );
    }
    
    // 3. Nếu vẫn không tìm được, thử tìm bằng tên
    if (!foundPayroll && employee.name) {
      const empName = employee.name.toLowerCase();
      foundPayroll = payrollRecords.find(record => {
        const recordName = (record.name || record.fullName)?.toLowerCase();
        return recordName === empName;
      });
    }
    
    console.log('Found payroll record:', foundPayroll);
    
    if (foundPayroll) {
      setSelectedPayrollDetails({
        employee: employee,
        payroll: foundPayroll
      });
      setShowPayrollDetailsModal(true);
      console.log('Modal should open now');
    } else {
      console.log('No payroll record found for employee:', employee);
      alert('Chưa có dữ liệu payroll cho nhân viên này');
    }
  };

  // Export payroll data (chỉ export những record có status = 'Paid', không export Canceled)
  const exportPayrollData = () => {
    const filteredPayrolls = payrollRecords.filter(payroll => {
      // Chỉ export những record đã được save (status = 'Paid')
      if (payroll.status !== 'Paid') {
        return false;
      }
      if (selectedDepartment !== 'all') {
        return payroll.department === selectedDepartment;
      }
      return true;
    });

    if (filteredPayrolls.length === 0) {
      alert('Không có dữ liệu lương đã lưu để xuất. Vui lòng lưu bảng lương trước khi xuất.');
      return;
    }

    // Simulate CSV export
    const csvContent = [
      ['Employee', 'Department', 'Basic Salary', 'OT Hours', 'OT Pay', 'Net Salary', 'Status', 'Paid Date'],
      ...filteredPayrolls.map(payroll => [
        payroll.name,
        payroll.department,
        payroll.basicSalary.toLocaleString(),
        payroll.otHours || 0,
        (payroll.otPay || 0).toLocaleString(),
        (payroll.netSalary || 0).toLocaleString(),
        payroll.status,
        payroll.paidDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Xuất dữ liệu lương thành công!');
  };

  // Load payroll statistics from API
  const [apiStats, setApiStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getPayrollSummary();
        setApiStats(stats);
      } catch (err) {
        console.error('Error loading payroll summary:', err);
      }
    };
    loadStats();
  }, [selectedMonth, payrollRecords]);

  // Calculate total payroll statistics
  // ⚠️ FIX: Chỉ tính từ payrollRecords của tháng đã chọn (không dùng apiStats vì nó tính tất cả tháng)
  // Filter payrollRecords theo selectedMonth trước khi tính
  const filteredPayrollRecords = payrollRecords.filter(payroll => {
    // Kiểm tra nếu payroll có month field và khớp với selectedMonth
    if (payroll.month) {
      return payroll.month === selectedMonth;
    }
    // Nếu không có month field, giả sử là tháng đã chọn (vì loadMonthlyPayrollData đã filter theo tháng)
    return true;
  });
  
  const payrollStats = filteredPayrollRecords.length > 0 ? filteredPayrollRecords.reduce((stats, payroll) => ({
    totalEmployees: stats.totalEmployees + 1,
    totalPayroll: stats.totalPayroll + (payroll.netSalary || 0),
    totalTax: stats.totalTax + ((payroll.socialInsurance || 0) + (payroll.healthInsurance || 0) + (payroll.unemploymentInsurance || 0)),
    totalInsurance: stats.totalInsurance + ((payroll.socialInsurance || 0) + (payroll.healthInsurance || 0) + (payroll.unemploymentInsurance || 0)),
    totalOTHours: stats.totalOTHours + (payroll.otHours || 0),
    totalOTPay: stats.totalOTPay + (payroll.otPay || 0)
  }), { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0, totalOTHours: 0, totalOTPay: 0 }) :
    { totalEmployees: 0, totalPayroll: 0, totalTax: 0, totalInsurance: 0, totalOTHours: 0, totalOTPay: 0 };

  // Generate payrolls when employees are loaded or OT data changes
  // CHỈ generate khi chưa có data từ API payroll
  useEffect(() => {
    if (employees.length > 0 && payrollRecords.length === 0) {
      generateAllPayrolls();
    }
  }, [employees, generateAllPayrolls, otRequests]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} p-6`}>
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Quản lý Bảng lương</h1>
                <p className={`${getSubtitleColor()} mt-1`}>
                  {userRole === 'admin' ? 'Tính toán và chi trả lương cho doanh nghiệp' :
                    userRole === 'accountant' ? 'Tính toán lương cho nhân viên' :
                      'Xem thông tin lương của nhân viên'}
                </p>
              </div>
              <div className="flex gap-3">

                {/* Chỉ Accountant mới có quyền xuất dữ liệu */}
                {userRole === 'accountant' && (
                  <Button
                    onClick={exportPayrollData}
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-purple-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất dữ liệu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                <Select
                  options={[
                    { value: 'all', label: 'Tất cả phòng ban' },
                    { value: 'IT', label: 'IT' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Human Resources', label: 'Nhân sự' },
                    { value: 'Finance', label: 'Tài chính' },
                    { value: 'Sales', label: 'Kinh doanh' }
                  ]}
                  defaultValue={selectedDepartment}
                  onChange={(value) => setSelectedDepartment(value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tháng lương</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              {/* Chỉ Accountant mới có quyền tạo bảng lương */}
              {userRole === 'accountant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thao tác</label>
                  <Button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isGenerating}
                    variant="primary"
                    className={`w-full transition-all duration-300 ${generateSuccess
                        ? 'bg-green-600 hover:bg-green-700'
                        : ''
                      }`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Đang tạo...
                      </span>
                    ) : generateSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        ✅ Tạo thành công!
                      </span>
                    ) : (
                      '🧮 Tạo bảng lương'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card title="Tổng nhân viên" icon={<Users className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{payrollStats.totalEmployees}</div>
                <div className="text-sm text-gray-500">Nhân viên đang làm</div>
              </div>
            </Card>

            <Card title="Tổng lương" icon={<DollarSign className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(payrollStats.totalPayroll / 1000000).toFixed(1)}M VND
                </div>
                <div className="text-sm text-gray-500">Tháng này</div>
              </div>
            </Card>

            <Card title="Tiền OT" icon={<Clock className="h-5 w-5 text-purple-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {payrollStats.totalOTPay > 0 ? `${(payrollStats.totalOTPay / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">{payrollStats.totalOTHours}h OT tháng này</div>
              </div>
            </Card>

            <Card title="Tổng bảo hiểm" icon={<Building className="h-5 w-5 text-orange-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {payrollStats.totalInsurance > 0 ? `${(payrollStats.totalInsurance / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Bảo hiểm xã hội</div>
              </div>
            </Card>

            <Card title="Tổng thuế" icon={<TrendingUp className="h-5 w-5 text-red-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {payrollStats.totalTax > 0 ? `${(payrollStats.totalTax / 1000000).toFixed(1)}M VND` : '0 VND'}
                </div>
                <div className="text-sm text-gray-500">Thuế đã thu</div>
              </div>
            </Card>
          </div>

          {/* Payroll List */}
          <Card title="Bảng lương hàng tháng"
            actions={
              userRole === 'accountant' ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      // ⚠️ FIX: Reload từ API thay vì generate local để giữ lại netSalary đã lưu
                      loadMonthlyPayrollData();
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    Làm mới
                  </Button>
                </div>
              ) : null
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">NHÂN VIÊN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">PHÒNG BAN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LƯƠNG CƠ BẢN</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ OT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TIỀN OT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">LƯƠNG THỰC LĨNH</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRecords
                    .filter(payroll => {
                      if (selectedDepartment === 'all') return true;
                      return payroll.department === selectedDepartment;
                    })
                    .map((payroll) => {
                      // Tìm employee bằng nhiều cách: employeeId, email, hoặc fullName
                      let matchedEmployee = null;

                      // 1. Thử tìm bằng employeeId nếu có (so sánh cả String và Number)
                      if (payroll.employeeId != null) {
                        const payrollEmpId = Number(payroll.employeeId);
                        matchedEmployee = employees.find(e => {
                          const empId = Number(e.id || e.employeeId);
                          return empId === payrollEmpId;
                        });
                      }

                      // 2. Nếu không tìm được, thử tìm bằng email
                      if (!matchedEmployee && payroll.email) {
                        matchedEmployee = employees.find(e =>
                          e.email?.toLowerCase() === payroll.email?.toLowerCase()
                        );
                      }

                      // 3. Nếu vẫn không tìm được, thử tìm bằng fullName
                      if (!matchedEmployee && (payroll.name || payroll.fullName)) {
                        const payrollName = (payroll.name || payroll.fullName)?.toLowerCase();
                        matchedEmployee = employees.find(e =>
                          e.name?.toLowerCase() === payrollName
                        );
                      }

                      // ⚠️ QUAN TRỌNG: Lấy employeeId thật (Number) để truyền sang PayrollCalculation
                      // Ưu tiên: matchedEmployee > payroll.employeeId (đã là Number từ mapping)
                      const realEmployeeId = matchedEmployee
                        ? Number(matchedEmployee.id || matchedEmployee.employeeId)
                        : (payroll.employeeId != null ? Number(payroll.employeeId) : null);

                      // Ưu tiên data từ payroll (API trả về), fallback employee
                      const displayName = payroll.name || payroll.fullName || matchedEmployee?.name || 'Unknown';
                      const displayEmail = payroll.email || matchedEmployee?.email || 'No email';
                      const displayDepartment = payroll.department || matchedEmployee?.department || 'N/A';

                      return (
                        <tr key={payroll.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {displayName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{displayName}</div>
                                <div className="text-sm text-gray-500">{displayEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-700">{displayDepartment}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">
                              {payroll.basicSalary?.toLocaleString()} VND
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {payroll.otHours > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                {payroll.otHours}h
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {payroll.otPay > 0 ? (
                              <div className="font-medium text-purple-600">
                                {payroll.otPay?.toLocaleString()} VND
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {payroll.netSalary > 0 ? (
                              <div className="font-medium text-green-600">
                                {(payroll.netSalary || 0).toLocaleString()} VND
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 italic">
                                Chưa tính lương
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              (payroll.status === 'Paid' || payroll.status === 'SUCCESS' || payroll.status === 'PAID')
                                ? 'bg-green-100 text-green-800'
                                : (payroll.status === 'PENDING' || payroll.status === 'AWAITING')
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : (payroll.status === 'Canceled' || payroll.status === 'CANCELLED')
                                    ? 'bg-red-100 text-red-800'
                                    : payroll.status === 'FAILED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}>
                              {payroll.status === 'PENDING' || payroll.status === 'AWAITING' ? 'Chờ xử lý' :
                                payroll.status === 'Paid' || payroll.status === 'SUCCESS' || payroll.status === 'PAID' ? 'Đã thanh toán' :
                                  payroll.status === 'Canceled' || payroll.status === 'CANCELLED' ? 'Đã hủy' :
                                    payroll.status === 'FAILED' ? 'Thất bại' :
                                      payroll.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 relative z-10">
                              {/* Chỉ Accountant mới có quyền tính lương */}
                              {userRole === 'accountant' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    
                                    // Tìm employeeId từ nhiều nguồn
                                    let finalEmployeeId = realEmployeeId;
                                    
                                    // Nếu realEmployeeId không hợp lệ, thử tìm từ employees list
                                    if (finalEmployeeId == null || isNaN(finalEmployeeId)) {
                                      // Tìm bằng email
                                      if (displayEmail) {
                                        const foundByEmail = employees.find(e => 
                                          e.email?.toLowerCase() === displayEmail?.toLowerCase()
                                        );
                                        if (foundByEmail) {
                                          finalEmployeeId = Number(foundByEmail.id || foundByEmail.employeeId);
                                        }
                                      }
                                      
                                      // Nếu vẫn không tìm được, thử tìm bằng name
                                      if ((finalEmployeeId == null || isNaN(finalEmployeeId)) && displayName) {
                                        const foundByName = employees.find(e => 
                                          e.name?.toLowerCase() === displayName?.toLowerCase()
                                        );
                                        if (foundByName) {
                                          finalEmployeeId = Number(foundByName.id || foundByName.employeeId);
                                        }
                                      }
                                    }
                                    
                                    // Dùng finalEmployeeId hoặc payroll.employeeId (từ API)
                                    const empId = finalEmployeeId || (payroll.employeeId != null && !isNaN(Number(payroll.employeeId)) ? Number(payroll.employeeId) : null);
                                    
                                    const empData = {
                                      id: empId,
                                      employeeId: empId,
                                      name: displayName,
                                      email: displayEmail,
                                      department: displayDepartment,
                                      salary: payroll.basicSalary,
                                      basicSalary: payroll.basicSalary
                                    };
                                    
                                    console.log('Opening payroll modal for:', {
                                      empData,
                                      realEmployeeId,
                                      finalEmployeeId: empId,
                                      payrollEmployeeId: payroll.employeeId
                                    });
                                    
                                    openPayrollModal(empData, payroll);
                                  }}
                                  className="px-3 py-1.5 text-sm rounded-md bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 cursor-pointer"
                                  title="Tính toán lương"
                                >
                                  🧮
                                </button>
                              )}
                              {/* Tất cả role đều được xem chi tiết */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const empData = {
                                    id: realEmployeeId,
                                    employeeId: realEmployeeId,
                                    name: displayName,
                                    email: displayEmail,
                                    department: displayDepartment
                                  };
                                  console.log('Opening details modal for:', empData);
                                  // Truyền trực tiếp payroll record để tránh lỗi tìm kiếm
                                  openPayrollDetailsModal(empData, payroll);
                                }}
                                className="px-3 py-1.5 text-sm rounded-md bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                title="Xem chi tiết"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {/* Chỉ Accountant mới có quyền xác nhận thanh toán, và chỉ khi status là AWAITING/PENDING */}
                              {userRole === 'accountant' && (payroll.status === 'PENDING' || payroll.status === 'AWAITING') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // ⚠️ QUAN TRỌNG: Dùng payrollId (ID của Payroll entity) để gọi API payPayroll
                                    const payrollIdToPay = payroll.payrollId;
                                    if (!payrollIdToPay) {
                                      alert('Không tìm thấy Payroll ID. Vui lòng thử lại sau khi làm mới trang.');
                                      return;
                                    }
                                    handlePayPayroll(payrollIdToPay);
                                  }}
                                  className="px-3 py-1.5 text-sm rounded-md bg-white text-green-600 border border-green-300 hover:bg-green-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                  title="Xác nhận thanh toán"
                                >
                                  ✓
                                </button>
                              )}
                              {/* Chỉ Accountant mới có quyền hủy, và chỉ khi status là AWAITING/PENDING (chưa thanh toán) */}
                              {/* ⚠️ LƯU Ý: Khi đã thanh toán (PAID/SUCCESS), không cho phép hủy nữa, nên ẩn nút cancel */}
                              {userRole === 'accountant' && (payroll.status === 'PENDING' || payroll.status === 'AWAITING') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // ⚠️ QUAN TRỌNG: Dùng payrollId (ID của Payroll entity) để gọi API cancelPayroll
                                    const payrollIdToCancel = payroll.payrollId;
                                    if (!payrollIdToCancel) {
                                      alert('Không tìm thấy Payroll ID. Vui lòng thử lại sau khi làm mới trang.');
                                      return;
                                    }
                                    handleRollbackPayroll(payrollIdToCancel);
                                  }}
                                  className="px-3 py-1.5 text-sm rounded-md bg-white text-red-600 border border-red-300 hover:bg-red-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                  title="Hủy bảng lương"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              {/* Hiển thị nút xóa disabled khi status là PENDING */}
                              {userRole === 'accountant' && payroll.status === 'PENDING' && (
                                <button
                                  disabled
                                  className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-400 border border-gray-200 font-medium transition-all duration-200 cursor-not-allowed flex items-center gap-1"
                                  title="Không thể hủy khi chưa lưu"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              {/* Hiển thị nút chỉnh sửa khi status là Canceled hoặc CANCELLED */}
                              {userRole === 'accountant' && (payroll.status === 'Canceled' || payroll.status === 'CANCELLED') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Đánh dấu payroll này đang được restore từ CANCELED
                                    setRestoredFromCanceled(prev => new Set(prev).add(realEmployeeId || payroll.id));
                                    // Mở modal chỉnh sửa và đổi status về PENDING để có thể save lại
                                    setPayrollRecords(payrollRecords.map(p =>
                                      p.id === payroll.id
                                        ? { ...p, status: 'PENDING' }
                                        : p
                                    ));
                                    const empData = {
                                      id: realEmployeeId,
                                      employeeId: realEmployeeId,
                                      name: displayName,
                                      email: displayEmail,
                                      department: displayDepartment,
                                      salary: payroll.basicSalary,
                                      basicSalary: payroll.basicSalary
                                    };
                                    openPayrollModal(empData, payroll);
                                  }}
                                  className="px-3 py-1.5 text-sm rounded-md bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                                  title="Chỉnh sửa bảng lương đã hủy"
                                >
                                  ✏️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Modals */}
        <PayrollCalculationModal
          isOpen={showPayrollModal}
          onClose={() => setShowPayrollModal(false)}
          onCalculate={handleCalculatePayroll}
          employee={selectedEmployee}
        />

        <PayrollDetailsModal
          isOpen={showPayrollDetailsModal}
          onClose={() => setShowPayrollDetailsModal(false)}
          payrollData={selectedPayrollDetails}
        />

        <PayrollPoliciesModal
          isOpen={showPoliciesModal}
          onClose={() => setShowPoliciesModal(false)}
        />

        {/* Modal Xác nhận Tạo Bảng lương */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  🧮 Tạo bảng lương
                </h3>
                <p className="text-emerald-100 text-sm mt-1">Xác nhận thông tin trước khi tạo</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Thông tin tháng */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tháng lương
                    </span>
                    <span className="font-bold text-gray-900">{selectedMonth}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Số nhân viên
                    </span>
                    <span className="font-bold text-blue-600">{employees.length} người</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Phòng ban
                    </span>
                    <span className="font-bold text-gray-900">
                      {selectedDepartment === 'all' ? 'Tất cả' : selectedDepartment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-gray-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Tổng lương ước tính
                    </span>
                    <span className="font-bold text-green-600">
                      {(employees.reduce((sum, emp) => sum + (emp.salary || emp.basicSalary || 0), 0) / 1000000).toFixed(1)}M VND
                    </span>
                  </div>
                </div>

                {/* Lưu ý */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động tính lương dựa trên lương cơ bản, OT đã duyệt và các khoản bảo hiểm theo quy định.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleGeneratePayroll();
                  }}
                  variant="primary"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  ✅ Xác nhận tạo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PayrollList;

