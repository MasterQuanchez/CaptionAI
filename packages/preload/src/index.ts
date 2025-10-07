import { contextBridge, ipcRenderer } from 'electron';
import { 
  IpcChannels, 
  PhotoQuery, 
  PhotoSummary, 
  PhotoDetail, 
  Caption, 
  Person, 
  GpxSummary, 
  FaceBox, 
  EmbeddingMatch, 
  ExportFields, 
  PdfLayout 
} from '@caption-ai/shared';

// Define the API that will be exposed to the renderer process
const electronAPI = {
  // Dialog API
  dialog: {
    chooseFolder: (): Promise<string | null> => 
      ipcRenderer.invoke(IpcChannels.DIALOG_CHOOSE_FOLDER),
  },

  // Import API
  import: {
    indexFolder: (path: string): Promise<{ imported: number; errors: number }> =>
      ipcRenderer.invoke(IpcChannels.IMPORT_INDEX_FOLDER, path),
  },

  // Photos API
  photos: {
    list: (query: PhotoQuery): Promise<PhotoSummary[]> =>
      ipcRenderer.invoke(IpcChannels.PHOTOS_LIST, query),
    
    read: (id: number): Promise<PhotoDetail | null> =>
      ipcRenderer.invoke(IpcChannels.PHOTOS_READ, id),
    
    updateCaption: (photoId: number, caption: Partial<Caption>): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.PHOTOS_UPDATE_CAPTION, photoId, caption),
    
    batchUpdate: (ids: number[], caption: Partial<Caption>): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.PHOTOS_BATCH_UPDATE, ids, caption),
  },

  // Thumbnails API
  thumbnails: {
    get: (photoId: number): Promise<string | null> =>
      ipcRenderer.invoke(IpcChannels.THUMBNAILS_GET, photoId),
  },

  // GPS API
  gps: {
    importGpx: (filePath: string): Promise<GpxSummary> =>
      ipcRenderer.invoke(IpcChannels.GPS_IMPORT_GPX, filePath),
    
    timeSync: (photos: any[], gpxId: number, offsetSec: number): Promise<{ matched: number }> =>
      ipcRenderer.invoke(IpcChannels.GPS_TIME_SYNC, photos, gpxId, offsetSec),
  },

  // Face detection API
  faces: {
    detect: (photoId: number): Promise<FaceBox[]> =>
      ipcRenderer.invoke(IpcChannels.FACES_DETECT, photoId),
    
    embed: (photoId: number, faceId: number): Promise<string> =>
      ipcRenderer.invoke(IpcChannels.FACES_EMBED, photoId, faceId),
    
    match: (embeddingId: string): Promise<EmbeddingMatch[]> =>
      ipcRenderer.invoke(IpcChannels.FACES_MATCH, embeddingId),
    
    assign: (faceId: number, personId: number): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.FACES_ASSIGN, faceId, personId),
  },

  // People API
  people: {
    create: (displayName: string, notes?: string): Promise<number> =>
      ipcRenderer.invoke(IpcChannels.PEOPLE_CREATE, displayName, notes),
    
    delete: (personId: number): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.PEOPLE_DELETE, personId),
  },

  // Export API
  export: {
    csv: (photoIds: number[], fields: ExportFields): Promise<string> =>
      ipcRenderer.invoke(IpcChannels.EXPORT_CSV, photoIds, fields),
    
    xlsx: (photoIds: number[], fields: ExportFields): Promise<string> =>
      ipcRenderer.invoke(IpcChannels.EXPORT_XLSX, photoIds, fields),
    
    pdf: (photoIds: number[], layout: PdfLayout): Promise<string> =>
      ipcRenderer.invoke(IpcChannels.EXPORT_PDF, photoIds, layout),
  },

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, callback);
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.off(channel, callback);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for the global window object
declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}