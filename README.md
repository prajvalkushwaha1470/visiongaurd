# VisionGuard — Construction Site Safety Intelligence

A hackathon-ready computer-vision dashboard for construction-site safety monitoring.

## What works in this build

- Premium dark command-center dashboard
- Overview, Cameras, Alerts, Events, Analytics, Site Map, Safety Agent and Settings pages
- Browser webcam access
- FastAPI vision backend
- YOLO11 person/vehicle detection
- Live bounding boxes and confidence labels
- Visibility-quality heuristic
- Backend health/device status
- Camera selection and live-view navigation
- Responsive layout
- CPU fallback; CUDA is used automatically when available

> The PPE, restricted-zone, tracking and multi-camera handoff concepts are represented in the product UI/data model, but this build's actual ML detector is the general YOLO11 model. PPE-specific detection requires a PPE-trained model.

## Folder structure

```text
visionguard/
├── src/
├── public/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── package.json
├── index.html
├── start.ps1
└── README.md
```

## Option A — automatic start on Windows

From the project root in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start.ps1
```

The script opens a backend terminal and starts the Vite frontend in the current terminal.

## Option B — manual start

### Backend terminal

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

First run downloads `yolo11n.pt` automatically if it is not already present.

Backend checks:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/api/health`
- `http://127.0.0.1:8000/docs`

### Frontend terminal

From the project root:

```powershell
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## Live camera test

1. Start the backend.
2. Start the frontend.
3. Open **Cameras**.
4. Select a camera and click **Open live view**.
5. On Overview click **Use webcam**.
6. Allow browser camera permission.
7. The video feed should show YOLO boxes and confidence labels.

## If the camera is not available

Use Chrome/Edge on `localhost` and allow camera access. The browser camera is accessed directly by the frontend; the backend never needs direct access to the laptop camera.

## Architecture

```text
Browser webcam
      │ JPEG frames
      ▼
React + Vite
      │ POST /api/detect
      ▼
FastAPI
      │
      ▼
YOLO11
      │
      ├── detections
      ├── confidence
      └── visibility score
      ▼
Live VisionGuard dashboard
```

## Next ML upgrades

1. PPE-trained detector: helmet/vest/shoes
2. Person tracking with persistent IDs
3. Polygon restricted-zone rules
4. Event persistence/debounce
5. Camera degradation and blind-spot analysis
6. Multi-camera handoff
7. Evidence snapshots and event database
