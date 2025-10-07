# 🚀 Quick Start Guide - Caption AI Desktop App

## Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Yarn** - Will be installed automatically if missing

## One-Command Setup & Run

### Option 1: Automated Setup (Recommended)
```bash
# Make the setup script executable and run it
chmod +x setup.sh
./setup.sh

# Start the application
yarn dev
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
yarn install

# 2. Build shared package (required)
yarn workspace @caption-ai/shared build

# 3. Start development mode
yarn dev
```

## What You'll See

1. **Electron window opens** with the Caption AI interface
2. **3 sample photos** appear in the grid (automatically created)
3. **Filter sidebar** on the left for searching/filtering
4. **Caption panel** on the right when you select a photo
5. **Map view** tab to see photos with GPS data

## Testing the App

### 📸 Import Real Photos
1. Click **"Import Photos"** button
2. Select a folder with your photos
3. Watch as photos are indexed and thumbnails generated

### ✏️ Edit Captions
1. Click any photo in the grid
2. Edit caption, headline, location in the right panel
3. Click **"Save Caption"** to save changes

### 🗺️ View on Map
1. Click **"Map"** tab in header
2. Photos with GPS data appear as markers
3. Click markers to see photo details

### 🔍 Filter Photos
- Use left sidebar to filter by date, camera, GPS, faces
- Type in search box to find specific photos
- Toggle checkboxes for GPS and face filters

## Troubleshooting

### If setup fails:
```bash
# Clean and retry
rm -rf node_modules
yarn install
yarn workspace @caption-ai/shared build
```

### If app doesn't start:
```bash
# Check for errors
yarn typecheck
yarn lint

# Try building first
yarn build
yarn dev
```

### If you see database errors:
- The app creates its own SQLite database automatically
- Mock data is added in development mode
- Database location: `~/AppData/Roaming/caption-ai-desktop/` (Windows) or `~/Library/Application Support/caption-ai-desktop/` (macOS)

## Development Features

- **Hot reload**: React changes update instantly
- **DevTools**: Press F12 to open browser dev tools
- **Console logs**: See database operations and photo processing
- **Mock data**: 3 sample photos with GPS and EXIF data

## File Structure
```
caption-ai-desktop/
├── packages/
│   ├── main/        # Electron main process
│   ├── preload/     # IPC bridge
│   ├── renderer/    # React frontend
│   └── shared/      # Shared types
├── setup.sh         # Automated setup script
└── README.md        # Full documentation
```

## Next Steps

Once the app is running:
1. **Import your photos** using the Import Photos button
2. **Test caption editing** by clicking photos and editing metadata
3. **Try the map view** to see photos with GPS data
4. **Experiment with filters** to find specific photos
5. **Check the console** to see how the app processes your photos

The app is designed to be a professional photo management tool with local processing and privacy-first approach. All your data stays on your computer!

---

**Need help?** Check the full README.md for detailed documentation and troubleshooting.