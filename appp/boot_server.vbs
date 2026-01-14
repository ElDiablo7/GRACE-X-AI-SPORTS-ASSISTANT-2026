Set oShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
base = fso.GetAbsolutePathName(".")
cmd = "cmd /c """ & base & "\start_server.bat 3002"""
' 0 = hidden, False = don't wait
oShell.Run cmd, 0, False
