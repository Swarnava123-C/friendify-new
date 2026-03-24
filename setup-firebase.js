#!/usr/bin/env node

console.log(`
🔥 Firebase Setup Helper for Friendify App

To fix the "auth/configuration-not-found" error, follow these steps:

1. CREATE FIREBASE PROJECT:
   - Go to: https://console.firebase.google.com
   - Click "Create a project" or "Add project"
   - Name it: friendmatch-app
   - Enable Google Analytics (optional)
   - Click "Create project"

2. ENABLE AUTHENTICATION:
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" and "Google"

3. CREATE FIRESTORE DATABASE:
   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode"
   - Select location and click "Done"

4. GET CONFIGURATION:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click Web app icon (</>)
   - Register app: "friendmatch-web"
   - Copy the config object

5. CREATE .env.local FILE:
   Create a file called .env.local in your project root with:

   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

6. RESTART YOUR APP:
   - Stop the dev server (Ctrl+C)
   - Run: npm run dev
   - Go to: http://localhost:3003

The app will work with demo data until you add real Firebase credentials.

For detailed instructions, see: FIREBASE_SETUP.md
`);

console.log("✅ Setup instructions displayed above!");
console.log("📁 Check FIREBASE_SETUP.md for detailed steps");
console.log("🚀 Your app is running at: http://localhost:3003");
