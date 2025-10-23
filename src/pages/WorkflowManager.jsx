import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Mail,
  MessageSquare,
  Calendar,
  Users,
  ArrowRight,
  Bell,
  FileText
} from 'lucide-react';
// Removed unused import

const WorkflowManager = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      // Mock workflow data
      setWorkflows([
        {
          id: 1,
          name: 'Duyệt đơn nghỉ phép',
          trigger: 'leave_approved',
          steps: [
            {
              id: 1,
              name: 'Gửi thông báo cho nhân viên',
              type: 'notification',
              target: 'employee',
              message: 'Đơn nghỉ phép của bạn đã được duyệt',
              status: 'completed'
            },
            {
              id: 2,
              name: 'Tạo danh sách công việc cần bàn giao',
              type: 'task_list',
              target: 'system',
              message: 'Tự động tạo danh sách tasks cần bàn giao',
              status: 'completed'
            },
            {
              id: 3,
              name: 'Gửi thông báo cho người nhận công việc',
              type: 'notification',
              target: 'delegate',
              message: 'Bạn đã được giao công việc từ [Employee Name]',
              status: 'pending'
            },
            {
              id: 4,
              name: 'Tạo handover document',
              type: 'document',
              target: 'system',
              message: 'Tạo tài liệu bàn giao chi tiết',
              status: 'pending'
            }
          ],
          status: 'active'
        },
        {
          id: 2,
          name: 'Từ chối đơn nghỉ phép',
          trigger: 'leave_rejected',
          steps: [
            {
              id: 1,
              name: 'Gửi thông báo từ chối',
              type: 'notification',
              target: 'employee',
              message: 'Đơn nghỉ phép của bạn đã bị từ chối',
              status: 'completed'
            },
            {
              id: 2,
              name: 'Gửi email giải thích lý do',
              type: 'email',
              target: 'employee',
              message: 'Email giải thích lý do từ chối',
              status: 'completed'
            }
          ],
          status: 'active'
        },
        {
          id: 3,
          name: 'Bàn giao công việc khẩn cấp',
          trigger: 'emergency_leave',
          steps: [
            {
              id: 1,
              name: 'Tìm người thay thế gần nhất',
              type: 'auto_assign',
              target: 'system',
              message: 'Tự động tìm đồng nghiệp có sẵn',
              status: 'completed'
            },
            {
              id: 2,
              name: 'Gửi thông báo khẩn cấp',
              type: 'urgent_notification',
              target: 'delegate',
              message: 'THÔNG BÁO KHẨN CẤP: Bạn cần làm thay công việc của [Employee Name]',
              status: 'completed'
            },
            {
              id: 3,
              name: 'Tạo hotline support',
              type: 'support',
              target: 'system',
              message: 'Thiết lập hotline hỗ trợ 24/7',
              status: 'pending'
            }
          ],
          status: 'active'
        }
      ]);
    } catch {
      console.error('Error loading workflows');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'notification': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'email': return <Mail className="h-4 w-4 text-green-500" />;
      case 'task_list': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'document': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'auto_assign': return <Users className="h-4 w-4 text-indigo-500" />;
      case 'urgent_notification': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'support': return <MessageSquare className="h-4 w-4 text-teal-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStepStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatusName = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'failed': return 'Thất bại';
      case 'running': return 'Đang chạy';
      default: return 'Chưa bắt đầu';
    }
  };

  const executeWorkflow = async (workflowId) => {
    try {
      // Simulate workflow execution
      const updatedWorkflows = workflows.map(workflow => 
        workflow.id === workflowId 
          ? {
              ...workflow,
              steps: workflow.steps.map(step => ({
                ...step,
                status: step.status === 'pending' ? 'running' : step.status
              }))
            }
          : workflow
      );
      setWorkflows(updatedWorkflows);
      
      // Simulate completion after 2 seconds
      setTimeout(() => {
        const completedWorkflows = workflows.map(workflow => 
          workflow.id === workflowId 
            ? {
                ...workflow,
                steps: workflow.steps.map(step => ({
                  ...step,
                  status: step.status === 'running' ? 'completed' : step.status
                }))
              }
            : workflow
        );
        setWorkflows(completedWorkflows);
        alert('Workflow đã được thực thi thành công!');
      }, 2000);
      
    } catch {
      alert('Có lỗi xảy ra khi thực thi workflow');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải workflows...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Quản lý Workflow</h1>
                <p className="text-indigo-100 mt-1">Tự động hóa quy trình bàn giao công việc</p>
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

          {/* Workflow List */}
          <div className="space-y-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} title={workflow.name}>
                <div className="space-y-4">
                  {/* Workflow Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Trigger:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {workflow.trigger}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => executeWorkflow(workflow.id)}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Thực thi
                    </Button>
                  </div>

                  {/* Workflow Steps */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Các bước thực hiện:</h4>
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStepIcon(step.type)}
                            <h5 className="font-medium text-gray-900">{step.name}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStepStatusColor(step.status)}`}>
                              {getStepStatusName(step.status)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{step.message}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {step.target === 'employee' ? 'Nhân viên' :
                               step.target === 'delegate' ? 'Người nhận' :
                               step.target === 'system' ? 'Hệ thống' : 'Tất cả'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {step.type === 'notification' ? 'Thông báo' :
                               step.type === 'email' ? 'Email' :
                               step.type === 'task_list' ? 'Danh sách công việc' :
                               step.type === 'document' ? 'Tài liệu' :
                               step.type === 'auto_assign' ? 'Tự động giao' :
                               step.type === 'urgent_notification' ? 'Thông báo khẩn cấp' :
                               step.type === 'support' ? 'Hỗ trợ' : step.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Workflow Explanation */}
          <Card title="Giải thích Workflow" className="mt-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🔄 Luồng bàn giao công việc tự động:</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>1. Duyệt đơn nghỉ phép:</strong> Khi manager duyệt đơn nghỉ phép → Hệ thống tự động:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Gửi thông báo cho nhân viên nghỉ phép</li>
                    <li>• Tạo danh sách công việc cần bàn giao</li>
                    <li>• Gửi thông báo cho người nhận công việc</li>
                    <li>• Tạo tài liệu bàn giao chi tiết</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📱 Cách nhân viên nhận thông báo:</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <p><strong>1. Thông báo trong hệ thống:</strong> Hiển thị ở Notification Center</p>
                  <p><strong>2. Email tự động:</strong> Gửi email chi tiết về công việc được giao</p>
                  <p><strong>3. SMS khẩn cấp:</strong> Cho trường hợp nghỉ khẩn cấp</p>
                  <p><strong>4. Dashboard cập nhật:</strong> Hiển thị tasks mới trong Task Management</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🎯 Ví dụ thực tế:</h4>
                <div className="space-y-2 text-sm text-purple-800">
                  <p><strong>Nhân viên A nghỉ thai sản 9 tháng:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Hệ thống tự động tìm người thay thế phù hợp</li>
                    <li>• Gửi thông báo cho người thay thế</li>
                    <li>• Tạo kế hoạch đào tạo và handover</li>
                    <li>• Thiết lập monitoring system</li>
                  </ul>
                  <p><strong>Nhân viên B nghỉ ốm 3 ngày:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Tự động tìm đồng nghiệp có sẵn</li>
                    <li>• Gửi thông báo khẩn cấp</li>
                    <li>• Tạo hotline support</li>
                    <li>• Daily check-in</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WorkflowManager;
