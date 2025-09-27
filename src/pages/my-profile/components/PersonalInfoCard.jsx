import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const PersonalInfoCard = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email,
    phone: user?.phone,
    location: user?.location,
    birthday: user?.birthday,
    emergencyContact: user?.emergencyContact,
    emergencyPhone: user?.emergencyPhone,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email,
      phone: user?.phone,
      location: user?.location,
      birthday: user?.birthday,
      emergencyContact: user?.emergencyContact,
      emergencyPhone: user?.emergencyPhone,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-xl shadow-medium border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Thông tin cá nhân
            </h3>
            <p className="text-sm text-muted-foreground">
              Quản lý thông tin chi tiết của bạn
            </p>
          </div>
        </div>

        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Icon name="Edit" size={16} className="mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Icon name="Check" size={16} className="mr-2" />
              Lưu
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          {isEditing ? (
            <Input
              label="Địa chỉ Email"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange("email", e?.target?.value)}
              required
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Địa chỉ Email
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{user?.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          {isEditing ? (
            <Input
              label="Số điện thoại"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange("phone", e?.target?.value)}
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Số điện thoại
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Icon name="Phone" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{user?.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          {isEditing ? (
            <Input
              label="Địa chỉ"
              type="text"
              value={formData?.location}
              onChange={(e) => handleInputChange("location", e?.target?.value)}
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Địa chỉ
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{user?.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Birthday */}
        <div>
          {isEditing ? (
            <Input
              label="Ngày sinh"
              type="date"
              value={formData?.birthday}
              onChange={(e) => handleInputChange("birthday", e?.target?.value)}
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Ngày sinh
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Icon
                  name="Calendar"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-foreground">{user?.birthday}</span>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div>
          {isEditing ? (
            <Input
              label="Người liên hệ khẩn cấp"
              type="text"
              value={formData?.emergencyContact}
              onChange={(e) =>
                handleInputChange("emergencyContact", e?.target?.value)
              }
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Người liên hệ khẩn cấp
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Icon
                  name="UserCheck"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-foreground">{user?.emergencyContact}</span>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Phone */}
        <div>
          {isEditing ? (
            <Input
              label="Số điện thoại khẩn cấp"
              type="tel"
              value={formData?.emergencyPhone}
              onChange={(e) =>
                handleInputChange("emergencyPhone", e?.target?.value)
              }
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Số điện thoại khẩn cấp
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <Icon name="Phone" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{user?.emergencyPhone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
