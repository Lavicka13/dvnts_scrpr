import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = ({ alerts, onAcknowledge, onResolve }) => {
  const [filter, setFilter] = useState('all');

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'high':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'medium':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'performance':
        return 'Zap';
      case 'error':
        return 'AlertTriangle';
      case 'security':
        return 'Shield';
      case 'capacity':
        return 'HardDrive';
      case 'network':
        return 'Wifi';
      default:
        return 'Bell';
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    if (filter === 'active') return alert.status === 'active';
    return alert.severity === filter;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">System Alerts</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {alerts?.filter(a => !a?.acknowledged)?.length} unacknowledged
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'unacknowledged', 'active', 'critical', 'high', 'medium', 'low']?.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-quick ${
                filter === option
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.map((alert) => (
          <div key={alert.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-quick">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAlertColor(alert.severity)}`}>
                  <Icon name={getAlertIcon(alert.type)} size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.severity)}`}>
                      {alert.severity?.toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">{alert.type}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{formatTimestamp(alert.timestamp)}</span>
                    {!alert.acknowledged && (
                      <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground mb-1">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  
                  {alert.affectedSystems && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Server" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Affected: {alert.affectedSystems?.join(', ')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>ID: {alert.id}</span>
                    <span>Duration: {alert.duration}</span>
                    {alert.escalated && (
                      <span className="text-warning font-medium">Escalated</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {!alert.acknowledged && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAcknowledge(alert.id)}
                    iconName="Check"
                  >
                    Acknowledge
                  </Button>
                )}
                {alert.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResolve(alert.id)}
                    iconName="CheckCircle"
                  >
                    Resolve
                  </Button>
                )}
                <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
              </div>
            </div>

            {alert.actions && alert.actions?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Recommended Actions:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {alert.actions?.map((action, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Icon name="ArrowRight" size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;