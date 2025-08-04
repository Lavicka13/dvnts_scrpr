import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats, isLoading }) => {
  const defaultStats = {
    totalTenders: 15847,
    newToday: 23,
    closingSoon: 156,
    bookmarked: 89,
    itRelevant: 3421,
    averageValue: 245000,
    activePlatforms: 22,
    lastUpdate: new Date()
  };

  const currentStats = stats || defaultStats;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('de-DE')?.format(value);
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statCards = [
    {
      title: 'Total Tenders',
      value: formatNumber(currentStats?.totalTenders),
      icon: 'Database',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+2.3%',
      changeType: 'positive'
    },
    {
      title: 'New Today',
      value: formatNumber(currentStats?.newToday),
      icon: 'Plus',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+12',
      changeType: 'positive'
    },
    {
      title: 'Closing Soon',
      value: formatNumber(currentStats?.closingSoon),
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '7 days',
      changeType: 'neutral'
    },
    {
      title: 'Bookmarked',
      value: formatNumber(currentStats?.bookmarked),
      icon: 'Bookmark',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'IT Relevant',
      value: formatNumber(currentStats?.itRelevant),
      icon: 'Brain',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '21.6%',
      changeType: 'neutral'
    },
    {
      title: 'Avg. Value',
      value: formatCurrency(currentStats?.averageValue),
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+8.4%',
      changeType: 'positive'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 elevation-1">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 elevation-1 hover-scale transition-smooth">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={16} className={stat?.color} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat?.changeType === 'positive' ? 'bg-success/10 text-success' :
                stat?.changeType === 'negative'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
              }`}>
                {stat?.change}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {stat?.title}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {stat?.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* System Status Bar */}
      <div className="bg-card border border-border rounded-lg p-4 elevation-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle"></div>
              <span className="text-sm text-foreground font-medium">
                {currentStats?.activePlatforms} Platforms Active
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {formatTime(currentStats?.lastUpdate)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Activity" size={16} />
              <span>Real-time monitoring</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;