try {
    choco --version
}
catch {
    write-host "`nInstalling chocolatey" -fore yellow
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

try {
    cd ./server
    uv --version
    write-host "`Found uv: " -fore yellow
    uv venv
}
catch {
    write-host "`Installing uv: " -fore yellow
    winget install --id=astral-sh.uv  -e
    refreshenv
    uv venv
}

uv sync

try {
    cd ../client
    yarn --version
    write-host "`Found yarn: " -fore yellow
}
catch {
    write-host "`Installing npm: " -fore yellow
    choco install nodejs -yr
    choco install yarn -yr
    refreshenv
}

yarn install