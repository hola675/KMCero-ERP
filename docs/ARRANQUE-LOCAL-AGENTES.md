# Arranque local y contrato de agentes — KMCero ERP
Versión del archivo: 1.1.2
Última modificación: 2026-11-23

## Objetivo inmediato
Preparar y diagnosticar el entorno Windows del prototipo, registrando evidencia y bloqueos. La certificación queda pendiente hasta completar las verificaciones aplicables. No introducir funcionalidades de recepción, venta o control industrial. El coordinador humano proporciona instrucciones al líder de agentes; los agentes inspeccionan, implementan y reportan evidencia.

## Secuencia obligatoria
1. Abrir el repositorio clonado en VS Code con Kilo Code y leer AGENTS.md, README.md, docs/DIRECCION-TECNICA.md y docs/REQUISITOS.md.
2. Inspeccionar git status y versión de herramientas. Nunca modificar secretos o datos reales.
3. Preparar Node.js compatible con Vite 7, npm, Rust MSVC, C++ Build Tools y WebView2 siguiendo la documentación oficial de Tauri.
4. Ejecutar `npm install` (primera vez) y preservar el package-lock.json. Después usar `npm ci`.
5. Ejecutar `npm test`, `npm run build`, `cargo check --manifest-path src-tauri/Cargo.toml` y `npm run tauri dev` si se dispone de escritorio Windows.
6. Si algo falla, diagnosticar y corregir solamente errores de bootstrap. Registrar comandos, salidas resumidas, límites y cambios.
7. Crear rama temporal para modificaciones, PR hacia main y solicitar revisión; no fusionar pruebas fallidas ni borrar ramas sin autorización.

## Delegación del líder
- Entorno: herramientas, rutas y prerrequisitos.
- Frontend: TypeScript, Vite y compilación de la interfaz.
- Backend: Rust, cargo y enlazado SQLite.
- Calidad: pruebas, reproducibilidad y registro de resultados.
- Documentación: instrucciones claras para Windows, sin duplicar el changelog.

## Criterios de aceptación
`npm test`, `npm run build` y `cargo check` terminan con código cero; `npm run tauri dev` abre la ventana en un PC Windows con GUI. Cualquier punto omitido queda señalado como NO VERIFICADO. No se declara listo para producción.

## Políticas
Mantener versiones individuales y fecha en cabeceras de archivos compatibles; cambios resumidos en docs/CHANGELOG.md. Minimizar cambios; no simular resultados, accesos a API o integraciones industriales. No instalar globalmente herramientas sin justificar. Respetar AGENTS.md como norma principal.

## Registro de preparación Windows — 2026-11-23

**Alcance:** diagnóstico del entorno en la rama `work/bootstrap-windows-environment-20261123`, con commits remotos `a7ba0a5` y `8110ccc` todavía no integrados. El `git fetch` actualizó las referencias de main y la rama; el árbol de trabajo estaba limpio al inicio. Los resultados siguientes no certifican el entorno completo ni el producto.

**Herramientas detectadas:** Git 2.56.0.windows.2; Node 26.12.1; npm 12.2.2; rustc y cargo 1.99.1 para `x86_64-pc-windows-msvc`, target Rust `x86_64-pc-windows-msvc`; MSVC Build Tools VS2022 17.14.37806.7, compilador 19.44.35229 y Windows SDK detectado por `vswhere`; WebView2 157.0.4341.46. `npm run tauri info` informó checks de WebView2, MSVC y Rust OK; Tauri API 2.12.5 y JS CLI 2.12.6.

**Comandos y resultados observados:**
- `npm install`: PASS; creó `package-lock.json`, agregó 18 paquetes y reportó 0 vulnerabilidades. `npm ci`: PASS; mismo conteo y 0 vulnerabilidades. Ambos advirtieron que npm bloqueó el install script de esbuild por `allowScripts`; no se aprobó el script.
- `npm test`: PASS, 3/3 pruebas.
- `npm run build`: PASS, TypeScript y Vite 7.3.8.
- `cargo metadata --no-deps --manifest-path src-tauri/Cargo.toml --format-version 1`: PASS, código de salida 0.
- `cargo check --manifest-path src-tauri/Cargo.toml`: BLOQUEADO; acceso al índice de crates.io falló en Windows Schannel con `CRYPT_E_REVOCATION_OFFLINE` y timeout. `cargo check --offline`: FALLÓ porque la caché está vacía y no encuentra `rusqlite`.
- `cargo generate-lockfile --manifest-path src-tauri/Cargo.toml`: BLOQUEADO por el mismo error TLS al acceder a crates.io; `src-tauri/Cargo.lock` sigue sin generarse.
- Reintento de `cargo generate-lockfile --manifest-path src-tauri/Cargo.toml` tras confirmar acceso: persiste `CRYPT_E_REVOCATION_OFFLINE` y el timeout de crates.io. No se desactivó SSL/TLS ni la validación de certificados; el lock Rust continúa pendiente.
- `npm run tauri dev`: Vite inició en `127.0.0.1:5173`, pero Tauri falló al obtener crates.io por el mismo error; no se abrió ventana.
- `git diff --check`: PASS.

**No ejecutado:** `cargo test` y bundle de escritorio. No hubo instalaciones globales ni se desactivó TLS o la política de scripts. La validación Rust/escritorio queda incompleta por el bloqueo de red; estos resultados parciales no equivalen a certificación completa ni a preparación para producción.
