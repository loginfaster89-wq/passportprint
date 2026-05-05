# Handoff For Parallel Codex Chats

Last updated: 2026-05-05 IST

Current repo path for normal work: `C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

## Required start commands

Every parallel chat should start in:

`C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

Then run:

```powershell
git pull --ff-only origin main
Get-Content .agents\live-status.md
Get-Content .agents\handoff.md
```

## Active scope

- This chat owns Forms Hub work only.
- Do not touch `id-print.html` from this Forms task.
- Another chat may work on ID Print; coordinate through these `.agents` files.
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260505-next` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Added 28 official Delhi Revenue citizen-service forms after PDF text/render inspection:
  - caste/certificate forms: SC, OBC, nationality, domicile, income, solvency.
  - marriage forms: Hindu registration, Special Marriage registration, intended-marriage notice, affidavit, identification certificate.
  - birth/death and affidavit forms: birth order affidavit, birth registration order, death registration order, surviving member, freedom fighter, income affidavit.
  - property/stamp/other forms: Abadi/Extended Abadi, non-encumbrance affidavit/search report, disability ID card, RTI Form A, e-stamp refund affidavit/application/indemnity bond.
- `/forms` now has 157 forms.
- Cache is `studioprint-v56`; ID Print refresh marker is `id-print-v52`.
- Feature commit pushed to `main`: `3307447` (`feat(forms): add Delhi revenue forms`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 157 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- `dist/forms.html` validation passed: 157 JS entries and new Delhi Revenue entries present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v56` and `id-print-v52` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=delhi-3307447-*`: page has 157 JS entries and contains Delhi SC Certificate Application plus Delhi Marriage Identification Certificate. `/sw.js` has `studioprint-v56` and `id-print-v52`; `delhi-income-certificate-application.pdf` returns 200.

## Research notes

- Research docs include:
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
  - `https://revenue.delhi.gov.in/revenue/forms-downloads`
  - direct PDFs under `https://revenue.delhi.gov.in/sites/default/files/revenue/`
- Every accepted PDF was downloaded from the official host, read/inspected, page-count checked, and rendered for visual QA.
- Third-party pages were not used as PDF sources.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new/refreshed PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Next pass can either expand another state department batch or return to remaining Rajasthan citizen-service gaps.
