<h1>Phase-Sense</h1>

<h2>Table of Contents:</h2>

- [Description](#description)
- [Installation](#installation)
  - [Deploying Front End](#deploying-front-end)
  - [Database Setup](#database-setup)
  - [Machine Learning Model Installation](#machine-learning-model-installation)
- [Contributors](#contributors)
- [Documentation](#documentation)

## Description

The purpose of this project is to create a flexible, non-invasive way of getting the current traffic light statuses of intersections.
This would allow further connectivity in future plans for smart cities, as well as be beneficial for self-driving cards and other autonomous vehicles.
This was done by training a machine learning model to detect traffic lights from a video feed in near real-time, and then sending the detected traffic light statuses to a server.
We also developed a website for displaying the active lights for users to see visually rather than just the string of bytes that are transmitted.
The transmitted data follows the NTCIP format so that it should be indistinguishable from other traffic light systems that are already being used in several areas.

## Installation

### Deploying Front End

### Database Setup

### Machine Learning Model Installation

1. Clone the repository
2. Navigate to `Phase-Sense/model_files/Yolo Files/`
3. Run `git clone https://github.com/ultralytics/yolov5` to install the ML model
4. Run `pip install -r requirements.txt` to install the required packages, followed by `pip install -r yolov5/requirements.txt` to install any updated model requirements

<!--- # TODO Fix link to user guide when it is complete and in the repo. -->
The model should now be fully set up and ready for detection.
Please refer to the [User Guide](user_guide.pdf) for more information on running detection with preconfigured scripts, or [https://github.com/ultralytics/yolov5](https://github.com/ultralytics/yolov5) for more information on the model itself.

The trained model is stored in the `model_files/Yolo Files/exp4/weights/best.pt` file.

## Contributors

| Jose Ramirez | Michael Ingrum | Alec Resha | Justin Henley | Chloe Hendrix    | Lan Nguyen | Dang Hoang |
| :----------: | :------------: | :--------: | :-----------: | :--------------: | :--------: | :--------: |
| Team Lead    | Backend        | AI/ML      | Databases     | API/Connectivity | Front End  | Front End  |

## Documentation

<!---# TODO Add additional documentation if needed -->
[User Guide](user_guide.pdf) - Instructions on how to run the model and how to use the website.
[Maintenance Manual](maintenance_manual.pdf) - Instructions on how to maintain the project.