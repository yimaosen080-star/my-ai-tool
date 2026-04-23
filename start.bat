@echo off

cd /d E:\projects\server
start cmd /k node index.js

cd /d E:\projects\my-app
start cmd /k npm run dev

timeout /t 5

start http://localhost:3000