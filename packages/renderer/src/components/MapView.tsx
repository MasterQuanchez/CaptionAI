import React, { useEffect, useRef } from 'react';
import { PhotoSummary } from '@caption-ai/shared';

interface MapViewProps {
  selectedPhotos: PhotoSummary[];
}

export const MapView: React.FC<MapViewProps> = ({ selectedPhotos }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Leaflet map
    const initMap = async () => {
      if (!mapRef.current) return;

      // Dynamic import to avoid SSR issues
      const L = await import('leaflet');
      
      // Fix for default markers in webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for photos with GPS data
      const photosWithGps = selectedPhotos.filter(photo => photo.gpsLat && photo.gpsLng);
      
      photosWithGps.forEach(photo => {
        if (photo.gpsLat && photo.gpsLng) {
          L.marker([photo.gpsLat, photo.gpsLng])
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h4 class="font-medium text-sm">${photo.fileName}</h4>
                <p class="text-xs text-gray-500">${photo.capturedAt ? new Date(photo.capturedAt).toLocaleDateString() : 'Unknown date'}</p>
                ${photo.cameraMake && photo.cameraModel ? `<p class="text-xs text-gray-500">${photo.cameraMake} ${photo.cameraModel}</p>` : ''}
              </div>
            `);
        }
      });

      // Fit map to show all markers
      if (photosWithGps.length > 0) {
        const group = new L.featureGroup(photosWithGps.map(photo => 
          L.marker([photo.gpsLat!, photo.gpsLng!])
        ));
        map.fitBounds(group.getBounds().pad(0.1));
      }

      return () => {
        map.remove();
      };
    };

    initMap();
  }, [selectedPhotos]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Map View</h3>
        <p className="text-sm text-gray-500">
          {selectedPhotos.filter(p => p.gpsLat && p.gpsLng).length} photos with GPS data
        </p>
      </div>
      
      <div className="flex-1">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
};