import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DiagnosticTools = ({ platforms, onRunDiagnostic }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [diagnosticType, setDiagnosticType] = useState('connectivity');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const diagnosticTypes = [
    { value: 'connectivity', label: 'Connection Test', icon: 'Wifi' },
    { value: 'authentication', label: 'Auth Check', icon: 'Key' },
    { value: 'scraping', label: 'Scraping Test', icon: 'Search' },
    { value: 'performance', label: 'Performance Test', icon: 'Zap' },
    { value: 'health', label: 'Health Check', icon: 'Heart' }
  ];

  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);

    // Simulate diagnostic run
    setTimeout(() => {
      const mockResults = {
        platform: selectedPlatform || 'All Platforms',
        type: diagnosticType,
        status: Math.random() > 0.3 ? 'success' : 'failed',
        timestamp: new Date()?.toISOString(),
        duration: Math.floor(Math.random() * 5000) + 1000,
        details: {
          connectivity: Math.random() > 0.2 ? 'Connected' : 'Failed',
          responseTime: Math.floor(Math.random() * 2000) + 100,
          dataIntegrity: Math.random() > 0.1 ? 'Valid' : 'Corrupted',
          errorCount: Math.floor(Math.random() * 5)
        }
      };
      setResults(mockResults);
      setIsRunning(false);
      onRunDiagnostic(mockResults);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'failed':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">Diagnostic Tools</h3>
            <p className="text-sm text-muted-foreground">Test platform connectivity and performance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Platforms</option>
              {platforms?.map(platform => (
                <option key={platform?.id} value={platform?.name}>
                  {platform?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Diagnostic Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {diagnosticTypes?.map(type => (
                <button
                  key={type?.value}
                  onClick={() => setDiagnosticType(type?.value)}
                  className={`flex items-center space-x-2 p-3 rounded-md border transition-quick ${
                    diagnosticType === type?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={type?.icon} size={16} />
                  <span className="text-sm font-medium">{type?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleRunDiagnostic}
            disabled={isRunning}
            loading={isRunning}
            iconName="Play"
            className="w-full"
          >
            {isRunning ? 'Running Diagnostic...' : 'Run Diagnostic'}
          </Button>
        </div>
      </div>
      {(isRunning || results) && (
        <div className="p-6">
          {isRunning && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-muted-foreground">Running diagnostic tests...</span>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Diagnostic Results</h4>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(results?.status)}`}>
                  {results?.status?.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Server" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Platform</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{results?.platform}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Duration</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{results?.duration}ms</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Wifi" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Connectivity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{results?.details?.connectivity}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Zap" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Response Time</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{results?.details?.responseTime}ms</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h5 className="font-medium text-foreground mb-2">Additional Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Integrity:</span>
                    <span className="text-foreground">{results?.details?.dataIntegrity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Error Count:</span>
                    <span className="text-foreground">{results?.details?.errorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="text-foreground">
                      {new Date(results.timestamp)?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" iconName="Download">
                  Export Results
                </Button>
                <Button variant="outline" size="sm" iconName="RefreshCw">
                  Run Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticTools;