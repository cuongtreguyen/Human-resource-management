import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GoalsCard = ({ goals, onGoalsUpdate }) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'Professional'
  });

  const handleAddGoal = () => {
    if (newGoal?.title?.trim()) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        progress: 0,
        status: 'In Progress',
        createdAt: new Date()?.toISOString()
      };
      onGoalsUpdate([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        targetDate: '',
        category: 'Professional'
      });
      setIsAddingGoal(false);
    }
  };

  const updateGoalProgress = (goalId, progress) => {
    const updatedGoals = goals?.map(goal => 
      goal?.id === goalId 
        ? { ...goal, progress, status: progress === 100 ? 'Completed' : 'In Progress' }
        : goal
    );
    onGoalsUpdate(updatedGoals);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-success bg-success/10';
      case 'In Progress': return 'text-primary bg-primary/10';
      case 'On Hold': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Professional': return 'Briefcase';
      case 'Personal': return 'User';
      case 'Learning': return 'BookOpen';
      case 'Health': return 'Heart';
      default: return 'Target';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-medium border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Personal Goals</h3>
            <p className="text-sm text-muted-foreground">Track your progress and achievements</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingGoal(true)}
          disabled={isAddingGoal}
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>
      {/* Add New Goal Form */}
      {isAddingGoal && (
        <div className="mb-6 p-6 bg-muted/30 rounded-lg animate-fade-in">
          <h4 className="font-medium text-foreground mb-4">Add New Goal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Goal Title"
              value={newGoal?.title}
              onChange={(e) => setNewGoal({...newGoal, title: e?.target?.value})}
              placeholder="Enter your goal..."
              required
            />
            <Input
              label="Target Date"
              type="date"
              value={newGoal?.targetDate}
              onChange={(e) => setNewGoal({...newGoal, targetDate: e?.target?.value})}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Description"
              value={newGoal?.description}
              onChange={(e) => setNewGoal({...newGoal, description: e?.target?.value})}
              placeholder="Describe your goal in detail..."
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal} disabled={!newGoal?.title?.trim()}>
              <Icon name="Plus" size={16} className="mr-2" />
              Add Goal
            </Button>
          </div>
        </div>
      )}
      {/* Goals List */}
      <div className="space-y-4">
        {goals?.map((goal) => (
          <div key={goal?.id} className="group p-6 bg-muted/20 rounded-lg hover:shadow-medium transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getCategoryIcon(goal?.category)} size={18} className="text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-foreground">{goal?.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(goal?.status)}`}>
                      {goal?.status}
                    </span>
                  </div>
                  
                  {goal?.description && (
                    <p className="text-sm text-muted-foreground mb-3">{goal?.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>Target: {formatDate(goal?.targetDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Tag" size={12} />
                      <span>{goal?.category}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-primary mb-1">{goal?.progress}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-border rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${goal?.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Progress Controls */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {[25, 50, 75, 100]?.map((progress) => (
                  <Button
                    key={progress}
                    variant="outline"
                    size="sm"
                    onClick={() => updateGoalProgress(goal?.id, progress)}
                    className={`text-xs ${goal?.progress >= progress ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    {progress}%
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Icon name="Edit" size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive">
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {goals?.length === 0 && !isAddingGoal && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Target" size={24} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No goals set yet</h4>
          <p className="text-muted-foreground mb-4">Start tracking your personal and professional goals</p>
          <Button onClick={() => setIsAddingGoal(true)}>
            <Icon name="Plus" size={16} className="mr-2" />
            Set Your First Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalsCard;

