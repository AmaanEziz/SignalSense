from socket import *
import string
import requests
import json

# Return status: 
# - 1 is successful request
# - 0 is unsuccessful request
status = 0


# define Python user-defined exceptions
class ResponseCodeError(Exception):
    pass

# Purpose: 
#   Create a new node on the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code and dictionary object.
def postNewNode(loc: string = "Location", ip: string = "IP Address", isAlive: int = 0):
    newNodeData = None
    nodeData = {"location" : loc, "ipaddress" : ip, "isalive" : isAlive}
    serverName = 'http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/admin' 

    try:
        # Send the request
        r = requests.post(serverName, json=nodeData)
        newNodeData = json.loads(r.text)
        r.raise_for_status()
        status = 1
    except requests.HTTPError:
        status = 0
    except requests.Timeout:
        status = 0
    except requests.ConnectionError:
        status = 0
    finally:
        return status, newNodeData

# Purpose: 
#   Updates a node's meta data on the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code and dictionary object.
def patchNode(id: int = 0, loc: string = "Location", ip: string = "IP Address", isAlive: int = 0):
    # Init data
    nodeData = {"id" : id, "location" : loc, "ipaddress" : ip, "isalive" : isAlive}
    newNodeData = None
    serverName = 'http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/admin' 
    args = {"nodeId":id}
    
    try:
        # Send the request
        r = requests.patch(serverName, json=nodeData, params=args)
        newNodeData = json.loads(r.text)
        r.raise_for_status()
        status = 1
    except requests.HTTPError:
        status = 0
    except requests.Timeout:
        status = 0
    except requests.ConnectionError:
        status = 0
    finally:
        return status, newNodeData

# Purpose: 
#   Delete a node from the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code and dictionary object.
def deleteNode(id: int = 0):
    args = {"nodeId" : id}
    
    try:
        r = requests.delete('http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/admin', params=args)
        r.raise_for_status()
        status = 1
    except requests.HTTPError:
        status = 0
    except requests.Timeout:
        status = 0
    except requests.ConnectionError:
        status = 0
    finally:
        return status

# Purpose: 
#   Create a light on the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code.
def postNewLight(id: int = 0, state: string = "RED", phase: int = 0):
    nodeData = {"node_id" : id, "state" : state, "light_phase" : phase}
    serverName = 'http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/light' 

    try:
        # Send the request
        r = requests.post(serverName, json=nodeData)
        r.raise_for_status()
        status = 1
    except requests.HTTPError:
        status = 0
    except requests.Timeout:
        status = 0
    except requests.ConnectionError:
        status = 0
    finally:
        return status

# Purpose: 
#   Patch a light on the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code.
def patchLight(id: int = 0, light_id: int = 0, state: string = 'RED', phase: int = 0):
    
    status, lights = getLights(id)

    # Check to see if the light GET request was successful.
    if not status:
        return status

    # Modify a light with new state
    for light in lights:
        if light["id"] == id:
            if light["light_id"] == light_id:
                light["state"] = state
                status = 1
            else:
                status = 0
        else:
            status = 0
    
    # Check to see if the light data was modifed successfully.
    if not status:
        return status

    newLights = {"lights" : lights}
    args ={"node_id":id}

    try:
        # Send the request
        r = requests.patch('http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/setLights', json=newLights, params=args)
        r.raise_for_status()
        status = 1
    except requests.HTTPError:
        status = 0
    except requests.Timeout:
        status = 0
    except requests.ConnectionError:
        status = 0
    finally:
        return status


# Purpose: 
#   Patch a light on the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code.
def getLights(id: int = 0):
    args = {"nodeId" : id}
    lightData = None
    
    try:
        r = requests.delete('http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/light', params=args)
        r.raise_for_status()
        lightData = json.loads(r.text)
        status = 1
    except requests.HTTPError:
        status = 0
    except requests.Timeout:
        status = 0
    except requests.ConnectionError:
        status = 0
    finally:
        return status, lightData


# ------------CODE NOT CURRENTLY BEING USED---------------------

# Module used to retrieve node data.
# Node data is returned as a array of dictionaries, with
# each dictionary containing the following data format: 
#   - id : int , light_id : int, state :  str, light_phase : int
#
# This module returns None when an error occurs retrieving
# node data or an error connecting to the server.

def getNodeData(nodeId=0):
    data = ''
    code = 'HTTP/1.1 200 OK'

    #Port Number must match the server port number
    serverPort = 3000

    #Define Server Name
    serverName = 'ec2-3-141-8-69.us-east-2.compute.amazonaws.com' 

    #Define GET String to retrieve light ID
    path = '/api/node/light?nodeId=' + str(nodeId)

    #Define GET Request string
    req = 'GET ' + path +  ' HTTP/1.1\r\nHost: ec2-3-141-8-69.us-east-2.compute.amazonaws.com\r\n\r\n'

    #Define the socket object
    clientSocket = socket(AF_INET, SOCK_STREAM)

    try:      
        clientSocket.connect((serverName, serverPort))
        clientSocket.send(bytes(req, "utf-8"))

        full_msg = ''
        
        #Wait for reponse with new data
        while True: 
            new_data = clientSocket.recv(1024)
            full_msg = full_msg + new_data.decode()
            if not new_data:
                break

        ret_json_data = full_msg.split("\n")
        resp_code = ret_json_data[0]

        #If HTTP repsonse code is not 200, raise excepetion
        if(resp_code.find(code) == -1) :
            raise ResponseCodeError

        #Retrieve the JSON data
        data = ret_json_data[9]
        data = json.loads(data)
        
    except socket.timeout as err:
        data = None

    except socket.error as err:
        data = None
    except ResponseCodeError as err:
        data = None
    finally:
        clientSocket.close()
        return data

# ------------CODE NOT CURRENTLY BEING USED---------------------