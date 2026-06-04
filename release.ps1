Set-Location android
.\gradlew.bat installRelease
Set-Location ..
adb shell am start -n com.coffer/.MainActivity
