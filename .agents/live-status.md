# Studio Print Live Status

Last updated: 2026-05-05 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: Rajasthan-only electricity DISCOM pass after the user asked to finish Rajasthan before any other state.
- Result: `/forms` now has 181 forms total; Rajasthan has 114 entries.
- Result: added 3 clean official Rajasthan electricity forms split by DISCOM: JVVNL, AVVNL, and JDVVNL new connection / load change application-cum-agreement forms.
- Cache bumped to `studioprint-v59`; latest ID Print refresh marker `id-print-v53` from the other chat was preserved.
- Feature commit pushed: `4ce90d7` (`feat(forms): add Rajasthan electricity forms`).
- Previous Forms commits: `3ccd9be` UDH / Jaipur MC batch, `fb9d438` Rajasthan Pehchan/Pension gap pass, `3307447` Delhi Revenue batch, `aaa2cda` West Bengal ration batch, `2db243b` Rajasthan Pehchan support batch, `18bf54b` SIPF/NPS batch, `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan electricity PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-electricity-20260505.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-more-20260505` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to bump Forms cache/runtime cache to `studioprint-v59` while preserving remote `id-print-v53`.

## Commit / deploy / QA

- Website source commit pushed: `4ce90d7`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 181 entries; `forms.html` has 181 JS entries; all referenced source PDFs/previews/page-previews exist; actual PDF page counts match manifest; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=rajasthan-electricity-4ce90d7-*`; live page contains JVVNL, AVVNL, and JDVVNL electricity entries. `/sw.js` contains `studioprint-v59` and `id-print-v53`; `rajasthan-electricity-jvvnl-new-connection-load-change.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan known official-source gap pass now includes the documented Pehchan Form 14/Form 15 gap, missing clean Pension table forms, clean UDH / Jaipur MC forms, and clean electricity DISCOM forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; future Rajasthan additions still need department-by-department official-source research and PDF inspection.
- Rejected/not added in this electricity pass: RajNivesh cover/index page because it is not a printable form, and PHED/water connection candidates because no clean official blank printable PDF was confirmed in this pass.
- Rejected/not added in this Rajasthan pass: Jaipur MC `COMING SOON` placeholders, faint fire NOC scan, signed/dark dairy notice pack, procedure-only fire NOC document, dirty scanned SJE pension bundle, dirty scanned Family Pension bundle, signed/scanned Notice pack, dirty mixed VariousOtherForms bundle, unverified Pre-88 direct PDF, and pension revision circular/memo candidates.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
