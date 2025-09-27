import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onPhotoUpdate }) => {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const handlePhotoUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      // Mock photo update
      const mockPhotoUrl = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`;
      onPhotoUpdate(mockPhotoUrl);
      setIsEditingPhoto(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-xl shadow-strong text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Photo */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-strong">
            <Image
              src={user?.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Photo Upload Overlay */}
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
               onClick={() => setIsEditingPhoto(true)}>
            <Icon name="Camera" size={24} color="white" />
          </div>

          {/* Upload Input */}
          {isEditingPhoto && (
            <div className="absolute inset-0 rounded-full">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                <Icon name="Upload" size={24} color="white" />
              </div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <p className="text-xl opacity-90 mb-1">{user?.position}</p>
              <p className="text-lg opacity-75">{user?.department}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Icon name="Edit" size={16} className="mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Icon name="Share" size={16} className="mr-2" />
                Share Profile
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{user?.stats?.yearsAtCompany}</div>
              <div className="text-sm opacity-75">Years Here</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user?.stats?.projectsCompleted}</div>
              <div className="text-sm opacity-75">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user?.stats?.teamSize}</div>
              <div className="text-sm opacity-75">Team Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user?.stats?.skillsCount}</div>
              <div className="text-sm opacity-75">Skills</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

