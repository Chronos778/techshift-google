# Pre-Deployment Checklist

## ✅ Already Completed
- [x] Google Maps API key configured
- [x] Firebase API key set
- [x] Environment variables structure created
- [x] Dependencies installed
- [x] Development server running

## ⚠️ Before You Deploy - Action Items

### 1. Complete Firebase Configuration (REQUIRED)
- [ ] Get Firebase config from [Firebase Console](https://console.firebase.google.com/)
- [ ] Update `.env` with:
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

### 2. Enable Google Maps APIs (REQUIRED)
Go to [Google Cloud Console](https://console.cloud.google.com/apis/library):
- [ ] Maps JavaScript API
- [ ] Geocoding API
- [ ] Places API

### 3. Test Locally (RECOMMENDED)
- [ ] Map loads on dashboard
- [ ] Can create a new issue report
- [ ] Location detection works
- [ ] Images upload successfully
- [ ] No console errors

### 4. Build Test (RECOMMENDED)
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Check `dist` folder is created

### 5. Choose Hosting Platform
Pick one:
- [ ] **Vercel** (Easiest, recommended)
- [ ] **Netlify** (Also easy)
- [ ] **Firebase Hosting** (Keeps everything in Firebase)

See [deployment_guide.md](file:///C:/Users/Maithil/.gemini/antigravity/brain/c1d3d931-4bed-4e15-a118-1bae5821d19d/deployment_guide.md) for detailed steps.

### 6. Security Setup (IMPORTANT)
- [ ] Restrict Google Maps API key to your domain
- [ ] Deploy Firestore security rules
- [ ] Review Firebase Storage rules

## 🚀 Quick Deploy Commands

### For Vercel:
```bash
npm install -g vercel
npm run build
vercel
```

### For Netlify:
```bash
npm install -g netlify-cli
npm run build
netlify deploy
```

### For Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

## 📝 Notes
- Remember to add ALL environment variables to your hosting platform
- Restart dev server after changing `.env` locally
- Your site will be live at a free subdomain (e.g., `your-app.vercel.app`)
