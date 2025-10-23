import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Users,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

const DelegationGuide = () => {
  const [expandedSteps, setExpandedSteps] = useState({});

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleCreateLeaveRequest = () => {
    // Navigate to leave request page
    window.location.href = '/leave-request';
  };

  const handleCreateTemplate = () => {
    // Tạo template tài liệu bàn giao
    const template = `# TÀI LIỆU BÀN GIAO CÔNG VIỆC

## Thông tin chung
- **Người giao:** [Tên người giao]
- **Người nhận:** [Tên người nhận]
- **Ngày bàn giao:** [Ngày]
- **Thời gian nghỉ phép:** [Từ ngày] đến [Đến ngày]
- **Loại nghỉ phép:** [Loại nghỉ]

## Danh sách công việc cần bàn giao

### 1. [Tên công việc]
- **Mô tả:** [Mô tả chi tiết]
- **Mức độ ưu tiên:** [High/Medium/Low]
- **Deadline:** [Ngày hoàn thành]
- **Tài liệu liên quan:** [Danh sách file/tài liệu]
- **Hệ thống/tài khoản cần truy cập:** [Danh sách]
- **Liên hệ hỗ trợ:** [Tên và số điện thoại]

### 2. [Tên công việc khác]
- **Mô tả:** [Mô tả chi tiết]
- **Mức độ ưu tiên:** [High/Medium/Low]
- **Deadline:** [Ngày hoàn thành]
- **Tài liệu liên quan:** [Danh sách file/tài liệu]
- **Hệ thống/tài khoản cần truy cập:** [Danh sách]
- **Liên hệ hỗ trợ:** [Tên và số điện thoại]

## Thông tin liên hệ khẩn cấp
- **Số điện thoại:** [Số điện thoại]
- **Email:** [Email]
- **Thời gian có thể liên hệ:** [Giờ]

## Ghi chú bổ sung
[Ghi chú thêm nếu có]

---
*Tài liệu này được tạo tự động bởi hệ thống quản lý nhân sự*
*Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}*`;

    // Tạo file download
    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template-ban-giao-cong-viec-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert('Template tài liệu bàn giao đã được tải xuống!');
  };

  const handleScheduleMeeting = () => {
    // Tạo link Google Calendar hoặc Outlook
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000); // 1 tiếng sau
    
    const startTime = tomorrow.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTimeStr = endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent('Meeting bàn giao công việc');
    const details = encodeURIComponent(`Meeting để bàn giao công việc khi nghỉ phép.
    
Chuẩn bị:
- Danh sách công việc cần bàn giao
- Tài liệu hướng dẫn chi tiết
- Thông tin truy cập hệ thống
- Danh sách liên hệ khẩn cấp`);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTimeStr}&details=${details}`;
    
    // Mở Google Calendar
    window.open(googleCalendarUrl, '_blank');
    
    alert('Đang mở Google Calendar để lên lịch meeting...');
  };

  const delegationSteps = [
    {
      id: 'step1',
      title: 'Bước 1: Tạo đơn nghỉ phép',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Khi bạn cần nghỉ phép, hãy tạo đơn nghỉ phép và chọn các công việc cần bàn giao',
      details: [
        'Truy cập trang "Leave Request" (Tạo đơn nghỉ phép)',
        'Điền đầy đủ thông tin: loại nghỉ, ngày bắt đầu/kết thúc, lý do',
        'Chọn các công việc hiện tại cần bàn giao',
        'Chọn người sẽ nhận bàn giao công việc',
        'Gửi đơn nghỉ phép để được phê duyệt'
      ],
      tips: [
        'Nên tạo đơn nghỉ phép trước ít nhất 3 ngày',
        'Chọn người có kinh nghiệm phù hợp với công việc',
        'Ghi rõ lý do nghỉ phép để quản lý có thể đánh giá'
      ]
    },
    {
      id: 'step2',
      title: 'Bước 2: Chuẩn bị bàn giao',
      icon: <FileText className="h-5 w-5" />,
      description: 'Sau khi đơn nghỉ phép được phê duyệt, chuẩn bị tài liệu và thông tin bàn giao',
      details: [
        'Tạo tài liệu hướng dẫn chi tiết cho từng công việc',
        'Liệt kê các file, tài khoản, công cụ cần thiết',
        'Ghi chú về deadline và mức độ ưu tiên',
        'Chuẩn bị danh sách liên hệ khẩn cấp',
        'Sắp xếp meeting bàn giao với người nhận'
      ],
      tips: [
        'Tài liệu bàn giao càng chi tiết càng tốt',
        'Nên có backup plan nếu người nhận không thể thực hiện',
        'Chuẩn bị trước các câu hỏi thường gặp'
      ]
    },
    {
      id: 'step3',
      title: 'Bước 3: Thực hiện bàn giao',
      icon: <Users className="h-5 w-5" />,
      description: 'Tiến hành meeting bàn giao và chuyển giao công việc',
      details: [
        'Tổ chức meeting bàn giao với người nhận',
        'Giải thích chi tiết từng công việc và yêu cầu',
        'Chia sẻ quyền truy cập các hệ thống cần thiết',
        'Giới thiệu với các stakeholder liên quan',
        'Xác nhận người nhận đã hiểu rõ trách nhiệm'
      ],
      tips: [
        'Nên có người thứ 3 làm witness trong meeting',
        'Ghi lại meeting để có thể tham khảo sau',
        'Đảm bảo người nhận có đủ quyền hạn để thực hiện'
      ]
    },
    {
      id: 'step4',
      title: 'Bước 4: Theo dõi tiến độ',
      icon: <Clock className="h-5 w-5" />,
      description: 'Trong thời gian nghỉ phép, theo dõi tiến độ công việc được bàn giao',
      details: [
        'Thiết lập lịch check-in định kỳ với người nhận',
        'Theo dõi tiến độ qua hệ thống Task Delegation',
        'Hỗ trợ khi người nhận gặp khó khăn',
        'Cập nhật trạng thái công việc trong hệ thống',
        'Báo cáo tiến độ cho quản lý khi cần'
      ],
      tips: [
        'Không nên can thiệp quá sâu vào công việc đã bàn giao',
        'Chỉ hỗ trợ khi thực sự cần thiết',
        'Tin tưởng người nhận và để họ tự chủ'
      ]
    },
    {
      id: 'step5',
      title: 'Bước 5: Hoàn tất và đánh giá',
      icon: <CheckCircle className="h-5 w-5" />,
      description: 'Khi quay lại làm việc, đánh giá kết quả bàn giao và rút kinh nghiệm',
      details: [
        'Kiểm tra tình trạng các công việc đã bàn giao',
        'Thu thập feedback từ người nhận bàn giao',
        'Cập nhật trạng thái hoàn thành trong hệ thống',
        'Đánh giá hiệu quả của quá trình bàn giao',
        'Rút kinh nghiệm cho lần bàn giao tiếp theo'
      ],
      tips: [
        'Cảm ơn người đã nhận bàn giao công việc',
        'Ghi nhận những điểm tốt và cần cải thiện',
        'Chia sẻ kinh nghiệm với đồng nghiệp'
      ]
    }
  ];

  const delegationTypes = [
    {
      type: 'Nghỉ phép thường (1-12 ngày)',
      strategy: 'Bàn giao tạm thời',
      description: 'Chọn đồng nghiệp có kinh nghiệm tương tự để bàn giao công việc',
      color: 'blue'
    },
    {
      type: 'Nghỉ ốm (1-5 ngày)',
      strategy: 'Xử lý khẩn cấp',
      description: 'Bàn giao cho đồng nghiệp gần nhất có thể hỗ trợ ngay',
      color: 'red'
    },
    {
      type: 'Nghỉ thai sản (280 ngày)',
      strategy: 'Thay thế dài hạn',
      description: 'Tìm người thay thế chính thức hoặc thuê ngoài',
      color: 'purple'
    },
    {
      type: 'Nghỉ khẩn cấp (1-3 ngày)',
      strategy: 'Hỗ trợ tức thì',
      description: 'Delegate cho người có sẵn và có thể xử lý ngay',
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Hướng dẫn bàn giao công việc</h2>
        </div>
        <p className="text-gray-700">
          Quy trình chi tiết để thực hiện bàn giao công việc khi nghỉ phép một cách hiệu quả
        </p>
      </div>

      {/* Delegation Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Các loại bàn giao theo từng hình thức nghỉ phép</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {delegationTypes.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 border-${item.color}-500 bg-${item.color}-50`}>
              <h4 className={`font-medium text-${item.color}-900 mb-2`}>{item.type}</h4>
              <p className={`text-sm text-${item.color}-800 font-medium mb-1`}>{item.strategy}</p>
              <p className={`text-sm text-${item.color}-700`}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-step Guide */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quy trình bàn giao công việc từng bước</h3>
        
        <div className="space-y-4">
          {delegationSteps.map((step, index) => (
            <div key={step.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      {step.icon}
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                    </div>
                  </div>
                  {expandedSteps[step.id] ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 ml-11">{step.description}</p>
              </button>
              
              {expandedSteps[step.id] && (
                <div className="px-4 pb-4 ml-11">
                  <div className="space-y-4">
                    {/* Details */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Chi tiết thực hiện:</h5>
                      <ul className="space-y-1">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                            <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h5 className="font-medium text-yellow-900 mb-2 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Lưu ý quan trọng:</span>
                      </h5>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start space-x-2 text-sm text-yellow-800">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bắt đầu ngay</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Tạo đơn nghỉ phép</h4>
            <p className="text-sm text-gray-600 mb-3">Bắt đầu quy trình bàn giao công việc</p>
            <button 
              onClick={handleCreateLeaveRequest}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              Tạo đơn nghỉ phép →
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Tạo tài liệu bàn giao</h4>
            <p className="text-sm text-gray-600 mb-3">Chuẩn bị tài liệu hướng dẫn chi tiết</p>
            <button 
              onClick={handleCreateTemplate}
              className="text-green-600 text-sm font-medium hover:text-green-700"
            >
              Tạo template →
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Lên lịch meeting</h4>
            <p className="text-sm text-gray-600 mb-3">Sắp xếp meeting bàn giao với đồng nghiệp</p>
            <button 
              onClick={handleScheduleMeeting}
              className="text-purple-600 text-sm font-medium hover:text-purple-700"
            >
              Lên lịch ngay →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegationGuide;
