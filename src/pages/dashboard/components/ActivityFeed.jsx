import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'success',
      platform: 'TED Europa',
      message: 'Successfully scraped 47 new tenders',
      timestamp: new Date(Date.now() - 120000),
      details: 'IT Services: 12, Construction: 23, Consulting: 12'
    },
    {
      id: 2,
      type: 'warning',
      platform: 'service.bund.de',
      message: 'Rate limit reached, retrying in 5 minutes',
      timestamp: new Date(Date.now() - 300000),
      details: 'Next attempt scheduled for 07:32'
    },
    {
      id: 3,
      type: 'error',
      platform: 'evergabe-online.de',
      message: 'Authentication failed, credentials expired',
      timestamp: new Date(Date.now() - 600000),
      details: 'Manual intervention required'
    },
    {
      id: 4,
      type: 'info',
      platform: 'dtvp.de',
      message: 'Starting scheduled scraping session',
      timestamp: new Date(Date.now() - 900000),
      details: 'Estimated completion: 15 minutes'
    },
    {
      id: 5,
      type: 'success',
      platform: 'Vergabe24',
      message: 'Data validation completed successfully',
      timestamp: new Date(Date.now() - 1200000),
      details: '156 tenders processed, 3 duplicates removed'
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'error':
        return { name: 'XCircle', color: 'text-error' };
      default:
        return { name: 'Info', color: 'text-primary' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['success', 'warning', 'info']?.[Math.floor(Math.random() * 3)],
        platform: ['TED Europa', 'service.bund.de', 'Vergabe24']?.[Math.floor(Math.random() * 3)],
        message: 'New scraping activity detected',
        timestamp: new Date(),
        details: 'Real-time update simulation'
      };
      
      setActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Live Activity Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => {
          const iconConfig = getActivityIcon(activity?.type);
          return (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-quick">
              <div className={`mt-0.5 ${iconConfig?.color}`}>
                <Icon name={iconConfig?.name} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity?.platform}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity?.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {activity?.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity?.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;