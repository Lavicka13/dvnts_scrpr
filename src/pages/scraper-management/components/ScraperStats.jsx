import React from 'react';
import Icon from '../../../components/AppIcon';

const ScraperStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Tenders Today',
      value: stats?.totalTendersToday?.toLocaleString(),
      change: '+12%',
      changeType: 'increase',
      icon: 'Database',
      color: 'primary'
    },
    {
      title: 'Active Platforms',
      value: `${stats?.activePlatforms}/24`,
      change: '-1',
      changeType: 'decrease',
      icon: 'Globe',
      color: 'warning'
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate}%`,
      change: '+2.1%',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'Avg Response Time',
      value: `${stats?.avgResponseTime}s`,
      change: '-0.3s',
      changeType: 'increase',
      icon: 'Zap',
      color: 'secondary'
    },
    {
      title: 'Total Errors',
      value: stats?.totalErrors,
      change: '+5',
      changeType: 'decrease',
      icon: 'AlertCircle',
      color: 'error'
    },
    {
      title: 'Scheduled Jobs',
      value: stats?.scheduledJobs,
      change: '+2',
      changeType: 'increase',
      icon: 'Clock',
      color: 'info'
    },
    {
      title: 'Completed Jobs',
      value: stats?.completedJobs,
      change: '+23',
      changeType: 'increase',
      icon: 'CheckSquare',
      color: 'success'
    },
    {
      title: 'Failed Jobs',
      value: stats?.failedJobs,
      change: '+3',
      changeType: 'decrease',
      icon: 'XCircle',
      color: 'error'
    }
  ];

  const getColorClasses = (color, changeType) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        icon: 'text-primary'
      },
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        icon: 'text-success'
      },
      warning: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'text-warning'
      },
      error: {
        bg: 'bg-error/10',
        text: 'text-error',
        icon: 'text-error'
      },
      secondary: {
        bg: 'bg-secondary/10',
        text: 'text-secondary',
        icon: 'text-secondary'
      },
      info: {
        bg: 'bg-info/10',
        text: 'text-info',
        icon: 'text-info'
      }
    };

    const changeColorMap = {
      increase: 'text-success',
      decrease: 'text-error',
      neutral: 'text-muted-foreground'
    };

    return {
      ...colorMap?.[color],
      changeColor: changeColorMap?.[changeType]
    };
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'increase': return 'TrendingUp';
      case 'decrease': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
      {statCards?.map((stat, index) => {
        const colors = getColorClasses(stat?.color, stat?.changeType);
        
        return (
          <div key={index} className="bg-card border border-border rounded-lg p-4 hover:elevation-2 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${colors?.bg} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={20} className={colors?.icon} />
              </div>
              
              <div className={`flex items-center space-x-1 text-xs ${colors?.changeColor}`}>
                <Icon name={getChangeIcon(stat?.changeType)} size={12} />
                <span>{stat?.change}</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className={`text-2xl font-semibold ${colors?.text} mb-1`}>
                {stat?.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat?.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScraperStats;