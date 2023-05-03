<h1>Signal-Sense</h1> 

<img src="static_startup_logo.png" alt="Team Static Startup Logo" width="150"/> 

  

<h2>Table of Contents:</h2> 

  

- [Description](#description) 

- [Testing](#testing) 

- [Installation](#installation) 

    - [Deploying Front End](#deploying-front-end) 

    - [Running Front End Locally](#running-front-end-locally)  

    - [Running the PyTorch/ONNX Model](#running-the-pyTorch/ONNX-Model) 

    -  [Running the IR Model](#running-the-ir-model) 

- [Contributors](#contributors) 

- [Documentation](#documentation) 

  

## Description 

This project was offeered to us by Dr. Harsh Verma of Glocol Networks. Glocol Networks is an Internet-of-Things (IoT) start-up with a mission of transforming how IOT, Smart Objects, and Wearables can change our lives in Smart Cities with a new paradigm to smart living and saving lives.  

The purpose of this project is to create a flexible, non-invasive way of getting the current traffic light statuses of intersections. 

This would allow further connectivity in future plans for smart cities, as well as be beneficial for self-driving cars and other autonomous vehicles. 

This will be done by developing an AI/ML model using Intel OpenVINO as a Visual Approach for capturing Signal Change information at Traffic Intersections without interfering or touching the Traffic Controller. We are using Roboflow to train our model. 

We also developed a website for displaying the change of traffic signal phases.  

 

### Testing 

To test the developed model, navigate to the URL here and choose either the URL or file upload methods. Then ensure the Labels section has “On” selected. Ensure the inference result section has “Image” selected and click “Run Inference” once a valid photo URL or photo image has been uploaded. 

 

To test the model locally, follow the instructions given in the <a href=””> Maintenance Manual</a> to download all necessary files. Then, follow the instructions in the <a href=””>System Test Report</a> to set up the test environment.  

 

To test the model on Google Colab/Jupyter Notebook, follow the instructions in the <a href=””>System Test Report</a> to set up the test environment. 

 

## Installation 

   

### Deploying Front End 

  

This service is deployed automatically when a commit is merged to the Signal-Sense repository. 

  

### Running Front End Locally 

Open a terminal. Navigate to UI/src. Verify you have node already installed. Run "npm i" and then "node server.js". Navigate to localhost:3000 on a browser. 

 

### Running the PyTorch/ONNX Model 

1. Run ‘python -m venv yolov7env’ to create a virtual environment 

2. Navigate to yolov7env/Scripts and run ‘activate’ 

3. Run `git clone https://github.com/AmaanEziz/SignalSense` to install the model files 

4. Navigate to yolov7 

5. Run `pip install -r requirements.txt` to install the required packages 

6. Run ‘python detect.py --weights best.pt --conf 0.4 --img-size 640 –source ./inference/images’ to run the inference using the PyTorch model.  

7. Run ‘python detect-ONNX.py’ to run the inference using the ONNX model 

  

<!--- # TODO Fix link to user guide when it is complete and in the repo. --> 

The model should now be fully set up and ready for detection. 

Please refer to the [User Guide](user_guide.pdf) for more information on running detection with preconfigured scripts, or [https://github.com/WongKinYiu/yolov7](https://github.com/WongKinYiu/yolov7) for more information on the model itself. 

The trained model (.pt and .onnx) is stored in the https://drive.google.com/drive/folders/12Hpy5GGVG6ktBY3NA8FjU4FjZliUXtok?usp=share_link  

 

### Running the IR Model 

1. Go to [Download Intel® Distribution of OpenVINO™ Toolkit](https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/download.html) 

2. Choose ‘Runtime’, your OS type, version ‘2022.3’, distribution ‘PIP’ and follow the installation guide given on the page 

    *Suggested to use Python version 3.9 

3. Navigate to openvino_env 

4. Download ‘detect-ir.py’ from this repository, the trained model from the google drive, and place in openvino_env directory 

5. Create a text file named `class_labels.txt` 

6. Navigate to openvino_env/images and place the image(s) you want to run inference on

7. Navigate back to openvino_env

8. Run `python detect-ir.py` to run inference 

 

Please refer to the [User Guide](user_guide.pdf) for more information on running detection with preconfigured scripts 

The trained model (.xml and .bin) is stored in the https://drive.google.com/drive/folders/1NQ2DdxkQuzjxjA4i1zIZEQszl-OMXn-5?usp=share_link 

 

## Contributors 

  

|      Name      |        Area of Focus        | 

|:--------------:|:---------------------------:| 

|  Manvir Kaur   |     Team Lead & AI/ML       | 

|  Mindy Cha     |           AI/ML             | 

|  Jian Chen     |            UI               | 

|  Liana Coyle   |           AI/ML             | 

|  Amaan Eziz    |            UI               | 

|  Anh Duy Phan  |            UI               | 

|  Luda Salova   |           AI/ML             | 

| Kyle Barreras  |           AI/ML             |  

  

  

## Documentation 

  

<!---# TODO Add additional documentation if needed --> 

 

User Manual (Work is in progress for the documentation! Links will be updated soon!): Instructions on how to run the model and how to use the website. 

 

Maintenance Manual (Work is in progress for the documentation! Links will be updated soon!): Instructions on how to maintain the project. 

 

 

 
