import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Shield from '../../image/shield.png';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  MapIcon, 
  AlertIcon, 
  AccountIcon, 
  MenuIcon, 
  CloseIcon 
} from './NavigationIcons';

const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigationItems = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/map', label: 'Map', icon: MapIcon },
    { path: '/alert', label: 'Alert', icon: AlertIcon },
    { path: '/account', label: 'Account', icon: AccountIcon }
  ];

  // Inject Admin link for admins
  if (isAdmin()) {
    navigationItems.splice(3, 0, { path: '/admin/dashboard', label: 'Admin', icon: AccountIcon });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isMapRoute = location.pathname === '/map';

  return (
    <>
      {!isMapRoute && <div className="h-[70px]"></div>}
      
      <nav 
        className={`${isMapRoute ? 'relative' : 'fixed'} top-0 left-0 right-0 z-50 h-[70px] shadow-lg backdrop-blur-md`}
        style={{
          background: 'rgba(40, 29, 66, 0.95)'
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-5 md:px-8">
          
          <div className="flex-shrink-0">
            <Link to="/home" className="flex items-center">
              <img 
                src={Shield} 
                alt="Tree Lives Matter Logo" 
                className="h-12 w-12 object-contain transition-transform hover:scale-110 duration-300" 
              />
              <span className="ml-3 text-xl font-bold text-yellow-400 hidden sm:block">
                Tree Lives Matter
              </span>
            </Link>
          </div>

          <ul className="hidden md:flex space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium relative overflow-hidden
                      transition-all duration-300 ease-in-out
                      hover:bg-white/10 hover:text-yellow-300 hover:scale-105
                      ${isActive 
                        ? 'text-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25' 
                        : 'text-yellow-100'
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                    
                    <div 
                      className={`
                        absolute bottom-0 left-1/2 h-0.5 bg-yellow-400 
                        transition-all duration-500 ease-out transform -translate-x-1/2
                        ${isActive ? 'w-full' : 'w-0'}
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button 
            className="md:hidden p-2 rounded-lg text-yellow-100 hover:text-yellow-400 hover:bg-white/10 transition-all duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
          </button>
        </div>

        <div 
          className={`
            md:hidden absolute top-full left-0 right-0 
            backdrop-blur-md border-t border-white/10
            transition-all duration-300 ease-in-out
            ${isMobileMenuOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-4'
            }
          `}
          style={{
            background: 'rgba(40, 29, 66, 0.98)'
          }}
        >
          <ul className="py-4 space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <li key={item.path} className="px-4">
                  <Link 
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl
                      transition-all duration-500 ease-in-out transform
                      hover:bg-white/10 hover:text-yellow-300 hover:translate-x-2
                      ${isActive 
                        ? 'text-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25 border-2 border-yellow-400 scale-105 animate-pulse' 
                        : 'text-yellow-100 border-2 border-transparent'
                      }
                    `}
                    onClick={closeMobileMenu}
                  >
                    <IconComponent className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[-1] md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </nav>
    </>
  );
};

export default NavigationBar;