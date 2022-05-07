# SignalSenseBox

## Description

The is the code for the Signal Sense proxy intersection controller. It is the master server for all nodes on an intersections network. It is meant to be built using Docker, to pull in a local mysql database and a runtime for nodejs. You will need to open port 3000 on the system this is installed on.  

## Usage/Requirments

The host system will need Docker compose installed. If on a raspery pi, you can get this tool from apt via `apt install docker-compose`

To build and run the container on windows you will need Docker Desktop installed.

The database is customised and a seperate image, built and pushed to DockerHub.
The docker-compose.yaml file will pull this image and build the signalsensebox image, and deploy the containers. 
These containers are linked together on a network. Currently the node.js code uses the databased link as the hostname to the database. 
You can also run the node code without docker, but you will still need to pull michaelingrum/signal-db and then change the hostname to localhost. 

### Building

To build and start the containers run `docker compose up --build`
To shut down the container you can press ctrl c. Let it shutdown gracefully.
If you started the container so that it run in the background, ie `docker compose --build` & you can shut it down by running `docker compose stop`

Once the database is up you will be able to access the api at `http://localhost:3000/`, visit `http://localhost:3000/api-docs` to view the docs. (need to be updated)

### Initialize the database

For now you also need to init the database via mysql workbench. A todo is to make that an api call. 
connect to the database via localhost (credentials are found in the .env file). 

![image](https://user-images.githubusercontent.com/36677776/161358121-bbd85ecb-372b-4023-9b69-b073a3bc0b19.png)

Then we can run `call init(16, true)` to add dummy data. 
For an empty intersection run `call init(16, false)`
