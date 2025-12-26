# 🏙️ Smart City Issue Auto-Reporter

> AI-powered city issue reporting using Google technologies

![Smart City Reporter](https://img.shields.io/badge/Status-Hackathon_Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan)

## 🎯 Overview

Smart City Reporter is a futuristic, production-ready frontend that enables citizens to report city infrastructure issues in seconds using AI-powered analysis. Simply snap a photo, and our system will:

1. **Analyze the image** using Google Cloud Vision API
2. **Generate a description** using Google Gemini AI
3. **Detect the location** using Google Maps
4. **Submit the report** to city authorities

## ✨ Features

- 📸 **Drag & Drop Image Upload** - Easy photo capture and upload
- 🤖 **AI-Powered Analysis** - Automatic issue detection and description
- 🗺️ **Location Detection** - GPS-based precise location pinning
- 📊 **Real-time Dashboard** - Track all city issues on an interactive map
- 🎨 **Futuristic UI** - Dark theme with neon accents and glassmorphism

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard components
│   ├── landing/         # Landing page sections
│   ├── layout/          # Layout components (Navbar)
│   ├── report/          # Report wizard steps
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── mock/                # Mock data for demo
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

MIT License - Built for Hackathon 2024

---

Made with ❤️ using Google Technologies
