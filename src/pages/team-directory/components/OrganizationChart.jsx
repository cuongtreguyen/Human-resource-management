import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrganizationChart = ({ employees }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [zoom, setZoom] = useState(1);

  // Group employees by department
  const departments = employees.reduce((acc, employee) => {
    if (!acc[employee.department]) {
      acc[employee.department] = [];
    }
    acc[employee.department].push(employee);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'away': return 'bg-secondary';
      case 'offline': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Đang online';
      case 'busy': return 'Bận';
      case 'away': return 'Vắng mặt';
      case 'offline': return 'Offline';
      default: return 'Không xác định';
    }
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : departments[selectedDepartment] || [];

  const departmentOptions = [
    { value: 'all', label: 'Tất c�?phòng ban' },
    ...Object.keys(departments).map(dept => ({ value: dept, label: dept }))
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Building2" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Sơ đ�?t�?chức</h3>
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {departmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            iconName="Minus"
          />
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            iconName="Plus"
          />
        </div>
      </div>

      {/* Organization Chart */}
      <div className="bg-card border border-gray-200 rounded-lg p-6 overflow-auto">
        <div 
          className="min-h-[600px] relative"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {selectedDepartment === 'all' ? (
            // Show all departments
            <div className="space-y-8">
              {Object.entries(departments).map(([department, deptEmployees]) => (
                <div key={department} className="space-y-4">
                  {/* Department Header */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{department}</h4>
                      <p className="text-sm text-muted-foreground">
                        {deptEmployees.length} nhân viên
                      </p>
                    </div>
                  </div>

                  {/* Employees Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {deptEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="bg-muted/30 border border-gray-200 rounded-lg p-4 hover:shadow-medium transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                              <Image
                                src={employee.avatar}
                                alt={employee.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(employee.status)}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-foreground truncate">{employee.name}</h5>
                            <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Trạng thái:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === 'available' ? 'bg-success/10 text-success' :
                              employee.status === 'busy' ? 'bg-warning/10 text-warning' :
                              employee.status === 'away' ? 'bg-secondary/10 text-secondary' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {getStatusText(employee.status)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Mã NV:</span>
                            <span className="font-medium text-foreground">{employee.employeeId}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show single department
            <div className="space-y-4">
              {/* Department Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">{selectedDepartment}</h4>
                  <p className="text-muted-foreground">
                    {filteredEmployees.length} nhân viên
                  </p>
                </div>
              </div>

              {/* Employees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-muted/30 border border-gray-200 rounded-lg p-4 hover:shadow-medium transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                          <Image
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(employee.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-foreground truncate">{employee.name}</h5>
                        <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Trạng thái:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'available' ? 'bg-success/10 text-success' :
                          employee.status === 'busy' ? 'bg-warning/10 text-warning' :
                          employee.status === 'away' ? 'bg-secondary/10 text-secondary' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {getStatusText(employee.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Mã NV:</span>
                        <span className="font-medium text-foreground">{employee.employeeId}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Địa điểm:</span>
                        <span className="font-medium text-foreground">{employee.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-foreground">{employees.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Phòng ban</p>
              <p className="text-2xl font-bold text-foreground">{Object.keys(departments).length}</p>
            </div>
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={20} className="text-accent" />
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang online</p>
              <p className="text-2xl font-bold text-success">
                {employees.filter(emp => emp.status === 'available').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Circle" size={20} className="text-success" />
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Vắng mặt</p>
              <p className="text-2xl font-bold text-warning">
                {employees.filter(emp => emp.status === 'away' || emp.status === 'offline').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Moon" size={20} className="text-warning" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationChart;

