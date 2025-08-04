import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertBanner = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'error',
      title: 'Platform Connection Failed',
      message: 'simap.ch authentication has expired. Manual intervention required to restore service.',
      timestamp: new Date(Date.now() - 300000),
      dismissible: true,
      actions: [
        { label: 'Fix Now', action: 'fix', variant: 'default' },
        { label: 'View Details', action: 'details', variant: 'outline' }
      ]
    },
    {
      id: 2,
      type: 'warning',
      title: 'Rate Limit Approaching',
      message: 'service.bund.de is approaching daily rate limit. Consider adjusting scraping frequency.',
      timestamp: new Date(Date.now() - 600000),
      dismissible: true,
      actions: [
        { label: 'Adjust Settings', action: 'adjust', variant: 'outline' }
      ]
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'TED Europa will undergo maintenance tonight from 02:00-04:00 CET. Scraping will be paused automatically.',
      timestamp: new Date(Date.now() - 900000),
      dismissible: true,
      actions: []
    }
  ]);

  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  useEffect(() => {
    setVisibleAlerts(alerts);
  }, [alerts]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return { name: 'AlertCircle', color: 'text-error' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      default:
        return { name: 'Info', color: 'text-primary' };
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error/10 border-error/20 text-error-foreground';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning-foreground';
      case 'success':
        return 'bg-success/10 border-success/20 text-success-foreground';
      default:
        return 'bg-primary/10 border-primary/20 text-primary-foreground';
    }
  };

  const handleDismiss = (alertId) => {
    setVisibleAlerts(prev => prev?.filter(alert => alert.id !== alertId));
  };

  const handleAction = (action, alertId) => {
    console.log(`Action ${action} triggered for alert ${alertId}`);
    
    // Simulate action handling
    switch (action) {
      case 'fix':
        // Simulate fixing the issue
        setTimeout(() => {
          handleDismiss(alertId);
        }, 1000);
        break;
      case 'details':
        // Navigate to details page
        break;
      case 'adjust':
        // Open settings modal
        break;
      default:
        break;
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

  if (visibleAlerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleAlerts?.map((alert) => {
        const iconConfig = getAlertIcon(alert.type);
        const alertStyles = getAlertStyles(alert.type);
        
        return (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${alertStyles} elevation-1`}
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 ${iconConfig?.color}`}>
                <Icon name={iconConfig?.name} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">{alert.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-75">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                    {alert.dismissible && (
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-sm opacity-90 mb-3">
                  {alert.message}
                </p>
                
                {alert.actions?.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {alert.actions?.map((action, index) => (
                      <Button
                        key={index}
                        variant={action?.variant}
                        size="sm"
                        onClick={() => handleAction(action?.action, alert.id)}
                        className="text-xs"
                      >
                        {action?.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertBanner;