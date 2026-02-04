# 🚗 Carpil - Installation Guide

Quick setup guide for the Carpil React Native project.

## 📋 Prerequisites

- **Node.js** v22 ([Download](https://nodejs.org/))
- **Yarn** package manager
- **Xcode** (macOS only) - Latest version with Command Line Tools
- **Android Studio** - Android SDK 35, Build-Tools 35.0.0

---

## 🚀 Quick Start

### 1️⃣ Clone & Setup

```bash
git clone <repository-url>
cd app
```

### 2️⃣ Environment Variables

Create `.env.local` with `NPM_TOKEN_GOOGLE_SIGN_IN` (see template file for reference).

**macOS/Linux:**
```bash
export NPM_TOKEN_GOOGLE_SIGN_IN=your_token_here
```

**Windows (PowerShell):**
```powershell
$env:NPM_TOKEN_GOOGLE_SIGN_IN="your_token_here"
```

**Windows (CMD):**
```cmd
set NPM_TOKEN_GOOGLE_SIGN_IN=your_token_here
```

### 3️⃣ Install Dependencies

```bash
yarn cache clean
yarn install
```

### 4️⃣ Environment Configuration

Add Firebase config files to project root:
- `GoogleService-Info.plist` (iOS)
- `google-services.json` (Android)

Configure other environment variables in `.env.local` (see template file).

### 5️⃣ Generate Native Folders

```bash
npx expo prebuild
```

This generates the `ios` and `android` folders.

---

## 📱 Platform Setup

### 🍎 iOS

```bash
yarn ios
```

### 🤖 Android

```bash
yarn android
```

