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
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "Trưởng phòng IT",
      department: "Công nghệ thông tin",
      status: "available",
      location: "Hồ Chí Minh",
      skills: ["React", "Node.js", "Python", "Leadership"],
      lastSeen: new Date(),
      employeeId: "EMP001",
      joinDate: "2020-03-15",
      salary: 25000000,
      activities: [
        { type: "checkin", time: "08:30", date: new Date().toISOString().split("T")[0], status: "on-time" },
        { type: "meeting", time: "10:00", date: new Date().toISOString().split("T")[0], status: "completed", title: "Họp team IT" }
      ]
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tran.thi.binh@company.com",
      phone: "0901234568",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "Nhân viên Marketing",
      department: "Marketing",
      status: "busy",
      location: "Hà Nội",
      skills: ["Digital Marketing", "SEO", "Content Writing"],
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      employeeId: "EMP002",
      joinDate: "2021-06-20",
      salary: 18000000,
      activities: [
        { type: "checkin", time: "08:45", date: new Date().toISOString().split("T")[0], status: "late" },
        { type: "overtime", time: "19:00", date: "2024-01-13", status: "approved", hours: 2 }
      ]
    }
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

        <SearchFilters filters={filters} onFiltersChange={setFilters} departments={departments} roles={roles} />
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
