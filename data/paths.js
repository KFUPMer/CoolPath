// data/paths.js — KFUPM Campus Data (coordinates verified via OpenStreetMap)
// Confirmed OSM sources: building operator=KFUPM, bus_station nodes

const BUILDINGS = [
  { id: 'main_gate',    name: 'Gate 1',                         coords: [26.3091, 50.1496] },
  { id: 'mall',         name: 'KFUPM Village Mall',             coords: [26.3137, 50.1481] },
  { id: 'bldg24',       name: 'Building 24 (Business)',         coords: [26.3048, 50.1467] },
  { id: 'bldg22',       name: 'Building 22 (CS Dept)',          coords: [26.3057, 50.1465] },
  { id: 'bldg11',       name: 'Building 11 (Sports Hall)',      coords: [26.3052, 50.1455] },
  { id: 'bldg59',       name: 'Building 59 (Engineering)',      coords: [26.3082, 50.1450] },
  { id: 'student_rest', name: 'Student Restaurant',             coords: [26.3105, 50.1446] },
  { id: 'bldg76',       name: 'Building 76 (Petroleum Eng)',   coords: [26.3056, 50.1479] },
  { id: 'medical',      name: 'Medical Center (Bldg 27)',       coords: [26.3054, 50.1499] },
  { id: 'library',      name: 'Library (Bldg 9)',               coords: [26.3078, 50.1503] },
  { id: 'bldg39',       name: 'Building 39',                    coords: [26.3101, 50.1461] },
  { id: 'bldg42',       name: 'Building 42 (Classrooms)',       coords: [26.3108, 50.1487] },
  { id: 'masjid',       name: 'Central Masjid',                 coords: [26.3138, 50.1462] },
  { id: 'bldg58',       name: 'Building 58 (Admin)',            coords: [26.3148, 50.1489] },
  { id: 'bldg54',       name: 'Building 54',                    coords: [26.3072, 50.1544] },
];

function getBuilding(id) {
  return BUILDINGS.find(b => b.id === id);
}

// Notable campus landmarks — GPS-verified by user
const LANDMARKS = [
  { id: 'lm_tower',      name: 'KFUPM Tower (البرج)',  coords: [26.3084, 50.1429], icon: '🗼' },
  { id: 'lm_green',      name: 'Green Fields',          coords: [26.3086, 50.1465], icon: '🟩' },
  { id: 'lm_volleyball', name: 'Volleyball Fields',     coords: [26.3097, 50.1455], icon: '🏐' },
  { id: 'lm_gate2',      name: 'Gate 2',                coords: [26.3155, 50.1397], icon: '🚗' },
  { id: 'lm_gate3',      name: 'Gate 3',                coords: [26.3081, 50.1533], icon: '🚗' },
];


// shadeScore: 0 = fully exposed, 100 = fully shaded
// accessible: wheelchair-friendly
// density:    1=quiet, 2=moderate, 3=busy
// type:       'walk' | 'bus'
const PATHS = [
  // ── Walking paths ──────────────────────────────────────────────────────────
  {
    id: 'p01', from: 'main_gate', to: 'mall',
    name: 'Gate Entry Road',
    waypoints: [[26.3091,50.1496],[26.3110,50.1490],[26.3137,50.1481]],
    distance: 520, shadeScore: 18, accessible: true, density: 3, type: 'walk',
  },
  {
    id: 'p02', from: 'mall', to: 'bldg24',
    name: 'Main Campus Boulevard',
    waypoints: [[26.3137,50.1481],[26.3090,50.1474],[26.3048,50.1467]],
    distance: 990, shadeScore: 22, accessible: true, density: 3, type: 'walk',
  },
  {
    id: 'p03', from: 'main_gate', to: 'medical',
    name: 'Clinic Boulevard',
    waypoints: [[26.3091,50.1496],[26.3075,50.1497],[26.3054,50.1499]],
    distance: 420, shadeScore: 20, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p04', from: 'bldg24', to: 'bldg22',
    name: 'Academic Walk',
    waypoints: [[26.3048,50.1467],[26.3053,50.1466],[26.3057,50.1465]],
    distance: 102, shadeScore: 68, accessible: true, density: 3, type: 'walk',
  },
  {
    id: 'p05', from: 'bldg22', to: 'bldg59',
    name: 'Engineering Corridor',
    waypoints: [[26.3057,50.1465],[26.3070,50.1458],[26.3082,50.1450]],
    distance: 302, shadeScore: 55, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p06', from: 'bldg24', to: 'bldg11',
    name: 'Sports Path',
    waypoints: [[26.3048,50.1467],[26.3050,50.1461],[26.3052,50.1455]],
    distance: 137, shadeScore: 60, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p07', from: 'bldg11', to: 'student_rest',
    name: 'Open Desert Walk',
    waypoints: [[26.3052,50.1455],[26.3079,50.1451],[26.3105,50.1446]],
    distance: 588, shadeScore: 18, accessible: false, density: 1, type: 'walk',
  },
  {
    id: 'p08', from: 'bldg59', to: 'student_rest',
    name: 'Restaurant Path',
    waypoints: [[26.3082,50.1450],[26.3094,50.1448],[26.3105,50.1446]],
    distance: 256, shadeScore: 40, accessible: true, density: 3, type: 'walk',
  },
  {
    id: 'p09', from: 'bldg22', to: 'bldg76',
    name: 'Shaded Shortcut',
    waypoints: [[26.3057,50.1465],[26.3057,50.1472],[26.3056,50.1479]],
    distance: 157, shadeScore: 72, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p10', from: 'bldg76', to: 'medical',
    name: 'Clinic Path',
    waypoints: [[26.3056,50.1479],[26.3055,50.1489],[26.3054,50.1499]],
    distance: 223, shadeScore: 48, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p11', from: 'medical', to: 'library',
    name: 'Library Shortcut',
    waypoints: [[26.3054,50.1499],[26.3066,50.1501],[26.3078,50.1503]],
    distance: 267, shadeScore: 65, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p12', from: 'library', to: 'bldg42',
    name: 'Library–Classrooms Walk',
    waypoints: [[26.3078,50.1503],[26.3093,50.1495],[26.3108,50.1487]],
    distance: 346, shadeScore: 70, accessible: true, density: 3, type: 'walk',
  },
  {
    id: 'p13', from: 'bldg42', to: 'masjid',
    name: 'Campus Loop North',
    waypoints: [[26.3108,50.1487],[26.3123,50.1475],[26.3138,50.1462]],
    distance: 423, shadeScore: 50, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p14', from: 'library', to: 'masjid',
    name: 'Masjid Path',
    waypoints: [[26.3078,50.1503],[26.3108,50.1483],[26.3138,50.1462]],
    distance: 680, shadeScore: 62, accessible: true, density: 3, type: 'walk',
  },
  {
    id: 'p15', from: 'library', to: 'bldg58',
    name: 'North Admin Road',
    waypoints: [[26.3078,50.1503],[26.3113,50.1496],[26.3148,50.1489]],
    distance: 760, shadeScore: 35, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p16', from: 'masjid', to: 'bldg58',
    name: 'Masjid–Admin Walk',
    waypoints: [[26.3138,50.1462],[26.3143,50.1476],[26.3148,50.1489]],
    distance: 310, shadeScore: 65, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p17', from: 'student_rest', to: 'masjid',
    name: 'Long Exposed Road',
    waypoints: [[26.3105,50.1446],[26.3122,50.1454],[26.3138,50.1462]],
    distance: 377, shadeScore: 25, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p18', from: 'student_rest', to: 'bldg39',
    name: 'Central Link',
    waypoints: [[26.3105,50.1446],[26.3103,50.1454],[26.3101,50.1461]],
    distance: 172, shadeScore: 45, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p19', from: 'bldg39', to: 'bldg42',
    name: 'Inner Campus Road',
    waypoints: [[26.3101,50.1461],[26.3104,50.1474],[26.3108,50.1487]],
    distance: 291, shadeScore: 52, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p20', from: 'bldg76', to: 'library',
    name: 'Shaded Tree Line',
    waypoints: [[26.3056,50.1479],[26.3067,50.1491],[26.3078,50.1503]],
    distance: 310, shadeScore: 75, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p21', from: 'bldg24', to: 'medical',
    name: 'Exposed Side Road',
    waypoints: [[26.3048,50.1467],[26.3051,50.1483],[26.3054,50.1499]],
    distance: 360, shadeScore: 28, accessible: false, density: 1, type: 'walk',
  },
  {
    id: 'p22', from: 'library', to: 'bldg54',
    name: 'East Wing Path',
    waypoints: [[26.3078,50.1503],[26.3075,50.1524],[26.3072,50.1544]],
    distance: 456, shadeScore: 42, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p23', from: 'mall', to: 'medical',
    name: 'Village–Clinic Road',
    waypoints: [[26.3010,50.1490],[26.3032,50.1495],[26.3054,50.1499]],
    distance: 499, shadeScore: 30, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p24', from: 'bldg59', to: 'bldg42',
    name: 'North Link',
    waypoints: [[26.3082,50.1450],[26.3095,50.1469],[26.3108,50.1487]],
    distance: 474, shadeScore: 42, accessible: true, density: 1, type: 'walk',
  },

  // ── Low-density alternative paths ────────────────────────────────────────────
  {
    id: 'p25', from: 'bldg22', to: 'bldg11',
    name: 'Quiet Sports Diagonal',
    waypoints: [[26.3057,50.1465],[26.3054,50.1460],[26.3052,50.1455]],
    distance: 120, shadeScore: 55, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p26', from: 'bldg76', to: 'bldg42',
    name: 'Petroleum–Classrooms Cut',
    waypoints: [[26.3056,50.1479],[26.3082,50.1483],[26.3108,50.1487]],
    distance: 380, shadeScore: 60, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p27', from: 'bldg39', to: 'masjid',
    name: 'Quiet North Corridor',
    waypoints: [[26.3101,50.1461],[26.3119,50.1461],[26.3138,50.1462]],
    distance: 415, shadeScore: 30, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p28', from: 'bldg54', to: 'bldg58',
    name: 'East Wing Bypass',
    waypoints: [[26.3072,50.1544],[26.3110,50.1516],[26.3148,50.1489]],
    distance: 520, shadeScore: 35, accessible: true, density: 1, type: 'walk',
  },
  {
    id: 'p29', from: 'student_rest', to: 'bldg42',
    name: 'Cafeteria Side Lane',
    waypoints: [[26.3105,50.1446],[26.3106,50.1467],[26.3108,50.1487]],
    distance: 335, shadeScore: 38, accessible: true, density: 2, type: 'walk',
  },
  {
    id: 'p30', from: 'bldg11', to: 'bldg59',
    name: 'Sports–Engineering Back Road',
    waypoints: [[26.3052,50.1455],[26.3067,50.1452],[26.3082,50.1450]],
    distance: 316, shadeScore: 45, accessible: true, density: 1, type: 'walk',
  },

  // ── Bus routes (Route A — Blue Line) ─────────────────────────────────────
  // Main Gate ↔ Medical ↔ Engineering ↔ Central ↔ North (Masjid) ↔ Admin
  {
    id: 'b01', from: 'main_gate', to: 'mall',
    name: 'Bus A: Gate → Village',
    waypoints: [[26.2997,50.1484],[26.3004,50.1487],[26.3010,50.1490]],
    distance: 148, shadeScore: 50, accessible: true, density: 3, type: 'bus',
  },
  {
    id: 'b02', from: 'mall', to: 'medical',
    name: 'Bus A: Village → Medical',
    waypoints: [[26.3010,50.1490],[26.3032,50.1492],[26.3059,50.1493]],
    distance: 551, shadeScore: 50, accessible: true, density: 3, type: 'bus',
  },
  {
    id: 'b03', from: 'medical', to: 'bldg59',
    name: 'Bus A: Medical → Engineering',
    waypoints: [[26.3059,50.1493],[26.3071,50.1472],[26.3083,50.1456]],
    distance: 511, shadeScore: 50, accessible: true, density: 2, type: 'bus',
  },
  {
    id: 'b04', from: 'bldg59', to: 'bldg39',
    name: 'Bus A: Engineering → Central',
    waypoints: [[26.3083,50.1456],[26.3092,50.1459],[26.3101,50.1461]],
    distance: 202, shadeScore: 50, accessible: true, density: 2, type: 'bus',
  },
  {
    id: 'b05', from: 'bldg39', to: 'bldg42',
    name: 'Bus A: Central → Classrooms',
    waypoints: [[26.3101,50.1461],[26.3104,50.1474],[26.3110,50.1482]],
    distance: 240, shadeScore: 50, accessible: true, density: 2, type: 'bus',
  },
  {
    id: 'b06', from: 'bldg42', to: 'masjid',
    name: 'Bus A: Central → North',
    waypoints: [[26.3110,50.1482],[26.3124,50.1472],[26.3138,50.1462]],
    distance: 363, shadeScore: 50, accessible: true, density: 2, type: 'bus',
  },
  {
    id: 'b07', from: 'masjid', to: 'bldg58',
    name: 'Bus A: Masjid → Admin',
    waypoints: [[26.3138,50.1462],[26.3143,50.1476],[26.3148,50.1489]],
    distance: 310, shadeScore: 50, accessible: true, density: 1, type: 'bus',
  },

  // ── Bus routes (Route B — Green Line) ────────────────────────────────────
  // Medical ↔ Library ↔ Building 42 loop
  {
    id: 'b08', from: 'mall', to: 'bldg24',
    name: 'Bus B: Village → Academic',
    waypoints: [[26.3010,50.1490],[26.3029,50.1479],[26.3048,50.1467]],
    distance: 448, shadeScore: 50, accessible: true, density: 3, type: 'bus',
  },
  {
    id: 'b09', from: 'bldg22', to: 'library',
    name: 'Bus B: CS → Library',
    waypoints: [[26.3057,50.1465],[26.3068,50.1484],[26.3078,50.1503]],
    distance: 436, shadeScore: 50, accessible: true, density: 2, type: 'bus',
  },
  {
    id: 'b10', from: 'library', to: 'bldg58',
    name: 'Bus B: Library → Admin',
    waypoints: [[26.3078,50.1503],[26.3113,50.1496],[26.3148,50.1489]],
    distance: 760, shadeScore: 50, accessible: true, density: 1, type: 'bus',
  },
];

// Urban heat points for heatmap overlay
const HEAT_POINTS = PATHS.filter(p=>p.type==='walk').map(p => {
  const mid = p.waypoints[Math.floor(p.waypoints.length / 2)];
  return { lat: mid[0], lng: mid[1], heat: (100 - p.shadeScore) / 100 };
});
