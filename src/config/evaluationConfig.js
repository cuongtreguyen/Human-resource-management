// Evaluation Configuration - Dynamic, not hardcoded
export const REVIEW_TYPES = [
    { value: 'annual', label: 'Đánh giá thường niên' },
    { value: 'mid-year', label: 'Đánh giá giữa năm' },
    { value: 'probation', label: 'Đánh giá thử việc' },
    { value: 'project', label: 'Đánh giá theo dự án' }
];

export const RATING_SCALE = {
    5: {
        label: 'Outstanding',
        labelVi: 'Xuất sắc',
        description: 'Vượt trội, vượt xa kỳ vọng',
        color: 'green'
    },
    4: {
        label: 'Exceeds Expectations',
        labelVi: 'Vượt mong đợi',
        description: 'Thường xuyên vượt mức kỳ vọng',
        color: 'blue'
    },
    3: {
        label: 'Meets Expectations',
        labelVi: 'Đạt yêu cầu',
        description: 'Đáp ứng đầy đủ yêu cầu công việc',
        color: 'yellow'
    },
    2: {
        label: 'Needs Improvement',
        labelVi: 'Cần cải thiện',
        description: 'Một số khía cạnh cần cải thiện',
        color: 'orange'
    },
    1: {
        label: 'Unsatisfactory',
        labelVi: 'Không đạt',
        description: 'Không đáp ứng yêu cầu cơ bản',
        color: 'red'
    }
};

// Core Competencies - Apply to all employees
export const CORE_COMPETENCIES = [
    {
        id: 'job_performance',
        name: 'Hiệu suất công việc',
        nameEn: 'Job Performance',
        description: 'Khả năng hoàn thành công việc đúng hạn và chất lượng',
        weight: 20
    },
    {
        id: 'communication',
        name: 'Kỹ năng giao tiếp',
        nameEn: 'Communication Skills',
        description: 'Giao tiếp hiệu quả với đồng nghiệp và khách hàng',
        weight: 15
    },
    {
        id: 'teamwork',
        name: 'Tinh thần làm việc nhóm',
        nameEn: 'Teamwork',
        description: 'Hợp tác và hỗ trợ đồng nghiệp',
        weight: 15
    },
    {
        id: 'adaptability',
        name: 'Khả năng thích nghi',
        nameEn: 'Adaptability',
        description: 'Linh hoạt với thay đổi và tình huống mới',
        weight: 10
    },
    {
        id: 'problem_solving',
        name: 'Giải quyết vấn đề',
        nameEn: 'Problem Solving',
        description: 'Tìm giải pháp hiệu quả cho các vấn đề phát sinh',
        weight: 10
    },
    {
        id: 'initiative',
        name: 'Tính chủ động',
        nameEn: 'Initiative',
        description: 'Chủ động đề xuất và thực hiện cải tiến',
        weight: 10
    },
    {
        id: 'quality_work',
        name: 'Chất lượng công việc',
        nameEn: 'Quality of Work',
        description: 'Độ chính xác và chuyên nghiệp trong công việc',
        weight: 10
    },
    {
        id: 'customer_focus',
        name: 'Định hướng khách hàng',
        nameEn: 'Customer Focus',
        description: 'Tập trung vào nhu cầu và sự hài lòng của khách hàng',
        weight: 10
    }
];

// Technical Competencies - Vary by position
export const TECHNICAL_COMPETENCIES_BY_ROLE = {
    developer: [
        {
            id: 'coding_skills',
            name: 'Kỹ năng lập trình',
            nameEn: 'Coding Skills',
            description: 'Khả năng viết code chất lượng cao',
            weight: 30
        },
        {
            id: 'technical_knowledge',
            name: 'Kiến thức kỹ thuật',
            nameEn: 'Technical Knowledge',
            description: 'Hiểu biểu về công nghệ và best practices',
            weight: 25
        },
        {
            id: 'debugging',
            name: 'Debug và tối ưu',
            nameEn: 'Debugging & Optimization',
            description: 'Khả năng tìm lỗi và tối ưu performance',
            weight: 20
        }
    ],
    marketing: [
        {
            id: 'campaign_management',
            name: 'Quản lý chiến dịch',
            nameEn: 'Campaign Management',
            description: 'Lập kế hoạch và thực hiện chiến dịch marketing',
            weight: 30
        },
        {
            id: 'analytics',
            name: 'Phân tích dữ liệu',
            nameEn: 'Data Analytics',
            description: 'Phân tích metrics và ROI',
            weight: 25
        },
        {
            id: 'content_creation',
            name: 'Sáng tạo nội dung',
            nameEn: 'Content Creation',
            description: 'Tạo nội dung hấp dẫn và hiệu quả',
            weight: 20
        }
    ],
    sales: [
        {
            id: 'sales_achievement',
            name: 'Đạt chỉ tiêu bán hàng',
            nameEn: 'Sales Achievement',
            description: 'Hoàn thành và vượt chỉ tiêu doanh số',
            weight: 35
        },
        {
            id: 'customer_relationship',
            name: 'Quan hệ khách hàng',
            nameEn: 'Customer Relationship',
            description: 'Xây dựng và duy trì mối quan hệ với khách hàng',
            weight: 25
        },
        {
            id: 'negotiation',
            name: 'Đàm phán',
            nameEn: 'Negotiation',
            description: 'Kỹ năng thương lượng và chốt deal',
            weight: 15
        }
    ]
};

// Leadership Competencies - For managers only
export const LEADERSHIP_COMPETENCIES = [
    {
        id: 'people_management',
        name: 'Quản lý nhân sự',
        nameEn: 'People Management',
        description: 'Lãnh đạo, động viên và phát triển nhân viên',
        weight: 30
    },
    {
        id: 'decision_making',
        name: 'Ra quyết định',
        nameEn: 'Decision Making',
        description: 'Đưa ra quyết định đúng đắn và kịp thời',
        weight: 25
    },
    {
        id: 'strategic_thinking',
        name: 'Tư duy chiến lược',
        nameEn: 'Strategic Thinking',
        description: 'Định hướng và lập kế hoạch dài hạn',
        weight: 20
    },
    {
        id: 'delegation',
        name: 'Phân công công việc',
        nameEn: 'Delegation',
        description: 'Phân công hiệu quả và trao quyền',
        weight: 15
    },
    {
        id: 'conflict_resolution',
        name: 'Giải quyết xung đột',
        nameEn: 'Conflict Resolution',
        description: 'Xử lý mâu thuẫn trong team',
        weight: 10
    }
];

export const APPROVAL_ROLES = [
    { value: 'direct_manager', label: 'Quản lý trực tiếp', order: 1 },
    { value: 'hr_manager', label: 'HR Manager', order: 2 },
    { value: 'department_head', label: 'Trưởng phòng/ban', order: 3 }
];

export const REVIEW_STATUS = {
    draft: { label: 'Nháp', color: 'gray' },
    submitted: { label: 'Đã nộp', color: 'blue' },
    in_review: { label: 'Đang xem xét', color: 'yellow' },
    calibration: { label: 'Điều chỉnh', color: 'orange' },
    approved: { label: 'Đã phê duyệt', color: 'green' },
    acknowledged: { label: 'Nhân viên đã xác nhận', color: 'purple' }
};

export const TRAINING_PRIORITIES = [
    { value: 'high', label: 'Cao', color: 'red' },
    { value: 'medium', label: 'Trung bình', color: 'yellow' },
    { value: 'low', label: 'Thấp', color: 'green' }
];
