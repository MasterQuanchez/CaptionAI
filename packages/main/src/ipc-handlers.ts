import { ipcMain, dialog } from 'electron';
import { IpcChannels, PhotoQuery, PhotoDetail, Caption, Person, GpxSummary, FaceBox, EmbeddingMatch, ExportFields, PdfLayout } from '@caption-ai/shared';
import { db } from './database';
import { photoImportService } from './services/photo-import';

export function setupIpcHandlers() {
  // Dialog handlers
  ipcMain.handle(IpcChannels.DIALOG_CHOOSE_FOLDER, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Photo Folder'
    });
    
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  // Import handlers
  ipcMain.handle(IpcChannels.IMPORT_INDEX_FOLDER, async (_, folderPath: string) => {
    if (!folderPath || typeof folderPath !== 'string') {
      throw new Error('Invalid folder path');
    }
    
    return await photoImportService.indexFolder(folderPath);
  });

  // Photo handlers
  ipcMain.handle(IpcChannels.PHOTOS_LIST, async (_, query: PhotoQuery) => {
    if (!query || typeof query !== 'object') {
      throw new Error('Invalid query parameters');
    }
    
    return db.getPhotos(query);
  });

  ipcMain.handle(IpcChannels.PHOTOS_READ, async (_, photoId: number) => {
    if (!Number.isInteger(photoId) || photoId <= 0) {
      throw new Error('Invalid photo ID');
    }
    
    return db.getPhotoDetail(photoId);
  });

  ipcMain.handle(IpcChannels.PHOTOS_UPDATE_CAPTION, async (_, photoId: number, caption: Partial<Caption>) => {
    if (!Number.isInteger(photoId) || photoId <= 0) {
      throw new Error('Invalid photo ID');
    }
    
    if (!caption || typeof caption !== 'object') {
      throw new Error('Invalid caption data');
    }
    
    db.updateCaption(photoId, caption);
  });

  ipcMain.handle(IpcChannels.PHOTOS_BATCH_UPDATE, async (_, photoIds: number[], caption: Partial<Caption>) => {
    if (!Array.isArray(photoIds) || photoIds.some(id => !Number.isInteger(id) || id <= 0)) {
      throw new Error('Invalid photo IDs');
    }
    
    if (!caption || typeof caption !== 'object') {
      throw new Error('Invalid caption data');
    }
    
    db.batchUpdateCaptions(photoIds, caption);
  });

  // Thumbnail handlers
  ipcMain.handle(IpcChannels.THUMBNAILS_GET, async (_, photoId: number) => {
    if (!Number.isInteger(photoId) || photoId <= 0) {
      throw new Error('Invalid photo ID');
    }
    
    return photoImportService.getThumbnailPath(photoId);
  });

  // GPS handlers
  ipcMain.handle(IpcChannels.GPS_IMPORT_GPX, async (_, filePath: string) => {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path');
    }
    
    // Mock GPX import for now
    const mockGpx: GpxSummary = {
      id: 1,
      name: 'Sample Track',
      points: 100,
      distance: 5.2,
      duration: 3600,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
    };
    
    return mockGpx;
  });

  ipcMain.handle(IpcChannels.GPS_TIME_SYNC, async (_, photos: any[], gpxId: number, offsetSec: number) => {
    if (!Array.isArray(photos) || !Number.isInteger(gpxId) || !Number.isFinite(offsetSec)) {
      throw new Error('Invalid sync parameters');
    }
    
    // Mock time sync for now
    return { matched: photos.length };
  });

  // Face handlers
  ipcMain.handle(IpcChannels.FACES_DETECT, async (_, photoId: number) => {
    if (!Number.isInteger(photoId) || photoId <= 0) {
      throw new Error('Invalid photo ID');
    }
    
    // Mock face detection for now
    const mockFaces: FaceBox[] = [
      {
        id: 1,
        x: 100,
        y: 150,
        width: 200,
        height: 250,
        confidence: 0.95,
      }
    ];
    
    return mockFaces;
  });

  ipcMain.handle(IpcChannels.FACES_EMBED, async (_, photoId: number, faceId: number) => {
    if (!Number.isInteger(photoId) || !Number.isInteger(faceId)) {
      throw new Error('Invalid photo or face ID');
    }
    
    // Mock embedding for now
    return 'embedding-id-123';
  });

  ipcMain.handle(IpcChannels.FACES_MATCH, async (_, embeddingId: string) => {
    if (!embeddingId || typeof embeddingId !== 'string') {
      throw new Error('Invalid embedding ID');
    }
    
    // Mock face matching for now
    const mockMatches: EmbeddingMatch[] = [
      { personId: 1, score: 0.85 },
      { personId: 2, score: 0.72 }
    ];
    
    return mockMatches;
  });

  ipcMain.handle(IpcChannels.FACES_ASSIGN, async (_, faceId: number, personId: number) => {
    if (!Number.isInteger(faceId) || !Number.isInteger(personId)) {
      throw new Error('Invalid face or person ID');
    }
    
    db.assignFaceToPerson(faceId, personId);
  });

  // People handlers
  ipcMain.handle(IpcChannels.PEOPLE_CREATE, async (_, displayName: string, notes?: string) => {
    if (!displayName || typeof displayName !== 'string') {
      throw new Error('Invalid display name');
    }
    
    return db.createPerson(displayName, notes);
  });

  ipcMain.handle(IpcChannels.PEOPLE_DELETE, async (_, personId: number) => {
    if (!Number.isInteger(personId) || personId <= 0) {
      throw new Error('Invalid person ID');
    }
    
    db.deletePerson(personId);
  });

  // Export handlers
  ipcMain.handle(IpcChannels.EXPORT_CSV, async (_, photoIds: number[], fields: ExportFields) => {
    if (!Array.isArray(photoIds) || !Array.isArray(fields)) {
      throw new Error('Invalid export parameters');
    }
    
    // Mock CSV export for now
    const exportPath = `/tmp/export_${Date.now()}.csv`;
    return exportPath;
  });

  ipcMain.handle(IpcChannels.EXPORT_XLSX, async (_, photoIds: number[], fields: ExportFields) => {
    if (!Array.isArray(photoIds) || !Array.isArray(fields)) {
      throw new Error('Invalid export parameters');
    }
    
    // Mock XLSX export for now
    const exportPath = `/tmp/export_${Date.now()}.xlsx`;
    return exportPath;
  });

  ipcMain.handle(IpcChannels.EXPORT_PDF, async (_, photoIds: number[], layout: PdfLayout) => {
    if (!Array.isArray(photoIds) || !layout || typeof layout !== 'object') {
      throw new Error('Invalid export parameters');
    }
    
    // Mock PDF export for now
    const exportPath = `/tmp/export_${Date.now()}.pdf`;
    return exportPath;
  });
}