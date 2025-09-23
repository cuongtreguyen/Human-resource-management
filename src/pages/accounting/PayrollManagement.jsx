import React, { useState } from "react";

const PayrollManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const payrollData = [
    {
      id: 1,
      employeeName: "Nguyễn Văn A",
      department: "IT",
      position: "Developer",
      basicSalary: 15000000,
      overtime: 2000000,
      bonus: 1000000,
      deductions: 500000,
      netSalary: 17500000,
      status: "paid"
    },
    {
      id: 2,
      employeeName: "Trần Thị B",
      department: "Design",
      position: "Designer",
      basicSalary: 12000000,
      overtime: 0,
      bonus: 500000,
      deductions: 300000,
      netSalary: 12200000,
      status: "pending"
    },
    {
      id: 3,
      employeeName: "Lê Văn C",
      department: "HR",
      position: "Manager",
      basicSalary: 20000000,
      overtime: 1000000,
      bonus: 2000000,
      deductions: 800000,
      netSalary: 22200000,
      status: "paid"
    }
  ];

  const departments = ["IT", "Design", "HR", "Finance", "Marketing"];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      default: return 'Không xác định';
    }
  };

  const handleViewDetail = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    console.log('Xuất bảng lương');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const paidCount = payrollData.filter(emp => emp.status === 'paid').length;
  const pendingCount = payrollData.filter(emp => emp.status === 'pending').length;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Quản lý lương</h2>
          <p className="text-muted">Quản lý và tính toán lương cho nhân viên</p>
        </div>
        <button 
          className="btn btn-success d-flex align-items-center"
          onClick={handleExport}
        >
          <i className="bi bi-download me-2"></i>
          <span>Xuất bảng lương</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Tháng</label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Phòng ban</label>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100">
                <i className="bi bi-search me-2"></i>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded p-2 me-3">
                  <i className="bi bi-currency-dollar text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Tổng lương</p>
                  <h5 className="mb-0">{formatCurrency(totalPayroll)}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded p-2 me-3">
                  <i className="bi bi-people text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Tổng nhân viên</p>
                  <h4 className="mb-0">{payrollData.length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded p-2 me-3">
                  <i className="bi bi-check text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Đã thanh toán</p>
                  <h4 className="mb-0">{paidCount}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded p-2 me-3">
                  <i className="bi bi-clock text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Chờ xử lý</p>
                  <h4 className="mb-0">{pendingCount}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="card-title mb-0">Bảng lương tháng {selectedMonth}</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nhân viên</th>
                  <th>Lương cơ bản</th>
                  <th>Tăng ca</th>
                  <th>Thưởng</th>
                  <th>Khấu trừ</th>
                  <th>Lương thực lĩnh</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{employee.employeeName}</div>
                          <small className="text-muted">{employee.position} - {employee.department}</small>
                        </div>
                      </div>
                    </td>
                    <td>{formatCurrency(employee.basicSalary)}</td>
                    <td>{formatCurrency(employee.overtime)}</td>
                    <td>{formatCurrency(employee.bonus)}</td>
                    <td>{formatCurrency(employee.deductions)}</td>
                    <td className="fw-bold">{formatCurrency(employee.netSalary)}</td>
                    <td>
                      <span className={`badge ${getStatusColor(employee.status)}`}>
                        {getStatusText(employee.status)}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleViewDetail(employee)}
                          title="Xem chi tiết"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-success"
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil"></i>
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

      {/* Detail Modal */}
      {showDetailModal && selectedPayroll && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết bảng lương</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Nhân viên</label>
                    <p className="form-control-plaintext">{selectedPayroll.employeeName}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vị trí</label>
                    <p className="form-control-plaintext">{selectedPayroll.position}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phòng ban</label>
                    <p className="form-control-plaintext">{selectedPayroll.department}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tháng</label>
                    <p className="form-control-plaintext">{selectedMonth}</p>
                  </div>
                  <div className="col-12">
                    <hr />
                    <h6 className="fw-semibold">Chi tiết lương</h6>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Lương cơ bản</label>
                    <p className="form-control-plaintext fw-semibold">{formatCurrency(selectedPayroll.basicSalary)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tăng ca</label>
                    <p className="form-control-plaintext text-success">{formatCurrency(selectedPayroll.overtime)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Thưởng</label>
                    <p className="form-control-plaintext text-success">{formatCurrency(selectedPayroll.bonus)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Khấu trừ</label>
                    <p className="form-control-plaintext text-danger">{formatCurrency(selectedPayroll.deductions)}</p>
                  </div>
                  <div className="col-12">
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label fw-bold fs-5">Lương thực lĩnh</label>
                      <span className="fs-4 fw-bold text-primary">{formatCurrency(selectedPayroll.netSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
                <button type="button" className="btn btn-primary">
                  In bảng lương
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;