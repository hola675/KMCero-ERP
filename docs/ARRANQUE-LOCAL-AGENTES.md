# Arranque local y contrato de agentes — KMCero ERP
Versión del archivo: 1.0.0
Última modificación: 2026-11-23

## Objetivo inmediato
Preparar y certificar en Windows el prototipo existente, sin introducir funcionalidades de recepción, venta o control industrial todavía. El coordinador humano proporciona instrucciones al líder de agentes; los agentes inspeccionan, implementan y reportan evidencia.

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
