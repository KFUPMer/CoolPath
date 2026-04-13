// app.js — CoolPath Application Logic

// ─── State ───────────────────────────────────────────────────────────────────
let map;
let routeMode = 'shortest';
let allPathLayers = [];   // { pathId, layer }
let routeLayers = [];     // layers added for current active route
let buildingMarkers = []; // { id, marker }
let panelOpen = true;

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
    center: [26.3065, 50.1595],
    zoom: 15,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

// ─── Draw All Paths ───────────────────────────────────────────────────────────
function shadeColor(score) {
  if (score >= 70) return '#00b894';
  if (score >= 40) return '#f0a500';
  return '#e05252';
}

function drawAllPaths() {
  allPathLayers = [];
  PATHS.forEach(path => {
    const layer = L.polyline(path.waypoints, {
      color:   shadeColor(path.shadeScore),
      weight:  4,
      opacity: 0.72,
      lineJoin: 'round',
      lineCap:  'round',
    }).addTo(map);

    layer.bindTooltip(
      `<b>${path.name}</b><br>Shade: ${path.shadeScore}/100 &nbsp;|&nbsp; ${path.distance} m`,
      { sticky: true }
    );

    allPathLayers.push({ pathId: path.id, layer });
  });
}

function drawBuildingMarkers() {
  buildingMarkers = [];
  BUILDINGS.forEach(b => {
    const marker = L.circleMarker(b.coords, {
      radius: 6,
      fillColor: '#58a6ff',
      color: '#0d1117',
      weight: 2,
      fillOpacity: 0.95,
    }).addTo(map);

    marker.bindTooltip(b.name, { direction: 'top' });
    buildingMarkers.push({ id: b.id, marker });
  });
}

// ─── Graph & Dijkstra ─────────────────────────────────────────────────────────
function buildGraph() {
  const graph = {};
  BUILDINGS.forEach(b => { graph[b.id] = []; });
  PATHS.forEach(p => {
    graph[p.from].push({ node: p.to,   edge: p });
    graph[p.to].push(  { node: p.from, edge: p });
  });
  return graph;
}

function dijkstra(graph, start, end, weightFn) {
  const dist     = {};
  const prev     = {};
  const prevEdge = {};
  const visited  = new Set();

  Object.keys(graph).forEach(n => {
    dist[n]     = Infinity;
    prev[n]     = null;
    prevEdge[n] = null;
  });
  dist[start] = 0;

  // Simple array-based priority queue (graph is small ~12 nodes)
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
        dist[v]     = nd;
        prev[v]     = u;
        prevEdge[v] = edge;
        pq.push([nd, v]);
      }
    }
  }

  if (dist[end] === Infinity) return null;

  // Reconstruct
  const nodes = [];
  const edges = [];
  let cur = end;
  while (cur !== null) {
    nodes.unshift(cur);
    if (prevEdge[cur]) edges.unshift(prevEdge[cur]);
    cur = prev[cur];
  }
  return { nodes, edges };
}

// Weight functions
const shortestWeight = edge => edge.distance;
// coolest: penalize exposure heavily so shaded paths win even if longer
const coolestWeight  = edge => edge.distance * (1 + 2.5 * (100 - edge.shadeScore) / 100);

// ─── UI Actions ───────────────────────────────────────────────────────────────
function setMode(mode) {
  routeMode = mode;
  document.getElementById('btn-shortest').classList.toggle('active', mode === 'shortest');
  document.getElementById('btn-coolest').classList.toggle('active', mode === 'coolest');
}

function findAndDrawRoute() {
  const origin = document.getElementById('origin').value;
  const dest   = document.getElementById('destination').value;

  if (origin === dest) {
    alert('Please select different origin and destination.');
    return;
  }

  clearRoute();

  const graph    = buildGraph();
  const weightFn = routeMode === 'coolest' ? coolestWeight : shortestWeight;
  const result   = dijkstra(graph, origin, dest, weightFn);

  if (!result) {
    alert('No route found between these locations.');
    return;
  }

  drawRoute(result);
}

// ─── Draw Route ───────────────────────────────────────────────────────────────
function drawRoute(result) {
  const { nodes, edges } = result;

  // Dim all background paths
  allPathLayers.forEach(({ layer }) => layer.setStyle({ opacity: 0.18, weight: 3 }));

  // Build ordered waypoints for the route polyline
  const routeWaypoints = [];
  edges.forEach((edge, i) => {
    let pts = [...edge.waypoints];
    if (edge.from !== nodes[i]) pts = pts.reverse();
    routeWaypoints.push(...(i === 0 ? pts : pts.slice(1)));
  });

  const color = routeMode === 'coolest' ? '#00b894' : '#58a6ff';

  // Glow / halo layer
  const glowLayer = L.polyline(routeWaypoints, {
    color, weight: 18, opacity: 0.15, lineJoin: 'round', lineCap: 'round',
  }).addTo(map);
  routeLayers.push(glowLayer);

  // Main route line
  const routeLine = L.polyline(routeWaypoints, {
    color, weight: 6, opacity: 1, lineJoin: 'round', lineCap: 'round',
  }).addTo(map);
  routeLayers.push(routeLine);

  // Highlight route building markers
  nodes.forEach((id, i) => {
    const bm = buildingMarkers.find(b => b.id === id);
    if (!bm) return;
    const isEndpoint = (i === 0 || i === nodes.length - 1);
    bm.marker.setStyle({
      fillColor: color,
      color:     '#fff',
      radius:    isEndpoint ? 10 : 7,
      weight:    2.5,
      fillOpacity: 1,
    });
  });

  // Fit map
  map.fitBounds(L.polyline(routeWaypoints).getBounds(), { padding: [80, 80] });

  updateRouteCard(nodes, edges);
}

// ─── Route Info Card ──────────────────────────────────────────────────────────
function updateRouteCard(nodes, edges) {
  const totalDist = edges.reduce((s, e) => s + e.distance, 0);
  const avgShade  = Math.round(edges.reduce((s, e) => s + e.shadeScore, 0) / edges.length);
  const walkMins  = Math.ceil(totalDist / 83); // ~83 m/min walking pace

  const card = document.getElementById('route-card');
  card.classList.remove('hidden');

  const color = routeMode === 'coolest' ? 'var(--green)' : 'var(--blue)';
  const badge = document.getElementById('route-mode-badge');
  badge.textContent = routeMode === 'coolest' ? 'Coolest Route' : 'Shortest Route';
  badge.style.background = routeMode === 'coolest' ? 'var(--green)' : 'var(--blue)';

  document.getElementById('stat-distance').style.color = color;
  document.getElementById('stat-shade').style.color    = color;
  document.getElementById('stat-time').style.color     = color;

  document.getElementById('stat-distance').textContent =
    totalDist >= 1000 ? `${(totalDist / 1000).toFixed(1)} km` : `${totalDist} m`;

  document.getElementById('stat-shade').textContent = `${avgShade}%`;
  document.getElementById('stat-time').textContent  = `${walkMins} min`;

  // Path stops
  const pathDisplay = document.getElementById('route-path-display');
  pathDisplay.innerHTML = nodes.map((id, i) => {
    const b         = getBuilding(id);
    const isEnd     = (i === 0 || i === nodes.length - 1);
    const dotColor  = isEnd ? (routeMode === 'coolest' ? 'var(--green)' : 'var(--blue)') : 'var(--border)';
    const textColor = isEnd ? 'var(--text)' : 'var(--text-muted)';
    const last      = i === nodes.length - 1;
    return `
      <div class="route-stop">
        <div class="route-dot" style="background:${dotColor}"></div>
        <span style="color:${textColor}">${b.name}</span>
      </div>
      ${!last ? '<div class="route-line-seg"></div>' : ''}
    `;
  }).join('');

  // Comparison banner for coolest mode
  const compDiv = document.getElementById('route-comparison');
  if (routeMode === 'coolest') {
    const graph       = buildGraph();
    const shortResult = dijkstra(graph, nodes[0], nodes[nodes.length - 1], shortestWeight);
    if (shortResult) {
      const shortDist  = shortResult.edges.reduce((s, e) => s + e.distance, 0);
      const shortShade = Math.round(shortResult.edges.reduce((s, e) => s + e.shadeScore, 0) / shortResult.edges.length);
      const extraDist  = totalDist - shortDist;
      if (extraDist > 10) {
        compDiv.innerHTML =
          `+${extraDist} m longer than shortest &mdash; but <b>${avgShade}% shade</b> vs <b>${shortShade}% shade</b> on the direct route`;
      } else {
        compDiv.innerHTML = `Same distance as shortest &mdash; and cooler too!`;
      }
      compDiv.classList.remove('hidden');
    }
  } else {
    compDiv.classList.add('hidden');
  }
}

// ─── Clear Route ──────────────────────────────────────────────────────────────
function clearRoute() {
  routeLayers.forEach(l => map.removeLayer(l));
  routeLayers = [];

  allPathLayers.forEach(({ layer }) => layer.setStyle({ opacity: 0.72, weight: 4 }));

  buildingMarkers.forEach(({ marker }) => marker.setStyle({
    fillColor:   '#58a6ff',
    color:       '#0d1117',
    radius:      6,
    weight:      2,
    fillOpacity: 0.95,
  }));

  document.getElementById('route-card').classList.add('hidden');
  document.getElementById('route-comparison').classList.add('hidden');
}

// ─── Corridors Panel ──────────────────────────────────────────────────────────
function populateCorridorsPanel() {
  const sorted = [...PATHS].sort((a, b) => a.shadeScore - b.shadeScore).slice(0, 5);
  const body   = document.getElementById('panel-body');

  body.innerHTML = sorted.map((path, i) => {
    const fromB       = getBuilding(path.from);
    const toB         = getBuilding(path.to);
    const scoreClass  = path.shadeScore < 40 ? 'score-exposed' : 'score-partial';
    return `
      <div class="corridor-item">
        <div class="corridor-rank">#${i + 1}</div>
        <div class="corridor-info">
          <div class="corridor-name">${path.name}</div>
          <div class="corridor-segment">${fromB.name} &rarr; ${toB.name}</div>
        </div>
        <div class="corridor-score ${scoreClass}">${path.shadeScore}</div>
      </div>
    `;
  }).join('');
}

function togglePanel() {
  panelOpen = !panelOpen;
  const body = document.getElementById('panel-body');
  const icon = document.getElementById('panel-toggle-icon');
  body.classList.toggle('collapsed', !panelOpen);
  icon.classList.toggle('collapsed', !panelOpen);
}
