import numpy as np
from typing import List, Dict


def analyze_segmentation_mask(mask: np.ndarray) -> Dict[str, any]:

    tumor_pixels = int(mask.sum())

    if tumor_pixels == 0:
        return {
            "tumor_pixels": 0,
            "tumor_percentage": 0.0,
            "bounding_box": None,
            "centroid": None
        }

    h, w = mask.shape
    total_pixels = h * w
    tumor_percentage = float(tumor_pixels / total_pixels)

    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]
    bbox = [int(xmin), int(ymin), int(xmax), int(ymax)]

    ys, xs = np.where(mask > 0)
    centroid = [float(xs.mean()), float(ys.mean())]

    return {
        "tumor_pixels": tumor_pixels,
        "tumor_percentage": tumor_percentage,
        "bounding_box": bbox,
        "centroid": centroid
    }


def generate_summary(has_tumor: bool, confidence: float) -> str:
    if not has_tumor:
        return (
            "No tumor detected in the provided MRI scan. "
            f"The model is {confidence*100:.1f}% confident in this assessment."
        )
    return (
        "A tumor region was detected in the MRI scan. "
        f"The model's confidence is {confidence*100:.1f}%. "
        "Further review of the segmented region is recommended."
    )


def generate_findings(has_tumor: bool, meta: Dict[str, any]) -> List[str]:
    if not has_tumor:
        return ["No abnormal mass or tumor-like structure was identified."]

    findings = ["Tumor-like region detected in the scan."]

    if meta["bounding_box"]:
        x1, y1, x2, y2 = meta["bounding_box"]
        findings.append(f"Location approximately at coordinates: ({x1},{y1}) to ({x2},{y2}).")

    pct = meta["tumor_percentage"] * 100
    findings.append(f"Tumor covers approximately {pct:.2f}% of the scanned area.")

    return findings


def generate_recommendations(has_tumor: bool, meta: Dict[str, any]) -> str:
    if not has_tumor:
        return (
            "Routine clinical follow-up is recommended if symptoms persist. "
            "No immediate concern detected from the MRI scan."
        )

    pct = meta["tumor_percentage"] * 100

    if pct < 1:
        return (
            "A small tumor region was detected. "
            "Recommend further imaging (contrast-enhanced MRI) to confirm "
            "and clinical evaluation by a radiologist."
        )

    if pct < 5:
        return (
            "A moderate tumor region was detected. "
            "Recommend referral to a specialist for additional diagnostic workup."
        )

    return (
        "A large tumor region was detected. Immediate evaluation by a clinical specialist "
        "is strongly recommended."
    )

def classify_tumor_size(tumor_percentage: float) -> str:
    if tumor_percentage < 0.01:
        return "very small"
    if tumor_percentage < 0.03:
        return "small"
    if tumor_percentage < 0.07:
        return "moderate"
    return "large"

def run_analysis(has_tumor: bool, confidence: float, mask: np.ndarray) -> Dict[str, any]:
    mask_bin = (mask > 0.5).astype(np.uint8)

    meta = analyze_segmentation_mask(mask_bin)

    size_category = classify_tumor_size(meta["tumor_percentage"])

    meta["size_category"] = size_category
    
    return {
        "summary": generate_summary(has_tumor, confidence),
        "findings": generate_findings(has_tumor, meta),
        "recommendations": generate_recommendations(has_tumor, meta),
        "metadata": meta
    }
