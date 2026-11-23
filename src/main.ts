// KMCero ERP 0.1.0 - 2026-11-23
import { invoke } from '@tauri-apps/api/core';
import './style.css';
const appIcon = new URL('../assets/kmcero-icon-master.png', import.meta.url).href;
const heroImage = new URL('../assets/hero-servicentro.png', import.meta.url).href;
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
const app = document.querySelector<HTMLDivElement>('#app')!;
const illustration = heroImage;
app.innerHTML=`<div class="layout"><aside class="sidebar"><div class="brand"><img src="${appIcon}" alt="Logo KMCero"><div><b>KMCero</b><span>ERP / Servicentros</span></div></div>
<div class="group-label">OPERACIONES</div><nav>${menu.map((m,i)=>`<button class="nav ${i===0?'selected':''}" data-section="${i}"><span class="nav-symbol">${['▦','⇥','◫','⛽','✓','▤','◇','⚙'][i]}</span>${m[1]}</button>`).join('')}</nav>
<div class="side-bottom"><div class="status-dot"></div>Base local · Modo inicial<br><small>Versión 0.1.0</small></div></aside>
<main><header><div><span class="eyebrow">PANEL OPERATIVO</span><h1 id="title">Resumen general</h1><p id="subtitle">Gestión integral de recepción y comercialización de combustible</p></div><span class="chip">PROTOTIPO · Sin datos reales</span></header>
<section class="hero"><div><span class="hero-label">CONTROL DE OPERACIONES</span><h2>Combustible bajo control.<br>Desde la recepción hasta el despacho.</h2><p>Inventarios físicos, movimientos por lote, cinco modalidades de venta y trazabilidad documental.</p></div><img src="${illustration}" alt="Camión cisterna en estación"/></section>
<div id="dashboard"><section class="metrics"><article><small>Servicentros registrados</small><strong id="stations">—</strong><span>Estructura multiestación</span></article><article><small>Tanques configurados</small><strong id="tanks">—</strong><span>Inventario físico</span></article><article><small>Productos</small><strong id="products">—</strong><span>Catálogo de combustibles</span></article><article><small>Movimientos registrados</small><strong id="moves">—</strong><span>Libro de operaciones</span></article></section>
<section class="panel"><div class="panel-title"><div><h3>Flujo operativo</h3><p>Secuencia propuesta basada en los procedimientos de KMCero.</p></div></div><div class="steps"><div><span>01</span><b>Planificar recepción</b><small>Documento, capacidad y seguridad</small></div><div><span>02</span><b>Medir y recibir</b><small>Volumen, tanque y lote</small></div><div><span>03</span><b>Registrar despachos</b><small>Modalidad y comprobante</small></div><div><span>04</span><b>Conciliar y cerrar</b><small>Inventario, mermas y reportes</small></div></div></section></div>
<section id="placeholder" class="panel" hidden><h3 id="moduleTitle"></h3><p>Este módulo está especificado en la documentación técnica. La captura de operaciones reales permanece deshabilitada hasta incorporar validaciones, seguridad, auditoría y pruebas.</p><div class="notice">No se generan movimientos ficticios ni se modifica el inventario.</div></section>
<footer>KMCero ERP · Plataforma local-first · Tauri + Rust + SQLite</footer></main></div>`;
async function update(){try{const d=await invoke<Overview>('overview'); ([['stations',d.stations],['tanks',d.tanks],['products',d.products],['moves',d.recorded_movements]] as const).forEach(([id,v])=>document.getElementById(id)!.textContent=String(v));}catch(e){document.getElementById('subtitle')!.textContent=`Vista preliminar en navegador. Los indicadores requieren Tauri.`;console.info('Tauri no disponible',e);}}
const nav=document.querySelectorAll<HTMLButtonElement>('.nav');nav.forEach(btn=>btn.addEventListener('click',()=>{nav.forEach(n=>n.classList.remove('selected'));btn.classList.add('selected');const i=Number(btn.dataset.section);document.getElementById('title')!.textContent=menu[i][1];document.getElementById('dashboard')!.hidden=i!==0;document.getElementById('placeholder')!.hidden=i===0;document.getElementById('moduleTitle')!.textContent=menu[i][1];}));void update();
