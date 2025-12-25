import os

TF_MODEL_PATH = os.environ.get("TF_MODEL_PATH", "models/brain_tumor_final.h5")

TORCH_MODEL_PATH = os.environ.get("TORCH_MODEL_PATH", "models/best_unetpp_efficientb5_576.pth")

USE_GPU = os.environ.get("USE_GPU", "false").lower() == "true"