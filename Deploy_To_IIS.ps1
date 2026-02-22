# (Configuración inicial igual)

# --- CONFIGURAR ESTAS 2 RUTAS ---
$ProjectRoot = "S:\Source\NET\tokenserver.angular\ng-oid-test-maspagos"
$Destination = "\\WS2019APP\inetpub\ANGULAR_APPS\test-spa.malvinasargentinas.gob.ar"
# --------------------------------

$ErrorActionPreference = "Stop"

Set-Location $ProjectRoot

# 1) Limpiar dist para evitar el error EPERM de archivos bloqueados
if (Test-Path "dist") {
    Write-Host "Limpiando compilaciones previas..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
}

# 2) Dependencias
npm ci

# 3) Build aplicación producción
Write-Host "Compilando aplicación principal..." -ForegroundColor Yellow
ng build --configuration=production --base-href /

# 4) Detectar carpeta de salida de la APP
# Con @angular/build:application, el path suele ser dist/mp-angular/browser
$distApp = Join-Path $ProjectRoot "dist\mp-angular\browser"
if (-not (Test-Path $distApp)) {
    # Fallback por si la estructura es diferente
    $distApp = (Get-ChildItem -Path (Join-Path $ProjectRoot "dist") -Recurse -Filter "index.html" | Select-Object -First 1).Directory.FullName
}

if (-not $distApp) { throw "No se encontró el build de la app." }

# 5) Copiar al IIS (Usando Robocopy para mayor estabilidad en red)
Write-Host "Desplegando hacia $Destination..." -ForegroundColor Magenta
robocopy $distApp $Destination /MIR /R:2 /W:2 /NFL /NDL /NP /MT:8

# 6) Copiar web.config
$wc = Join-Path $ProjectRoot "web.config"
if (Test-Path $wc) { Copy-Item $wc $Destination -Force }

Write-Host "Despliegue exitoso." -ForegroundColor Green
