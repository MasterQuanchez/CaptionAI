# Caption AI - Desktop Photo Captioning App

A cross-platform desktop application for photographers to caption and archive images with strict privacy (all local processing). Built with Electron, React, TypeScript, and SQLite.

## Features

- **Local Photo Import**: Index photos from folders without copying files
- **Smart Thumbnails**: Generate cached thumbnails for fast browsing
- **Advanced Filtering**: Filter by date, camera, GPS, faces, and text search
- **Caption Management**: Edit IPTC captions, headlines, people, and locations
- **Map View**: Visualize photos on a map with GPS data
- **Face Recognition**: Local face detection and person identification (optional)
- **Export Options**: CSV, XLSX, and PDF contact sheets
- **Privacy First**: All processing happens locally, no data leaves your computer

## Tech Stack

- **Electron**: Cross-platform desktop app framework
- **React + TypeScript**: Modern UI with type safety
- **Vite**: Fast build tool and dev server
- **SQLite**: Local database with better-sqlite3
- **Sharp**: Image processing and thumbnail generation
- **Leaflet**: Interactive maps
- **Tailwind CSS**: Utility-first styling

## Project Structure

```
caption-ai-desktop/
├── packages/
│   ├── main/           # Electron main process
│   ├── preload/        # Context bridge for secure IPC
│   ├── renderer/       # React frontend
│   └── shared/         # Shared types and utilities
├── package.json        # Root package.json with workspaces
└── tsconfig.json       # TypeScript project references
```

## Prerequisites

- Node.js 18+ 
- Yarn 1.22+
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd caption-ai-desktop
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Build shared packages**
   ```bash
   yarn workspace @caption-ai/shared build
   ```

## Development

1. **Start development servers**
   ```bash
   yarn dev
   ```
   This will start both the Electron main process and Vite dev server with hot reload.

2. **Build for production**
   ```bash
   yarn build
   ```

3. **Create distributables**
   ```bash
   yarn dist
   ```

## Usage

### Importing Photos

1. Click "Import Photos" in the header
2. Select a folder containing your photos
3. The app will index all supported image formats (JPG, RAW, TIFF, etc.)
4. Thumbnails will be generated automatically

### Browsing and Filtering

- Use the left sidebar to filter photos by date, camera, GPS, or faces
- Search across captions, people, and metadata
- Click photos to select them (Ctrl/Cmd+click for multi-select)

### Editing Captions

1. Select a photo to open the caption panel
2. Edit headline, caption, location, and keywords
3. Switch between tabs for different metadata types
4. Click "Save Caption" to persist changes

### Map View

- Switch to Map view to see photos with GPS data on a map
- Click markers to see photo details
- Import GPX tracks for time-synchronized photo mapping

### Face Recognition (Coming Soon)

- Enable face detection in Settings
- Detect faces in photos locally
- Create person profiles and assign faces
- Get suggestions for face matches

### Exporting

- Select photos and choose export format (CSV, XLSX, PDF)
- Customize which fields to include
- Generate print-ready contact sheets

## Security & Privacy

- **Context Isolation**: Enabled for secure IPC communication
- **Sandbox**: Renderer process runs in sandbox mode
- **No Network Access**: All processing happens locally by default
- **Local Storage**: Database and thumbnails stored in user data directory
- **Face Data**: Embeddings stored locally, never uploaded

## Building for Distribution

### macOS

```bash
yarn dist --mac
```

The app will be signed for distribution (requires Apple Developer account for notarization).

### Windows

```bash
yarn dist --win
```

Creates an NSIS installer.

### Linux

```bash
yarn dist --linux
```

Creates an AppImage.

## Troubleshooting

### Common Issues

1. **Build errors**: Ensure all dependencies are installed with `yarn install`
2. **Database errors**: Check that the user data directory is writable
3. **Thumbnail generation fails**: Ensure Sharp is properly installed
4. **Map not loading**: Check internet connection for tile loading

### Development Issues

1. **TypeScript errors**: Run `yarn typecheck` to see all type errors
2. **Linting errors**: Run `yarn lint` to check code style
3. **Hot reload not working**: Restart the dev server

### Performance

- Large photo collections may take time to index initially
- Thumbnail generation is CPU-intensive but runs in background
- Consider using SSD storage for better database performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] Face recognition with @vladmandic/face-api
- [ ] GPX track import and time synchronization
- [ ] Advanced export templates
- [ ] Plugin system for custom metadata
- [ ] Batch operations and automation
- [ ] Cloud sync (optional, user-controlled)

## Support

For issues and questions:
- Check the troubleshooting section above
- Search existing GitHub issues
- Create a new issue with detailed information

---

Built with ❤️ for photographers who value privacy and control over their data.