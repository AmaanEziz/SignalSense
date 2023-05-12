import cv2
import time
import requests
import random
import numpy as np
import onnxruntime as ort
from PIL import Image
from pathlib import Path
from collections import OrderedDict,namedtuple
from datetime import datetime
import os
from pathlib import Path
from utils.general import increment_path
from array import array
import openpyxl #needed for excel data write


###################### OPEN EXCEL ##########################
#         This opens an existing excel sheet               #
############################################################
workbook_name = "C:/Users/mindy/yolov7env/Scripts/yolov7/data1.xlsx"
wb = openpyxl.load_workbook(workbook_name)
ws = wb['Sheet1']
ws = wb.active
new_data = []


###################### LOAD MODEL FILES ##########################
# This loads an existing model file and provides libraries that  #
# are needed to run the inference.                               #
##################################################################
cuda = True
w = "C:/Users/mindy/yolov7env/Scripts/yolov7/best.onnx" #replace with path to model file

providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if cuda else ['CPUExecutionProvider']
session = ort.InferenceSession(w, providers=providers)


###################### RESIZE IMG #########################
# This resizes the image for inference and for drawing.   #
###########################################################
def letterbox(im, new_shape=(640, 640), color=(114, 114, 114), auto=True, scaleup=True, stride=32):
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
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding

    if auto:  # minimum rectangle
        dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding

    dw /= 2  # divide padding into 2 sides
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)  # add border

    return im, r, (dw, dh)


###################### DICTIONARY ##########################
# This creates a bit stream and a color dictionary for the #
# cooresponding labels.                                    #
############################################################
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


############################ FILE PATHS ##################################
# This sets the path to directory containing the images to be processed. #
# This also sets the path to directory where inferred images will be     #
# saved to.                                                              #
##########################################################################
image_dir = "C:/Users/mindy/yolov7env/Scripts/yolov7/inference/images" #replace with path to test images
parent_dir = Path("C:/Users/mindy/yolov7env/Scripts/yolov7/runs/detect")

# Define the base name of the directory
base_name = 'exp'

# Check if the base directory exists and increment the name if necessary
dir_index = 0
while True:
    dir_name = f'{base_name}_{dir_index}'
    new_dir = parent_dir / dir_name
    if not new_dir.exists():
        break
    dir_index += 1

# Create the new directory
new_dir.mkdir()


######################## INFERENCE ############################
# This takes in the following: image directory, model file.   #
# It runs inference on the images in the provided directory   #
# using the model file provided.                              #
###############################################################
for filename in os.listdir(image_dir):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        # Load the image
        img = cv2.imread(os.path.join(image_dir, filename))

        # Perform the inference on the image
        names = ['green', 'left-green', 'left-red', 'left-yellow', 'red', 'yellow']
        
        colors = {name:name_colors[name] for name in names}
        bits = {name:name_bits[name] for name in names}

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        #start time
        start_time = datetime.now()

        image = img.copy()
        image, ratio, dwdh = letterbox(image, auto=False)
        image = image.transpose((2, 0, 1))
        image = np.expand_dims(image, 0)
        image = np.ascontiguousarray(image)

        im = image.astype(np.float32)
        im /= 255
        im.shape

        outname = [i.name for i in session.get_outputs()]

        inname = [i.name for i in session.get_inputs()]

        inp = {inname[0]:im}

        outputs = session.run(outname, inp)[0]

        ori_images = [img.copy()]

        bit = ''

        end_time = datetime.now()
        time_elapsed = end_time - start_time
        total_seconds_elapsed = time_elapsed.total_seconds()

        for i,(batch_id,x0,y0,x1,y1,cls_id,score) in enumerate(outputs):
            image = ori_images[int(batch_id)]
            box = np.array([x0,y0,x1,y1])
            box -= np.array(dwdh*2)
            box /= ratio
            box = box.round().astype(np.int32).tolist()
            cls_id = int(cls_id)
            score = round(float(score),3)
            phase_bit = array('i', [0, 0])
            if(score >= 0.5):
                name = names[cls_id]
                color = colors[name]

                bit += f"{bits[names[cls_id]]:0{8}x}"

                print('Score of '+name+': '+str(score))
                name += ' '+str(score)
                cv2.rectangle(image,box[:2],box[2:],color,2)
                cv2.putText(image,name,(box[0], box[1] - 2),cv2.FONT_HERSHEY_SIMPLEX,0.75, color,thickness=2)  

                #Saves data for excel sheet
                infer_info = [filename, name, score, total_seconds_elapsed * 1000, 'onnx', f"{bits[names[cls_id]]:0{8}x}", datetime.now()]  
                new_data.append(infer_info)

        Image.fromarray(ori_images[0])

        print(f"Time elapsed: {total_seconds_elapsed * 1000} ms")
        print(bit)

        # Save the output image
        output_filename = os.path.join(new_dir, f"{filename}")
        Image.fromarray(ori_images[0]).save(output_filename)
        print(f" The image with the result is saved in: {new_dir}")
        print("=============================================================")


##################### WRITE EXCEL ##########################
#        This writes to an existing excel sheet            #
############################################################
for info in new_data:
    ws.append(info)

wb.save(filename = workbook_name)

