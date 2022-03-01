import client as cl
import json

# TEST 3: Delete a node from the database.
with open('node_data.json', 'r') as openfile:
    # Reading from json file
    data = json.load(openfile)

nodeId = data["id"]
cl.deleteNode(nodeId)