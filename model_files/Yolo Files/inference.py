import collections
import os
import sys
import time

import cv2
import numpy as np
from IPython import display
from openvino.runtime import Core

sys.path.append("./openvino_notebooks/notebooks/utils")
import notebook_utils as utils

ie_core = Core()
model = ie_core.read_model(model="./best.xml", weights="./best.bin")
compiled_model = ie_core.compile_model(model=model, device_name="AUTO")

input_layer = next(iter(compiled_model.inputs))
output_layer = next(iter(compiled_model.outputs))

height, width = list(input_layer.shape)[1:3]

classes = \
    ['go', 'goLeft', 'stop', 'stopLeft', 'warning', 'warningLeft']

# colors for above classes (Rainbow Color Map)
colors = cv2.applyColorMap(
    src=np.arange(0, 255, 255 / len(classes), dtype=np.float32).astype(np.uint8),
    colormap=cv2.COLORMAP_RAINBOW
).squeeze()


def process_results(frame, results, thresh=0.6):
    # size of the original frame
    h, w = frame.shape[:2]
    # results is a tensor [1, 1, 100, 7]
    results = results.squeeze()
    boxes = []
    labels = []
    scores = []
    for _, label, score, xmin, ymin, xmax, ymax in results:
        # create a box with pixels coordinates from the box with normalized coordinates [0,1]
        boxes.append(tuple(map(int, (xmin * w, ymin * h, xmax * w, ymax * h))))
        labels.append(int(label))
        scores.append(float(score))

    # apply non-maximum suppression to get rid of many overlapping entities
    # see https://paperswithcode.com/method/non-maximum-suppression
    # this algorithm returns indices of objects to keep
    indices = cv2.dnn.NMSBoxes(bboxes=boxes, scores=scores, score_threshold=thresh, nms_threshold=0.6)

    # if there are no boxes
    if len(indices) == 0:
        return []

    # filter detected objects
    return [(labels[idx], scores[idx], boxes[idx]) for idx in indices.flatten()]


def draw_boxes(frame, boxes):
    for label, score, box in boxes:
        # choose color for the label
        color = tuple(map(int, colors[label]))
        # draw box
        cv2.rectangle(img=frame, pt1=box[:2], pt2=box[2:], color=color, thickness=3)
        # draw label name inside the box
        cv2.putText(img=frame, text=f"{classes[label]} {score:.2f}", org=(box[0] + 10, box[1] + 30),
                    fontFace=cv2.FONT_HERSHEY_COMPLEX, fontScale=frame.shape[1] / 1000, color=color,
                    thickness=1, lineType=cv2.LINE_AA)

    return frame


# main processing function to run object detection
def run_object_detection(source=0, flip=False, use_popup=False, skip_first_frames=0):
    player = None
    try:
        # create video player to play with target fps
        player = utils.VideoPlayer(source=source, flip=flip, fps=30, skip_first_frames=skip_first_frames)
        # start capturing
        player.start()
        if use_popup:
            title = "Press ESC to Exit"
            cv2.namedWindow(winname=title, flags=cv2.WINDOW_GUI_NORMAL | cv2.WINDOW_AUTOSIZE)

        processing_times = collections.deque()
        request = compiled_model.create_infer_request()
        while True:
            # grab the frame
            frame = player.next()
            if frame is None:
                print("Source ended")
                break
            # if frame larger than full HD, reduce size to improve the performance
            scale = 1280 / max(frame.shape)
            if scale < 1:
                frame = cv2.resize(src=frame, dsize=None, fx=scale, fy=scale,
                                   interpolation=cv2.INTER_AREA)

            # resize image and change dims to fit neural network input
            input_img = cv2.resize(src=frame, dsize=(width, height), interpolation=cv2.INTER_AREA)
            # create batch of images (size = 1)
            input_img = input_img[np.newaxis, ...]

            # measure processing time

            start_time = time.time()
            # get results
            request.infer(inputs={input_layer.any_name: input_img})
            results = request.get_output_tensor(output_layer.index).data
            stop_time = time.time()
            # get poses from network results
            boxes = process_results(frame=frame, results=results)

            # draw boxes on a frame
            frame = draw_boxes(frame=frame, boxes=boxes)

            processing_times.append(stop_time - start_time)
            # use processing times from last 200 frames
            if len(processing_times) > 200:
                processing_times.popleft()

            _, f_width = frame.shape[:2]
            # mean processing time [ms]
            processing_time = np.mean(processing_times) * 1000
            fps = 1000 / processing_time
            cv2.putText(img=frame, text=f"Inference time: {processing_time:.1f}ms ({fps:.1f} FPS)", org=(20, 40),
                        fontFace=cv2.FONT_HERSHEY_COMPLEX, fontScale=f_width / 1000,
                        color=(0, 0, 255), thickness=1, lineType=cv2.LINE_AA)

            # use this workaround if there is flickering
            if use_popup:
                cv2.imshow(winname=title, mat=frame)
                key = cv2.waitKey(1)
                # escape = 27
                if key == 27:
                    break
            else:
                # encode numpy array to jpg
                _, encoded_img = cv2.imencode(ext=".jpg", img=frame,
                                              params=[cv2.IMWRITE_JPEG_QUALITY, 100])
                # create IPython image
                i = display.Image(data=encoded_img)
                # display the image in this notebook
                display.clear_output(wait=True)
                display.display(i)
    # ctrl-c
    except KeyboardInterrupt:
        print("Interrupted")
    # any different error
    except RuntimeError as e:
        print(e)
    finally:
        if player is not None:
            # stop capturing
            player.stop()
        if use_popup:
            cv2.destroyAllWindows()


video_file = "./test_data/EASTBOUND_1 - Made with Clipchamp_1648526183486.mp4"
run_object_detection(source=video_file, flip=False, use_popup=False)
