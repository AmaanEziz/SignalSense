from socket import *
import json

# Define Server Name
serverName = 'ec2-3-141-8-69.us-east-2.compute.amazonaws.com' 

# Define the server port number
serverPort = 3000

# Create the GET request for the home page
request = "GET / HTTP/1.1\r\nHost:%s\r\n\r\n" % serverName

# Setup the socket, and connect to server
clientSocket = socket(AF_INET, SOCK_STREAM)

# Try and Catch block to catch errors thrown by socket module
try:
    clientSocket.connect((serverName, serverPort))

    # Send Request
    clientSocket.send(bytes(request, "utf-8"))

    # Store the response sent by the server
    resp = clientSocket.recv(1024)

    # Decode the response and print to the console the
    # response.
    resp = resp.decode()
    print(resp)
except socket.timeout as err :
    print('Socket timeout.')
except socket.error as err :
    print('There was issue with the socket. Check IP address and port number are correct.')
finally: 
    #close the socket
    clientSocket.close()


# -------- Code from previous commit thats is not need right now. --------
# NOT NEED CURRENTLY
# Opening JSON file
#with open('data.json', 'r') as openfile:
    # Reading from json file
#    json_data = json.load(openfile)
#data = json.dumps(json_data)

# NOT NEED CURRENTLY
#write the new data
#with open("new_data.json", "w") as outfile:
#    json.dump(new_data, outfile)