// app.js — CoolPath Application Logic

// ─── State ───────────────────────────────────────────────────────────────────
let map;
let routeMode    = 'shortest';
let allPathLayers  = [];   // { pathId, layer, baseLine }
let routeLayers    = [];   // layers added for active route
let buildingMarkers = [];  // { id, marker }
let heatLayers     = [];
let densityActive  = false;
let heatmapActive  = false;
let panelOpen      = true;

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  populateDropdowns();
  drawAllPaths();
  drawBuildingMarkers();
  populateCorridorsPanel();
});

// ─── Map Setup ────────────────────────────────────────────────────────────────
function initMap() {
  map = L.map('map', {
    center: [26.3075, 50.1480],
    zoom: 15,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);
}

function populateDropdowns() {
  const originSel = document.getElementById('origin');
  const destSel   = document.getElementById('destination');
  BUILDINGS.forEach(b => {
    originSel.add(new Option(b.name, b.id));
    destSel.add(new Option(b.name, b.id));
  });
  originSel.value = 'main_gate';
  destSel.value   = 'library';
}

// ─── Path Drawing ─────────────────────────────────────────────────────────────
function shadeColor(score) {
  if (score >= 70) return '#00b894';
  if (score >= 40) return '#f0a500';
  return '#e05252';
}

function heatColor(heat) {
  // heat 0=cool, 1=hot
  if (heat > 0.75) return 'rgba(220,38,38,0.22)';
  if (heat > 0.55) return 'rgba(234,88,12,0.18)';
  if (heat > 0.35) return 'rgba(234,179,8,0.14)';
  return 'rgba(34,197,94,0.10)';
}

function drawAllPaths() {
  allPathLayers = [];
  PATHS.forEach(path => {
    const color   = path.accessible ? shadeColor(path.shadeScore) : '#6b7280';
    const dashArr = path.accessible ? null : '8 5';

    const layer = L.polyline(path.waypoints, {
      color,
      weight:    4,
      opacity:   0.75,
      dashArray: dashArr,
      lineJoin:  'round',
      lineCap:   'round',
    }).addTo(map);

    const accessTxt = path.accessible ? 'Wheelchair accessible' : 'Not wheelchair accessible';
    const densityTxt = ['', 'Light', 'Moderate', 'Heavy'][path.density];

    layer.bindTooltip(
      `<b>${path.name}</b><br>` +
      `Shade: ${path.shadeScore}/100 &nbsp;|&nbsp; ${path.distance} m<br>` +
      `${accessTxt} &nbsp;|&nbsp; ${densityTxt} foot traffic`,
      { sticky: true }
    );

    allPathLayers.push({ pathId: path.id, layer });
  });
}

function drawBuildingMarkers() {
  buildingMarkers = [];
  BUILDINGS.forEach(b => {
    const marker = L.circleMarker(b.coords, {
      radius: 6, fillColor: '#58a6ff',
      color: '#0d1117', weight: 2, fillOpacity: 0.95,
    }).addTo(map);
    marker.bindTooltip(b.name, { direction: 'top' });
    buildingMarkers.push({ id: b.id, marker });
  });
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────
function toggleHeatmap(on) {
  heatmapActive = on;
  if (on) {
    heatLayers = [];
    PATHS.forEach(path => {
      const heat   = (100 - path.shadeScore) / 100;
      const color  = heatColor(heat);
      const radius = 60 + heat * 100; // meters: larger blob = hotter
      path.waypoints.forEach(pt => {
        const c = L.circle(pt, {
          radius, color: 'transparent', fillColor: color,
          fillOpacity: 1, interactive: false,
        }).addTo(map);
        heatLayers.push(c);
      });
    });
    announce('Urban heatmap layer enabled. Red areas indicate high heat exposure.');
  } else {
    heatLayers.forEach(l => map.removeLayer(l));
    heatLayers = [];
    announce('Heatmap layer disabled.');
  }
}

// ─── Density Overlay ──────────────────────────────────────────────────────────
function toggleDensity(on) {
  densityActive = on;
  allPathLayers.forEach(({ pathId, layer }) => {
    const path = PATHS.find(p => p.id === pathId);
    if (!path) return;
    const w = on ? path.density * 3 : 4; // density 1→3px, 2→6px, 3→9px
    layer.setStyle({ weight: w });
  });
  if (on) announce('Crowd density overlay enabled. Thicker lines indicate busier corridors.');
  else    announce('Density overlay disabled.');
}

// ─── High Contrast ────────────────────────────────────────────────────────────
function toggleContrast(on) {
  document.body.classList.toggle('high-contrast', on);
  announce(on ? 'High contrast mode enabled.' : 'High contrast mode disabled.');
}

// ─── Screen Reader ────────────────────────────────────────────────────────────
function announce(msg) {
  const el = document.getElementById('sr-announce');
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 50);
}

// ─── Graph & Dijkstra ─────────────────────────────────────────────────────────
function buildGraph(accessibleOnly) {
  const graph = {};
  BUILDINGS.forEach(b => { graph[b.id] = []; });
  PATHS.forEach(p => {
    if (accessibleOnly && !p.accessible) return;
    graph[p.from].push({ node: p.to,   edge: p });
    graph[p.to].push(  { node: p.from, edge: p });
  });
  return graph;
}

function dijkstra(graph, start, end, weightFn) {
  const dist = {}, prev = {}, prevEdge = {};
  const visited = new Set();
  Object.keys(graph).forEach(n => {
    dist[n] = Infinity; prev[n] = null; prevEdge[n] = null;
  });
  dist[start] = 0;
  const pq = [[0, start]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === end) break;
    for (const { node: v, edge } of (graph[u] || [])) {
      if (visited.has(v)) continue;
      const nd = d + weightFn(edge);
      if (nd < dist[v]) {
        dist[v] = nd; prev[v] = u; prevEdge[v] = edge;
        pq.push([nd, v]);
      }
    }
  }

  if (dist[end] === Infinity) return null;
  const nodes = [], edges = [];
  let cur = end;
  while (cur !== null) {
    nodes.unshift(cur);
    if (prevEdge[cur]) edges.unshift(prevEdge[cur]);
    cur = prev[cur];
  }
  return { nodes, edges };
}

const shortestWeight   = e => e.distance;
const coolestWeight    = e => e.distance * (1 + 2.5 * (100 - e.shadeScore) / 100);
const accessibleWeight = e => e.distance; // filter is in buildGraph

// ─── UI Actions ───────────────────────────────────────────────────────────────
function setMode(mode) {
  routeMode = mode;
  ['shortest', 'coolest', 'accessible'].forEach(m => {
    const btn = document.getElementById('btn-' + m);
    btn.classList.toggle('active', m === mode);
    btn.setAttribute('aria-pressed', m === mode ? 'true' : 'false');
  });
}

function findAndDrawRoute() {
  const origin = document.getElementById('origin').value;
  const dest   = document.getElementById('destination').value;
  if (origin === dest) { alert('Please select different origin and destination.'); return; }

  clearRoute();

  const accessOnly = routeMode === 'accessible';
  const graph      = buildGraph(accessOnly);
  const weightFn   = routeMode === 'coolest' ? coolestWeight : shortestWeight;
  const result     = dijkstra(graph, origin, dest, weightFn);

  if (!result) {
    const msg = accessOnly
      ? 'No wheelchair-accessible route found between these locations.'
      : 'No route found between these locations.';
    alert(msg); return;
  }

  drawRoute(result);
}

// ─── Draw Route ───────────────────────────────────────────────────────────────
function drawRoute(result) {
  const { nodes, edges } = result;

  allPathLayers.forEach(({ layer }) => layer.setStyle({ opacity: 0.15, weight: densityActive ? undefined : 3 }));

  const routeWaypoints = [];
  edges.forEach((edge, i) => {
    let pts = [...edge.waypoints];
    if (edge.from !== nodes[i]) pts = pts.reverse();
    routeWaypoints.push(...(i === 0 ? pts : pts.slice(1)));
  });

  const color = { shortest: '#58a6ff', coolest: '#00b894', accessible: '#a855f7' }[routeMode];

  const glow = L.polyline(routeWaypoints, { color, weight: 18, opacity: 0.12, lineJoin: 'round', lineCap: 'round' }).addTo(map);
  const line = L.polyline(routeWaypoints, { color, weight:  6, opacity: 1,    lineJoin: 'round', lineCap: 'round' }).addTo(map);
  routeLayers.push(glow, line);

  nodes.forEach((id, i) => {
    const bm = buildingMarkers.find(b => b.id === id);
    if (!bm) return;
    bm.marker.setStyle({
      fillColor: color, color: '#fff',
      radius: (i === 0 || i === nodes.length - 1) ? 10 : 7,
      weight: 2.5, fillOpacity: 1,
    });
  });

  map.fitBounds(L.polyline(routeWaypoints).getBounds(), { padding: [80, 80] });
  updateRouteCard(nodes, edges);
}

// ─── Route Card ───────────────────────────────────────────────────────────────
function updateRouteCard(nodes, edges) {
  const totalDist = edges.reduce((s, e) => s + e.distance, 0);
  const avgShade  = Math.round(edges.reduce((s, e) => s + e.shadeScore, 0) / edges.length);
  const walkMins  = Math.ceil(totalDist / 83);
  const allAccess = edges.every(e => e.accessible);
  const avgDens   = (edges.reduce((s, e) => s + e.density, 0) / edges.length).toFixed(1);

  document.getElementById('route-card').classList.remove('hidden');

  const colors = { shortest: 'var(--blue)', coolest: 'var(--green)', accessible: 'var(--purple)' };
  const labels = { shortest: 'Shortest Route', coolest: 'Coolest Route', accessible: 'Accessible Route' };
  const color  = colors[routeMode];

  const badge = document.getElementById('route-mode-badge');
  badge.textContent    = labels[routeMode];
  badge.style.background = color;

  ['stat-distance', 'stat-shade', 'stat-time'].forEach(id => {
    document.getElementById(id).style.color = color;
  });

  document.getElementById('stat-distance').textContent =
    totalDist >= 1000 ? `${(totalDist / 1000).toFixed(2)} km` : `${totalDist} m`;
  document.getElementById('stat-shade').textContent = `${avgShade}%`;
  document.getElementById('stat-time').textContent  = `${walkMins} min`;

  // Path stops
  document.getElementById('route-path-display').innerHTML = nodes.map((id, i) => {
    const b      = getBuilding(id);
    const isEnd  = (i === 0 || i === nodes.length - 1);
    const dotClr = isEnd ? color : 'var(--border)';
    const txtClr = isEnd ? 'var(--text)' : 'var(--text-muted)';
    return `
      <div class="route-stop">
        <div class="route-dot" style="background:${dotClr}"></div>
        <span style="color:${txtClr}">${b.name}</span>
      </div>
      ${i < nodes.length - 1 ? '<div class="route-line-seg"></div>' : ''}
    `;
  }).join('');

  // Accessibility info bar
  const accessDiv = document.getElementById('route-access-info');
  if (routeMode === 'accessible') {
    accessDiv.innerHTML =
      `<span class="access-icon" aria-hidden="true">&#9855;</span> ` +
      `Fully wheelchair accessible &mdash; Avg density: ${avgDens}/3`;
    accessDiv.classList.remove('hidden');
  } else if (!allAccess) {
    accessDiv.innerHTML =
      `<span class="access-icon" aria-hidden="true">&#9888;</span> ` +
      `Route includes 1+ inaccessible segments`;
    accessDiv.style.color = 'var(--yellow)';
    accessDiv.classList.remove('hidden');
  } else {
    accessDiv.classList.add('hidden');
  }

  // Coolest comparison banner
  const compDiv = document.getElementById('route-comparison');
  if (routeMode === 'coolest') {
    const shortResult = dijkstra(buildGraph(false), nodes[0], nodes[nodes.length - 1], shortestWeight);
    if (shortResult) {
      const shortDist  = shortResult.edges.reduce((s, e) => s + e.distance, 0);
      const shortShade = Math.round(shortResult.edges.reduce((s, e) => s + e.shadeScore, 0) / shortResult.edges.length);
      const extra      = totalDist - shortDist;
      compDiv.innerHTML = extra > 10
        ? `+${extra} m longer &mdash; <b>${avgShade}% shade</b> vs <b>${shortShade}%</b> on shortest`
        : `Same distance as shortest &mdash; already the coolest path!`;
      compDiv.classList.remove('hidden');
    }
  } else {
    compDiv.classList.add('hidden');
  }

  // Screen reader announcement
  announce(
    `${labels[routeMode]} found: ${totalDist} metres, ${walkMins} minutes walk, ` +
    `${avgShade}% average shade. ${nodes.length} stops: ` +
    nodes.map(id => getBuilding(id).name).join(', ') + '.'
  );
}

// ─── Clear Route ──────────────────────────────────────────────────────────────
function clearRoute() {
  routeLayers.forEach(l => map.removeLayer(l));
  routeLayers = [];
  allPathLayers.forEach(({ layer }) => layer.setStyle({ opacity: 0.75, weight: densityActive ? undefined : 4 }));
  buildingMarkers.forEach(({ marker }) => marker.setStyle({
    fillColor: '#58a6ff', color: '#0d1117', radius: 6, weight: 2, fillOpacity: 0.95,
  }));
  document.getElementById('route-card').classList.add('hidden');
  document.getElementById('route-comparison').classList.add('hidden');
  document.getElementById('route-access-info').classList.add('hidden');
}

// ─── Corridors Panel ──────────────────────────────────────────────────────────
function populateCorridorsPanel() {
  const sorted = [...PATHS].sort((a, b) => a.shadeScore - b.shadeScore).slice(0, 5);
  document.getElementById('panel-body').innerHTML = sorted.map((path, i) => {
    const fromB      = getBuilding(path.from);
    const toB        = getBuilding(path.to);
    const scoreClass = path.shadeScore < 40 ? 'score-exposed' : 'score-partial';
    const densLabel  = ['', 'Light', 'Mod.', 'Heavy'][path.density];
    return `
      <div class="corridor-item">
        <div class="corridor-rank">#${i + 1}</div>
        <div class="corridor-info">
          <div class="corridor-name">${path.name}</div>
          <div class="corridor-segment">${fromB.name} &rarr; ${toB.name}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
          <div class="corridor-score ${scoreClass}">${path.shadeScore}</div>
          <div class="corridor-density">${densLabel}</div>
        </div>
      </div>
    `;
  }).join('');
}

function togglePanel() {
  panelOpen = !panelOpen;
  document.getElementById('panel-body').classList.toggle('collapsed', !panelOpen);
  const icon = document.getElementById('panel-toggle-icon');
  icon.classList.toggle('collapsed', !panelOpen);
  document.querySelector('.panel-header').setAttribute('aria-expanded', panelOpen);
}
