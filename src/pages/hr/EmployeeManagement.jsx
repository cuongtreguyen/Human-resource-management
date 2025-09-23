import React, { useState } from "react";

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const employees = [
    { id: 1, name: "Nguyễn Văn A", position: "Developer", department: "IT", status: "active", joinDate: "2023-01-15", email: "nguyenvana@company.com", phone: "0123456789" },
    { id: 2, name: "Trần Thị B", position: "Designer", department: "Design", status: "active", joinDate: "2023-02-20", email: "tranthib@company.com", phone: "0123456788" },
    { id: 3, name: "Lê Văn C", position: "Manager", department: "HR", status: "active", joinDate: "2022-12-10", email: "levanc@company.com", phone: "0123456787" },
    { id: 4, name: "Phạm Thị D", position: "Accountant", department: "Finance", status: "inactive", joinDate: "2023-03-05", email: "phamthid@company.com", phone: "0123456786" },
    { id: 5, name: "Hoàng Văn E", position: "Marketing Specialist", department: "Marketing", status: "active", joinDate: "2023-04-10", email: "hoangvane@company.com", phone: "0123456785" },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDept === "all" || emp.department === filterDept;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      // Logic xóa nhân viên
      console.log('Xóa nhân viên:', id);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Quản lý nhân viên</h2>
          <p className="text-muted">Quản lý thông tin và trạng thái nhân viên</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => {
            setEditingEmployee(null);
            setShowAddModal(true);
          }}
        >
          <i className="bi bi-person-plus me-2"></i>
          <span>Thêm nhân viên</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="all">Tất cả phòng ban</option>
                <option value="IT">IT</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-funnel me-1"></i>
                  Lọc
                </button>
                <button className="btn btn-success">
                  <i className="bi bi-download me-1"></i>
                  Xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="card-title mb-0">Danh sách nhân viên ({filteredEmployees.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nhân viên</th>
                  <th>Vị trí</th>
                  <th>Phòng ban</th>
                  <th>Ngày vào làm</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{employee.name}</div>
                          <small className="text-muted">ID: {employee.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{employee.position}</td>
                    <td>
                      <span className="badge bg-info">{employee.department}</span>
                    </td>
                    <td>{employee.joinDate}</td>
                    <td>
                      <span className={`badge ${employee.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {employee.status === 'active' ? 'Hoạt động' : 'Nghỉ việc'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleEdit(employee)}
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(employee.id)}
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ và tên</label>
                    <input type="text" className="form-control" defaultValue={editingEmployee?.name || ''} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Vị trí</label>
                    <input type="text" className="form-control" defaultValue={editingEmployee?.position || ''} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phòng ban</label>
                    <select className="form-select" defaultValue={editingEmployee?.department || ''}>
                      <option value="">Chọn phòng ban</option>
                      <option value="IT">IT</option>
                      <option value="Design">Design</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ngày vào làm</label>
                    <input type="date" className="form-control" defaultValue={editingEmployee?.joinDate || ''} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" defaultValue={editingEmployee?.email || ''} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input type="tel" className="form-control" defaultValue={editingEmployee?.phone || ''} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-select" defaultValue={editingEmployee?.status || 'active'}>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Nghỉ việc</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button type="button" className="btn btn-primary">
                  {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;