from pydantic import BaseModel
from typing import Dict, List, Any

class AnalyzeRequest(BaseModel):
    blob_url: str

class AnalyzeResponse(BaseModel):
    has_tumor: bool
    confidence: float
    segmented_image_url: str
    summary: str
    findings: List[str]
    recommendations: str
    metadata: Dict[str, Any]