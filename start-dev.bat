@echo off
setlocal

set "ROOT=%~dp0"

where pwsh >nul 2>&1
if %errorlevel%==0 (
    set "PS_CMD=pwsh"
) else (
    set "PS_CMD=powershell"
)

where wt >nul 2>&1
if %errorlevel%==0 (
    echo Abrindo em abas do Windows Terminal usando %PS_CMD%...
    wt -w 0 new-tab --title "Lunaris Client" -d "%ROOT%client" %PS_CMD% -NoLogo -NoExit -Command "& { npm run dev -- --host }" ^; new-tab --title "Lunaris Server" -d "%ROOT%server" %PS_CMD% -NoLogo -NoExit -Command "& { node --watch server.js }"
    echo Client e Server iniciados em abas.
) else (
    echo Windows Terminal nao encontrado. Abrindo em janelas separadas com %PS_CMD%...
    start "Lunaris Client" %PS_CMD% -NoLogo -NoExit -Command "& { Set-Location -LiteralPath '%ROOT%client'; npm run dev -- --host }"
    start "Lunaris Server" %PS_CMD% -NoLogo -NoExit -Command "& { Set-Location -LiteralPath '%ROOT%server'; node --watch server.js }"
    echo Client e Server iniciados em janelas separadas.
)
