import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Heart,
  Shield,
  Users,
  Wallet,
  FileText,
  Plus,
  TrendingUp,
  CheckCircle,
  XCircle,
  User,
  Clock,
  AlertCircle,
  Calendar,
  Paperclip,
  Eye,
  Lock,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllBenefits,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  getEmployeeBenefits,
  grantBenefitToEmployee,
  updateEmployeeBenefit,
  deleteEmployeeBenefit,
  getAllInsuranceContracts,
  createInsuranceContract,
  updateInsuranceContract,
  deleteInsuranceContract,
  getEmployeeInsurance,
  grantInsuranceToEmployee,
  updateEmployeeInsurance,
  deleteEmployeeInsurance,
} from '../../services/benefitsService';
import { getAllEmployees, getEmployeeById } from '../../services/employeeService';
import { getRole } from '../../utils/auth';

const AdminBenefits = () => {
  const userRole = getRole();
  const canApprove = userRole === 'accountant'; // Chỉ accountant được duyệt
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // States
  const [loading, setLoading] = useState(true);
  const [welfarePrograms, setWelfarePrograms] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [employeeInsurance, setEmployeeInsurance] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWelfare, setEditingWelfare] = useState(null);
  const [isEditInsuranceModalOpen, setIsEditInsuranceModalOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [isAddWelfareModalOpen, setIsAddWelfareModalOpen] = useState(false);
  const [isAddInsuranceModalOpen, setIsAddInsuranceModalOpen] = useState(false);
  const [addInsuranceFormData, setAddInsuranceFormData] = useState({
    name: '',
    provider: '',
    type: 'mandatory',
    employerRate: '',
    employeeRate: '',
    effective: '',
    expiry: '',
    status: 'ACTIVE'
  });
  const [isGrantWelfareModalOpen, setIsGrantWelfareModalOpen] = useState(false);
  const [grantedWelfares, setGrantedWelfares] = useState([{
    employeeId: '',
    employeeName: '',
    department: '',
    allowance: '',
    welfareName: '',
    grantDate: '',
    status: 'ACTIVE'
  }]);
  const [isGrantInsuranceModalOpen, setIsGrantInsuranceModalOpen] = useState(false);
  const [grantedInsurances, setGrantedInsurances] = useState([{
    employeeId: '',
    employeeName: '',
    department: '',
    insuranceName: '',
    employerRate: '',
    employeeRate: '',
    grantDate: '',
    status: 'ACTIVE'
  }]);
  const [addWelfareFormData, setAddWelfareFormData] = useState({
    name: '',
    monthlyValue: 0,
    owner: '',
    budget: 0,
    status: 'ACTIVE',
    description: '',
    nextReview: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    monthlyValue: 0,
    owner: '',
    budget: 0,
    status: 'ACTIVE',
    description: '',
    nextReview: ''
  });
  const [welfareTabActive, setWelfareTabActive] = useState('programs'); // 'programs' hoặc 'history'
  const [isEditWelfareHistoryModalOpen, setIsEditWelfareHistoryModalOpen] = useState(false);
  const [editingWelfareHistory, setEditingWelfareHistory] = useState(null);
  const [expandedEmployees, setExpandedEmployees] = useState(new Set()); // Lưu employeeId nào đang được expand
  const [editWelfareHistoryFormData, setEditWelfareHistoryFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    allowance: '',
    welfareName: '',
    grantDate: '',
    status: 'ACTIVE'
  });
  const [welfareHistory, setWelfareHistory] = useState([]);
  const [insuranceTabActive, setInsuranceTabActive] = useState('policies'); // 'policies' hoặc 'history'
  const [insuranceHistory, setInsuranceHistory] = useState([]);
  const [expandedInsuranceEmployees, setExpandedInsuranceEmployees] = useState(new Set());
  const [isEditInsuranceHistoryModalOpen, setIsEditInsuranceHistoryModalOpen] = useState(false);
  const [editingInsuranceHistory, setEditingInsuranceHistory] = useState(null);
  const [editInsuranceHistoryFormData, setEditInsuranceHistoryFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    insuranceName: '',
    employerRate: '',
    employeeRate: '',
    grantDate: '',
    status: 'ACTIVE'
  });
  const [editInsuranceFormData, setEditInsuranceFormData] = useState({
    name: '',
    provider: '',
    type: 'mandatory',
    employerRate: '',
    employeeRate: '',
    effective: '',
    expiry: '',
    status: 'ACTIVE'
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Sync URL params with modal state
  useEffect(() => {
    const editType = searchParams.get('edit');
    const editId = searchParams.get('id');

    if (editType === 'insurance' && editId && insurancePolicies.length > 0) {
      const insurance = insurancePolicies.find(p => p.id === editId || p.id === Number(editId));
      if (insurance) {
        setEditingInsurance(insurance);
        setEditInsuranceFormData({
          name: insurance.name || '',
          provider: insurance.provider || '',
          type: insurance.type || 'mandatory',
          employerRate: insurance.employerRate || '',
          employeeRate: insurance.employeeRate || '',
          effective: insurance.effective || '',
          expiry: insurance.expiry || '',
          status: insurance.status || 'ACTIVE'
        });
        setIsEditInsuranceModalOpen(true);
      }
    } else if (editType === 'welfare' && editId && welfarePrograms.length > 0) {
      const welfare = welfarePrograms.find(p => p.id === editId || p.id === Number(editId));
      if (welfare) {
        setEditingWelfare(welfare);
        setEditFormData({
          name: welfare.name || '',
          monthlyValue: welfare.monthlyValue || 0,
          owner: welfare.owner || '',
          budget: welfare.budget || 0,
          status: welfare.status || 'ACTIVE',
          description: welfare.description || '',
          nextReview: welfare.nextReview || ''
        });
        setIsEditModalOpen(true);
      }
    } else if (editType === 'welfareHistory' && editId && welfareHistory.length > 0) {
      const history = welfareHistory.find(h => h.id === editId || h.id === Number(editId));
      if (history) {
        setEditingWelfareHistory(history);
        setEditWelfareHistoryFormData({
          employeeId: history.employeeId || '',
          employeeName: history.employeeName || '',
          department: history.department || '',
          allowance: history.allowance || '',
          welfareName: history.welfareName || '',
          grantDate: history.grantDate || '',
          status: history.status || 'ACTIVE'
        });
        setIsEditWelfareHistoryModalOpen(true);
      }
    } else if (editType === 'insuranceHistory' && editId && insuranceHistory.length > 0) {
      const history = insuranceHistory.find(h => h.id === editId || h.id === Number(editId));
      if (history) {
        setEditingInsuranceHistory(history);
        setEditInsuranceHistoryFormData({
          employeeId: history.employeeId || '',
          employeeName: history.employeeName || '',
          department: history.department || '',
          insuranceName: history.insuranceName || '',
          employerRate: history.employerRate || '',
          employeeRate: history.employeeRate || '',
          grantDate: history.grantDate || '',
          status: history.status || 'ACTIVE'
        });
        setIsEditInsuranceHistoryModalOpen(true);
      }
    }

    // Handle add/grant actions from URL
    const actionType = searchParams.get('action');
    if (actionType === 'addWelfare') {
      setIsAddWelfareModalOpen(true);
    } else if (actionType === 'addInsurance') {
      setIsAddInsuranceModalOpen(true);
    } else if (actionType === 'grantWelfare') {
      setIsGrantWelfareModalOpen(true);
    } else if (actionType === 'grantInsurance') {
      setIsGrantInsuranceModalOpen(true);
    }
  }, [searchParams, insurancePolicies, welfarePrograms, welfareHistory, insuranceHistory]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load benefits và insurance templates từ API
      let benefitsRes, insuranceRes;
      try {
        [benefitsRes, insuranceRes] = await Promise.all([
          getAllBenefits(),
          getAllInsuranceContracts()
        ]);
      } catch (error) {
        console.error('❌ Error loading templates:', error);
        toast.error('Không thể tải dữ liệu template. Vui lòng thử lại.');
        // Không set về [] để giữ data cũ
        setLoading(false);
        return;
      }

      // Map benefits data
      const benefitsData = Array.isArray(benefitsRes) ? benefitsRes : (benefitsRes?.data || benefitsRes || []);
      console.log('🔍 Raw benefits data from API:', benefitsData);
      console.log('🔍 Benefits response type:', typeof benefitsRes, Array.isArray(benefitsRes));
      console.log('🔍 Number of benefits from API:', benefitsData.length);
      
      if (benefitsData.length > 0) {
        console.log('🔍 First benefit structure:', benefitsData[0]);
        console.log('🔍 All fields in first benefit:', Object.keys(benefitsData[0]));
        console.log('🔍 First benefit has benefitId?', 'benefitId' in benefitsData[0]);
        console.log('🔍 First benefit has id?', 'id' in benefitsData[0]);
        console.log('🔍 First benefit benefitId value:', benefitsData[0].benefitId);
        console.log('🔍 First benefit id value:', benefitsData[0].id);
        console.log('🔍 Full first benefit object:', JSON.stringify(benefitsData[0], null, 2));
        
        // ⚠️ VẤN ĐỀ: Response chỉ có id (Long), không có benefitId (String)
        // Nhưng DELETE/PUT endpoint cần benefitId (String)
        if (!benefitsData[0].benefitId) {
          console.error('❌ CRITICAL: Response missing benefitId (String)!', {
            hasId: !!benefitsData[0].id,
            hasBenefitId: !!benefitsData[0].benefitId,
            idValue: benefitsData[0].id,
            idType: typeof benefitsData[0].id,
            note: 'Backend DELETE/PUT endpoint needs benefitId (String), but response only has id (Long). Backend needs to add benefitId to AllBenefitResponseDTO.'
          });
        }
      } else {
        console.warn('⚠️ No benefits data from API - keeping existing data');
        // Không clear data, giữ nguyên state cũ
        setLoading(false);
        return;
      }
      
      const mappedBenefits = benefitsData.map(b => {
        // Parse allowance_amount (snake_case từ backend) hoặc allowanceAmount (camelCase)
        let monthlyValue = 0;
        if (b.allowance_amount !== null && b.allowance_amount !== undefined) {
          if (typeof b.allowance_amount === 'string') {
            monthlyValue = parseFloat(b.allowance_amount) || 0;
          } else if (typeof b.allowance_amount === 'number') {
            monthlyValue = b.allowance_amount;
          } else {
            // BigDecimal từ Java
            monthlyValue = parseFloat(b.allowance_amount) || 0;
          }
        } else if (b.allowanceAmount !== null && b.allowanceAmount !== undefined) {
          if (typeof b.allowanceAmount === 'string') {
            monthlyValue = parseFloat(b.allowanceAmount) || 0;
          } else if (typeof b.allowanceAmount === 'number') {
            monthlyValue = b.allowanceAmount;
          } else {
            monthlyValue = parseFloat(b.allowanceAmount) || 0;
          }
        }
        
        // Parse totalCost (BigDecimal từ Java)
        let budget = 0;
        if (b.totalCost !== null && b.totalCost !== undefined) {
          if (typeof b.totalCost === 'string') {
            budget = parseFloat(b.totalCost) || 0;
          } else if (typeof b.totalCost === 'number') {
            budget = b.totalCost;
          } else {
            budget = parseFloat(b.totalCost) || 0;
          }
        }
        
        // ⚠️ VẤN ĐỀ: Response từ GET /api/benefits/all chỉ có id (Long), KHÔNG có benefitId (String)
        // Nhưng DELETE/PUT /api/benefits/{benefitId} cần benefitId (String)
        // 
        // Backend Entity Benefits có:
        // - id (Long) = 11 (PRIMARY KEY)
        // - benefitId (String) = "BEN001" (UNIQUE, business key)
        //
        // Response hiện tại: { id: 11, ... } - THIẾU benefitId
        // Endpoint cần: DELETE /api/benefits/BEN001 - CẦN benefitId (String)
        //
        // Giải pháp tạm thời: Dùng id (Long) converted sang String
        // Nhưng sẽ lỗi 404 vì backend tìm theo benefitId (String), không phải id (Long)
        const idLong = b.id; // Long từ response (ví dụ: 11)
        const benefitIdString = b.benefitId || b.benefit_id; // String - KHÔNG CÓ trong response hiện tại
        
        const benefitName = b.benefitName || b.name;
        
        // ⚠️ WARNING: Nếu không có benefitId (String), DELETE/PUT sẽ lỗi 404
        // Backend cần thêm benefitId vào AllBenefitResponseDTO
        const identifier = benefitIdString || (idLong ? String(idLong) : null) || benefitName;
        
        // Log warning nếu thiếu benefitId
        if (!benefitIdString && idLong) {
          console.warn('⚠️ Benefit missing benefitId (String) from response. DELETE/PUT will fail with 404:', {
            id: idLong,
            idType: typeof idLong,
            benefitId: 'MISSING - Backend needs to add benefitId to AllBenefitResponseDTO',
            benefitName: benefitName,
            note: 'Backend DELETE/PUT endpoint needs benefitId (String), but response only has id (Long). This will cause 404 error.'
          });
        }
        
        return {
          id: identifier, // Dùng id (Long) converted sang String (tạm thời)
          benefitId: benefitIdString, // Giữ benefitId (String) - NULL nếu backend chưa thêm vào response
          idLong: idLong, // Giữ id (Long) riêng
          name: benefitName,
        description: b.description || '',
          monthlyValue: monthlyValue, // Map từ allowance_amount
          owner: b.owner || b.department || '', // Dùng department nếu không có owner
          budget: budget,
        participants: b.numberOfEmployees || 0,
        type: b.type || 'welfare',
          status: normalizeStatus(b.status), // Chuẩn hóa status
        };
      });
      
      console.log('✅ Mapped benefits:', mappedBenefits);
      console.log('✅ Number of mapped benefits:', mappedBenefits.length);
      
      // Chỉ set state nếu có data, không clear data cũ nếu mapping fail
      if (mappedBenefits && mappedBenefits.length > 0) {
      setWelfarePrograms(mappedBenefits);
      } else {
        console.warn('⚠️ No benefits mapped. Keeping existing data.');
      }

      // Map insurance data
      const insuranceData = Array.isArray(insuranceRes) ? insuranceRes : (insuranceRes?.data || insuranceRes || []);
      console.log('🔍 Raw insurance data from API:', insuranceData);
      console.log('🔍 Insurance response type:', typeof insuranceRes, Array.isArray(insuranceRes));
      
      const mappedInsurance = insuranceData.map(i => ({
        id: i.id,
        name: i.insurenceName || i.name,
        provider: i.provider || '',
        type: i.type || 'mandatory',
        employerRate: i.employerRate || 0,
        employeeRate: i.employeeRate || 0,
        effective: i.effective,
        expiry: i.expiry,
        status: normalizeStatus(i.status), // Chuẩn hóa status
      }));
      console.log('✅ Mapped insurance:', mappedInsurance);
      setInsurancePolicies(mappedInsurance);

      // Load employee benefits và insurance cho TẤT CẢ nhân viên
      try {
        const employeesRes = await getAllEmployees();
        const employees = Array.isArray(employeesRes) ? employeesRes : (employeesRes?.data || employeesRes || []);
        console.log('🔍 Total employees:', employees.length);
        console.log('🔍 Employee IDs:', employees.map(emp => emp.employeeId || emp.id));

        // Load phúc lợi và bảo hiểm cho từng nhân viên
        const allBenefitsPromises = employees.map(emp =>
          getEmployeeBenefits(emp.employeeId || emp.id).catch((err) => {
            console.warn(`⚠️ Failed to load benefits for ${emp.employeeId || emp.id}:`, err);
            return [];
          })
        );
        const allInsurancePromises = employees.map(emp =>
          getEmployeeInsurance(emp.employeeId || emp.id).catch((err) => {
            console.warn(`⚠️ Failed to load insurance for ${emp.employeeId || emp.id}:`, err);
            return [];
          })
        );

        const [benefitsResults, insuranceResults] = await Promise.all([
          Promise.all(allBenefitsPromises),
          Promise.all(allInsurancePromises)
        ]);

        // Flatten và map benefits data
        const allEmployeeBenefits = benefitsResults.flat().map((b, idx) => {
          // Parse allowanceAmount: có thể là số, string (từ BigDecimal), hoặc null
          let allowanceValue = 0;
          if (b.allowanceAmount !== null && b.allowanceAmount !== undefined) {
            if (typeof b.allowanceAmount === 'string') {
              allowanceValue = parseFloat(b.allowanceAmount) || 0;
            } else if (typeof b.allowanceAmount === 'number') {
              allowanceValue = b.allowanceAmount;
            } else {
              allowanceValue = parseFloat(b.allowanceAmount) || 0;
            }
          }
          
          return {
            id: b.id || idx + 1,
            employeeId: b.employeeId,
            employeeName: b.fullName || b.employeeName || 'N/A',
            department: b.department || 'N/A',
            benefitId: b.benefitId,
            benefitName: b.benefitName || 'N/A',
            welfareName: b.benefitName || b.welfareName || 'N/A', // Map benefitName → welfareName để render
            allowance: allowanceValue, // Dùng 'allowance' để khớp với render
            amount: allowanceValue, // Giữ cả 'amount' để tương thích
            grantDate: b.grantDate,
            status: normalizeStatus(b.status), // Chuẩn hóa status
          };
        });
        setWelfareHistory(allEmployeeBenefits);
        console.log('✅ Loaded employee benefits:', allEmployeeBenefits);

        // Flatten và map insurance data
        console.log('🔍 Raw insurance results (before flatten):', insuranceResults);
        console.log('🔍 Number of employee insurance arrays:', insuranceResults.length);
        
        // Flatten và xử lý các trường hợp khác nhau của API response
        const flattenedInsurance = insuranceResults.flatMap((result, empIdx) => {
          // Handle các trường hợp: array, object với data property, hoặc null/undefined
          if (!result) return [];
          if (Array.isArray(result)) return result;
          if (result.data && Array.isArray(result.data)) return result.data;
          if (result.success && Array.isArray(result.data)) return result.data;
          return [];
        });
        
        console.log('🔍 Flattened insurance results:', flattenedInsurance);
        console.log('🔍 Total flattened records:', flattenedInsurance.length);
        
        const allEmployeeInsurance = flattenedInsurance
          .filter(ins => ins != null && ins !== undefined) // Loại bỏ null/undefined
          .map((ins, idx) => {
            // Debug 5 item đầu tiên
            if (idx < 5) {
              console.log(`🔍 Insurance item ${idx}:`, {
                raw: ins,
                employeeId: ins.employeeId || ins.employee?.employeeId,
                insuranceName: ins.insurenceName || ins.insuranceName,
                contractId: ins.contractId || ins.id
              });
            }
            return {
              id: ins.id || ins.contractId || `temp-${idx}`,
              employeeId: ins.employeeId || ins.employee?.employeeId || ins.employeeId,
              employeeName: ins.fullName || ins.employeeName || ins.employee?.fullName || 'N/A',
              department: ins.department || ins.employee?.department || 'N/A',
              contractId: ins.contractId || ins.id,
              insuranceName: ins.insurenceName || ins.insuranceName || ins.contract?.insurenceName || 'N/A',
              employerRate: ins.employerRate || ins.contract?.employerRate || 0,
              employeeRate: ins.employeeRate || ins.contract?.employeeRate || 0,
              grantDate: ins.grantDate || ins.effective,
              status: normalizeStatus(ins.status || ins.contract?.status), // Chuẩn hóa status
            };
          })
          .filter(ins => ins.employeeId && ins.employeeId !== 'N/A'); // Loại bỏ records không có employeeId
        
        console.log('✅ Loaded employee insurance (mapped):', allEmployeeInsurance);
        console.log('✅ Total insurance records after mapping:', allEmployeeInsurance.length);
        console.log('✅ Unique employee IDs:', [...new Set(allEmployeeInsurance.map(ins => ins.employeeId))]);
        setInsuranceHistory(allEmployeeInsurance);

      } catch (err) {
        console.error('Error loading employee benefits/insurance:', err);
        setWelfareHistory([]);
        setInsuranceHistory([]);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Helper function để normalize status về UPPERCASE
  // Backend hỗ trợ: ACTIVE, INACTIVE, EXPIRED
  const normalizeStatus = (status) => {
    if (!status) return 'ACTIVE';
    const upper = status.toUpperCase();
    // Chỉ chấp nhận các giá trị hợp lệ từ backend
    if (['ACTIVE', 'INACTIVE', 'EXPIRED'].includes(upper)) {
      return upper;
    }
    // Fallback về ACTIVE nếu không hợp lệ
    return 'ACTIVE';
  };

  // Helper function để lấy label và màu cho status
  // Backend hỗ trợ: ACTIVE, INACTIVE, EXPIRED
  const getStatusDisplay = (status) => {
    const normalized = status?.toUpperCase() || 'ACTIVE';
    switch(normalized) {
      case 'ACTIVE':
        return { label: 'Đang áp dụng', className: 'bg-green-100 text-green-700' };
      case 'INACTIVE':
        return { label: 'Đã hủy', className: 'bg-red-100 text-red-700' };
      case 'EXPIRED':
        return { label: 'Hết hạn', className: 'bg-orange-100 text-orange-700' };
      default:
        return { label: 'Không xác định', className: 'bg-gray-100 text-gray-700' };
    }
  };

  const totalBudget = welfarePrograms.reduce((sum, p) => sum + p.budget, 0);
  const totalParticipants = welfarePrograms.reduce((sum, p) => sum + p.participants, 0);

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-600'
    };
    const labels = {
      high: 'Ưu tiên cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const handleEditWelfare = (id) => {
    console.log('🔍 handleEditWelfare called with id:', id);
    const welfare = welfarePrograms.find(p => p.id === id || p.id === String(id) || p.id === Number(id));
    console.log('🔍 Found welfare:', welfare);
    
    if (!welfare) {
      toast.error('Không tìm thấy phúc lợi');
      return;
    }
    
    // Set editing welfare và form data
    setEditingWelfare(welfare);
    setEditFormData({
      name: welfare.name || '',
      monthlyValue: welfare.monthlyValue || 0,
      owner: welfare.owner || '',
      budget: welfare.budget || 0,
      status: welfare.status || 'ACTIVE',
      description: welfare.description || '',
      nextReview: welfare.nextReview || ''
    });
    
    // Open modal
    setIsEditModalOpen(true);
    
    // Navigate with search params to update URL
    setSearchParams({ edit: 'welfare', id: String(id) });
  };

  const handleSaveEdit = async () => {
    if (!editingWelfare) return;

    // Validate
    if (!editFormData.name || !editFormData.monthlyValue || !editFormData.owner) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      // Theo API doc: PUT /api/benefits/{benefitId} cần UpdateBenefitRequestDTO
      // Request body cần: benefitId, benefitName, description, numberOfEmployees, coverage, allowanceAmount, status
      
      // Lấy id (Long) để gọi API
      // Endpoint DELETE/PUT /api/benefits/{benefitId} có thể chấp nhận id (Long) converted sang String
      // Hoặc backend có thể thay đổi endpoint để dùng id (Long) trực tiếp
      const idLong = editingWelfare.idLong || editingWelfare.id;
      const benefitIdString = editingWelfare.benefitId;
      
      // Ưu tiên: benefitId (String) nếu có, nếu không thì dùng id (Long) converted sang String
      const identifier = benefitIdString || (idLong ? String(idLong) : null);
      
      if (!identifier) {
        toast.error('Lỗi: Không tìm thấy identifier để cập nhật');
        console.error('❌ Missing identifier for update:', editingWelfare);
        return;
      }
      
      // Chuẩn bị data theo format API yêu cầu
      // ⚠️ LƯU Ý: benefitId đã có trong path parameter, KHÔNG cần gửi trong body
      // UpdateBenefitRequestDTO không có field benefitId
      const updateData = {
        // KHÔNG gửi benefitId - đã có trong path parameter
        benefitName: editFormData.name,
        description: editFormData.description || '',
        numberOfEmployees: editFormData.participants || 0,
        coverage: editFormData.coverage || '', // Có thể cần thêm field này
        allowanceAmount: editFormData.monthlyValue || 0,
        status: normalizeStatus(editFormData.status) // UPPERCASE: ACTIVE, INACTIVE, EXPIRED
      };
      
      console.log('📤 Updating benefit:', {
        identifier: identifier,
        idLong: idLong,
        benefitIdString: benefitIdString || 'Using id (Long) converted to String',
        updateData: updateData,
        name: editingWelfare.name
      });
      
      // Gọi API cập nhật phúc lợi
      // PUT /api/benefits/{benefitId}
      // ⚠️ Backend endpoint tìm theo benefitId (String), không phải id (Long)
      // Nếu gửi id (Long) = 11 → Backend tìm benefitId = "11" → Không tìm thấy → 404
      try {
        await updateBenefit(identifier, updateData);
      } catch (error) {
        // Nếu lỗi 404 và đang dùng id (Long) thay vì benefitId (String)
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          if (!benefitIdString) {
            toast.error(`Lỗi 404: Backend không tìm thấy benefit.\n\nNguyên nhân: Response chỉ có id (Long) = ${idLong}, nhưng endpoint cần benefitId (String).\n\nBackend cần thêm benefitId (String) vào AllBenefitResponseDTO.`);
            console.error('❌ 404 Error - Backend needs benefitId (String), not id (Long):', {
              idLong: idLong,
              identifier: identifier,
              error: error.message
            });
            return;
          }
        }
        throw error; // Re-throw nếu không phải lỗi này
      }

      // Cập nhật state
      setWelfarePrograms(prev => prev.map(p =>
        p.id === editingWelfare.id
          ? { ...p, ...updateData }
          : p
      ));

      toast.success(`Đã cập nhật phúc lợi "${editFormData.name}"`);
      setIsEditModalOpen(false);
      setEditingWelfare(null);
      setSearchParams({});
      
      // Reload data để sync với server
      setTimeout(async () => {
        await loadData();
      }, 500);
    } catch (error) {
      console.error('Error updating benefit:', error);
      toast.error(`Không thể cập nhật phúc lợi: ${error.message || 'Vui lòng thử lại'}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingWelfare(null);
    setEditFormData({
      name: '',
      monthlyValue: 0,
      owner: '',
      budget: 0,
      status: 'ACTIVE',
      description: '',
      nextReview: ''
    });
    setSearchParams({});
  };

  const handleDeleteWelfare = async (id) => {
    console.log('🔍 handleDeleteWelfare called with id:', id);
    const welfare = welfarePrograms.find(p => p.id === id || p.id === String(id) || p.id === Number(id));
    console.log('🔍 Found welfare:', welfare);
    
    if (!welfare) {
      toast.error('Không tìm thấy phúc lợi');
      return;
    }
    
    // Lấy id (Long) để gọi API
    // Endpoint DELETE /api/benefits/{benefitId} có thể chấp nhận id (Long) converted sang String
    // Hoặc backend có thể thay đổi endpoint để dùng id (Long) trực tiếp
    const idLong = welfare.idLong || welfare.id;
    const benefitIdString = welfare.benefitId;
    
    // Ưu tiên: benefitId (String) nếu có, nếu không thì dùng id (Long) converted sang String
    const identifier = benefitIdString || (idLong ? String(idLong) : null);
    
    if (!identifier) {
      toast.error(`Lỗi: Phúc lợi "${welfare.name}" không có identifier. Không thể xóa.`);
      console.error('❌ Missing identifier for delete:', {
        welfare: welfare,
        allFields: Object.keys(welfare)
      });
      return;
    }
    
    // Log để debug
    console.log('📤 Deleting benefit:', {
      identifier: identifier,
      idLong: idLong,
      benefitIdString: benefitIdString || 'Using id (Long) converted to String',
      name: welfare.name,
      welfare: welfare,
      note: 'If backend endpoint accepts id (Long), this should work. If it needs benefitId (String), will get 404.'
    });
    
    if (window.confirm(`Bạn có chắc chắn muốn XÓA phúc lợi "${welfare.name}"?\n\n⚠️ CẢNH BÁO: Hành động này sẽ XÓA VĨNH VIỄN phúc lợi khỏi hệ thống.\n\nLưu ý: Chỉ có thể xóa phúc lợi khi không còn nhân viên nào đang sử dụng (ACTIVE).`)) {
      try {
        // Gọi API DELETE để xóa hoàn toàn khỏi database
        // DELETE /api/benefits/{benefitId}
        // ⚠️ Backend endpoint tìm theo benefitId (String), không phải id (Long)
        // Nếu gửi id (Long) = 11 → Backend tìm benefitId = "11" → Không tìm thấy → 404
        // 
        // Backend sẽ tự động:
        // 1. Tìm tất cả EmployeeBenefits đang dùng benefit này
        // 2. Phân loại: ACTIVE (không được xóa) vs EXPIRED/INACTIVE (được xóa)
        // 3. Nếu có ACTIVE → THROW ERROR
        // 4. Xóa các record EXPIRED/INACTIVE
        // 5. Xóa Benefits template
        try {
          await deleteBenefit(identifier);
        } catch (error) {
          // Nếu lỗi 404 và đang dùng id (Long) thay vì benefitId (String)
          if (error.message?.includes('404') || error.message?.includes('not found')) {
            if (!benefitIdString) {
              toast.error(`Lỗi 404: Backend không tìm thấy benefit.\n\nNguyên nhân: Response chỉ có id (Long) = ${idLong}, nhưng endpoint cần benefitId (String).\n\nBackend cần thêm benefitId (String) vào AllBenefitResponseDTO.`);
              console.error('❌ 404 Error - Backend needs benefitId (String), not id (Long):', {
                idLong: idLong,
                identifier: identifier,
                error: error.message
              });
              return;
            }
          }
          throw error; // Re-throw nếu không phải lỗi này
        }
        
        // Xóa khỏi state ngay lập tức
        setWelfarePrograms(prev => prev.filter(p => p.id !== id));
        
        toast.success(`Đã xóa phúc lợi "${welfare.name}" thành công`);
        
        // Reload data sau 500ms để đảm bảo sync với server
        setTimeout(async () => {
          await loadData();
        }, 500);
      } catch (error) {
        console.error('Error deleting benefit:', error);
        // Backend sẽ trả về error nếu còn nhân viên ACTIVE đang dùng
        const errorMessage = error.message || error.response || 'Vui lòng thử lại';
        if (errorMessage.includes('nhân viên') || errorMessage.includes('employee') || errorMessage.includes('đang sử dụng')) {
          toast.error(`Không thể xóa phúc lợi "${welfare.name}": ${errorMessage}`);
        } else {
          toast.error(`Có lỗi xảy ra khi xóa phúc lợi: ${errorMessage}`);
        }
      }
    }
  };

  const handleEditWelfareHistory = (id) => {
    // Navigate with search params to update URL
    setSearchParams({ edit: 'welfareHistory', id: String(id) });
  };

  const handleSaveEditWelfareHistory = async () => {
    if (!editingWelfareHistory) return;

    // Validate
    if (!editWelfareHistoryFormData.employeeId || !editWelfareHistoryFormData.employeeId.trim()) {
      toast.error('Vui lòng nhập mã nhân viên');
      return;
    }
    if (!editWelfareHistoryFormData.welfareName || !editWelfareHistoryFormData.welfareName.trim()) {
      toast.error('Vui lòng chọn tên phúc lợi');
      return;
    }
    if (!editWelfareHistoryFormData.grantDate || !editWelfareHistoryFormData.grantDate.trim()) {
      toast.error('Vui lòng nhập ngày cấp');
      return;
    }

    try {
      // Tìm benefitId từ welfareName
      const selectedBenefit = welfarePrograms.find(w => w.name === editWelfareHistoryFormData.welfareName);
      if (!selectedBenefit) {
        toast.error('Không tìm thấy phúc lợi được chọn');
        return;
      }

      const employeeId = editWelfareHistoryFormData.employeeId.trim();
      
      // Lấy benefitId từ editingWelfareHistory (record hiện tại) hoặc từ selectedBenefit (template)
      // Ưu tiên: benefitId từ record hiện tại (nếu có), nếu không thì dùng từ template
      let benefitId = editingWelfareHistory?.benefitId;
      
      if (!benefitId) {
        // Ưu tiên: benefitId (String) nếu có, nếu không thì dùng id (Long) converted sang String
        benefitId = selectedBenefit.benefitId || String(selectedBenefit.idLong || selectedBenefit.id);
      }
      
      if (!benefitId) {
        toast.error('Không tìm thấy benefitId để cập nhật');
        console.error('❌ Missing benefitId for employee benefit update:', {
          editingWelfareHistory,
          selectedBenefit,
          welfareName: editWelfareHistoryFormData.welfareName
        });
        return;
      }
      
      // Format date về yyyy-MM-dd
      const formatDateToYYYYMMDD = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Gọi API cập nhật phúc lợi nhân viên
      // PUT /api/employee-benefits/employee/{employeeId}/benefit/{benefitId}
      // ⚠️ Backend UpdateEmployeeBenefitRequestDTO KHÔNG có field allowanceAmount
      // Chỉ hỗ trợ: benefitId, grantDate, status
      // 
      // VẤN ĐỀ: Không thể update allowanceAmount qua API này
      // Giải pháp: Backend cần thêm allowanceAmount vào UpdateEmployeeBenefitRequestDTO
      // Hoặc cần API khác để update allowanceAmount
      const updateData = {
        benefitId: benefitId, // Có thể cần trong body
        grantDate: formatDateToYYYYMMDD(editWelfareHistoryFormData.grantDate),
        status: normalizeStatus(editWelfareHistoryFormData.status || 'ACTIVE')
        // KHÔNG gửi allowanceAmount - Backend không hỗ trợ
      };
      
      console.log('📤 Update data being sent:', {
        updateData,
        allowanceFromForm: editWelfareHistoryFormData.allowance,
        note: '⚠️ Backend UpdateEmployeeBenefitRequestDTO does not support allowanceAmount. Frontend will update state but backend will not persist allowanceAmount change.'
      });

      console.log('📤 Updating employee benefit:', {
        employeeId,
        benefitId,
        benefitIdType: typeof benefitId,
        selectedBenefit: selectedBenefit,
        updateData
      });

      await updateEmployeeBenefit(employeeId, benefitId, updateData);

      // Cập nhật state ngay lập tức với data mới
      // Lưu ý: allowanceAmount có thể không được update qua API này
      // Nếu backend không hỗ trợ update allowanceAmount, cần thêm field này vào API
      const updatedAllowance = editWelfareHistoryFormData.allowance || editingWelfareHistory.allowance;
      
      console.log('📝 Updating state with new data:', {
        oldAllowance: editingWelfareHistory.allowance,
        newAllowance: editWelfareHistoryFormData.allowance,
        updatedAllowance: updatedAllowance
      });
      
      setWelfareHistory(prev => prev.map(h =>
        h.id === editingWelfareHistory.id
          ? { 
              ...h, 
              employeeId: editWelfareHistoryFormData.employeeId,
              employeeName: editWelfareHistoryFormData.employeeName,
              department: editWelfareHistoryFormData.department,
              allowance: updatedAllowance, // Cập nhật allowance từ form
              amount: updatedAllowance, // Cập nhật amount
              benefitId: benefitId,
              benefitName: editWelfareHistoryFormData.welfareName,
              welfareName: editWelfareHistoryFormData.welfareName,
              grantDate: editWelfareHistoryFormData.grantDate,
              status: normalizeStatus(editWelfareHistoryFormData.status || 'ACTIVE')
            }
          : h
      ));

      toast.success('Đã cập nhật phúc lợi nhân viên thành công');
      setIsEditWelfareHistoryModalOpen(false);
      setEditingWelfareHistory(null);
      setSearchParams({});
      
      // ⚠️ VẤN ĐỀ: API PUT /api/employee-benefits/employee/{employeeId}/benefit/{benefitId}
      // có thể không hỗ trợ update allowanceAmount (chỉ update benefitId, grantDate, status)
      // 
      // Nếu backend không hỗ trợ update allowanceAmount:
      // - Reload sẽ lấy giá trị cũ từ DB → overwrite giá trị mới trong state
      // - Cần backend thêm allowanceAmount vào UpdateEmployeeBenefitRequestDTO
      // 
      // Giải pháp tạm thời: Không reload ngay, giữ giá trị mới trong state
      // Hoặc reload nhưng merge với giá trị mới nếu backend không trả về
      const savedAllowance = updatedAllowance; // Lưu giá trị mới trước khi reload
      
      setTimeout(async () => {
        await loadData();
        
        // Sau khi reload, kiểm tra và merge giá trị mới nếu backend không trả về
        setTimeout(() => {
          setWelfareHistory(prev => prev.map(h => {
            // Nếu là record vừa update và allowance bị reset về giá trị cũ
            if (h.id === editingWelfareHistory.id && h.allowance !== savedAllowance) {
              console.warn('⚠️ Allowance was reset after reload. Backend may not support updating allowanceAmount. Keeping new value in state:', {
                employeeId: h.employeeId,
                benefitId: h.benefitId,
                oldAllowance: h.allowance,
                newAllowance: savedAllowance,
                note: 'Backend API PUT /api/employee-benefits/employee/{employeeId}/benefit/{benefitId} may not support allowanceAmount field. Frontend keeping new value in state.'
              });
              // Giữ giá trị mới trong state
              return {
                ...h,
                allowance: savedAllowance,
                amount: savedAllowance
              };
            }
            return h;
          }));
        }, 100);
      }, 1000);
    } catch (error) {
      console.error('Error updating employee benefit:', error);
      toast.error(`Không thể cập nhật phúc lợi nhân viên: ${error.message || 'Vui lòng thử lại'}`);
    }
  };

  const handleCancelEditWelfareHistory = () => {
    setIsEditWelfareHistoryModalOpen(false);
    setEditingWelfareHistory(null);
    setEditWelfareHistoryFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      allowance: '',
      welfareName: '',
      grantDate: '',
      status: 'ACTIVE'
    });
    setSearchParams({});
  };

  const handleDeleteWelfareHistory = async (id) => {
    const history = welfareHistory.find(h => h.id === id);
    if (!history) {
      toast.error('Không tìm thấy phúc lợi nhân viên');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa phúc lợi "${history.welfareName || history.benefitName}" của nhân viên "${history.employeeName}"?\n\n⚠️ Lưu ý: Hành động này không thể hoàn tác.`)) {
      try {
        const employeeId = history.employeeId;
        const benefitId = history.benefitId;

        if (!employeeId || !benefitId) {
          toast.error('Thiếu thông tin employeeId hoặc benefitId');
          return;
        }

        console.log('🗑️ Deleting employee benefit:', {
          employeeId,
          benefitId
        });

        // Gọi API xóa phúc lợi nhân viên
        // DELETE /api/employee-benefits/employee/{employeeId}/benefit/{benefitId}
        await deleteEmployeeBenefit(employeeId, benefitId);

        // Xóa khỏi state
        setWelfareHistory(prev => prev.filter(h => h.id !== id));
        toast.success('Đã xóa phúc lợi nhân viên thành công');
        
        // Reload data để sync với server
        setTimeout(async () => {
          await loadData();
        }, 500);
      } catch (error) {
        console.error('Error deleting employee benefit:', error);
        toast.error(`Không thể xóa phúc lợi nhân viên: ${error.message || 'Vui lòng thử lại'}`);
      }
    }
  };

  const handleEditInsuranceHistory = (id) => {
    // Navigate with search params to update URL
    setSearchParams({ edit: 'insuranceHistory', id: String(id) });
  };

  const handleSaveEditInsuranceHistory = async () => {
    if (!editingInsuranceHistory) return;

    // Validate
    if (!editInsuranceHistoryFormData.employeeId || !editInsuranceHistoryFormData.employeeId.trim()) {
      toast.error('Vui lòng nhập mã nhân viên');
      return;
    }
    if (!editInsuranceHistoryFormData.insuranceName || !editInsuranceHistoryFormData.insuranceName.trim()) {
      toast.error('Vui lòng chọn tên bảo hiểm');
      return;
    }
    if (!editInsuranceHistoryFormData.grantDate || !editInsuranceHistoryFormData.grantDate.trim()) {
      toast.error('Vui lòng nhập ngày cấp');
      return;
    }

    try {
      // Tìm contractId từ insuranceName
      const selectedInsurance = insurancePolicies.find(ins => ins.name === editInsuranceHistoryFormData.insuranceName);
      if (!selectedInsurance) {
        toast.error('Không tìm thấy bảo hiểm được chọn');
        return;
      }

      const employeeId = editInsuranceHistoryFormData.employeeId.trim();
      const contractId = selectedInsurance.id || selectedInsurance.contractId || editingInsuranceHistory.contractId;
      
      if (!contractId) {
        toast.error('Không tìm thấy contractId');
        return;
      }

      // Format date về yyyy-MM-dd
      const formatDateToYYYYMMDD = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Gọi API cập nhật bảo hiểm nhân viên
      // PUT /api/employee-insurance-contracts/employee/{employeeId}/contract/{contractId}
      const updateData = {
        contractId: contractId,
        effective: formatDateToYYYYMMDD(editInsuranceHistoryFormData.grantDate), // effective = grantDate
        expiry: formatDateToYYYYMMDD(editInsuranceHistoryFormData.expiry || editInsuranceHistoryFormData.grantDate), // Nếu không có expiry, dùng grantDate
        grantDate: formatDateToYYYYMMDD(editInsuranceHistoryFormData.grantDate)
      };

      console.log('📤 Updating employee insurance:', {
        employeeId,
        contractId,
        updateData
      });

      await updateEmployeeInsurance(employeeId, contractId, updateData);

      // Cập nhật state
      setInsuranceHistory(prev => prev.map(h =>
        h.id === editingInsuranceHistory.id
          ? { 
              ...h, 
              ...editInsuranceHistoryFormData,
              contractId: contractId,
              insuranceName: editInsuranceHistoryFormData.insuranceName
            }
          : h
      ));

      toast.success('Đã cập nhật bảo hiểm nhân viên thành công');
      setIsEditInsuranceHistoryModalOpen(false);
      setEditingInsuranceHistory(null);
      setSearchParams({});
      
      // Reload data để sync với server
      setTimeout(async () => {
        await loadData();
      }, 500);
    } catch (error) {
      console.error('Error updating employee insurance:', error);
      toast.error(`Không thể cập nhật bảo hiểm nhân viên: ${error.message || 'Vui lòng thử lại'}`);
    }
  };

  const handleCancelEditInsuranceHistory = () => {
    setIsEditInsuranceHistoryModalOpen(false);
    setEditingInsuranceHistory(null);
    setEditInsuranceHistoryFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      insuranceName: '',
      employerRate: '',
      employeeRate: '',
      grantDate: '',
      status: 'ACTIVE'
    });
    setSearchParams({});
  };

  const handleDeleteInsuranceHistory = async (id) => {
    const history = insuranceHistory.find(h => h.id === id);
    if (!history) {
      toast.error('Không tìm thấy bảo hiểm nhân viên');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa bảo hiểm "${history.insuranceName}" của nhân viên "${history.employeeName}"?\n\n⚠️ Lưu ý: Hành động này không thể hoàn tác.`)) {
      try {
        const employeeId = history.employeeId;
        const contractId = history.contractId;

        if (!employeeId || !contractId) {
          toast.error('Thiếu thông tin employeeId hoặc contractId');
          return;
        }

        console.log('🗑️ Deleting employee insurance:', {
          employeeId,
          contractId
        });

        // Gọi API xóa bảo hiểm nhân viên
        // DELETE /api/employee-insurance-contracts/employee/{employeeId}/contract/{contractId}
        await deleteEmployeeInsurance(employeeId, contractId);

        // Xóa khỏi state
        setInsuranceHistory(prev => prev.filter(h => h.id !== id));
        toast.success('Đã xóa bảo hiểm nhân viên thành công');
        
        // Reload data để sync với server
        setTimeout(async () => {
          await loadData();
        }, 500);
      } catch (error) {
        console.error('Error deleting employee insurance:', error);
        toast.error(`Không thể xóa bảo hiểm nhân viên: ${error.message || 'Vui lòng thử lại'}`);
      }
    }
  };

  const handleSaveAddWelfare = async () => {
    // Validate
    if (!addWelfareFormData.name || !addWelfareFormData.name.trim()) {
      toast.error('Vui lòng nhập tên phúc lợi');
      return;
    }
    if (!addWelfareFormData.monthlyValue || addWelfareFormData.monthlyValue <= 0) {
      toast.error('Vui lòng nhập trợ cấp hàng tháng hợp lệ');
      return;
    }
    if (!addWelfareFormData.owner || !addWelfareFormData.owner.trim()) {
      toast.error('Vui lòng nhập phòng ban');
      return;
    }

    try {
      // Theo API doc: POST /api/benefits/create cần CreateBenefitRequestDTO
      // Request body: benefitId, benefitName, description, numberOfEmployees, coverage, allowanceAmount, status
      
      // Chuẩn bị data theo format API yêu cầu
      const createData = {
        benefitId: addWelfareFormData.benefitId || `BENEFIT_${Date.now()}`, // Tạo ID nếu chưa có
        benefitName: addWelfareFormData.name,
        description: addWelfareFormData.description || '',
        numberOfEmployees: 0, // Mới tạo nên chưa có người hưởng
        coverage: addWelfareFormData.coverage || '', // Có thể cần thêm field này
        allowanceAmount: addWelfareFormData.monthlyValue || 0,
        status: normalizeStatus(addWelfareFormData.status || 'ACTIVE') // UPPERCASE
      };
      
      console.log('📤 Creating benefit:', createData);
      
      // Gọi API tạo phúc lợi mới
      // POST /api/benefits/create
      const result = await createBenefit(createData);
      
      console.log('✅ Created benefit response:', result);
      
      // Reload data để lấy benefitId từ backend
      await loadData();

      toast.success(`Đã thêm phúc lợi "${addWelfareFormData.name}"`);
      setIsAddWelfareModalOpen(false);
      setAddWelfareFormData({
        name: '',
        monthlyValue: 0,
        owner: '',
        budget: 0,
        status: 'ACTIVE',
        description: '',
        nextReview: ''
      });
      setSearchParams({});
    } catch (error) {
      toast.error('Không thể thêm phúc lợi');
    }
  };

  const handleCancelAddWelfare = () => {
    setIsAddWelfareModalOpen(false);
    setAddWelfareFormData({
      name: '',
      monthlyValue: 0,
      owner: '',
      budget: 0,
      status: 'ACTIVE',
      description: '',
      nextReview: ''
    });
    setSearchParams({});
  };

  const handleSaveAddInsurance = async () => {
    // Validate
    if (!addInsuranceFormData.name || !addInsuranceFormData.name.trim()) {
      toast.error('Vui lòng nhập tên bảo hiểm');
      return;
    }
    if (!addInsuranceFormData.provider || !addInsuranceFormData.provider.trim()) {
      toast.error('Vui lòng nhập nhà cung cấp');
      return;
    }

    try {
      // TODO: Gọi API thêm bảo hiểm
      // const result = await fakeApi.createInsurancePolicy(addInsuranceFormData);

      // Tạo ID tạm thời
      const newId = `insurance-${Date.now()}`;
      const newInsurance = {
        id: newId,
        ...addInsuranceFormData
      };

      // Thêm vào state
      setInsurancePolicies(prev => [...prev, newInsurance]);

      toast.success(`Đã thêm chính sách bảo hiểm "${addInsuranceFormData.name}"`);
      setIsAddInsuranceModalOpen(false);
      setAddInsuranceFormData({
        name: '',
        provider: '',
        type: 'mandatory',
        employerRate: '',
        employeeRate: '',
        effective: '',
        expiry: '',
        status: 'ACTIVE'
      });
      setSearchParams({});
    } catch (error) {
      toast.error('Không thể thêm chính sách bảo hiểm');
    }
  };

  const handleCancelAddInsurance = () => {
    setIsAddInsuranceModalOpen(false);
    setAddInsuranceFormData({
      name: '',
      provider: '',
      type: 'mandatory',
      employerRate: '',
      employeeRate: '',
      effective: '',
      expiry: '',
      status: 'ACTIVE'
    });
    setSearchParams({});
  };

  const handleAddGrantWelfareRow = () => {
    setGrantedWelfares([...grantedWelfares, {
      employeeId: '',
      employeeName: '',
      department: '',
      allowance: '',
      welfareName: '',
      grantDate: '',
      status: 'ACTIVE'
    }]);
  };

  const handleRemoveGrantWelfareRow = (index) => {
    if (grantedWelfares.length > 1) {
      setGrantedWelfares(grantedWelfares.filter((_, i) => i !== index));
    }
  };

  const handleUpdateGrantWelfare = async (index, field, value) => {
    const updated = [...grantedWelfares];
    updated[index][field] = value;

    // Nếu nhập mã nhân viên, tự động lấy thông tin nhân viên
    if (field === 'employeeId' && value && value.trim()) {
      try {
        const emp = await getEmployeeById(value.trim());
        if (emp) {
          updated[index]['employeeName'] = emp.fullName || emp.name || '';
          updated[index]['department'] = emp.department || '';
        } else {
          // Nếu không tìm thấy, thử tìm trong danh sách employees
          const allEmpRes = await getAllEmployees();
          const empList = Array.isArray(allEmpRes) ? allEmpRes : allEmpRes.data || [];
          const foundEmp = empList.find(e =>
            e.id === value.trim() ||
            e.employeeCode === value.trim() ||
            e.employeeId === value.trim()
          );
          if (foundEmp) {
            updated[index]['employeeName'] = foundEmp.fullName || foundEmp.name || '';
            updated[index]['department'] = foundEmp.department || '';
          }
        }
      } catch (error) {
        console.error('Error loading employee:', error);
      }
    }

    // Nếu chọn tên phúc lợi, tự động điền mức trợ cấp từ phúc lợi đó
    if (field === 'welfareName' && value) {
      const selectedWelfare = welfarePrograms.find(w => w.name === value);
      if (selectedWelfare && selectedWelfare.monthlyValue) {
        updated[index]['allowance'] = selectedWelfare.monthlyValue;
      }
    }

    setGrantedWelfares(updated);
  };

  const handleSaveGrantWelfare = async () => {
    // Validate
    for (let i = 0; i < grantedWelfares.length; i++) {
      const welfare = grantedWelfares[i];
      if (!welfare.employeeId || !welfare.employeeId.trim()) {
        toast.error(`Vui lòng nhập mã nhân viên cho phúc lợi ${i + 1}`);
        return;
      }
      if (!welfare.employeeName || !welfare.employeeName.trim()) {
        toast.error(`Vui lòng nhập tên nhân viên cho phúc lợi ${i + 1}`);
        return;
      }
      if (!welfare.welfareName || !welfare.welfareName.trim()) {
        toast.error(`Vui lòng chọn tên phúc lợi cho phúc lợi ${i + 1}`);
        return;
      }
      if (!welfare.grantDate || !welfare.grantDate.trim()) {
        toast.error(`Vui lòng nhập ngày cấp cho phúc lợi ${i + 1}`);
        return;
      }
    }

    try {
      // TODO: Gọi API cấp phúc lợi
      // const result = await fakeApi.grantWelfares(grantedWelfares);

      // Thêm vào lịch sử phúc lợi
      const newHistoryItems = grantedWelfares.map((w, index) => ({
        id: Date.now() + index,
        employeeId: w.employeeId,
        employeeName: w.employeeName,
        department: w.department,
        allowance: w.allowance || 0,
        welfareName: w.welfareName,
        grantDate: w.grantDate,
        status: w.status
      }));
      setWelfareHistory(prev => [...newHistoryItems, ...prev]);

      toast.success(`Đã cấp ${grantedWelfares.length} phúc lợi thành công`);
      setIsGrantWelfareModalOpen(false);
      setGrantedWelfares([{
        employeeId: '',
        employeeName: '',
        department: '',
        allowance: '',
        welfareName: '',
        grantDate: '',
        status: 'ACTIVE'
      }]);
      setSearchParams({});
    } catch (error) {
      toast.error('Không thể cấp phúc lợi');
    }
  };

  const handleCancelGrantWelfare = () => {
    setIsGrantWelfareModalOpen(false);
    setGrantedWelfares([{
      employeeId: '',
      employeeName: '',
      department: '',
      allowance: '',
      welfareName: '',
      grantDate: '',
      status: 'ACTIVE'
    }]);
    setSearchParams({});
  };

  const handleAddGrantInsuranceRow = () => {
    setGrantedInsurances([...grantedInsurances, {
      employeeId: '',
      employeeName: '',
      department: '',
      insuranceName: '',
      employerRate: '',
      employeeRate: '',
      grantDate: '',
      status: 'ACTIVE'
    }]);
  };

  const handleRemoveGrantInsuranceRow = (index) => {
    if (grantedInsurances.length > 1) {
      setGrantedInsurances(grantedInsurances.filter((_, i) => i !== index));
    }
  };

  const handleUpdateGrantInsurance = async (index, field, value) => {
    const updated = [...grantedInsurances];
    updated[index][field] = value;

    // Nếu nhập mã nhân viên, tự động lấy thông tin nhân viên
    if (field === 'employeeId' && value && value.trim()) {
      try {
        const emp = await getEmployeeById(value.trim());
        if (emp) {
          updated[index]['employeeName'] = emp.fullName || emp.name || '';
          updated[index]['department'] = emp.department || '';
        } else {
          // Nếu không tìm thấy, thử tìm trong danh sách employees
          const allEmpRes = await getAllEmployees();
          const empList = Array.isArray(allEmpRes) ? allEmpRes : allEmpRes.data || [];
          const foundEmp = empList.find(e =>
            e.id === value.trim() ||
            e.employeeCode === value.trim() ||
            e.employeeId === value.trim()
          );
          if (foundEmp) {
            updated[index]['employeeName'] = foundEmp.fullName || foundEmp.name || '';
            updated[index]['department'] = foundEmp.department || '';
          }
        }
      } catch (error) {
        console.error('Error loading employee:', error);
      }
    }

    // Nếu chọn tên bảo hiểm, tự động điền công ty đóng và nhân viên đóng
    if (field === 'insuranceName' && value) {
      const selectedInsurance = insurancePolicies.find(ins => ins.name === value);
      if (selectedInsurance) {
        if (selectedInsurance.employerRate) {
          updated[index]['employerRate'] = selectedInsurance.employerRate;
        }
        if (selectedInsurance.employeeRate) {
          updated[index]['employeeRate'] = selectedInsurance.employeeRate;
        }
      }
    }

    setGrantedInsurances(updated);
  };

  const handleSaveGrantInsurance = async () => {
    // Validate
    for (let i = 0; i < grantedInsurances.length; i++) {
      const insurance = grantedInsurances[i];
      if (!insurance.employeeId || !insurance.employeeId.trim()) {
        toast.error(`Vui lòng nhập mã nhân viên cho bảo hiểm ${i + 1}`);
        return;
      }
      if (!insurance.employeeName || !insurance.employeeName.trim()) {
        toast.error(`Vui lòng nhập tên nhân viên cho bảo hiểm ${i + 1}`);
        return;
      }
      if (!insurance.insuranceName || !insurance.insuranceName.trim()) {
        toast.error(`Vui lòng chọn tên bảo hiểm cho bảo hiểm ${i + 1}`);
        return;
      }
      if (!insurance.grantDate || !insurance.grantDate.trim()) {
        toast.error(`Vui lòng nhập ngày cấp cho bảo hiểm ${i + 1}`);
        return;
      }
    }

    try {
      // TODO: Gọi API cấp bảo hiểm
      // const result = await fakeApi.grantInsurances(grantedInsurances);

      // Thêm vào lịch sử bảo hiểm
      const newHistoryItems = grantedInsurances.map((ins, index) => ({
        id: Date.now() + index,
        employeeId: ins.employeeId,
        employeeName: ins.employeeName,
        department: ins.department,
        insuranceName: ins.insuranceName,
        employerRate: ins.employerRate,
        employeeRate: ins.employeeRate,
        grantDate: ins.grantDate,
        status: ins.status
      }));
      setInsuranceHistory(prev => [...newHistoryItems, ...prev]);

      toast.success(`Đã cấp ${grantedInsurances.length} bảo hiểm thành công`);
      setIsGrantInsuranceModalOpen(false);
      setGrantedInsurances([{
        employeeId: '',
        employeeName: '',
        department: '',
        insuranceName: '',
        employerRate: '',
        employeeRate: '',
        grantDate: '',
        status: 'ACTIVE'
      }]);
      setSearchParams({});

      // TODO: Gọi API lưu vào backend
      // await fakeApi.grantInsurances(grantedInsurances);
    } catch (error) {
      toast.error('Không thể cấp bảo hiểm');
    }
  };

  const handleCancelGrantInsurance = () => {
    setIsGrantInsuranceModalOpen(false);
    setGrantedInsurances([{
      employeeId: '',
      employeeName: '',
      department: '',
      insuranceName: '',
      employerRate: '',
      employeeRate: '',
      grantDate: '',
      status: 'ACTIVE'
    }]);
    setSearchParams({});
  };

  const handleEditInsurance = (id) => {
    // Navigate with search params to update URL
    setSearchParams({ edit: 'insurance', id: String(id) });
  };

  const handleSaveInsuranceEdit = async () => {
    if (!editingInsurance) return;

    // Validate
    if (!editInsuranceFormData.name || !editInsuranceFormData.provider) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      // Parse rates từ string sang number nếu cần
      const parseRate = (rate) => {
        if (typeof rate === 'string') {
          // Xóa ký tự % nếu có
          const cleaned = rate.replace('%', '').trim();
          return parseFloat(cleaned) || 0;
        }
        return rate || 0;
      };

      // Backend yêu cầu TẤT CẢ các field bắt buộc với đúng format
      // Không gửi id - Backend không cần field này trong request body
      const updateData = {
        insurenceName: editInsuranceFormData.name,
        employerRate: parseRate(editInsuranceFormData.employerRate),
        employeeRate: parseRate(editInsuranceFormData.employeeRate),
        provider: editInsuranceFormData.provider || '',
        effective: formatDateToYYYYMMDD(editInsuranceFormData.effective), // Format: yyyy-MM-dd
        expiry: formatDateToYYYYMMDD(editInsuranceFormData.expiry),       // Format: yyyy-MM-dd
        status: normalizeStatus(editInsuranceFormData.status) // UPPERCASE: ACTIVE, INACTIVE, EXPIRED
      };

      console.log('📤 Updating insurance contract:', {
        url: `PUT /api/insurance-contracts/${encodeURIComponent(editingInsurance.name)}`,
        data: updateData
      });
      
      // Gọi API cập nhật bảo hiểm
      await updateInsuranceContract(editingInsurance.name, updateData);

      // Cập nhật state
      setInsurancePolicies(prev => prev.map(p =>
        p.id === editingInsurance.id
          ? { ...p, ...updateData }
          : p
      ));

      toast.success(`Đã cập nhật chính sách bảo hiểm "${editInsuranceFormData.name}"`);
      setIsEditInsuranceModalOpen(false);
      setEditingInsurance(null);
      // Clear URL params
      setSearchParams({});
      
      // Reload data để sync với server
      setTimeout(async () => {
        await loadData();
      }, 500);
    } catch (error) {
      console.error('Error updating insurance:', error);
      toast.error(`Không thể cập nhật chính sách bảo hiểm: ${error.message || 'Vui lòng thử lại'}`);
    }
  };

  // Helper function để format date về yyyy-MM-dd
  const formatDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return '';
    
    // Nếu đã là format yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Nếu là format dd/MM/yyyy hoặc dd-MM-yyyy
    const dateMatch = dateStr.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      return `${year}-${month}-${day}`;
    }
    
    // Thử parse với Date object
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      console.warn('Cannot parse date:', dateStr);
    }
    
    return dateStr; // Trả về nguyên bản nếu không parse được
  };

  const handleDeleteInsurancePolicy = async (id) => {
    const policy = insurancePolicies.find(p => p.id === id);
    if (!policy) {
      toast.error('Không tìm thấy chính sách bảo hiểm');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn XÓA chính sách bảo hiểm "${policy.name}"?\n\n⚠️ CẢNH BÁO: Hành động này sẽ XÓA VĨNH VIỄN chính sách bảo hiểm khỏi hệ thống và không thể hoàn tác!`)) {
      try {
        console.log('🗑️ Deleting insurance contract:', policy.name);
        console.log('📤 Policy ID:', policy.id);

        // Gọi API DELETE để xóa hoàn toàn khỏi database
        await deleteInsuranceContract(policy.name);

        // Xóa khỏi state ngay lập tức
        setInsurancePolicies(prev => prev.filter(p => p.id !== id));

        toast.success(`Đã xóa chính sách bảo hiểm "${policy.name}" thành công`);

        // Reload data sau 500ms để đảm bảo sync với server
        setTimeout(async () => {
          await loadData();
        }, 500);
      } catch (error) {
        console.error('Error deleting insurance policy:', error);
        console.error('Policy data:', policy);
        console.error('Error status:', error.status);
        console.error('Error response:', error.response);
        
        // Error message đã được parse trong service, dùng trực tiếp
        const errorMessage = error.message || 'Vui lòng thử lại';
        
        // Kiểm tra nếu lỗi 409 CONFLICT (có employee đang dùng)
        if (error.status === 409 || errorMessage.includes('nhân viên sử dụng') || errorMessage.includes('CONFLICT')) {
          toast.error(
            errorMessage,
            { autoClose: 8000 }
          );
        } else {
          toast.error(
            `Có lỗi xảy ra khi xóa chính sách bảo hiểm "${policy.name}":\n${errorMessage}`,
            { autoClose: 6000 }
          );
        }
      }
    }
  };

  const handleCancelInsuranceEdit = () => {
    setIsEditInsuranceModalOpen(false);
    setEditingInsurance(null);
    setEditInsuranceFormData({
      name: '',
      provider: '',
      type: 'mandatory',
      employerRate: '',
      employeeRate: '',
      effective: '',
      expiry: '',
      status: 'ACTIVE'
    });
    // Clear URL params
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6 min-h-screen bg-gray-50">

        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-8 rounded-2xl shadow-xl`}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className={`${getSubtitleColor()} text-sm uppercase tracking-wider`}>Quản trị / HR</p>
                {!canApprove && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs">
                    <Eye size={14} />
                    Chế độ xem
                  </span>
                )}
                {canApprove && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded-full text-xs">
                    <CheckCircle size={14} />
                    Quyền duyệt
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mt-1">Quản Lý Phúc Lợi & Bảo Hiểm</h1>
              <p className={`${getSubtitleColor()} mt-3 max-w-3xl text-lg`}>
                {canApprove
                  ? 'Quản lý chế độ phúc lợi, chính sách bảo hiểm và xử lý yêu cầu nhân viên.'
                  : 'Xem thông tin phúc lợi và bảo hiểm. Liên hệ Kế toán để phê duyệt yêu cầu.'}
              </p>
            </div>
            {canApprove && (
              <div className="flex gap-3 items-center flex-wrap lg:justify-end">
                <Button variant="secondary" size="md" className="rounded-full whitespace-nowrap">Xuất báo cáo</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full whitespace-nowrap" onClick={() => setSearchParams({ action: 'addWelfare' })}>Thêm phúc lợi mới</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full bg-blue-600 hover:bg-blue-700 whitespace-nowrap" onClick={() => setSearchParams({ action: 'addInsurance' })}>Thêm bảo hiểm</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full bg-green-600 hover:bg-green-700 whitespace-nowrap" onClick={() => setSearchParams({ action: 'grantWelfare' })}>Cấp phúc lợi</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap" onClick={() => setSearchParams({ action: 'grantInsurance' })}>Cấp bảo hiểm</Button>
              </div>
            )}
          </div>
        </div>

        {/* Thông báo quyền hạn cho Admin */}
        {!canApprove && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Lock className="text-amber-600" size={24} />
            <div>
              <p className="font-bold text-amber-800">Chế độ chỉ xem</p>
              <p className="text-sm text-amber-700">Bạn đang đăng nhập với role Admin. Chỉ Kế toán (Accountant) mới có quyền phê duyệt các yêu cầu phúc lợi & bảo hiểm.</p>
            </div>
          </div>
        )}

        {/* Tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-xl"><Heart className="text-purple-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Phúc lợi đang áp dụng</p>
                <p className="text-3xl font-bold text-gray-900">{welfarePrograms.filter(p => normalizeStatus(p.status) === 'ACTIVE').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl"><Shield className="text-blue-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Loại bảo hiểm</p>
                <p className="text-3xl font-bold text-gray-900">{insurancePolicies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-xl"><Users className="text-green-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Người hưởng phúc lợi</p>
                <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-100 rounded-xl"><Wallet className="text-amber-600" size={28} /></div>
              <div>
                <p className="text-sm text-gray-500">Ngân sách phúc lợi năm</p>
                <p className="text-3xl font-bold text-gray-900">{(totalBudget / 1_000_000).toFixed(0)} triệu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phúc lợi đơn vị */}
        <Card title="Các khoản phúc lợi đơn vị" subtitle="Phụ cấp, hỗ trợ và đặc quyền cho nhân viên" icon={<Heart className="w-6 h-6 text-purple-600" />}>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setWelfareTabActive('programs')}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${welfareTabActive === 'programs'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                Các khoản phúc lợi đơn vị
              </button>
              <button
                onClick={() => setWelfareTabActive('history')}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${welfareTabActive === 'history'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                Phúc lợi nhân viên
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {welfareTabActive === 'programs' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    <th className="px-4 py-3 text-left w-[20%]">Tên phúc lợi</th>
                    <th className="px-4 py-3 text-center w-[15%]">Trợ cấp hàng tháng</th>
                    <th className="px-4 py-3 text-center w-[12%]">Phòng ban</th>
                    <th className="px-4 py-3 text-center w-[12%]">Số người hưởng</th>
                    <th className="px-4 py-3 text-center w-[12%]">Ngân sách năm</th>
                    <th className="px-4 py-3 text-center w-[12%]">Trạng thái</th>
                    <th className="px-4 py-3 text-center w-[17%]">Sửa/Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {welfarePrograms.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-4 text-gray-700 font-medium text-center whitespace-nowrap">
                        {p.monthlyValue ? `${(p.monthlyValue / 1000).toFixed(0)}.000 VNĐ` : '0 VNĐ'}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-center whitespace-nowrap">{p.owner || '-'}</td>
                      <td className="px-4 py-4 text-gray-900 font-medium text-center whitespace-nowrap">{p.participants || 0}</td>
                      <td className="px-4 py-4 text-gray-900 text-center whitespace-nowrap">{(p.budget / 1_000_000).toFixed(0)} triệu</td>
                      <td className="px-4 py-4 text-center">
                        {(() => {
                          const statusDisplay = getStatusDisplay(p.status);
                          return (
                            <span className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${statusDisplay.className}`}>
                              {statusDisplay.label}
                        </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🔍 Edit button clicked for welfare id:', p.id);
                              handleEditWelfare(p.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa phúc lợi"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🔍 Delete button clicked for welfare id:', p.id);
                              handleDeleteWelfare(p.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa phúc lợi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    <th className="px-4 py-3 text-left w-[10%]">Mã nhân viên</th>
                    <th className="px-4 py-3 text-left w-[15%]">Tên nhân viên</th>
                    <th className="px-4 py-3 text-left w-[12%]">Phòng ban</th>
                    <th className="px-4 py-3 text-center w-[12%]">Mức trợ cấp</th>
                    <th className="px-4 py-3 text-left w-[18%]">Tên phúc lợi</th>
                    <th className="px-4 py-3 text-center w-[12%]">Ngày cấp</th>
                    <th className="px-4 py-3 text-center w-[12%]">Trạng thái</th>
                    <th className="px-4 py-3 text-center w-[9%]">Sửa/Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    // Nhóm phúc lợi theo employeeId
                    const groupedByEmployee = welfareHistory.reduce((acc, h) => {
                      if (!acc[h.employeeId]) {
                        acc[h.employeeId] = [];
                      }
                      acc[h.employeeId].push(h);
                      return acc;
                    }, {});

                    // Chỉ lấy dòng đầu tiên của mỗi employeeId để hiển thị
                    const firstRows = [];
                    Object.keys(groupedByEmployee).forEach(empId => {
                      const welfares = groupedByEmployee[empId];
                      const hasMultiple = welfares.length > 1;
                      const firstWelfare = welfares[0];

                      firstRows.push({
                        ...firstWelfare,
                        hasMultiple,
                        totalCount: welfares.length,
                        allWelfares: welfares
                      });
                    });

                    return firstRows.map((h) => {
                      const isExpanded = expandedEmployees.has(h.employeeId);
                      const showExpandButton = h.hasMultiple;

                      return (
                        <React.Fragment key={h.id}>
                          {/* Dòng đầu tiên của mỗi employeeId */}
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{h.employeeId}</td>
                            <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{h.employeeName}</td>
                            <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{h.department}</td>
                            <td className="px-4 py-4 text-gray-700 font-medium text-center whitespace-nowrap">
                              {h.allowance ? `${Number(h.allowance).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                            </td>
                            <td className="px-4 py-4 text-gray-900">
                              <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap">{h.welfareName || h.benefitName || 'N/A'}</span>
                                {showExpandButton && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newExpanded = new Set(expandedEmployees);
                                      if (isExpanded) {
                                        newExpanded.delete(h.employeeId);
                                      } else {
                                        newExpanded.add(h.employeeId);
                                      }
                                      setExpandedEmployees(newExpanded);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
                                    title={`Xem tất cả ${h.totalCount} phúc lợi của nhân viên này`}
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="w-3 h-3" />
                                        <span>Ẩn ({h.totalCount})</span>
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-3 h-3" />
                                        <span>Ấn ({h.totalCount})</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-600 text-center whitespace-nowrap">
                              {h.grantDate ? new Date(h.grantDate).toLocaleDateString('vi-VN') : '-'}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {(() => {
                                const statusDisplay = getStatusDisplay(h.status);
                                return (
                                  <span className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${statusDisplay.className}`}>
                                    {statusDisplay.label}
                              </span>
                                );
                              })()}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🔍 Edit button clicked for employee benefit id:', h.id);
                                    handleEditWelfareHistory(h.id);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Sửa phúc lợi nhân viên"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteWelfareHistory(h.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa phúc lợi nhân viên"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {/* Hiển thị các phúc lợi khác khi expand */}
                          {isExpanded && h.allWelfares.slice(1).map((otherWelfare) => (
                            <tr key={otherWelfare.id} className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                              <td className="px-4 py-4 font-medium text-gray-500 pl-8">
                                <span className="text-xs text-gray-400">└─</span>
                              </td>
                              <td className="px-4 py-4 text-gray-500"></td>
                              <td className="px-4 py-4 text-gray-500"></td>
                              <td className="px-4 py-4 text-gray-700 font-medium text-center whitespace-nowrap">
                                {otherWelfare.allowance ? `${Number(otherWelfare.allowance).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                              </td>
                              <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{otherWelfare.welfareName || otherWelfare.benefitName || 'N/A'}</td>
                              <td className="px-4 py-4 text-gray-600 text-center whitespace-nowrap">
                                {otherWelfare.grantDate ? new Date(otherWelfare.grantDate).toLocaleDateString('vi-VN') : '-'}
                              </td>
                              <td className="px-4 py-4 text-center">
                                {(() => {
                                  const statusDisplay = getStatusDisplay(otherWelfare.status);
                                  return (
                                    <span className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${statusDisplay.className}`}>
                                      {statusDisplay.label}
                                </span>
                                  );
                                })()}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('🔍 Edit button clicked for employee benefit id:', otherWelfare.id);
                                      handleEditWelfareHistory(otherWelfare.id);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="Sửa phúc lợi nhân viên"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteWelfareHistory(otherWelfare.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa phúc lợi nhân viên"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Bảo hiểm & Yêu cầu chờ duyệt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chính sách bảo hiểm */}
          <Card title="Chính sách bảo hiểm" subtitle="Bảo hiểm bắt buộc & tự nguyện" icon={<Shield className="w-6 h-6 text-blue-600" />} className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setInsuranceTabActive('policies')}
                  className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${insuranceTabActive === 'policies'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                >
                  Chính sách bảo hiểm
                </button>
                <button
                  onClick={() => setInsuranceTabActive('history')}
                  className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${insuranceTabActive === 'history'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                >
                  Bảo hiểm nhân viên
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {insuranceTabActive === 'policies' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insurancePolicies.map(policy => (
                  <div key={policy.id} className="p-6 border-2 border-gray-300 rounded-xl hover:shadow-xl hover:border-green-600 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 h-full flex flex-col bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-lg text-gray-900 truncate">{policy.name}</h4>
                          <p className="text-sm text-gray-500 truncate">{policy.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <button
                          onClick={() => handleEditInsurance(policy.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa chính sách bảo hiểm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInsurancePolicy(policy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa chính sách bảo hiểm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm flex-grow">
                      <div><p className="text-gray-500">Công ty đóng</p><p className="font-bold text-green-600">{policy.employerRate}</p></div>
                      <div><p className="text-gray-500">Nhân viên đóng</p><p className="font-bold text-orange-600">{policy.employeeRate}</p></div>
                      <div><p className="text-gray-500">Hiệu lực</p><p className="font-medium">{policy.effective}</p></div>
                      <div><p className="text-gray-500">Hết hạn</p><p className="font-medium">{policy.expiry}</p></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {(() => {
                        const statusDisplay = getStatusDisplay(policy.status);
                        return (
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusDisplay.className}`}>
                            {statusDisplay.label}
                      </span>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      <th className="px-4 py-3 whitespace-nowrap">Mã nhân viên</th>
                      <th className="px-4 py-3 whitespace-nowrap">Tên nhân viên</th>
                      <th className="px-4 py-3 whitespace-nowrap">Phòng ban</th>
                      <th className="px-4 py-3 whitespace-nowrap">Tên bảo hiểm</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Công ty đóng</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Nhân viên đóng</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Ngày cấp</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Trạng thái</th>
                      <th className="px-4 py-3 whitespace-nowrap">Sửa/Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      // Nhóm bảo hiểm theo employeeId
                      const groupedByEmployee = insuranceHistory.reduce((acc, h) => {
                        if (!acc[h.employeeId]) {
                          acc[h.employeeId] = [];
                        }
                        acc[h.employeeId].push(h);
                        return acc;
                      }, {});

                      // Chỉ lấy dòng đầu tiên của mỗi employeeId để hiển thị
                      const firstRows = [];
                      Object.keys(groupedByEmployee).forEach(empId => {
                        const insurances = groupedByEmployee[empId];
                        const hasMultiple = insurances.length > 1;
                        const firstInsurance = insurances[0];

                        firstRows.push({
                          ...firstInsurance,
                          hasMultiple,
                          totalCount: insurances.length,
                          allInsurances: insurances
                        });
                      });

                      return firstRows.map((h) => {
                        const isExpanded = expandedInsuranceEmployees.has(h.employeeId);
                        const showExpandButton = h.hasMultiple;

                        return (
                          <React.Fragment key={h.id}>
                            {/* Dòng đầu tiên của mỗi employeeId */}
                            <tr className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 font-medium text-gray-900">{h.employeeId}</td>
                              <td className="py-4 text-gray-900">{h.employeeName}</td>
                              <td className="py-4 text-gray-600">{h.department}</td>
                              <td className="py-4 text-gray-900">
                                <div className="flex items-center gap-2">
                                  <span>{h.insuranceName}</span>
                                  {showExpandButton && (
                                    <button
                                      onClick={() => {
                                        const newExpanded = new Set(expandedInsuranceEmployees);
                                        if (isExpanded) {
                                          newExpanded.delete(h.employeeId);
                                        } else {
                                          newExpanded.add(h.employeeId);
                                        }
                                        setExpandedInsuranceEmployees(newExpanded);
                                      }}
                                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title={`Xem tất cả ${h.totalCount} bảo hiểm của nhân viên này`}
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="w-3 h-3" />
                                          <span>Ẩn ({h.totalCount})</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3 h-3" />
                                          <span>Show ({h.totalCount})</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 text-gray-700 font-medium text-center">{h.employerRate}</td>
                              <td className="py-4 text-gray-700 font-medium text-center">{h.employeeRate}</td>
                              <td className="py-4 text-gray-600 text-center">
                                {h.grantDate ? new Date(h.grantDate).toLocaleDateString('vi-VN') : '-'}
                              </td>
                              <td className="py-4 text-center">
                                {(() => {
                                  const statusDisplay = getStatusDisplay(h.status);
                                  return (
                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusDisplay.className}`}>
                                      {statusDisplay.label}
                                </span>
                                  );
                                })()}
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditInsuranceHistory(h.id)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Sửa bảo hiểm nhân viên"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInsuranceHistory(h.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa bảo hiểm nhân viên"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {/* Hiển thị các bảo hiểm khác khi expand */}
                            {isExpanded && h.allInsurances.slice(1).map((otherInsurance) => (
                              <tr key={otherInsurance.id} className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                                <td className="py-4 font-medium text-gray-500 pl-8">
                                  <span className="text-xs text-gray-400">└─</span>
                                </td>
                                <td className="py-4 text-gray-500"></td>
                                <td className="py-4 text-gray-500"></td>
                                <td className="py-4 text-gray-900">{otherInsurance.insuranceName}</td>
                                <td className="py-4 text-gray-700 font-medium text-center">{otherInsurance.employerRate}</td>
                                <td className="py-4 text-gray-700 font-medium text-center">{otherInsurance.employeeRate}</td>
                                <td className="py-4 text-gray-600 text-center">
                                  {otherInsurance.grantDate ? new Date(otherInsurance.grantDate).toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td className="py-4 text-center">
                                  {(() => {
                                    const statusDisplay = getStatusDisplay(otherInsurance.status);
                                    return (
                                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusDisplay.className}`}>
                                        {statusDisplay.label}
                                  </span>
                                    );
                                  })()}
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditInsuranceHistory(otherInsurance.id)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Sửa bảo hiểm nhân viên"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteInsuranceHistory(otherInsurance.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Xóa bảo hiểm nhân viên"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>


      {/* MODAL CHỈNH SỬA PHÚC LỢI */}
      {isEditModalOpen && editingWelfare && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Chỉnh sửa phúc lợi</h3>
                <p className="text-gray-500 mt-1">Cập nhật thông tin phúc lợi: {editingWelfare.name}</p>
              </div>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Tên phúc lợi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phúc lợi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập tên phúc lợi"
                />
              </div>

              {/* Trợ cấp hàng tháng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trợ cấp hàng tháng (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.monthlyValue === 0 ? '' : editFormData.monthlyValue.toLocaleString('vi-VN')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setEditFormData({ ...editFormData, monthlyValue: value ? Number(value) : 0 });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập số tiền (VD: 770000 hoặc 770.000)"
                />
                {editFormData.monthlyValue > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    = {editFormData.monthlyValue.toLocaleString('vi-VN')} VNĐ/tháng
                  </p>
                )}
              </div>

              {/* Phòng ban */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phòng Ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.owner}
                  onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="VD: Phòng Hành chính"
                />
              </div>

              {/* Ngân sách năm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngân sách năm (VNĐ)
                </label>
                <input
                  type="number"
                  value={editFormData.budget}
                  onChange={(e) => setEditFormData({ ...editFormData, budget: Number(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập ngân sách năm"
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ACTIVE">Đang áp dụng</option>
                  <option value="INACTIVE">Đã hủy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập mô tả phúc lợi"
                />
              </div>

              {/* Ngày xem xét lại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày xem xét lại
                </label>
                <input
                  type="text"
                  value={editFormData.nextReview}
                  onChange={(e) => setEditFormData({ ...editFormData, nextReview: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="VD: 01/12/2024"
                />
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelEdit} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveEdit} className="px-8 bg-purple-600 hover:bg-purple-700">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA BẢO HIỂM */}
      {isEditInsuranceModalOpen && editingInsurance && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Chỉnh sửa chính sách bảo hiểm</h3>
                <p className="text-gray-500 mt-1">Cập nhật thông tin: {editingInsurance.name}</p>
              </div>
              <button onClick={handleCancelInsuranceEdit} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Tên bảo hiểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên bảo hiểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editInsuranceFormData.name}
                  onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên bảo hiểm"
                />
              </div>

              {/* Nhà cung cấp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editInsuranceFormData.provider}
                  onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, provider: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>

              {/* Tỷ lệ đóng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Công ty đóng (%)
                  </label>
                  <input
                    type="text"
                    value={editInsuranceFormData.employerRate}
                    onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, employerRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 17.5%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhân viên đóng (%)
                  </label>
                  <input
                    type="text"
                    value={editInsuranceFormData.employeeRate}
                    onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, employeeRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 8%"
                  />
                </div>
              </div>

              {/* Ngày hiệu lực */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hiệu lực
                  </label>
                  <input
                    type="text"
                    value={editInsuranceFormData.effective}
                    onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, effective: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 01/01/2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="text"
                    value={editInsuranceFormData.expiry}
                    onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, expiry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 31/12/2024"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={editInsuranceFormData.status}
                  onChange={(e) => setEditInsuranceFormData({ ...editInsuranceFormData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Đang áp dụng</option>
                  <option value="INACTIVE">Đã hủy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelInsuranceEdit} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveInsuranceEdit} className="px-8 bg-blue-600 hover:bg-blue-700">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM PHÚC LỢI MỚI */}
      {isAddWelfareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Thêm phúc lợi mới</h3>
                <p className="text-gray-500 mt-1">Tạo phúc lợi mới cho nhân viên</p>
              </div>
              <button onClick={handleCancelAddWelfare} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Tên phúc lợi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phúc lợi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addWelfareFormData.name}
                  onChange={(e) => setAddWelfareFormData({ ...addWelfareFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập tên phúc lợi"
                />
              </div>

              {/* Trợ cấp hàng tháng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trợ cấp hàng tháng (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addWelfareFormData.monthlyValue === 0 ? '' : addWelfareFormData.monthlyValue.toLocaleString('vi-VN')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setAddWelfareFormData({ ...addWelfareFormData, monthlyValue: value ? Number(value) : 0 });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập số tiền (VD: 770000 hoặc 770.000)"
                />
                {addWelfareFormData.monthlyValue > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    = {addWelfareFormData.monthlyValue.toLocaleString('vi-VN')} VNĐ/tháng
                  </p>
                )}
              </div>

              {/* Phòng ban */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phòng Ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addWelfareFormData.owner}
                  onChange={(e) => setAddWelfareFormData({ ...addWelfareFormData, owner: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="VD: Phòng Hành chính"
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={addWelfareFormData.status}
                  onChange={(e) => setAddWelfareFormData({ ...addWelfareFormData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ACTIVE">Đang áp dụng</option>
                  <option value="INACTIVE">Đã hủy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={addWelfareFormData.description}
                  onChange={(e) => setAddWelfareFormData({ ...addWelfareFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập mô tả phúc lợi"
                />
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelAddWelfare} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveAddWelfare} className="px-8 bg-purple-600 hover:bg-purple-700">
                  Thêm phúc lợi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM BẢO HIỂM MỚI */}
      {isAddInsuranceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Thêm chính sách bảo hiểm mới</h3>
                <p className="text-gray-500 mt-1">Tạo chính sách bảo hiểm mới cho nhân viên</p>
              </div>
              <button onClick={handleCancelAddInsurance} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Tên bảo hiểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên bảo hiểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addInsuranceFormData.name}
                  onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên bảo hiểm"
                />
              </div>

              {/* Nhà cung cấp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addInsuranceFormData.provider}
                  onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, provider: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>

              {/* Tỷ lệ đóng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Công ty đóng (%)
                  </label>
                  <input
                    type="text"
                    value={addInsuranceFormData.employerRate}
                    onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, employerRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 17.5%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhân viên đóng (%)
                  </label>
                  <input
                    type="text"
                    value={addInsuranceFormData.employeeRate}
                    onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, employeeRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 8%"
                  />
                </div>
              </div>

              {/* Ngày hiệu lực */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hiệu lực
                  </label>
                  <input
                    type="text"
                    value={addInsuranceFormData.effective}
                    onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, effective: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 01/01/2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="text"
                    value={addInsuranceFormData.expiry}
                    onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, expiry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 31/12/2024"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={addInsuranceFormData.status}
                  onChange={(e) => setAddInsuranceFormData({ ...addInsuranceFormData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Đang áp dụng</option>
                  <option value="INACTIVE">Đã hủy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelAddInsurance} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveAddInsurance} className="px-8 bg-blue-600 hover:bg-blue-700">
                  Thêm bảo hiểm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤP PHÚC LỢI */}
      {isGrantWelfareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Cấp phúc lợi</h3>
                <p className="text-gray-500 mt-1">Cấp phúc lợi cho nhân viên - Có thể thêm nhiều phúc lợi cùng lúc</p>
              </div>
              <button onClick={handleCancelGrantWelfare} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {grantedWelfares.map((welfare, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Phúc lợi #{index + 1}</h4>
                    {grantedWelfares.length > 1 && (
                      <button
                        onClick={() => handleRemoveGrantWelfareRow(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Xóa phúc lợi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Mã nhân viên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã nhân viên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={welfare.employeeId}
                        onChange={(e) => handleUpdateGrantWelfare(index, 'employeeId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="VD: emp001"
                      />
                    </div>

                    {/* Tên nhân viên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên nhân viên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={welfare.employeeName}
                        onChange={(e) => handleUpdateGrantWelfare(index, 'employeeName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập tên nhân viên"
                      />
                    </div>

                    {/* Phòng ban */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phòng ban
                      </label>
                      <input
                        type="text"
                        value={welfare.department}
                        onChange={(e) => handleUpdateGrantWelfare(index, 'department', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="VD: Phòng Hành chính"
                      />
                    </div>

                    {/* Tên phúc lợi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên phúc lợi <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={welfare.welfareName}
                        onChange={(e) => handleUpdateGrantWelfare(index, 'welfareName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Chọn phúc lợi</option>
                        {welfarePrograms.map(w => (
                          <option key={w.id} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mức trợ cấp */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mức trợ cấp (VNĐ)
                      </label>
                      <input
                        type="text"
                        value={welfare.allowance === '' || welfare.allowance === 0 ? '' : Number(welfare.allowance).toLocaleString('vi-VN')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleUpdateGrantWelfare(index, 'allowance', value ? Number(value) : '');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Tự động điền khi chọn phúc lợi"
                      />
                      {welfare.allowance > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          = {Number(welfare.allowance).toLocaleString('vi-VN')} VNĐ/tháng
                        </p>
                      )}
                    </div>

                    {/* Ngày cấp */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày cấp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={welfare.grantDate}
                        onChange={(e) => handleUpdateGrantWelfare(index, 'grantDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* Trạng thái */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={welfare.status}
                        onChange={(e) => handleUpdateGrantWelfare(index, 'status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="ACTIVE">Đang áp dụng</option>
                        <option value="INACTIVE">Đã hủy</option>
                        <option value="EXPIRED">Hết hạn</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Nút thêm phúc lợi */}
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Plus className="w-5 h-5" />}
                  onClick={handleAddGrantWelfareRow}
                  className="rounded-full"
                >
                  Thêm phúc lợi khác
                </Button>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelGrantWelfare} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveGrantWelfare} className="px-8 bg-green-600 hover:bg-green-700">
                  Cấp phúc lợi ({grantedWelfares.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤP BẢO HIỂM */}
      {isGrantInsuranceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Cấp chính sách bảo hiểm</h3>
                <p className="text-gray-500 mt-1">Cấp bảo hiểm cho nhân viên - Có thể thêm nhiều bảo hiểm cùng lúc</p>
              </div>
              <button onClick={handleCancelGrantInsurance} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {grantedInsurances.map((insurance, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Bảo hiểm #{index + 1}</h4>
                    {grantedInsurances.length > 1 && (
                      <button
                        onClick={() => handleRemoveGrantInsuranceRow(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Xóa bảo hiểm này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Mã nhân viên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã nhân viên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={insurance.employeeId}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'employeeId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="VD: emp001"
                      />
                    </div>

                    {/* Tên nhân viên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên nhân viên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={insurance.employeeName}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'employeeName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nhập tên nhân viên"
                      />
                    </div>

                    {/* Phòng ban */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phòng ban
                      </label>
                      <input
                        type="text"
                        value={insurance.department}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'department', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="VD: Phòng Hành chính"
                      />
                    </div>

                    {/* Tên bảo hiểm */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên bảo hiểm <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={insurance.insuranceName}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'insuranceName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Chọn bảo hiểm</option>
                        {insurancePolicies.map(ins => (
                          <option key={ins.id} value={ins.name}>{ins.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Công ty đóng */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Công ty đóng (%)
                      </label>
                      <input
                        type="text"
                        value={insurance.employerRate}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'employerRate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tự động điền khi chọn bảo hiểm"
                      />
                    </div>

                    {/* Nhân viên đóng */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhân viên đóng (%)
                      </label>
                      <input
                        type="text"
                        value={insurance.employeeRate}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'employeeRate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tự động điền khi chọn bảo hiểm"
                      />
                    </div>

                    {/* Ngày cấp */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày cấp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={insurance.grantDate}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'grantDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Trạng thái */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={insurance.status}
                        onChange={(e) => handleUpdateGrantInsurance(index, 'status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="ACTIVE">Đang áp dụng</option>
                        <option value="INACTIVE">Đã hủy</option>
                        <option value="EXPIRED">Hết hạn</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Nút thêm bảo hiểm */}
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Plus className="w-5 h-5" />}
                  onClick={handleAddGrantInsuranceRow}
                  className="rounded-full"
                >
                  Thêm bảo hiểm khác
                </Button>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelGrantInsurance} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveGrantInsurance} className="px-8 bg-indigo-600 hover:bg-indigo-700">
                  Cấp bảo hiểm ({grantedInsurances.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SỬA PHÚC LỢI NHÂN VIÊN */}
      {isEditWelfareHistoryModalOpen && editingWelfareHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Sửa phúc lợi nhân viên</h3>
                <p className="text-gray-500 mt-1">Chỉnh sửa thông tin phúc lợi đã cấp</p>
              </div>
              <button onClick={handleCancelEditWelfareHistory} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Mã nhân viên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editWelfareHistoryFormData.employeeId}
                    onChange={(e) => setEditWelfareHistoryFormData({ ...editWelfareHistoryFormData, employeeId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="VD: emp001"
                  />
                </div>

                {/* Tên nhân viên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editWelfareHistoryFormData.employeeName}
                    onChange={(e) => setEditWelfareHistoryFormData({ ...editWelfareHistoryFormData, employeeName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập tên nhân viên"
                  />
                </div>

                {/* Phòng ban */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ban
                  </label>
                  <input
                    type="text"
                    value={editWelfareHistoryFormData.department}
                    onChange={(e) => setEditWelfareHistoryFormData({ ...editWelfareHistoryFormData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="VD: Phòng Hành chính"
                  />
                </div>

                {/* Tên phúc lợi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên phúc lợi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editWelfareHistoryFormData.welfareName}
                    onChange={(e) => {
                      const selectedWelfare = welfarePrograms.find(w => w.name === e.target.value);
                      setEditWelfareHistoryFormData(prev => {
                        const updated = { ...prev, welfareName: e.target.value };
                        if (selectedWelfare && selectedWelfare.monthlyValue) {
                          updated.allowance = selectedWelfare.monthlyValue;
                        }
                        return updated;
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Chọn phúc lợi</option>
                    {welfarePrograms.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>

                {/* Mức trợ cấp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức trợ cấp (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={editWelfareHistoryFormData.allowance === '' || editWelfareHistoryFormData.allowance === 0 ? '' : Number(editWelfareHistoryFormData.allowance).toLocaleString('vi-VN')}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setEditWelfareHistoryFormData({ ...editWelfareHistoryFormData, allowance: value ? Number(value) : '' });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tự động điền khi chọn phúc lợi"
                  />
                  {editWelfareHistoryFormData.allowance > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      = {Number(editWelfareHistoryFormData.allowance).toLocaleString('vi-VN')} VNĐ/tháng
                    </p>
                  )}
                </div>

                {/* Ngày cấp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editWelfareHistoryFormData.grantDate}
                    onChange={(e) => setEditWelfareHistoryFormData({ ...editWelfareHistoryFormData, grantDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={editWelfareHistoryFormData.status}
                    onChange={(e) => setEditWelfareHistoryFormData({ ...editWelfareHistoryFormData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="ACTIVE">Đang áp dụng</option>
                    <option value="INACTIVE">Đã hủy</option>
                    <option value="EXPIRED">Hết hạn</option>
                  </select>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelEditWelfareHistory} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveEditWelfareHistory} className="px-8 bg-green-600 hover:bg-green-700">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SỬA BẢO HIỂM NHÂN VIÊN */}
      {isEditInsuranceHistoryModalOpen && editingInsuranceHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Sửa bảo hiểm nhân viên</h3>
                <p className="text-gray-500 mt-1">Chỉnh sửa thông tin bảo hiểm đã cấp</p>
              </div>
              <button onClick={handleCancelEditInsuranceHistory} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Mã nhân viên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editInsuranceHistoryFormData.employeeId}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, employeeId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: emp001"
                  />
                </div>

                {/* Tên nhân viên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editInsuranceHistoryFormData.employeeName}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, employeeName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên nhân viên"
                  />
                </div>

                {/* Phòng ban */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ban
                  </label>
                  <input
                    type="text"
                    value={editInsuranceHistoryFormData.department}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Phòng Hành chính"
                  />
                </div>

                {/* Tên bảo hiểm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên bảo hiểm <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editInsuranceHistoryFormData.insuranceName}
                    onChange={(e) => {
                      const selectedInsurance = insurancePolicies.find(ins => ins.name === e.target.value);
                      setEditInsuranceHistoryFormData(prev => {
                        const updated = { ...prev, insuranceName: e.target.value };
                        if (selectedInsurance) {
                          updated.employerRate = selectedInsurance.employerRate;
                          updated.employeeRate = selectedInsurance.employeeRate;
                        }
                        return updated;
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn bảo hiểm</option>
                    {insurancePolicies.map(ins => (
                      <option key={ins.id} value={ins.name}>{ins.name}</option>
                    ))}
                  </select>
                </div>

                {/* Công ty đóng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Công ty đóng
                  </label>
                  <input
                    type="text"
                    value={editInsuranceHistoryFormData.employerRate}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, employerRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tự động điền khi chọn bảo hiểm"
                  />
                </div>

                {/* Nhân viên đóng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhân viên đóng
                  </label>
                  <input
                    type="text"
                    value={editInsuranceHistoryFormData.employeeRate}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, employeeRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tự động điền khi chọn bảo hiểm"
                  />
                </div>

                {/* Ngày cấp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editInsuranceHistoryFormData.grantDate}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, grantDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={editInsuranceHistoryFormData.status}
                    onChange={(e) => setEditInsuranceHistoryFormData({ ...editInsuranceHistoryFormData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Đang áp dụng</option>
                    <option value="INACTIVE">Đã hủy</option>
                    <option value="EXPIRED">Hết hạn</option>
                  </select>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={handleCancelEditInsuranceHistory} className="px-8">
                  Hủy
                </Button>
                <Button size="lg" onClick={handleSaveEditInsuranceHistory} className="px-8 bg-blue-600 hover:bg-blue-700">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBenefits;
