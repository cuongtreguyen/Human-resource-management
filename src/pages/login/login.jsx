import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee");

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary position-relative overflow-hidden">
      {/* Background decoration */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'rgba(0,0,0,0.2)'}}></div>
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <div className="position-absolute rounded-circle" style={{top: '80px', left: '80px', width: '288px', height: '288px', background: 'rgba(255,255,255,0.1)', filter: 'blur(60px)'}}></div>
        <div className="position-absolute rounded-circle" style={{bottom: '80px', right: '80px', width: '384px', height: '384px', background: 'rgba(147,51,234,0.2)', filter: 'blur(60px)'}}></div>
      </div>
      
      <div className="position-relative" style={{maxWidth: '400px', width: '100%'}}>
        <div className="card shadow-custom border-0 p-4 fade-in" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}}>
          <div className="text-center mb-4">
            <div className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-gradient-primary rounded-circle" style={{width: '64px', height: '64px'}}>
              <i className="bi bi-building text-white" style={{fontSize: '2rem'}}></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">Company Dashboard</h2>
            <p className="text-muted">Đăng nhập vào tài khoản của bạn</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-medium text-dark">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="form-control form-control-lg"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium text-dark">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="form-control form-control-lg"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-medium text-dark">Vai trò</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-select form-select-lg"
              >
                <option value="employee">Nhân viên</option>
                <option value="hr">HR Manager</option>
                <option value="accounting">Kế toán</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mb-3"
              style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
            >
              Đăng nhập
            </button>
          </form>
          
          <div className="text-center">
            <p className="text-muted small">
              Demo: Chọn vai trò và nhấn "Đăng nhập" để vào hệ thống
            </p>
            <div className="mt-2 small text-muted">
              <p className="mb-1">• Nhân viên: Xem lịch làm việc, chấm công</p>
              <p className="mb-1">• HR Manager: Quản lý nhân viên, duyệt đơn nghỉ phép</p>
              <p className="mb-0">• Kế toán: Chấm công, quản lý lương</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;