Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location "C:\Workspace\FTApp\FinanceTracker"; npm start'

Start-Sleep -Seconds 3
adb reverse tcp:8081 tcp:8081

Set-Location android
.\gradlew.bat app:installDebug
Set-Location ..

adb shell am start -n com.financetracker/.MainActivity
