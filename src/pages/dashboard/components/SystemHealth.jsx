import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealth = () => {
  const [healthMetrics, setHealthMetrics] = useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89,
    database: 92,
    scraping: 78
  });

  const [systemStatus, setSystemStatus] = useState('healthy');

  useEffect(() => {
    // Simulate real-time health updates
    const interval = setInterval(() => {
      setHealthMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev?.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(90, prev?.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(10, Math.min(80, prev?.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(100, prev?.network + (Math.random() - 0.5) * 6)),
        database: Math.max(70, Math.min(100, prev?.database + (Math.random() - 0.5) * 4)),
        scraping: Math.max(60, Math.min(95, prev?.scraping + (Math.random() - 0.5) * 7))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Determine overall system status
    const avgHealth = Object.values(healthMetrics)?.reduce((sum, val) => sum + val, 0) / Object.keys(healthMetrics)?.length;
    
    if (avgHealth >= 80) setSystemStatus('healthy');
    else if (avgHealth >= 60) setSystemStatus('warning');
    else setSystemStatus('critical');
  }, [healthMetrics]);

  const getHealthColor = (value) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthBgColor = (value) => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getStatusConfig = () => {
    switch (systemStatus) {
      case 'healthy':
        return { icon: 'CheckCircle', color: 'text-success', bg: 'bg-success/10', text: 'System Healthy' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning', bg: 'bg-warning/10', text: 'Performance Issues' };
      case 'critical':
        return { icon: 'AlertCircle', color: 'text-error', bg: 'bg-error/10', text: 'Critical Issues' };
      default:
        return { icon: 'Info', color: 'text-muted-foreground', bg: 'bg-muted/10', text: 'Unknown Status' };
    }
  };

  const statusConfig = getStatusConfig();

  const healthItems = [
    { key: 'cpu', label: 'CPU Usage', icon: 'Cpu', unit: '%' },
    { key: 'memory', label: 'Memory', icon: 'HardDrive', unit: '%' },
    { key: 'disk', label: 'Disk Space', icon: 'Database', unit: '%' },
    { key: 'network', label: 'Network', icon: 'Wifi', unit: '%' },
    { key: 'database', label: 'Database', icon: 'Server', unit: '%' },
    { key: 'scraping', label: 'Scraping Engine', icon: 'Activity', unit: '%' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">System Health</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig?.bg}`}>
          <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
          <span className={`text-sm font-medium ${statusConfig?.color}`}>
            {statusConfig?.text}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {healthItems?.map((item) => {
          const value = healthMetrics?.[item?.key];
          return (
            <div key={item?.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item?.label}</span>
                </div>
                <span className={`text-sm font-semibold ${getHealthColor(value)}`}>
                  {Math.round(value)}{item?.unit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getHealthBgColor(value)}`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* System Information */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Uptime:</span>
            <span className="ml-2 font-medium text-foreground">7d 14h 23m</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Check:</span>
            <span className="ml-2 font-medium text-foreground">
              {new Date()?.toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Version:</span>
            <span className="ml-2 font-medium text-foreground">v2.1.4</span>
          </div>
          <div>
            <span className="text-muted-foreground">Environment:</span>
            <span className="ml-2 font-medium text-foreground">Production</span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-4 flex items-center space-x-2">
        <button className="flex items-center space-x-1 px-3 py-1 text-xs text-primary hover:text-primary/80 transition-colors">
          <Icon name="RefreshCw" size={12} />
          <span>Refresh</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="Settings" size={12} />
          <span>Configure</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="Download" size={12} />
          <span>Export Logs</span>
        </button>
      </div>
    </div>
  );
};

export default SystemHealth;