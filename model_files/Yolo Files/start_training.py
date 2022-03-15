import os

img_size = 640  # size of the image
batch_size = -1  # -1 for auto batch size
epochs = 100  # Epochs for training, 300 is default
yaml_file_path = './dataset.yaml'  # path to dataset.yaml
weights_path = './yolov5/yolov5s.pt'  # yolov5s.pt or yolov5m.pt, v5s is faster
name = '100epoch_all_images'  # name of the output model
os.system('python ./yolov5/train.py '
          '--img {img_size} '
          '--batch {batch_size} '
          '--epochs {epochs} '
          '--data {yaml_file_path} '
          '--weights {weights_path}'
          .format(
            img_size=img_size,
            batch_size=batch_size,
            epochs=epochs,
            yaml_file_path=yaml_file_path,
            weights_path=weights_path,
            ))
