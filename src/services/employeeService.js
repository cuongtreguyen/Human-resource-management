// src/services/employeeService.js
// Service để quản lý dữ liệu nhân viên dùng chung

// Sample employees data (từ team-directory)
export const sampleEmployees = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@company.com",
    phone: "0901234567",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Trưởng phòng IT",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["React", "Node.js", "Python", "Leadership"],
    employeeId: "EMP001",
    joinDate: "2020-03-15",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tran.thi.binh@company.com",
    phone: "0901234568",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Nhân viên Marketing",
    department: "Marketing",
    status: "busy",
    location: "Hà Nội",
    skills: ["Digital Marketing", "SEO", "Content Writing"],
    employeeId: "EMP002",
    joinDate: "2021-06-20",
  },
  {
    id: 3,
    name: "Lê Minh Hoàng",
    email: "le.minh.hoang@company.com",
    phone: "0901234569",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    role: "Kỹ sư phần mềm",
    department: "Công nghệ thông tin",
    status: "offline",
    location: "Đà Nẵng",
    skills: ["Java", "Spring Boot", "MySQL"],
    employeeId: "EMP003",
    joinDate: "2019-11-02",
  },
  {
    id: 4,
    name: "Phạm Thị Hạnh",
    email: "pham.thi.hanh@company.com",
    phone: "0901234570",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Nhân sự",
    department: "Nhân sự",
    status: "away",
    location: "Cần Thơ",
    skills: ["Recruitment", "Employee Relations", "HR Policies"],
    employeeId: "EMP004",
    joinDate: "2022-05-14",
  },
  {
    id: 5,
    name: "Hoàng Minh Quân",
    email: "hoang.minh.quan@company.com",
    phone: "0901234571",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "Kỹ sư phần mềm",
    department: "Công nghệ thông tin",
    status: "busy",
    location: "Hồ Chí Minh",
    skills: ["C#", ".NET", "Azure"],
    employeeId: "EMP005",
    joinDate: "2021-01-09",
  },
  {
    id: 6,
    name: "Nguyễn Thị Mai",
    email: "nguyen.thi.mai@company.com",
    phone: "0901234572",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    role: "Thiết kế UI/UX",
    department: "Thiết kế",
    status: "available",
    location: "Đà Nẵng",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    employeeId: "EMP006",
    joinDate: "2020-09-28",
  },
  {
    id: 7,
    name: "Nguyễn Văn Nam",
    email: "nguyen.van.nam@company.com",
    phone: "0901234573",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    role: "Quản lý dự án",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Cần Thơ",
    skills: ["Agile", "Scrum", "Project Management"],
    employeeId: "EMP009",
    joinDate: "2018-07-12",
  },
  {
    id: 8,
    name: "Trần Văn Đức",
    email: "tran.van.duc@company.com",
    phone: "0901234574",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    role: "Kỹ sư DevOps",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Hà Nội",
    skills: ["Docker", "Kubernetes", "AWS"],
    employeeId: "EMP010",
    joinDate: "2020-12-03",
  },
  // Thêm nhân viên cho Công nghệ thông tin
  {
    id: 9,
    name: "Vũ Thị Lan",
    email: "vu.thi.lan@company.com",
    phone: "0901234575",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    role: "Frontend Developer",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["React", "Vue.js", "TypeScript"],
    employeeId: "EMP011",
    joinDate: "2021-03-10",
  },
  {
    id: 10,
    name: "Đỗ Minh Tuấn",
    email: "do.minh.tuan@company.com",
    phone: "0901234576",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    role: "Backend Developer",
    department: "Công nghệ thông tin",
    status: "busy",
    location: "Đà Nẵng",
    skills: ["Node.js", "MongoDB", "Express"],
    employeeId: "EMP012",
    joinDate: "2020-08-15",
  },
  {
    id: 11,
    name: "Bùi Thị Hoa",
    email: "bui.thi.hoa@company.com",
    phone: "0901234577",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    role: "QA Engineer",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Hà Nội",
    skills: ["Testing", "Selenium", "Jest"],
    employeeId: "EMP013",
    joinDate: "2021-11-20",
  },
  {
    id: 12,
    name: "Nguyễn Văn Thành",
    email: "nguyen.van.thanh@company.com",
    phone: "0901234578",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    role: "Mobile Developer",
    department: "Công nghệ thông tin",
    status: "away",
    location: "Cần Thơ",
    skills: ["React Native", "Flutter", "iOS"],
    employeeId: "EMP014",
    joinDate: "2022-01-05",
  },
  {
    id: 13,
    name: "Lê Thị Mai",
    email: "le.thi.mai@company.com",
    phone: "0901234579",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "Data Analyst",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["Python", "SQL", "Tableau"],
    employeeId: "EMP015",
    joinDate: "2021-07-12",
  },
  {
    id: 14,
    name: "Phạm Văn Hùng",
    email: "pham.van.hung@company.com",
    phone: "0901234580",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    role: "System Admin",
    department: "Công nghệ thông tin",
    status: "busy",
    location: "Đà Nẵng",
    skills: ["Linux", "Docker", "Monitoring"],
    employeeId: "EMP016",
    joinDate: "2019-05-18",
  },
  {
    id: 15,
    name: "Trần Thị Nga",
    email: "tran.thi.nga@company.com",
    phone: "0901234581",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    role: "UI/UX Designer",
    department: "Công nghệ thông tin",
    status: "available",
    location: "Hà Nội",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    employeeId: "EMP017",
    joinDate: "2020-12-01",
  },
  // Thêm nhân viên cho Marketing
  {
    id: 16,
    name: "Hoàng Văn Đức",
    email: "hoang.van.duc@company.com",
    phone: "0901234582",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    role: "Marketing Manager",
    department: "Marketing",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["Digital Marketing", "Brand Management", "Analytics"],
    employeeId: "EMP018",
    joinDate: "2018-09-15",
  },
  {
    id: 17,
    name: "Nguyễn Thị Linh",
    email: "nguyen.thi.linh@company.com",
    phone: "0901234583",
    avatar: "https://randomuser.me/api/portraits/women/31.jpg",
    role: "Content Creator",
    department: "Marketing",
    status: "busy",
    location: "Đà Nẵng",
    skills: ["Content Writing", "Social Media", "SEO"],
    employeeId: "EMP019",
    joinDate: "2021-04-22",
  },
  {
    id: 18,
    name: "Lê Văn Minh",
    email: "le.van.minh@company.com",
    phone: "0901234584",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "PPC Specialist",
    department: "Marketing",
    status: "available",
    location: "Cần Thơ",
    skills: ["Google Ads", "Facebook Ads", "Analytics"],
    employeeId: "EMP020",
    joinDate: "2022-02-10",
  },
  // Thêm nhân viên cho Nhân sự
  {
    id: 19,
    name: "Vũ Thị Hương",
    email: "vu.thi.huong@company.com",
    phone: "0901234585",
    avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    role: "HR Manager",
    department: "Nhân sự",
    status: "available",
    location: "Hà Nội",
    skills: ["Recruitment", "Employee Relations", "HR Policies"],
    employeeId: "EMP021",
    joinDate: "2017-11-08",
  },
  {
    id: 20,
    name: "Đỗ Văn Tùng",
    email: "do.van.tung@company.com",
    phone: "0901234586",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "HR Specialist",
    department: "Nhân sự",
    status: "busy",
    location: "Hồ Chí Minh",
    skills: ["Payroll", "Benefits", "Compliance"],
    employeeId: "EMP022",
    joinDate: "2020-06-14",
  },
  {
    id: 21,
    name: "Bùi Thị Thu",
    email: "bui.thi.thu@company.com",
    phone: "0901234587",
    avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    role: "Training Coordinator",
    department: "Nhân sự",
    status: "available",
    location: "Đà Nẵng",
    skills: ["Training", "Development", "Onboarding"],
    employeeId: "EMP023",
    joinDate: "2021-09-03",
  },
  // Thêm nhân viên cho Thiết kế
  {
    id: 22,
    name: "Nguyễn Văn Long",
    email: "nguyen.van.long@company.com",
    phone: "0901234588",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg",
    role: "Graphic Designer",
    department: "Thiết kế",
    status: "available",
    location: "Cần Thơ",
    skills: ["Photoshop", "Illustrator", "Branding"],
    employeeId: "EMP024",
    joinDate: "2020-10-25",
  },
  {
    id: 23,
    name: "Lê Thị Hoa",
    email: "le.thi.hoa@company.com",
    phone: "0901234589",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    role: "Web Designer",
    department: "Thiết kế",
    status: "busy",
    location: "Hà Nội",
    skills: ["Web Design", "Responsive Design", "CSS"],
    employeeId: "EMP025",
    joinDate: "2021-12-18",
  },
  // Thêm nhân viên cho Sales
  {
    id: 24,
    name: "Phạm Văn Nam",
    email: "pham.van.nam@company.com",
    phone: "0901234590",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    role: "Sales Manager",
    department: "Sales",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["Sales Strategy", "CRM", "Negotiation"],
    employeeId: "EMP026",
    joinDate: "2019-02-28",
  },
  {
    id: 25,
    name: "Trần Thị Vân",
    email: "tran.thi.van@company.com",
    phone: "0901234591",
    avatar: "https://randomuser.me/api/portraits/women/37.jpg",
    role: "Sales Executive",
    department: "Sales",
    status: "busy",
    location: "Đà Nẵng",
    skills: ["Lead Generation", "Client Relations", "Sales"],
    employeeId: "EMP027",
    joinDate: "2022-03-12",
  }
];

// Mock API functions
export const employeeService = {
  // Lấy tất cả nhân viên
  getAllEmployees: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: sampleEmployees
        });
      }, 500);
    });
  },

  // Lấy nhân viên theo department
  getEmployeesByDepartment: async (department) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = sampleEmployees.filter(emp => 
          emp.department === department
        );
        resolve({
          success: true,
          data: filtered
        });
      }, 300);
    });
  },

  // Tìm kiếm nhân viên
  searchEmployees: async (searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = sampleEmployees.filter(emp => 
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve({
          success: true,
          data: filtered
        });
      }, 300);
    });
  },

  // Lấy nhân viên theo ID
  getEmployeeById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = sampleEmployees.find(emp => emp.id === id);
        resolve({
          success: !!employee,
          data: employee
        });
      }, 200);
    });
  },

  // Lấy danh sách departments
  getDepartments: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = [...new Set(sampleEmployees.map(emp => emp.department))];
        resolve({
          success: true,
          data: departments
        });
      }, 200);
    });
  }
};

// Helper functions
export const getEmployeeInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getEmployeeAvatar = (employee) => {
  if (employee.avatar) return employee.avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=6366f1&color=fff`;
};

export default employeeService;
