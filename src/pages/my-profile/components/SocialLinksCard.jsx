import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SocialLinksCard = ({ socialLinks, onLinksUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState(socialLinks);

  const handleLinkChange = (platform, value) => {
    setLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSave = () => {
    onLinksUpdate(links);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLinks(socialLinks);
    setIsEditing(false);
  };

  const socialPlatforms = [
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: 'Linkedin',
      placeholder: 'https://linkedin.com/in/yourprofile',
      color: 'text-blue-600'
    },
    {
      key: 'twitter',
      name: 'Twitter',
      icon: 'Twitter',
      placeholder: 'https://twitter.com/yourusername',
      color: 'text-sky-500'
    },
    {
      key: 'github',
      name: 'GitHub',
      icon: 'Github',
      placeholder: 'https://github.com/yourusername',
      color: 'text-gray-800'
    },
    {
      key: 'portfolio',
      name: 'Portfolio',
      icon: 'Globe',
      placeholder: 'https://yourportfolio.com',
      color: 'text-purple-600'
    },
    {
      key: 'behance',
      name: 'Behance',
      icon: 'Palette',
      placeholder: 'https://behance.net/yourprofile',
      color: 'text-blue-500'
    },
    {
      key: 'dribbble',
      name: 'Dribbble',
      icon: 'Circle',
      placeholder: 'https://dribbble.com/yourusername',
      color: 'text-pink-500'
    }
  ];

  const getValidLinks = () => {
    return socialPlatforms?.filter(platform => links?.[platform?.key] && links?.[platform?.key]?.trim());
  };

  return (
    <div className="bg-card rounded-xl shadow-medium border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Icon name="Link" size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
            <p className="text-sm text-muted-foreground">Connect your professional profiles</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Icon name="Edit" size={16} className="mr-2" />
            Edit Links
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Icon name="Check" size={16} className="mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>
      {isEditing ? (
        /* Edit Mode */
        (<div className="space-y-4">
          {socialPlatforms?.map((platform) => (
            <div key={platform?.key}>
              <Input
                label={platform?.name}
                type="url"
                placeholder={platform?.placeholder}
                value={links?.[platform?.key] || ''}
                onChange={(e) => handleLinkChange(platform?.key, e?.target?.value)}
                className="mb-2"
              />
            </div>
          ))}
        </div>)
      ) : (
        /* Display Mode */
        (<div>
          {getValidLinks()?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getValidLinks()?.map((platform) => (
                <a
                  key={platform?.key}
                  href={links?.[platform?.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 hover:shadow-medium transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-soft ${platform?.color}`}>
                    <Icon name={platform?.icon} size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {platform?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {links?.[platform?.key]?.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                  
                  <Icon 
                    name="ExternalLink" 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary transition-colors duration-200" 
                  />
                </a>
              ))}
            </div>
          ) : (
            /* Empty State */
            (<div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Link" size={24} className="text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">No social links added</h4>
              <p className="text-muted-foreground mb-4">Connect your professional profiles to showcase your work</p>
              <Button onClick={() => setIsEditing(true)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Add Social Links
              </Button>
            </div>)
          )}
        </div>)
      )}
      {/* Quick Add Popular Links */}
      {!isEditing && getValidLinks()?.length > 0 && getValidLinks()?.length < socialPlatforms?.length && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add more professional profiles to increase your visibility
            </p>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Icon name="Plus" size={14} className="mr-1" />
              Add More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksCard;

