import React from 'react';
import Icon from '../../../components/AppIcon';

const ActiveJobsPanel = ({ jobs }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-primary bg-primary/10';
      case 'completed':
        return 'text-success bg-success/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'queued':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'queued':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Active Scraping Jobs</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-success font-medium">{jobs?.filter(j => j?.status === 'running')?.length} Running</span>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {jobs?.map((job) => (
          <div key={job?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-quick">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(job?.status)}`}>
                  <Icon name={getStatusIcon(job?.status)} size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{job?.platform}</h4>
                  <p className="text-sm text-muted-foreground">{job?.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{job?.progress}%</p>
                <p className="text-xs text-muted-foreground">{job?.eta}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job?.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  <Icon name="Database" size={14} className="inline mr-1" />
                  {job?.recordsProcessed} records
                </span>
                <span className="text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  {job?.duration}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {job?.status === 'running' && (
                  <button className="text-error hover:text-error/80 transition-quick">
                    <Icon name="Square" size={14} />
                  </button>
                )}
                <button className="text-muted-foreground hover:text-foreground transition-quick">
                  <Icon name="MoreHorizontal" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveJobsPanel;