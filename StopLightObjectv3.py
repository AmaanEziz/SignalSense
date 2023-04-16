import cv2
import numpy as np
from openvino.inference_engine import IECore

# Load the class labels
with open('class_labels.txt', 'r') as f:
    class_labels = [line.strip() for line in f]

# Initialize the Inference Engine
ie = IECore()

# Load the pre-trained model
net = ie.read_network(model='BESTv20.xml', weights='BESTv20.bin')
exec_net = ie.load_network(network=net, device_name='CPU')

# Set up the input and output blobs
input_blob = next(iter(net.input_info))
output_blob = next(iter(net.outputs))
input_shape = net.input_info[input_blob].input_data.shape
print("OUT PUT---")


# Set up the input image
image = cv2.imread('test14.jpg')

# Preprocess the input image
resized_image = cv2.resize(image, (input_shape[3], input_shape[2]))
input_image = np.transpose(resized_image, (2, 0, 1))

# Perform inference
results = exec_net.infer(inputs={input_blob: input_image})

# Get the output
output = results[output_blob]
print(output.shape)

# Process the output
detections = []
for detection in output:
    confidence = detection[5]
    if confidence > 0.9:
        # Get the class label index
        class_idx = int(detection[1])

        # Add the detection and class label to the list of detections
        detections.append((detection))

# Sort the detections by confidence score in descending order
detections = sorted(detections, key=lambda x: x[5], reverse=True)

# Keep only the top-k detections with the highest confidence scores
k = 3
selected_detections = detections[:k]

# Draw bounding boxes around the top-k detections and add labels
for detection in selected_detections:
    left = int(detection[2] * image.shape[1]/640)
    top = int(detection[3] * image.shape[0]/640) - 400
    right = int(detection[4] * image.shape[1]/640) + 400
    bottom = int(detection[5] * image.shape[0]/640) + 400

    cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
   # cv2.putText(image, label, (left, top - 10),
    #       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Display the output image
cv2.imshow('Result', image)
cv2.waitKey(0)
