import client as cl
import json

# TEST 1: Post A new node in the server.
status, data = cl.postNewNode("EASTBOUND Watt and EL Camino", "193.4.31.2", 1)

#
if status: 
    data = data[0]
    with open("node_data.json", "w") as outfile:
        json.dump(data, outfile)

# TEST 2: Patch the node that was just created by modifying the location.
with open('node_data.json', 'r') as openfile:
    # Reading from json file
    data = json.load(openfile)

status, newData = cl.patchNode(data["id"], "WESTBOUND Watt and EL Camino", data["ipaddress"], data["isalive"])

if status:
    with open("node_data.json", "w") as outfile:
        json.dump(newData[0], outfile)