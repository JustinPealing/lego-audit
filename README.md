# LEGO Set Audit App

A Progressive Web App (PWA) for auditing and tracking LEGO set builds on mobile devices.

## Features

- ✅ Look up any LEGO set by number using the Rebrickable API
- ✅ Display all parts with images, names, and quantities
- ✅ Two tracking modes:
  - **Checkbox mode**: Simple have/don't have tracking
  - **Counter mode**: Track exact quantity of each part
- ✅ Save multiple audits to local storage
- ✅ Visual progress tracking
- ✅ Works offline after initial set load
- ✅ Installable as a mobile app (PWA)
- ✅ Mobile-first responsive design

## Live Demo

Visit: [https://justinpealing.github.io/lego-audit/](https://justinpealing.github.io/lego-audit/)

## Getting Started

### Prerequisites

- A free Rebrickable API key (get one at [rebrickable.com/api](https://rebrickable.com/api/))

### How to Use

1. Open the app in your browser
2. Enter your Rebrickable API key (first-time setup)
3. Search for a LEGO set by number (e.g., "75192-1" or "75192")
4. Start tracking parts!

### Installation

You can install this app on your mobile device:

- **iOS**: Tap the Share button, then "Add to Home Screen"
- **Android**: Tap the menu button, then "Add to Home Screen" or "Install app"

## Development

### Tech Stack

- **Frontend**: React 18 + Vite
- **API**: Rebrickable API
- **Storage**: LocalStorage
- **PWA**: vite-plugin-pwa with Workbox
- **Hosting**: GitHub Pages

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/JustinPealing/lego-audit.git
   cd lego-audit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build

```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy

The app automatically deploys to GitHub Pages on push to the `master` branch via GitHub Actions.

Manual deployment:
```bash
npm run deploy
```

## Project Structure

```
lego-audit/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── ApiKeySetup/  # API key validation
│   │   ├── SetLookup/    # Set search
│   │   ├── SetDetails/   # Set information display
│   │   ├── PartsList/    # Parts list and tracking
│   │   ├── AuditProgress/# Progress bar
│   │   ├── TrackingMode/ # Mode toggle
│   │   └── AuditView/    # Main audit view
│   ├── context/          # React context (state management)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API client, storage, cache
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── vite.config.js        # Vite configuration
└── package.json
```

## Privacy

- Your API key is stored locally in your browser's LocalStorage
- No data is sent to any server except Rebrickable's official API
- All audit data is stored locally on your device

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Chrome for Android
- Safari for iOS 14+

## Known Limitations

- LocalStorage is limited to ~5-10MB per domain
- Maximum of 20 saved audits to stay within storage limits
- Images require initial online access to cache

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- LEGO data provided by [Rebrickable](https://rebrickable.com/)
- Built with [React](https://react.dev/) and [Vite](https://vite.dev/)

## Changelog

### v0.1.0 (2025-12-24)

- Initial release
- Core audit functionality
- PWA support
- Mobile-first design
- Checkbox and counter tracking modes
