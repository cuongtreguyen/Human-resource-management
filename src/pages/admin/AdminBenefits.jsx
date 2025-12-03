import React, { useState, useEffect } from 'react';
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
import fakeApi from '../../services/fakeApi';
import { getRole } from '../../utils/auth';

const AdminBenefits = () => {
  const userRole = getRole();
  const canApprove = userRole === 'accountant'; // Chỉ accountant được duyệt

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
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
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
    status: 'active'
  });
  const [isGrantWelfareModalOpen, setIsGrantWelfareModalOpen] = useState(false);
  const [grantedWelfares, setGrantedWelfares] = useState([{
    employeeId: '',
    employeeName: '',
    department: '',
    allowance: '',
    welfareName: '',
    grantDate: '',
    status: 'active'
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
    status: 'active'
  }]);
  const [addWelfareFormData, setAddWelfareFormData] = useState({
    name: '',
    monthlyValue: 0,
    owner: '',
    budget: 0,
    status: 'active',
    description: '',
    nextReview: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    monthlyValue: 0,
    owner: '',
    budget: 0,
    status: 'active',
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
    status: 'active'
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
    status: 'active'
  });
  const [editInsuranceFormData, setEditInsuranceFormData] = useState({
    name: '',
    provider: '',
    type: 'mandatory',
    employerRate: '',
    employeeRate: '',
    effective: '',
    expiry: '',
    status: 'active'
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [welfareRes, insuranceRes, requestsRes, welfareHistoryRes, insuranceHistoryRes] = await Promise.all([
        fakeApi.getWelfarePrograms(),
        fakeApi.getInsurancePolicies(),
        fakeApi.getBenefitRequests(),
        fakeApi.getWelfareHistory(),
        fakeApi.getInsuranceHistory()
      ]);

      if (welfareRes.success) setWelfarePrograms(welfareRes.data);
      if (insuranceRes.success) setInsurancePolicies(insuranceRes.data);
      if (requestsRes.success) setRequests(requestsRes.data);
      if (welfareHistoryRes.success) setWelfareHistory(welfareHistoryRes.data);
      if (insuranceHistoryRes.success) setInsuranceHistory(insuranceHistoryRes.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = welfarePrograms.reduce((sum, p) => sum + p.budget, 0);
  const totalParticipants = welfarePrograms.reduce((sum, p) => sum + p.participants, 0);

  const openDetail = async (req) => {
    setSelectedRequest(req);
    // Load employee insurance detail
    const insRes = await fakeApi.getEmployeeInsuranceDetail(req.employeeId);
    if (insRes.success) {
      setEmployeeInsurance(insRes.data);
    }
    setIsModalOpen(true);
  };

  const approveRequest = async (id) => {
    if (!canApprove) {
      toast.error('Bạn không có quyền phê duyệt yêu cầu này!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn PHÊ DUYỆT yêu cầu này?')) {
      const result = await fakeApi.approveBenefitRequest(id, 'Kế Toán Viên');
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.success(result.message);
        setIsModalOpen(false);
      }
    }
  };

  const rejectRequest = async (id) => {
    if (!canApprove) {
      toast.error('Bạn không có quyền từ chối yêu cầu này!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn TỪ CHỐI yêu cầu này?')) {
      const result = await fakeApi.rejectBenefitRequest(id, 'Kế Toán Viên', 'Không đủ điều kiện');
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.error(result.message);
        setIsModalOpen(false);
      }
    }
  };

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
    const welfare = welfarePrograms.find(p => p.id === id);
    if (welfare) {
      setEditingWelfare(welfare);
      setEditFormData({
        name: welfare.name || '',
        monthlyValue: welfare.monthlyValue || 0,
        owner: welfare.owner || '',
        budget: welfare.budget || 0,
        status: welfare.status || 'active',
        description: welfare.description || '',
        nextReview: welfare.nextReview || ''
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingWelfare) return;

    // Validate
    if (!editFormData.name || !editFormData.monthlyValue || !editFormData.owner) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      // TODO: Gọi API cập nhật phúc lợi
      // const result = await fakeApi.updateWelfareProgram(editingWelfare.id, editFormData);
      
      // Cập nhật state
      setWelfarePrograms(prev => prev.map(p => 
        p.id === editingWelfare.id 
          ? { ...p, ...editFormData }
          : p
      ));
      
      toast.success(`Đã cập nhật phúc lợi "${editFormData.name}"`);
      setIsEditModalOpen(false);
      setEditingWelfare(null);
    } catch (error) {
      toast.error('Không thể cập nhật phúc lợi');
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
      status: 'active',
      description: '',
      nextReview: ''
    });
  };

  const handleDeleteWelfare = (id) => {
    const welfare = welfarePrograms.find(p => p.id === id);
    if (welfare) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa phúc lợi "${welfare.name}"?\n\nLưu ý: Hành động này không thể hoàn tác.`)) {
        // TODO: Gọi API xóa phúc lợi
        setWelfarePrograms(prev => prev.filter(p => p.id !== id));
        toast.success(`Đã xóa phúc lợi "${welfare.name}"`);
      }
    }
  };

  const handleEditWelfareHistory = (id) => {
    const history = welfareHistory.find(h => h.id === id);
    if (history) {
      setEditingWelfareHistory(history);
      setEditWelfareHistoryFormData({
        employeeId: history.employeeId || '',
        employeeName: history.employeeName || '',
        department: history.department || '',
        allowance: history.allowance || '',
        welfareName: history.welfareName || '',
        grantDate: history.grantDate || '',
        status: history.status || 'active'
      });
      setIsEditWelfareHistoryModalOpen(true);
    }
  };

  const handleSaveEditWelfareHistory = async () => {
    if (!editingWelfareHistory) return;

    // Validate
    if (!editWelfareHistoryFormData.employeeId || !editWelfareHistoryFormData.employeeId.trim()) {
      toast.error('Vui lòng nhập mã nhân viên');
      return;
    }
    if (!editWelfareHistoryFormData.employeeName || !editWelfareHistoryFormData.employeeName.trim()) {
      toast.error('Vui lòng nhập tên nhân viên');
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
      // TODO: Gọi API cập nhật lịch sử phúc lợi
      // const result = await fakeApi.updateWelfareHistory(editingWelfareHistory.id, editWelfareHistoryFormData);
      
      // Cập nhật state
      setWelfareHistory(prev => prev.map(h => 
        h.id === editingWelfareHistory.id 
          ? { ...h, ...editWelfareHistoryFormData }
          : h
      ));
      
      toast.success('Đã cập nhật phúc lợi nhân viên thành công');
      setIsEditWelfareHistoryModalOpen(false);
      setEditingWelfareHistory(null);
    } catch (error) {
      toast.error('Không thể cập nhật phúc lợi nhân viên');
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
      status: 'active'
    });
  };

  const handleDeleteWelfareHistory = (id) => {
    const history = welfareHistory.find(h => h.id === id);
    if (history) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa phúc lợi nhân viên "${history.employeeName}"?\n\nLưu ý: Hành động này không thể hoàn tác.`)) {
        // TODO: Gọi API xóa phúc lợi nhân viên
        // await fakeApi.deleteWelfareHistory(id);
        setWelfareHistory(prev => prev.filter(h => h.id !== id));
        toast.success('Đã xóa phúc lợi nhân viên');
      }
    }
  };

  const handleEditInsuranceHistory = (id) => {
    const history = insuranceHistory.find(h => h.id === id);
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
        status: history.status || 'active'
      });
      setIsEditInsuranceHistoryModalOpen(true);
    }
  };

  const handleSaveEditInsuranceHistory = async () => {
    if (!editingInsuranceHistory) return;

    // Validate
    if (!editInsuranceHistoryFormData.employeeId || !editInsuranceHistoryFormData.employeeId.trim()) {
      toast.error('Vui lòng nhập mã nhân viên');
      return;
    }
    if (!editInsuranceHistoryFormData.employeeName || !editInsuranceHistoryFormData.employeeName.trim()) {
      toast.error('Vui lòng nhập tên nhân viên');
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
      // TODO: Gọi API cập nhật bảo hiểm nhân viên
      // const result = await fakeApi.updateInsuranceHistory(editingInsuranceHistory.id, editInsuranceHistoryFormData);
      
      // Cập nhật state
      setInsuranceHistory(prev => prev.map(h => 
        h.id === editingInsuranceHistory.id 
          ? { ...h, ...editInsuranceHistoryFormData }
          : h
      ));
      
      toast.success('Đã cập nhật bảo hiểm nhân viên thành công');
      setIsEditInsuranceHistoryModalOpen(false);
      setEditingInsuranceHistory(null);
    } catch (error) {
      toast.error('Không thể cập nhật bảo hiểm nhân viên');
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
      status: 'active'
    });
  };

  const handleDeleteInsuranceHistory = (id) => {
    const history = insuranceHistory.find(h => h.id === id);
    if (history) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa bảo hiểm nhân viên "${history.employeeName}"?\n\nLưu ý: Hành động này không thể hoàn tác.`)) {
        // TODO: Gọi API xóa bảo hiểm nhân viên
        // await fakeApi.deleteInsuranceHistory(id);
        setInsuranceHistory(prev => prev.filter(h => h.id !== id));
        toast.success('Đã xóa bảo hiểm nhân viên');
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
      toast.error('Vui lòng nhập người phụ trách');
      return;
    }

    try {
      // TODO: Gọi API thêm phúc lợi
      // const result = await fakeApi.createWelfareProgram(addWelfareFormData);
      
      // Tạo ID tạm thời
      const newId = `welfare-${Date.now()}`;
      const newWelfare = {
        id: newId,
        ...addWelfareFormData,
        participants: 0
      };
      
      // Thêm vào state
      setWelfarePrograms(prev => [...prev, newWelfare]);
      
      toast.success(`Đã thêm phúc lợi "${addWelfareFormData.name}"`);
      setIsAddWelfareModalOpen(false);
      setAddWelfareFormData({
        name: '',
        monthlyValue: 0,
        owner: '',
        budget: 0,
        status: 'active',
        description: '',
        nextReview: ''
      });
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
      status: 'active',
      description: '',
      nextReview: ''
    });
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
        status: 'active'
      });
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
      status: 'active'
    });
  };

  const handleAddGrantWelfareRow = () => {
    setGrantedWelfares([...grantedWelfares, {
      employeeId: '',
      employeeName: '',
      department: '',
      allowance: '',
      welfareName: '',
      grantDate: '',
      status: 'active'
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
        const empRes = await fakeApi.getEmployeeById(value.trim());
        if (empRes.success && empRes.data) {
          const emp = empRes.data;
          updated[index]['employeeName'] = emp.fullName || emp.name || '';
          updated[index]['department'] = emp.department || '';
        } else {
          // Nếu không tìm thấy, thử tìm trong danh sách employees
          const allEmpRes = await fakeApi.getEmployees();
          if (allEmpRes.success) {
            const foundEmp = allEmpRes.data.find(e => 
              e.id === value.trim() || 
              e.employeeCode === value.trim() ||
              e.employeeId === value.trim()
            );
            if (foundEmp) {
              updated[index]['employeeName'] = foundEmp.fullName || foundEmp.name || '';
              updated[index]['department'] = foundEmp.department || '';
            }
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
        status: 'active'
      }]);
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
      status: 'active'
    }]);
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
      status: 'active'
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
        const empRes = await fakeApi.getEmployeeById(value.trim());
        if (empRes.success && empRes.data) {
          const emp = empRes.data;
          updated[index]['employeeName'] = emp.fullName || emp.name || '';
          updated[index]['department'] = emp.department || '';
        } else {
          // Nếu không tìm thấy, thử tìm trong danh sách employees
          const allEmpRes = await fakeApi.getEmployees();
          if (allEmpRes.success) {
            const foundEmp = allEmpRes.data.find(e => 
              e.id === value.trim() || 
              e.employeeCode === value.trim() ||
              e.employeeId === value.trim()
            );
            if (foundEmp) {
              updated[index]['employeeName'] = foundEmp.fullName || foundEmp.name || '';
              updated[index]['department'] = foundEmp.department || '';
            }
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
        status: 'active'
      }]);
      
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
      status: 'active'
    }]);
  };

  const handleEditInsurance = (id) => {
    const insurance = insurancePolicies.find(p => p.id === id);
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
        status: insurance.status || 'active'
      });
      setIsEditInsuranceModalOpen(true);
    }
  };

  const handleSaveInsuranceEdit = async () => {
    if (!editingInsurance) return;

    // Validate
    if (!editInsuranceFormData.name || !editInsuranceFormData.provider) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      // Cập nhật state
      setInsurancePolicies(prev => prev.map(p => 
        p.id === editingInsurance.id 
          ? { ...p, ...editInsuranceFormData }
          : p
      ));
      
      toast.success(`Đã cập nhật chính sách bảo hiểm "${editInsuranceFormData.name}"`);
      setIsEditInsuranceModalOpen(false);
      setEditingInsurance(null);
    } catch (error) {
      toast.error('Không thể cập nhật chính sách bảo hiểm');
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
      status: 'active'
    });
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
              <div className="flex gap-3 items-center flex-nowrap">
                <Button variant="secondary" size="md" className="rounded-full whitespace-nowrap">Xuất báo cáo</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full whitespace-nowrap" onClick={() => setIsAddWelfareModalOpen(true)}>Thêm phúc lợi mới</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full bg-blue-600 hover:bg-blue-700 whitespace-nowrap" onClick={() => setIsAddInsuranceModalOpen(true)}>Thêm bảo hiểm</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full bg-green-600 hover:bg-green-700 whitespace-nowrap" onClick={() => setIsGrantWelfareModalOpen(true)}>Cấp phúc lợi</Button>
                <Button size="md" icon={<Plus className="w-5 h-5" />} className="rounded-full bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap" onClick={() => setIsGrantInsuranceModalOpen(true)}>Cấp bảo hiểm</Button>
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
                <p className="text-3xl font-bold text-gray-900">{welfarePrograms.filter(p => p.status === 'active').length}</p>
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
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  welfareTabActive === 'programs'
                    ? 'text-purple-600 border-purple-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Các khoản phúc lợi đơn vị
              </button>
              <button
                onClick={() => setWelfareTabActive('history')}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  welfareTabActive === 'history'
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
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    <th className="pb-3">Tên phúc lợi</th>
                    <th className="pb-3 text-center">Trợ cấp hàng tháng</th>
                    <th className="pb-3 text-center">Người phụ trách</th>
                    <th className="pb-3 text-center">Số người hưởng</th>
                    <th className="pb-3 text-center">Ngân sách năm</th>
                    <th className="pb-3 text-center">Trạng thái</th>
                    <th className="pb-3">Sửa/Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {welfarePrograms.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="py-4 text-gray-700 font-medium text-center">
                        {p.monthlyValue ? `${(p.monthlyValue / 1000).toFixed(0)}.000 VNĐ` : '0 VNĐ'}
                      </td>
                      <td className="py-4 text-gray-600 text-center">{p.owner}</td>
                      <td className="py-4 text-gray-900 font-medium text-center">{p.participants}</td>
                      <td className="py-4 text-gray-900 text-center">{(p.budget / 1_000_000).toFixed(0)} triệu</td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          p.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : p.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status === 'active' 
                            ? 'Đang áp dụng' 
                            : p.status === 'suspended'
                            ? 'Tạm ngưng'
                            : 'Đã hủy'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditWelfare(p.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa phúc lợi"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWelfare(p.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    <th className="pb-3">Mã nhân viên</th>
                    <th className="pb-3">Tên nhân viên</th>
                    <th className="pb-3">Phòng ban</th>
                    <th className="pb-3 text-center">Mức trợ cấp</th>
                    <th className="pb-3">Tên phúc lợi</th>
                    <th className="pb-3 text-center">Ngày cấp</th>
                    <th className="pb-3 text-center">Trạng thái</th>
                    <th className="pb-3">Sửa/Xóa</th>
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
                            <td className="py-4 font-medium text-gray-900">{h.employeeId}</td>
                            <td className="py-4 text-gray-900">{h.employeeName}</td>
                            <td className="py-4 text-gray-600">{h.department}</td>
                            <td className="py-4 text-gray-700 font-medium text-center">
                              {h.allowance ? `${Number(h.allowance).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                            </td>
                            <td className="py-4 text-gray-900">
                              <div className="flex items-center gap-2">
                                <span>{h.welfareName}</span>
                                {showExpandButton && (
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedEmployees);
                                      if (isExpanded) {
                                        newExpanded.delete(h.employeeId);
                                      } else {
                                        newExpanded.add(h.employeeId);
                                      }
                                      setExpandedEmployees(newExpanded);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                                        <span>Show ({h.totalCount})</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-4 text-gray-600 text-center">
                              {h.grantDate ? new Date(h.grantDate).toLocaleDateString('vi-VN') : '-'}
                            </td>
                            <td className="py-4 text-center">
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                h.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : h.status === 'suspended'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {h.status === 'active' 
                                  ? 'Đang áp dụng' 
                                  : h.status === 'suspended'
                                  ? 'Tạm ngưng'
                                  : 'Đã hủy'}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditWelfareHistory(h.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                              <td className="py-4 font-medium text-gray-500 pl-8">
                                <span className="text-xs text-gray-400">└─</span>
                              </td>
                              <td className="py-4 text-gray-500"></td>
                              <td className="py-4 text-gray-500"></td>
                              <td className="py-4 text-gray-700 font-medium text-center">
                                {otherWelfare.allowance ? `${Number(otherWelfare.allowance).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                              </td>
                              <td className="py-4 text-gray-900">{otherWelfare.welfareName}</td>
                              <td className="py-4 text-gray-600 text-center">
                                {otherWelfare.grantDate ? new Date(otherWelfare.grantDate).toLocaleDateString('vi-VN') : '-'}
                              </td>
                              <td className="py-4 text-center">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  otherWelfare.status === 'active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : otherWelfare.status === 'suspended'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {otherWelfare.status === 'active' 
                                    ? 'Đang áp dụng' 
                                    : otherWelfare.status === 'suspended'
                                    ? 'Tạm ngưng'
                                    : 'Đã hủy'}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditWelfareHistory(otherWelfare.id)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                    insuranceTabActive === 'policies'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Chính sách bảo hiểm
                </button>
                <button
                  onClick={() => setInsuranceTabActive('history')}
                  className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                    insuranceTabActive === 'history'
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
                    <button
                      onClick={() => handleEditInsurance(policy.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                      title="Sửa chính sách bảo hiểm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm flex-grow">
                    <div><p className="text-gray-500">Công ty đóng</p><p className="font-bold text-green-600">{policy.employerRate}</p></div>
                    <div><p className="text-gray-500">Nhân viên đóng</p><p className="font-bold text-orange-600">{policy.employeeRate}</p></div>
                    <div><p className="text-gray-500">Hiệu lực</p><p className="font-medium">{policy.effective}</p></div>
                    <div><p className="text-gray-500">Hết hạn</p><p className="font-medium">{policy.expiry}</p></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      policy.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : policy.status === 'suspended'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {policy.status === 'active' 
                        ? 'Đang áp dụng' 
                        : policy.status === 'suspended'
                        ? 'Tạm ngưng'
                        : 'Đã hủy'}
                    </span>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      <th className="pb-3">Mã nhân viên</th>
                      <th className="pb-3">Tên nhân viên</th>
                      <th className="pb-3">Phòng ban</th>
                      <th className="pb-3">Tên bảo hiểm</th>
                      <th className="pb-3 text-center">Công ty đóng</th>
                      <th className="pb-3 text-center">Nhân viên đóng</th>
                      <th className="pb-3 text-center">Ngày cấp</th>
                      <th className="pb-3 text-center">Trạng thái</th>
                      <th className="pb-3">Sửa/Xóa</th>
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
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  h.status === 'active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : h.status === 'suspended'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {h.status === 'active' 
                                    ? 'Đang áp dụng' 
                                    : h.status === 'suspended'
                                    ? 'Tạm ngưng'
                                    : 'Đã hủy'}
                                </span>
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
                                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                    otherInsurance.status === 'active' 
                                      ? 'bg-green-100 text-green-700' 
                                      : otherInsurance.status === 'suspended'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {otherInsurance.status === 'active' 
                                      ? 'Đang áp dụng' 
                                      : otherInsurance.status === 'suspended'
                                      ? 'Tạm ngưng'
                                      : 'Đã hủy'}
                                  </span>
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

      {/* MODAL CHI TIẾT YÊU CẦU */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Chi tiết yêu cầu #{selectedRequest.id}</h3>
                <p className="text-gray-500 mt-1">Yêu cầu thay đổi phúc lợi & bảo hiểm</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition">
                <XCircle className="w-9 h-9" />
              </button>
            </div>

            <div className="p-8 space-y-10">

              {/* Thông tin nhân viên */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <h4 className="font-bold text-xl text-blue-900 mb-6 flex items-center gap-3">
                  <User className="w-7 h-7" /> Thông tin nhân viên
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div><p className="text-sm text-gray-600">Họ và tên</p><p className="text-2xl font-bold text-gray-900">{selectedRequest.employee}</p></div>
                  <div><p className="text-sm text-gray-600">Phòng ban</p><p className="text-2xl font-bold text-blue-700">{selectedRequest.department}</p></div>
                  <div><p className="text-sm text-gray-600">Mã yêu cầu</p><p className="text-2xl font-mono text-gray-800">{selectedRequest.id}</p></div>
                </div>
              </div>

              {/* Loại yêu cầu */}
              <div className="bg-amber-50 rounded-2xl p-8 border border-amber-300">
                <h4 className="font-bold text-xl text-amber-900 mb-5">Loại yêu cầu</h4>
                <div className="bg-white rounded-xl p-6 border-4 border-amber-400">
                  <p className="text-2xl font-bold text-amber-800">{selectedRequest.typeLabel}</p>
                </div>
              </div>

              {/* Lý do */}
              <div>
                <h4 className="font-bold text-xl mb-5 flex items-center gap-3">
                  <FileText className="w-7 h-7" /> Lý do yêu cầu
                </h4>
                <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-8">
                  <p className="text-gray-800 text-lg leading-relaxed">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Tệp đính kèm */}
              {selectedRequest.attachments > 0 && (
                <div>
                  <h4 className="font-bold text-xl mb-5 flex items-center gap-3">
                    <Paperclip className="w-7 h-7" /> Tệp đính kèm ({selectedRequest.attachments})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(selectedRequest.attachments)].map((_, i) => (
                      <div key={i} className="bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-500 cursor-pointer group transition-all">
                        <FileText className="w-16 h-16 mx-auto text-gray-400 group-hover:text-blue-600" />
                        <p className="mt-4 text-sm font-bold text-gray-700">Tệp đính kèm {i + 1}</p>
                        <p className="text-xs text-gray-500">Nhấp để xem</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BẢO HIỂM HIỆN TẠI */}
              <div className="border-t-8 border-blue-600 pt-10 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8">
                <h4 className="font-bold text-3xl mb-8 text-center text-blue-900 flex items-center justify-center gap-4">
                  <Shield className="w-10 h-10" />
                  Bảo hiểm hiện tại của {selectedRequest.employee.split(' ').pop()}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {employeeInsurance.map((ins, idx) => (
                    <div key={idx} className="bg-white border-4 border-green-300 rounded-2xl p-8 shadow-lg">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h5 className="text-2xl font-bold text-green-800">{ins.type}</h5>
                          <span className="inline-block mt-3 px-5 py-2 text-sm font-bold rounded-full bg-green-600 text-white">
                            Đang tham gia
                          </span>
                        </div>
                        {ins.dependents > 0 && (
                          <div className="text-right">
                            <p className="text-5xl font-bold text-blue-600">{ins.dependents}</p>
                            <p className="text-sm text-gray-600 font-medium">người phụ thuộc</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 text-lg">
                        <div className="flex justify-between"><span className="text-gray-600">Từ ngày</span><span className="font-bold">{ins.start}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Đến ngày</span><span className="font-bold">{ins.end || 'Vô thời hạn'}</span></div>
                        {ins.hospitalName && (
                          <div className="flex justify-between"><span className="text-gray-600">Nơi KCB</span><span className="font-bold text-blue-600">{ins.hospitalName}</span></div>
                        )}
                      </div>

                      {ins.type === 'BHYT' && selectedRequest.type === 'add-dependent' && ins.dependents >= 4 && (
                        <div className="mt-6 p-6 bg-red-100 border-4 border-red-500 rounded-xl">
                          <p className="text-red-800 font-bold text-lg flex items-center gap-3">
                            <AlertCircle className="w-8 h-8" />
                            Không thể thêm người phụ thuộc! (Đã đạt tối đa 4 người)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-6 justify-end pt-8 border-t-4 border-gray-300">
                <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(false)} className="px-10">
                  Đóng
                </Button>

                {canApprove ? (
                  <>
                    <Button variant="danger" size="lg" icon={<XCircle className="w-6 h-6" />} onClick={() => rejectRequest(selectedRequest.id)} className="px-10">
                      Từ chối yêu cầu
                    </Button>
                    <Button size="lg" icon={<CheckCircle className="w-6 h-6" />} onClick={() => approveRequest(selectedRequest.id)} className="px-12 bg-green-600 hover:bg-green-700">
                      Phê duyệt ngay
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 px-6 py-4 bg-gray-100 rounded-xl text-gray-600">
                    <Lock size={20} />
                    <span>Chỉ Kế toán mới được phê duyệt</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
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
                    setEditFormData({...editFormData, monthlyValue: value ? Number(value) : 0});
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

              {/* Người phụ trách */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người phụ trách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.owner}
                  onChange={(e) => setEditFormData({...editFormData, owner: e.target.value})}
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
                  onChange={(e) => setEditFormData({...editFormData, budget: Number(e.target.value) || 0})}
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
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Đang áp dụng</option>
                  <option value="suspended">Tạm ngưng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
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
                  onChange={(e) => setEditFormData({...editFormData, nextReview: e.target.value})}
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
                  onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, name: e.target.value})}
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
                  onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, provider: e.target.value})}
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
                    onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, employerRate: e.target.value})}
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
                    onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, employeeRate: e.target.value})}
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
                    onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, effective: e.target.value})}
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
                    onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, expiry: e.target.value})}
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
                  onChange={(e) => setEditInsuranceFormData({...editInsuranceFormData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Đang áp dụng</option>
                  <option value="suspended">Tạm ngưng</option>
                  <option value="cancelled">Đã hủy</option>
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
                  onChange={(e) => setAddWelfareFormData({...addWelfareFormData, name: e.target.value})}
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
                    setAddWelfareFormData({...addWelfareFormData, monthlyValue: value ? Number(value) : 0});
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

              {/* Người phụ trách */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người phụ trách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addWelfareFormData.owner}
                  onChange={(e) => setAddWelfareFormData({...addWelfareFormData, owner: e.target.value})}
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
                  onChange={(e) => setAddWelfareFormData({...addWelfareFormData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Đang áp dụng</option>
                  <option value="suspended">Tạm ngưng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={addWelfareFormData.description}
                  onChange={(e) => setAddWelfareFormData({...addWelfareFormData, description: e.target.value})}
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
                  onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, name: e.target.value})}
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
                  onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, provider: e.target.value})}
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
                    onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, employerRate: e.target.value})}
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
                    onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, employeeRate: e.target.value})}
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
                    onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, effective: e.target.value})}
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
                    onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, expiry: e.target.value})}
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
                  onChange={(e) => setAddInsuranceFormData({...addInsuranceFormData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Đang áp dụng</option>
                  <option value="suspended">Tạm ngưng</option>
                  <option value="cancelled">Đã hủy</option>
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
                        <option value="active">Đang áp dụng</option>
                        <option value="suspended">Tạm ngưng</option>
                        <option value="cancelled">Đã hủy</option>
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
                        <option value="active">Đang áp dụng</option>
                        <option value="suspended">Tạm ngưng</option>
                        <option value="cancelled">Đã hủy</option>
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
                    onChange={(e) => setEditWelfareHistoryFormData({...editWelfareHistoryFormData, employeeId: e.target.value})}
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
                    onChange={(e) => setEditWelfareHistoryFormData({...editWelfareHistoryFormData, employeeName: e.target.value})}
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
                    onChange={(e) => setEditWelfareHistoryFormData({...editWelfareHistoryFormData, department: e.target.value})}
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
                        const updated = {...prev, welfareName: e.target.value};
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
                      setEditWelfareHistoryFormData({...editWelfareHistoryFormData, allowance: value ? Number(value) : ''});
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
                    onChange={(e) => setEditWelfareHistoryFormData({...editWelfareHistoryFormData, grantDate: e.target.value})}
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
                    onChange={(e) => setEditWelfareHistoryFormData({...editWelfareHistoryFormData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Đang áp dụng</option>
                    <option value="suspended">Tạm ngưng</option>
                    <option value="cancelled">Đã hủy</option>
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, employeeId: e.target.value})}
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, employeeName: e.target.value})}
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, department: e.target.value})}
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
                        const updated = {...prev, insuranceName: e.target.value};
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, employerRate: e.target.value})}
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, employeeRate: e.target.value})}
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, grantDate: e.target.value})}
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
                    onChange={(e) => setEditInsuranceHistoryFormData({...editInsuranceHistoryFormData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Đang áp dụng</option>
                    <option value="suspended">Tạm ngưng</option>
                    <option value="cancelled">Đã hủy</option>
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
