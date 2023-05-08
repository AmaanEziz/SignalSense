import cv2
import time
import random
import numpy as np
from openvino.inference_engine import IECore
from PIL import Image
from pathlib import Path
from collections import OrderedDict, namedtuple
from datetime import datetime
import os
from array import array
import openpyxl #needed for excel data write

#needed for excel data write
#create file named data.xlsx beforehand, so that it can open it
#update path to your data file
workbook_name = "C:\Users\Liana Coyle\yolov7env\Scripts\yolov7\data.xlsx"
wb = openpyxl.load_workbook(workbook_name)
ws = wb['Sheet1']
ws = wb.active
new_data = []

ie = IECore()
net = ie.read_network(model='BESTv20.xml', weights='BESTv20.bin')
exec_net = ie.load_network(network=net, device_name='CPU')


def letterbox(im, new_shape=(640, 640), color=(114, 114, 114), auto=True, scaleup=True, stride=32):

    input_blob = next(iter(net.input_info))
    output_blob = next(iter(net.outputs))
    input_shape = net.input_info[input_blob].input_data.shape

    # Resize and pad image while meeting stride-multiple constraints
    shape = im.shape[:2]  # current shape [height, width]
    if isinstance(new_shape, int):
        new_shape = (new_shape, new_shape)

    # Scale ratio (new / old)
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    if not scaleup:  # only scale down, do not scale up (for better val mAP)
        r = min(r, 1.0)

    # Compute padding
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - \
        new_unpad[1]  # wh padding

    if auto:  # minimum rectangle
        dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding

    dw /= 2  # divide padding into 2 sides
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right,
                            cv2.BORDER_CONSTANT, value=color)  # add border

    return im, r, (dw, dh)

# Define name-color dictionary
name_colors = {
    'green': [18, 138, 18],
    'left-green': [18, 138, 18],
    'left-red': [255, 0, 0],
    'left-yellow': [171, 148, 32],
    'red': [255, 0, 0],
    'yellow': [171, 148, 32]
}

name_bits = {
    'green': 0x00000001,
    'left-green': 0x00000010,
    'left-red': 0x00000040,
    'left-yellow': 0x00000020,
    'red': 0x00000004,
    'yellow': 0x00000002
}

# Set the path to the directory containing the images to be processed
image_dir = "C:/Users/mindy/openvino_env/TESTING/images" #replace with path to test images
parent_dir = Path("C:/Users/mindy/openvino_env/TESTING/runs")

# Define the base name of the directory
base_name = 'exp'

# Check if the base directory exists and increment the name if necessary
dir_index = 0
while True:
    dir_name = f'{base_name}{dir_index}'
    new_dir = parent_dir / dir_name
    if not new_dir.exists():
        break
    dir_index += 1

# Create the new directory
new_dir.mkdir()

# Iterate through each file in the directory
for filename in os.listdir(image_dir):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        img = cv2.imread(os.path.join(image_dir, filename))

        names = ['green', 'left-green', 'left-red', 'left-yellow', 'red', 'yellow']
        colors = {name:name_colors[name] for name in names}
        bits = {name:name_bits[name] for name in names}

        # Load image
        # image_path = 'test14.jpg'
        # img = cv2.imread(image_path)

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # start time
        start_time = datetime.now()

        image = img.copy()
        image, ratio, dwdh = letterbox(image, auto=False)
        image = image.transpose((2, 0, 1))
        image = np.expand_dims(image, 0)
        image = np.ascontiguousarray(image)

        im = image.astype(np.float32)
        im /= 255
        im.shape

        output_blob = next(iter(exec_net.outputs))
        input_blob_name = next(iter(net.input_info))
        input_shape = net.input_info[input_blob_name].input_data.shape

        # Get the output from the network
        output = exec_net.infer(inputs={input_blob_name: im})

        output = output[output_blob]
        output = np.squeeze(output)  # remove the batch dimension
        output = output.reshape(-1, 7)  # reshape to (num_boxes, num_attributes)

        # Get the detected boxes, scores, and class IDs
        boxes = output[:, 1:5]
        scores = output[:, 6]

        class_ids = output[:, 5].astype(int)

        # Filter out detections with low confidence
        mask = scores > 0.25
        boxes = boxes[mask]
        scores = scores[mask]
        class_ids = class_ids[mask]

        ori_images = [img.copy()]

        bit = ''

        #end time
        end_time = datetime.now()
        time_elapsed = end_time - start_time
        total_seconds_elapsed = time_elapsed.total_seconds()

        # Draw bounding boxes on the image
        for i, box in enumerate(boxes):
            #boxes /= ratio
            #boxes -= np.array(dwdh*2)
            x1, y1, x2, y2 = box.astype(np.int32)

            # Rescale the boxes to the original image size
            box /= ratio
            box -= np.array(dwdh*2)
            box = box.round().astype(np.int32).tolist()
            phase_bit = array('i', [0, 0])
            name = names[class_ids[i]]

            bit += f"{bits[names[class_ids[i]]]:0{8}x}"

            print('Score of '+name+': '+str(scores[i]))
            cv2.rectangle(img, box[:2],box[2:], colors[names[class_ids[i]]], 2)
            cv2.putText(img, name + ' ' + str(scores[i]), (box[0], box[1] - 2), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, colors[names[class_ids[i]]], 2)
            infer_info = [filename, name, scores[i], total_seconds_elapsed * 1000, 'ir', f"{bits[names[class_ids[i]]]:0{8}x}", datetime.now()]  
            new_data.append(infer_info)

        Image.fromarray(ori_images[0])

        print(f"Time elapsed: {total_seconds_elapsed * 1000} ms")
        print(bit)

        output_filename = os.path.join(new_dir, f"{filename}")
        cv2.imwrite(output_filename, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
        print(f" The image with the result is saved in: {new_dir}")
        print("=============================================================")

#needed for excel data write
for info in new_data:
    ws.append(info)

wb.save(filename = workbook_name)