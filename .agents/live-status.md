# Studio Print Live Status

Last updated: 2026-05-05 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched and added 28 official Delhi Revenue citizen-service forms.
- Result: `/forms` now has 157 forms total.
- Result: added Delhi caste/certificate, marriage, birth/death order, domicile/income, solvency, non-encumbrance, surviving-member, RTI, e-stamp refund, disability ID, and related affidavit formats.
- Cache bumped to `studioprint-v56`; latest ID Print refresh marker `id-print-v52` preserved.
- Feature commit pushed: `3307447` (`feat(forms): add Delhi revenue forms`).
- Previous Forms commits: `aaa2cda` West Bengal ration batch, `2db243b` Rajasthan Pehchan support batch, `18bf54b` SIPF/NPS batch, `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Delhi Revenue PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-delhi-revenue-20260505.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260505-next` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to bump Forms cache to `studioprint-v56` while preserving `id-print-v52`.

## Commit / deploy / QA

- Website source commit pushed: `3307447`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 157 entries; `forms.html` and `dist/forms.html` each have 157 JS entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=delhi-3307447-*`; live page has 157 JS entries and contains `Delhi SC Certificate Application` and `Delhi Marriage Identification Certificate`. `/sw.js` contains `studioprint-v56` and `id-print-v52`; `delhi-income-certificate-application.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan is still not complete, and non-Rajasthan expansion now includes West Bengal and Delhi.
- Next useful directions: add another high-value state department batch, or return to remaining Rajasthan eMitra/appeal/certificate workflows.
- Rejected/not added in the Delhi pass: duplicate SC other-state PDF, OBC/SC caste lists, circle-rate notification, marriage order, lower-quality stamped Non-Creamy Layer/OBC prescribed-format scans, and non-form circular/act/handbook links.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
