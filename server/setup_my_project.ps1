try {
    choco --version
    write-host "`Found Chocolatey: " -fore yellow
}
catch {
    write-host "`Installing Chocolatey: " -fore yellow
    Invoke-WebRequest https://chocolatey.org/install.ps1 -UseBasicParsing | Invoke-Expression
    if ($env:Path -split ';' -notcontains $env:ALLUSERSPROFILE + "\chocolatey\bin") {
        [Environment]::SetEnvironmentVariable("Path", $env:Path + ";%ALLUSERSPROFILE%\chocolatey\bin", "User")
    }
}
 
try {
    python --version
    write-host "`Found Python: " -fore yellow
}
catch {
    write-host "`Installing Python: " -fore yellow
    choco install python --version=3.11.9
    refreshenv
}

 
try {
    poetry --version
    write-host "`Found Poetry: " -fore yellow
}
catch {
    write-host "`Installing Poetry: " -fore yellow
    (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python
    if ($env:Path -split ';' -notcontains $env:APPDATA + "\Python\Scripts") {
        [Environment]::SetEnvironmentVariable("Path", $env:Path + ";%APPDATA%\Python\Scripts", "User")
        powershell.exe -nologo
    }
}

poetry install

.\.venv\Scripts\Activate.ps1