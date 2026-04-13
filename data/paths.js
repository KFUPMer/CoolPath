// data/paths.js — KFUPM Campus Building & Path Data

const BUILDINGS = [
  { id: 'main_gate',      name: 'Main Gate',               coords: [26.3028, 50.1520] },
  { id: 'clinic',         name: 'KFUPM Clinic',             coords: [26.3038, 50.1548] },
  { id: 'student_center', name: 'Student Center',           coords: [26.3060, 50.1568] },
  { id: 'admin',          name: 'Administration (Bldg 1)',  coords: [26.3073, 50.1580] },
  { id: 'library',        name: 'Library',                  coords: [26.3072, 50.1608] },
  { id: 'bldg58',         name: 'Building 58',              coords: [26.3060, 50.1598] },
  { id: 'masjid',         name: 'Central Masjid',           coords: [26.3085, 50.1592] },
  { id: 'bldg22',         name: 'Building 22',              coords: [26.3103, 50.1618] },
  { id: 'bldg24',         name: 'Building 24',              coords: [26.3098, 50.1632] },
  { id: 'bldg34',         name: 'Building 34',              coords: [26.3090, 50.1645] },
  { id: 'gym',            name: 'Gym / Sports Complex',     coords: [26.3050, 50.1655] },
  { id: 'swimming',       name: 'Swimming Pool',            coords: [26.3042, 50.1668] },
];

function getBuilding(id) {
  return BUILDINGS.find(b => b.id === id);
}

// shadeScore: 0 = fully exposed sun, 100 = fully shaded
const PATHS = [
  {
    id: 'p01', from: 'main_gate', to: 'clinic',
    name: 'Gate Road',
    waypoints: [[26.3028, 50.1520], [26.3033, 50.1534], [26.3038, 50.1548]],
    distance: 291, shadeScore: 22,
  },
  {
    id: 'p02', from: 'main_gate', to: 'student_center',
    name: 'Main Boulevard',
    waypoints: [[26.3028, 50.1520], [26.3044, 50.1544], [26.3060, 50.1568]],
    distance: 582, shadeScore: 30,
  },
  {
    id: 'p03', from: 'clinic', to: 'student_center',
    name: 'Clinic Side Path',
    waypoints: [[26.3038, 50.1548], [26.3049, 50.1558], [26.3060, 50.1568]],
    distance: 310, shadeScore: 45,
  },
  {
    id: 'p04', from: 'student_center', to: 'admin',
    name: 'Central Path',
    waypoints: [[26.3060, 50.1568], [26.3067, 50.1574], [26.3073, 50.1580]],
    distance: 184, shadeScore: 65,
  },
  {
    id: 'p05', from: 'student_center', to: 'masjid',
    name: 'Covered Walkway',
    waypoints: [[26.3060, 50.1568], [26.3072, 50.1580], [26.3085, 50.1592]],
    distance: 361, shadeScore: 80,
  },
  {
    id: 'p06', from: 'admin', to: 'library',
    name: 'Academic Corridor',
    waypoints: [[26.3073, 50.1580], [26.3073, 50.1594], [26.3072, 50.1608]],
    distance: 269, shadeScore: 72,
  },
  {
    id: 'p07', from: 'admin', to: 'bldg58',
    name: 'Admin Inner Road',
    waypoints: [[26.3073, 50.1580], [26.3067, 50.1589], [26.3060, 50.1598]],
    distance: 225, shadeScore: 55,
  },
  {
    id: 'p08', from: 'library', to: 'masjid',
    name: 'Library–Masjid Path',
    waypoints: [[26.3072, 50.1608], [26.3079, 50.1600], [26.3085, 50.1592]],
    distance: 211, shadeScore: 78,
  },
  {
    id: 'p09', from: 'library', to: 'bldg22',
    name: 'North Academic Walk',
    waypoints: [[26.3072, 50.1608], [26.3088, 50.1613], [26.3103, 50.1618]],
    distance: 357, shadeScore: 50,
  },
  {
    id: 'p10', from: 'library', to: 'bldg58',
    name: 'Library Shortcut',
    waypoints: [[26.3072, 50.1608], [26.3066, 50.1603], [26.3060, 50.1598]],
    distance: 164, shadeScore: 70,
  },
  {
    id: 'p11', from: 'masjid', to: 'bldg24',
    name: 'Open Plaza Walk',
    waypoints: [[26.3085, 50.1592], [26.3092, 50.1612], [26.3098, 50.1632]],
    distance: 411, shadeScore: 25,
  },
  {
    id: 'p12', from: 'masjid', to: 'bldg34',
    name: 'East Corridor',
    waypoints: [[26.3085, 50.1592], [26.3088, 50.1619], [26.3090, 50.1645]],
    distance: 464, shadeScore: 55,
  },
  {
    id: 'p13', from: 'bldg22', to: 'bldg24',
    name: 'Engineering Corridor',
    waypoints: [[26.3103, 50.1618], [26.3101, 50.1625], [26.3098, 50.1632]],
    distance: 145, shadeScore: 68,
  },
  {
    id: 'p14', from: 'bldg22', to: 'bldg34',
    name: 'Shaded Tree Path',
    waypoints: [[26.3103, 50.1618], [26.3097, 50.1631], [26.3090, 50.1645]],
    distance: 255, shadeScore: 72,
  },
  {
    id: 'p15', from: 'bldg24', to: 'bldg34',
    name: 'Bldg 24–34 Link',
    waypoints: [[26.3098, 50.1632], [26.3094, 50.1639], [26.3090, 50.1645]],
    distance: 117, shadeScore: 60,
  },
  {
    id: 'p16', from: 'bldg34', to: 'gym',
    name: 'Desert Stretch',
    waypoints: [[26.3090, 50.1645], [26.3070, 50.1650], [26.3050, 50.1655]],
    distance: 468, shadeScore: 18,
  },
  {
    id: 'p17', from: 'gym', to: 'swimming',
    name: 'Sports Path',
    waypoints: [[26.3050, 50.1655], [26.3046, 50.1662], [26.3042, 50.1668]],
    distance: 153, shadeScore: 42,
  },
  {
    id: 'p18', from: 'bldg24', to: 'gym',
    name: 'Long Exposed Road',
    waypoints: [[26.3098, 50.1632], [26.3074, 50.1644], [26.3050, 50.1655]],
    distance: 577, shadeScore: 20,
  },
  {
    id: 'p19', from: 'bldg58', to: 'masjid',
    name: 'Bridge Path',
    waypoints: [[26.3060, 50.1598], [26.3073, 50.1595], [26.3085, 50.1592]],
    distance: 284, shadeScore: 48,
  },
  {
    id: 'p20', from: 'student_center', to: 'gym',
    name: 'Back Road',
    waypoints: [[26.3060, 50.1568], [26.3055, 50.1612], [26.3050, 50.1655]],
    distance: 843, shadeScore: 15,
  },
  {
    id: 'p21', from: 'student_center', to: 'library',
    name: 'Exposed Shortcut',
    waypoints: [[26.3060, 50.1568], [26.3062, 50.1582], [26.3065, 50.1595], [26.3072, 50.1608]],
    distance: 340, shadeScore: 22,
  },
];
