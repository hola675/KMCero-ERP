# Version del archivo: 1.0.0 | Ultima modificacion: 2026-11-23
# KMCero ERP: preparacion conservadora de dependencias en Windows.
[CmdletBinding()]
param([switch]$Instalar,[switch]$Validar)
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $repo
try {
  foreach ($exe in @('git','node','npm','rustc','cargo')) {
    $cmd = Get-Command $exe -ErrorAction SilentlyContinue
    if ($cmd) { Write-Host ("[OK] {0}: {1}" -f $exe, ((& $exe --version | Select-Object -First 1) -join '')) }
    else { Write-Warning "$exe no detectado en PATH." }
  }
  if (Get-Command rustc -ErrorAction SilentlyContinue) {
    $hostTarget = (& rustc -vV | Where-Object { $_ -match '^host:' }) -join ''
    Write-Host "Rust $hostTarget"
    if ($hostTarget -notmatch 'windows-msvc') { Write-Warning 'Para Tauri Windows usar Rust MSVC.' }
  }
  if ($Instalar) {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'Falta npm.' }
    if (Test-Path 'package-lock.json') { & npm ci } else { & npm install }
    if ($LASTEXITCODE -ne 0) { throw 'Instalacion npm fallida.' }
  }
  if ($Validar) {
    if (-not (Test-Path 'node_modules')) { throw 'Primero instalar dependencias con -Instalar.' }
    & npm test; if ($LASTEXITCODE -ne 0) { throw 'Pruebas fallidas.' }
    & npm run build; if ($LASTEXITCODE -ne 0) { throw 'Build de frontend fallido.' }
    if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) { throw 'Cargo ausente: no se puede certificar Rust.' }
    & cargo check --manifest-path 'src-tauri/Cargo.toml'
    if ($LASTEXITCODE -ne 0) { throw 'Cargo check fallido.' }
  }
} finally { Pop-Location }
