# Traffic Light Identification and Classification
# Author: Alec Resha

# Dataset available at
# https://www.kaggle.com/mbornoe/lisa-traffic-light-dataset/metadata extract archive to /dataset/

import os
import shutil

import pandas as pd
import yaml
from PIL import Image


def setup():
    # If dataset is not downloaded into correct directory, stop
    if not os.path.exists('./dataset'):
        print('dataset directory does not exist')
        print('please download dataset and extract into ./dataset')
        print('https://www.kaggle.com/mbornoe/lisa-traffic-light-dataset/metadata')
        exit()

    # Clone yolov5 repo (if not already downloaded here)
    if os.path.exists('./yolov5'):
        print('yolov5 repo already exists')
    else:
        os.system("git clone https://github.com/ultralytics/yolov5")
    if not os.path.exists('./yolov5'):
        print('yolov5 repo not downloaded correctly.')
        exit()

    # Setup directories
    if not os.path.exists('./yolo_data'):
        os.mkdir('./yolo_data')
        print('yolo_data directory created')
    if not os.path.exists('./yolo_data/train'):
        os.mkdir('./yolo_data/train')
        print('yolo_data/train directory created')
    if not os.path.exists('./yolo_data/test'):
        os.mkdir('./yolo_data/test')
        print('yolo_data/test directory created')
    if not os.path.exists('./yolo_data/val'):
        os.mkdir('./yolo_data/val')
        print('yolo_data/val directory created')

    # Create label mapping file for reference
    print("Generating label mapping file")
    with open('./label_map.csv', 'w') as f:
        f.truncate()
        with open('./dataset.yaml', 'r') as yaml_f:  # Read the dataset.yaml file for mappings
            annotation_list = yaml.safe_load(yaml_f)['names']
            for x in annotation_list:
                f.write(str(encode_annotation(x)) + ',' + x + '\n')
    print("Label mapping file generated")
    print("Setup complete\n")


def encode_annotation(annotation):
    """
    Encode annotation to integer based on location in dataset.yaml names list
    :param annotation: String of annotation tag
    :return encoded_annotation: Encoded annotation in integer form
    """
    rename_dict = {'go': 'Green',
                   'goLeft': 'Green',
                   'goForward': 'Green',
                   'goRight': 'Green',
                   'stop': 'Red',
                   'stopLeft': 'Red',
                   'stopForward': 'Red',
                   'stopRight': 'Red',
                   'warning': 'Yellow',
                   'warningLeft': 'Yellow',
                   'warningForward': 'Yellow',
                   'warningRight': 'Yellow'
                   }
    if annotation in rename_dict:
        annotation = rename_dict[annotation]

    with open('./dataset.yaml', 'r') as yaml_f:  # Read the dataset.yaml file for mappings
        annotation_list = yaml.safe_load(yaml_f)['names']
        if annotation in annotation_list:
            return annotation_list.index(annotation)
        else:
            print('Annotation not found in dataset.yaml: {}'.format(annotation))
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
    center_y = (((ymax + ymin) / 2) / height)  # Calculate annotation center y. Invert y because yolo y0 is on top
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
            ymin = row['Upper left corner Y']  # Note: ymin and ymax are reversed in the dataset
            ymax = row['Lower right corner Y']  # Note: ymin and ymax are reversed in the dataset
            annotation = row['Annotation tag']

            if 'Train' in group_name:
                if 'day' in group_name:
                    img_filepath = './dataset/dayTrain/dayTrain/' + \
                                   group_name.split('/')[-1].split('-')[0] + '/frames/' + file_name
                else:
                    img_filepath = './dataset/nightTrain/nightTrain/' + \
                                   group_name.split('/')[-1].split('-')[0] + '/frames/' + file_name
            elif 'Test' in group_name:
                img_filepath = './dataset/' + group_name.split('/')[-1].split('-')[0] + \
                               '/' + group_name.split('/')[-1].split('-')[0] + \
                               '/frames/' + file_name
            else:  # If not in train or test, skip
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
        shutil.copyfile(img_filepath, annotations_output_dir + '/' + file_name)  # Copy image to output directory


setup()
# Process training data
overall_path = ['./dataset/annotations/annotations/daytrain', './dataset/annotations/annotations/nighttrain']
for train_path in overall_path:
    train_clips = os.listdir(train_path)
    for clip in train_clips:
        if not clip.startswith('.'):
            print("generating annotations for clip: " + clip)
            filepath = os.path.join(train_path, clip, 'frameannotationsbox.csv')
            output_dir = './yolo_data/train'
            create_annotations(
                csv_filepath=filepath,
                annotations_output_dir=output_dir)
            print(clip + " annotations generated.")

# Generate test data
overall_path = ['./dataset/Annotations/Annotations/daySequence2', './dataset/Annotations/Annotations/nightSequence2']
for test_path in overall_path:
    print("generating annotations for clip: " + test_path)
    filepath = os.path.join(test_path, 'frameannotationsbox.csv')
    output_dir = './yolo_data/test'
    create_annotations(
        csv_filepath=filepath,
        annotations_output_dir=output_dir)
    print(test_path + " annotations generated.")

# Generate test data
overall_path = ['./dataset/Annotations/Annotations/daySequence1', './dataset/Annotations/Annotations/nightSequence1']
for val_path in overall_path:
    print("generating annotations for clip: " + val_path)
    filepath = os.path.join(val_path, 'frameannotationsbox.csv')
    output_dir = './yolo_data/val'
    create_annotations(
        csv_filepath=filepath,
        annotations_output_dir=output_dir)
    print(val_path + " annotations generated.")
