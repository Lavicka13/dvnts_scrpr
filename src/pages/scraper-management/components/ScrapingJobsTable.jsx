import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { formatDistanceToNow } from 'date-fns';

const ScrapingJobsTable = ({ jobs, onStopJob, onViewDetails }) => {
  const [sortBy, setSortBy] = useState('startTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sort and filter jobs
  const filteredJobs = jobs?.filter(job => 
    statusFilter === 'all' || job?.status === statusFilter
  );

  const sortedJobs = [...(filteredJobs || [])]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];

    if (sortBy === 'startTime') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-primary';
      case 'completed': return 'text-success';
      case 'failed': return 'text-error';
      case 'stopped': return 'text-warning';
      case 'queued': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      running: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-success/10 text-success border-success/20',
      failed: 'bg-error/10 text-error border-error/20',
      stopped: 'bg-warning/10 text-warning border-warning/20',
      queued: 'bg-muted text-muted-foreground border-border'
    };

    return colors?.[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getProgressBar = (progress, status) => {
    const color = status === 'failed' ? 'bg-error' : 
                  status === 'completed' ? 'bg-success' : 'bg-primary';
    
    return (
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end - start;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const statusCounts = jobs?.reduce((acc, job) => {
    acc[job?.status] = (acc?.[job?.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Active Scraping Jobs</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage ongoing scraping operations
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status ({jobs?.length || 0})</option>
              <option value="running">Running ({statusCounts?.running || 0})</option>
              <option value="completed">Completed ({statusCounts?.completed || 0})</option>
              <option value="failed">Failed ({statusCounts?.failed || 0})</option>
              <option value="queued">Queued ({statusCounts?.queued || 0})</option>
            </select>

            <Button variant="outline" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { status: 'running', label: 'Running', count: statusCounts?.running || 0 },
            { status: 'completed', label: 'Completed', count: statusCounts?.completed || 0 },
            { status: 'failed', label: 'Failed', count: statusCounts?.failed || 0 },
            { status: 'queued', label: 'Queued', count: statusCounts?.queued || 0 },
            { status: 'stopped', label: 'Stopped', count: statusCounts?.stopped || 0 }
          ]?.map(({ status, label, count }) => (
            <div key={status} className="text-center">
              <div className={`text-2xl font-semibold ${getStatusColor(status)}`}>
                {count}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Jobs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('platformId')}
                    className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Platform</span>
                    <Icon name={getSortIcon('platformId')} size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Status</span>
                    <Icon name={getSortIcon('status')} size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('progress')}
                    className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Progress</span>
                    <Icon name={getSortIcon('progress')} size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('recordsProcessed')}
                    className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Records</span>
                    <Icon name={getSortIcon('recordsProcessed')} size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('startTime')}
                    className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Duration</span>
                    <Icon name={getSortIcon('startTime')} size={14} />
                  </button>
                </th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs?.map((job) => (
                <tr key={job?.id} className="border-t border-border hover:bg-muted/25">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {job?.platformId?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Job ID: {job?.id?.split('_')?.pop()?.substring(0, 8)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      getStatusBadge(job?.status)
                    }`}>
                      {job?.status === 'running' && (
                        <Icon name="Loader2" size={12} className="mr-1 animate-spin" />
                      )}
                      {job?.status?.charAt(0)?.toUpperCase() + job?.status?.slice(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{job?.progress}%</span>
                        {job?.status === 'running' && (
                          <span className="text-xs text-muted-foreground">
                            ETA: {Math.ceil((100 - job?.progress) * 0.5)}min
                          </span>
                        )}
                      </div>
                      {getProgressBar(job?.progress, job?.status)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-foreground">
                      {job?.recordsProcessed?.toLocaleString()}
                    </div>
                    {job?.status === 'running' && (
                      <div className="text-xs text-muted-foreground">
                        ~{Math.ceil(job?.recordsProcessed / 10)}/min
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">
                      {formatDuration(job?.startTime, job?.completedAt || job?.failedAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(job?.startTime), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(job)}
                        iconName="Eye"
                      >
                        Details
                      </Button>
                      
                      {job?.status === 'running' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onStopJob(job?.id)}
                          iconName="Square"
                        >
                          Stop
                        </Button>
                      )}
                      
                      {(job?.status === 'failed' || job?.status === 'completed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Restart job:', job?.id)}
                          iconName="RotateCcw"
                        >
                          Restart
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedJobs?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No scraping jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all' ? 'Start a scraping operation to see jobs here' : 
                `No jobs with status "${statusFilter}" found`
              }
            </p>
            {statusFilter !== 'all' && (
              <Button variant="outline" onClick={() => setStatusFilter('all')}>
                Show All Jobs
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapingJobsTable;