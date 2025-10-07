import React, { useState } from 'react';
import { PhotoQuery } from '@caption-ai/shared';

export const Sidebar: React.FC = () => {
  const [filters, setFilters] = useState<PhotoQuery>({
    search: '',
    dateFrom: '',
    dateTo: '',
    cameraMake: '',
    cameraModel: '',
    hasGps: undefined,
    hasFaces: undefined,
    limit: 50,
    offset: 0,
  });

  const handleFilterChange = (key: keyof PhotoQuery, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Search & Filters</h3>
        
        <div className="space-y-4">
          {/* Text Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search photos..."
              className="input w-full text-sm"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="input w-full text-sm"
              />
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="input w-full text-sm"
              />
            </div>
          </div>

          {/* Camera Filters */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Camera Make
            </label>
            <select
              value={filters.cameraMake || ''}
              onChange={(e) => handleFilterChange('cameraMake', e.target.value)}
              className="input w-full text-sm"
            >
              <option value="">All Makes</option>
              <option value="Canon">Canon</option>
              <option value="Nikon">Nikon</option>
              <option value="Sony">Sony</option>
              <option value="Fujifilm">Fujifilm</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Camera Model
            </label>
            <select
              value={filters.cameraModel || ''}
              onChange={(e) => handleFilterChange('cameraModel', e.target.value)}
              className="input w-full text-sm"
            >
              <option value="">All Models</option>
              <option value="EOS R5">EOS R5</option>
              <option value="EOS R6">EOS R6</option>
              <option value="D850">D850</option>
              <option value="A7R IV">A7R IV</option>
            </select>
          </div>

          {/* Boolean Filters */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasGps === true}
                onChange={(e) => handleFilterChange('hasGps', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-xs text-gray-700">Has GPS</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasFaces === true}
                onChange={(e) => handleFilterChange('hasFaces', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-xs text-gray-700">Has Faces</span>
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({
              search: '',
              dateFrom: '',
              dateTo: '',
              cameraMake: '',
              cameraModel: '',
              hasGps: undefined,
              hasFaces: undefined,
              limit: 50,
              offset: 0,
            })}
            className="btn btn-secondary w-full text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </aside>
  );
};