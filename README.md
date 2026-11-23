# KMCero ERP · base técnica v0.1.0
Última modificación: 2026-11-23

Prototipo inicial de escritorio para KMCero, **no apto todavía para operaciones comerciales reales**.

## Ejecutar (Windows 11)
Requisitos: Node.js, npm, Rust, prerrequisitos Tauri 2 para Windows (Microsoft C++ Build Tools y WebView2). Instalar dependencias con `npm install`. Vista de navegador: `npm run dev`. Escritorio: `npm run tauri dev`. Pruebas estáticas: `npm test`. Construcción: `npm run tauri build`.

## Lo entregado
- Interfaz inicial de panel y navegación, usando los archivos de identidad suministrados.
- Backend Tauri en Rust con almacenamiento SQLite persistente de aplicación, inicializado al consultar indicadores.
- Esquema preliminar SQL de servicentros, tanques, lotes, clientes, movimientos, ventas, mediciones, cierres y auditoría.
- Test estático básico de esquema.

## Lo NO implementado
- Captura, autorización y publicación de recepciones, ventas o cierres.
- Seguridad de usuarios, autenticación, firmas y cadena de auditoría verificable.
- Importación y exportación de modelos oficiales, conectores a Boulevard/TPV/SISCONT/SIOC.
- Validación metrológica, análisis de mermas y consistencia entre lotes/tanques, pagos, cierres y caja.
- Migraciones versionadas completas, sincronización de estaciones, respaldos automáticos y recuperación.

## Restricciones
No se controlan surtidores, bombas, válvulas ni sistemas críticos de seguridad. Cualquier integración OT requerirá evaluación independiente y controles físicos. Las operaciones reales solo deben habilitarse después de pruebas y aprobación operativa.

## Arquitectura propuesta
Interfaz TypeScript + Tauri 2; comandos Rust; SQLite local por estación; eventos de inventario append-only; adaptadores externos explícitos. Futuras versiones: autenticación local, control de acceso, movimientos transaccionales e informes oficiales.

## Versionado
La versión indicada en este archivo pertenece a este archivo/prototipo. Mantener fecha y versión por archivo, y registrar cambios resumidos por sección en docs/CHANGELOG.md.
