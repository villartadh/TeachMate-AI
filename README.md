This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## LDC prototype (alpha.4)
After installing dependencies, run `node ldc/gate.cjs targeted` or `node ldc/gate.cjs full` from the project root. Evidence is written to `docs/evidence/<session-id>/`. A nonzero exit means at least one check failed or was blocked. The full gate does not yet include browser tests or live AI acceptance. No raw subprocess output is archived by this prototype.

### Alpha.5 LDC runner
Run `node ldc/gate.cjs targeted` after installing dependencies; `node ldc/gate.cjs full` adds typecheck, lint and build. A blocked or failed step returns nonzero. Session manifests and checksums are in `docs/evidence/`. No raw child output is stored. This is a candidate, not an accepted release.

### Alpha.6 support evidence export
Run `node ldc/archive.cjs <session UUID>` after a gate. The UUID is the session directory name under `docs/evidence`. The command validates the manifest checksum and writes a new allowlisted `support-<UUID>.json` without raw logs. This is a portable JSON prototype, not yet the final support ZIP.

Read a verified gate session: `node ldc/monitor.cjs <session-id>` (CLI prototype; not a release acceptance gate).

### Alpha.8 structured diagnostic events
`node ldc/events.cjs <session-id>` emits ordered JSON Lines from a verified completed gate manifest. This is a retrospective event stream, not live telemetry. Raw subprocess output and arbitrary metadata are excluded.

Alpha.9 optional Support ZIP prototype (Python 3 and Node required): `python ldc/support-zip.py SESSION_ID support.zip`. Destination must not exist. Contains only verified retrospective diagnostic events and their SHA-256 checksum. Run `python tests/support_zip_test.py` separately; not yet integrated into the automatic gate.

### Native Support ZIP (alpha.10)
`node ldc/support-zip.cjs <session-id> <new-output.zip>` exports validated events and checksum using Node only. The targeted and full gates include native archive regression tests. The Python prototype remains for compatibility; the ZIP uses STORE (no compression).

### Alpha.11 automatic session export
Completed gates automatically write support.zip beside the session manifest. A blocked gate remains nonzero even when export succeeds; export failure also returns nonzero and preserves the manifest.
