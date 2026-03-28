# ET-Hackathon Automated Deployment Script (For Local Development)
# Usage: .\scripts\deploy.ps1

function Write-Step ($message) {
    Write-Host "`n>>> $message" -ForegroundColor Cyan
}

function Error-And-Exit ($message) {
    Write-Host "`n!!! ERROR: $message" -ForegroundColor Red
    exit 1
}

# 1. Environment Checks
Write-Step "Checking environment..."
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) { Error-And-Exit "npm not found. Install Node.js." }
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) { Error-And-Exit "python not found. Install Python 3.9+." }

# 2. Frontend Setup
Write-Step "Setting up Frontend..."
cd frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}
# Build for production (optional check)
# npm run build
cd ..

# 3. Backend Setup
Write-Step "Setting up Backend..."
cd backend
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# Activate Venv and install
.\venv\Scripts\Activate.ps1
Write-Host "Installing backend dependencies..."
pip install -r requirements.txt
cd ..

# 4. Starting Servers
Write-Step "Launching Application..."
Write-Host "Note: Both frontend and backend will start in separate terminals."

# Backend
Start-Process powershell -ArgumentList "-NoExit -Command 'cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000'"
Write-Host "Backend starting on http://localhost:8000"

# Frontend
Start-Process powershell -ArgumentList "-NoExit -Command 'cd frontend; npm run dev'"
Write-Host "Frontend starting on http://localhost:5173"

Write-Step "SUCCESS! Squirrel News is launching."
Write-Host "Check the new terminals for server logs."
