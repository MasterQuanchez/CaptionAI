import { db } from '../database';
import { Photo } from '@caption-ai/shared';

// Create some mock photos for development
export function createMockPhotos(): void {
  const mockPhotos: Omit<Photo, 'id'>[] = [
    {
      absPath: '/Users/developer/Pictures/IMG_001.jpg',
      fileName: 'IMG_001.jpg',
      dir: '/Users/developer/Pictures',
      ext: '.jpg',
      bytes: 2048576,
      sha1: 'abc123def456',
      importedAt: new Date().toISOString(),
      capturedAt: new Date('2023-08-15T10:30:00Z').toISOString(),
      cameraMake: 'Canon',
      cameraModel: 'EOS R5',
      lens: 'RF 24-70mm f/2.8L IS USM',
      iso: 100,
      shutter: '1/125',
      aperture: 'f/2.8',
      focal: 50,
      gpsLat: 40.7128,
      gpsLng: -74.0060,
      hasFaces: true,
      thumbPath: 'file://placeholder-thumbnail.jpg',
    },
    {
      absPath: '/Users/developer/Pictures/IMG_002.jpg',
      fileName: 'IMG_002.jpg',
      dir: '/Users/developer/Pictures',
      ext: '.jpg',
      bytes: 1536000,
      sha1: 'def456ghi789',
      importedAt: new Date().toISOString(),
      capturedAt: new Date('2023-08-15T14:45:00Z').toISOString(),
      cameraMake: 'Sony',
      cameraModel: 'A7R IV',
      lens: 'FE 70-200mm f/2.8 GM OSS',
      iso: 200,
      shutter: '1/250',
      aperture: 'f/4',
      focal: 135,
      gpsLat: 40.7589,
      gpsLng: -73.9851,
      hasFaces: false,
      thumbPath: 'file://placeholder-thumbnail.jpg',
    },
    {
      absPath: '/Users/developer/Pictures/IMG_003.jpg',
      fileName: 'IMG_003.jpg',
      dir: '/Users/developer/Pictures',
      ext: '.jpg',
      bytes: 3072000,
      sha1: 'ghi789jkl012',
      importedAt: new Date().toISOString(),
      capturedAt: new Date('2023-08-16T09:15:00Z').toISOString(),
      cameraMake: 'Nikon',
      cameraModel: 'D850',
      lens: 'NIKKOR 14-24mm f/2.8G ED',
      iso: 64,
      shutter: '1/60',
      aperture: 'f/8',
      focal: 18,
      gpsLat: null,
      gpsLng: null,
      hasFaces: true,
      thumbPath: 'file://placeholder-thumbnail.jpg',
    },
  ];

  for (const photo of mockPhotos) {
    try {
      const photoId = db.insertPhoto(photo);
      console.log(`Created mock photo: ${photo.fileName} (ID: ${photoId})`);
      
      // Add sample captions
      if (photoId === 1) {
        db.updateCaption(photoId, {
          lang: 'en',
          headline: 'Sunset over Manhattan',
          caption: 'Beautiful sunset view from Brooklyn Bridge Park',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          location: 'Brooklyn Bridge Park',
          keywordsJson: JSON.stringify(['sunset', 'manhattan', 'brooklyn', 'bridge']),
        });
      } else if (photoId === 2) {
        db.updateCaption(photoId, {
          lang: 'en',
          headline: 'Central Park Wildlife',
          caption: 'A peaceful moment in Central Park',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          location: 'Central Park',
          keywordsJson: JSON.stringify(['wildlife', 'central park', 'nature']),
        });
      }
    } catch (error) {
      // Photo might already exist, skip
      console.log(`Photo ${photo.fileName} already exists, skipping...`);
    }
  }
}