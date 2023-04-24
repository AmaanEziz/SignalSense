import cv2
import time
import random
import numpy as np
from openvino.inference_engine import IECore
from PIL import Image
from pathlib import Path
from collections import OrderedDict, namedtuple
import datetime

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

    dw //= 2  # divide padding into 2 sides
    dh //= 2

    if shape[::-1] != new_unpad:  # resize
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right,
                            cv2.BORDER_CONSTANT, value=color)  # add border

    return im, r, (dw, dh)


names = ['green', 'left-green', 'left-red', 'left-yellow', 'red', 'yellow']
colors = {name: [random.randint(0, 255) for _ in range(3)]
          for i, name in enumerate(names)}

# Load image
image_path = 'test14.jpg'
img = cv2.imread(image_path)

img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

image = img.copy()
image, ratio, dwdh = letterbox(image, auto=False)
image = image.transpose((2, 0, 1))
#image = image.transpose((2, 0, 1))
image = np.expand_dims(image, 0)
image = np.ascontiguousarray(image)

im = image.astype(np.float32)
im /= 255
im.shape

output_blob = next(iter(exec_net.outputs))
input_blob_name = next(iter(net.input_info))
input_shape = net.input_info[input_blob_name].input_data.shape

# Get the output from the network

# start time
start_time = datetime.datetime.now()
output = exec_net.infer(inputs={input_blob_name: im})

#end time
end_time = datetime.datetime.now()
time_elapsed = end_time - start_time
total_seconds_elapsed = time_elapsed.total_seconds()
print(f"Time elapsed: {total_seconds_elapsed * 1000} ms")

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

# Rescale the boxes to the original image size
boxes /= ratio

# Draw bounding boxes on the image
for i, box in enumerate(boxes):
    x1, y1, x2, y2 = box.astype(np.int32)
    cv2.rectangle(img, (x1, y1), (x2, y2), colors[names[class_ids[i]]], 2)
    print()
    print('start point:'+ str(x1) +','+ str(y1))
    print('end point:'+ str(x2) +','+ str(y2))
    cv2.putText(img, names[class_ids[i]] + ' ' + str(scores[i]), (x1, y1 -5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, colors[names[class_ids[i]]], 2)

# Display the image with bounding boxes
cv2.imshow('image', cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
cv2.waitKey(0)
