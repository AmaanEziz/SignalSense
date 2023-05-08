set original_dir="C:\Users\Liana Coyle"
set venv_root_dir="C:\Users\Liana Coyle\openvino_env"
set test_dir="C:\Users\Liana Coyle\openvino_env"

cd %venv_root_dir%

call %venv_root_dir%\Scripts\activate.bat

cd ..

cd %test_dir%

python detect-ir.py

cd ..

call %venv_root_dir%\Scripts\deactivate.bat

cd %original_dir%

exit /B 1