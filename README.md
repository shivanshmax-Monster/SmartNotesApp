# SmartNotesApp 📝

A beautiful, modern, and highly responsive Notes application built with **React Native**, **Expo**, and **Firebase**. 

SmartNotesApp allows users to securely register, log in, and manage their personal notes with a clean, animated user interface and real-time cloud synchronization.

## ✨ Features

- **Secure Authentication**: Email and password authentication powered by Firebase Auth.
- **Real-Time Database**: Notes are instantly saved, updated, and retrieved from Firebase Firestore.
- **Modern UI/UX**: Clean, minimalist design featuring fluid animations using `react-native-reanimated`.
- **Custom Animated Icons**: Interactive SVG icons that respond to user actions.
- **Cross-Platform**: Built to run flawlessly on both Android and iOS.
- **Offline Capable**: Firebase SDK handles local caching when the network is unstable.

## 📥 Download the App (APK)

You can download the production-ready Android APK directly from our verified Expo Cloud Build servers:

👉 **[Download SmartNotesApp.apk Here](https://expo.dev/accounts/shivaboi/projects/SmartNotesApp/builds/c7261671-6795-4e2c-b0fc-23f75b51594e)** 👈

*(Click the link above, and press the **Download** button on the Expo dashboard page).*

## 🚀 Local Development

To run this project locally on your own machine:

### 1. Prerequisites
- Node.js (v18+)
- Android Studio (for emulator) or Expo Go (on your physical device)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase
You will need your own Firebase project to run the backend.
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database** (Start in test mode or configure security rules)
4. Update the `src/firebaseConfig.js` file with your project's credentials.

### 4. Start the App
```bash
npx expo start
```
- Press `a` to open on an Android emulator.
- Or scan the QR code using the Expo Go app on your phone.

## 🛠️ Tech Stack
- **Framework**: React Native (Expo SDK 51)
- **Routing**: Expo Router (File-based navigation)
- **Backend**: Firebase (Auth & Firestore)
- **Styling & Animations**: Vanilla React Native StyleSheet + Reanimated 3
- **Icons**: Lucide React Native

---
*Developed for Android and iOS.*
