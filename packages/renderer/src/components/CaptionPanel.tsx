import React, { useState, useEffect } from 'react';
import { PhotoDetail, Caption } from '@caption-ai/shared';

interface CaptionPanelProps {
  photo: PhotoDetail;
  onPhotoUpdate: (photo: PhotoDetail) => void;
}

export const CaptionPanel: React.FC<CaptionPanelProps> = ({ photo, onPhotoUpdate }) => {
  const [activeTab, setActiveTab] = useState<'caption' | 'people' | 'location' | 'exif'>('caption');
  const [caption, setCaption] = useState<Partial<Caption>>({
    lang: 'en',
    headline: '',
    caption: '',
    city: '',
    state: '',
    country: '',
    location: '',
    keywordsJson: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (photo.captions.length > 0) {
      const existingCaption = photo.captions[0];
      setCaption(existingCaption);
    } else {
      setCaption({
        lang: 'en',
        headline: '',
        caption: '',
        city: '',
        state: '',
        country: '',
        location: '',
        keywordsJson: '',
      });
    }
  }, [photo]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await window.electronAPI.photos.updateCaption(photo.id, caption);
      // TODO: Update local state
      console.log('Caption saved');
    } catch (error) {
      console.error('Failed to save caption:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof Caption, value: string) => {
    setCaption(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{photo.fileName}</h3>
        <p className="text-sm text-gray-500">
          {formatDate(photo.capturedAt)} • {Math.round(photo.bytes / 1024 / 1024)}MB
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'caption', label: 'Caption' },
          { id: 'people', label: 'People' },
          { id: 'location', label: 'Location' },
          { id: 'exif', label: 'EXIF' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'caption' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headline
              </label>
              <input
                type="text"
                value={caption.headline || ''}
                onChange={(e) => handleFieldChange('headline', e.target.value)}
                className="input w-full"
                placeholder="Enter headline..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <textarea
                value={caption.caption || ''}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                rows={4}
                className="input w-full"
                placeholder="Enter caption..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={caption.city || ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="input w-full"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={caption.state || ''}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                  className="input w-full"
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={caption.country || ''}
                onChange={(e) => handleFieldChange('country', e.target.value)}
                className="input w-full"
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={caption.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="input w-full"
                placeholder="Specific location..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                value={caption.keywordsJson || ''}
                onChange={(e) => handleFieldChange('keywordsJson', e.target.value)}
                className="input w-full"
                placeholder="Keywords (comma separated)"
              />
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p>Face detection coming soon</p>
              <p className="text-sm">This feature will detect and identify people in your photos</p>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-4">
            {photo.gpsLat && photo.gpsLng ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">GPS Coordinates</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Latitude:</strong> {photo.gpsLat.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Longitude:</strong> {photo.gpsLng.toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>No GPS data available</p>
                <p className="text-sm">This photo doesn't contain location information</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'exif' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Camera Make</label>
                <p className="text-sm text-gray-900">{photo.cameraMake || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Camera Model</label>
                <p className="text-sm text-gray-900">{photo.cameraModel || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Lens</label>
                <p className="text-sm text-gray-900">{photo.lens || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">ISO</label>
                <p className="text-sm text-gray-900">{photo.iso || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Shutter Speed</label>
                <p className="text-sm text-gray-900">{photo.shutter || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Aperture</label>
                <p className="text-sm text-gray-900">{photo.aperture || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Focal Length</label>
                <p className="text-sm text-gray-900">{photo.focal ? `${photo.focal}mm` : 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">File Size</label>
                <p className="text-sm text-gray-900">{Math.round(photo.bytes / 1024 / 1024)}MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary w-full"
        >
          {isSaving ? 'Saving...' : 'Save Caption'}
        </button>
      </div>
    </div>
  );
};