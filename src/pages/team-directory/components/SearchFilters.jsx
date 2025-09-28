import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const SearchFilters = ({ onSearch, onFilterChange, filters, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const departmentOptions = [
    { value: "", label: "Tất cả phòng ban" },
    { value: "Công nghệ thông tin", label: "Công nghệ thông tin" },
    { value: "Thiết kế", label: "Thiết kế" },
    { value: "Marketing", label: "Marketing" },
    { value: "Kinh doanh", label: "Kinh doanh" },
    { value: "Nhân sự", label: "Nhân sự" },
    { value: "Kế toán", label: "Kế toán" },
    { value: "Vận hành", label: "Vận hành" },
  ];

  const locationOptions = [
    { value: "", label: "Tất cả địa điểm" },
    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Cần Thơ", label: "Cần Thơ" },
    { value: "remote", label: "Làm việc từ xa" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "available", label: "Đang online" },
    { value: "busy", label: "Bận" },
    { value: "away", label: "Vắng mặt" },
    { value: "offline", label: "Offline" },
  ];

  const skillOptions = [
    { value: "", label: "Tất cả kỹ năng" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "Chiến lược bán hàng", label: "Chiến lược bán hàng" },
    { value: "Quản lý dự án", label: "Quản lý dự án" },
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

  const hasActiveFilters = Object.values(filters)?.some((value) => value !== "");

  return (
    <div className="bg-card border border-gray-200 rounded-lg shadow-soft p-6 mb-6">
      {/* Thanh tìm kiếm */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, chức vụ..."
            onChange={handleSearchChange}
            value={filters.search}
            className="w-full"
          />
        </div>

        <Button
          variant="outline"
          onClick={toggleExpanded}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Bộ lọc
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Bộ lọc nâng cao */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 animate-fade-in">
          <Select
            label="Phòng ban"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange("department", value)}
            placeholder="Chọn phòng ban"
          />

          <Select
            label="Địa điểm"
            options={locationOptions}
            value={filters?.location}
            onChange={(value) => handleFilterChange("location", value)}
            placeholder="Chọn địa điểm"
          />

          <Select
            label="Trạng thái"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder="Chọn trạng thái"
          />

          <Select
            label="Kỹ năng"
            options={skillOptions}
            value={filters?.skills}
            onChange={(value) => handleFilterChange("skills", value)}
            placeholder="Chọn kỹ năng"
            searchable
          />
        </div>
      )}

      {/* Bộ lọc nhanh */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange("department", "Công nghệ thông tin")}
          className={`${filters?.department === "Công nghệ thông tin" ? "bg-primary/10 text-primary" : ""}`}
        >
          <Icon name="Code" size={14} className="mr-1" />
          Công nghệ thông tin
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange("department", "Thiết kế")}
          className={`${filters?.department === "Thiết kế" ? "bg-primary/10 text-primary" : ""}`}
        >
          <Icon name="Palette" size={14} className="mr-1" />
          Thiết kế
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange("status", "available")}
          className={`${filters?.status === "available" ? "bg-success/10 text-success" : ""}`}
        >
          <Icon name="Circle" size={14} className="mr-1 text-success" />
          Đang online
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange("location", "remote")}
          className={`${filters?.location === "remote" ? "bg-accent/10 text-accent" : ""}`}
        >
          <Icon name="Home" size={14} className="mr-1" />
          Làm việc từ xa
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
