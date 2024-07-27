import React from 'react';

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  illustrationsEnabled: boolean;
  setIllustrationsEnabled: (enabled: boolean) => void;
  narrationEnabled: boolean;
  setNarrationEnabled: (enabled: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  closeSidebar,
  illustrationsEnabled,
  setIllustrationsEnabled,
  narrationEnabled,
  setNarrationEnabled
}) => {
  return (
    <div id="sidebar" className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 dark:bg-gray-700 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={closeSidebar}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Menu</h2>
        </div>
        <div className="mt-6">
          <div className="space-y-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={illustrationsEnabled}
                  onChange={() => setIllustrationsEnabled(!illustrationsEnabled)}
                />
                <div className={`block w-14 h-8 rounded-full ${illustrationsEnabled ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${illustrationsEnabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                Illustrations
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={narrationEnabled}
                  onChange={() => setNarrationEnabled(!narrationEnabled)}
                />
                <div className={`block w-14 h-8 rounded-full ${narrationEnabled ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${narrationEnabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                Narration
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
