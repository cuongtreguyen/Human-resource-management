import React, { useState } from "react";

const AttendanceRecord = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [viewMode, setViewMode] = useState("summary"); // summary, detailed

  const attendanceData = [
    {
      date: "2024-01-22",
      day: "Thứ 2",
      checkIn: "08:15",
      checkOut: "17:30",
      totalHours: 8.25,
      overtime: 0.25,
      status: "present",
      late: true
    },
    {
      date: "2024-01-23",
      day: "Thứ 3",
      checkIn: "07:55",
      checkOut: "17:00",
      totalHours: 8,
      overtime: 0,
      status: "present",
      late: false
    },
    {
      date: "2024-01-24",
      day: "Thứ 4",
      checkIn: "08:00",
      checkOut: "17:15",
      totalHours: 8.25,
      overtime: 0.25,
      status: "present",
      late: false
    },
    {
      date: "2024-01-25",
      day: "Thứ 5",
      checkIn: "08:30",
      checkOut: "17:45",
      totalHours: 8.25,
      overtime: 0.25,
      status: "present",
      late: true
    },
    {
      date: "2024-01-26",
      day: "Thứ 6",
      checkIn: "08:00",
      checkOut: "17:00",
      totalHours: 8,
      overtime: 0,
      status: "present",
      late: false
    }
  ];

  const monthlyStats = {
    totalDays: 22,
    presentDays: 20,
    absentDays: 1,
    lateDays: 3,
    totalHours: 160,
    overtimeHours: 8
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success';
      case 'absent': return 'bg-danger';
      case 'late': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Có mặt';
      case 'absent': return 'Vắng mặt';
      case 'late': return 'Đi muộn';
      default: return 'Không xác định';
    }
  };

  const handleExport = () => {
    console.log('Xuất báo cáo chấm công');
  };

  const attendanceRate = Math.round((monthlyStats.presentDays / monthlyStats.totalDays) * 100);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Bảng chấm công</h2>
          <p className="text-muted">Xem lịch sử chấm công và số ngày công của bạn</p>
        </div>
        <button 
          className="btn btn-success d-flex align-items-center"
          onClick={handleExport}
        >
          <i className="bi bi-download me-2"></i>
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Month Selector */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-end">
            <div className="col-md-4">
              <label className="form-label">Chọn tháng</label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="btn-group">
              <button
                onClick={() => setViewMode('summary')}
                className={`btn ${viewMode === 'summary' ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`btn ${viewMode === 'detailed' ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
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
                  <h4 className="mb-0">{monthlyStats.presentDays}</h4>
                  <small className="text-muted">/{monthlyStats.totalDays} ngày</small>
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
                  <h4 className="mb-0">{monthlyStats.absentDays}</h4>
                  <small className="text-muted">ngày</small>
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
                  <h4 className="mb-0">{monthlyStats.lateDays}</h4>
                  <small className="text-muted">lần</small>
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
                  <i className="bi bi-graph-up text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Tỷ lệ chấm công</p>
                  <h4 className="mb-0">{attendanceRate}%</h4>
                  <small className="text-muted">tháng này</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      {viewMode === 'detailed' && (
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Chi tiết chấm công tháng {selectedMonth}</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ngày</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                    <th>Tổng giờ</th>
                    <th>Tăng ca</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <div className="fw-semibold">{record.day}</div>
                          <small className="text-muted">{record.date}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {record.checkIn}
                          {record.late && <span className="badge bg-danger ms-2">Muộn</span>}
                        </div>
                      </td>
                      <td>{record.checkOut}</td>
                      <td>{record.totalHours}h</td>
                      <td>{record.overtime}h</td>
                      <td>
                        <span className={`badge ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Tổng kết tháng</h5>
          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-semibold mb-3">Thời gian làm việc</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tổng giờ làm:</span>
                <span className="fw-semibold">{monthlyStats.totalHours}h</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Giờ tăng ca:</span>
                <span className="fw-semibold">{monthlyStats.overtimeHours}h</span>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fw-semibold mb-3">Tỷ lệ chấm công</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tỷ lệ có mặt:</span>
                <span className="fw-semibold text-success">{attendanceRate}%</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Số lần đi muộn:</span>
                <span className="fw-semibold text-warning">{monthlyStats.lateDays} lần</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;