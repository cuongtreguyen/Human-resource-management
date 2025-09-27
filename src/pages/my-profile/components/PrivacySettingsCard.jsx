import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySettingsCard = ({ privacySettings, onSettingsUpdate }) => {
  const [settings, setSettings] = useState(privacySettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsUpdate(settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(privacySettings);
    setHasChanges(false);
  };

  const privacyOptions = [
    {
      key: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Who can view your complete profile information',
      icon: 'Eye',
      options: [
        { value: 'public', label: 'Everyone in the company' },
        { value: 'team', label: 'My team only' },
        { value: 'managers', label: 'Managers only' },
        { value: 'private', label: 'Only me' }
      ]
    },
    {
      key: 'contactInfo',
      title: 'Contact Information',
      description: 'Control who can see your email and phone number',
      icon: 'Phone',
      options: [
        { value: 'public', label: 'Everyone' },
        { value: 'team', label: 'Team members' },
        { value: 'private', label: 'Private' }
      ]
    },
    {
      key: 'workHistory',
      title: 'Work History',
      description: 'Visibility of your employment history and achievements',
      icon: 'Briefcase',
      options: [
        { value: 'public', label: 'Visible to all' },
        { value: 'managers', label: 'Managers only' },
        { value: 'private', label: 'Private' }
      ]
    }
  ];

  const notificationSettings = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive updates and announcements via email'
    },
    {
      key: 'profileViews',
      title: 'Profile View Notifications',
      description: 'Get notified when someone views your profile'
    },
    {
      key: 'skillEndorsements',
      title: 'Skill Endorsements',
      description: 'Notifications when colleagues endorse your skills'
    },
    {
      key: 'birthdayReminders',
      title: 'Birthday Reminders',
      description: 'Allow others to see birthday reminders'
    },
    {
      key: 'statusUpdates',
      title: 'Status Updates',
      description: 'Share your work status with team members'
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-medium border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Privacy & Settings</h3>
            <p className="text-sm text-muted-foreground">Control your privacy and notification preferences</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Icon name="Check" size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-8">
        {/* Privacy Controls */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Lock" size={16} className="mr-2 text-primary" />
            Privacy Controls
          </h4>
          
          <div className="space-y-6">
            {privacyOptions?.map((option) => (
              <div key={option?.key} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={option?.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground mb-1">{option?.title}</h5>
                    <p className="text-sm text-muted-foreground">{option?.description}</p>
                  </div>
                </div>
                
                <div className="ml-11 space-y-2">
                  {option?.options?.map((opt) => (
                    <label key={opt?.value} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={option?.key}
                        value={opt?.value}
                        checked={settings?.[option?.key] === opt?.value}
                        onChange={(e) => handleSettingChange(option?.key, e?.target?.value)}
                        className="w-4 h-4 text-primary border-gray-200 focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {opt?.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Bell" size={16} className="mr-2 text-accent" />
            Notification Preferences
          </h4>
          
          <div className="space-y-4">
            {notificationSettings?.map((setting) => (
              <div key={setting?.key} className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <Checkbox
                  checked={settings?.[setting?.key] || false}
                  onChange={(e) => handleSettingChange(setting?.key, e?.target?.checked)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground mb-1">{setting?.title}</h5>
                  <p className="text-sm text-muted-foreground">{setting?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Security */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Database" size={16} className="mr-2 text-warning" />
            Data & Security
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Download" size={18} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium">Download My Data</div>
                  <div className="text-sm text-muted-foreground">Export your profile information</div>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Key" size={18} className="text-accent" />
                <div className="text-left">
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-muted-foreground">Update your login credentials</div>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={18} className="text-success" />
                <div className="text-left">
                  <div className="font-medium">Two-Factor Auth</div>
                  <div className="text-sm text-muted-foreground">Enable additional security</div>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4 text-destructive border-destructive/20 hover:bg-destructive/5">
              <div className="flex items-center space-x-3">
                <Icon name="Trash2" size={18} className="text-destructive" />
                <div className="text-left">
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-muted-foreground">Permanently remove your data</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsCard;

