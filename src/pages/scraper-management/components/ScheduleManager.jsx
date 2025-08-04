import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ScheduleManager = ({ platforms, onScheduleJob }) => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Daily EU Tenders',
      platforms: ['ted-europa', 'service-bund-de'],
      frequency: 'daily',
      time: '09:00',
      enabled: true,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 10 * 60 * 60 * 1000),
      mode: 'incremental'
    },
    {
      id: 2,
      name: 'IT-Focused Weekly Scan',
      platforms: ['it-ausschreibung-de', 'it-beschaffung-ch'],
      frequency: 'weekly',
      time: '06:00',
      enabled: true,
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      mode: 'full'
    },
    {
      id: 3,
      name: 'Austrian Platforms Check',
      platforms: ['usp-gv-at', 'anko-vergabeportal'],
      frequency: 'daily',
      time: '14:30',
      enabled: false,
      lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextRun: null,
      mode: 'incremental'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    platforms: [],
    frequency: 'daily',
    time: '09:00',
    mode: 'incremental',
    enabled: true
  });

  const handleToggleSchedule = (scheduleId) => {
    setSchedules(prev => 
      prev?.map(schedule => 
        schedule?.id === scheduleId 
          ? { ...schedule, enabled: !schedule?.enabled }
          : schedule
      )
    );
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev?.filter(schedule => schedule?.id !== scheduleId));
    }
  };

  const handleCreateSchedule = () => {
    if (!newSchedule?.name || newSchedule?.platforms?.length === 0) {
      alert('Please provide a name and select at least one platform');
      return;
    }

    const schedule = {
      ...newSchedule,
      id: Date.now(),
      lastRun: null,
      nextRun: calculateNextRun(newSchedule?.frequency, newSchedule?.time)
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      name: '',
      platforms: [],
      frequency: 'daily',
      time: '09:00',
      mode: 'incremental',
      enabled: true
    });
    setShowCreateModal(false);
    onScheduleJob(schedule);
  };

  const calculateNextRun = (frequency, time) => {
    const [hours, minutes] = time?.split(':')?.map(Number);
    const now = new Date();
    const nextRun = new Date();
    
    nextRun?.setHours(hours, minutes, 0, 0);
    
    if (nextRun <= now) {
      if (frequency === 'daily') {
        nextRun?.setDate(nextRun?.getDate() + 1);
      } else if (frequency === 'weekly') {
        nextRun?.setDate(nextRun?.getDate() + 7);
      } else if (frequency === 'hourly') {
        nextRun?.setHours(nextRun?.getHours() + 1);
      }
    }
    
    return nextRun;
  };

  const formatNextRun = (nextRun) => {
    if (!nextRun) return 'Disabled';
    
    const now = new Date();
    const diffMs = nextRun - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 24) {
      return `in ${diffHours}h ${diffMinutes}m`;
    } else {
      return nextRun?.toLocaleDateString() + ' ' + nextRun?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'hourly': return 'text-error';
      case 'daily': return 'text-primary';
      case 'weekly': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getPlatformName = (platformId) => {
    const platform = platforms?.find(p => p?.id === platformId);
    return platform?.name?.split(' – ')?.[0] || platformId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Schedule Manager</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Automated scraping schedules for continuous data collection
            </p>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)} iconName="Plus">
            Create Schedule
          </Button>
        </div>
      </div>
      {/* Schedules List */}
      <div className="space-y-4">
        {schedules?.map((schedule) => (
          <div key={schedule?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              {/* Schedule Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-foreground">
                    {schedule?.name}
                  </h4>
                  
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    schedule?.enabled 
                      ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {schedule?.enabled ? 'Active' : 'Disabled'}
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(schedule?.frequency)}`}>
                    {schedule?.frequency?.charAt(0)?.toUpperCase() + schedule?.frequency?.slice(1)}
                  </div>

                  <div className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                    {schedule?.mode}
                  </div>
                </div>

                {/* Platforms */}
                <div className="mb-3">
                  <div className="text-sm text-muted-foreground mb-1">Platforms:</div>
                  <div className="flex flex-wrap gap-1">
                    {schedule?.platforms?.map((platformId) => (
                      <span
                        key={platformId}
                        className="inline-block px-2 py-1 text-xs bg-muted text-foreground rounded"
                      >
                        {getPlatformName(platformId)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <span className="ml-2 font-medium text-foreground">{schedule?.time}</span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="ml-2 font-medium text-foreground">
                      {schedule?.lastRun 
                        ? schedule?.lastRun?.toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="ml-2 font-medium text-foreground">
                      {formatNextRun(schedule?.nextRun)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => console.log('Run now:', schedule?.id)}
                  iconName="Play"
                >
                  Run Now
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => console.log('Edit schedule:', schedule?.id)}
                  iconName="Settings"
                >
                  Edit
                </Button>
                
                <button
                  onClick={() => handleToggleSchedule(schedule?.id)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    schedule?.enabled ? 'bg-success' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    schedule?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteSchedule(schedule?.id)}
                  iconName="Trash2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Schedule</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                iconName="X"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Schedule Name
                </label>
                <Input
                  placeholder="e.g., Daily IT Tenders"
                  value={newSchedule?.name}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e?.target?.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Platforms
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {platforms?.map((platform) => (
                    <div key={platform?.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform?.id}
                        checked={newSchedule?.platforms?.includes(platform?.id)}
                        onChange={(checked) => {
                          setNewSchedule(prev => ({
                            ...prev,
                            platforms: checked
                              ? [...prev?.platforms, platform?.id]
                              : prev?.platforms?.filter(id => id !== platform?.id)
                          }));
                        }}
                      />
                      <label htmlFor={platform?.id} className="text-sm text-foreground">
                        {platform?.name?.split(' – ')?.[0]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Frequency
                  </label>
                  <Select
                    value={newSchedule?.frequency}
                    onChange={(value) => setNewSchedule(prev => ({ ...prev, frequency: value }))}
                    options={[
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={newSchedule?.time}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e?.target?.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Scraping Mode
                </label>
                <Select
                  value={newSchedule?.mode}
                  onChange={(value) => setNewSchedule(prev => ({ ...prev, mode: value }))}
                  options={[
                    { value: 'incremental', label: 'Incremental' },
                    { value: 'full', label: 'Full Scrape' },
                    { value: 'validation', label: 'Validation' }
                  ]}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enabled"
                  checked={newSchedule?.enabled}
                  onChange={(checked) => setNewSchedule(prev => ({ ...prev, enabled: checked }))}
                />
                <label htmlFor="enabled" className="text-sm font-medium text-foreground">
                  Enable schedule immediately
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSchedule}>
                Create Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {schedules?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No schedules configured</h3>
          <p className="text-muted-foreground mb-4">
            Create automated schedules to run scraping operations regularly
          </p>
          <Button onClick={() => setShowCreateModal(true)} iconName="Plus">
            Create Your First Schedule
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;