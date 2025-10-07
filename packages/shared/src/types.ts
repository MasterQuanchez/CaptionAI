import { z } from 'zod';

// Photo types
export const PhotoSchema = z.object({
  id: z.number(),
  absPath: z.string(),
  fileName: z.string(),
  dir: z.string(),
  ext: z.string(),
  bytes: z.number(),
  sha1: z.string(),
  importedAt: z.string(),
  capturedAt: z.string().nullable(),
  cameraMake: z.string().nullable(),
  cameraModel: z.string().nullable(),
  lens: z.string().nullable(),
  iso: z.number().nullable(),
  shutter: z.string().nullable(),
  aperture: z.string().nullable(),
  focal: z.number().nullable(),
  gpsLat: z.number().nullable(),
  gpsLng: z.number().nullable(),
  hasFaces: z.boolean(),
  thumbPath: z.string().nullable(),
});

export const PhotoSummarySchema = PhotoSchema.pick({
  id: true,
  fileName: true,
  capturedAt: true,
  cameraMake: true,
  cameraModel: true,
  gpsLat: true,
  gpsLng: true,
  hasFaces: true,
  thumbPath: true,
});

export const PhotoDetailSchema = PhotoSchema.extend({
  captions: z.array(z.object({
    lang: z.string(),
    headline: z.string().nullable(),
    caption: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    location: z.string().nullable(),
    keywordsJson: z.string().nullable(),
  })),
  faces: z.array(z.object({
    id: z.number(),
    personId: z.number().nullable(),
    bboxJson: z.string(),
    confidence: z.number(),
  })),
});

// Caption types
export const CaptionSchema = z.object({
  photoId: z.number(),
  lang: z.string(),
  headline: z.string().nullable(),
  caption: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  location: z.string().nullable(),
  keywordsJson: z.string().nullable(),
});

// Person types
export const PersonSchema = z.object({
  id: z.number(),
  displayName: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

// Face types
export const FaceSchema = z.object({
  id: z.number(),
  photoId: z.number(),
  personId: z.number().nullable(),
  bboxJson: z.string(),
  embeddingBlob: z.string().nullable(),
  confidence: z.number(),
  createdAt: z.string(),
});

// Project types
export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
});

// Query types
export const PhotoQuerySchema = z.object({
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  cameraMake: z.string().optional(),
  cameraModel: z.string().optional(),
  hasGps: z.boolean().optional(),
  hasFaces: z.boolean().optional(),
  limit: z.number().default(50),
  offset: z.number().default(0),
});

// GPX types
export const GpxSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number(),
  distance: z.number(),
  duration: z.number(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
});

// Face detection types
export const FaceBoxSchema = z.object({
  id: z.number(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  confidence: z.number(),
});

export const EmbeddingMatchSchema = z.object({
  personId: z.number(),
  score: z.number(),
});

// Export types
export const ExportFieldsSchema = z.array(z.enum([
  'fileName',
  'capturedAt',
  'cameraMake',
  'cameraModel',
  'lens',
  'iso',
  'shutter',
  'aperture',
  'focal',
  'gpsLat',
  'gpsLng',
  'headline',
  'caption',
  'city',
  'state',
  'country',
  'location',
  'keywords',
]));

export const PdfLayoutSchema = z.object({
  imagesPerPage: z.number().min(1).max(4),
  pageSize: z.enum(['A4', 'Letter']),
  margin: z.number().min(0).max(50),
});

// Type exports
export type Photo = z.infer<typeof PhotoSchema>;
export type PhotoSummary = z.infer<typeof PhotoSummarySchema>;
export type PhotoDetail = z.infer<typeof PhotoDetailSchema>;
export type Caption = z.infer<typeof CaptionSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Face = z.infer<typeof FaceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type PhotoQuery = z.infer<typeof PhotoQuerySchema>;
export type GpxSummary = z.infer<typeof GpxSummarySchema>;
export type FaceBox = z.infer<typeof FaceBoxSchema>;
export type EmbeddingMatch = z.infer<typeof EmbeddingMatchSchema>;
export type ExportFields = z.infer<typeof ExportFieldsSchema>;
export type PdfLayout = z.infer<typeof PdfLayoutSchema>;

// IPC Channel types
export const IpcChannels = {
  DIALOG_CHOOSE_FOLDER: 'dialog:choose-folder',
  IMPORT_INDEX_FOLDER: 'import:index-folder',
  PHOTOS_LIST: 'photos:list',
  PHOTOS_READ: 'photos:read',
  PHOTOS_UPDATE_CAPTION: 'photos:update-caption',
  PHOTOS_BATCH_UPDATE: 'photos:batch-update',
  THUMBNAILS_GET: 'thumbnails:get',
  GPS_IMPORT_GPX: 'gps:import-gpx',
  GPS_TIME_SYNC: 'gps:time-sync',
  FACES_DETECT: 'faces:detect',
  FACES_EMBED: 'faces:embed',
  FACES_MATCH: 'faces:match',
  FACES_ASSIGN: 'faces:assign',
  PEOPLE_CREATE: 'people:create',
  PEOPLE_DELETE: 'people:delete',
  EXPORT_CSV: 'export:csv',
  EXPORT_XLSX: 'export:xlsx',
  EXPORT_PDF: 'export:pdf',
} as const;

export type IpcChannel = typeof IpcChannels[keyof typeof IpcChannels];