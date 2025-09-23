import React, { useState } from "react";

const WorkSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // week, month

  const workSchedule = [
    {
      date: "2024-01-22",
      day: "Thứ 2",
      shift: "Ca sáng",
      startTime: "08:00",
      endTime: "17:00",
      location: "Văn phòng chính",
      status: "confirmed"
    },
    {
      date: "2024-01-23",
      day: "Thứ 3",
      shift: "Ca sáng",
      startTime: "08:00",
      endTime: "17:00",
      location: "Văn phòng chính",
      status: "confirmed"
    },
    {
      date: "2024-01-24",
      day: "Thứ 4",
      shift: "Ca chiều",
      startTime: "13:00",
      endTime: "22:00",
      location: "Văn phòng chính",
      status: "confirmed"
    },
    {
      date: "2024-01-25",
      day: "Thứ 5",
      shift: "Ca sáng",
      startTime: "08:00",
      endTime: "17:00",
      location: "Văn phòng chính",
      status: "pending"
    },
    {
      date: "2024-01-26",
      day: "Thứ 6",
      shift: "Ca sáng",
      startTime: "08:00",
      endTime: "17:00",
      location: "Văn phòng chính",
      status: "confirmed"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getShiftColor = (shift) => {
    switch (shift) {
      case 'Ca sáng': return 'bg-primary';
      case 'Ca chiều': return 'bg-warning';
      case 'Ca tối': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark">Lịch làm việc</h2>
          <p className="text-muted">Xem lịch làm việc và ca trực của bạn</p>
        </div>
        <div className="btn-group">
          <button
            onClick={() => setViewMode('week')}
            className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Tuần
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Tháng
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <button
              onClick={() => navigateDate('prev')}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            
            <div className="text-center">
              <h5 className="fw-semibold mb-1">
                {viewMode === 'week' 
                  ? `Tuần ${Math.ceil(currentDate.getDate() / 7)} - ${currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`
                  : currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
                }
              </h5>
              <p className="text-muted mb-0">
                {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="row g-3 mb-4">
        {workSchedule.map((schedule, index) => (
          <div key={index} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-gradient-primary rounded p-2 me-3">
                      <i className="bi bi-calendar text-white"></i>
                    </div>
                    <div>
                      <h5 className="card-title mb-1">{schedule.day}</h5>
                      <p className="text-muted mb-0">{schedule.date}</p>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <span className={`badge ${getShiftColor(schedule.shift)}`}>
                      {schedule.shift}
                    </span>
                    <span className={`badge ${getStatusColor(schedule.status)}`}>
                      {getStatusText(schedule.status)}
                    </span>
                  </div>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-clock text-muted me-2"></i>
                      <div>
                        <p className="text-muted small mb-1">Thời gian</p>
                        <p className="mb-0 small">{schedule.startTime} - {schedule.endTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt text-muted me-2"></i>
                      <div>
                        <p className="text-muted small mb-1">Địa điểm</p>
                        <p className="mb-0 small">{schedule.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person text-muted me-2"></i>
                      <div>
                        <p className="text-muted small mb-1">Nhân viên</p>
                        <p className="mb-0 small">Nguyễn Văn A</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded p-2 me-3">
                  <i className="bi bi-calendar-check text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Ca đã xác nhận</p>
                  <h4 className="mb-0">4</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded p-2 me-3">
                  <i className="bi bi-clock text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Ca chờ xác nhận</p>
                  <h4 className="mb-0">1</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded p-2 me-3">
                  <i className="bi bi-person text-white"></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">Tổng giờ làm</p>
                  <h4 className="mb-0">40h</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSchedule;