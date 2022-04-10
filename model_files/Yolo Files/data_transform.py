import os
import time
import glob
import statistics as stats
import natsort

import client as cl

def assign_lights(folder_name):
    lights = []
    lights_dict = {}
    file_names = sorted(glob.glob('yolov5/runs/detect/' + folder_name + '/labels/*.txt'), key=os.path.getctime)[0:10]
    for file_name in file_names:
        with open(file_name, 'r') as f:
            file_list = []
            lines = f.readlines()
            for line in lines:
                sub_line = line.split(' ')
                entry = ["light"+str(len(file_list)), 
                        label_map[line[0]], 
                        [float(sub_line[1]),
                        float(sub_line[2]),
                        float(sub_line[3]),
                        float(sub_line[4])]]
                file_list.append(entry)
            lights.append(file_list)
    lights_holder = []
    for i in range(len(lights[0])):
        lights_holder.append([str(i), [], []])
        for img in lights:
            lights_holder[i][1].append(img[i][2][0])
            lights_holder[i][2].append(img[i][2][1])
    lights_final = []
    for x in lights_holder:
        lights_final.append([x[0], stats.mean(x[1]), stats.stdev(x[1]), stats.mean(x[2]), stats.stdev(x[2])])
    print(lights_final)
    return(lights_final)

label_map = {
    '0': 'Green',
    '1': 'Green_Left',
    '2': 'Green_Straight',
    '3': 'Red',
    '4': 'Red_Left',
    '5': 'Yellow',
    '6': 'Yellow_Left'
}

folder_name = natsort.natsorted(os.listdir('yolov5/runs/detect/'))[-1]

lights = assign_lights(folder_name)

if not os.exists("node_data.json"):
    cl.init_node("State University Ave", "000.000.0.0")

if not os.exists("lights.json"):
    for x in lights:
        cl.create_light(0, 0)

#specifically for use with a single videofeed of an intersection
while True:
    file_name = max(glob.glob('yolov5/runs/detect/' + folder_name + '/labels/*.txt'), key=os.path.getctime)
    with open(file_name, 'r') as f:
        lines = f.readlines()
        temp = []
        for light in lights: #  Checking each light
            appended = False
            for line in lines:
                split_line = line.split(' ')
                if (float(split_line[1]) <= light[1] + (50*light[2]) 
                    and float(split_line[1]) >= light[1] - (50*light[2]) 
                    and float(split_line[2]) <= light[3] + (50*light[4])
                    and float(split_line[2]) >= light[3] - (50*light[4])):
                    temp.append([light[0], label_map[line[0]]])
                    appended = True
            if not appended:
                temp.append([light[0], 'Error'])
        
        for x in temp: # change light mapping
            if x[1].find('Red') != -1:
                x[1] = '1'
            elif x[1].find('Yellow') != -1:
                x[1] = '2'
            elif x[1].find('Green') != -1:
                x[1] = '3'
            else:
                x[1] = '0'
        for x in temp:
            cl.patch_light(str(x[0]), str(x[1]))