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

---

## 🛠️ Installation Instructions

There are two ways to use this application: installing the pre-built APK directly onto your phone, or running it from the source code locally.

### Option 1: Install Direct APK (Quickest)

You can download the production-ready Android APK directly from this repository:

1. Click on the `SmartNotesApp.apk` file in the root of this GitHub repository.
2. Click the **Download raw file** button (or the download icon).
3. Transfer the file to your Android phone (or download it directly from your phone's browser).
4. Tap the downloaded file to install it (you may need to allow "Install from Unknown Sources" in your phone's settings).

### Option 2: Run from Source Code

To run this project locally on your own machine for development or testing:

**1. Prerequisites**
- Node.js (v18+)
- Android Studio (for emulator) or Expo Go (on your physical device)

**2. Install Dependencies**
Clone this repository and run:
```bash
npm install
```

**3. Setup Firebase Backend**
You will need your own Firebase project to run the backend.
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database** (Start in test mode or configure security rules)
4. Update the `src/firebaseConfig.js` file with your specific project's credentials.

**4. Start the Application**
```bash
npx expo start
```
- Press `a` in your terminal to open it on a connected Android emulator.
- Or scan the QR code using the **Expo Go** app on your physical smartphone.

---

## 💻 Tech Stack
- **Framework**: React Native (Expo SDK 51)
- **Routing**: Expo Router (File-based navigation)
- **Backend**: Firebase (Auth & Firestore)
- **Styling & Animations**: Vanilla React Native StyleSheet + Reanimated 3
- **Icons**: Lucide React Native

*Developed for Android and iOS.*
