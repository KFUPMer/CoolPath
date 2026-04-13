// data/paths.js — KFUPM Campus Data (coordinates verified via OpenStreetMap)
// Campus bounding box: 26.299–26.317 N, 50.144–50.155 E

const BUILDINGS = [
  { id: 'main_gate',    name: 'Main Gate (South)',            coords: [26.2997, 50.1484] },
  { id: 'bldg24',       name: 'Building 24 (Business)',       coords: [26.3048, 50.1467] },
  { id: 'bldg22',       name: 'Building 22 (CS Dept)',        coords: [26.3057, 50.1465] },
  { id: 'bldg11',       name: 'Building 11 (Sports Hall)',    coords: [26.3052, 50.1455] },
  { id: 'bldg59',       name: 'Building 59 (Engineering)',    coords: [26.3082, 50.1450] },
  { id: 'student_rest', name: 'Student Restaurant',           coords: [26.3105, 50.1446] },
  { id: 'bldg76',       name: 'Building 76 (Petroleum Eng)', coords: [26.3056, 50.1479] },
  { id: 'medical',      name: 'Medical Center (Bldg 27)',     coords: [26.3054, 50.1499] },
  { id: 'library',      name: 'Library',                      coords: [26.3090, 50.1505] },
  { id: 'bldg42',       name: 'Building 42 (Classrooms)',     coords: [26.3108, 50.1487] },
  { id: 'masjid',       name: 'Central Masjid',               coords: [26.3138, 50.1462] },
  { id: 'bldg58',       name: 'Building 58',                  coords: [26.3148, 50.1489] },
];

function getBuilding(id) {
  return BUILDINGS.find(b => b.id === id);
}

// shadeScore:  0 = fully exposed, 100 = fully shaded
// accessible:  wheelchair-friendly (smooth, no steps, ramps available)
// density:     1 = quiet, 2 = moderate, 3 = busy
const PATHS = [
  {
    id: 'p01', from: 'main_gate', to: 'bldg24',
    name: 'Main Entrance Road',
    waypoints: [[26.2997,50.1484],[26.3022,50.1475],[26.3048,50.1467]],
    distance: 565, shadeScore: 22, accessible: true, density: 3,
  },
  {
    id: 'p02', from: 'main_gate', to: 'medical',
    name: 'Clinic Boulevard',
    waypoints: [[26.2997,50.1484],[26.3025,50.1491],[26.3054,50.1499]],
    distance: 638, shadeScore: 20, accessible: true, density: 2,
  },
  {
    id: 'p03', from: 'bldg24', to: 'bldg22',
    name: 'Academic Walk',
    waypoints: [[26.3048,50.1467],[26.3053,50.1466],[26.3057,50.1465]],
    distance: 102, shadeScore: 68, accessible: true, density: 3,
  },
  {
    id: 'p04', from: 'bldg22', to: 'bldg59',
    name: 'Engineering Corridor',
    waypoints: [[26.3057,50.1465],[26.3070,50.1458],[26.3082,50.1450]],
    distance: 302, shadeScore: 55, accessible: true, density: 2,
  },
  {
    id: 'p05', from: 'bldg24', to: 'bldg11',
    name: 'Sports Path',
    waypoints: [[26.3048,50.1467],[26.3050,50.1461],[26.3052,50.1455]],
    distance: 137, shadeScore: 60, accessible: true, density: 1,
  },
  {
    id: 'p06', from: 'bldg11', to: 'student_rest',
    name: 'Open Desert Walk',
    waypoints: [[26.3052,50.1455],[26.3079,50.1451],[26.3105,50.1446]],
    distance: 588, shadeScore: 18, accessible: false, density: 1,
  },
  {
    id: 'p07', from: 'bldg59', to: 'student_rest',
    name: 'Restaurant Path',
    waypoints: [[26.3082,50.1450],[26.3094,50.1448],[26.3105,50.1446]],
    distance: 256, shadeScore: 40, accessible: true, density: 3,
  },
  {
    id: 'p08', from: 'bldg22', to: 'bldg76',
    name: 'Shaded Shortcut',
    waypoints: [[26.3057,50.1465],[26.3057,50.1472],[26.3056,50.1479]],
    distance: 157, shadeScore: 72, accessible: true, density: 2,
  },
  {
    id: 'p09', from: 'bldg76', to: 'medical',
    name: 'Clinic Path',
    waypoints: [[26.3056,50.1479],[26.3055,50.1489],[26.3054,50.1499]],
    distance: 223, shadeScore: 48, accessible: true, density: 2,
  },
  {
    id: 'p10', from: 'medical', to: 'bldg42',
    name: 'Covered Walkway',
    waypoints: [[26.3054,50.1499],[26.3081,50.1493],[26.3108,50.1487]],
    distance: 611, shadeScore: 78, accessible: true, density: 2,
  },
  {
    id: 'p11', from: 'bldg42', to: 'library',
    name: 'Library Walk',
    waypoints: [[26.3108,50.1487],[26.3099,50.1496],[26.3090,50.1505]],
    distance: 264, shadeScore: 70, accessible: true, density: 3,
  },
  {
    id: 'p12', from: 'library', to: 'masjid',
    name: 'Masjid Path',
    waypoints: [[26.3090,50.1505],[26.3114,50.1484],[26.3138,50.1462]],
    distance: 594, shadeScore: 62, accessible: true, density: 3,
  },
  {
    id: 'p13', from: 'library', to: 'bldg58',
    name: 'North Admin Road',
    waypoints: [[26.3090,50.1505],[26.3119,50.1497],[26.3148,50.1489]],
    distance: 652, shadeScore: 35, accessible: true, density: 1,
  },
  {
    id: 'p14', from: 'masjid', to: 'bldg58',
    name: 'Shaded Masjid Walk',
    waypoints: [[26.3138,50.1462],[26.3143,50.1476],[26.3148,50.1489]],
    distance: 310, shadeScore: 65, accessible: true, density: 2,
  },
  {
    id: 'p15', from: 'student_rest', to: 'masjid',
    name: 'Long Exposed Road',
    waypoints: [[26.3105,50.1446],[26.3122,50.1454],[26.3138,50.1462]],
    distance: 377, shadeScore: 25, accessible: true, density: 2,
  },
  {
    id: 'p16', from: 'bldg42', to: 'masjid',
    name: 'Campus Loop',
    waypoints: [[26.3108,50.1487],[26.3123,50.1475],[26.3138,50.1462]],
    distance: 423, shadeScore: 50, accessible: true, density: 2,
  },
  {
    id: 'p17', from: 'medical', to: 'library',
    name: 'Library Shortcut',
    waypoints: [[26.3054,50.1499],[26.3072,50.1502],[26.3090,50.1505]],
    distance: 380, shadeScore: 55, accessible: true, density: 2,
  },
  {
    id: 'p18', from: 'bldg59', to: 'bldg42',
    name: 'North Link',
    waypoints: [[26.3082,50.1450],[26.3095,50.1469],[26.3108,50.1487]],
    distance: 474, shadeScore: 42, accessible: true, density: 1,
  },
  {
    id: 'p19', from: 'bldg24', to: 'medical',
    name: 'Exposed Side Road',
    waypoints: [[26.3048,50.1467],[26.3051,50.1483],[26.3054,50.1499]],
    distance: 360, shadeScore: 28, accessible: false, density: 1,
  },
  {
    id: 'p20', from: 'bldg76', to: 'library',
    name: 'Shaded Tree Line',
    waypoints: [[26.3056,50.1479],[26.3073,50.1492],[26.3090,50.1505]],
    distance: 398, shadeScore: 75, accessible: true, density: 2,
  },
];

// Urban heat points used by heatmap overlay
// Generated from path data — each entry [lat, lng, intensity 0-1]
const HEAT_POINTS = PATHS.map(p => {
  const mid = p.waypoints[Math.floor(p.waypoints.length / 2)];
  return { lat: mid[0], lng: mid[1], heat: (100 - p.shadeScore) / 100 };
});
