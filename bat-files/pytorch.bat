set original_dir="C:\Users\ludas"
set venv_root_dir="C:\Users\ludas\yolov7env"
set test_dir="C:\Users\ludas\yolov7env\Scripts\yolov7"

cd %venv_root_dir%

call %venv_root_dir%\Scripts\activate.bat

cd %test_dir%

python detect.py --weights best.pt --conf 0.5 --img-size 640 --source ./inference/images

call %venv_root_dir%\Scripts\deactivate.bat

cd %original_dir%

exit /B 1