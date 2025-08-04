import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/scraper-management', label: 'Scraper Management', icon: 'Bot' },
    { path: '/platform-management', label: 'Platform Management', icon: 'Globe' },
    { path: '/tender-database', label: 'Tender Database', icon: 'Database' },
    { path: '/system-monitoring', label: 'System Monitoring', icon: 'Activity' }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Bot" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">TenderScraper Pro</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <Icon name="Bell" size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></div>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <div className="text-sm font-medium text-foreground">Admin User</div>
                    <div className="text-xs text-muted-foreground">admin@diventus.eu</div>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">
                    <Icon name="Settings" size={14} className="inline mr-2" />
                    Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">
                    <Icon name="LogOut" size={14} className="inline mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <nav className="py-4 space-y-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => onMenuToggle()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActiveRoute(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;