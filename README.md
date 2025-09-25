# Tree Lives Matter - Local Development

This project has a Flask backend and a React (Create React App) frontend.

## Prerequisites Installation (First Time Setup)

If you don't have Python and Node.js installed, use the automated installer:

```powershell
# Right-click and "Run as administrator"
./install.bat
```

This script will automatically install:

- Python 3.11+ (for Flask backend)
- Node.js LTS + npm (for React frontend)

## Quick start (Windows)

After prerequisites are installed, use the batch script at the repo root:

```powershell
# From the project root
./start.bat
```

What it does:

- Creates Python virtual environment in `backend/.venv` if missing
- Installs backend Python dependencies from `backend/requirements.txt`
- Installs frontend npm packages in `frontend/` if `node_modules` is missing
- Starts backend on http://localhost:5000 and frontend on http://localhost:3000
- Opens browser tabs to the API test endpoint and the app

If you prefer manual steps, see `frontend/README.md` for commands.

## Troubleshooting

**Missing Prerequisites:**

- Run `install.bat` as administrator to auto-install Python and Node.js
- Manual install: Node.js LTS from https://nodejs.org/ and Python 3.x from https://www.python.org/downloads/

**Runtime Issues:**

- Port conflicts: backend uses 5000, frontend uses 3000. Close other apps occupying these ports or change the ports if needed.
- API test: http://localhost:5000/api/test should return JSON `{ message: "Backend connected successfully!", ... }`
