import cv2
import numpy as np
from openvino.inference_engine import IECore

# Load the model
model_xml = "BESTV4.xml"
model_bin = "BESTV4.bin"
net = IECore().read_network(model_xml, model_bin)

# Get the input layer name and shape
input_layer = next(iter(net.inputs))
input_shape = net.inputs[input_layer].shape
input_shape = (1,input_shape[2],640,640)

print("Input shape:",input_shape)

# Get the output layer name
output_layer = next(iter(net.outputs))

# Create the inference engine
ie = IECore()

# Load the network into the inference engine
exec_net = ie.load_network(network=net, device_name="MYRIAD")

# Load the input image
image = cv2.imread("test3.jpg")

# Resize the input image to the network input shape
resized_image = cv2.resize(image, (640,640))

# Convert the image to the input format expected by the network
# Change data layout from HWC to CHW
input_data = resized_image.transpose((2, 0, 1))
input_data = input_data.reshape((1, *input_data.shape))

# Run inference
output = exec_net.infer(inputs={input_layer: input_data})

# Get the output blob from the output layer
output_blob = output[output_layer]

# Parse the output blob to get the object detection results
detections = output_blob[0][2]
print("Output blob shape:", output_blob.shape)
output_array = np.array(output_blob)
print(output_array.shape)
print("---------")
print(output_array)
for detection in detections:
    confidence = detection[2][0]
    if confidence.item()  > 0.8:
        x_min = int(detection[3][1] * image.shape[1])
        y_min = int(detection[4][0] * image.shape[0])
        x_max = int(detection[5][1] * image.shape[1])
        y_max = int(detection[6][0] * image.shape[0])

        box_width = x_max - x_min
        box_height = y_max - y_min
        x_min = max(0,x_min - int(0.1 * box_width))
        y_min = max(0,y_min - int(0.1 * box_height))
        x_max = min(image.shape[1], x_max +int(0.1* box_width)) 
        y_max = min(image.shape[0], y_max +int(0.1 * box_height))
        print("DBOX1:", detection[3][0])
        print("4", detection[4][0])
        print("5", detection[5][0])
        print("6", detection[6][0])
         
        cv2.rectangle(image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)

# Display the output image
cv2.imwrite('newResulev4.bmp', image)
