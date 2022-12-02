<h1>Phase-Sense</h1>
<img src="static_startup_logo.png" alt="Team Static Startup Logo" width="150"/>


<h2>Table of Contents:</h2>

- [Description](#description)
- [Installation](#installation)
- [Important Note](#important-note)
  - [Deploying Front End](#deploying-front-end)
  - [Database Setup](#database-setup)
  - [Node Setup](#node-setup)
- [Contributors](#contributors)
- [Documentation](#documentation)

## Description

The purpose of this project is to create a flexible, non-invasive way of getting the current traffic light statuses of intersections.
This would allow further connectivity in future plans for smart cities, as well as be beneficial for self-driving cars and other autonomous vehicles.
This will be done by training a machine learning model to detect traffic lights from a video feed in near real-time, and then sending the detected traffic light statuses to a server.
We also developed a website for displaying the active lights for users to see visually rather than just the string of bytes that are transmitted.
The transmitted data follows the NTCIP format so that it should be indistinguishable from other traffic light systems that are already being used in several areas.

This project repository contains all four parts of the project, detailed below.

|   Component    |                                Purpose                                |
|:--------------:|:---------------------------------------------------------------------:|
| SignalSenseBox |                   The service that Nodes connect to                   |
|       UI       | This is the demo UI for [signalsense.link](https://signalsense.link/) |
|  AWS Service   |                  This is the centralized AWS service                  |
|    Database    |       This is the database that runs on AWS and SignalSenseBox        |

## Installation

### Important Note

Both SignalSenseBox and backend require environmental variables to deploy the services.
These are stored in a .env file that is not included in this repo for security concerns as requested by our client.
To obtain the .env file, please contact Harsh Verma [harsh@glocol.net](mailto:harsh@glocol.net).
Once obtained, save the file to `SignalSenseBox/.env` and `backend/.env` respectively.

### Deploying Front End

This service is deployed automatically when a commit is merged to the Phase-Sense repository.

### Database Setup

For additional information on the docker image, please see the [SignalSenseBox](SignalSenseBox/) directory.

Each SignalSenseBox pulls down a prebuilt database from Docker.
To rebuild you must first have Docker Desktop installed on your PC.
Make sure to login by running Docker login from a terminal.
In that same terminal run the following command: `docker buildx build --platform linux/arm64/v8,linux/amd64 -t <Your Docker Username>/signal-db:latest --push .` from the `database\dockerImage` directory.
The scripts under `sql-scripts/` and the `my.cnf` file will be used to create the image, and the user and schema is created when the image is pulled onto the new SignalSenseBox.
These attributes are provided in the SignalSenseBox `.env` file.
After pushing the new version be sure to update the [SignalSenseBox/docker-compose.yaml](https://github.com/PhaseSense/Phase-Sense/blob/main/SignalSenseBox/docker-compose.yaml) file so that the new database is pulled.

```yaml
services: 
  mysqldb:
    image: <Your repo name>/signal-db:latest # <- update database image tag here
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    pull_policy: always
    environment:
      MYSQL_ROOT_PASSWORD: $MYSQL_ROOT_PASSWORD
      MYSQL_USER: $MYSQL_USER
      MYSQL_PASSWORD: $MYSQL_PASS
    ports:
      - $MYSQL_DOCKER_PORT:3306
    cap_add:
      - SYS_NICE  # CAP_SYS_NICE
```

 Remove Node Set up Maybe? ### Node Setup

1. Clone the repository
2. Navigate to `Phase-Sense/model_files/Yolo Files/`
3. Run `git clone https://github.com/ultralytics/yolov5` to install the ML model
4. Run `pip install -r requirements.txt` to install the required packages, followed by `pip install -r yolov5/requirements.txt` to install any updated model requirements

<!--- # TODO Fix link to user guide when it is complete and in the repo. -->
The model should now be fully set up and ready for detection.
Please refer to the [User Guide](user_guide.pdf) for more information on running detection with preconfigured scripts, or [https://github.com/ultralytics/yolov5](https://github.com/ultralytics/yolov5) for more information on the model itself.

The trained model is stored in the `model_files/Yolo Files/exp4/weights/best.pt` file.

To run the node, follow the additional steps below.

1. Navigate to the `Phase-Sense/model_files/Yolo Files/` directory.
2. Configure the `test_model.py` file as described in the [User Guide](user_guide.pdf).
3. Edit the `data_transform.py` file as needed (only needed if locations of ML model output are changed).
4. Open a terminal and run `python test_model.py` to begin detection.
5. In a separate terminal, run `python data_transform.py` to begin sending the detections to the database.
   1. The data pipeline takes the most recent files from the ML model output, so timing for running this is not important as long as the model has at least 5 frames detected. 

## Contributors

|      Name      |        Area of Focus        |
|:--------------:|:---------------------------:|
|  Manvir Kaur   |  Team Lead & Hardware Lead |
|  Mindy Cha     |       AI/ML     |
|  Jian Chen     |  Hardware    |
|  Liana Coyle  |       AI/ML Lead    |
|  Amaan Eziz  | UI/Database Lead |
|  Anh Phan      | UI/Database |
|  Luda Solva    |       AI/ML     |
| Kyle Barreras |  Hardware   |


## Documentation

<!---# TODO Add additional documentation if needed -->
[User Guide](user_guide.pdf) - Instructions on how to run the model and how to use the website.
[Maintenance Manual](maintenance_manual.pdf) - Instructions on how to maintain the project.
