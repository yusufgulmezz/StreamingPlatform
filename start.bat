@echo off
echo ==============================================
echo 🚀 Streaming Platform Baslatiliyor...
echo ==============================================

echo [1/2] Spring Boot Backend baslatiliyor...
start cmd /k ".\mvnw.cmd spring-boot:run"

echo [2/2] React/Vite Frontend baslatiliyor...
start cmd /k "cd frontend && npm run dev"

echo.
echo Islem tamam!
echo - Backend: http://localhost:8080 adresinde calisacak.
echo - Frontend: http://localhost:5173 adresinde calisacak.
echo Eger iki terminal penceresi acildiysa sorunsuzca calismaya baslamislardir.
