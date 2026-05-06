# Handoff For Parallel Codex Chats

Last updated: 2026-05-06 11:59 IST

## Latest Forms update

- Completed Rajasthan official-source RIICO / Tourism / Medical pass.
- Added 4 official RajNivesh entries after PDF text/render inspection:
  - Drug Licence Form 19 - Sale/Distribution.
  - Tourism Project Approval Form.
  - RIICO Preferential Plot Allotment - Rule 3W.
  - RIICO Land Allotment Revised Form.
- `/forms` now has 194 forms total; Rajasthan has 127 entries.
- Cache is `studioprint-v66` / `site-v66`; ID Print refresh marker is `id-print-v53` and was preserved.
- Feature commit pushed to `main`: `afbc9a1` (`feat(forms): add Rajasthan RIICO tourism medical forms`).
- Deploy: GitHub Actions run `25419868524`, completed successfully.
- Live QA passed on `https://studioprint.pages.dev/forms?qa=rajasthan-riico-medical-afbc9a1-*`: page contains the 4 new entries, `/sw.js` has `studioprint-v66` and `id-print-v53`, and `rajasthan-drug-licence-form-19.pdf` returns 200.
- Rejected/not added in this pass: RSPCB CTE/CTO/HSW/MSW/C&D/BMW PDFs because they are portal screenshot/user-flow pages, Tourism unit approval and Film Shooting PDFs because they are user-manual / portal screenshots with sample data in one file, and 3 Medical declaration/certificate scans because they are low-quality scanned blanks.
- New research doc: `.agents/research/forms-rajasthan-riico-tourism-medical-20260506.md`.

## UI polish completed

- UI/cache polish is complete and deployed.
- Commit: `887247f` (`fix(ui): polish sticky header and mobile sliders`).
- Deploy: GitHub Actions run `25418217183`, completed successfully.
- Cache freshness: app shell asset query strings and service worker cache markers are at `ui-polish-v65` / `studioprint-v65` / `site-v65`.
- Verified live on `https://studioprint.pages.dev/`: home, Passport Photo, ID Print, Forms, Refund, and `/sw.js` returned 200 with v65 markers.
- Live phone smoke passed: header stays fixed while scrolling, no horizontal overflow, home/passport/ID informational sliders move automatically, auth modal is centered, and Google login is visible.
- Global lock is now `FREE`; future chats should still run the required start commands before editing.

Current repo path for normal work: `C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

## Required start commands

Every parallel chat should start in:

`C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

Then run:

```powershell
git pull --ff-only origin main
Get-Content .agents\work-locks.md
powershell -ExecutionPolicy Bypass -File .agents\check-work-lock.ps1
Get-Content .agents\quality-standard.md
Get-Content .agents\live-status.md
Get-Content .agents\handoff.md
```

If `.agents/check-work-lock.ps1` reports an active live/deploy lock, stop before
editing, pushing, or deploying. If it reports an active scoped work lock, stop
only when your owned files overlap that scope or you need shared app-shell/cache,
`.agents`, generated `dist/**`, or deployment ownership.

## Parallel chat rule

- Do not pause unrelated work just because another chat is active.
- Complete the assigned task in a clearly declared, disjoint owned scope.
- Re-check locks and run `git pull --ff-only origin main` before final
  commit/push.
- Stage only owned paths; never stage another chat's dirty files.
- Stop at the live update phase if another chat is deploying or preparing a
  production release.

## Production quality standard

- Every chat must read `.agents/quality-standard.md` before editing and state
  owned scope, user impact, main risk, success criteria, and verification plan.
- UI/tool work requires visual QA on affected desktop/mobile surfaces whenever
  tooling is available. If browser tooling fails, document the exact failing
  command and use screenshots, live URL fetches, or runtime-node fallbacks.
- Windows Security allowlist was added by the owner on 2026-05-06 for Chrome,
  Edge, Codex bundled `node.exe`, bundled `rg.exe`, and runtime `node.exe`.
  Re-test `rg --version`, Node, and browser/visual tooling after Codex restart.
- No chat should ship half-working, unverified, or visually broken work. Small
  fixes stay small, but the verification bar does not disappear.

## Deployment rule

- Production deploys are manual-only. Normal source pushes to `main` should not trigger Cloudflare Pages.
- Read `.agents/deploy-policy.md` before attempting any live deploy.
- Read `.agents/work-locks.md` and take the global edit lock before any live deploy or shared-file change.
- Only one deploy owner should run `Deploy to Cloudflare Pages` from GitHub Actions after collecting ready changes and validating the latest `origin/main`.
- Do not push empty retry commits for runner or Cloudflare internal errors; use `Re-run jobs` or wait for the external service to recover.
- Latest live recovery was completed by Cloudflare dashboard Direct Upload on 2026-05-05 21:51 IST after GitHub Actions hosted runners failed to acquire a runner. The Google verification tag is now live on `https://studioprint.pages.dev/`.

## Active scope

- This chat owns Forms Hub work only.
- Do not touch `id-print.html` from this Forms task.
- Another chat may work on ID Print; coordinate through these `.agents` files.
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-next2-20260505` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Completed Rajasthan-only Legal Metrology / Consumer Affairs pass after the user asked to finish Rajasthan before moving to any other state.
- Added 4 official Rajasthan Legal Metrology entries after PDF text/render inspection:
  - Legal Metrology Dealer Licence Form LD-1.
  - Legal Metrology Manufacturer Licence Form LM-1.
  - Legal Metrology Repairer Licence Form LR-1.
  - Legal Metrology Packer/Manufacturer Registration.
- E-Tulaman verification/stamping was intentionally not listed because it is a portal user-manual, not a blank printable form.
- `/forms` now has 185 forms total; Rajasthan has 118 entries.
- Cache is `studioprint-v60`; ID Print refresh marker is `id-print-v53` and was preserved.
- Feature commit pushed to `main`: `559fd78` (`feat(forms): add Rajasthan legal metrology forms`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 185 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Actual PDF page-count validation passed against manifest for all 185 entries.
- `forms.html` validation passed: 185 JS entries; Legal Metrology dealer/manufacturer/repairer/packer entries are present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v60` and `id-print-v53` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=rajasthan-legal-metrology-559fd78-*`: page contains Legal Metrology dealer/manufacturer/repairer/packer entries. `/sw.js` has `studioprint-v60` and `id-print-v53`; `rajasthan-legal-metrology-dealer-licence-ld1.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-rajasthan-legal-metrology-20260505.md`
  - `.agents/research/forms-rajasthan-electricity-20260505.md`
  - `.agents/research/forms-rajasthan-udh-jaipurmc-20260505.md`
  - `.agents/research/forms-rajasthan-gap-pass-20260505.md`
  - `.agents/research/forms-delhi-revenue-20260505.md`
  - `.agents/research/forms-west-bengal-ration-20260505.md`
  - `.agents/research/forms-rajasthan-pehchan-additional-20260504.md`
  - `.agents/research/forms-rajasthan-sipf-nps-20260504.md`
  - `.agents/research/forms-rajasthan-labour-employment-20260503.md`
  - `.agents/research/forms-rajasthan-police-sje-20260503.md`
  - `.agents/research/forms-rajasthan-refresh-20260503.md`
  - `.agents/research/forms-rajasthan-revenue-20260503.md`
  - `.agents/research/forms-rajasthan-transport-20260503.md`
- Official source base used in the latest pass:
  - `https://rajnivesh.rajasthan.gov.in/Home/Forms`
  - direct PDFs under `https://rajnivesh.rajasthan.gov.in/Uploads/`
- Every accepted PDF was downloaded from the official host, read/inspected, page-count checked, and rendered for visual QA.
- Third-party pages were not used as PDF sources.
- Rejected/not added in this Legal Metrology pass: E-Tulaman verification/stamping PDF because it is a portal user-manual, not a blank printable form.
- Rejected/not added in the electricity pass: RajNivesh cover/index page because it is not a printable form, and PHED/water connection candidates because no clean official blank printable PDF was confirmed in this pass.
- Rejected/not added in the previous UDH / Jaipur MC pass: Jaipur MC `COMING SOON` placeholders, faint fire NOC scan, signed/dark dairy notice pack, procedure-only fire NOC document, dirty scanned SJE pension bundle, dirty scanned Family Pension bundle, signed/scanned Notice pack, dirty mixed VariousOtherForms bundle, unverified Pre-88 direct PDF, and pension revision circular/memo candidates.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new/refreshed PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan known official-source gap pass now includes the documented Pehchan Form 14/Form 15 gap, missing clean Pension table forms, clean UDH / Jaipur MC forms, clean electricity DISCOM forms, and clean Legal Metrology forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; any future Rajasthan addition still needs department-by-department official-source research and PDF inspection before listing.
