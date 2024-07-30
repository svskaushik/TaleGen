import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-gray-100 dark:bg-gray-700 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
      >
        {isSidebarOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      <div className="flex-grow text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Talegen</h1>
      </div>
    </header>
  );
};

export default Header;
