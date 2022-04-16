import os
import time
import glob
import statistics as stats
import natsort
import numpy as np

import client as cl

def assign_lights(folder_name):
    lights = []
    light_calc = []
    num_lights = -1
    file_names = sorted(glob.glob('yolov5/runs/detect/' + folder_name + '/labels/*.txt'), key=os.path.getctime)[0:10]
    for file_name in file_names: # File by file
        with open(file_name, 'r') as f: # Open file
            lines = f.readlines() # Read lines
            if num_lights == -1: # Assign number of lights based on first image
                num_lights = len(lines)
                counter = 0
                for line in lines:
                    line_split = line.split(' ') # Split line on spaces
                    light_calc.append([counter, [float(line_split[1])], [float(line_split[2])]])
                    counter += 1
            else:
                for line in lines:
                    line_split = line.split(' ') # Split line on spaces
                    appended = False
                    for x in light_calc: # Find correct light
                        # If new x matches old
                        if (abs(float(line_split[1]) - sum(x[1])/len(x[1])) < 0.06):
                            # if new Y matches old
                            if (abs(float(line_split[2]) - sum(x[2])/len(x[2])) < 0.06):
                                x[1].append(float(line_split[1]))
                                x[2].append(float(line_split[2]))
                                appended = True
                                break # Stop after appending light
                            # If new Y doesn't match old
                            elif float(line_split[2]) - sum(x[2])/len(x[2]) < 0:
                                x[1] = [float(line_split[1])]
                                x[2] = [float(line_split[2])]
                                appended = True
                                print("Light ", x[0], " replaced")
                                break # Stop after appending light
                            else: # To catch issues after replacing a light
                                appended = True
                                break
                    if appended == False: # If light not found, add a new light
                        print('New light found!')
                        light_calc.append([len(light_calc), [float(line_split[1])], [float(line_split[2])]])

    for x in light_calc:
        lights.append([x[0], 
                       np.mean(x[1]), 
                       np.mean(x[2]),
                       len(x[1])])
    print(lights)
    return lights


folder_name = natsort.natsorted(os.listdir('yolov5/runs/detect/'))[-1]
lights = assign_lights(folder_name)

if not os.exists("node_data.json"):
    cl.init_node("State University Ave", "000.000.0.0")

if not os.exists("lights.json"):
    for x in lights:
        cl.create_light(0, 0)

current_state = [] # keeps track of current state

#specifically for use with a single videofeed of an intersection
while True:
    file_name = max(glob.glob('yolov5/runs/detect/' + folder_name + '/labels/*.txt'), key=os.path.getctime)
    with open(file_name, 'r') as f:
        lines = f.readlines()
        temp = []
        for light in lights: #  Checking each light
            appended = False # Keeps track of if light is found yet
            for line in lines:
                if(appended == False):
                    split_line = line.split(' ') # Split data line so it can be indexed by spaces
                    if (float(split_line[1]) <= light[1] + (0.025)  # Check if each line is within 30 pixels of each light
                        and float(split_line[1]) >= light[1] - (0.025) 
                        and float(split_line[2]) <= light[2] + (0.025)
                        and float(split_line[2]) >= light[2] - (0.025)):
                        temp.append([light[0], line[0]]) # Temp stores the current state of each light
                        appended = True
            if not appended:
                temp.append([light[0], '0'])
                
        
        if not (temp == current_state):
            current_state = temp
            print(temp)
            for x in temp:
                cl.patch_light(str(x[0]), str(x[1]))