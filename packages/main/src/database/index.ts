import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';
import { Photo, PhotoQuery, PhotoSummary, PhotoDetail, Caption, Person, Face, GpxSummary } from '@caption-ai/shared';

export class DatabaseManager {
  private db: Database.Database;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = join(userDataPath, 'caption-ai.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initializeSchema();
  }

  private initializeSchema() {
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    this.db.exec(schema);
  }

  // Photo methods
  insertPhoto(photo: Omit<Photo, 'id'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO photos (
        absPath, fileName, dir, ext, bytes, sha1, importedAt, capturedAt,
        cameraMake, cameraModel, lens, iso, shutter, aperture, focal,
        gpsLat, gpsLng, hasFaces, thumbPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      photo.absPath, photo.fileName, photo.dir, photo.ext, photo.bytes, photo.sha1,
      photo.importedAt, photo.capturedAt, photo.cameraMake, photo.cameraModel,
      photo.lens, photo.iso, photo.shutter, photo.aperture, photo.focal,
      photo.gpsLat, photo.gpsLng, photo.hasFaces, photo.thumbPath
    );
    
    return result.lastInsertRowid as number;
  }

  getPhotos(query: PhotoQuery): PhotoSummary[] {
    let sql = `
      SELECT id, fileName, capturedAt, cameraMake, cameraModel, gpsLat, gpsLng, hasFaces, thumbPath
      FROM photos
      WHERE 1=1
    `;
    const params: any[] = [];

    if (query.search) {
      sql += ` AND id IN (
        SELECT rowid FROM photo_search_fts 
        WHERE photo_search_fts MATCH ?
      )`;
      params.push(query.search);
    }

    if (query.dateFrom) {
      sql += ` AND capturedAt >= ?`;
      params.push(query.dateFrom);
    }

    if (query.dateTo) {
      sql += ` AND capturedAt <= ?`;
      params.push(query.dateTo);
    }

    if (query.cameraMake) {
      sql += ` AND cameraMake = ?`;
      params.push(query.cameraMake);
    }

    if (query.cameraModel) {
      sql += ` AND cameraModel = ?`;
      params.push(query.cameraModel);
    }

    if (query.hasGps !== undefined) {
      if (query.hasGps) {
        sql += ` AND gpsLat IS NOT NULL AND gpsLng IS NOT NULL`;
      } else {
        sql += ` AND (gpsLat IS NULL OR gpsLng IS NULL)`;
      }
    }

    if (query.hasFaces !== undefined) {
      sql += ` AND hasFaces = ?`;
      params.push(query.hasFaces);
    }

    sql += ` ORDER BY capturedAt DESC LIMIT ? OFFSET ?`;
    params.push(query.limit, query.offset);

    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as PhotoSummary[];
  }

  getPhotoDetail(id: number): PhotoDetail | null {
    const photoStmt = this.db.prepare(`
      SELECT * FROM photos WHERE id = ?
    `);
    const photo = photoStmt.get(id) as Photo | null;
    
    if (!photo) return null;

    const captionsStmt = this.db.prepare(`
      SELECT * FROM captions WHERE photoId = ?
    `);
    const captions = captionsStmt.all(id) as Caption[];

    const facesStmt = this.db.prepare(`
      SELECT id, personId, bboxJson, confidence FROM faces WHERE photoId = ?
    `);
    const faces = facesStmt.all(id) as Array<{
      id: number;
      personId: number | null;
      bboxJson: string;
      confidence: number;
    }>;

    return {
      ...photo,
      captions,
      faces: faces.map(f => ({
        ...f,
        bboxJson: f.bboxJson,
      }))
    };
  }

  updateCaption(photoId: number, caption: Partial<Caption>): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO captions 
      (photoId, lang, headline, caption, city, state, country, location, keywordsJson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      photoId,
      caption.lang || 'en',
      caption.headline || null,
      caption.caption || null,
      caption.city || null,
      caption.state || null,
      caption.country || null,
      caption.location || null,
      caption.keywordsJson || null
    );
  }

  batchUpdateCaptions(photoIds: number[], caption: Partial<Caption>): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO captions 
      (photoId, lang, headline, caption, city, state, country, location, keywordsJson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const transaction = this.db.transaction(() => {
      for (const photoId of photoIds) {
        stmt.run(
          photoId,
          caption.lang || 'en',
          caption.headline || null,
          caption.caption || null,
          caption.city || null,
          caption.state || null,
          caption.country || null,
          caption.location || null,
          caption.keywordsJson || null
        );
      }
    });
    
    transaction();
  }

  // Person methods
  createPerson(displayName: string, notes?: string): number {
    const stmt = this.db.prepare(`
      INSERT INTO people (displayName, notes, createdAt)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(displayName, notes || null, new Date().toISOString());
    return result.lastInsertRowid as number;
  }

  deletePerson(id: number): void {
    const stmt = this.db.prepare(`DELETE FROM people WHERE id = ?`);
    stmt.run(id);
  }

  getPeople(): Person[] {
    const stmt = this.db.prepare(`SELECT * FROM people ORDER BY displayName`);
    return stmt.all() as Person[];
  }

  // Face methods
  insertFace(face: Omit<Face, 'id'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO faces (photoId, personId, bboxJson, embeddingBlob, confidence, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      face.photoId,
      face.personId,
      face.bboxJson,
      face.embeddingBlob,
      face.confidence,
      face.createdAt
    );
    
    return result.lastInsertRowid as number;
  }

  assignFaceToPerson(faceId: number, personId: number): void {
    const stmt = this.db.prepare(`UPDATE faces SET personId = ? WHERE id = ?`);
    stmt.run(personId, faceId);
  }

  getFacesByPhoto(photoId: number): Face[] {
    const stmt = this.db.prepare(`SELECT * FROM faces WHERE photoId = ?`);
    return stmt.all(photoId) as Face[];
  }

  // GPX methods
  insertGpxTrack(track: Omit<GpxSummary, 'id'> & { filePath: string }): number {
    const stmt = this.db.prepare(`
      INSERT INTO gpx_tracks (name, filePath, points, distance, duration, startTime, endTime, importedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      track.name,
      track.filePath,
      track.points,
      track.distance,
      track.duration,
      track.startTime,
      track.endTime,
      track.importedAt
    );
    
    return result.lastInsertRowid as number;
  }

  getGpxTracks(): GpxSummary[] {
    const stmt = this.db.prepare(`
      SELECT id, name, points, distance, duration, startTime, endTime
      FROM gpx_tracks ORDER BY importedAt DESC
    `);
    return stmt.all() as GpxSummary[];
  }

  close(): void {
    this.db.close();
  }
}

export const db = new DatabaseManager();