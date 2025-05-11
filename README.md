# Boxing Round Interval Timer

A web-based interval timer designed for boxing rounds. This project allows you to run a customizable timer for training sessions, with audio cues for round start, end, and warnings.

## Features
- Simple, responsive web interface
- Customizable round and rest durations
- Audio notifications for round start, halfway, end, and warnings
- Live reload development environment
- **[NEW] Round time can be set in minutes or seconds (min/sec toggle)**

## Project Structure
```
├── index.html         # Main HTML file
├── script.js          # Timer logic and UI interactions
├── styles.css         # App styling
├── audio/             # Folder for all mp3 audio cues
│   ├── round_start.mp3      # Sound for round start
│   ├── round_end.mp3        # Sound for round end
│   ├── warning_beep.mp3     # Sound for 10 seconds left
│   └── halfway_beep.mp3     # Sound for halfway point in round
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

### Setting Round Time in Minutes or Seconds
In the timer settings, you can now choose whether the round duration is specified in minutes or seconds using the dropdown next to the round time input. Select "min" for minutes or "sec" for seconds, then enter the desired value.

### Troubleshooting
- **404 errors for `/favicon.ico`**: If you see repeated 404 errors in the terminal, add a `favicon.ico` file to the project root to resolve them.
- **Vulnerabilities**: Run `npm audit` to check for known vulnerabilities. To attempt automatic fixes, use `npm audit fix`. Avoid using `--force` unless you understand the risks.
- **Conda errors**: If you see errors about missing `conda.exe`, these are related to your shell profile and do not affect this project.

### Adding a Favicon
To remove 404 errors for `/favicon.ico`, add a small icon file named `favicon.ico` to the project root.

## License
MIT (or specify your license here)

### Audio Files
All mp3 sound files should be placed in the `audio/` directory in the project root. The following files are used:

- `round_start.mp3` – played at the start of each round
- `halfway_beep.mp3` – played at the halfway point of each round
- `warning_beep.mp3` – played when 10 seconds remain in a round or rest
- `round_end.mp3` – played at the end of each round and at the end of the workout

If you want to use your own sounds, replace these files in the `audio/` folder with your preferred mp3s.
