import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchFilters = ({ onSearch, onFilterChange, filters, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const departmentOptions = [
    { value: '', label: 'Tất cả phòng ban' },
    { value: 'engineering', label: 'Công nghệ thông tin' },
    { value: 'design', label: 'Thiết kế' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Kinh doanh' },
    { value: 'hr', label: 'Nhân số' },
    { value: 'finance', label: 'Kế toán' },
    { value: 'operations', label: 'Vận hành' }
  ];

  const locationOptions = [
    { value: '', label: 'Tất cả địa điểm' },
    { value: 'ho-chi-minh', label: 'Hồ Chí Minh' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'can-tho', label: 'Cần Thơ' },
    { value: 'remote', label: 'Làm việc t�?xa' }
  ];

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'available', label: 'Đang online' },
    { value: 'busy', label: 'Bận' },
    { value: 'away', label: 'Vắng mặt' },
    { value: 'offline', label: 'Offline' }
  ];

  const skillOptions = [
    { value: '', label: 'Tất c�?k�?năng' },
    { value: 'react', label: 'React' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'sales', label: 'Chiến lược bán hàng' },
    { value: 'project-management', label: 'Quản lý d�?án' }
  ];

  const handleSearchChange = (e) => {
    onSearch(e?.target?.value);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-gray-200 rounded-lg shadow-soft p-6 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Tìm kiếm nhân viên theo tên, chức v�?hoặc k�?năng..."
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={toggleExpanded}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          B�?lọc
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Xóa b�?lọc
          </Button>
        )}
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 animate-fade-in">
          <Select
            label="Phòng ban"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
            placeholder="Chọn phòng ban"
          />

          <Select
            label="Địa điểm"
            options={locationOptions}
            value={filters?.location}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="Chọn địa điểm"
          />

          <Select
            label="Trạng thái"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Chọn trạng thái"
          />

          <Select
            label="K�?năng"
            options={skillOptions}
            value={filters?.skills}
            onChange={(value) => handleFilterChange('skills', value)}
            placeholder="Chọn k�?năng"
            searchable
          />
        </div>
      )}
      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange('department', 'engineering')}
          className={`${filters?.department === 'engineering' ? 'bg-primary/10 text-primary' : ''}`}
        >
          <Icon name="Code" size={14} className="mr-1" />
          Công ngh�?thông tin
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange('department', 'design')}
          className={`${filters?.department === 'design' ? 'bg-primary/10 text-primary' : ''}`}
        >
          <Icon name="Palette" size={14} className="mr-1" />
          Thiết k�?
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange('status', 'available')}
          className={`${filters?.status === 'available' ? 'bg-success/10 text-success' : ''}`}
        >
          <Icon name="Circle" size={14} className="mr-1 text-success" />
          Đang online
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange('location', 'remote')}
          className={`${filters?.location === 'remote' ? 'bg-accent/10 text-accent' : ''}`}
        >
          <Icon name="Home" size={14} className="mr-1" />
          Làm việc t�?xa
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;

