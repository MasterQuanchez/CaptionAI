import { db } from '../database';
import { Photo, Person, GpxSummary } from '@caption-ai/shared';

export async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  // Create sample photos
  const samplePhotos: Omit<Photo, 'id'>[] = [
    {
      absPath: '/sample/photos/IMG_001.jpg',
      fileName: 'IMG_001.jpg',
      dir: '/sample/photos',
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
      thumbPath: '/cache/thumbnails/IMG_001_thumb.jpg',
    },
    {
      absPath: '/sample/photos/IMG_002.jpg',
      fileName: 'IMG_002.jpg',
      dir: '/sample/photos',
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
      thumbPath: '/cache/thumbnails/IMG_002_thumb.jpg',
    },
    {
      absPath: '/sample/photos/IMG_003.jpg',
      fileName: 'IMG_003.jpg',
      dir: '/sample/photos',
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
      thumbPath: '/cache/thumbnails/IMG_003_thumb.jpg',
    },
  ];

  // Insert sample photos
  for (const photo of samplePhotos) {
    const photoId = db.insertPhoto(photo);
    console.log(`✅ Inserted photo: ${photo.fileName} (ID: ${photoId})`);

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
  }

  // Create sample people
  const people = [
    { displayName: 'John Doe', notes: 'Family member' },
    { displayName: 'Jane Smith', notes: 'Friend from college' },
    { displayName: 'Mike Johnson', notes: 'Colleague' },
  ];

  for (const person of people) {
    const personId = db.createPerson(person.displayName, person.notes);
    console.log(`✅ Created person: ${person.displayName} (ID: ${personId})`);
  }

  // Create sample GPX track
  const gpxTrack: Omit<GpxSummary, 'id'> & { filePath: string } = {
    name: 'Sample Hiking Trail',
    filePath: '/sample/tracks/hiking_trail.gpx',
    points: 150,
    distance: 5.2,
    duration: 7200,
    startTime: new Date('2023-08-15T08:00:00Z').toISOString(),
    endTime: new Date('2023-08-15T10:00:00Z').toISOString(),
    importedAt: new Date().toISOString(),
  };

  const gpxId = db.insertGpxTrack(gpxTrack);
  console.log(`✅ Created GPX track: ${gpxTrack.name} (ID: ${gpxId})`);

  console.log('\n🎉 Database seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Photos: ${samplePhotos.length}`);
  console.log(`   - People: ${people.length}`);
  console.log(`   - GPX tracks: 1`);
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}