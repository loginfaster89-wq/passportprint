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
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260505-wb` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Added 11 official West Bengal ration-card citizen forms after PDF inspection:
  - West Bengal Ration Form 3R - New Family Rural.
  - West Bengal Ration Form 3U - New Family Urban.
  - West Bengal Ration Form 4 - Member Inclusion.
  - West Bengal Ration Form 5 - Card Correction.
  - West Bengal Ration Form 6 - FPS/Kerosene Shop Change.
  - West Bengal Ration Form 7 - Surrender DRC.
  - West Bengal Ration Form 8R - Rural Category Conversion.
  - West Bengal Ration Form 8U - Urban Category Conversion.
  - West Bengal Ration Form 9 - Duplicate Card.
  - West Bengal Ration Form 10 - Identity Purpose Card.
  - West Bengal Ration Form 11 - Mobile & Aadhaar Update.
- `/forms` now has 129 forms.
- Cache is `studioprint-v55`; ID Print refresh marker is `id-print-v52`.
- Feature commit pushed to `main`: `aaa2cda` (`feat(forms): add West Bengal ration forms`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 129 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- `dist/forms.html` validation passed: 129 JS entries and new West Bengal ration entries present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v55` and `id-print-v52` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-wb-ration-*`: page has 129 JS entries and contains West Bengal Ration Form 3R - New Family Rural, West Bengal Ration Form 10 - Identity Purpose Card, and West Bengal Ration Form 11 - Mobile & Aadhaar Update. `/sw.js` has `studioprint-v55` and `id-print-v52`; `west-bengal-ration-form-11-mobile-aadhaar-update.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-west-bengal-ration-20260505.md`
  - `.agents/research/forms-rajasthan-pehchan-additional-20260504.md`
  - `.agents/research/forms-rajasthan-sipf-nps-20260504.md`
  - `.agents/research/forms-rajasthan-labour-employment-20260503.md`
  - `.agents/research/forms-rajasthan-police-sje-20260503.md`
  - `.agents/research/forms-rajasthan-refresh-20260503.md`
  - `.agents/research/forms-rajasthan-revenue-20260503.md`
  - `.agents/research/forms-rajasthan-transport-20260503.md`
- Official source base used in the latest pass:
  - `https://food.wb.gov.in/food/pds/application.html`
  - direct PDF host `https://wbfss.wb.gov.in/food/PDS/Forms/`
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
- Next pass can either expand another state or return to remaining Rajasthan citizen-service gaps.
