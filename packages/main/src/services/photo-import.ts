import { readFile, readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { createHash } from 'crypto';
import sharp from 'sharp';
import { app } from 'electron';
import { db } from '../database';
import { Photo } from '@caption-ai/shared';

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.tiff', '.tif', '.png', '.heic', '.heif', '.cr2', '.nef', '.arw'];

export class PhotoImportService {
  private thumbnailCacheDir: string;

  constructor() {
    this.thumbnailCacheDir = join(app.getPath('userData'), 'Cache', 'thumbnails');
  }

  async indexFolder(folderPath: string): Promise<{ imported: number; errors: number }> {
    let imported = 0;
    let errors = 0;

    try {
      const files = await this.scanDirectory(folderPath);
      
      for (const filePath of files) {
        try {
          await this.importPhoto(filePath);
          imported++;
        } catch (error) {
          console.error(`Failed to import ${filePath}:`, error);
          errors++;
        }
      }
    } catch (error) {
      console.error('Failed to scan directory:', error);
      errors++;
    }

    return { imported, errors };
  }

  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await this.scanDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  private async importPhoto(filePath: string): Promise<void> {
    const stats = await stat(filePath);
    const ext = extname(filePath).toLowerCase();
    const fileName = basename(filePath);
    const dir = dirname(filePath);

    // Calculate file hash
    const fileBuffer = await readFile(filePath);
    const sha1 = createHash('sha1').update(fileBuffer).digest('hex');

    // Check if photo already exists
    const existingPhoto = db.getPhotos({ search: filePath, limit: 1 });
    if (existingPhoto.length > 0) {
      return; // Skip if already imported
    }

    // Extract EXIF data
    const exifData = await this.extractExifData(filePath);
    
    // Generate thumbnail
    const thumbPath = await this.generateThumbnail(filePath, fileBuffer);

    // Create photo record
    const photo: Omit<Photo, 'id'> = {
      absPath: filePath,
      fileName,
      dir,
      ext,
      bytes: stats.size,
      sha1,
      importedAt: new Date().toISOString(),
      capturedAt: exifData.capturedAt,
      cameraMake: exifData.cameraMake,
      cameraModel: exifData.cameraModel,
      lens: exifData.lens,
      iso: exifData.iso,
      shutter: exifData.shutter,
      aperture: exifData.aperture,
      focal: exifData.focal,
      gpsLat: exifData.gpsLat,
      gpsLng: exifData.gpsLng,
      hasFaces: false, // Will be updated when face detection runs
      thumbPath,
    };

    db.insertPhoto(photo);
  }

  private async extractExifData(filePath: string): Promise<{
    capturedAt: string | null;
    cameraMake: string | null;
    cameraModel: string | null;
    lens: string | null;
    iso: number | null;
    shutter: string | null;
    aperture: string | null;
    focal: number | null;
    gpsLat: number | null;
    gpsLng: number | null;
  }> {
    try {
      // For now, return mock data. In production, use exiftool-vendored
      return {
        capturedAt: new Date().toISOString(),
        cameraMake: 'Canon',
        cameraModel: 'EOS R5',
        lens: 'RF 24-70mm f/2.8L IS USM',
        iso: 100,
        shutter: '1/125',
        aperture: 'f/2.8',
        focal: 50,
        gpsLat: null,
        gpsLng: null,
      };
    } catch (error) {
      console.error('Failed to extract EXIF data:', error);
      return {
        capturedAt: null,
        cameraMake: null,
        cameraModel: null,
        lens: null,
        iso: null,
        shutter: null,
        aperture: null,
        focal: null,
        gpsLat: null,
        gpsLng: null,
      };
    }
  }

  private async generateThumbnail(filePath: string, fileBuffer: Buffer): Promise<string> {
    try {
      const fileName = basename(filePath, extname(filePath));
      const thumbFileName = `${fileName}_thumb.jpg`;
      const thumbPath = join(this.thumbnailCacheDir, thumbFileName);

      // Ensure thumbnail directory exists
      await import('fs').then(fs => fs.promises.mkdir(this.thumbnailCacheDir, { recursive: true }));

      // Generate thumbnail with sharp
      await sharp(fileBuffer)
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(thumbPath);

      return thumbPath;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return '';
    }
  }

  getThumbnailPath(photoId: number): string | null {
    const photos = db.getPhotos({ search: photoId.toString(), limit: 1 });
    if (photos.length === 0) return null;
    
    // For now, return a placeholder. In production, return the actual thumbnail path
    return 'file://placeholder-thumbnail.jpg';
  }
}

export const photoImportService = new PhotoImportService();