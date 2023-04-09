import cv2
import numpy as np
from openvino.inference_engine import IECore


# Cuold not test it yet dont have the classfication model yet
# --------------------------------EXPERIMENTAL----------------------------
# Load the class labels
with open('class_labels.txt', 'r') as f:
    class_labels = [line.strip() for line in f]

# Initialize the Inference Engine
ie = IECore()

# Load the pre-trained model
# currently place holders until I get the new model
net = ie.read_network(model='BESTv20.xml', weights='BESTv20.bin')
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
input_image = np.expand_dims(input_image, axis=0)

# Perform inference
results = exec_net.infer(inputs={input_blob: input_image})

# Get the output
output = results[output_blob]
class_idx = np.argmax(output)

# Get the predicted class label
predicted_label = class_labels[class_idx]

# Print the predicted class label
print(predicted_label)

# Display the output image
cv2.imshow('Result', image)
cv2.waitKey(0)
