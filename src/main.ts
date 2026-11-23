// KMCero ERP 0.1.0 - 2026-11-23
import { invoke } from '@tauri-apps/api/core';
import './style.css';
const appIcon = new URL('../assets/kmcero-fleet-icon.png', import.meta.url).href;
const heroImage = new URL('../assets/hero-kmcero-branded.png', import.meta.url).href;
const navIcons = [
 '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 '<path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 17a2 2 0 1 0 4 0M16 17a2 2 0 1 0 4 0"/>',
 '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
 '<path d="M7 3v7M10 3v7M7 7h3M8.5 10v11M16 3c2 2 3 4.5 3 7v11M16 3v7h3"/>',
 '<path d="M7 3h10v3h3v15H4V6h3zM8 12l2.5 2.5L16 9"/>',
 '<path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7"/>',
 '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11zM9 12l2 2 4-4"/>',
 '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.9.3l-.1.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.5-1 1.7 1.7 0 0 0-.8.2l-.2.1-2.9-1.7.1-.2a1.7 1.7 0 0 0-.3-1.9l-.1-.1v-3.4l.2-.1a1.7 1.7 0 0 0 1-1.5 1.7 1.7 0 0 0-.2-.8l-.1-.2L9.3 6l.2.1a1.7 1.7 0 0 0 1.9-.3l.1-.1h3.4l.1.2a1.7 1.7 0 0 0 1.5 1.0 1.7 1.7 0 0 0 .8-.2l.2-.1 2.9 1.7-.1.2a1.7 1.7 0 0 0 .3 1.9l.1.1v3.4z"/>'
];
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = appIcon;
document.head.append(favicon);
type Overview = {stations:number;tanks:number;products:number;recorded_movements:number};
const menu = [
 ['layout-dashboard','Resumen general'],['truck','Recepción cisternas'],['database','Tanques e inventarios'],
 ['fuel','Ventas y despachos'],['clipboard-check','Cierre y balances'],['file-text','Informes oficiales'],
 ['shield-check','Seguridad e incidentes'],['settings','Configuración']
];
const featureIcons: Record<string,string> = {
 document:'<path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7"/>',
 measure:'<path d="M4 19V5m0 14h16M8 15v-3m4 3V8m4 7v-5m4 5V6"/>',
 safety:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11zM9 12l2 2 4-4"/>',
 tank:'<rect x="3" y="6" width="18" height="13" rx="6"/><path d="M6 6V4h12v2M8 19v2m8-2v2"/>',
 lot:'<path d="m12 3 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
 sale:'<path d="M4 5h16v14H4zM8 9h8M8 13h5M8 16h3"/>',
 payment:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
 balance:'<path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6zm10 0-4 7h8l-4-7zM8 21h8"/>',
 report:'<path d="M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h8"/>',
 rules:'<path d="M5 4h14v16H5zM8 8h8M8 12h5M8 16h3M3 7h2M3 12h2M3 17h2"/>',
 station:'<path d="M4 21V5l8-3v19M12 21h8V9l-8-4M7 8h2m-2 4h2m-2 4h2m7-3h2m-2 4h2"/>',
 link:'<path d="M10 13a5 5 0 0 0 7 .3l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.3l-3 3a5 5 0 0 0 7 7l2-2"/>'
};
const sections: Record<number,{description:string;image:string;features:{title:string;detail:string;icon:string}[]}> = {
 1:{description:'Expediente, mediciones y condiciones previas a la recepción de cisternas.',image:new URL('../assets/bg-recepcion-cisterna.png',import.meta.url).href,features:[
  {title:'Expediente documental',detail:'Guía, factura, transportista y precintos por revisar.',icon:'document'},
  {title:'Mediciones',detail:'Registro previsto de niveles y volúmenes antes y después.',icon:'measure'},
  {title:'Seguridad de descarga',detail:'Lista de comprobación propuesta; no sustituye controles físicos.',icon:'safety'}]},
 2:{description:'Consulta del inventario físico por estación, tanque, producto y lote.',image:new URL('../assets/bg-tanques-inventario.png',import.meta.url).href,features:[
  {title:'Tanques y productos',detail:'Estructura física local y catálogo por validar.',icon:'tank'},
  {title:'Mediciones y niveles',detail:'Aforo, nivel total y agua de fondo según reglas aprobadas.',icon:'measure'},
  {title:'Existencias por lote',detail:'Procedencia y titularidad separadas de la ubicación física.',icon:'lot'}]},
 3:{description:'Registro previsto de modalidades de venta y comprobantes de despacho.',image:new URL('../assets/bg-ventas-despachos.png',import.meta.url).href,features:[
  {title:'Modalidades V-1 a V-5',detail:'Reglas y requisitos de cada variante pendientes de validar.',icon:'sale'},
  {title:'Comprobantes',detail:'Trazabilidad documental propuesta para cada despacho.',icon:'document'},
  {title:'Evidencia de pago',detail:'No se valida TPV ni pagos con indicadores locales.',icon:'payment'}]},
 4:{description:'Conciliación propuesta de inventario teórico, mediciones y diferencias.',image:new URL('../assets/bg-cierre-balances.png',import.meta.url).href,features:[
  {title:'Apertura y movimientos',detail:'La apertura debe corresponder al cierre previo validado.',icon:'balance'},
  {title:'Faltantes y sobrantes',detail:'Diferencias visibles sin sobrescribir movimientos publicados.',icon:'measure'},
  {title:'Cierre diario',detail:'Reglas, aprobaciones y reaperturas siguen pendientes.',icon:'safety'}]},
 5:{description:'Preparación futura de informes a partir de formatos y datos validados.',image:new URL('../assets/bg-informes.png',import.meta.url).href,features:[
  {title:'Modelos de inventario',detail:'Referencias G-PGE 1602 y O33 por validar campo a campo.',icon:'report'},
  {title:'Modelos de recepción',detail:'G-PGE 402 requiere revisión de estructura y fórmulas.',icon:'rules'},
  {title:'Fecha de extracción',detail:'Conservar versión, procedencia y periodo de cada informe.',icon:'document'}]},
 6:{description:'Preparación de seguridad y registro documental de incidentes.',image:new URL('../assets/bg-seguridad.png',import.meta.url).href,features:[
  {title:'Recepción segura',detail:'Controles documentales propuestos según procedimiento fuente.',icon:'safety'},
  {title:'Incidentes',detail:'Registro y seguimiento pendientes de definición funcional.',icon:'document'},
  {title:'Controles físicos',detail:'La aplicación no sustituye inspecciones ni dispositivos.',icon:'measure'}]},
 7:{description:'Parámetros locales y catálogos; integraciones externas permanecen deshabilitadas.',image:new URL('../assets/bg-configuracion.png',import.meta.url).href,features:[
  {title:'Estaciones y catálogos',detail:'Gestión editable aún no implementada.',icon:'station'},
  {title:'Reglas versionadas',detail:'Guardar procedencia y vigencia antes de aplicar reglas.',icon:'rules'},
  {title:'Integraciones',detail:'TPV, Boulevard, SIOC y SISCONT no están conectados.',icon:'link'}]}
};
const app = document.querySelector<HTMLDivElement>('#app')!;
const illustration = heroImage;
app.innerHTML=`<div class="layout"><aside class="sidebar"><div class="brand"><img src="${appIcon}" alt="Emblema KMCERO"><div><b>KMCERO</b><span>Aseguramos tu viaje</span></div></div>
<div class="group-label">OPERACIONES</div><nav>${menu.map((m,i)=>`<button class="nav ${i===0?'selected':''}" data-section="${i}"><span class="nav-symbol"><svg viewBox="0 0 24 24" aria-hidden="true">${navIcons[i]}</svg></span>${m[1]}</button>`).join('')}</nav>
<div class="side-bottom"><div class="status-dot"></div>Base local · Modo inicial<br><small>Versión 0.1.0</small></div></aside>
<main><header><div><span class="eyebrow">PANEL OPERATIVO</span><h1 id="title">Resumen general</h1><p id="subtitle">Gestión integral de recepción y comercialización de combustible</p></div><span class="chip">PROTOTIPO · Sin datos reales</span></header>
<section class="hero"><div><span class="hero-label">CONTROL DE OPERACIONES</span><h2>Combustible bajo control.<br>Desde la recepción hasta el despacho.</h2><p>Inventarios físicos, movimientos por lote, cinco modalidades de venta y trazabilidad documental.</p></div><img src="${illustration}" alt="Camión cisterna en estación"/></section>
<div id="dashboard"><section class="metrics"><article><small>Servicentros registrados</small><strong id="stations">—</strong><span>Estructura multiestación</span></article><article><small>Tanques configurados</small><strong id="tanks">—</strong><span>Inventario físico</span></article><article><small>Productos</small><strong id="products">—</strong><span>Catálogo de combustibles</span></article><article><small>Movimientos registrados</small><strong id="moves">—</strong><span>Libro de operaciones</span></article></section>
<section class="panel"><div class="panel-title"><div><h3>Flujo operativo</h3><p>Secuencia propuesta basada en los procedimientos de KMCero.</p></div></div><div class="steps"><div><span>01</span><b>Planificar recepción</b><small>Documento, capacidad y seguridad</small></div><div><span>02</span><b>Medir y recibir</b><small>Volumen, tanque y lote</small></div><div><span>03</span><b>Registrar despachos</b><small>Modalidad y comprobante</small></div><div><span>04</span><b>Conciliar y cerrar</b><small>Inventario, mermas y reportes</small></div></div></section></div>
<section id="moduleView" hidden></section>
<footer>KMCERO ERP · Plataforma local-first · Tauri + Rust + SQLite</footer></main></div>`;
async function update(){try{const d=await invoke<Overview>('overview'); ([['stations',d.stations],['tanks',d.tanks],['products',d.products],['moves',d.recorded_movements]] as const).forEach(([id,v])=>document.getElementById(id)!.textContent=String(v));}catch(e){document.getElementById('subtitle')!.textContent=`Vista preliminar en navegador. Los indicadores requieren Tauri.`;console.info('Tauri no disponible',e);}}
const nav=document.querySelectorAll<HTMLButtonElement>('.nav');
nav.forEach(btn=>btn.addEventListener('click',()=>{
 nav.forEach(n=>n.classList.remove('selected'));btn.classList.add('selected');
 const i=Number(btn.dataset.section),detail=sections[i],dashboard=document.getElementById('dashboard')!,moduleView=document.getElementById('moduleView')!,summaryHero=document.querySelector<HTMLElement>('.hero')!;
 document.getElementById('title')!.textContent=menu[i][1];dashboard.hidden=i!==0;summaryHero.hidden=i!==0;moduleView.hidden=i===0;
 if(i===0)return;
 moduleView.innerHTML=`<section class="module-hero" style="background-image:linear-gradient(90deg,#0b2549f5 0%,#12345bc9 48%,#12345b20 100%),url('${detail.image}')"><div class="module-heading"><span>CAPACIDAD PREVISTA · NO HABILITADA</span><h2>${menu[i][1]}</h2><p>${detail.description}</p></div></section><section class="capability-panel"><div class="capability-heading"><div><span class="eyebrow">MAPA DEL MÓDULO</span><h3>Funciones previstas</h3></div><span class="disabled-badge">Prototipo · solo diseño</span></div><div class="capability-grid">${detail.features.map(feature=>`<article class="capability-card"><span class="feature-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${featureIcons[feature.icon]}</svg></span><div><b>${feature.title}</b><p>${feature.detail}</p></div></article>`).join('')}</div><div class="notice">La captura de operaciones reales, los pagos, cierres y conexiones a equipos permanecen deshabilitados.</div></section>`;
}));void update();
