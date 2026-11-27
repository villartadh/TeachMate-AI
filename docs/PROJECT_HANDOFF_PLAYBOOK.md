# Project Handoff and Continuation Playbook

Governing standard: Strict App Development Discipline v1.5.0. This project-specific supplement does not replace the full standard.

## Resume procedure
1. Read HANDOFF_README.md, AGENTS.md, HANDOFF_SNAPSHOT.md, DEVELOPMENT_QUEUE.md and current evidence.
2. Inspect actual branches, commits, pending PRs and working tree; reconcile concurrent changes. Preserve main and immutable candidates.
3. Verify source identity and recoverability. Restore locked dependencies with npm ci in an authorized network-enabled environment; never commit credentials.
4. Run node ldc/gate.cjs targeted and node ldc/gate.cjs full; run legacy Python tests per existing recovery instructions. Record actual commands, exit codes, session IDs and evidence. Distinguish PASS, FAIL, BLOCKED and NOT RUN.
5. Continue the highest-priority incomplete requirement; use scoped changes and regression tests. Keep working on independent tasks when blocked.
6. Review changes and integrate only eligible verified work. Use an integrated develop branch once established; reserve separate branches for major or critical changes. Do not delete unmerged work.
7. Update snapshot, queue, requirements traceability, architecture decisions, known issues, changelog and evidence. Record blockers and next executable action.

## Gates
G0 recoverability; G1 requirements; G2 design; G3 implementation; G4 verification; G5 operator acceptance; G6 distribution; G7 operation. Source integrity alone does not establish runtime acceptance. A confirmed failure blocks promotion. Do not label a candidate accepted without required evidence.

## Release handoff
Maintain separate source and handoff ZIPs with SHA-256 checksums, fresh-folder setup and rollback instructions, version-matched IMRAD report and user manual (editable and visually checked PDF), test results and pending acceptance matrix. Keep sanitized support ZIPs separate; exclude secrets, private learner data, unreviewed recordings and installed dependencies. Verify archive inventory and checksums before distribution.

## Current priority
Dependency recovery, clean install, typecheck, lint, build and browser acceptance; then LDC graphical monitor, browser adapter, Lesson Library, exports and teacher toolkit. Historical alpha.11 tests are not fresh verification. No paid calls or public deployment without authorization.
