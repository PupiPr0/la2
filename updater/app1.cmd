@echo off
setlocal enabledelayedexpansion

:: Выбор папки установки
set /p install_folder="Введите путь к папке установки (или создайте новую): "

:: Проверка, существует ли папка
if not exist "!install_folder!" (
    mkdir "!install_folder!"
)

:: URL к файлу со списком архивов
set list_url=https://la2.wildmoney.pro/updater/list.txt

:: Скачивание файла со списком архивов
curl -L -o "!install_folder!\list.txt" "!list_url!"

:: Скачивание и разархивирование каждого архива
for /f "delims=" %%i in (!install_folder!\list.txt) do (
    set "url=%%i"
    if not "!url!"=="" (
        echo Скачивание !url!...
        curl -L -o "!install_folder!\%%~nxi" "!url!"
        
        echo Разархивирование %%~nxi...
        powershell -command "Expand-Archive -Path '!install_folder!\%%~nxi' -DestinationPath '!install_folder!' -Force"
        
        :: Удаление архива после разархивирования
        del "!install_folder!\%%~nxi"
    )
)

:: Запуск La2.exe
start "" "!install_folder!\La2.exe"
