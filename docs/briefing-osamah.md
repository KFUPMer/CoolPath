# CoolPath — Project Briefing
**Prepared for:** Osamah  
**Project:** CoolPath — KFUPM Campus Shade-Aware Navigation System  
**Date:** April 2026  
**Presentation:** Tuesday, April 15, 2026 — 7:00 PM  

---

## 1. Background & Context

### The Problem

KFUPM's campus spans roughly 10 km² in Dhahran, one of the hottest cities on the Arabian Peninsula. Peak summer temperatures regularly exceed **45°C**, with a heat index that can feel closer to 55°C when humidity is factored in. Students, staff, and visitors are required to walk between buildings multiple times a day — often across long, fully exposed corridors with no shade, no canopy, and no alternative.

Existing navigation tools (Google Maps, campus maps) route users by **shortest distance only**. This is functionally correct but thermally harmful. A 900 m "shortest" walk through a fully exposed boulevard is meaningfully more dangerous — and less accessible — than a 1,100 m walk under a tree-lined shaded path.

No tool currently exists that:
- Accounts for shade coverage when routing on campus
- Identifies which corridors are most urgently in need of shade infrastructure
- Offers a wheelchair-accessible routing alternative that avoids barriers
- Aligns walking infrastructure data with urban planning and sustainability goals

**CoolPath** fills this gap.

---

### Why Now

Several converging factors make this the right time to build this tool:

1. **Saudi Vision 2030** has placed urban liveability, disability inclusion, and sustainability at the center of national development — KFUPM, as a leading national university, is expected to lead by example.
2. **Campus expansion** is ongoing — new buildings and walkways are being planned, and shade infrastructure decisions being made now will last decades.
3. **Climate urgency** — the IPCC's most recent reports indicate the Gulf region will warm faster than the global average, making shade access not a convenience but a public health necessity.
4. **No comparable tool exists** for any Saudi university campus — CoolPath could become a replicable model.

---

## 2. What CoolPath Does

CoolPath is a browser-based campus navigation app (no installation required) that finds the **most shaded walkable route** between any two buildings, not just the shortest one.

### Core Features

| Feature | Description |
|--------|-------------|
| **Shortest Route** | Standard Dijkstra by distance |
| **Coolest Route** | Heat-penalised routing — prioritises shaded corridors |
| **Accessible Route** | Wheelchair-friendly paths only — inaccessible segments are excluded |
| **Urban Heatmap** | Visual overlay showing heat intensity per corridor |
| **Crowd Density** | Identifies high-traffic corridors for planning purposes |
| **Shade Plan Page** | Admin dashboard ranking corridors by urgency of shade investment |
| **Map Modes** | Dark / Light / Satellite tile switching |
| **High Contrast** | Full accessibility mode for low-vision users |

### The Algorithm

The coolest route uses a modified Dijkstra weight function:

```
coolestWeight = distance × (1 + 2.5 × (100 − shadeScore) / 100)
```

A fully exposed corridor (shadeScore = 0) costs 3.5× more than its physical distance. A fully shaded corridor (shadeScore = 100) costs exactly its physical distance. This means the algorithm naturally finds paths that are longer in metres but far more comfortable and safe.

### Current Dataset

- **15 buildings** with GPS-verified coordinates (via OpenStreetMap)
- **30 walking corridors** each tagged with:
  - `shadeScore` (0–100)
  - `density` (1 = quiet, 3 = heavy traffic)
  - `accessible` (wheelchair-friendly yes/no)
- **5,088 m** of total exposed walking distance identified on campus
- **Average shade coverage: 46%** — meaning more than half the campus walking network is inadequately shaded

---

## 3. Disability Inclusion & Saudi Vision 2030 Alignment

### Vision 2030 Commitments

Saudi Vision 2030 explicitly commits to:

- **Improving quality of life** for all citizens and residents, including those with disabilities
- **Achieving 1% employment target** for persons with disabilities in national institutions
- **Full compliance** with the UN Convention on the Rights of Persons with Disabilities (CRPD), which Saudi Arabia ratified
- **Universal design** principles in public infrastructure — meaning new buildings and walkways must be accessible by default

The **National Transformation Program (NTP)** includes specific KPIs for accessibility upgrades in public institutions. Universities fall directly within scope.

KFUPM's campus, as a government-funded national research university, has both a legal and reputational obligation to meet these standards.

### How CoolPath Addresses This

**The Accessible Routing Mode** is a direct implementation of Vision 2030's universal design mandate:

- When selected, Dijkstra's algorithm **excludes all wheelchair-inaccessible paths** from the graph entirely
- It then finds the shortest fully-accessible route between any two buildings
- If no accessible route exists, it alerts the user — surfacing a planning gap that facilities management can act on
- Inaccessible corridors are **visually marked** on the map with a dashed grey line so planners can see at a glance where barriers exist

**The Shade Plan page** also has a direct disability dimension: heat stress disproportionately affects:
- Users of manual wheelchairs (elevated physical exertion)
- Users of motorised chairs (limited speed, longer exposure time)
- People with chronic conditions (MS, diabetes, cardiovascular disease) that are worsened by heat
- Elderly users and those with mobility aids who cannot move quickly between shade spots

Identifying and prioritising shade investment in high-traffic accessible corridors is therefore both a sustainability goal and a disability inclusion goal.

### Future Alignment Opportunities

- **Tactile paving routes** for visually impaired users — CoolPath's graph can be extended to tag paths with tactile guidance availability
- **Rest point mapping** — identify benches, shaded seating, and water fountains along routes for users who cannot walk long distances without breaks
- **Elevator/ramp database** — integrate building-level accessibility data so indoor transitions are also accessible-aware
- **Audio routing** — screen-reader-compatible turn-by-turn directions using the existing `aria-live` region already built into the app

---

## 4. How the ARE Department Can Improve the Data

The current shade scores are manually estimated based on campus knowledge and satellite imagery. The Architecture and Regional/Environmental (ARE) department has access to tools and expertise that could transform this into a scientifically rigorous dataset.

### What ARE Can Contribute

#### a) Shadow Simulation Studies
ARE departments routinely run **solar path analysis** using tools like:
- **Rhinoceros + Grasshopper + Ladybug** (parametric environmental analysis)
- **AutoCAD Sun Studies**
- **EnergyPlus / OpenStudio**

These can produce hour-by-hour, season-by-season shade maps of every corridor on campus. Rather than a single `shadeScore`, each path could have:
```
shadeScore_summer_9am   = 12
shadeScore_summer_12pm  = 5
shadeScore_summer_3pm   = 20
shadeScore_winter_12pm  = 65
```
CoolPath can be extended to use the **current time and season** to select the correct shade score — making routing advice accurate in real time.

#### b) Thermal Comfort Metrics (Beyond Shade)
ARE monitors can provide data on:
- **UTCI (Universal Thermal Climate Index)** — the gold standard for outdoor thermal comfort, accounting for radiation, humidity, wind, and temperature together
- **MRT (Mean Radiant Temperature)** — measures the heat radiating from surrounding surfaces (pavement, walls), which can be extreme even in the shade
- **Wind corridor mapping** — some paths may be exposed but benefit from consistent breeze, making them more tolerable than their shade score alone suggests

Integrating UTCI into the routing weight function would make CoolPath scientifically publishable, not just practically useful.

#### c) Surface Material Data
Pavement type dramatically affects ground-level heat:
- **Dark asphalt** can reach surface temperatures of 70°C+ in summer
- **Light concrete** reflects more radiation
- **Permeable pavers** reduce heat absorption
- **Grass/soil margins** significantly cool adjacent air

ARE surveys of pavement materials along each corridor would allow CoolPath to add a `surfaceHeatFactor` to each path, refining the routing model further.

#### d) Vegetation Inventory
An ARE field survey of existing trees — species, canopy spread, health — would replace estimated shade scores with measured ones. This data could also feed directly into the Shade Plan priority rankings, allowing the recommendations (native trees, shade sails, covered walkways) to be costed and sequenced properly.

#### e) Long-Term Monitoring
If ARE installs **microclimate sensors** (temperature, humidity, solar radiation) at key corridor midpoints, CoolPath could eventually pull **live environmental data** and update routing recommendations dynamically. This would be a research-grade contribution to urban climate studies.

---

## 5. Improvement Roadmap

### Short Term (Before Presentation / This Semester)
- [ ] Add real measured shade scores from ARE data if available
- [ ] Add more buildings (dormitories, labs, prayer areas)
- [ ] Improve waypoint accuracy with walking-path GPS traces
- [ ] Add a "current time" mode that adjusts shade scores by hour

### Medium Term (Next Semester)
- [ ] UTCI integration for scientifically validated thermal comfort routing
- [ ] Rest point / water fountain / bench database
- [ ] Elevator and ramp tagging for full indoor-outdoor accessibility
- [ ] Mobile-responsive layout for on-the-go use
- [ ] QR codes at building entrances linking directly to routes from that building

### Long Term (Research / Publication)
- [ ] Live microclimate sensor feeds from ARE monitoring stations
- [ ] Machine learning model to predict shade scores at unmeasured points
- [ ] Multi-university replication (King Fahd, KAU, KAUST)
- [ ] Integration with KFUPM's official campus systems / student portal
- [ ] Academic publication: "Shade-Aware Pedestrian Routing as a Public Health Intervention in Hot Arid Climates"

---

## 6. Technical Summary (for Reference)

| Item | Detail |
|------|--------|
| Stack | HTML + CSS + Vanilla JavaScript + Leaflet.js |
| Backend | None — fully static, runs in any browser |
| Map tiles | CartoDB (Dark/Light), ESRI (Satellite) |
| Routing | Dijkstra's algorithm with pluggable weight functions |
| Data file | `data/paths.js` — easily editable by non-programmers |
| Hosting | Any static file host (GitHub Pages, KFUPM servers) |
| Repo | https://github.com/KFUPMer/CoolPath |

---

## 7. Key Talking Points for the Presentation

1. **The hook:** "Shortest path is not the safest path when it's 47 degrees outside."
2. **The Vision 2030 angle:** Universal design and disability inclusion are legal and national commitments — this tool helps KFUPM measure and act on them.
3. **The planning angle:** The Shade Plan page turns student welfare data into facilities management intelligence. This isn't just a navigation app — it's a campus infrastructure audit tool.
4. **The research angle:** With ARE department involvement, this becomes a publishable study on thermal comfort routing in hot arid climates.
5. **The scalability angle:** The data model is simple enough that any university in the Gulf could replicate it.

---

*CoolPath was built as a working demonstration — the live app is at: http://localhost:3131 (or the GitHub repo for the code)*
