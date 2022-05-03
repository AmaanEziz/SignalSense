import os
import string
import client as cl
import json

# Initialize a new node.
# - If a new node was successfully created, store the 
#   information sent back from the database into a json file.
def init_node(location: string='Street', ip_address: string='0.0.0.0'):
    status, intersection_id = cl.getIntersectionID()

    # check if intersection query was successful
    if status:
        status, data = cl.postNewNode(location, intersection_id, ip_address, 1)

        # Check if new node request was successful
        if status: 
            data = data[0]
            with open("node_data.json", "w") as outfile:
                json.dump(data, outfile)
            return status
        else:
            print("could not create node")
            return status
    else:
        print("could not create node")
        return status

# Delete a Node.
# - If a node is to be deleted, the corresponding node and 
#   lights JSON files should also be deleted. 
# - An error is thrown if a node attempts to delete itself 
#   without initalizing it on the database first.
def delete_node():
    if doesFileExists('./node_data.json'):
        node_id = get_node_id()

        status = cl.deleteNode(node_id)

        if status:
            os.remove('./node_data.json')
            if doesFileExists('./lights.json'):
                os.remove('./lights.json')
            return status
        else:
            return status
    else:
        print('ERROR: Node has not been created yet.')
        return 0

# Create a light in the database.
# - If a new light is to be created, the light 
#   information must be stored in a JSON file. 
# - An error occurs if a node has not yet been 
#   intialized or if there a HTTP request error.
def create_light(state: string='0', phase: int=0):
    node_id = get_node_id()
    
    # Error check if a node has been initialized
    if node_id == 0:
        print('ERROR: Node not yet initialized.')
        return 0
    
    lights = {}

    status, light_data = cl.postNewLight(node_id, state, phase)
    
    # Error check the HTTP request
    if status:
        #if a lights ID file exists, append the new light id
        if doesFileExists('./lights.json'):
            with open('lights.json', 'r') as openfile:
                # Reading from json file
                lights = json.load(openfile)
                number  = str(len(lights))
                light_data = light_data[0]
                lights[number] =  light_data['lightID']       
            
                with open("lights.json", "w") as outfile:
                    json.dump(lights, outfile)
        else: # light id's file does not exist. Create file and add new light id
            light_data = light_data[0]
            lights['0'] = light_data['lightID']
            with open("lights.json", "w") as outfile:
                json.dump(lights, outfile) 
    return status

# Patch a light.
# - To patch a ligth, a light number and 
#   light status is required. 
# - Light status are number 1-9 and are 
#   binded based on the database numbering scheme.
def patch_light(light: string=0, status: string='0'):
    light_id = get_light_id(light)
    node_id=get_node_id()
    status = cl.patchLight(node_id, light_id, status)
    return status

# Retrieve the node ID stored in the node data JSON file. 
def get_node_id():
    if doesFileExists('./node_data.json'):
        with open('node_data.json', 'r') as openfile:
        # Reading from json file
            data = json.load(openfile)
        return data['nodeID']
    else:
        return 0

# Retrieve the intersection ID stored in the node data JSON file.
def get_intersection_id():
    if doesFileExists('./node_data.json'):
        with open('node_data.json', 'r') as openfile:
        # Reading from json file
            data = json.load(openfile)
        return data['intersectionID']
    return 0

# Retrieve the light ID stored in the lights JSON file. 
def get_light_id(light_number: string='0'):
    if doesFileExists('./lights.json'):
        with open('lights.json', 'r') as openfile:
        # Reading from json file
            lights = json.load(openfile)
        return lights[light_number]
    return 0

# Checks if a file exists in the current directory. 
def doesFileExists(filePathAndName):
    return os.path.exists(filePathAndName)

# STEP 1: Initialize a Node.
# status = init_node('NORTHBOUND HW 88 and Macville', '10.0.0.16')

#STEP 2: Add any necessary lights.
# (0, 'NOT_FOUND');
# (1, 'RED');
# (2, 'YELLOW');
# (3, 'GREEN');
# (4, 'LEFT_RED');
# (5, 'LEFT_YELLOW');
# (6, 'LEFT_GREEN');
# (7, 'RIGHT_RED');
# (8, 'RIGHT_YELLOW');
# (9, 'RIGHT_GREEN');
# USE: create_light(light_state, light_phase)
# example: status = create_light('5', 3)

# STEP 3: Patch lights as the ML model is running
# For light status, refer to chart above.
# USE: status = patch_light(light number, light status)
