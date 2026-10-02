from __future__ import annotations

import time
from pathlib import Path

import cv2
import numpy as np
import torch
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "yolo11n.pt"

app = FastAPI(title="VisionGuard Vision API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"
model = YOLO(str(MODEL_PATH) if MODEL_PATH.exists() else "yolo11n.pt")
if DEVICE.startswith("cuda"):
    try:
        model.to(DEVICE)
    except Exception:
        DEVICE = "cpu"

ALLOWED_LABELS = {
    "person",
    "car",
    "truck",
    "bus",
    "motorcycle",
    "bicycle",
    "forklift",
}


def visibility_score(frame: np.ndarray) -> int:
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    brightness = float(gray.mean())
    contrast = float(gray.std())

    # This is a simple visual-quality heuristic, not a safety certification.
    sharp_score = min(45.0, sharpness / 18.0)
    brightness_score = max(0.0, 30.0 - abs(brightness - 125.0) * 0.30)
    contrast_score = min(25.0, contrast * 0.70)
    return int(max(20, min(100, round(sharp_score + brightness_score + contrast_score))))


@app.get("/")
def root():
    return {"service": "VisionGuard Vision API", "ok": True, "docs": "/docs"}


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "vision",
        "model": "yolo11n",
        "device": DEVICE,
        "cuda_available": bool(torch.cuda.is_available()),
    }


@app.post("/api/detect")
async def detect(request: Request):
    global DEVICE
    started = time.perf_counter()
    raw = await request.body()
    if not raw:
        return {"detections": [], "visibility": 0, "error": "empty frame"}

    frame = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if frame is None:
        return {"detections": [], "visibility": 0, "error": "invalid jpeg"}

    try:
        result = model.predict(frame, verbose=False, conf=0.35, imgsz=640, device=DEVICE)[0]
    except Exception:
        # If a GPU runtime is unavailable after startup, retry once on CPU.
        if DEVICE != "cpu":
            DEVICE = "cpu"
            result = model.predict(frame, verbose=False, conf=0.35, imgsz=640, device="cpu")[0]
        else:
            raise

    names = result.names
    detections = []
    counts: dict[str, int] = {}

    if result.boxes is not None:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            confidence = float(box.conf[0])
            label = str(names[cls_id])
            if label not in ALLOWED_LABELS:
                continue
            x1, y1, x2, y2 = [round(float(v), 1) for v in box.xyxy[0]]
            detections.append(
                {
                    "label": label,
                    "confidence": round(confidence, 4),
                    "box": [x1, y1, x2, y2],
                }
            )
            counts[label] = counts.get(label, 0) + 1

    elapsed = (time.perf_counter() - started) * 1000
    return {
        "detections": detections,
        "counts": counts,
        "visibility": visibility_score(frame),
        "frame_width": int(frame.shape[1]),
        "frame_height": int(frame.shape[0]),
        "inference_ms": round(elapsed, 1),
        "device": DEVICE,
    }
