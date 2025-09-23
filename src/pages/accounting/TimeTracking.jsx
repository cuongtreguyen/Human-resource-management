import React, { useState } from "react";

const TimeTracking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const timeRecords = [
    {
      id: 1,
      employeeName: "Nguyễn Văn A",
      department: "IT",
      date: "2024-01-20",
      checkIn: "08:30",
      checkOut: "17:30",
      totalHours: 8.5,
      overtime: 0.5,
      status: "normal"
    },
    {
      id: 2,
      employeeName: "Trần Thị B",
      department: "Design",
      date: "2024-01-20",
      checkIn: "09:00",
      checkOut: "18:00",
      totalHours: 8,
      overtime: 0,
      status: "late"
    },
    {
      id: 3,
      employeeName: "Lê Văn C",
      department: "HR",
      date: "2024-01-20",
      checkIn: "08:00",
      checkOut: "17:00",
      totalHours: 8,
      overtime: 0,
      status: "normal"
    },
    {
      id: 4,
      employeeName: "Phạm Thị D",
      department: "Finance",
      date: "2024-01-20",
      checkIn: "08:15",
      checkOut: "17:45",
      totalHours: 8.5,
      overtime: 0.5,
      status: "normal"
    }
  ];

  const employees = [
    { id: 1, name: "Nguyễn Văn A", department: "IT" },
    { id: 2, name: "Trần Thị B", department: "Design" },
    { id: 3, name: "Lê Văn C", department: "HR" },
    { id: 4, name: "Phạm Thị D", department: "Finance" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-success';
      case 'late': return 'bg-warning';
      case 'absent': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'Bình thường';
      case 'late': return 'Đi muộn';
      case 'absent': return 'Vắng mặt';
      default: return 'Không xác định';
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const handleExport = () => {
    console.log('Xuất báo cáo chấm công');
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Chấm công</h2>
          <p className="text-muted">Quản lý thời gian làm việc của nhân viên</p>
        </div>
        <button 
          className="btn btn-success d-flex align-items-center"
          onClick={handleExport}
        >
          <i className="bi bi-download me-2"></i>
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Chọn ngày</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nhân viên</label>
              <select
                className="form-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="all">Tất cả nhân viên</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
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
                  <i className="bi bi-check text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Có mặt</p>
                  <h4 className="mb-0">45</h4>
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
                  <p className="text-muted small mb-1">Đi muộn</p>
                  <h4 className="mb-0">3</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger rounded p-2 me-3">
                  <i className="bi bi-x text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Vắng mặt</p>
                  <h4 className="mb-0">2</h4>
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
                  <i className="bi bi-calendar text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Tổng giờ</p>
                  <h4 className="mb-0">360h</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Records Table */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="card-title mb-0">Bảng chấm công - {selectedDate}</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nhân viên</th>
                  <th>Giờ vào</th>
                  <th>Giờ ra</th>
                  <th>Tổng giờ</th>
                  <th>Tăng ca</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {timeRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{record.employeeName}</div>
                          <small className="text-muted">{record.department}</small>
                        </div>
                      </div>
                    </td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>{record.totalHours}h</td>
                    <td>{record.overtime}h</td>
                    <td>
                      <span className={`badge ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(record)}
                        title="Chỉnh sửa"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRecord && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa chấm công</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nhân viên</label>
                    <p className="form-control-plaintext">{editingRecord.employeeName}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Giờ vào</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      defaultValue={editingRecord.checkIn}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Giờ ra</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      defaultValue={editingRecord.checkOut}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tổng giờ</label>
                    <input 
                      type="number" 
                      step="0.5"
                      className="form-control" 
                      defaultValue={editingRecord.totalHours}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tăng ca</label>
                    <input 
                      type="number" 
                      step="0.5"
                      className="form-control" 
                      defaultValue={editingRecord.overtime}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button type="button" className="btn btn-primary">
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;