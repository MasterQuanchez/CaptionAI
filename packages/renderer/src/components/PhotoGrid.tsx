import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PhotoSummary, PhotoQuery } from '@caption-ai/shared';

interface PhotoGridProps {
  selectedPhotos: PhotoSummary[];
  onSelectionChange: (photos: PhotoSummary[]) => void;
  onPhotoSelect: (photo: any) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  selectedPhotos,
  onSelectionChange,
  onPhotoSelect,
}) => {
  const [query, setQuery] = useState<PhotoQuery>({
    search: '',
    limit: 50,
    offset: 0,
  });

  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ['photos', query],
    queryFn: () => window.electronAPI.photos.list(query),
  });

  const handlePhotoClick = (photo: PhotoSummary, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const isSelected = selectedPhotos.some(p => p.id === photo.id);
      if (isSelected) {
        onSelectionChange(selectedPhotos.filter(p => p.id !== photo.id));
      } else {
        onSelectionChange([...selectedPhotos, photo]);
      }
    } else {
      // Single select
      onSelectionChange([photo]);
      onPhotoSelect(photo);
    }
  };

  const isPhotoSelected = (photo: PhotoSummary) => {
    return selectedPhotos.some(p => p.id === photo.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error loading photos</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={(e) => handlePhotoClick(photo, e)}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
              isPhotoSelected(photo)
                ? 'ring-2 ring-primary-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
          >
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              {photo.thumbPath ? (
                <img
                  src={photo.thumbPath}
                  alt={photo.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center p-2">
                  {photo.fileName}
                </div>
              )}
            </div>
            
            {/* Selection indicator */}
            {isPhotoSelected(photo) && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* GPS indicator */}
            {photo.gpsLat && photo.gpsLng && (
              <div className="absolute top-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Face indicator */}
            {photo.hasFaces && (
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No photos found</p>
            <p className="text-sm">Try adjusting your filters or import some photos</p>
          </div>
        </div>
      )}
    </div>
  );
};