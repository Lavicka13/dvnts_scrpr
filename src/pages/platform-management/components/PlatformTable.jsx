import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlatformTable = ({ platforms, onSelectPlatform, selectedPlatform, onEditPlatform, onTestConnection, onViewLogs }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPlatforms = [...platforms]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'lastScrape' || sortField === 'nextScrape') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'inactive': return 'text-muted-foreground bg-muted';
      case 'error': return 'text-error bg-error/10';
      case 'maintenance': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'inactive': return 'Pause';
      case 'error': return 'AlertCircle';
      case 'maintenance': return 'Settings';
      default: return 'Circle';
    }
  };

  const formatSuccessRate = (rate) => {
    return `${(rate * 100)?.toFixed(1)}%`;
  };

  const formatLastScrape = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-quick"
                >
                  <span>Platform</span>
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('country')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-quick"
                >
                  <span>Country</span>
                  <Icon 
                    name={sortField === 'country' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-quick"
                >
                  <span>Status</span>
                  <Icon 
                    name={sortField === 'status' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('lastScrape')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-quick"
                >
                  <span>Last Scrape</span>
                  <Icon 
                    name={sortField === 'lastScrape' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('successRate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-quick"
                >
                  <span>Success Rate</span>
                  <Icon 
                    name={sortField === 'successRate' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Configuration</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlatforms?.map((platform) => (
              <tr
                key={platform?.id}
                className={`border-b border-border hover:bg-muted/30 transition-quick cursor-pointer ${
                  selectedPlatform?.id === platform?.id ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => onSelectPlatform(platform)}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <Icon name="Globe" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{platform?.name}</div>
                      <div className="text-sm text-muted-foreground">{platform?.url}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{platform?.flag}</span>
                    <span className="text-sm text-foreground">{platform?.country}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(platform?.status)}`}>
                    <Icon name={getStatusIcon(platform?.status)} size={12} />
                    <span className="capitalize">{platform?.status}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{formatLastScrape(platform?.lastScrape)}</div>
                  <div className="text-xs text-muted-foreground">
                    Next: {formatLastScrape(platform?.nextScrape)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          platform?.successRate >= 0.9 ? 'bg-success' :
                          platform?.successRate >= 0.7 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${platform?.successRate * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground min-w-[3rem]">
                      {formatSuccessRate(platform?.successRate)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    platform?.configured ? 'text-success bg-success/10' : 'text-warning bg-warning/10'
                  }`}>
                    <Icon name={platform?.configured ? 'CheckCircle' : 'AlertTriangle'} size={12} />
                    <span>{platform?.configured ? 'Complete' : 'Incomplete'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onEditPlatform(platform);
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onTestConnection(platform);
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="Zap" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onViewLogs(platform);
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="FileText" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatformTable;