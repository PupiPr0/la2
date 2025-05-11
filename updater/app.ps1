# Выбор папки установки
$installFolder = Read-Host "Введите путь к папке установки (или создайте новую)"

# Проверка, существует ли папка
if (-not (Test-Path $installFolder)) {
    New-Item -ItemType Directory -Path $installFolder
}

# URL к файлу со списком архивов
$listUrl = "https://la2.wildmoney.pro/updater/list.txt"

# Скачивание файла со списком архивов
Invoke-WebRequest -Uri $listUrl -OutFile "$installFolder\list.txt"

# Скачивание и разархивирование каждого архива
Get-Content "$installFolder\list.txt" | ForEach-Object {
    $url = $_.Trim()
    if ($url) {
        $archiveName = Split-Path -Leaf $url
        Write-Host "Скачивание $url..."
        Invoke-WebRequest -Uri $url -OutFile "$installFolder\$archiveName"
        
        Write-Host "Разархивирование $archiveName..."
        Expand-Archive -Path "$installFolder\$archiveName" -DestinationPath $installFolder -Force
        
        # Удаление архива после разархивирования
        Remove-Item "$installFolder\$archiveName"
    }
}

# Запуск La2.exe
$executablePath = Join-Path -Path $installFolder -ChildPath "La2.exe"
if (Test-Path $executablePath) {
    Start-Process -FilePath $executablePath
} else {
    Write-Host "Файл La2.exe не найден в папке установки."
}
