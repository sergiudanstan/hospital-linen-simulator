# Hospital linen simulator

[![CI](https://github.com/sergiudanstan/hospital-linen-simulator/actions/workflows/ci.yml/badge.svg)](https://github.com/sergiudanstan/hospital-linen-simulator/actions/workflows/ci.yml)
[![CodeQL](https://github.com/sergiudanstan/hospital-linen-simulator/actions/workflows/codeql.yml/badge.svg)](https://github.com/sergiudanstan/hospital-linen-simulator/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/sergiudanstan/hospital-linen-simulator/badge)](https://scorecard.dev/viewer/?uri=github.com/sergiudanstan/hospital-linen-simulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Browser simulator of RFID-tracked hospital linen flow, with a Romanian UI. It models clean linen entering through a first gateway, being distributed to three hospital floors, returning through a second gateway as dirty linen, and cycling through an external laundry.

**Live:** https://sergiudanstan.github.io/hospital-linen-simulator/

## What it models

- Three floors (Etaj 1 ATI, Etaj 2 Chirurgie, Etaj 3 General; rooms 101-104, 201-203, 301-305) and four linen types (bedsheets, towels, patient gowns, blankets)
- Flow: Gateway 1 (RFID entry, editable quantity) → clean room → floors (manual allocation per floor) → Gateway 2 (RFID exit, computed as the sum of the floor allocations) → dirty room → external laundry → back to Gateway 1 and the clean room
- Scheduled laundry pickup and return times, applied with the "send all" and "receive all" buttons (the times label the actions and the log; they are not triggered by the clock)
- Manual per-type operations (add or remove stock, distribute to a floor, collect from a floor, send to and receive from cleaning)
- Optional auto-simulation (random operations, 0.5x to 4x speed), eight KPI cards, an inventory table and a timestamped event log
- SVG flow diagram with animated particles

State is kept in memory only: reloading the page resets it.

## Files

| File | Purpose |
|---|---|
| `index.html` | The deployed page. React 18 and Babel standalone load from unpkg; the component is transpiled in the browser. |
| `hospital-linen-simulator.jsx` | The same component as an ES module (`export default`) for a bundled React project. It is not identical to the page: it has drifted in accent colours and spacing. |
| `plan.md` | Notes on the component structure, state and operations. It still refers to a `hospital-linen-simulator.html` file that does not exist; the page is `index.html`. |

React, ReactDOM and Babel are loaded from unpkg without a pinned patch version (`react@18`, `@babel/standalone` latest).

## Run

```sh
python3 -m http.server     # then open http://localhost:8000/
```

An internet connection is needed for the unpkg scripts.

## Development

```sh
npm ci --ignore-scripts    # test tooling only (playwright-core)
npm test                   # headless Chrome: page loads without errors, pickup and return keep the linen total constant
```

The test needs Google Chrome (set `PW_CHANNEL=chromium` to use Playwright's own Chromium) and network access to unpkg. The `.jsx` file is not covered by the test.

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) and [CHANGELOG.md](CHANGELOG.md).
