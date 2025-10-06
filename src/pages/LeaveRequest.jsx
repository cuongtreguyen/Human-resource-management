import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Calendar, User, Clock, AlertCircle, CheckCircle, Users, FileText } from 'lucide-react';
import fakeApi from '../services/fakeApi';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    tasks: [],
    delegateTo: '',
    priority: 'medium'
  });

  const [employees, setEmployees] = useState([]);
  const [currentTasks, setCurrentTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadEmployees();
    loadCurrentTasks();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fakeApi.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const loadCurrentTasks = async () => {
    try {
      const response = await fakeApi.getTasks();
      setCurrentTasks(response.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const handleInputChange = (field, value) => {
    // Ensure value is always a string for text inputs
    const processedValue = typeof value === 'string' ? value : String(value || '');
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leaveType) {
      newErrors.leaveType = 'Vui lòng chọn loại nghỉ phép';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
      
      // Check if dates are in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.startDate = 'Ngày bắt đầu không được là ngày trong quá khứ';
      }
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do nghỉ phép';
    }
    
    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Vui lòng nhập số điện thoại liên hệ khẩn cấp';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Số điện thoại không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTaskSelect = (taskId, isSelected) => {
    setFormData(prev => ({
      ...prev,
      tasks: isSelected 
        ? [...prev.tasks, taskId]
        : prev.tasks.filter(id => id !== taskId)
    }));
  };

  const calculateLeaveDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      // Handle same day leave
      if (start.getTime() === end.getTime()) {
        return 1;
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const getLeaveTypeInfo = (type) => {
    const types = {
      'annual': { 
        name: 'Nghỉ phép thường', 
        maxDays: 12, 
        color: 'blue',
        description: 'Nghỉ phép hàng năm, cần bàn giao công việc'
      },
      'sick': { 
        name: 'Nghỉ ốm', 
        maxDays: 5, 
        color: 'red',
        description: 'Nghỉ ốm, công việc cần xử lý khẩn cấp'
      },
      'maternity': { 
        name: 'Nghỉ thai sản', 
        maxDays: 280, 
        color: 'purple',
        description: 'Nghỉ thai sản dài hạn, cần kế hoạch chi tiết'
      },
      'emergency': { 
        name: 'Nghỉ khẩn cấp', 
        maxDays: 3, 
        color: 'orange',
        description: 'Nghỉ khẩn cấp, cần xử lý ngay lập tức'
      }
    };
    return types[type] || { name: 'Khác', maxDays: 0, color: 'gray', description: '' };
  };

  const getDelegationStrategy = (leaveType, days) => {
    if (leaveType === 'maternity' || days > 30) {
      return {
        strategy: 'Long-term Replacement',
        description: 'Cần tìm người thay thế dài hạn hoặc thuê ngoài',
        steps: [
          'Tạo kế hoạch bàn giao chi tiết',
          'Tìm người thay thế phù hợp',
          'Đào tạo và handover',
          'Thiết lập monitoring system'
        ]
      };
    } else if (days > 7) {
      return {
        strategy: 'Temporary Assignment',
        description: 'Phân công tạm thời cho đồng nghiệp',
        steps: [
          'Chọn người có kinh nghiệm tương tự',
          'Tạo handover document',
          'Thiết lập communication protocol',
          'Monitor progress định kỳ'
        ]
      };
    } else {
      return {
        strategy: 'Emergency Coverage',
        description: 'Xử lý khẩn cấp bởi đồng nghiệp gần nhất',
        steps: [
          'Delegate cho đồng nghiệp có sẵn',
          'Brief nhanh về công việc',
          'Thiết lập hotline support',
          'Daily check-in'
        ]
      };
    }
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      alert('Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    try {
      setLoading(true);
      
      const leaveDays = calculateLeaveDays();
      const leaveTypeInfo = getLeaveTypeInfo(formData.leaveType);
      const delegationStrategy = getDelegationStrategy(formData.leaveType, leaveDays);

      const leaveRequest = {
        ...formData,
        leaveDays,
        leaveTypeInfo,
        delegationStrategy,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        tasksToDelegate: formData.tasks.map(taskId => 
          currentTasks.find(task => task.id === taskId)
        )
      };

      await fakeApi.createLeaveRequest(leaveRequest);
      
      alert('Đơn nghỉ phép đã được gửi thành công!');
      navigate('/leaves');
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi đơn nghỉ phép');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const leaveDays = calculateLeaveDays();
  const leaveTypeInfo = getLeaveTypeInfo(formData.leaveType);
  const delegationStrategy = getDelegationStrategy(formData.leaveType, leaveDays);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Tạo đơn nghỉ phép</h1>
                <p className="text-blue-100 mt-1">Đăng ký nghỉ phép và bàn giao công việc</p>
              </div>
              <Button 
                variant="secondary" 
                size="md" 
                onClick={() => navigate('/leaves')}
              >
                ← Quay lại
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Leave Information */}
              <Card title="Thông tin nghỉ phép">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Loại nghỉ phép"
                    options={[
                      { value: 'annual', label: 'Nghỉ phép thường' },
                      { value: 'sick', label: 'Nghỉ ốm' },
                      { value: 'maternity', label: 'Nghỉ thai sản' },
                      { value: 'emergency', label: 'Nghỉ khẩn cấp' }
                    ]}
                    value={formData.leaveType}
                    onChange={(value) => handleInputChange('leaveType', value)}
                    error={errors.leaveType}
                    required
                  />
                  
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
                  
                  <Input
                    label="Liên hệ khẩn cấp"
                    value={formData.emergencyContact || ''}
                    onChange={(value) => handleInputChange('emergencyContact', value)}
                    placeholder="Số điện thoại liên hệ"
                    error={errors.emergencyContact}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do nghỉ phép <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.reason ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Mô tả chi tiết lý do nghỉ phép..."
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>
              </Card>

              {/* Task Delegation */}
              <Card title="Bàn giao công việc">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn công việc cần bàn giao
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {currentTasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={formData.tasks.includes(task.id)}
                            onChange={(e) => handleTaskSelect(task.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor={`task-${task.id}`} className="font-medium text-gray-900 cursor-pointer">
                              {task.title}
                            </label>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                Assignee: {task.assignee?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Select
                    label="Bàn giao cho"
                    options={employees.map(emp => ({ 
                      value: emp.id, 
                      label: `${emp.name} (${emp.position})` 
                    }))}
                    value={formData.delegateTo}
                    onChange={(value) => handleInputChange('delegateTo', value)}
                  />
                </div>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Đang gửi...' : 'Gửi đơn nghỉ phép'}
                </Button>
              </div>
            </div>

            {/* Sidebar - Leave Summary */}
            <div className="space-y-6">
              {/* Leave Summary */}
              <Card title="Tóm tắt nghỉ phép">
                <div className="space-y-4">
                  {formData.leaveType && (
                    <div className={`p-3 rounded-lg bg-${leaveTypeInfo.color}-50 border border-${leaveTypeInfo.color}-200`}>
                      <h3 className={`font-medium text-${leaveTypeInfo.color}-900`}>
                        {leaveTypeInfo.name}
                      </h3>
                      <p className={`text-sm text-${leaveTypeInfo.color}-700 mt-1`}>
                        {leaveTypeInfo.description}
                      </p>
                    </div>
                  )}

                  {leaveDays > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{leaveDays}</div>
                      <div className="text-sm text-gray-600">
                        {leaveDays === 1 ? 'ngày nghỉ phép' : 'ngày nghỉ phép'}
                      </div>
                      {formData.startDate && formData.endDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(formData.startDate).toLocaleDateString('vi-VN')} - {new Date(formData.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  )}

                  {formData.tasks.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900">Công việc cần bàn giao</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {formData.tasks.length} công việc được chọn
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Delegation Strategy */}
              {formData.leaveType && leaveDays > 0 && (
                <Card title="Chiến lược bàn giao">
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900">
                        {delegationStrategy.strategy}
                      </h4>
                      <p className="text-sm text-purple-700 mt-1">
                        {delegationStrategy.description}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Các bước thực hiện:</h5>
                      <ul className="space-y-1">
                        {delegationStrategy.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveRequest;
