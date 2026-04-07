# Hospital Linen Simulator — Codebase Plan

## Overview

A **React single-page application** (Romanian UI) that simulates hospital linen management with RFID-tracked flow. Built with Apple-style design language (SF Pro fonts, rounded cards, muted pastels).

## Files

| File | Purpose |
|---|---|
| `hospital-linen-simulator.html` | Standalone version — React 18 via CDN, Babel in-browser transpilation. Opens directly in any browser. |
| `hospital-linen-simulator.jsx` | Same component as a proper ES module (`export default`). For use in a bundled React project. |

Both files contain identical logic. The `.html` is the deployable artifact.

## Domain Model

**Hospital layout:**
- Etaj 1 — ATI (ICU): rooms 101–104
- Etaj 2 — Chirurgie (Surgery): rooms 201–203
- Etaj 3 — General: rooms 301–305

**Linen types (4):**
- Cearceafuri (bedsheets), Prosoape (towels), Halate pacient (gowns), Paturi (blankets)

## Linen Flow

```
GW1 (RFID Entry) → Camera Curata (Clean Room) → 3 Floors (distributed manually)
                                                        ↓
                    Firma Spalatorie ← Camera Murdara ← GW2 (RFID Exit, auto-sum)
                         ↓
                    Return cycle → GW1 → Camera Curata (loop)
```

1. **Gateway 1** — editable quantity of clean linen entering the system
2. **Clean Room** — holds clean linen, distributes to floors
3. **Floor allocation** — user sets per-floor quantities (stepper inputs)
4. **Gateway 2** — auto-calculated as sum of all floor allocations
5. **Dirty Room** — collects used linen from floors via GW2
6. **External Laundry** — scheduled pickup (all dirty → company) and return (all clean ← company)

## React Components

| Component | Role |
|---|---|
| `Particle` | SVG animated dot traveling between two `{x,y}` positions. Pulsating radius animation. |
| `StepperInput` | Numeric input with +/− buttons. Configurable step, min, max, accent color. |
| `HospitalLinenSimulator` | Main app. All state, operations, UI tabs, SVG diagram. |

## State (all in `HospitalLinenSimulator`)

| State | Type | Description |
|---|---|---|
| `gw1Qty` | number | Gateway 1 entry quantity (default 400) |
| `floorAlloc` | number[3] | Per-floor allocation [150, 130, 120] |
| `cleanRoom` | {bedsheet, towel, gown, blanket} | Clean room stock by type |
| `dirtyRoom` | {bedsheet, towel, gown, blanket} | Dirty room stock by type |
| `floorStock` | array of {floorId, bedsheet, towel, gown, blanket} | Per-floor current stock |
| `externalCleaning` | {bedsheet, towel, gown, blanket} | Items at external laundry |
| `pickupTime` / `returnTime` | string | Scheduled times for laundry pickup/return |
| `particles` | array | Active SVG particle animations |
| `log` | array | Event log entries (max 50) |
| `simRunning` / `simSpeed` | bool / number | Auto-simulation toggle and speed multiplier |
| `selectedView` | string | Active tab: "flow", "manage", "inventory", "log" |

## Key Operations

| Function | Action |
|---|---|
| `distributeToFloor(floorIdx, linenType, qty)` | Move clean → floor (decrements clean room, increments floor stock) |
| `collectFromFloor(floorIdx, linenType, qty)` | Collect dirty from floor via GW2 → dirty room |
| `sendToCleaning(linenType, qty)` | Send dirty → external laundry |
| `returnFromCleaning(linenType, qty)` | Receive clean ← external laundry (multi-hop animation) |
| `sendAllDirtyToCompany()` | Scheduled bulk: all dirty → company |
| `returnAllFromCompany()` | Scheduled bulk: all at company → clean room |

## UI Tabs

1. **Flux & Comenzi** — SVG flow diagram with live KPIs, floor allocation controls, pickup/return scheduling
2. **Operatiuni** — Manual per-type operations: add/remove stock, distribute, collect, send/receive
3. **Inventar** — Full inventory table across all locations and linen types
4. **Jurnal** — Timestamped RFID event log (monospace font)

## Auto-Simulation

When enabled, runs a `setInterval` loop that randomly:
- Distributes 1–3 items to a random floor
- Collects 1–2 dirty items from a random floor
- Sends 1–3 items to cleaning
- Returns 1–2 items from cleaning

Speed: 0.5× to 4× (adjustable slider).

## KPI Cards (top bar)

GW1 Intrare | Camera Curata | Alocat pe Etaje | Ramas in Curata | GW2 (auto-sum) | Camera Murdara | La Spalatorie | Total General

## Derived Values

- `gw2Qty` = sum of `floorAlloc` (auto, not editable)
- `remainInClean` = max(0, gw1Qty − allocatedTotal)
- Over-allocation warning when allocatedTotal > gw1Qty

## Tech Stack

- React 18 (CDN, no build step)
- Babel standalone (in-browser JSX transpilation)
- SVG for flow diagram + particle animations
- Inline CSS (Apple HIG-inspired)
- No external dependencies beyond React/Babel

## Possible Improvements

- [ ] Persist state to localStorage
- [ ] Real clock-based scheduled events (trigger pickup/return at actual times)
- [ ] Per-room linen tracking (currently per-floor only)
- [ ] Export inventory/log as CSV
- [ ] Responsive mobile layout (currently desktop-optimized)
- [ ] Connect to a real RFID backend API
- [ ] Add charts/graphs for linen usage trends over time
- [ ] Multi-language support (currently Romanian only)
