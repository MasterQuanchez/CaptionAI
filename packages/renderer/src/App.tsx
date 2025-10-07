import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotoGrid } from './components/PhotoGrid';
import { CaptionPanel } from './components/CaptionPanel';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PhotoDetail, PhotoSummary } from '@caption-ai/shared';

function App() {
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoSummary[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDetail | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'map'>('grid');

  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header 
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedCount={selectedPhotos.length}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          
          <main className="flex-1 flex overflow-hidden">
            {currentView === 'grid' ? (
              <>
                <div className="flex-1 overflow-hidden">
                  <PhotoGrid
                    selectedPhotos={selectedPhotos}
                    onSelectionChange={setSelectedPhotos}
                    onPhotoSelect={setSelectedPhoto}
                  />
                </div>
                {selectedPhoto && (
                  <div className="w-80 border-l border-gray-200 bg-white">
                    <CaptionPanel
                      photo={selectedPhoto}
                      onPhotoUpdate={setSelectedPhoto}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1">
                <MapView selectedPhotos={selectedPhotos} />
              </div>
            )}
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;