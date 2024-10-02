try {
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

.\.venv\Scripts\Activate.ps1