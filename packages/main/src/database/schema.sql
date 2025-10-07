-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  absPath TEXT UNIQUE NOT NULL,
  fileName TEXT NOT NULL,
  dir TEXT NOT NULL,
  ext TEXT NOT NULL,
  bytes INTEGER NOT NULL,
  sha1 TEXT NOT NULL,
  importedAt TEXT NOT NULL,
  capturedAt TEXT,
  cameraMake TEXT,
  cameraModel TEXT,
  lens TEXT,
  iso INTEGER,
  shutter TEXT,
  aperture TEXT,
  focal REAL,
  gpsLat REAL,
  gpsLng REAL,
  hasFaces BOOLEAN DEFAULT FALSE,
  thumbPath TEXT
);

-- Captions table
CREATE TABLE IF NOT EXISTS captions (
  photoId INTEGER NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  headline TEXT,
  caption TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  location TEXT,
  keywordsJson TEXT,
  PRIMARY KEY (photoId, lang),
  FOREIGN KEY (photoId) REFERENCES photos(id) ON DELETE CASCADE
);

-- People table
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  displayName TEXT NOT NULL,
  notes TEXT,
  createdAt TEXT NOT NULL
);

-- Faces table
CREATE TABLE IF NOT EXISTS faces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photoId INTEGER NOT NULL,
  personId INTEGER,
  bboxJson TEXT NOT NULL,
  embeddingBlob BLOB,
  confidence REAL NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (photoId) REFERENCES photos(id) ON DELETE CASCADE,
  FOREIGN KEY (personId) REFERENCES people(id) ON DELETE SET NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL
);

-- Photo-Project junction table
CREATE TABLE IF NOT EXISTS photo_projects (
  photoId INTEGER NOT NULL,
  projectId INTEGER NOT NULL,
  PRIMARY KEY (photoId, projectId),
  FOREIGN KEY (photoId) REFERENCES photos(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);

-- GPX tracks table
CREATE TABLE IF NOT EXISTS gpx_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  filePath TEXT NOT NULL,
  points INTEGER NOT NULL,
  distance REAL NOT NULL,
  duration REAL NOT NULL,
  startTime TEXT,
  endTime TEXT,
  importedAt TEXT NOT NULL
);

-- GPX points table
CREATE TABLE IF NOT EXISTS gpx_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trackId INTEGER NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  elevation REAL,
  time TEXT NOT NULL,
  FOREIGN KEY (trackId) REFERENCES gpx_tracks(id) ON DELETE CASCADE
);

-- FTS5 virtual table for search
CREATE VIRTUAL TABLE IF NOT EXISTS photo_search_fts USING fts5(
  fileName,
  cameraMake,
  cameraModel,
  lens,
  headline,
  caption,
  city,
  state,
  country,
  location,
  keywords,
  content='photos',
  content_rowid='id'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS photos_ai AFTER INSERT ON photos BEGIN
  INSERT INTO photo_search_fts(rowid, fileName, cameraMake, cameraModel, lens)
  VALUES (new.id, new.fileName, new.cameraMake, new.cameraModel, new.lens);
END;

CREATE TRIGGER IF NOT EXISTS photos_au AFTER UPDATE ON photos BEGIN
  UPDATE photo_search_fts SET
    fileName = new.fileName,
    cameraMake = new.cameraMake,
    cameraModel = new.cameraModel,
    lens = new.lens
  WHERE rowid = new.id;
END;

CREATE TRIGGER IF NOT EXISTS photos_ad AFTER DELETE ON photos BEGIN
  DELETE FROM photo_search_fts WHERE rowid = old.id;
END;

CREATE TRIGGER IF NOT EXISTS captions_ai AFTER INSERT ON captions BEGIN
  UPDATE photo_search_fts SET
    headline = new.headline,
    caption = new.caption,
    city = new.city,
    state = new.state,
    country = new.country,
    location = new.location,
    keywords = new.keywordsJson
  WHERE rowid = new.photoId;
END;

CREATE TRIGGER IF NOT EXISTS captions_au AFTER UPDATE ON captions BEGIN
  UPDATE photo_search_fts SET
    headline = new.headline,
    caption = new.caption,
    city = new.city,
    state = new.state,
    country = new.country,
    location = new.location,
    keywords = new.keywordsJson
  WHERE rowid = new.photoId;
END;

CREATE TRIGGER IF NOT EXISTS captions_ad AFTER DELETE ON captions BEGIN
  UPDATE photo_search_fts SET
    headline = NULL,
    caption = NULL,
    city = NULL,
    state = NULL,
    country = NULL,
    location = NULL,
    keywords = NULL
  WHERE rowid = old.photoId;
END;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_captured_at ON photos(capturedAt);
CREATE INDEX IF NOT EXISTS idx_photos_camera ON photos(cameraMake, cameraModel);
CREATE INDEX IF NOT EXISTS idx_photos_gps ON photos(gpsLat, gpsLng);
CREATE INDEX IF NOT EXISTS idx_photos_has_faces ON photos(hasFaces);
CREATE INDEX IF NOT EXISTS idx_faces_photo_id ON faces(photoId);
CREATE INDEX IF NOT EXISTS idx_faces_person_id ON faces(personId);
CREATE INDEX IF NOT EXISTS idx_gpx_points_track_time ON gpx_points(trackId, time);