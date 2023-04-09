import cv2
import numpy as np
from openvino.inference_engine import IECore

# Load the class labels
with open('class_labels.txt', 'r') as f:
    class_labels = [line.strip() for line in f]

# Initialize the Inference Engine
ie = IECore()

# Load the pre-trained model
net = ie.read_network(model='best.xml', weights='best.bin')
exec_net = ie.load_network(network=net, device_name='CPU')

# Set up the input and output blobs
input_blob = next(iter(net.input_info))
output_blob = next(iter(net.outputs))
input_shape = net.input_info[input_blob].input_data.shape
#print("OUT PUT---")


# Set up the input image
image = cv2.imread('test14.jpg')

# Preprocess the input image
resized_image = cv2.resize(image, (input_shape[3], input_shape[2]))
input_image = np.transpose(resized_image, (2, 0, 1))

# Perform inference
results = exec_net.infer(inputs={input_blob: input_image})

# Get the output
output = results[output_blob]
# print(output[0][0])

# Process the output
detections = []
for detection in output[0][0]:
    confidence = detection[1]
  #  print(confidence)
    class_id = int(detection[0][0])
    print("CLASS ID", class_id)
    xmin = int(detection[2][0] * image.shape[1])
    ymin = int(detection[3][0] * image.shape[0])
    xmax = int(detection[4][0] * image.shape[1])
    ymax = int(detection[5][0] * image.shape[0])

    # Add the detection and class label to the list of detections
    detections.append((confidence,  xmin, ymin, xmax, ymax))

# Sort the detections by confidence score in descending order
# detections.sort(reverse=True)

# Keep only the top-k detections with the highest confidence scores
#top_k = 5
#detections = detections[:top_k]

# Draw bounding boxes around the top-k detections and add labels
for detection in detections:
    confidence,  xmin, ymin, xmax, ymax = detection
    class_label = class_labels[class_id]
    cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
    # cv2.putText(image, '{} {:.2f}'.format(class_label, confidence), (xmin, ymin - 5),
    #   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    cv2.putText(image, class_label, (xmin, ymin - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)


# Display the output image
cv2.imshow('Result', image)
cv2.waitKey(0)
