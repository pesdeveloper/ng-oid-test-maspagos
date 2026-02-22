Clear-Host
$env:NODE_NO_WARNINGS="1"
Write-Host "REFRESH LIBS"
npm uninstall mma-sso-session-guard
npm install S:\Source\NET\tokenserver.angular\ng-libs-local\mma-sso-session-guard-1.0.0.tgz
Write-Host "SERVE"
ng serve --host=127.0.0.1 --ssl --port 4203