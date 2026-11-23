# KMCero ERP — Dirección técnica y plan de investigación

Versión: 0.1.0 · Última modificación: 2026-11-23  
Estado: propuesta de arquitectura; no habilitado para operación comercial.

## 1. Objetivo y alcance

Definir una dirección preliminar para un producto de escritorio Tauri 2, local-first y preparado para evolucionar a multiestación. El alcance objetivo contempla recepción, inventario, propiedad del combustible, ventas V-1 a V-5, conciliación por modalidad, cierres diarios y reportes oficiales.

El producto actual sigue siendo un prototipo. Este documento no aprueba ni habilita operaciones comerciales, integraciones externas o control de equipos. El MVP no acciona bombas, válvulas ni surtidores. Las decisiones y reglas de operación requieren validación funcional y documental antes de implementarse.

## 2. Evidencia y procedencia

La información siguiente se recibió como documentación y material de referencia del proyecto; su transcripción o resumen aquí no equivale a una validación independiente de vigencia o interpretación normativa.

- **EC-DC 00/P 01, versión 00, 22/04/2026:** variantes de venta V-1 a V-5; comprobantes, inventarios y balances; referencias a recepción G-PGE 402, medidas G-PGE 1601, existencias G-PGE 1602 y movimiento O33; cierre de 24 horas; márgenes y precios sujetos a configuración versionada; separación de balances por variante.
- **DIAC 09/2026:** gestión de productos e inventario, precios, carga de TPV y reportes en Boulevard Transfermóvil. No demuestra la disponibilidad de una API oficial.
- **EC-DT 00/P 03, versión 01, 05/08/2026:** condiciones de seguridad para recepción y descarga, revisión documental, precintos, capacidad y producto, inspección y restricciones ante tormentas o descargas. Digitalizar una lista de comprobación no sustituye los controles físicos.
- **Hojas de cálculo y formularios recibidos:** 1-1602, 2-O33, 3-402, 4-E-4, fecha de extracción y modelos G-PGE 1602/402/O33. Sigue pendiente comparar sus campos y fórmulas uno por uno; no asumir que tienen diseños idénticos.

Los nombres, referencias y reglas anteriores son un inventario de evidencia proporcionada, no una afirmación de que se hayan comprobado los originales o sus revisiones vigentes. La matriz funcional existente se mantiene en [`REQUISITOS.md`](REQUISITOS.md).

## 3. Principios de dominio y límites

1. **Separación física y comercial:** representar el inventario físico por tanque y producto por separado de los derechos comerciales por titular, variante, lote y derecho de despacho. Conciliar ambos sin asumir que la titularidad identifica una ubicación física.
2. **Hechos publicados inmutables:** conservar los movimientos publicados como un diario; no corregirlos sobrescribiendo o eliminando registros. Una reversión o corrección futura debe ser una operación explícita, trazable y autorizada.
3. **Precisión explícita:** usar cantidades enteras en la unidad mínima documentada para volumen (por ejemplo, mililitros solo si se confirma esa unidad) y decimales fijos para dinero. Documentar conversiones y redondeo antes de aplicarlos.
4. **Saldos y pago:** impedir saldos negativos no autorizados. Cuando la modalidad exija pago anticipado, no confirmar una venta sin evidencia auténtica de pago. Un indicador local no acredita pago; el estado offline no debe fingir una validación de TPV o pasarela.
5. **Estados de operación:** distinguir captura en borrador, validación, autorización/publicación, conciliación y cierre. Las correcciones deben registrar motivo y aprobación según reglas por definir.
6. **Reglas versionadas:** asociar procedimientos, tarifas, márgenes, formatos y demás reglas oficiales a su procedencia, versión y vigencia. No introducir valores fijos sin expediente aprobado.
7. **Lotes y titularidad:** preservar producto, titular, costo documentado, procedencia, documentación y eventos de calidad del lote. Definir particiones de volumen, transferencias de derechos y asignaciones sin simular un traslado físico.
8. **Operación sin red:** permitir trabajo local cuando corresponda, sin presentar integraciones remotas o pagos como verificados cuando no haya evidencia. No usar SQLite compartida por red.
9. **Documentos reproducibles:** generar documentos desde datos primarios y conservar versión de formato y procedencia. Validar los modelos recibidos antes de generar exportaciones oficiales.
10. **Frontera OT:** excluir el control de hardware industrial hasta completar una revisión independiente y obtener las autorizaciones operativas necesarias.

Estos principios son objetivos de diseño, no capacidades ya implementadas ni requisitos aprobados para operar.

## 4. Arquitectura objetivo (propuesta)

- **Presentación:** Tauri 2 y TypeScript; experiencia de escritorio accesible, navegación eficiente, validación de formularios y uso local sin depender de Internet.
- **Backend:** Rust organizado en dominio, aplicación, infraestructura y adaptadores. Exponer operaciones mediante comandos explícitos; la interfaz no debe ejecutar SQL arbitrario.
- **Persistencia:** SQLite local por estación, claves foráneas, transacciones y migraciones hacia adelante. Diseñar y probar respaldo y restauración. Usar WAL solo con pruebas de bloqueo, apagado, recuperación y corrupción adecuadas al entorno.
- **Multiestación futura:** servicio de sincronización con identidad de estación, idempotencia, colas, confirmaciones (ACK), reintentos, errores y conflictos explícitos. Es una evolución por diseñar; no conectar una base SQLite por red.
- **Integraciones futuras:** adaptadores separados y deshabilitados por defecto para TPV, Boulevard, SIOC y SISCONT. Integrar solo mediante protocolos documentados y autorización del operador; no inferir que existe API oficial.
- **Seguridad futura:** definir usuarios, roles y capacidades por estación, sesiones, bitácora con integridad verificable, retención y cifrado de respaldos cuando corresponda. No describir hashes declarados como una auditoría antimanipulación verificada.

La arquitectura anterior es una dirección para evaluación, no un mandato para introducir de una vez todos sus componentes, plugins o dependencias.

## 5. Auditoría preliminar del starter 0.1.0

Hallazgos observados en la migración inicial `src-tauri/migrations/001_core.sql` y el backend actual. Son limitaciones del prototipo, no una especificación final del nuevo modelo:

- `fuel_movement` no garantiza mediante una FK compuesta que estación, tanque, producto y lote correspondan entre sí.
- `fuel_lot` representa un titular único. Falta definir particiones de volumen, transferencias de titularidad y asignaciones sin implicar movimiento físico.
- `movement_type='ADJUSTMENT'` permite volumen positivo o negativo sin separar tipo de ajuste, motivo, autorización e impacto.
- `sale.payment_verified` es un booleano sin estados ni validación por variante; el valor `1` no prueba que el pago se haya verificado.
- `daily_close` no incorpora variante, producto, mediciones inicial y final, conciliación, evidencias ni versiones de reglas.
- `audit_event` contiene campos de hash, pero no implementa ni demuestra una cadena verificable, gestión de claves, protección o prueba de integridad.
- Faltan modelos de usuarios, roles, estaciones autorizadas, turnos, tarifas y monedas vigentes, expedientes, precintos, documentos, calidad, contratos, conciliación y exportaciones.
- El backend actual inicializa el esquema y expone una consulta de indicadores; esto no demuestra que el producto esté certificado o probado integralmente en Windows. Antes de distribuir, se requieren compilación en el sistema objetivo y pruebas funcionales pertinentes.

El esquema actual es una semilla técnica. No debe ampliarse hacia operaciones comerciales sin resolver los requisitos, invariantes, autorizaciones y pruebas aplicables.

## 6. Fases propuestas y criterios de salida

Las fases son una secuencia de planificación preliminar; pueden ajustarse al validar alcance, dependencias y operación. Ninguna fase, por sí sola, autoriza uso productivo.

### Fase 0 — Requisitos y contrato de datos

- Crear trazabilidad requisito → sección del procedimiento → entidad/comando → prueba → reporte.
- Inventariar los campos de los 11 modelos adjuntos: tipo, obligatoriedad, origen y fórmula.
- Revisar con responsable funcional políticas de precio y cobro por variante, reglas de merma, manejo de errores y aprobaciones.
- **Salida:** especificación revisable y aprobable, sin cálculos opacos; registrar decisiones y pendientes.

### Fase 1 — Núcleo y recepción

- Definir modelos Station, Tank, Product, Lot, Owner, Receipt, Measurement, Movement y Audit, junto con restricciones y transacciones.
- Diseñar recepción con guía/factura, transportista, precintos, capacidad, volúmenes inicial/final, evidencias y estados.
- Definir cálculo de diferencias, tolerancias configurables documentadas y bloqueos de seguridad.
- Probar reversión, saldos, duplicados, interrupción/reinicio, migración, permisos y exportación G-PGE 402 tras validar el formato.

### Fase 2 — Inventario y balances

- Diseñar aforos de tanques, medidas y agua de fondo; distinguir movimientos físicos de comerciales y conciliar por modalidad.
- Definir cierre de 24 horas, idempotencia, reapertura formal auditada y reportes 1602/O33 tras validación de modelos.

### Fase 3 — Ventas y caja

- Especificar variantes V-1 a V-5, derechos, contratos y comprobantes de despacho.
- Definir verificación de pagos por evidencia auténtica, precios por vigencia, caja y conciliación antes de implementar.

### Fase 4 — Reportes e integraciones autorizadas

- Versionar plantillas oficiales y validar exportaciones.
- Evaluar SISCONT, SIOC, TPV y Boulevard únicamente con documentación, acceso y autorización suficientes; registrar límites y resultados de pruebas.

### Fase 5 — Multiestación y operación

- Diseñar sincronización idempotente y tolerante a cortes, monitoreo, actualizaciones firmadas y migración de históricos.
- Definir piloto, capacitación, reversión y aceptación operativa. Sin aprobación expresa, el piloto no se ejecuta.

## 7. Organización del trabajo

Los roles que siguen son propuestas de responsabilidades, no instancias de agentes ya creadas ni tareas ejecutadas: líder técnico, análisis normativo, modelado de dominio, arquitectura Rust, UI/UX Tauri, datos, reportes, integraciones, seguridad, calidad y documentación editorial.

Dividir el trabajo en entregables pequeños con contratos y responsables claros. Evitar ediciones simultáneas del mismo archivo. Revisar cambios y pruebas antes de integrarlos secuencialmente en `main`, de acuerdo con la política efectiva del repositorio. No crear ramas, PR ni tareas de agentes por el mero hecho de que este documento los mencione.

## 8. Calidad y riesgos por cubrir

Cada cambio debe tener alcance delimitado, una prueba focalizada cuando proceda y evidencia reproducible. No acumular archivos de prueba desechables ni capturas en el árbol del producto.

Invariantes objetivo, aún no certificadas por el starter:

- no permitir saldos negativos salvo regla explícita, documentada y autorizada;
- no duplicar recepciones ni procesar dos veces una misma solicitud;
- no despachar más derechos que los disponibles;
- no modificar un asiento publicado;
- no cerrar con diferencias sin resolver según la política aprobada;
- separar aprobación y ejecución cuando la política exija que nadie se autoapruebe.

Casos de fallo que deberán considerarse en el diseño y las pruebas: apagón durante confirmación; reloj desajustado; base SQLite bloqueada; TPV sin conexión; reenvío duplicado; CSV malformado; cambio de tarifa semanal; reversión posterior al cierre.

## 9. Referencias técnicas por verificar

Se incluyen como fuentes de consulta propuestas, no como evidencia de que se haya comprobado su contenido, vigencia o aplicabilidad a esta implementación:

- Tauri v2 — permisos: <https://v2.tauri.app/security/permissions/>
- Tauri v2 — plugin SQL: <https://v2.tauri.app/plugin/sql/>
- Tauri v2 — actualizaciones: <https://v2.tauri.app/plugin/updater/>
- SQLite — WAL: <https://www.sqlite.org/wal.html>
- SQLite — PRAGMA: <https://www.sqlite.org/pragma.html>
- OWASP ASVS 5 — logging: <https://github.com/OWASP/ASVS/blob/master/5.0/en/0x25-V16-Security-Logging-and-Error-Handling.md>
- NIST SP 800-82 Rev. 3 — OT: <https://csrc.nist.gov/pubs/sp/800/82/r3/final>
- NIST SP 800-82 Rev. 4 — borrador inicial, no norma final: <https://csrc.nist.gov/pubs/sp/800/82/r4/ipd>

## 10. Validaciones funcionales pendientes

Confirmar con responsables de operación: número de estaciones y usuarios por estación; topología de red; tipos de surtidores; equipos de aforo; titularidad por compartimentos y lotes; cuentas contables; acceso a entornos de prueba de TPV; personas autorizadas a aprobar; monedas y precisiones; fuente y vigencia oficial de precios; política de resguardo; titularidad y licencias de marca.

Resolver estas incógnitas mediante análisis de los documentos y del repositorio, y entrevistas funcionales cuando sean posibles. Pueden registrarse como pendientes del diseño; no deben convertirse en supuestos operativos ni bloquear documentación preliminar que no dependa de ellas.

## 11. Estado y límites de la evidencia

Esta documentación es preliminar y local al repositorio; no implica publicación en GitHub. No se ha comprobado ninguna API externa ni conexión a surtidores, y no se ha ejecutado un piloto en producción. El starter 0.1.0 requiere evolución del modelo y pruebas antes de cualquier consideración de uso comercial.
