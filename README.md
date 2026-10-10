# 🏏 CHASE MASTER: Cricket Odyssey

> **The Ultimate 3D Web & Mobile Cricket Simulation Game**  
> Master the art of the chase, execute signature cricket strokes, and conquer legendary tournament battles.

---

## 🌟 Overview

**CHASE MASTER** is a high-performance 3D cricket game built from the ground up using **React 19**, **Three.js**, and **Vite**. Featuring realistic ball physics, dynamic pitch conditions, responsive touch & keyboard controls, and multiple game modes—from realistic practice nets to deep career story missions.

---

## 🎮 Game Modes

- 🏆 **Tournament Mode**: Compete across high-stakes group stages, qualifiers, and finals for international glory.
- 📖 **Story Mode**: Step into pressure-cooker historical chases and master iconic career defining moments.
- ⚡ **Quick Match / Offline Play**: Pick your overs (2, 5, 10, 20), difficulty, and target to test your chasing nerve.
- 🎯 **Practice Nets**: Hone your batting timing against fast yorkers, outswingers, bouncers, and deceptive spin bowling.

---

## 🕹️ Controls Guide

### 🏏 Batting Controls

| Action | Keyboard / Mouse | Touch / Mobile |
| :--- | :--- | :--- |
| **Aim Shot Direction** | Arrow Keys / `A` & `D` / Mouse Drag | Virtual Joystick / Drag Wheel |
| **Shot Elevation** | `W` (Loft) / `S` (Ground) | Loft / Ground Toggle Buttons |
| **Stroke Type** | Spacebar (Standard) / `Shift` (Power Hit) | **HIT** Action Button |
| **Footwork / Stance** | `Q` (Frontfoot) / `E` (Backfoot) | Stance Selector |

### 🎯 Timing is Everything!
- Watch the bowling release marker and the pitch bounce indicator.
- Trigger your stroke when the timing meter hits the **GREEN Sweet Spot** for maximum power, gap placement, and boundary clears!

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jyotvaghasia156-rgb/cricket.git
   cd cricket
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📱 Android App Build

The repository includes a ready-to-build Android wrapper located in `/android-app`:

1. Build the web assets and sync to Android:
   ```bash
   npm run prepare:android
   ```
2. Open `android-app/` in **Android Studio**.
3. Run on your physical Android device or build a signed APK.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 19, JavaScript (ESM)
- **3D Graphics & Physics**: Three.js (WebGL rendering, custom collision & trajectory solver)
- **Styling**: Vanilla CSS, Glassmorphic UI overlays
- **Icons & FX**: Lucide React, Canvas Confetti
- **Audio**: Web Audio API (Synthesized sound effects & ambient stadium roar)
- **Build Tool**: Vite 6

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).