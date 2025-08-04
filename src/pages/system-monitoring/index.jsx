import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SystemHealthCard from './components/SystemHealthCard';
import ActiveJobsPanel from './components/ActiveJobsPanel';
import PerformanceChart from './components/PerformanceChart';
import ErrorLogsPanel from './components/ErrorLogsPanel';
import AlertsPanel from './components/AlertsPanel';
import DiagnosticTools from './components/DiagnosticTools';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SystemMonitoring = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for system health
  const systemHealthData = [
    {
      title: 'CPU Usage',
      status: 'healthy',
      value: '45',
      unit: '%',
      trend: 2.3,
      icon: 'Cpu',
      details: [
        { label: 'Average', value: '42%' },
        { label: 'Peak', value: '67%' }
      ]
    },
    {
      title: 'Memory Usage',
      status: 'warning',
      value: '78',
      unit: '%',
      trend: 5.2,
      icon: 'HardDrive',
      details: [
        { label: 'Used', value: '12.4 GB' },
        { label: 'Available', value: '3.6 GB' }
      ]
    },
    {
      title: 'Active Scrapers',
      status: 'healthy',
      value: '18',
      unit: 'of 22',
      trend: -1.2,
      icon: 'Activity',
      details: [
        { label: 'Running', value: '18' },
        { label: 'Queued', value: '4' }
      ]
    },
    {
      title: 'Success Rate',
      status: 'healthy',
      value: '94.2',
      unit: '%',
      trend: 1.8,
      icon: 'CheckCircle',
      details: [
        { label: 'Last Hour', value: '96.1%' },
        { label: 'Last 24h', value: '94.2%' }
      ]
    }
  ];

  // Mock data for active jobs
  const activeJobs = [
    {
      id: 'job-001',
      platform: 'TED Europa',
      type: 'Full Scrape',
      status: 'running',
      progress: 67,
      eta: '12 min',
      recordsProcessed: 1247,
      duration: '18m 34s'
    },
    {
      id: 'job-002',
      platform: 'service.bund.de',
      type: 'Incremental',
      status: 'running',
      progress: 89,
      eta: '3 min',
      recordsProcessed: 456,
      duration: '8m 12s'
    },
    {
      id: 'job-003',
      platform: 'evergabe-online.de',
      type: 'Full Scrape',
      status: 'queued',
      progress: 0,
      eta: '25 min',
      recordsProcessed: 0,
      duration: '0s'
    },
    {
      id: 'job-004',
      platform: 'dtvp.de',
      type: 'Validation',
      status: 'completed',
      progress: 100,
      eta: 'Complete',
      recordsProcessed: 234,
      duration: '5m 43s'
    },
    {
      id: 'job-005',
      platform: 'FR-BOAMP',
      type: 'Full Scrape',
      status: 'failed',
      progress: 23,
      eta: 'Failed',
      recordsProcessed: 89,
      duration: '2m 15s'
    }
  ];

  // Mock performance data
  const performanceData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000)?.toISOString(),
    throughput: Math.floor(Math.random() * 100) + 50,
    successRate: Math.floor(Math.random() * 20) + 80,
    errorRate: Math.floor(Math.random() * 10) + 2,
    responseTime: Math.floor(Math.random() * 500) + 200
  }));

  // Mock error logs
  const errorLogs = [
    {
      id: 'err-001',
      severity: 'critical',
      platform: 'FR-BOAMP',
      component: 'Authentication Module',
      message: 'Authentication failed after 3 retry attempts',
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      stackTrace: `AuthenticationError: Invalid credentials\n    at AuthModule.authenticate (auth.js:45)\n    at ScrapingService.login (scraper.js:123)\n    at async Platform.connect (platform.js:67)`,
      suggestion: 'Check platform credentials and verify authentication endpoint is accessible',
      occurrences: 3
    },
    {
      id: 'err-002',
      severity: 'error',
      platform: 'TED Europa',
      component: 'Data Parser',
      message: 'Failed to parse tender data structure',
      timestamp: new Date(Date.now() - 900000)?.toISOString(),
      stackTrace: `ParseError: Unexpected data format\n    at DataParser.parse (parser.js:89)\n    at TenderExtractor.extract (extractor.js:156)`,
      suggestion: 'Update parser rules to handle new data format',
      occurrences: 7
    },
    {
      id: 'err-003',
      severity: 'warning',
      platform: 'service.bund.de',
      component: 'Rate Limiter',
      message: 'Rate limit threshold approaching',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      stackTrace: `RateLimitWarning: 85% of rate limit reached\n    at RateLimiter.check (limiter.js:34)`,
      suggestion: 'Consider reducing scraping frequency or implementing backoff strategy',
      occurrences: 1
    }
  ];

  // Mock alerts
  const alerts = [
    {
      id: 'alert-001',
      type: 'performance',
      severity: 'critical',
      title: 'High Memory Usage Detected',
      description: 'System memory usage has exceeded 85% for the past 15 minutes',
      timestamp: new Date(Date.now() - 600000)?.toISOString(),
      acknowledged: false,
      status: 'active',
      duration: '15m',
      escalated: true,
      affectedSystems: ['Scraping Engine', 'Data Processing'],
      actions: [
        'Restart memory-intensive processes',
        'Scale up infrastructure resources',
        'Review memory leak patterns'
      ]
    },
    {
      id: 'alert-002',
      type: 'error',
      severity: 'high',
      title: 'Multiple Platform Connection Failures',
      description: '4 platforms experiencing connection timeouts',
      timestamp: new Date(Date.now() - 1200000)?.toISOString(),
      acknowledged: true,
      status: 'active',
      duration: '20m',
      escalated: false,
      affectedSystems: ['FR-BOAMP', 'IT-CONSIP', 'ES-PLACE', 'PT-BASE'],
      actions: [
        'Check network connectivity',
        'Verify platform endpoints',
        'Review firewall settings'
      ]
    },
    {
      id: 'alert-003',
      type: 'capacity',
      severity: 'medium',
      title: 'Database Storage Warning',
      description: 'Database storage is 75% full',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      acknowledged: false,
      status: 'active',
      duration: '1h',
      escalated: false,
      affectedSystems: ['Primary Database'],
      actions: [
        'Archive old tender data',
        'Expand storage capacity',
        'Optimize database queries'
      ]
    }
  ];

  // Mock platforms for diagnostic tools
  const platforms = [
    { id: 1, name: 'TED Europa' },
    { id: 2, name: 'service.bund.de' },
    { id: 3, name: 'evergabe-online.de' },
    { id: 4, name: 'dtvp.de' },
    { id: 5, name: 'FR-BOAMP' }
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleAcknowledgeAlert = (alertId) => {
    console.log('Acknowledging alert:', alertId);
  };

  const handleResolveAlert = (alertId) => {
    console.log('Resolving alert:', alertId);
  };

  const handleRunDiagnostic = (results) => {
    console.log('Diagnostic results:', results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">System Monitoring</h1>
              <p className="text-muted-foreground mt-2">
                Real-time oversight of scraping operations and system performance
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Auto-refresh:</label>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`w-12 h-6 rounded-full transition-quick ${
                    autoRefresh ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>

              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e?.target?.value)}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              <Button variant="outline" iconName="RefreshCw">
                Refresh
              </Button>
            </div>
          </div>

          {/* System Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemHealthData?.map((health, index) => (
              <SystemHealthCard key={index} {...health} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Performance Charts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerformanceChart
                  title="Scraping Throughput"
                  data={performanceData}
                  dataKey="throughput"
                  color="#1E40AF"
                  type="area"
                  unit=" records/min"
                />
                <PerformanceChart
                  title="Success Rate"
                  data={performanceData}
                  dataKey="successRate"
                  color="#10B981"
                  type="line"
                  unit="%"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerformanceChart
                  title="Error Rate"
                  data={performanceData}
                  dataKey="errorRate"
                  color="#EF4444"
                  type="line"
                  unit="%"
                />
                <PerformanceChart
                  title="Response Time"
                  data={performanceData}
                  dataKey="responseTime"
                  color="#F59E0B"
                  type="area"
                  unit="ms"
                />
              </div>
            </div>

            {/* Active Jobs Panel */}
            <div>
              <ActiveJobsPanel jobs={activeJobs} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Error Logs */}
            <ErrorLogsPanel logs={errorLogs} />
            
            {/* Alerts Panel */}
            <AlertsPanel 
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
            />
          </div>

          {/* Diagnostic Tools */}
          <div className="mb-8">
            <DiagnosticTools 
              platforms={platforms}
              onRunDiagnostic={handleRunDiagnostic}
            />
          </div>

          {/* System Status Footer */}
          <div className="bg-card border border-border rounded-lg p-6 elevation-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-success">System Operational</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Uptime: 99.8% | 18 of 22 platforms active
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Version: 2.1.4</span>
                <span>•</span>
                <span>Build: 20250804</span>
                <span>•</span>
                <span>Environment: Production</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemMonitoring;