import torch
import segmentation_models_pytorch as smp


def build_unetpp_model():

    model = smp.UnetPlusPlus(
        encoder_name="efficientnet-b5",     
        encoder_weights=None,               
        in_channels=3,
        classes=1                       
    )
    return model
