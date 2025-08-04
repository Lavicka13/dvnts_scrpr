import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorLogsPanel = ({ logs }) => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [expandedLog, setExpandedLog] = useState(null);

  const severityOptions = ['all', 'critical', 'error', 'warning', 'info'];
  const platformOptions = ['all', ...new Set(logs.map(log => log.platform))];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'info':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      default:
        return 'Circle';
    }
  };

  const filteredLogs = logs?.filter(log => {
    const severityMatch = selectedSeverity === 'all' || log?.severity === selectedSeverity;
    const platformMatch = selectedPlatform === 'all' || log?.platform === selectedPlatform;
    return severityMatch && platformMatch;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Error Logs</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Severity:</label>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-md text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {severityOptions?.map(option => (
                <option key={option} value={option}>
                  {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Platform:</label>
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-md text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {platformOptions?.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Platforms' : option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredLogs?.map((log) => (
          <div key={log?.id} className="border-b border-border last:border-b-0">
            <div 
              className="p-4 hover:bg-muted/50 cursor-pointer transition-quick"
              onClick={() => setExpandedLog(expandedLog === log?.id ? null : log?.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSeverityColor(log?.severity)}`}>
                    <Icon name={getSeverityIcon(log?.severity)} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log?.severity)}`}>
                        {log?.severity?.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">{log?.platform}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{formatTimestamp(log?.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">{log?.message}</p>
                    <p className="text-sm text-muted-foreground">{log?.component}</p>
                  </div>
                </div>
                <Icon 
                  name={expandedLog === log?.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground"
                />
              </div>
            </div>

            {expandedLog === log?.id && (
              <div className="px-4 pb-4 bg-muted/30">
                <div className="bg-card border border-border rounded-md p-4">
                  <h4 className="font-medium text-foreground mb-2">Stack Trace</h4>
                  <pre className="text-xs text-muted-foreground bg-muted p-3 rounded-md overflow-x-auto font-mono">
                    {log?.stackTrace}
                  </pre>
                  
                  {log?.suggestion && (
                    <div className="mt-4">
                      <h4 className="font-medium text-foreground mb-2">Suggested Resolution</h4>
                      <p className="text-sm text-muted-foreground">{log?.suggestion}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Error ID: {log?.id}</span>
                      <span>Occurrences: {log?.occurrences}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" iconName="Copy">
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" iconName="ExternalLink">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorLogsPanel;