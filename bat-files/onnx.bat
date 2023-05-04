set original_dir="C:\Users\mindy"
set venv_root_dir="C:\Users\mindy\yolov7env"
set test_dir="C:\Users\mindy\yolov7env\Scripts\yolov7"

cd %venv_root_dir%

call %venv_root_dir%\Scripts\activate.bat

cd %test_dir%

python detect-ONNX.py

call %venv_root_dir%\Scripts\deactivate.bat

cd %original_dir%

exit /B 1