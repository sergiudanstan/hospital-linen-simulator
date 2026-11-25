# Security Policy

This is a static, browser-only simulator: one `index.html` (plus a `.jsx` copy of the component) with no backend, no accounts and no data sent anywhere. State is held in memory only. The page loads React 18, ReactDOM and Babel standalone from unpkg **without a pinned patch version and without Subresource Integrity**, so the page trusts whatever unpkg serves for those tags; Babel transpiles the app in the browser, which requires allowing `eval`-style execution.

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | ✅ Current |

Single maintainer; only the latest release receives fixes.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.** Report it privately:
**[Report a vulnerability](https://github.com/sergiudanstan/hospital-linen-simulator/security/advisories/new)**
(Security → Advisories → Report a vulnerability).

| Stage | Target |
|---|---|
| Acknowledgement | within 3 business days |
| Triage | within 10 business days |
| Fix, or a documented decision not to fix | within 90 days |

These are best-effort targets from a single unpaid maintainer, not a contractual SLA.
There is no bug bounty; credit is offered in the advisory and changelog.

## Scope

In scope: script injection through the page, the page loading code from any origin other than unpkg, and anything in this repository's workflows that could publish a release not built from `main`. Findings about the unpinned, un-hashed unpkg scripts are in scope as known weaknesses: a pull request that pins versions and adds SRI is welcome.

Out of scope: vulnerabilities in React, Babel or unpkg itself (report upstream), and the realism of the simulation, which is a correctness bug: file it as a normal issue.

## Supply chain

CI runs a headless page smoke test on every push, `npm audit` on the test tooling, `pip-audit` on the hash-pinned CI toolchain, CodeQL, and `zizmor` on the workflows.
Actions are pinned to full commit SHAs and kept current by Dependabot. Releases attach a
source archive with Sigstore build provenance:

```
gh attestation verify hospital-linen-simulator-v0.1.0.tar.gz --repo sergiudanstan/hospital-linen-simulator
```
