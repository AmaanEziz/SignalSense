import os
import torch

img_size = 640  # size of the image
batch_size = -1  # -1 for auto batch size
epochs = 80  # Epochs for training, 300 is default
yaml_file_path = './dataset.yaml'  # path to dataset.yaml
weights_path = './yolov5/yolov5s.pt'  # yolov5s.pt or yolov5m.pt, v5s is faster
device = 0
optimizer = 'SGD'  # SGD is default, Adam and AdamW are other options

os.system('python ./yolov5/train.py '
          '--img-size {img_size} '
          '--batch {batch_size} '
          '--epochs {epochs} '
          '--data {yaml_file_path} '
          '--weights {weights_path} '
          '--device {device} '
          '--optimizer {optimizer} '
          .format(
            img_size=img_size,
            batch_size=batch_size,
            epochs=epochs,
            yaml_file_path=yaml_file_path,
            weights_path=weights_path,
            device=device,
            optimizer=optimizer,
            ))
