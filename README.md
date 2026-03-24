# Friendify - Friends Matching App

A modern friends matching application built with Next.js, Firebase, and Clerk authentication.

## 🚀 Features

- **User Profiles**: Create and manage your profile with interests, photos, and preferences
- **Discover**: Browse potential friends and like/pass on profiles
- **Matching**: Get matched when both users like each other
- **Chat**: Message your matches in real-time
- **Authentication**: Secure login with Clerk

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Firebase Storage
- **Authentication**: Clerk
- **Styling**: Tailwind CSS with custom gradients and animations

## 📁 Project Structure

```
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat functionality
│   ├── discover/          # Profile discovery
│   └── profile/           # User profile management
├── components/            # Reusable React components
├── lib/                    # Utility functions and Firebase config
│   ├── firebase.ts        # Firebase initialization
│   ├── firestore.ts       # Firestore database operations
│   └── utils.ts           # General utilities
└── public/                # Static assets
```

## 🔧 Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment variables**:

   - Set up your Firebase project
   - Configure Clerk authentication
   - Add environment variables to `.env.local`

3. **Firebase setup**:

   ```bash
   # Deploy Firestore rules
   npm run firebase:deploy-rules
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🎯 Key Features

### Profile Management

- Create detailed profiles with interests, photos, and preferences
- Update profile information
- Set profile visibility and activity status

### Discovery System

- Browse potential friends based on interests and preferences
- Like or pass on profiles
- Get matched when both users like each other

### Real-time Chat

- Message your matches instantly
- See online status and message timestamps
- Conversation starters for new matches

### Authentication

- Secure login with Clerk
- Protected routes and user sessions
- Profile-based access control

## 🚀 Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**:

   - Vercel (recommended for Next.js)
   - Netlify
   - Firebase Hosting

3. **Configure production environment**:
   - Set up production Firebase project
   - Configure Clerk production keys
   - Deploy Firestore security rules

## 📱 Usage

1. **Sign up/Login**: Create an account with Clerk
2. **Create Profile**: Fill out your profile with interests and photos
3. **Discover**: Browse potential friends and like/pass
4. **Match**: Get matched when both users like each other
5. **Chat**: Start conversations with your matches

## 🔒 Security

- Firestore security rules protect user data
- Clerk handles authentication and user management
- Client-side validation with TypeScript
- Secure API routes and database operations

## 🎨 Design

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive user interface
- Beautiful card-based layouts

## 📊 Database Schema

### Users Collection

```typescript
interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  photos: string[];
  personality: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Matches Collection

```typescript
interface Match {
  id: string;
  users: string[];
  createdAt: Date;
  isActive: boolean;
}
```

### Messages Collection

```typescript
interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}
```

## 🛠️ Development

- **Linting**: `npm run lint`
- **Type checking**: Built-in TypeScript support
- **Hot reload**: Development server with Turbopack

## 📄 License

This project is licensed under the MIT License.
