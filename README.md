# Automobilista 2 Career Mode (ATM2)

A desktop companion application for **Automobilista 2 (AMS2)** that provides an immersive career mode experience. Track your progress, manage your profile, and work your way up through the classes to become a racing legend.

## 🏁 Features

- **Progressive Career System**: Start in Class D (Initiation) and unlock higher classes (C, B, A, and S) by achieving podiums.
- **Race Tracker**: Log your classification and final positions for every race.
- **Detailed History**: View your racing history with details about circuits, cars used, and results.
- **Race Setups**: Get recommended race parameters including weather, practice time, and session durations for a balanced difficulty curve.
- **Two Game Modes**:
  - **Career (Carrera)**: Progress locked behind performance goals.
  - **Free (Libre)**: All classes and categories unlocked from the start.
- **Profile Management**: Customize your name, last name, and country.
- **DLC Management**: Toggle which DLCs you have to filter available content.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Recommended: Latest LTS)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Franco-Navarro/atm2-carrer-mode.git
   ```
2. Navigate to the project directory:
   ```bash
   cd atm2-carrer-mode
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the app in development mode:
```bash
npm run dev
```

### Building for Distribution

To package the application for Windows or macOS:
```bash
npm run app:dist
```

## 🛠️ Built With

- **[Electron](https://www.electronjs.org/)**: Framework for building cross-platform desktop apps.
- **HTML5 & CSS3**: For structure and modern UI design.
- **Vanilla JavaScript**: Core application logic.
- **[Electron-Store](https://github.com/sindresorhus/electron-store)**: For local data persistence.

## 📁 Project Structure

- `assets/`: Image assets for cars, tracks, flags, and UI components.
- `components/`: Modular UI components for cards and alerts.
- `data/`: JSON files containing game data (classes, categories, races, setups).
- `styles/`: CSS stylesheets for different application screens.
- `main.js`: Main process Electron script.
- `renderer.js`: Renderer process handling UI and app logic.

## 📝 License

This project is licensed under the ISC License - see the `package.json` file for details.

---
*Created by [Franco Navarro](https://github.com/Franco-Navarro)*
