# Studio Print Live Status

Last updated: 2026-05-05 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: Rajasthan-only gap pass after the user asked to finish Rajasthan before any other state.
- Result: `/forms` now has 166 forms total; Rajasthan has 99 entries.
- Result: added/split current Pehchan Form 14 and Form 15, plus missing clean Rajasthan Pension forms 3, 4, 9, 9A, 33, Life Certificate, and Medical Limit Extension.
- Cache bumped to `studioprint-v57`; latest ID Print refresh marker `id-print-v53` from the other chat was preserved during rebase.
- Feature commit pushed: `fb9d438` (`feat(forms): complete Rajasthan gap pass`).
- Previous Forms commits: `3307447` Delhi Revenue batch, `aaa2cda` West Bengal ration batch, `2db243b` Rajasthan Pehchan support batch, `18bf54b` SIPF/NPS batch, `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Pehchan/Pension PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-gap-pass-20260505.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-20260505` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to bump Forms cache/runtime cache to `studioprint-v57` while preserving remote `id-print-v53`.

## Commit / deploy / QA

- Website source commit pushed: `fb9d438`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 166 entries; `forms.html` and `dist/forms.html` each have 166 JS entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=rajasthan-fb9d438-*`; live page has 166 JS entries and contains `Pehchan Form 14` plus `Pension Medical Limit Extension`. `/sw.js` contains `studioprint-v57` and `id-print-v53`; `pehchan-form-14-delayed-birth-death-reporting-rajasthan.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan known official-source gap pass is now complete for the previously documented Pehchan Form 14/Form 15 gap and missing clean Pension table forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; future Rajasthan additions still need department-by-department official-source research and PDF inspection.
- Rejected/not added in this Rajasthan pass: dirty scanned Family Pension bundle, signed/scanned Notice pack, dirty mixed VariousOtherForms bundle, unverified Pre-88 direct PDF, and pension revision circular/memo candidates.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
