import json
from socket import *
import json

#Define Server Port and Setup Socket
serverPort = 2488
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(('', serverPort))
serverSocket.listen(1)

#Wait for new requests
while True:
    connectionSocket, addr = serverSocket.accept()
    
    #Catch Recieving Data
    json_data = connectionSocket.recv(1024)
    
    #Decode Data and Convert data to json object
    json_data = json_data.decode()
    json_data = json.loads(json_data)
    
    #Modify data with correct info
    json_data["id"] = 123
    
    #Prepare to data and send back to client
    json_data = json.dumps(json_data)
    connectionSocket.send(bytes(json_data, "utf-8"))

    #Close the socket
    connectionSocket.close()