import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformStats = ({ platforms }) => {
  const stats = {
    total: platforms?.length,
    active: platforms?.filter(p => p?.status === 'active')?.length,
    inactive: platforms?.filter(p => p?.status === 'inactive')?.length,
    error: platforms?.filter(p => p?.status === 'error')?.length,
    maintenance: platforms?.filter(p => p?.status === 'maintenance')?.length,
    avgSuccessRate: platforms?.reduce((acc, p) => acc + p?.successRate, 0) / platforms?.length,
    totalTenders: platforms?.reduce((acc, p) => acc + (p?.tendersScraped || 0), 0),
    lastHourScrapes: platforms?.filter(p => {
      const lastScrape = new Date(p.lastScrape);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return lastScrape > oneHourAgo;
    })?.length
  };

  const statCards = [
    {
      title: 'Total Platforms',
      value: stats?.total,
      icon: 'Globe',
      color: 'text-primary bg-primary/10',
      change: null
    },
    {
      title: 'Active Platforms',
      value: stats?.active,
      icon: 'CheckCircle',
      color: 'text-success bg-success/10',
      change: `${((stats?.active / stats?.total) * 100)?.toFixed(0)}%`
    },
    {
      title: 'Success Rate',
      value: `${(stats?.avgSuccessRate * 100)?.toFixed(1)}%`,
      icon: 'TrendingUp',
      color: 'text-success bg-success/10',
      change: '+2.3%'
    },
    {
      title: 'Issues Detected',
      value: stats?.error,
      icon: 'AlertCircle',
      color: 'text-error bg-error/10',
      change: stats?.error > 0 ? 'Needs attention' : 'All good'
    },
    {
      title: 'Tenders Scraped',
      value: stats?.totalTenders?.toLocaleString('de-DE'),
      icon: 'Database',
      color: 'text-accent bg-accent/10',
      change: '+1,247 today'
    },
    {
      title: 'Active Scrapes',
      value: stats?.lastHourScrapes,
      icon: 'Activity',
      color: 'text-warning bg-warning/10',
      change: 'Last hour'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-4 elevation-1 hover-scale transition-smooth"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat?.color}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            {stat?.change && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat?.change?.includes('+') ? 'text-success bg-success/10' :
                stat?.change?.includes('attention') ? 'text-error bg-error/10' :
                'text-muted-foreground bg-muted'
              }`}>
                {stat?.change}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">{stat?.value}</div>
            <div className="text-sm text-muted-foreground">{stat?.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlatformStats;