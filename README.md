<h1>Phase-Sense</h1>

<h2>Table of Contents:</h2>

- [Description](#description)
- [Installation](#installation)
  - [Important Note](#important-note)
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

This project repository contains all four parts of the project, detailed below.

|   Component    |                                Purpose                                |
|:--------------:|:---------------------------------------------------------------------:|
| SignalSenseBox |                   The service that Nodes connect to                   |
|       UI       | This is the demo UI for [signalsense.link](https://signalsense.link/) |
|  AWS Service   |                  This is the centralized AWS service                  |
|    database    |       This is the database that runs on AWS and SignalSenseBox        |

## Installation

### Important Note

Both SignalSenseBox and backend require environmental variables to deploy the services.
These are stored in a .env file that is not included in this repo for security concerns as requested by our client.
To obtain the .env file, please contact Harsh Verma [harsh@glocol.net](mailto:harsh@glocol.net).
Once obtained, save the file to `SignalSenseBox/.env` and `backend/.env` respectively.

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

|      Name      |  Area of Focus   |
|:--------------:|:----------------:|
|  Jose Ramirez  |    Team Lead     |
| Michael Ingrum |   Backend Dev    |
|   Alec Resha   |      AI/ML       |
| Chloe Hendrix  | API/Connectivity |
| Justin Henley  |  Databases Dev   |
|   Lan Nguyen   |  Front End Dev   |
|   Dang Hoang   |  Front End Dev   |

## Documentation

<!---# TODO Add additional documentation if needed -->
[User Guide](user_guide.pdf) - Instructions on how to run the model and how to use the website.
[Maintenance Manual](maintenance_manual.pdf) - Instructions on how to maintain the project.