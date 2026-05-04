# Studio Print Live Status

Last updated: 2026-05-04 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched and added 8 additional official Rajasthan Pehchan civil-registration support forms.
- Result: `/forms` now has 118 forms total.
- Result: added adopted-child birth report Form 1-A, MCCD Form 4, MCCD Form 4A, four separate delayed birth/death affidavit workflows, and a marriage-registration affidavit pack.
- Cache bumped to `studioprint-v52`; latest ID Print refresh marker `id-print-v50` preserved.
- Feature commit pushed: `2db243b` (`feat(forms): add Rajasthan Pehchan support forms`).
- Previous Forms commits: `18bf54b` SIPF/NPS batch, `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Pehchan PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-pehchan-additional-20260504.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260504-next` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to bump Forms cache to `studioprint-v52` while preserving `id-print-v50`.

## Commit / deploy / QA

- Website source commit pushed: `2db243b`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 118 entries; `forms.html` and `dist/forms.html` each have 118 JS entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-pehchan-additional-*`; live page has 118 JS entries and contains `Birth Report for Adopted Child Form 1-A`, `Delayed Death Affidavit - 30 Days to 1 Year`, and `Marriage Registration Affidavit Pack`. `/sw.js` contains `studioprint-v52` and `id-print-v50`; `delayed-birth-affidavit-after-one-year-rajasthan.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan is still not complete. Continue official-source research for remaining clean citizen-service forms such as additional eMitra certificate workflows, appeal forms, general income workflows, and remaining valid scheme/application PDFs.
- Rejected/not added in the Pehchan additional pass: certificate sample PDFs, Margdarshika/rules/acts PDFs, and `docs/*.pdf` circulars because they are not blank printable forms.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
