from http.client import HTTPException
from fastapi import FastAPI
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.storage_service import download_blob, upload_segmented_image
from app.services.inference_service import (run_full_pipeline, initialize_models)

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


@app.on_event("startup")
async def startup_event():

    initialize_models()


@app.get("/health")     
async def health_check():
    return {
        "status": "ok",
        "service": "brain-tumor-ml",
    }

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    blob_url = payload.blob_url

    try:
        image_bytes = download_blob(blob_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download MRI image: {e}")

    (
        has_tumor,
        confidence,
        segmented_bytes,
        summary,
        findings,
        recommendation,
        metadata
    ) = run_full_pipeline(image_bytes)

    segmented_url = None

    if segmented_bytes:
        try:
            segmented_url = upload_segmented_image(
                segmented_bytes,
                blob_url
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Segmentation upload failed: {e}")

    response = AnalyzeResponse(
        has_tumor=has_tumor,
        confidence=confidence,
        segmented_image_url=segmented_url,
        summary=summary,
        findings=findings,
        recommendations=recommendation,
        metadata=metadata
    )

    return response

