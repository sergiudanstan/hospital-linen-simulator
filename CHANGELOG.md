# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-11-25

First tagged release of the hospital linen simulator, a React single-page app (Romanian UI) for RFID-tracked hospital linen flow, in `index.html` with a module copy in `hospital-linen-simulator.jsx`. Published at https://sergiudanstan.github.io/hospital-linen-simulator/.

### Added
- Page smoke test (`npm test`) run in CI on every push and pull request: renders the app, runs a laundry pickup and return, and checks the linen total stays constant and the log is written.
- `README.md`, CI, CodeQL, OpenSSF Scorecard and a tag-triggered release workflow with build provenance; Dependabot for actions and npm.
- `package.json` as the version source, `SECURITY.md`, `CONTRIBUTING.md` and this changelog.

[Unreleased]: https://github.com/sergiudanstan/hospital-linen-simulator/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sergiudanstan/hospital-linen-simulator/releases/tag/v0.1.0
