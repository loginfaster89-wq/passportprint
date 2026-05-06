# Studio Print Live Status

Last updated: 2026-05-06 11:59 IST

## Forms Hub Rajasthan batch completed

- Current owner: none; Forms Hub lock released after completion.
- Active task completed: Rajasthan official-source RIICO / Tourism / Medical pass.
- Result: `/forms` now has 194 forms total; Rajasthan has 127 entries.
- Result: added 4 clean official RajNivesh forms: Drug Licence Form 19, Tourism Project Approval Form, RIICO Preferential Plot Allotment Rule 3W, and RIICO Land Allotment Revised Form.
- Cache bumped to `studioprint-v66` / `site-v66`; ID Print refresh marker `id-print-v53` was preserved.
- Feature commit pushed: `afbc9a1` (`feat(forms): add Rajasthan RIICO tourism medical forms`).
- Deploy: GitHub Actions run `25419868524` completed successfully.
- Local validation: passed. Manifest has 194 entries; `forms.html` has 194 JS entries; all referenced source PDFs/previews/page-previews exist; actual PDF page counts match manifest; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=rajasthan-riico-medical-afbc9a1-*`; live page contains the 4 new entries. `/sw.js` contains `studioprint-v66` and `id-print-v53`; `rajasthan-drug-licence-form-19.pdf` returns 200.
- Rejected/not added in this pass: RSPCB CTE/CTO/HSW/MSW/C&D/BMW PDFs because they are portal screenshot/user-flow pages, Tourism unit approval and Film Shooting PDFs because they are user-manual / portal screenshots with sample data in one file, and 3 Medical declaration/certificate scans because they are low-quality scanned blanks.

## UI polish/live update completed

- UI/cache polish was resumed after the overnight pause, rebuilt, pushed, and deployed live.
- Commit deployed: `887247f` (`fix(ui): polish sticky header and mobile sliders`).
- GitHub Actions deploy run: `25418217183`, completed successfully.
- Live verification passed on `https://studioprint.pages.dev/` with v65 cache markers on home, Passport Photo, ID Print, Forms, Refund, and `/sw.js`.
- Live mobile smoke passed for shared sticky/fixed header, no horizontal overflow, auto movement on home/passport/ID informational sliders, and Google login visibility.
- Global edit lock has been released in `.agents/work-locks.md`.

## Deploy coordination rule

- Production deploys are now manual-only through GitHub Actions `Deploy to Cloudflare Pages`.
- Pushing to `main` must not automatically deploy to Cloudflare Pages.
- Every chat must read `.agents/work-locks.md` and run `.agents/check-work-lock.ps1` before editing or pushing.
- If the global edit lock is `ACTIVE`, new editing/deploy work must stop until the owner releases it.
- Before any live deploy, read `.agents/deploy-policy.md`, confirm one deploy owner, build locally, and run the workflow manually with the latest `origin/main` SHA.
- Do not create empty retry commits for Cloudflare/GitHub transient failures.
- Current deployment status: resolved by Cloudflare dashboard Direct Upload on 2026-05-05 21:51 IST after GitHub Actions hosted runners could not acquire a runner. Live `https://studioprint.pages.dev/` has the Google site verification tag.

## Production deploy verification

- Latest verified production deployment: `https://63530914.studioprint.pages.dev/`.
- Production URL verified: `https://studioprint.pages.dev/`.
- Verification result: both URLs returned 200 and contained Google site verification token `YL3_b-WlPXch66iSf_LXU1RSuMJDxKMd9Gnv9MtyUYA`.
- Deploy method used: Cloudflare dashboard `Create deployment` with local `dist/` folder, Production environment selected.
- GitHub Actions run `#349` failed before runner acquisition during the GitHub Actions hosted runner incident; this was not a source-code or Cloudflare token failure.

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: Rajasthan-only Legal Metrology / Consumer Affairs pass after the user asked to finish Rajasthan before any other state.
- Result: `/forms` now has 185 forms total; Rajasthan has 118 entries.
- Result: added 4 clean official Rajasthan Legal Metrology forms: dealer licence LD-1, manufacturer licence LM-1, repairer licence LR-1, and packer/manufacturer/importer registration.
- Cache bumped to `studioprint-v60`; latest ID Print refresh marker `id-print-v53` from the other chat was preserved.
- Feature commit pushed: `559fd78` (`feat(forms): add Rajasthan legal metrology forms`).
- Previous Forms commits: `4ce90d7` electricity DISCOM batch, `3ccd9be` UDH / Jaipur MC batch, `fb9d438` Rajasthan Pehchan/Pension gap pass, `3307447` Delhi Revenue batch, `aaa2cda` West Bengal ration batch, `2db243b` Rajasthan Pehchan support batch, `18bf54b` SIPF/NPS batch, `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Legal Metrology PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-legal-metrology-20260505.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-next2-20260505` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to bump Forms cache/runtime cache to `studioprint-v60` while preserving remote `id-print-v53`.

## Commit / deploy / QA

- Website source commit pushed: `559fd78`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 185 entries; `forms.html` has 185 JS entries; all referenced source PDFs/previews/page-previews exist; actual PDF page counts match manifest; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=rajasthan-legal-metrology-559fd78-*`; live page contains Legal Metrology dealer/manufacturer/repairer/packer entries. `/sw.js` contains `studioprint-v60` and `id-print-v53`; `rajasthan-legal-metrology-dealer-licence-ld1.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan known official-source gap pass now includes the documented Pehchan Form 14/Form 15 gap, missing clean Pension table forms, clean UDH / Jaipur MC forms, clean electricity DISCOM forms, and clean Legal Metrology forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; future Rajasthan additions still need department-by-department official-source research and PDF inspection.
- Rejected/not added in this Legal Metrology pass: E-Tulaman verification/stamping PDF because it is a portal user-manual, not a blank printable form.
- Rejected/not added in this electricity pass: RajNivesh cover/index page because it is not a printable form, and PHED/water connection candidates because no clean official blank printable PDF was confirmed in this pass.
- Rejected/not added in this Rajasthan pass: Jaipur MC `COMING SOON` placeholders, faint fire NOC scan, signed/dark dairy notice pack, procedure-only fire NOC document, dirty scanned SJE pension bundle, dirty scanned Family Pension bundle, signed/scanned Notice pack, dirty mixed VariousOtherForms bundle, unverified Pre-88 direct PDF, and pension revision circular/memo candidates.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
