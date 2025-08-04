import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ScraperControlPanel from './components/ScraperControlPanel';
import ScrapingJobsTable from './components/ScrapingJobsTable';
import PlatformSelector from './components/PlatformSelector';
import ScraperStats from './components/ScraperStats';
import ScheduleManager from './components/ScheduleManager';
import DataExportPanel from './components/DataExportPanel';
import scraperService from '../../services/scraperService';

const ScraperManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [scraperHealth, setScraperHealth] = useState(null);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState('control');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock scraping statistics
  const [stats, setStats] = useState({
    totalTendersToday: 2847,
    activePlatforms: 18,
    successRate: 94.3,
    avgResponseTime: 2.4,
    totalErrors: 23,
    scheduledJobs: 12,
    completedJobs: 156,
    failedJobs: 8
  });

  useEffect(() => {
    // Initialize platforms from scraper service
    const availablePlatforms = scraperService?.getPlatforms();
    setPlatforms(availablePlatforms);

    // Load active jobs
    loadActiveJobs();
    
    // Check scraper health
    checkScraperHealth();

    // Set up auto-refresh
    const interval = setInterval(() => {
      loadActiveJobs();
      setLastUpdate(new Date());
      updateStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadActiveJobs = () => {
    const jobs = scraperService?.getActiveJobs();
    setActiveJobs(jobs);
    setIsScrapingActive(jobs?.some(job => job?.status === 'running'));
  };

  const checkScraperHealth = async () => {
    try {
      const health = await scraperService?.healthCheck();
      setScraperHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setScraperHealth({
        status: 'error',
        error: error?.message,
        timestamp: new Date()?.toISOString()
      });
    }
  };

  const updateStats = () => {
    setStats(prev => ({
      ...prev,
      totalTendersToday: prev?.totalTendersToday + Math.floor(Math.random() * 10),
      successRate: Math.max(85, Math.min(100, prev?.successRate + (Math.random() - 0.5) * 2)),
      avgResponseTime: Math.max(1, Math.min(5, prev?.avgResponseTime + (Math.random() - 0.5) * 0.5))
    }));
  };

  const handleStartScraping = async (options = {}) => {
    if (selectedPlatforms?.length === 0) {
      alert('Please select at least one platform to scrape');
      return;
    }

    try {
      setIsScrapingActive(true);
      
      if (selectedPlatforms?.length === 1) {
        // Single platform scraping
        const result = await scraperService?.startScraping(selectedPlatforms?.[0], options);
        console.log('Scraping result:', result);
      } else {
        // Batch scraping
        const result = await scraperService?.batchScrape(selectedPlatforms, options);
        console.log('Batch scraping result:', result);
      }
      
      loadActiveJobs();
    } catch (error) {
      console.error('Scraping failed:', error);
      alert(`Scraping failed: ${error?.message}`);
      setIsScrapingActive(false);
    }
  };

  const handleStopScraping = (jobId) => {
    const success = scraperService?.stopJob(jobId);
    if (success) {
      loadActiveJobs();
    }
  };

  const handleStopAllScraping = () => {
    activeJobs?.forEach(job => {
      if (job?.status === 'running') {
        scraperService?.stopJob(job?.id);
      }
    });
    loadActiveJobs();
    setIsScrapingActive(false);
  };

  const handlePlatformSelection = (platformIds) => {
    setSelectedPlatforms(platformIds);
  };

  const handleScheduleJob = (scheduleData) => {
    console.log('Scheduling job:', scheduleData);
    // Implementation for scheduling jobs
  };

  const handleExportData = (exportOptions) => {
    console.log('Exporting data:', exportOptions);
    // Implementation for data export
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'degraded': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const tabs = [
    { id: 'control', label: 'Scraper Control', icon: 'Play' },
    { id: 'platforms', label: 'Platform Selection', icon: 'Globe' },
    { id: 'jobs', label: 'Active Jobs', icon: 'Activity' },
    { id: 'schedule', label: 'Schedule Manager', icon: 'Clock' },
    { id: 'export', label: 'Data Export', icon: 'Download' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
        isMenuOpen={isMenuOpen} 
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Scraper Management
              </h1>
              <p className="text-muted-foreground mt-2">
                AI-powered tender scraping with DeepSeek and Crawl4AI integration
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Health Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  scraperHealth?.status === 'healthy' ? 'bg-success animate-pulse' :
                  scraperHealth?.status === 'degraded' ? 'bg-warning' : 'bg-error'
                }`}></div>
                <span className={`text-sm font-medium ${getStatusColor(scraperHealth?.status)}`}>
                  {scraperHealth?.status || 'Unknown'}
                </span>
              </div>

              {/* Last Update */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Updated: {lastUpdate?.toLocaleTimeString()}</span>
              </div>

              {/* Emergency Stop */}
              {isScrapingActive && (
                <Button 
                  variant="destructive" 
                  onClick={handleStopAllScraping}
                  iconName="Square"
                >
                  Emergency Stop
                </Button>
              )}
            </div>
          </div>

          {/* Statistics */}
          <ScraperStats stats={stats} />

          {/* Navigation Tabs */}
          <div className="bg-card border border-border rounded-lg mb-8">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setSelectedTab(tab?.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    selectedTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {selectedTab === 'control' && (
              <ScraperControlPanel
                isScrapingActive={isScrapingActive}
                selectedPlatforms={selectedPlatforms}
                onStartScraping={handleStartScraping}
                onStopScraping={handleStopAllScraping}
                scraperHealth={scraperHealth}
              />
            )}

            {selectedTab === 'platforms' && (
              <PlatformSelector
                platforms={platforms}
                selectedPlatforms={selectedPlatforms}
                onSelectionChange={handlePlatformSelection}
              />
            )}

            {selectedTab === 'jobs' && (
              <ScrapingJobsTable
                jobs={activeJobs}
                onStopJob={handleStopScraping}
                onViewDetails={(job) => console.log('View details:', job)}
              />
            )}

            {selectedTab === 'schedule' && (
              <ScheduleManager
                platforms={platforms}
                onScheduleJob={handleScheduleJob}
              />
            )}

            {selectedTab === 'export' && (
              <DataExportPanel
                onExport={handleExportData}
                stats={stats}
              />
            )}
          </div>

          {/* Service Status Footer */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Service Status</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Brain" size={16} className="text-primary" />
                      <span className={getStatusColor(scraperHealth?.services?.openai)}>
                        OpenAI: {scraperHealth?.services?.openai || 'unknown'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Bot" size={16} className="text-secondary" />
                      <span className={getStatusColor(scraperHealth?.services?.crawl4ai)}>
                        Crawl4AI: {scraperHealth?.services?.crawl4ai || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Configuration</h4>
                  <div className="text-sm text-muted-foreground">
                    {platforms?.length} platforms configured • High availability mode
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Built for diventus.eu
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Fault-tolerant • Scalable • AI-powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScraperManagement;