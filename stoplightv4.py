import cv2
import yaml
import numpy as np
from openvino.inference_engine import IECore


def load_labels(label_path):
    with open(label_path, 'r') as f:
        labels = [line.strip() for line in f.readlines()]
    return labels


# Initialize the Inference Engine
ie = IECore()

# Load the pre-trained model
net = ie.read_network(model='best.xml', weights='best.bin')
exec_net = ie.load_network(network=net, device_name='CPU')

# Set up the input and output blobs
input_blob = next(iter(net.input_info))
output_blob = next(iter(net.outputs))
input_shape = net.input_info[input_blob].input_data.shape

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
    confidence = detection[6]
    if confidence > 0.99999:
        # Add the detection to the list of detections
        detections.append(detection)

# Sort the detections by confidence score in descending order
detections = sorted(detections, key=lambda x: x[5], reverse=True)

# Keep only the top-k detections with the highest confidence scores
k = 3
selected_detections = detections[:k]

label_path = 'labels.txt'
label_list = load_labels(label_path)

# Draw bounding boxes around the top-k detections
for detection in selected_detections:

    class_id = int(detection[5])
    class_id = class_id % len(label_list)
    # print(detection)

    print("Class ID:", class_id)
    print("Label list length:", len(label_list))
    padding = 35
    #print("Class ID:", class_id)
    left = int((detection[1] * image.shape[1]/640))
    top = int(detection[2] * image.shape[0]/640)
    right = int((detection[3] * image.shape[1]/640))
    bottom = int((detection[4] * image.shape[0]/640))
    label = label_list[class_id]

    cv2.putText(image, label, (left, top - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)

# Display the output image
cv2.imshow('Result', image)
cv2.waitKey(0)
