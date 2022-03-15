# Traffic Light Identification and Classification
# Author: Alec Resha

# Dataset available at
# https://www.kaggle.com/mbornoe/lisa-traffic-light-dataset/metadata extract archive to /dataset/

import os

import pandas as pd
import yaml
from PIL import Image


def encode_annotation(annotation):
    """
    Encode annotation to integer based on location in dataset.yaml names list
    :param annotation: String of annotation tag
    :return encoded_annotation: Encoded annotation in integer form
    """
    with open('./dataset.yaml', 'r') as yaml_f:  # Read the dataset.yaml file for mappings
        annotation_list = yaml.safe_load(yaml_f)['names']
        if annotation in annotation_list:
            return annotation_list.index(annotation)
        else:
            print('Annotation not found in dataset.yaml')
            return None  # Return None if annotation not found


def convert_annotations(img_filepath, xmin, xmax, ymin, ymax, annotation):
    """
    Convert annotations from xy coordinates to coordinates relative to image size for use in yolo
    :param img_filepath: Path to image
    :param xmin: Upper left corner X
    :param xmax: Lower right corner X
    :param ymin: Upper left corner Y
    :param ymax: Lower right corner Y
    :param annotation: Annotation tag
    :return: Width, Height, Center X, Center Y, Encoded annotation
    """
    annotation = encode_annotation(annotation)  # Encode annotation to integer
    width, height = Image.open(img_filepath).size  # Get image dimensions
    annotation_width = (xmax - xmin) / width  # Calculate annotation width
    annotation_height = (ymax - ymin) / height  # Calculate annotation height
    center_x = ((xmax + xmin) / 2) / width  # Calculate annotation center x
    center_y = ((ymax + ymin) / 2) / height  # Calculate annotation center y
    return annotation_width, annotation_height, center_x, center_y, annotation


def create_annotations(csv_filepath, annotations_output_dir):
    """
    Create annotations for a single csv file
    :param csv_filepath: path to csv file
    :param annotations_output_dir: output directory
    :return: 1 if successful, 0 if not
    """
    df = pd.read_csv(csv_filepath, sep=';')
    df_grouped = df.groupby('Filename')  # Group by filename
    for group_name, df_group in df_grouped:  # Iterate through groups
        file_name = group_name.split('/')[-1]  # Get file name
        # initialize output lists
        width, height, center_x_coord, center_y_coord, annotations = list(), list(), list(), list(), list()
        for row_index, row in df_group.iterrows():  # iterate rows of each group
            xmin = row['Upper left corner X']
            xmax = row['Lower right corner X']
            ymax = row['Upper left corner Y']
            ymin = row['Lower right corner Y']
            annotation = row['Annotation tag']

            if group_name.contains('Train'):
                if group_name.contains('day'):
                    img_filepath = './dataset/dayTrain/dayTrain/' + \
                                   group_name.split('/')[-1].split('-')[0] + '/frames/' + file_name
                else:
                    img_filepath = './dataset/nightTrain/nightTrain/' + \
                                   group_name.split('/')[-1].split('-')[0] + '/frames/' + file_name
            elif group_name.contains('Test'):
                # TODO - finish test annotation image finding
            else: # If not in train or test, skip
                break

            annotation_width, annotation_height, center_x, center_y, annotation_encoded = convert_annotations(
                img_filepath=img_filepath,
                xmin=xmin,
                xmax=xmax,
                ymin=ymin,
                ymax=ymax,
                annotation=annotation
            )
            width.append(annotation_width)  # Append width
            height.append(annotation_height)  # Append height
            center_x_coord.append(center_x)  # Append center point x
            center_y_coord.append(center_y)  # Append center point y
            annotations.append(annotation_encoded)  # Append encoded annotation
        with open((annotations_output_dir + '/' + file_name.replace('jpg', 'txt')), 'a') as output_file:
            output_file.truncate(0)  # Clear file
            for row in range(len(width)):  # Loop all values for each file
                output_file.write(
                    str(annotations[row]) + ' ' +
                    str(center_x_coord[row]) + ' ' +
                    str(center_y_coord[row]) + ' ' +
                    str(width[row]) + ' ' +
                    str(height[row]) + '\n'
                )
        # TODO copy image to output directory



# Clone yolov5 repo (if not already downloaded here)
if os.path.exists('./yolov5'):
    print('yolov5 repo already exists')
else:
    os.system("git clone https://github.com/ultralytics/yolov5")

# Create label mapping file for reference
print("Generating label mapping file")
with open('./label_map.txt', 'w') as f:
    f.truncate()
    for x in ['go', 'goLeft', 'stop', 'stopLeft', 'warning', 'warningLeft']:
        f.write(x.ljust(15) + str(encode_annotation(x)) + '\n')
print("Label mapping file generated")

# Process training data
overall_path = ['./dataset/Annotations/Annotations/dayTrain', './dataset/Annotations/Annotations/nightTrain']
for train_path in overall_path:
    train_clips = os.listdir(train_path)
    for clip in train_clips:
        if not clip.startswith('.'):
            print("Generating annotations for clip: " + clip)
            filepath = os.path.join(train_path, clip, 'frameAnnotationsBOX.csv')
            output_dir = './yolo_data/train'
            create_annotations(
                csv_filepath=filepath,
                annotations_output_dir=output_dir)
            print("Annotations Generated.")
