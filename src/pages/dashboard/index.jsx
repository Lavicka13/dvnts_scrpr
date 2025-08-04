import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricCard from './components/MetricCard';
import ActivityFeed from './components/ActivityFeed';
import PlatformMap from './components/PlatformMap';
import TenderChart from './components/TenderChart';
import QuickActions from './components/QuickActions';
import AlertBanner from './components/AlertBanner';
import SystemHealth from './components/SystemHealth';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeScraping: 18,
    dailyTenders: 1247,
    platformsOnline: 22,
    systemHealth: 94
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardMetrics(prev => ({
        ...prev,
        dailyTenders: prev?.dailyTenders + Math.floor(Math.random() * 5),
        systemHealth: Math.max(85, Math.min(100, prev?.systemHealth + (Math.random() - 0.5) * 2))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor your automated tender scraping operations across Europe
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Current Time (CET)</div>
                  <div className="text-lg font-mono font-medium text-foreground">
                    {currentTime.toLocaleString('de-DE', {
                      timeZone: 'Europe/Berlin',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Banners */}
          <AlertBanner />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Scraping Jobs"
              value={dashboardMetrics?.activeScraping}
              change="+2"
              changeType="increase"
              icon="Activity"
              color="primary"
            />
            <MetricCard
              title="Daily Tenders Collected"
              value={dashboardMetrics?.dailyTenders?.toLocaleString()}
              change="+12%"
              changeType="increase"
              icon="Database"
              color="success"
            />
            <MetricCard
              title="Platforms Online"
              value={`${dashboardMetrics?.platformsOnline}/24`}
              change="-1"
              changeType="decrease"
              icon="Globe"
              color="warning"
            />
            <MetricCard
              title="System Health"
              value={`${Math.round(dashboardMetrics?.systemHealth)}%`}
              change="+3%"
              changeType="increase"
              icon="Shield"
              color="success"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Charts and Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tender Volume Chart */}
              <TenderChart />
              
              {/* Platform Status Map */}
              <PlatformMap />
            </div>

            {/* Right Column - Activity and Actions */}
            <div className="space-y-8">
              {/* Activity Feed */}
              <ActivityFeed />
              
              {/* Quick Actions */}
              <QuickActions />
            </div>
          </div>

          {/* Bottom Section - System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SystemHealth />
            
            {/* Recent Performance Summary */}
            <div className="bg-card border border-border rounded-lg p-6 elevation-1">
              <h3 className="text-lg font-semibold text-foreground mb-6">Performance Summary</h3>
              
              <div className="space-y-6">
                {/* Today's Performance */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Today's Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <div className="text-2xl font-semibold text-success">98.5%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-semibold text-primary">2.3s</div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                </div>

                {/* Platform Rankings */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Top Performing Platforms</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'TED Europa', score: 98, tenders: 1247 },
                      { name: 'service.bund.de', score: 95, tenders: 89 },
                      { name: 'Vergabe24', score: 92, tenders: 156 }
                    ]?.map((platform, index) => (
                      <div key={platform?.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{platform?.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-success">{platform?.score}%</div>
                          <div className="text-xs text-muted-foreground">{platform?.tenders} tenders</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Scraped:</span>
                      <span className="ml-2 font-medium text-foreground">47,892</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">This Week:</span>
                      <span className="ml-2 font-medium text-foreground">8,234</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errors:</span>
                      <span className="ml-2 font-medium text-error">23</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duplicates:</span>
                      <span className="ml-2 font-medium text-warning">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Last updated: {currentTime.toLocaleTimeString('de-DE')}</span>
                <span>•</span>
                <span>Data refresh: Every 30 seconds</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-primary" />
                <span>TenderScraper Pro v2.1.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;