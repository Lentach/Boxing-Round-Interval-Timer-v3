# Boxing Round Interval Timer

A web-based interval timer designed for boxing rounds. This project allows you to run a customizable timer for training sessions, with audio cues for round start, end, and warnings.

## Features
- Simple, responsive web interface
- Customizable round and rest durations
- Audio notifications for round start, end, and warnings
- Live reload development environment

## Project Structure
```
├── index.html         # Main HTML file
├── script.js          # Timer logic and UI interactions
├── styles.css         # App styling
├── *.mp3              # Audio cues for rounds
├── gloves.png         # App icon/graphic
├── package.json       # Project metadata and scripts
├── package-lock.json  # Dependency lock file
└── README.md          # This file
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- npm (comes with Node.js)

### Installation
1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Install dependencies:
   ```sh
   npm install
   ```

### Running the App in Development
Start a local development server with live reload:
```sh
npm run dev
```
- The app will open automatically in your browser.
- If port 3000 is in use, a different port will be chosen automatically.

### Troubleshooting
- **404 errors for `/favicon.ico`**: If you see repeated 404 errors in the terminal, add a `favicon.ico` file to the project root to resolve them.
- **Vulnerabilities**: Run `npm audit` to check for known vulnerabilities. To attempt automatic fixes, use `npm audit fix`. Avoid using `--force` unless you understand the risks.
- **Conda errors**: If you see errors about missing `conda.exe`, these are related to your shell profile and do not affect this project.

### Adding a Favicon
To remove 404 errors for `/favicon.ico`, add a small icon file named `favicon.ico` to the project root.

## Lessons Learned
- Always include both `package.json` and `package-lock.json` for npm projects.
- Document all issues and solutions in a scratchpad or similar file for future reference.

## License
MIT (or specify your license here) 