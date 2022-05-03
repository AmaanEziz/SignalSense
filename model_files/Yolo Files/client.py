from socket import *
import string
import requests
import json

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
def postNewNode(loc: string = "Location", intersection_id: string='0000', ip: string = "IP Address", isAlive: int = 0):
    status = 0
    newNodeData = None
    nodeData = {"location" : loc, "intersectionID": intersection_id,  "ipaddress" : ip, "isalive" : isAlive}
    serverName = 'http://localhost:3000/api/node/admin' 

    try:
        # Send the request
        r = requests.post(serverName, json=nodeData)
        newNodeData = json.loads(r.text)
        r.raise_for_status()
        status = 1
    except requests.HTTPError as err:
        print(err)
        status = 0
    except requests.Timeout as err:
        print(err)
        status = 0
    except requests.ConnectionError as err:
        print(err)
        status = 0
    finally:
        return status, newNodeData

# Purpose: 
#   Retrieve the intersection ID from the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code and dictionary object.
def getIntersectionID():
    status = 0
    intersectionID = None
    serverName = 'http://localhost:3000/api/node/intersection'

    try:
        # Send the request
        r = requests.get(serverName)

        # filter the intersection ID
        intersectionID = json.loads(r.text)
        intersectionID = intersectionID[0]
        intersectionID = intersectionID['intersectionID']
        
        r.raise_for_status()
        status = 1
    except requests.HTTPError as err:
        print(err)
        status = 0
    except requests.Timeout as err:
        print(err)
        status = 0
    except requests.ConnectionError as err:
        print(err)
        status = 0
    finally:
        return status, intersectionID

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
    serverName = 'http://localhost:3000/api/node/admin' 
    args = {"nodeId":id}
    
    try:
        # Send the request
        r = requests.patch(serverName, json=nodeData, params=args)
        #newNodeData = json.loads(r.text)
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
#   Delete a node from the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code and dictionary object.
def deleteNode(id: string):
    args = {"nodeId" : id}
    
    try:
        r = requests.delete('http://localhost:3000/api/node/admin', params=args)
        r.raise_for_status()
        status = 1
    except requests.HTTPError as err:
        print(err)
        status = 0
    except requests.Timeout as err:
        print(err)
        status = 0
    except requests.ConnectionError as err:
        print(err)
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
def postNewLight(id: int = 0, state: string = "0", phase: int = 0):
    nodeData = {"node_id" : id, "light_phase" : phase, "state" : state}
    light_data = None
    serverName = 'http://localhost:3000/api/node/light' 

    try:
        # Send the request
        r = requests.post(serverName, json=nodeData)
        light_data = json.loads(r.text)
        r.raise_for_status()
        status = 1
    except requests.HTTPError as err:
        print(err)
        status = 0
    except requests.Timeout as err:
        print(err)
        status = 0
    except requests.ConnectionError as err:
        print(err)
        status = 0
    finally:
        return status, light_data

# Purpose: 
#   Patch a light on the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code.
def patchLight(id: string = '0', light_id: string = '0', state: string = '0'):
    
    status, lights = getLights(id)

    # Check to see if the light GET request was successful.
    if not status:
        return status

    # Modify a light with new state
    tempLight = None
    for light in lights:
        if light["nodeID"] == id:
            if light["lightID"] == light_id:
                light["state"] = state
                tempLight = light
    
    # Check to see if the light data was modifed successfully.
    if tempLight == None:
        print('ERROR: Could not find node based on node ID and light ID.')
        return 0

    # Format data for HTTP Request
    array = [1]
    array[0] = tempLight
    newLights = {"lights" : array}
    args ={"node_id":id}

    try:
        # Send the request
        r = requests.patch('http://localhost:3000/api/node/setLights', json=newLights, params=args)
        r.raise_for_status()
        status = 1
    except requests.HTTPError as err:
        print(err)
        status = 0
    except requests.Timeout as err:
        print(err)
        status = 0
    except requests.ConnectionError as err:
        print(err)
        status = 0
    finally:
        return status

# Purpose: 
#   Get all the lights from the database.
#
# Error Handling: 
#   An unsuccessfull HTTP return code, request timeout, or connection error
#   will trigger an exception.
#
# Return: 
#   A staus code. 1 means success. 0 means error.
def getLights(id):
    args = {"nodeId" : id}
    lightData = None
    status = 0
    
    try:
        r = requests.get('http://localhost:3000/api/node/light', params=args)
        r.raise_for_status()
        lightData = json.loads(r.text)
        status = 1
    except requests.HTTPError as err:
        print(err)
        status = 0
    except requests.Timeout as err:
        print(err)
        status = 0
    except requests.ConnectionError as err:
        print(err)
        status = 0
    finally:
        return status, lightData