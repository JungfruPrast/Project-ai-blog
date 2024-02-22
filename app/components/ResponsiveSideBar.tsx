'use client'

import React, { useState, ReactNode } from 'react';

interface ResponsiveSidebarWrapperProps {
  children: ReactNode; // This type accepts any valid React child, including undefined
}

const ResponsiveSidebarWrapper: React.FC<ResponsiveSidebarWrapperProps> = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <nav className="relative lg:static">
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="lg:hidden fixed z-40 top-20 right-6 bg-black text-white dark:bg-white dark:text-black p-2 rounded-full shadow-lg"
        aria-label={isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}>
        {isSidebarVisible ? 'Close' : 'Menu'}
      </button>

      {/* Overlay */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-50 z-30"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <div className={`fixed lg:static ${isSidebarVisible ? 'block' : 'hidden'} lg:block z-30 bg-white dark:bg-transparent`}>
        {/* Children components are rendered here */}
        {children}
      </div>
    </nav>
  );
};

export default ResponsiveSidebarWrapper;
