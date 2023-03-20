import cv2
import numpy as np
from openvino.inference_engine import IECore

# Initialize the Inference Engine
ie = IECore()

# Load the pre-trained model
net = ie.read_network(model='BESTv20.xml', weights='BESTv20.bin')
exec_net = ie.load_network(network=net, device_name='CPU')

# Set up the input and output blobs
input_blob = next(iter(net.input_info))
output_blob = next(iter(net.outputs))
input_shape = net.input_info[input_blob].input_data.shape
print(input_shape)

# Set up the input image
image = cv2.imread('test14.jpg')

# Preprocess the input image
resized_image = cv2.resize(image, (input_shape[3], input_shape[2]))
input_image = np.transpose(resized_image, (2, 0, 1))

# Perform inference
results = exec_net.infer(inputs={input_blob: input_image})

# Get the output
output = results[output_blob]
print(output)

# Process the output
detections = []
for detection in output:
    confidence = detection[5]
    if confidence > 0.9:
        # Add the detection to the list of detections
        detections.append(detection)

# Sort the detections by confidence score in descending order
detections = sorted(detections, key=lambda x: x[5], reverse=True)

# Keep only the top-k detections with the highest confidence scores
k = 3
selected_detections = detections[:k]

# Draw bounding boxes around the top-k detections
for detection in selected_detections:
    left = int(detection[1] * image.shape[1]/640)
    top = int(detection[2] * image.shape[0]/640)
    right = int(detection[3] * image.shape[1]/640)
    bottom = int(detection[4] * image.shape[0]/640)

    width = right - left
    height = bottom - top
    left -= int(0.5 * width)
    top -= int(0.5 * height)
    right += int(0.5 * width)
    bottom += int(0.5 * height)
    cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)

# Display the output image
cv2.imshow('Result', image)
cv2.waitKey(0)
