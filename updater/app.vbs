Dim objShell, objFSO, installFolder, listURL, http, line, archive

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Выбор папки установки
installFolder = InputBox("Введите путь к папке установки (или создайте новую):")

If Not objFSO.FolderExists(installFolder) Then
    objFSO.CreateFolder(installFolder)
End If

' URL к файлу со списком архивов
listURL = "https://la2.wildmoney.pro/updater/list.txt"

' Скачивание файла со списком архивов
Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
http.Open "GET", listURL, False
http.Send

If http.Status = 200 Then
    Set file = objFSO.CreateTextFile(installFolder & "\list.txt", True)
    file.Write http.responseText
    file.Close
Else
    WScript.Echo "Не удалось загрузить файл со списком архивов."
    WScript.Quit
End If

' Скачивание и разархивирование каждого архива
Set file = objFSO.OpenTextFile(installFolder & "\list.txt", 1)

Do While Not file.AtEndOfStream
    line = file.ReadLine
    If line <> "" Then
        archive = objFSO.GetFileName(line)
        WScript.Echo "Скачивание " & line
        http.Open "GET", line, False
        http.Send
        If http.Status = 200 Then
            Set outFile = objFSO.CreateTextFile(installFolder & "\" & archive, True)
            outFile.Write http.responseBody
            outFile.Close
            WScript.Echo "Разархивирование " & archive
            Set shell = CreateObject("Shell.Application")
            shell.Namespace(installFolder).CopyHere shell.Namespace(installFolder & "\" & archive).Items
            objFSO.DeleteFile(installFolder & "\" & archive)
        End If
    End If
Loop

file.Close

' Запуск La2.exe
objShell.Run installFolder & "\La2.exe"
