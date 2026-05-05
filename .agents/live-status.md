# Studio Print Live Status

Last updated: 2026-05-05 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched and added 11 official West Bengal ration-card citizen forms.
- Result: `/forms` now has 129 forms total.
- Result: added rural/urban new-family forms, member-inclusion, correction, FPS change, surrender, rural/urban category conversion, duplicate card, identity-purpose card, and mobile/Aadhaar update forms.
- Cache bumped to `studioprint-v55`; latest ID Print refresh marker `id-print-v52` preserved.
- Feature commit pushed: `aaa2cda` (`feat(forms): add West Bengal ration forms`).
- Previous Forms commits: `2db243b` Rajasthan Pehchan support batch, `18bf54b` SIPF/NPS batch, `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new West Bengal ration PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-west-bengal-ration-20260505.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260505-wb` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to bump Forms cache to `studioprint-v55` while preserving `id-print-v52`.

## Commit / deploy / QA

- Website source commit pushed: `aaa2cda`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 129 entries; `forms.html` and `dist/forms.html` each have 129 JS entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-wb-ration-*`; live page has 129 JS entries and contains `West Bengal Ration Form 3R - New Family Rural`, `West Bengal Ration Form 10 - Identity Purpose Card`, and `West Bengal Ration Form 11 - Mobile & Aadhaar Update`. `/sw.js` contains `studioprint-v55` and `id-print-v52`; `west-bengal-ration-form-11-mobile-aadhaar-update.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan is still not complete, but non-Rajasthan expansion has now started with West Bengal.
- Next useful directions: more citizen-service forms from another state, or return to remaining Rajasthan eMitra/appeal/certificate workflows.
- Rejected/not added in the West Bengal ration pass: dealership/business PDFs, because citizen ration-card workflows were prioritized first.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
