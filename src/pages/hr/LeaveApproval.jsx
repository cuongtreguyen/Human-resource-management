import React, { useState } from "react";

const LeaveApproval = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const leaveRequests = [
    {
      id: 1,
      employeeName: "Nguyễn Văn A",
      department: "IT",
      leaveType: "Nghỉ phép năm",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      days: 5,
      reason: "Nghỉ phép cùng gia đình đi du lịch",
      status: "pending",
      submitDate: "2024-01-20",
      employeeId: "EMP001",
      phone: "0123456789"
    },
    {
      id: 2,
      employeeName: "Trần Thị B",
      department: "Design",
      leaveType: "Nghỉ ốm",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      days: 2,
      reason: "Bị cảm cúm, cần nghỉ ngơi",
      status: "approved",
      submitDate: "2024-01-24",
      employeeId: "EMP002",
      phone: "0123456788"
    },
    {
      id: 3,
      employeeName: "Lê Văn C",
      department: "HR",
      leaveType: "Nghỉ việc riêng",
      startDate: "2024-02-10",
      endDate: "2024-02-10",
      days: 1,
      reason: "Đi khám sức khỏe định kỳ",
      status: "rejected",
      submitDate: "2024-01-30",
      employeeId: "EMP003",
      phone: "0123456787"
    }
  ];

  const filteredRequests = leaveRequests.filter(req => req.status === selectedTab);

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

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Nghỉ phép năm': return 'bg-primary';
      case 'Nghỉ ốm': return 'bg-danger';
      case 'Nghỉ việc riêng': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn duyệt đơn nghỉ phép này?')) {
      console.log('Duyệt đơn nghỉ phép:', id);
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối đơn nghỉ phép này?')) {
      console.log('Từ chối đơn nghỉ phép:', id);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Duyệt đơn xin nghỉ phép</h2>
          <p className="text-muted">Quản lý và duyệt các đơn xin nghỉ phép của nhân viên</p>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge bg-warning me-2">
            {leaveRequests.filter(req => req.status === 'pending').length} chờ duyệt
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {[
              { key: 'pending', label: 'Chờ duyệt', count: leaveRequests.filter(req => req.status === 'pending').length },
              { key: 'approved', label: 'Đã duyệt', count: leaveRequests.filter(req => req.status === 'approved').length },
              { key: 'rejected', label: 'Từ chối', count: leaveRequests.filter(req => req.status === 'rejected').length }
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
            {filteredRequests.map((request) => (
              <div key={request.id} className="col-12">
                <div className="card border">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start">
                        <div className="bg-gradient-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '48px', height: '48px'}}>
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <h5 className="card-title mb-0 me-3">{request.employeeName}</h5>
                            <span className="badge bg-info">{request.department}</span>
                          </div>
                          
                          <div className="row g-3 mb-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-1">
                                <i className="bi bi-calendar text-muted me-2"></i>
                                <span className="text-muted small">Thời gian nghỉ:</span>
                              </div>
                              <p className="mb-0 small">
                                {request.startDate} - {request.endDate} ({request.days} ngày)
                              </p>
                            </div>
                            
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-1">
                                <i className="bi bi-clock text-muted me-2"></i>
                                <span className="text-muted small">Loại nghỉ phép:</span>
                              </div>
                              <span className={`badge ${getLeaveTypeColor(request.leaveType)}`}>
                                {request.leaveType}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-muted small fw-semibold">Lý do:</span>
                            <p className="mb-0 small">{request.reason}</p>
                          </div>
                          
                          <div className="text-muted" style={{fontSize: '0.75rem'}}>
                            Nộp đơn: {request.submitDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex flex-column align-items-end gap-2">
                        <span className={`badge ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleViewDetail(request)}
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-outline-success"
                                onClick={() => handleApprove(request.id)}
                                title="Duyệt"
                              >
                                <i className="bi bi-check"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleReject(request.id)}
                                title="Từ chối"
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </>
                          )}
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
      {showDetailModal && selectedRequest && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết đơn xin nghỉ phép</h5>
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
                    <p className="form-control-plaintext">{selectedRequest.employeeName}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Mã nhân viên</label>
                    <p className="form-control-plaintext">{selectedRequest.employeeId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phòng ban</label>
                    <p className="form-control-plaintext">{selectedRequest.department}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại</label>
                    <p className="form-control-plaintext">{selectedRequest.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Loại nghỉ phép</label>
                    <p className="form-control-plaintext">{selectedRequest.leaveType}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Số ngày nghỉ</label>
                    <p className="form-control-plaintext">{selectedRequest.days} ngày</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Ngày bắt đầu</label>
                    <p className="form-control-plaintext">{selectedRequest.startDate}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Ngày kết thúc</label>
                    <p className="form-control-plaintext">{selectedRequest.endDate}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Lý do nghỉ phép</label>
                    <p className="form-control-plaintext">{selectedRequest.reason}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Ngày nộp đơn</label>
                    <p className="form-control-plaintext">{selectedRequest.submitDate}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Trạng thái</label>
                    <span className={`badge ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusText(selectedRequest.status)}
                    </span>
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
                {selectedRequest.status === 'pending' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setShowDetailModal(false);
                      }}
                    >
                      Duyệt
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => {
                        handleReject(selectedRequest.id);
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

export default LeaveApproval;