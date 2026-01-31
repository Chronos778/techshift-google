# 🏙️ Smart City Reporter

> AI-powered city issue reporting platform using Google Cloud technologies

![Smart City Reporter](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.7-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Overview

Smart City Reporter is a production-ready web application that empowers citizens to report city infrastructure issues in seconds using cutting-edge AI technology. The platform leverages Google Cloud services to provide intelligent issue detection, automated analysis, and real-time tracking.

**Live Demo:** [https://smart-city-auto-reporter.web.app](https://smart-city-auto-reporter.web.app)

### Key Features

- 📸 **Smart Image Upload** - Drag & drop or click to upload issue photos
- 🤖 **AI-Powered Analysis** - Automatic issue detection using Google Cloud Vision API
- 📝 **AI Description Generation** - Context-aware descriptions via Google Gemini AI
- 🗺️ **Location Detection** - GPS-based precise location pinning with Google Maps
- 📊 **Real-time Dashboard** - Track all city issues on an interactive map
- 🎮 **Gamification** - Points and badges system to encourage civic participation
- 🔔 **Real-time Notifications** - Stay updated on issue status changes
- 🎨 **Modern UI** - Dark theme with glassmorphism and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account ([Create one](https://firebase.google.com/))
- Google Cloud Platform account ([Sign up](https://cloud.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chronos778/techshit-google.git
   cd smart-city-reporter
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase and Google Maps API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Configure Firebase Functions**
   
   Edit `functions/index.js` and add your API keys:
   ```javascript
   const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "your_gemini_key";
   const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "your_maps_key";
   ```

5. **Initialize Firebase**
   ```bash
   firebase login
   firebase init
   # Select: Firestore, Functions, Hosting
   # Use existing project
   ```

6. **Deploy Firestore rules and indexes**
   ```bash
   firebase deploy --only firestore
   ```

7. **Deploy Cloud Functions**
   ```bash
   firebase deploy --only functions
   ```

8. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
smart-city-reporter/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Admin dashboard components
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── IssueDetailModal.jsx
│   │   │   ├── IssueList.jsx
│   │   │   └── MapView.jsx
│   │   ├── landing/         # Landing page sections
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── GoogleSection.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── StatsSection.jsx
│   │   ├── layout/          # Layout components
│   │   │   └── Navbar.jsx
│   │   ├── report/          # Issue reporting wizard
│   │   │   ├── StepUpload.jsx
│   │   │   ├── StepAnalysis.jsx
│   │   │   ├── StepLocation.jsx
│   │   │   └── StepConfirm.jsx
│   │   ├── gamification/    # Points and leaderboard
│   │   │   └── Leaderboard.jsx
│   │   ├── notifications/   # Notification system
│   │   │   └── NotificationCenter.jsx
│   │   └── ui/             # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       └── StatusBadge.jsx
│   ├── pages/              # Main pages
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ReportIssue.jsx
│   ├── services/           # API services
│   │   ├── firebase.js
│   │   ├── gemini.js
│   │   ├── vision.js
│   │   └── maps.js
│   ├── hooks/              # Custom React hooks
│   │   └── useIssues.js
│   ├── utils/              # Utility functions
│   │   └── userUtils.js
│   ├── firebase.js         # Firebase initialization
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── functions/              # Firebase Cloud Functions
│   ├── index.js           # Function definitions
│   └── package.json
├── public/                # Static assets
├── firestore.rules        # Firestore security rules
├── firebase.json          # Firebase configuration
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json

```

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend & Services
- **Firebase Authentication** - User management
- **Cloud Firestore** - Real-time database
- **Firebase Storage** - Image storage
- **Cloud Functions** - Serverless backend
- **Google Cloud Vision API** - Image analysis
- **Google Gemini AI** - Description generation
- **Google Maps API** - Location services

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google Sign-In)
3. Create a Firestore database (use `techshit` as database ID)
4. Enable Storage
5. Deploy Cloud Functions

### Google Cloud APIs

Enable the following APIs in [Google Cloud Console](https://console.cloud.google.com/):
- Cloud Vision API
- Gemini API
- Maps JavaScript API
- Geocoding API

### Firestore Database Structure

```javascript
// Collections
issues/               # City issues
  {issueId}/
    - type: string
    - imageUrl: string
    - location: { lat, lng, address }
    - status: 'pending' | 'in-progress' | 'resolved'
    - resolved: boolean
    - aiAnalysis: { summary, labels, confidence }
    - userId: string
    - createdAt: timestamp

users/                # User profiles
  {userId}/
    - displayName: string
    - email: string
    - photoURL: string
    - points: number
    - badges: array

notifications/        # User notifications
  {notificationId}/
    - userId: string
    - title: string
    - message: string
    - type: string
    - read: boolean
    - createdAt: timestamp
```

## 📚 API Documentation

### Cloud Functions

#### `analyzeIssueRequest`
Triggered when a new issue is created. Analyzes the image and updates the issue with AI results.

#### `onIssueStatusChange`
Triggered when an issue status changes. Creates notifications for the user.

#### `analyzeImage` (Callable)
Analyzes an uploaded image using Cloud Vision API.
```javascript
const result = await analyzeImage({ imageUrl, storagePath, bucket });
// Returns: { labels, detectedIssueType, confidence }
```

#### `generateDescription` (Callable)
Generates a description using Gemini AI.
```javascript
const result = await generateDescription({ imageUrl, visionResults });
// Returns: { description, suggestedPriority, confidence, keywords }
```

## 🎨 UI Components

### Custom Theme

The app uses a cyberpunk-inspired dark theme with neon accents:

```javascript
// Tailwind colors
colors: {
  'dark-bg': '#0A0E1A',
  'dark-card': '#111827',
  'dark-border': '#1F2937',
  'neon-blue': '#00D9FF',
  'neon-purple': '#B24BF3',
  'neon-green': '#39FF14',
  'neon-cyan': '#00FFFF'
}
```

### Reusable Components

- **Button** - Styled buttons with variants
- **Card** - Glassmorphism cards
- **Modal** - Draggable modals
- **StatusBadge** - Color-coded status indicators
- **IssueTypeTag** - Issue category tags
- **LoadingSpinner** - Animated loading states

## 🚀 Deployment

### Deploy to Firebase Hosting

1. **Build the production app**
   ```bash
   npm run build
   ```

2. **Deploy everything**
   ```bash
   firebase deploy
   ```

3. **Deploy specific services**
   ```bash
   firebase deploy --only hosting     # Frontend only
   firebase deploy --only functions   # Functions only
   firebase deploy --only firestore   # Rules only
   ```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

### Environment Variables for Production

Set environment variables in Firebase Functions:
```bash
firebase functions:config:set gemini.key="YOUR_GEMINI_KEY"
firebase functions:config:set maps.key="YOUR_MAPS_KEY"
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build and preview production
npm run build
npm run preview

# Test Firebase Functions locally
cd functions
npm test
```

## 📊 Features Breakdown

### Issue Reporting Flow
1. **Upload** - Drag & drop or capture photo
2. **AI Analysis** - Vision API detects issue type
3. **Location** - Auto-detect or manual pin
4. **Confirm** - Review and submit

### Dashboard Features
- **Stats Overview** - Total reports, pending, in-progress, resolved
- **Interactive Map** - View all issues geographically
- **Issue Management** - Update status, delete issues
- **Filters** - Sort by status, type, date

### Admin Capabilities
- Update issue status (Pending → In Progress → Resolved)
- Delete inappropriate reports
- View detailed AI analysis
- Track resolution timeline

## 🔒 Security

- **Firestore Rules** - Authenticated read/write with admin privileges
- **Storage Rules** - Authenticated uploads only
- **API Keys** - Client-side keys with referrer restrictions
- **CORS** - Configured for Cloud Functions
- **Environment Variables** - Secrets not committed to repo

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud** for Vision API and Gemini AI
- **Firebase** for backend infrastructure
- **Tailwind CSS** for styling framework
- **Framer Motion** for animations
- **Lucide** for beautiful icons

## 📧 Contact

- **Project Link:** [https://github.com/Chronos778/techshit-google](https://github.com/Chronos778/techshit-google)
- **Live Demo:** [https://smart-city-auto-reporter.web.app](https://smart-city-auto-reporter.web.app)

---

Built with ❤️ for smarter cities
├── pages/               # Page components
└── services/            # Google service integration points
    ├── firebase.js      # Firebase/Firestore
    ├── gemini.js        # Gemini AI
    ├── maps.js          # Google Maps
    └── vision.js        # Cloud Vision API
```

## 🔌 Google Integration Points

This frontend is designed to seamlessly integrate with Google Cloud services. Each service file in `src/services/` contains detailed comments explaining:

- How to initialize the service
- Which APIs to enable
- Example Cloud Function implementations
- Security best practices

### Services Ready for Integration

| Service | File | Purpose |
|---------|------|---------|
| Firebase | `firebase.js` | Auth, Firestore, Storage |
| Cloud Vision | `vision.js` | Image analysis & detection |
| Gemini AI | `gemini.js` | Description generation |
| Google Maps | `maps.js` | Geolocation & mapping |

## 🎨 Design System

### Colors
- **Neon Blue**: `#00D4FF` - Primary accent
- **Neon Purple**: `#A855F7` - Secondary accent
- **Neon Green**: `#22C55E` - Success states
- **Dark BG**: `#0A0A0F` - Background

### Components
- Glassmorphism cards with blur effects
- Smooth Framer Motion animations
- Responsive mobile-first design
- Accessible focus states

## 📱 Screens

1. **Landing Page** - Hero, features, how it works, CTA
2. **Report Issue** - 4-step wizard (Upload → Analysis → Location → Confirm)
3. **Dashboard** - Map view, list view, filters, real-time updates
4. **Issue Detail** - Full modal with timeline and AI insights

## 🔧 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons

## 🏆 Hackathon Notes

This project demonstrates:

- ✅ Production-ready UI/UX
- ✅ Clean, modular code structure
- ✅ Clear Google integration points
- ✅ Comprehensive mock data
- ✅ Responsive design
- ✅ Smooth animations

**"This could be live tomorrow once Google services are connected."**

## 📄 License

MIT License - Built for communities with Google Technologies

---

Made with ❤️ using Google Technologies
