import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportOptions = ({ employees, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    email: true,
    phone: true,
    department: true,
    role: true,
    location: true,
    status: false,
    skills: false,
    joinDate: false
  });
  const [exportFormat, setExportFormat] = useState('csv');

  const fieldOptions = [
    { key: 'name', label: 'Họ tên', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Số điện thoại', required: false },
    { key: 'department', label: 'Phòng ban', required: false },
    { key: 'role', label: 'Chức vụ, required: false' },
    { key: 'location', label: 'Địa điểm', required: false },
    { key: 'status', label: 'Trạng thái', required: false },
    { key: 'skills', label: 'K�?năng', required: false },
    { key: 'joinDate', label: 'Ngày vào làm', required: false }
  ];

  const formatOptions = [
    { value: 'csv', label: 'File CSV', icon: 'FileText' },
    { value: 'excel', label: 'File Excel', icon: 'FileSpreadsheet' },
    { value: 'pdf', label: 'Tài liệu PDF', icon: 'FileImage' }
  ];

  const handleFieldChange = (field, checked) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleExport = () => {
    const exportData = {
      employees,
      fields: selectedFields,
      format: exportFormat
    };
    onExport(exportData);
    setIsOpen(false);
  };

  const selectedFieldsCount = Object.values(selectedFields)?.filter(Boolean)?.length;

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        iconName="Download"
        iconPosition="left"
      >
        Xuất d�?liệu
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-gray-200 rounded-lg shadow-strong max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
              <Icon name="Download" size={16} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Xuất d�?liệu nhân viên</h3>
              <p className="text-sm text-muted-foreground">Chọn trường d�?liệu và định dạng</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Định dạng xuất</h4>
            <div className="space-y-2">
              {formatOptions?.map((format) => (
                <label
                  key={format?.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                    exportFormat === format?.value
                      ? 'border-primary bg-primary/5' :'border-gray-200 hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format?.value}
                    checked={exportFormat === format?.value}
                    onChange={(e) => setExportFormat(e?.target?.value)}
                    className="sr-only"
                  />
                  <Icon name={format?.icon} size={20} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{format?.label}</span>
                  {exportFormat === format?.value && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Bao gồm trường</h4>
              <span className="text-sm text-muted-foreground">
                {selectedFieldsCount} đã chọn
              </span>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fieldOptions?.map((field) => (
                <div key={field?.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedFields?.[field?.key]}
                      onChange={(e) => handleFieldChange(field?.key, e?.target?.checked)}
                      disabled={field?.required}
                    />
                    <span className={`text-sm ${field?.required ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {field?.label}
                    </span>
                  </div>
                  
                  {field?.required && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">
                      Bắt buộc
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nhân viên s�?xuất:</span>
              <span className="font-medium text-foreground">{employees?.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Trường d�?liệu:</span>
              <span className="font-medium text-foreground">{selectedFieldsCount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-muted/20">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            Hủy
          </Button>
          
          <Button
            variant="default"
            onClick={handleExport}
            disabled={selectedFieldsCount === 0}
            iconName="Download"
            iconPosition="left"
          >
            Xuất {exportFormat?.toUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;

