@echo off
echo ========================================
echo Tree Lives Matter - Dependency Installer
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script requires administrator privileges to install software.
    echo Please right-click and "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Checking system requirements...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo Python not found. Installing Python...
    echo.
    
    REM Download Python installer
    echo Downloading Python 3.11...
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile 'python_installer.exe'"
    
    if exist python_installer.exe (
        echo Installing Python... This may take a few minutes.
        python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
        
        REM Wait for installation to complete
        timeout /t 10 /nobreak >nul
        
        REM Clean up installer
        del python_installer.exe
        
        echo Python installation completed.
        echo.
    ) else (
        echo Failed to download Python installer.
        echo Please manually install Python from https://www.python.org/downloads/
        echo.
        pause
        exit /b 1
    )
) else (
    echo ✓ Python is already installed
    python --version
    echo.
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo Node.js not found. Installing Node.js...
    echo.
    
    REM Download Node.js installer
    echo Downloading Node.js LTS...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi' -OutFile 'nodejs_installer.msi'"
    
    if exist nodejs_installer.msi (
        echo Installing Node.js... This may take a few minutes.
        msiexec /i nodejs_installer.msi /quiet /norestart
        
        REM Wait for installation to complete
        timeout /t 15 /nobreak >nul
        
        REM Clean up installer
        del nodejs_installer.msi
        
        echo Node.js installation completed.
        echo.
    ) else (
        echo Failed to download Node.js installer.
        echo Please manually install Node.js from https://nodejs.org/
        echo.
        pause
        exit /b 1
    )
) else (
    echo ✓ Node.js is already installed
    node --version
    npm --version
    echo.
)

REM Refresh environment variables
echo Refreshing environment variables...
call refreshenv >nul 2>&1

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo All prerequisites are now installed:
echo - Python (for Flask backend)
echo - Node.js & npm (for React frontend)
echo.
echo Next steps:
echo 1. Close this window
echo 2. Open a new Command Prompt or PowerShell window
echo 3. Navigate to the project folder
echo 4. Run: start.bat
echo.
echo The start.bat script will handle the rest of the setup automatically.
echo.
pause