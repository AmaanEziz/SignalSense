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
# Get the output
output = results[output_blob]

# Process the output
detections = []
for i in range(output.shape[1]):
    detection = output[0, i]
    confidence = detection[0]
    if confidence[0][0] > .8:
        # Add the detection to the list of detections
        detections.append(detection)
        # print(detections)

# Sort the detections by confidence score in descending order
detections = sorted(detections, key=lambda x: x[0][5][0], reverse=True)

# Keep only the top-k detections with the highest confidence scores
k = 3
selected_detections = detections[:k]

label_path = 'labels.txt'
label_list = load_labels(label_path)

# Draw bounding boxes around the top-k detections
for detection in detections:
    # print(detections)
    class_id = int(detection[0][5][0])
    class_id = class_id % len(label_list)
    # print(detection)

    print("Class ID:", class_id)
    print("Label list length:", len(label_list))
    #padding = 1000
    #print("Class ID:", class_id)
    left = int((detection[0][1][0] * image.shape[1]))
    top = int((detection[0][2][0] * image.shape[0]))
    right = int((detection[0][3][0] * image.shape[1]))
    bottom = int((detection[0][4][0] * image.shape[0]))
    label = label_list[class_id]

    cv2.putText(image, label, (left, top - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)

# Display the output image
cv2.imshow('Result', image)
cv2.waitKey(0)
