import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SkillsCard = ({ skills, onSkillsUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillsList, setSkillsList] = useState(skills);

  const handleAddSkill = () => {
    if (newSkill?.trim()) {
      const skill = {
        id: Date.now(),
        name: newSkill?.trim(),
        level: 'Intermediate',
        verified: false
      };
      setSkillsList([...skillsList, skill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSkillsList(skillsList?.filter(skill => skill?.id !== skillId));
  };

  const handleSave = () => {
    onSkillsUpdate(skillsList);
    setIsEditing(false);
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-warning/10 text-warning border-warning/20';
      case 'Intermediate': return 'bg-primary/10 text-primary border-primary/20';
      case 'Advanced': return 'bg-success/10 text-success border-success/20';
      case 'Expert': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted/10 text-muted-foreground border-gray-200';
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-medium border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Award" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Skills & Expertise</h3>
            <p className="text-sm text-muted-foreground">Showcase your professional skills</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Icon name="Edit" size={16} className="mr-2" />
            Manage
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Icon name="Check" size={16} className="mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>
      {/* Add New Skill */}
      {isEditing && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                placeholder="Add a new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && handleAddSkill()}
              />
            </div>
            <Button onClick={handleAddSkill} disabled={!newSkill?.trim()}>
              <Icon name="Plus" size={16} className="mr-2" />
              Add
            </Button>
          </div>
        </div>
      )}
      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsList?.map((skill) => (
          <div key={skill?.id} className="group relative">
            <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-medium ${getSkillLevelColor(skill?.level)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-sm">{skill?.name}</h4>
                    {skill?.verified && (
                      <Icon name="CheckCircle" size={14} className="text-success" />
                    )}
                  </div>
                  <p className="text-xs opacity-75">{skill?.level}</p>
                </div>
                
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6"
                    onClick={() => handleRemoveSkill(skill?.id)}
                  >
                    <Icon name="X" size={12} />
                  </Button>
                )}
              </div>

              {/* Skill Level Indicator */}
              <div className="mt-3">
                <div className="w-full bg-current/20 rounded-full h-1">
                  <div 
                    className="bg-current h-1 rounded-full transition-all duration-500"
                    style={{
                      width: skill?.level === 'Beginner' ? '25%' :
                             skill?.level === 'Intermediate' ? '50%' :
                             skill?.level === 'Advanced' ? '75%' : '100%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {skillsList?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Award" size={24} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No skills added yet</h4>
          <p className="text-muted-foreground mb-4">Start building your professional profile by adding your skills</p>
          <Button onClick={() => setIsEditing(true)}>
            <Icon name="Plus" size={16} className="mr-2" />
            Add Your First Skill
          </Button>
        </div>
      )}
    </div>
  );
};

export default SkillsCard;

