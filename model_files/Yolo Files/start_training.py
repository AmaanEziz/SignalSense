import os

img_size = 640  # size of the image
batch_size = -1  # -1 for auto batch size
epochs = 50  # Epochs for training, 300 is default
yaml_file_path = './dataset.yaml'  # path to dataset.yaml
weights_path = './yolov5/yolov5s.pt'  # yolov5s.pt or yolov5m.pt, v5s is faster
device = 0
os.system('python ./yolov5/train.py '
          '--img {img_size} '
          '--rect '
          '--batch {batch_size} '
          '--epochs {epochs} '
          '--data {yaml_file_path} '
          '--weights {weights_path} '
          '--device {device} '
          '--multi-scale '
          .format(
            img_size=img_size,
            batch_size=batch_size,
            epochs=epochs,
            yaml_file_path=yaml_file_path,
            weights_path=weights_path,
            device=device,
            ))
