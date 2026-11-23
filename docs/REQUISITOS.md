# KMCero ERP · análisis funcional v0.1.0
Última modificación: 2026-11-23

La dirección arquitectónica, el plan de investigación y la auditoría técnica preliminar se mantienen en [`DIRECCION-TECNICA.md`](DIRECCION-TECNICA.md). Este archivo conserva las referencias funcionales y las reglas identificadas; distingue las normas documentales de las propuestas y los asuntos pendientes.

## Procedimientos fuente
1. EC-DC 00/P 01 v00, emisión 22/04/2026: venta V-1 a V-5, control de lotes, balances y modelos, evidencia de chips, precios semanales, cierre 24h.
2. DIAC 09/2026: gestión de catálogo, precios, carga de inventarios y vinculación a TPV vía Boulevard/Transfermóvil.
3. EC-DT 00/P 03 v01, emisión 05/08/2026: seguridad industrial y procedimiento de recepción/descarga.

## Modelos revisados
- G-PGE 1602: identificación de tanque, producto, niveles total/agua, litros, densidad, temperatura, factor, equivalencia a 15°C.
- O33 / 1603-B: apertura, recibos, salidas por concepto, inventario teórico, inventario físico y faltante/sobrante.
- Resumen de pérdidas: permisible, real y diferencias diarias/acumuladas.
- Control por fecha extracción: apertura, entrada, salida DTCC, salida insumo, salida total y existencia final.
- G-PGE 402 y E-4 .xls: su estructura debe validarse celda a celda antes de implementar exportadores; formato antiguo aún no migrado.
- 1-1602 Servicentro.xlsx: error de importación con lector actual; requiere recuperación/normalización sin modificar original.

## Reglas a implementar (diferenciando documento y propuesta)
1. **Norma**: apertura de balance = cierre previo; entradas según documentación; salidas sustentadas por chip de venta; balance diferenciado por variante.
2. **Norma**: en recepción se deben registrar mediciones antes y después y el expediente documental; el procedimiento comercial menciona hasta 1% de pérdida en descarga.
3. **Norma**: durante descarga se paralizan operaciones de surtido; controles de puesta a tierra, sellos y muestra de combustible.
4. **Diseño propuesto**: ledger de eventos sin sobrescritura; correcciones mediante contramovimientos autorizados.
5. **Diseño propuesto**: cantidades en mililitros enteros internamente para evitar redondeos flotantes; representación en litros en interfaz.
6. **Diseño propuesto**: un tanque contiene inventario físico, y el módulo comercial registra propiedad por lote/cliente/variante; prohibir saldos negativos al confirmar transacciones.
7. **Diseño propuesto**: aprobación por rol con registro de evidencias, bloqueo del cierre y reapertura excepcional documentada.
8. **Diseño propuesto**: operación offline, copias cifradas verificables, sincronización posterior con resolución de conflictos.
9. **Pendiente**: confirmar aforos, políticas locales de inventario, facturación, usuarios, integración TPV y manejo efectivo del cambio de turno.

## Regla contable orientativa
Inventario teórico final = apertura + entradas - salidas +/- ajustes autorizados.
Diferencia = inventario físico - inventario teórico; clasificar faltante o sobrante sin alterar el movimiento original.

## Etapas
F0 documentación y modelo de dominio; F1 recepción + tanques/medición; F2 ventas/propietarios/modalidades; F3 balances/modelos; F4 seguridad, auditoría, consolidación e integración; F5 piloto y aceptación.
