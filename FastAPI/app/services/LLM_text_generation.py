import google.generativeai as genai
import os
from typing import Dict, List


genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))


def generate_clinical_report(
    has_tumor: bool,
    confidence: float,
    metadata: Dict[str, any],
) -> Dict[str, any]:

    metadata["tumor_percentage"] = metadata.get("tumor_pixels", 0) / (metadata.get("img_width", 1) * metadata.get("img_height", 1))

    prompt = f"""
    You are generating a radiology-style MRI analysis note.

STRICT RULES:
- DO NOT diagnose.
- DO NOT give medical advice.
- NEVER mention pixel counts or bounding boxes.
- NEVER mention percentages.
- Use ONLY the interpreted metadata provided.

Clinical Input From AI Model:
- Tumor detected: {has_tumor}
- Model confidence: {confidence*100:.1f}%
- Estimated tumor size category: {metadata.get("size_category")}

Generate the following:
1. A concise 2–3 sentence clinical-style summary.
2. 3–5 bullet-point findings (high-level, radiologist-friendly).
3. Safe, non-diagnostic recommendations for next clinical steps.

Use cautious professional radiology language.
Do NOT mention that this is an automated model unless necessary.

VERY IMPORTANT RULES:\n
 - DO NOT invent numbers.\n
 - ONLY use numerical values exactly as provided.\n
 - If a value looks abnormal or inconsistent, simply state that it requires expert review.\n

 Return JSON with this EXACT schema:

{{
  "summary": "string (2–3 sentence clinical-style overview)",
  "findings": ["bullet point", "bullet point"],
  "recommendations": "string (general next steps, non-diagnostic)"
}}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    import json

    try:
        data = json.loads(response.text)
    except Exception:
        cleaned = response.text.strip().strip("```json").strip("```")
        data = json.loads(cleaned)
    
    return data
