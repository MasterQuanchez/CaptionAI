import React from 'react';

interface HeaderProps {
  currentView: 'grid' | 'map';
  onViewChange: (view: 'grid' | 'map') => void;
  selectedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, selectedCount }) => {
  const handleImportPhotos = async () => {
    try {
      const folderPath = await window.electronAPI.dialog.chooseFolder();
      if (folderPath) {
        const result = await window.electronAPI.import.indexFolder(folderPath);
        console.log(`Imported ${result.imported} photos, ${result.errors} errors`);
        // TODO: Refresh photo grid
      }
    } catch (error) {
      console.error('Failed to import photos:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-gray-900">Caption AI</h1>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onViewChange('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => onViewChange('map')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'map'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Map
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {selectedCount > 0 && (
            <span className="text-sm text-gray-500">
              {selectedCount} selected
            </span>
          )}
          
          <button
            onClick={handleImportPhotos}
            className="btn btn-primary"
          >
            Import Photos
          </button>
        </div>
      </div>
    </header>
  );
};