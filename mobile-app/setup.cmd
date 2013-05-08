@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

set "PATH=.\.setup\.cmd\;%PATH%"

set "defaultBaseURL=http://oxid.openstack/?cl=cushymoco"
set "baseURL="

goto main

:main
    rem Copy files to their desired place
    xcopy .\.setup\tiapp.xml .\ /F
    xcopy .\.setup\manifest .\ /F

    call:copyConfig

    rem Pause the script because Windows users will likely execute the setup.cmd
    rem directly. Without pause, they would be unable to see the result.
    pause
goto:eof

:copyConfig
    xcopy .\.setup\app\config.json .\app\ /F

    rem if config.json was copied, ask for base URL
    if ErrorLevel 0 (
        rem Get tht base URL the app should use (this will be inserted into 'app/config.json')
        set /p baseURL="Please enter base URL [%defaultBaseURL%]: "

        rem Use a default value if no base URL was entered
        if "!baseURL!"=="" ( set "baseURL=%defaultBaseURL%" )

        echo Setting base URL to '!baseURL!' in app/config.json
        BatchSubstitude "#{baseURL}" "!baseURL!" .\app\config.json > .\.setup\.tmp\config.json
        move /Y .\.setup\.tmp\config.json .\app\ >nul
    )
goto:eof
