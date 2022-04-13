import os

weights_path = "yolov5/runs/train/exp/weights/best.pt"
source = "test_data/eastbound1.mp4"
device = 0
os.system(f'python yolov5/detect.py '
          f'--weights {weights_path} '
          f'--source {source} '
          f'--device {device} '
          f'--save-txt '
          f'--conf-thres 0.5 '
          # f'--nosave'
          )
