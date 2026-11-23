# Guía de trabajo para agentes · KMCero ERP

Versión: 0.1.0 · Última modificación: 2026-11-23

## Propósito y estado del producto

KMCero ERP es un prototipo de escritorio para Windows construido con Tauri 2, TypeScript, Rust y SQLite local. **No está aprobado para operaciones comerciales reales.** Esta guía se aplica a este repositorio junto con las instrucciones del host; no concede permisos adicionales.

La arquitectura futura, los hallazgos preliminares y las fases propuestas se describen en [`docs/DIRECCION-TECNICA.md`](docs/DIRECCION-TECNICA.md). Es una propuesta de trabajo, no una especificación aprobada ni una autorización para habilitar operaciones. `docs/REQUISITOS.md` conserva el análisis funcional; ante discrepancias, identifica qué es fuente documental, qué es propuesta y qué sigue pendiente de validación.

## Reglas de trabajo

- Antes de editar, inspecciona el estado del repositorio y los archivos implicados. Conserva los cambios existentes y limita la modificación al alcance solicitado.
- Respeta la arquitectura y las convenciones actuales. No añadas dependencias, migraciones, refactors amplios ni cambios de plataforma salvo que sean necesarios para el objetivo.
- Mantén alineados los tipos y las validaciones de TypeScript y Rust. Considera no confiables los datos recibidos desde la interfaz y valídalos de nuevo en Rust antes de persistirlos.
- Usa consultas SQLite parametrizadas. Aplica transacciones cuando una operación deba ser atómica. El esquema actual es preliminar: no lo presentes como una migración completa ni modifiques datos reales.
- No habilites ni simules ventas, recepciones, cierres, pagos ni control de surtidores, válvulas u otros equipos. No conectes servicios externos ni sistemas industriales sin alcance y autorización explícitos, evaluación independiente y salvaguardas operativas.
- No presentes como reales mecanismos de autenticación, autorización, firma, sincronización o auditoría que todavía no existan. Si una operación depende de ellos, conserva un comportamiento seguro y deja clara la limitación.
- Mantén separados el inventario físico por tanque/producto y los derechos comerciales por titular, variante y lote. No infieras que la titularidad equivale a ubicación física. Los hechos publicados no se sobrescriben: cualquier corrección futura debe quedar como operación explícita, trazable y autorizada.
- Usa unidades enteras de la unidad mínima documentada para volúmenes y precisión decimal fija para importes; no introduzcas redondeos, precios, tolerancias ni conversiones sin reglas documentadas y vigencia definida.
- No aceptes saldos negativos ni tomes un indicador local como prueba de pago. No declares validado un pago, TPV o pasarela cuando no exista evidencia auténtica, incluida la operación offline.
- Conserva la procedencia y versión de las reglas y formatos oficiales. Digitalizar listas de comprobación no sustituye inspecciones ni controles físicos.
- No conectes una base SQLite compartida por red. Cualquier sincronización multiestación futura requiere un diseño explícito con identidad de estación, idempotencia, confirmaciones, reintentos y resolución de conflictos.
- No incluyas secretos, credenciales, datos personales ni datos reales de clientes en código, fixtures, registros o documentación.
- Actualiza `README.md` o `docs/REQUISITOS.md` únicamente si cambia la información que contienen. Registra en `docs/CHANGELOG.md` los cambios funcionales y las decisiones relevantes; omite cambios editoriales menores.
- Para decisiones o cambios de diseño no cubiertos por este archivo, consulta `docs/DIRECCION-TECNICA.md`; no dupliques allí la especificación detallada.

## Verificación

- En cambios de lógica o esquema, ejecuta `npm test` y añade o actualiza pruebas para la invariante afectada.
- En cambios de interfaz o integración, ejecuta también `npm run build` si las dependencias están disponibles.
- Ejecuta `npm run tauri build` solo cuando el alcance requiera validar el paquete de escritorio y estén disponibles los prerrequisitos de Tauri.
- Informa los comandos ejecutados y sus resultados. Separa claramente las pruebas no ejecutadas de las fallidas; nunca describas el prototipo como listo para producción.

## Cierre

Revisa el diff y el estado del repositorio para detectar cambios ajenos. Resume qué cambió, qué se verificó y qué limitaciones o riesgos quedan pendientes. No despliegues, publiques, operes sobre datos reales ni hagas cambios destructivos sin autorización específica.
