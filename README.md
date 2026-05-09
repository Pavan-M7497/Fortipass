# FortiPass

FortiPass is a modern React + Vite password strength checker and secure password manager built with Firebase Authentication and Firestore.

## Features
- Firebase email/password authentication
- Encrypted password vault stored in Firestore
- Real-time strength meter and crack-time estimation
- Password generator with length and symbol toggles
- Responsive dashboard with analytics cards
- Dark glassmorphism UI with animated elements
- Secure Firestore rules and environment-based config

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and add your Firebase values.
3. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase configuration
Create a Firebase project and enable:
- Authentication → Email/Password
- Firestore Database
- Hosting (optional)

## Deployment
Build the app with:
```bash
npm run build
```

Then deploy to Firebase Hosting from the project root once Firebase CLI is configured.
