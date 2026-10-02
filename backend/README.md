# VisionGuard Vision Backend

FastAPI + YOLO11 backend used by the VisionGuard React dashboard.

## Start

From the `backend` folder:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The first run downloads `yolo11n.pt` from Ultralytics if it is not already present.

Health check: `http://127.0.0.1:8000/api/health`
API docs: `http://127.0.0.1:8000/docs`
