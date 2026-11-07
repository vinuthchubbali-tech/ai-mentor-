@echo off
echo ========================================
echo   Starting CareerCatalyst AI
echo ========================================
echo.
echo Starting Backend on port 8000...
start "CareerCatalyst Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"

echo Starting Frontend on port 5173...
start "CareerCatalyst Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Both servers have been launched in separate windows!
echo - Backend Docs: http://127.0.0.1:8000/docs
echo - Frontend UI:   http://127.0.0.1:5173
echo.
pause
