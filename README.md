# Cloth Recommendation (Mobile Wardrobe)

This repository contains a minimal placeholder project for a "Mobile Wardrobe" experience. It includes:

- a Python FastAPI backend (lightweight placeholder API)
- a frontend wrapper that launches the Expo web preview
- a full Expo-based React Native app in `mobile_wardrobe`

This README explains the project structure and how to run the backend, web preview, and mobile app for local development.

## Project structure

- `backend/` — FastAPI server
	- `server.py` — FastAPI app
	- `requirements.txt` — Python dependencies
- `frontend/` — convenience package that runs the Expo web preview
	- `package.json` — script `start` that delegates to `mobile_wardrobe`
- `mobile_wardrobe/` — Expo React Native app
	- `package.json` — app dependencies and scripts
	- `app/`, `assets/`, `components/`, etc. — Expo app source

## Prerequisites

- Python 3.8+ (recommended Python 3.10+)
- Node.js (16+ recommended) and `npm` or `pnpm`/`yarn`
- For mobile testing: Expo Go app on your phone or Android/iOS emulator

Make sure these tools are installed and in your PATH. On Debian/Ubuntu you can install them with:

```bash
# example (adjust to your platform)
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nodejs npm
```

## Backend — FastAPI

This is a minimal API used by the app for health checks and future endpoints.

1. Create and activate a virtual environment:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server (development):

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

4. Verify the server is running:

- Open http://localhost:8000/ -> should return a JSON greeting
- Health check: http://localhost:8000/api/health

Notes:
- Use the virtual environment for all backend work. Deactivate with `deactivate`.
- To deploy, consider a production ASGI server (Gunicorn + Uvicorn workers) and environment configuration.

## Frontend web preview (Expo web)

The `frontend` folder contains a convenience `start` script which runs the Expo web preview by delegating into the `mobile_wardrobe` package.

From the repo root you can run:

```bash
cd frontend
npm install
npm run start
```

This runs `npx expo start --web` and serves the web preview on port `3000` (see script). Alternatively run directly in the `mobile_wardrobe` folder:

```bash
cd mobile_wardrobe
npm install
npx expo start --web --port 3000
```

Open http://localhost:3000 in your browser to view the web preview.

## Mobile app (Expo)

Run and test the React Native app using Expo:

```bash
cd mobile_wardrobe
npm install
npx expo start
```

- Press `a` to open in an Android emulator (if configured)
- Press `i` to open in an iOS simulator (macOS + Xcode)
- Scan the QR code with Expo Go on your device to open the app

If you prefer `yarn` or `pnpm`, use those instead of `npm`.

## Environment & API configuration

At the moment the app points to a local backend by default (when running locally). If you need to configure API base URLs, search the codebase for the API client or any `fetch`/`axios` calls and update the host/port accordingly.

## Troubleshooting

- If ports are in use, change the `--port` argument when starting servers.
- If `npx expo` fails, make sure Node/npm versions match Expo's supported versions (see Expo docs), or install the `expo-cli` globally: `npm i -g expo-cli`.
- For Python dependency issues, ensure your virtual environment is activated before installing.

## Contributing

1. Create a branch per feature/bugfix
2. Run existing linting/tests (none included yet)
3. Open a PR describing the change

## Contact

If you need me to run the backend or start the Expo server here, tell me which one and I will start it.

---

Files of interest:

- `backend/server.py` — backend entrypoint
- `frontend/package.json` — convenience script that runs Expo web
- `mobile_wardrobe/package.json` — app dependencies and scripts

