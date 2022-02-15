from socket import *
import json

# Opening JSON file
with open('data.json', 'r') as openfile:
  
    # Reading from json file
    json_data = json.load(openfile)

data = json.dumps(json_data)

#Define Server Name and Port
serverName = '' #INSERT YOU IP ADDRESS HERE

#Port Number must match the server port number
serverPort = 2488

#Setup the socket
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName, serverPort))

#Send encoded data
clientSocket.send(bytes(data, "utf-8"))

#Wait for reponse with new data
new_data = clientSocket.recv(1024)

#decode and convert to json object
new_data = new_data.decode()
new_data = json.loads(new_data)

#write the new data
with open("new_data.json", "w") as outfile:
    json.dump(new_data, outfile)

#close the socket
clientSocket.close()