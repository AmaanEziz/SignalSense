import os

weights_path = "exp4/weights/best.pt"
source = "test_data/chloeCam.MOV"
device = "CPU"
os.system(f'python3 yolov5/detect.py '
          f'--weights {weights_path} '
          f'--source {source} '
          f'--device {device} '
          f'--save-txt '
          f'--conf-thres 0.5 '
          # f'--nosave'
          )
