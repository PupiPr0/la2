import os
import requests
import zipfile
import tkinter as tk
from tkinter import messagebox, filedialog

def download_and_install(install_folder, list_url):
    # Получение списка архивов
    response = requests.get(list_url)
    if response.status_code != 200:
        messagebox.showerror("Ошибка", "Не удалось загрузить файл со списком архивов.")
        return

    # Разделение списка на отдельные ссылки
    archives = response.text.splitlines()

    # Скачивание и разархивирование каждого архива
    for url in archives:
        if url.strip():  # Проверка на пустую строку
            try:
                # Скачивание архива
                archive_response = requests.get(url)
                archive_name = os.path.basename(url)
                archive_path = os.path.join(install_folder, archive_name)

                with open(archive_path, 'wb') as f:
                    f.write(archive_response.content)

                # Разархивирование
                with zipfile.ZipFile(archive_path, 'r') as z:
                    z.extractall(install_folder)

                # Удаление архива после разархивирования
                os.remove(archive_path)

            except Exception as e:
                messagebox.showerror("Ошибка", f"Не удалось скачать или разархивировать {url}.\nОшибка: {str(e)}")
                return

    # Запуск La2.exe
    executable_path = os.path.join(install_folder, "La2.exe")
    if os.path.exists(executable_path):
        os.startfile(executable_path)
    else:
        messagebox.showerror("Ошибка", "Файл La2.exe не найден в папке установки.")

def on_install():
    install_folder = filedialog.askdirectory(title="Выберите папку установки игры")
    if install_folder:
        list_url = "https://la2.wildmoney.pro/updater/list.txt"  # URL к файлу со списком архивов
        messagebox.showinfo("Установка", "Начинается установка игры...")
        download_and_install(install_folder, list_url)
        messagebox.showinfo("Установка", "Игра успешно установлена!")

# Создание графического интерфейса
root = tk.Tk()
root.title("Установщик игры")
root.geometry("300x150")

# Приветственное сообщение
welcome_label = tk.Label(root, text="Добро пожаловать в установщик игры!\nНажмите 'Установить', чтобы начать.")
welcome_label.pack(pady=20)

# Кнопка установки
install_button = tk.Button(root, text="Установить", command=on_install)
install_button.pack(pady=10)

# Запуск главного цикла
root.mainloop()
