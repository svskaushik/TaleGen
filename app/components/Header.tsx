import React from 'react';

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  return (
    <header className="bg-gray-100 dark:bg-gray-700 shadow-md p-4 flex justify-between items-center">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-grow text-center">                                                                                                                                                                                            
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Talegen</h1>                                                                                                                                                 
      </div>  
    </header>
  );
};

export default Header;
