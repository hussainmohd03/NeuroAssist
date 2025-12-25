import io
import time
import numpy as np
from typing import Tuple
import tensorflow as tf
import torch
import torch.nn.functional as F
from PIL import Image
from app.services.segmentation_model import build_unetpp_model
import tensorflow as tf
import cv2
import re
from app.services.analysis_service import run_analysis
from app.services.LLM_text_generation import generate_clinical_report

tf_model = None

torch_model = None
torch_device = "cpu" 


def load_models(tf_model_path: str, torch_model_path: str, use_gpu: bool = False):
    global tf_model, torch_model, torch_device

    torch_device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"


    tf_model = tf.keras.models.load_model(tf_model_path)


    model = build_unetpp_model()

    state_dict = torch.load(torch_model_path, map_location=torch_device)
 
    model.load_state_dict(state_dict)

    model.to(torch_device)
    model.eval()

    torch_model = model

    print("[ML] Loaded TensorFlow model:", tf_model_path)
    print("[ML] Loaded UNet++ from:", torch_model_path)
    print("[ML] Using device:", torch_device)




def load_image_from_bytes(image_bytes: bytes) -> np.ndarray:

    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.array(pil_img)


def preprocess_for_classification(img: np.ndarray) -> np.ndarray:

    img = tf.image.resize(img, (224, 224))      
    img = img / 255.0                           
    img = tf.expand_dims(img, axis=0)         
    return img


def preprocess_for_segmentation(img: np.ndarray) -> torch.Tensor:

    img = torch.tensor(img, dtype=torch.float32).permute(2, 0, 1) / 255.0
    img = torch.nn.functional.interpolate(
        img.unsqueeze(0),
        size=(544, 544),
        mode="bilinear",
        align_corners=False
    )
    return img



def run_classification(img_tensor: np.ndarray) -> Tuple[bool, float]:

    preds = tf_model.predict(img_tensor)[0]
    confidence = float(preds[0])  
    has_tumor = confidence >= 0.5
    return has_tumor, confidence


def run_segmentation(img_tensor: torch.Tensor) -> np.ndarray:

    with torch.no_grad():
        img_tensor = img_tensor.to(torch_device)
        output = torch_model(img_tensor)  
        mask = torch.sigmoid(output)      
        mask = (mask > 0.5).float()       
        mask = mask.squeeze().cpu().numpy() * 255
        return mask.astype(np.uint8)


def overlay_mask_on_image(original: np.ndarray, mask: np.ndarray) -> bytes:


    H, W = original.shape[:2]

    mask_resized = cv2.resize(mask, (W, H), interpolation=cv2.INTER_NEAREST)

    mask_rgb = np.zeros_like(original)
    mask_rgb[..., 0] = mask_resized  #

    overlay = (0.6 * original + 0.4 * mask_rgb).astype(np.uint8)

    pil_img = Image.fromarray(overlay)
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG")
    return buffer.getvalue()





def run_full_pipeline(image_bytes: bytes) -> Tuple[bool, float, bytes, str, list, str, dict]:

    start_time = time.time()


    img = load_image_from_bytes(image_bytes)


    cls_tensor = preprocess_for_classification(img)
    has_tumor, confidence = run_classification(cls_tensor)


    segmented_bytes = b""
    mask = None

    if has_tumor:
        seg_tensor = preprocess_for_segmentation(img)
        mask = run_segmentation(seg_tensor)
        segmented_bytes = overlay_mask_on_image(img, mask)


    analysis_output = run_analysis(
        has_tumor=bool(has_tumor),
        confidence=float(confidence),
        mask=mask if mask is not None else np.zeros((1, 1))
    )

    llm_report = generate_clinical_report(
        has_tumor=bool(has_tumor),
        confidence=float(confidence),
        metadata=analysis_output["metadata"]
    )


    summary = llm_report["summary"]
    findings = llm_report["findings"]
    recommendation = llm_report["recommendations"]
    metadata = analysis_output["metadata"]


    metadata.update({
        "inference_time_ms": int((time.time() - start_time) * 1000),
        "device": torch_device,
        "model_version": "cls_v1.0_seg_v1.0_llm_v1.0"
    })


    return (
        has_tumor,
        confidence,
        segmented_bytes,
        summary,
        findings,
        recommendation,
        metadata
    )
from app.config import TF_MODEL_PATH, TORCH_MODEL_PATH, USE_GPU


def initialize_models():

    load_models(
        tf_model_path=TF_MODEL_PATH,
        torch_model_path=TORCH_MODEL_PATH,
        use_gpu=USE_GPU
    )
