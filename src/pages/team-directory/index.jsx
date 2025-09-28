import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/ui/Layout";
import EmployeeCard from "./components/EmployeeCard";
import EmployeeModal from "./components/EmployeeModal";
import SearchFilters from "./components/SearchFilters";
import ViewToggle from "./components/ViewToggle";
import ExportOptions from "./components/ExportOptions";
import OrganizationChart from "./components/OrganizationChart";
import Icon from "../../components/AppIcon";

const TeamDirectory = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);

  // sample employees
  const sampleEmployees = [
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
    name: "Đỗ Thu Trang",
    email: "do.thu.trang@company.com",
    phone: "0901234574",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    role: "Kế toán viên",
    department: "Kế toán",
    status: "offline",
    location: "Hà Nội",
    skills: ["Excel", "Finance", "Tax"],
    employeeId: "EMP010",
    joinDate: "2021-12-01",
  },
  {
    id: 9,
    name: "Phan Quang Huy",
    email: "phan.quang.huy@company.com",
    phone: "0901234575",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    role: "Chuyên viên kinh doanh",
    department: "Kinh doanh",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["Sales", "Negotiation", "Customer Service"],
    employeeId: "EMP011",
    joinDate: "2020-10-10",
  },
  {
    id: 10,
    name: "Nguyễn Mỹ Linh",
    email: "nguyen.my.linh@company.com",
    phone: "0901234576",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    role: "Chuyên viên tuyển dụng",
    department: "Nhân sự",
    status: "away",
    location: "Đà Nẵng",
    skills: ["Interviewing", "Job Posting", "Onboarding"],
    employeeId: "EMP012",
    joinDate: "2023-01-03",
  },
  {
    id: 11,
    name: "Vũ Thành Long",
    email: "vu.thanh.long@company.com",
    phone: "0901234577",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "Frontend Developer",
    department: "Công nghệ thông tin",
    status: "available",
    location: "remote",
    skills: ["React", "Next.js", "TailwindCSS"],
    employeeId: "EMP013",
    joinDate: "2021-04-19",
  },
  {
    id: 12,
    name: "Lương Thị Hồng",
    email: "luong.thi.hong@company.com",
    phone: "0901234578",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "Data Analyst",
    department: "Phân tích dữ liệu",
    status: "busy",
    location: "remote",
    skills: ["SQL", "Python", "Tableau"],
    employeeId: "EMP014",
    joinDate: "2022-09-10",
  },
  {
    id: 13,
    name: "Nguyễn Hải Đăng",
    email: "nguyen.hai.dang@company.com",
    phone: "0901234579",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    role: "Chuyên viên pháp lý",
    department: "Pháp chế",
    status: "offline",
    location: "Hà Nội",
    skills: ["Law", "Compliance", "Contracts"],
    employeeId: "EMP015",
    joinDate: "2017-11-23",
  },
  {
    id: 14,
    name: "Trần Khánh Vy",
    email: "tran.khanh.vy@company.com",
    phone: "0901234580",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    role: "Content Creator",
    department: "Marketing",
    status: "available",
    location: "Hồ Chí Minh",
    skills: ["Copywriting", "Social Media", "Creative Writing"],
    employeeId: "EMP016",
    joinDate: "2021-02-18",
  },
  {
    id: 15,
    name: "Bùi Anh Tuấn",
    email: "bui.anh.tuan@company.com",
    phone: "0901234581",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    role: "DevOps Engineer",
    department: "Công nghệ thông tin",
    status: "busy",
    location: "Đà Nẵng",
    skills: ["AWS", "Docker", "Kubernetes"],
    employeeId: "EMP017",
    joinDate: "2020-06-15",
  },
  {
    id: 16,
    name: "Hoàng Yến Nhi",
    email: "hoang.yen.nhi@company.com",
    phone: "0901234582",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    role: "Chuyên viên đào tạo",
    department: "Nhân sự",
    status: "away",
    location: "remote",
    skills: ["Training", "Soft Skills", "Career Development"],
    employeeId: "EMP018",
    joinDate: "2019-05-05",
  },
  {
    id: 17,
    name: "Đặng Quang Thái",
    email: "dang.quang.thai@company.com",
    phone: "0901234583",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    role: "Network Engineer",
    department: "Hạ tầng",
    status: "available",
    location: "Hà Nội",
    skills: ["Networking", "Cisco", "Firewall"],
    employeeId: "EMP019",
    joinDate: "2021-08-09",
  },
  {
    id: 18,
    name: "Phạm Ngọc Bích",
    email: "pham.ngoc.bich@company.com",
    phone: "0901234584",
    avatar: "https://randomuser.me/api/portraits/women/81.jpg",
    role: "Graphic Designer",
    department: "Thiết kế",
    status: "offline",
    location: "Cần Thơ",
    skills: ["Illustrator", "Photoshop", "Branding"],
    employeeId: "EMP020",
    joinDate: "2022-11-30",
  },
  {
    id: 19,
    name: "Nguyễn Hoàng Phúc",
    email: "nguyen.hoang.phuc@company.com",
    phone: "0901234585",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    role: "Business Analyst",
    department: "Kinh doanh",
    status: "available",
    location: "remote",
    skills: ["Requirement Analysis", "SQL", "Documentation"],
    employeeId: "EMP021",
    joinDate: "2021-03-07",
  },
  {
    id: 20,
    name: "Lê Thu Hà",
    email: "le.thu.ha@company.com",
    phone: "0901234586",
    avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    role: "HR Manager",
    department: "Nhân sự",
    status: "busy",
    location: "Hồ Chí Minh",
    skills: ["Leadership", "Conflict Resolution", "Recruitment"],
    employeeId: "EMP022",
    joinDate: "2016-09-12",
  },
];


  useEffect(() => {
    setTimeout(() => {
      setEmployees(sampleEmployees);
      setFilteredEmployees(sampleEmployees);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = employees;

    if (filters.search) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter((emp) => emp.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter((emp) => emp.status === filters.status);
    }

    if (filters.role) {
      filtered = filtered.filter((emp) => emp.role.includes(filters.role));
    }

    setFilteredEmployees(filtered);
  }, [employees, filters]);

  const handleViewProfile = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSendMessage = (employee) => console.log("Send message to:", employee.name);
  const handleCall = (employee) => console.log("Call:", employee.name);
  const handleEmail = (employee) => window.open(`mailto:${employee.email}`);
  const handleAddEmployee = () => navigate("/recruitment-portal");

const departments = [...new Set(employees.map((emp) => emp.department))];
  const roles = [...new Set(employees.map((emp) => emp.role))];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Đang tải dữ liệu nhân viên...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">Quản lý nhân viên</h1>

<SearchFilters
  filters={filters}
  onSearch={(value) => setFilters({ ...filters, search: value })}
  onFilterChange={(newFilters) => setFilters(newFilters)}
  onClearFilters={() =>
    setFilters({ search: "", department: "", location: "", status: "", skills: "" })
  }
  />
          <div className="flex items-center space-x-4 mb-6">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <ExportOptions employees={filteredEmployees} onExport={(data) => console.log("Export:", data)} />
        </div>

        {showOrgChart ? (
          <OrganizationChart employees={filteredEmployees} />
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onViewProfile={handleViewProfile}
                onSendMessage={handleSendMessage}
                onCall={handleCall}
                onEmail={handleEmail}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {isModalOpen && selectedEmployee && (
          <EmployeeModal
            employee={selectedEmployee}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEmployee(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default TeamDirectory;
