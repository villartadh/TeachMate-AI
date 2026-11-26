# Dependency recovery gate

Baseline: 8d07ba3703d4ef7dcb942f57d36e2cb189dec51d (alpha.11). Main verified identical on 2026-11-26. This branch is not a promoted candidate.

Use Node 22 LTS and the committed package-lock.json. In a disposable checkout, run `node --version`, `npm --version`, `npm ping --registry=https://registry.npmjs.org/`, then `npm ci --no-audit --no-fund`. Do not substitute npm install, force peer resolution, or regenerate the lockfile to hide a registry failure. Do not print environment variables or npm authentication configuration. If install succeeds, run `npx --no-install tsc --noEmit`, `npm run lint`, and `npm run build` independently, recording exit codes and sanitized output. Run with OPENAI_API_KEY unset and no live provider requests. Do not deploy. Record the lockfile SHA-256 before and after installation; any change requires review.

Prior handoff reports uncached zod-validation-error@4.0.2 and DNS failure. Current cycle: repository comparison PASS; clean install, typecheck, lint, build and browser acceptance NOT RUN. A registry-enabled execution environment is required. No new runtime certification.

GitHub-hosted CI may be used only within authorized free capacity; do not enable paid runners or overage billing. If unavailable, use an authorized local dependency cache or execution environment. Preserve main and record evidence before promotion.
