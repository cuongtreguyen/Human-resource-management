// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '../../components/layout/Layout';
// import Card from '../../components/ui/Card';
// import Button from '../../components/ui/Button';
// import Input from '../../components/ui/Input';
// import Select from '../../components/ui/Select';
// import { Calendar, User, Clock, AlertCircle, CheckCircle, Users, FileText } from 'lucide-react';
// import fakeApi from '../../services/fakeApi';

// const LeaveRequest = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     leaveType: '',
//     startDate: '',
//     endDate: '',
//     reason: '',
//     emergencyContact: '',
//     tasks: [],
//     delegateTo: '',
//     priority: 'medium'
//   });

//   const [employees, setEmployees] = useState([]);
//   const [currentTasks, setCurrentTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     loadEmployees();
//     loadCurrentTasks();
//   }, []);

//   const loadEmployees = async () => {
//     try {
//       const response = await fakeApi.getEmployees();
//       setEmployees(response.data);
//     } catch (err) {
//       console.error('Error loading employees:', err);
//     }
//   };

//   const loadCurrentTasks = async () => {
//     try {
//       const response = await fakeApi.getTasks();
//       setCurrentTasks(response.data);
//     } catch (err) {
//       console.error('Error loading tasks:', err);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     // Ensure value is always a string for text inputs
//     const processedValue = typeof value === 'string' ? value : String(value || '');
    
//     setFormData(prev => ({
//       ...prev,
//       [field]: processedValue
//     }));
    
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.leaveType) {
//       newErrors.leaveType = 'Vui lòng chọn loại nghỉ phép';
//     }
    
//     if (!formData.startDate) {
//       newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
//     }
    
//     if (!formData.endDate) {
//       newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
//     }
    
//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);
      
//       if (endDate < startDate) {
//         newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
//       }
      
//       // Check if dates are in the past
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (startDate < today) {
//         newErrors.startDate = 'Ngày bắt đầu không được là ngày trong quá khứ';
//       }
//     }
    
//     if (!formData.reason.trim()) {
//       newErrors.reason = 'Vui lòng nhập lý do nghỉ phép';
//     }
    
//     if (!formData.emergencyContact.trim()) {
//       newErrors.emergencyContact = 'Vui lòng nhập số điện thoại liên hệ khẩn cấp';
//     } else if (!/^[0-9+\-\s()]+$/.test(formData.emergencyContact)) {
//       newErrors.emergencyContact = 'Số điện thoại không hợp lệ';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleTaskSelect = (taskId, isSelected) => {
//     setFormData(prev => ({
//       ...prev,
//       tasks: isSelected 
//         ? [...prev.tasks, taskId]
//         : prev.tasks.filter(id => id !== taskId)
//     }));
//   };

//   const calculateLeaveDays = () => {
//     if (formData.startDate && formData.endDate) {
//       const start = new Date(formData.startDate);
//       const end = new Date(formData.endDate);
      
//       // Handle same day leave
//       if (start.getTime() === end.getTime()) {
//         return 1;
//       }
      
//       const diffTime = Math.abs(end - start);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//       return diffDays;
//     }
//     return 0;
//   };

//   const getLeaveTypeInfo = (type) => {
//     const types = {
//       'annual': { 
//         name: 'Nghỉ phép thường', 
//         maxDays: 12, 
//         color: 'blue',
//         description: 'Nghỉ phép hàng năm, cần bàn giao công việc'
//       },
//       'sick': { 
//         name: 'Nghỉ ốm', 
//         maxDays: 5, 
//         color: 'red',
//         description: 'Nghỉ ốm, công việc cần xử lý khẩn cấp'
//       },
//       'maternity': { 
//         name: 'Nghỉ thai sản', 
//         maxDays: 280, 
//         color: 'purple',
//         description: 'Nghỉ thai sản dài hạn, cần kế hoạch chi tiết'
//       },
//       'emergency': { 
//         name: 'Nghỉ khẩn cấp', 
//         maxDays: 3, 
//         color: 'orange',
//         description: 'Nghỉ khẩn cấp, cần xử lý ngay lập tức'
//       }
//     };
//     return types[type] || { name: 'Khác', maxDays: 0, color: 'gray', description: '' };
//   };

//   const getDelegationStrategy = (leaveType, days) => {
//     if (leaveType === 'maternity' || days > 30) {
//       return {
//         strategy: 'Long-term Replacement',
//         description: 'Cần tìm người thay thế dài hạn hoặc thuê ngoài',
//         steps: [
//           'Tạo kế hoạch bàn giao chi tiết',
//           'Tìm người thay thế phù hợp',
//           'Đào tạo và handover',
//           'Thiết lập monitoring system'
//         ]
//       };
//     } else if (days > 7) {
//       return {
//         strategy: 'Temporary Assignment',
//         description: 'Phân công tạm thời cho đồng nghiệp',
//         steps: [
//           'Chọn người có kinh nghiệm tương tự',
//           'Tạo handover document',
//           'Thiết lập communication protocol',
//           'Monitor progress định kỳ'
//         ]
//       };
//     } else {
//       return {
//         strategy: 'Emergency Coverage',
//         description: 'Xử lý khẩn cấp bởi đồng nghiệp gần nhất',
//         steps: [
//           'Delegate cho đồng nghiệp có sẵn',
//           'Brief nhanh về công việc',
//           'Thiết lập hotline support',
//           'Daily check-in'
//         ]
//       };
//     }
//   };

//   const handleSubmit = async () => {
//     // Validate form before submission
//     if (!validateForm()) {
//       alert('Vui lòng kiểm tra lại thông tin đã nhập');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const leaveDays = calculateLeaveDays();
//       const leaveTypeInfo = getLeaveTypeInfo(formData.leaveType);
//       const delegationStrategy = getDelegationStrategy(formData.leaveType, leaveDays);

//       const leaveRequest = {
//         ...formData,
//         leaveDays,
//         leaveTypeInfo,
//         delegationStrategy,
//         status: 'pending',
//         submittedAt: new Date().toISOString(),
//         tasksToDelegate: formData.tasks.map(taskId => 
//           currentTasks.find(task => task.id === taskId)
//         )
//       };

//       await fakeApi.createLeaveRequest(leaveRequest);
      
//       alert('Đơn nghỉ phép đã được gửi thành công!');
//       navigate('/leaves');
//     } catch (err) {
//       alert('Có lỗi xảy ra khi gửi đơn nghỉ phép');
//       console.error('Submit error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const leaveDays = calculateLeaveDays();
//   const leaveTypeInfo = getLeaveTypeInfo(formData.leaveType);
//   const delegationStrategy = getDelegationStrategy(formData.leaveType, leaveDays);

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-3xl font-bold">Tạo đơn nghỉ phép</h1>
//                 <p className="text-blue-100 mt-1">Đăng ký nghỉ phép và bàn giao công việc</p>
//               </div>
//               <Button 
//                 variant="secondary" 
//                 size="md" 
//                 onClick={() => navigate('/leaves')}
//               >
//                 ← Quay lại
//               </Button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Main Form */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Leave Information */}
//               <Card title="Thông tin nghỉ phép">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Select
//                     label="Loại nghỉ phép"
//                     options={[
//                       { value: 'annual', label: 'Nghỉ phép thường' },
//                       { value: 'sick', label: 'Nghỉ ốm' },
//                       { value: 'maternity', label: 'Nghỉ thai sản' },
//                       { value: 'emergency', label: 'Nghỉ khẩn cấp' }
//                     ]}
//                     value={formData.leaveType}
//                     onChange={(value) => handleInputChange('leaveType', value)}
//                     error={errors.leaveType}
//                     required
//                   />
                  
//                   <Input
//                     label="Ngày bắt đầu"
//                     type="date"
//                     value={formData.startDate}
//                     onChange={(value) => handleInputChange('startDate', value)}
//                     error={errors.startDate}
//                     required
//                   />
                  
//                   <Input
//                     label="Ngày kết thúc"
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(value) => handleInputChange('endDate', value)}
//                     error={errors.endDate}
//                     required
//                   />
                  
//                   <Input
//                     label="Liên hệ khẩn cấp"
//                     value={formData.emergencyContact || ''}
//                     onChange={(value) => handleInputChange('emergencyContact', value)}
//                     placeholder="Số điện thoại liên hệ"
//                     error={errors.emergencyContact}
//                     required
//                   />
//                 </div>
                
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Lý do nghỉ phép <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.reason ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
//                     }`}
//                     rows="3"
//                     value={formData.reason}
//                     onChange={(e) => handleInputChange('reason', e.target.value)}
//                     placeholder="Mô tả chi tiết lý do nghỉ phép..."
//                   />
//                   {errors.reason && (
//                     <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
//                   )}
//                 </div>
//               </Card>

//               {/* Task Delegation */}
//               <Card title="Bàn giao công việc">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Chọn công việc cần bàn giao
//                     </label>
//                     <div className="space-y-2 max-h-60 overflow-y-auto">
//                       {currentTasks.map((task) => (
//                         <div key={task.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
//                           <input
//                             type="checkbox"
//                             id={`task-${task.id}`}
//                             checked={formData.tasks.includes(task.id)}
//                             onChange={(e) => handleTaskSelect(task.id, e.target.checked)}
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                           />
//                           <div className="flex-1">
//                             <label htmlFor={`task-${task.id}`} className="font-medium text-gray-900 cursor-pointer">
//                               {task.title}
//                             </label>
//                             <p className="text-sm text-gray-600">{task.description}</p>
//                             <div className="flex items-center space-x-4 mt-1">
//                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                 task.priority === 'high' ? 'bg-red-100 text-red-800' :
//                                 task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                                 'bg-green-100 text-green-800'
//                               }`}>
//                                 {task.priority}
//                               </span>
//                               <span className="text-xs text-gray-500">
//                                 Assignee: {task.assignee?.name}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <Select
//                     label="Bàn giao cho"
//                     options={employees.map(emp => ({ 
//                       value: emp.id, 
//                       label: `${emp.name} (${emp.position})` 
//                     }))}
//                     value={formData.delegateTo}
//                     onChange={(value) => handleInputChange('delegateTo', value)}
//                   />
//                 </div>
//               </Card>

//               {/* Submit Button */}
//               <div className="flex justify-end">
//                 <Button 
//                   variant="primary" 
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   loading={loading}
//                 >
//                   {loading ? 'Đang gửi...' : 'Gửi đơn nghỉ phép'}
//                 </Button>
//               </div>
//             </div>

//             {/* Sidebar - Leave Summary */}
//             <div className="space-y-6">
//               {/* Leave Summary */}
//               <Card title="Tóm tắt nghỉ phép">
//                 <div className="space-y-4">
//                   {formData.leaveType && (
//                     <div className={`p-3 rounded-lg bg-${leaveTypeInfo.color}-50 border border-${leaveTypeInfo.color}-200`}>
//                       <h3 className={`font-medium text-${leaveTypeInfo.color}-900`}>
//                         {leaveTypeInfo.name}
//                       </h3>
//                       <p className={`text-sm text-${leaveTypeInfo.color}-700 mt-1`}>
//                         {leaveTypeInfo.description}
//                       </p>
//                     </div>
//                   )}

//                   {leaveDays > 0 && (
//                     <div className="text-center p-4 bg-gray-50 rounded-lg">
//                       <div className="text-2xl font-bold text-gray-900">{leaveDays}</div>
//                       <div className="text-sm text-gray-600">
//                         {leaveDays === 1 ? 'ngày nghỉ phép' : 'ngày nghỉ phép'}
//                       </div>
//                       {formData.startDate && formData.endDate && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           {new Date(formData.startDate).toLocaleDateString('vi-VN')} - {new Date(formData.endDate).toLocaleDateString('vi-VN')}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {formData.tasks.length > 0 && (
//                     <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <h4 className="font-medium text-blue-900">Công việc cần bàn giao</h4>
//                       <p className="text-sm text-blue-700 mt-1">
//                         {formData.tasks.length} công việc được chọn
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </Card>

//               {/* Delegation Strategy */}
//               {formData.leaveType && leaveDays > 0 && (
//                 <Card title="Chiến lược bàn giao">
//                   <div className="space-y-3">
//                     <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
//                       <h4 className="font-medium text-purple-900">
//                         {delegationStrategy.strategy}
//                       </h4>
//                       <p className="text-sm text-purple-700 mt-1">
//                         {delegationStrategy.description}
//                       </p>
//                     </div>

//                     <div>
//                       <h5 className="font-medium text-gray-900 mb-2">Các bước thực hiện:</h5>
//                       <ul className="space-y-1">
//                         {delegationStrategy.steps.map((step, index) => (
//                           <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
//                             <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
//                               {index + 1}
//                             </span>
//                             <span>{step}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default LeaveRequest;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  ArrowLeft,
  Phone,
  Briefcase,
  ChevronRight,
  Info,
  History,
  CheckCircle2,
  XCircle,
  Hourglass
} from 'lucide-react';
import { getLeaveBalance, getLeaveHistory, createLeaveRequest } from '../../services/leaveService';
import { getAllEmployees } from '../../services/employeeService';
import { getRole, getUserInfo } from '../../utils/auth';
import { logCreateLeave } from '../../utils/systemLogger';
import { LEAVE_TYPE_OPTIONS, getLeaveTypeInfo as getLeaveTypeInfoFromConstants, LEAVE_TYPES } from '../../constants/leaveTypes';
import { toast } from 'react-toastify';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const userRole = getRole();

  // Manager và Accountant không cần bàn giao công việc
  const shouldShowTaskSelection = userRole !== 'manager' && userRole !== 'accountant';
  const shouldShowDelegationSection = userRole !== 'accountant' && userRole !== 'manager';
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    priority: 'medium'
  });

  const [employees, setEmployees] = useState([]);
  const [currentTasks, setCurrentTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);

  useEffect(() => {
    loadEmployees();
    loadCurrentTasks();
    loadLeaveHistory();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      const empData = Array.isArray(response) ? response : response.data || [];
      setEmployees(empData);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const loadCurrentTasks = async () => {
    try {
      // TODO: Gọi API tasks khi có endpoint
      // Tạm thời để trống, không ảnh hưởng đến chức năng chính
      setCurrentTasks([]);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const loadLeaveHistory = async () => {
    try {
      const userInfo = getUserInfo();
      const employeeId = userInfo?.employeeId || userInfo?.id || '1';
      const currentYear = new Date().getFullYear();

      // Load leave balance từ API
      try {
        const balanceRes = await getLeaveBalance(employeeId);
        // API trả về: { employeeId, totalLeaveDays, usedLeaveDays, remainingLeaveDays }
        setLeaveBalance({
          totalLeaveDays: balanceRes.totalLeaveDays || 12,
          usedLeaveDays: balanceRes.usedLeaveDays || 0,
          remainingLeaveDays: balanceRes.remainingLeaveDays || 12,
        });
      } catch (e) {
        console.log('Could not load leave balance, using defaults');
        setLeaveBalance({ totalLeaveDays: 12, usedLeaveDays: 0, remainingLeaveDays: 12 });
      }

      // Load leave history từ API
      try {
        const historyRes = await getLeaveHistory(employeeId, currentYear);
        // API trả về: { employeeId, year, history: [...] }
        const historyData = historyRes.history || historyRes.data || historyRes || [];
        setLeaveHistory(Array.isArray(historyData) ? historyData : []);
      } catch (e) {
        console.log('Could not load leave history');
        setLeaveHistory([]);
      }
    } catch (err) {
      console.error('Error loading leave history:', err);
    }
  };

  const handleInputChange = (field, value) => {
    const processedValue = typeof value === 'string' ? value : String(value || '');
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = 'Vui lòng chọn loại nghỉ phép';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) newErrors.startDate = 'Ngày bắt đầu không được là ngày trong quá khứ';
    }
    
    if (!formData.reason.trim()) newErrors.reason = 'Vui lòng nhập lý do nghỉ phép';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTaskSelect = (taskId) => {
    const isSelected = formData.tasks.includes(taskId);
    setFormData(prev => ({
      ...prev,
      tasks: !isSelected 
        ? [...prev.tasks, taskId]
        : prev.tasks.filter(id => id !== taskId)
    }));
  };

  const calculateLeaveDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start.getTime() === end.getTime()) return 1;
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const getLeaveTypeInfo = (type) => {
    return getLeaveTypeInfoFromConstants(type);
  };

  const getDelegationStrategy = (leaveType, days) => {
    if (leaveType === LEAVE_TYPES.MATERNITY_LEAVE || days > 30) {
      return {
        strategy: 'Thay thế dài hạn',
        description: 'Cần tìm người thay thế dài hạn hoặc thuê ngoài',
        steps: ['Tạo kế hoạch bàn giao chi tiết', 'Tìm người thay thế phù hợp', 'Đào tạo và bàn giao', 'Thiết lập hệ thống giám sát']
      };
    } else if (days > 7) {
      return {
        strategy: 'Phân công tạm thời',
        description: 'Phân công tạm thời cho đồng nghiệp',
        steps: ['Chọn người có kinh nghiệm tương tự', 'Tạo tài liệu bàn giao', 'Thiết lập quy trình liên lạc', 'Kiểm tra tiến độ định kỳ']
      };
    } else {
      return {
        strategy: 'Xử lý khẩn cấp',
        description: 'Xử lý khẩn cấp bởi đồng nghiệp gần nhất',
        steps: ['Bàn giao cho đồng nghiệp có sẵn', 'Tóm tắt nhanh về công việc', 'Thiết lập đường dây nóng', 'Cập nhật hàng ngày']
      };
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.warning('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setLoading(true);
      const leaveDays = calculateLeaveDays();
      const userInfo = getUserInfo();

      console.log('👤 UserInfo from session:', userInfo);

      // Lấy employeeId - thử nhiều cách
      let employeeId = userInfo?.employeeId || userInfo?.id;

      // Nếu không tìm thấy, thử lấy từ localStorage
      if (!employeeId) {
        const storedInfo = sessionStorage.getItem('hrm_user_info');
        if (storedInfo) {
          try {
            const parsed = JSON.parse(storedInfo);
            employeeId = parsed?.employeeId || parsed?.id;
            console.log('📦 Parsed from sessionStorage:', parsed);
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }

      // Fallback tạm thời cho testing - bạn có thể bỏ sau khi fix login
      if (!employeeId) {
        console.warn('⚠️ Không tìm thấy employeeId, dùng tạm "1" để test');
        employeeId = '1'; // TODO: Xóa dòng này sau khi fix login
      }

      // Format data cho API - Backend expects 'type' not 'leaveType'
      const leaveRequestData = {
        employeeId: String(employeeId),
        type: formData.leaveType,        // Giờ đã là lowercase: "annual", "sick"...
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      };

      console.log('📤 Leave request data:', leaveRequestData);

      const response = await createLeaveRequest(leaveRequestData);

      // Log hành động tạo đơn nghỉ phép
      const employeeName = userInfo?.name || userInfo?.email || 'Unknown';
      const leaveId = response?.leaveId || response?.id || Date.now().toString();
      logCreateLeave(leaveId, employeeName, leaveDays);

      toast.success('Đơn nghỉ phép đã được gửi thành công!');
      navigate('/leaves');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Có lỗi xảy ra khi gửi đơn nghỉ phép');
    } finally {
      setLoading(false);
    }
  };

  const leaveDays = calculateLeaveDays();
  const leaveTypeInfo = getLeaveTypeInfo(formData.leaveType);
  const delegationStrategy = getDelegationStrategy(formData.leaveType, leaveDays);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 pb-12">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/leaves')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tạo đơn nghỉ phép</h1>
                <p className="text-sm text-gray-500">Điền thông tin nghỉ phép</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/leaves')}>Hủy</Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={loading}
                loading={loading}
              >
                Gửi đơn
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Section 1: Thông tin cơ bản */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Thông tin nghỉ phép</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <Select
                      label="Loại nghỉ phép"
                      options={LEAVE_TYPE_OPTIONS}
                      value={formData.leaveType}
                      onChange={(value) => handleInputChange('leaveType', value)}
                      error={errors.leaveType}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Ngày bắt đầu"
                      type="date"
                      value={formData.startDate}
                      onChange={(value) => handleInputChange('startDate', value)}
                      error={errors.startDate}
                      required
                    />
                    <Input
                      label="Ngày kết thúc"
                      type="date"
                      value={formData.endDate}
                      onChange={(value) => handleInputChange('endDate', value)}
                      error={errors.endDate}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do nghỉ phép <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors.reason ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      rows="4"
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      placeholder="Vui lòng mô tả chi tiết lý do..."
                    />
                    {errors.reason && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {errors.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <h3 className="font-semibold text-lg mb-1">Tóm tắt đơn</h3>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString('vi-VN') : '--/--'} 
                        {' '}<ArrowLeft className="w-3 h-3 inline rotate-180" />{' '}
                        {formData.endDate ? new Date(formData.endDate).toLocaleDateString('vi-VN') : '--/--'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Days Count */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium">Tổng số ngày</span>
                        <span className="text-xs text-gray-400">Đã trừ ngày nghỉ lễ</span>
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{leaveDays}</span>
                    </div>

                    {/* Type Badge */}
                    {formData.leaveType && (
                      <div className={`p-3 rounded-lg flex items-start gap-3 bg-${leaveTypeInfo.color}-50 border border-${leaveTypeInfo.color}-100`}>
                        <Info className={`w-5 h-5 text-${leaveTypeInfo.color}-600 shrink-0 mt-0.5`} />
                        <div>
                          <p className={`text-sm font-bold text-${leaveTypeInfo.color}-700`}>{leaveTypeInfo.name}</p>
                          <p className={`text-xs text-${leaveTypeInfo.color}-600 mt-1`}>{leaveTypeInfo.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delegation Strategy Card - Ẩn với accountant */}
                {shouldShowDelegationSection && formData.leaveType && leaveDays > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                      Chiến lược đề xuất
                    </h3>

                    <div className="mb-4">
                      <div className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg inline-block mb-2">
                        {delegationStrategy.strategy}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {delegationStrategy.description}
                      </p>
                    </div>

                    {/* Timeline Steps */}
                    <div className="relative border-l-2 border-gray-100 ml-2 space-y-6 my-2">
                      {delegationStrategy.steps.map((step, index) => (
                        <div key={index} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-400 shadow-sm"></div>
                          <p className="text-sm text-gray-700 font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leave History Card */}
                {leaveHistory.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                      <History className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">Lịch sử nghỉ phép</h3>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                      {leaveHistory.slice(0, 5).map((leave) => (
                        <div key={leave.id} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {leave.type === 'annual' ? 'Nghỉ phép năm' :
                                 leave.type === 'sick' ? 'Nghỉ ốm' :
                                 leave.type === 'unpaid' ? 'Không lương' :
                                 leave.type === 'maternity' ? 'Thai sản' : 'Khác'}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(leave.startDate).toLocaleDateString('vi-VN')} - {new Date(leave.endDate).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-600">{leave.days} ngày</span>
                              {leave.status === 'approved' && (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Duyệt
                                </span>
                              )}
                              {leave.status === 'pending' && (
                                <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                                  <Hourglass className="w-3 h-3" />
                                  Chờ
                                </span>
                              )}
                              {leave.status === 'rejected' && (
                                <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                  <XCircle className="w-3 h-3" />
                                  Từ chối
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {leaveHistory.length > 5 && (
                      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Xem tất cả ({leaveHistory.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveRequest;