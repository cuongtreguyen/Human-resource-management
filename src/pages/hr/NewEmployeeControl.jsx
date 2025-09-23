import React, { useState } from "react";

const NewEmployeeControl = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const newEmployees = [
    {
      id: 1,
      name: "Nguyễn Thị E",
      position: "Marketing Specialist",
      department: "Marketing",
      applyDate: "2024-01-15",
      status: "pending",
      documents: ["CV", "Bằng cấp", "CMND"],
      interviewDate: "2024-01-20",
      experience: "3 năm",
      education: "Đại học Kinh tế",
      skills: ["Digital Marketing", "SEO", "Content Writing"]
    },
    {
      id: 2,
      name: "Trần Văn F",
      position: "Backend Developer",
      department: "IT",
      applyDate: "2024-01-10",
      status: "approved",
      documents: ["CV", "Bằng cấp", "CMND", "Giấy khám sức khỏe"],
      interviewDate: "2024-01-18",
      experience: "5 năm",
      education: "Đại học Công nghệ",
      skills: ["Node.js", "Python", "Database"]
    },
    {
      id: 3,
      name: "Lê Thị G",
      position: "UI/UX Designer",
      department: "Design",
      applyDate: "2024-01-12",
      status: "rejected",
      documents: ["CV", "Portfolio"],
      interviewDate: "2024-01-19",
      experience: "2 năm",
      education: "Đại học Mỹ thuật",
      skills: ["Figma", "Adobe Creative Suite", "Prototyping"]
    }
  ];

  const filteredEmployees = newEmployees.filter(emp => emp.status === selectedTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleApprove = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn duyệt ứng viên này?')) {
      console.log('Duyệt ứng viên:', id);
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối ứng viên này?')) {
      console.log('Từ chối ứng viên:', id);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Kiểm soát nhân viên mới</h2>
          <p className="text-muted">Quản lý hồ sơ ứng viên và quy trình tuyển dụng</p>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge bg-primary me-2">
            {newEmployees.filter(emp => emp.status === 'pending').length} chờ duyệt
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {[
              { key: 'pending', label: 'Chờ duyệt', count: newEmployees.filter(emp => emp.status === 'pending').length },
              { key: 'approved', label: 'Đã duyệt', count: newEmployees.filter(emp => emp.status === 'approved').length },
              { key: 'rejected', label: 'Từ chối', count: newEmployees.filter(emp => emp.status === 'rejected').length }
            ].map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${selectedTab === tab.key ? 'active' : ''}`}
                  onClick={() => setSelectedTab(tab.key)}
                >
                  {tab.label}
                  <span className="badge bg-secondary ms-2">{tab.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">
          <div className="row g-3">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="col-12">
                <div className="card border">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '48px', height: '48px'}}>
                          <i className="bi bi-person-check text-white"></i>
                        </div>
                        <div>
                          <h5 className="card-title mb-1">{employee.name}</h5>
                          <p className="text-muted mb-2">{employee.position} - {employee.department}</p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              Nộp hồ sơ: {employee.applyDate}
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              Phỏng vấn: {employee.interviewDate}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${getStatusColor(employee.status)}`}>
                          {getStatusText(employee.status)}
                        </span>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleViewDetail(employee)}
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {employee.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-outline-success"
                                onClick={() => handleApprove(employee.id)}
                                title="Duyệt"
                              >
                                <i className="bi bi-check"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleReject(employee.id)}
                                title="Từ chối"
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-2">Tài liệu:</span>
                        <div className="d-flex gap-1">
                          {employee.documents.map((doc, index) => (
                            <span key={index} className="badge bg-light text-dark">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết ứng viên</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Họ và tên</label>
                    <p className="form-control-plaintext">{selectedEmployee.name}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vị trí ứng tuyển</label>
                    <p className="form-control-plaintext">{selectedEmployee.position}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phòng ban</label>
                    <p className="form-control-plaintext">{selectedEmployee.department}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Kinh nghiệm</label>
                    <p className="form-control-plaintext">{selectedEmployee.experience}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Học vấn</label>
                    <p className="form-control-plaintext">{selectedEmployee.education}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Ngày nộp hồ sơ</label>
                    <p className="form-control-plaintext">{selectedEmployee.applyDate}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Kỹ năng</label>
                    <div className="d-flex gap-1">
                      {selectedEmployee.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Tài liệu đính kèm</label>
                    <div className="d-flex gap-1">
                      {selectedEmployee.documents.map((doc, index) => (
                        <span key={index} className="badge bg-success">{doc}</span>
                      ))}
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
                {selectedEmployee.status === 'pending' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => {
                        handleApprove(selectedEmployee.id);
                        setShowDetailModal(false);
                      }}
                    >
                      Duyệt
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => {
                        handleReject(selectedEmployee.id);
                        setShowDetailModal(false);
                      }}
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewEmployeeControl;