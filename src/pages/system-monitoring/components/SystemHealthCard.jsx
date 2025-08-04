import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthCard = ({ title, status, value, unit, trend, icon, details }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'TrendingUp', color: 'text-success' };
    if (trend < 0) return { name: 'TrendingDown', color: 'text-error' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const trendIcon = getTrendIcon(trend);

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1 hover-scale">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(status)}`}>
            <Icon name={icon} size={20} />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground capitalize">{status}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name={trendIcon?.name} size={16} className={trendIcon?.color} />
          <span className={`text-sm font-medium ${trendIcon?.color}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-semibold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
      {details && (
        <div className="space-y-2">
          {details?.map((detail, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{detail?.label}</span>
              <span className="text-foreground font-medium">{detail?.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemHealthCard;