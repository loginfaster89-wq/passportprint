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
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-20260505` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Completed Rajasthan-only gap pass after the user asked to finish Rajasthan before moving to any other state.
- Added/split 9 official Rajasthan entries after PDF text/render inspection:
  - Pehchan Form 14 - Delayed Birth/Death Reporting.
  - Pehchan Form 15 - Birth/Death Appeal.
  - Pension Form 3 - Medical Exam Letter.
  - Pension Form 4 - Medical Examination Statement.
  - Pension Form 9 - Service Declaration.
  - Pension Form 9A - Service Admission Order.
  - Pension Form 33 - Provisional Pension/Gratuity.
  - Pension Life Certificate.
  - Pension Medical Limit Extension Application.
- `/forms` now has 166 forms total; Rajasthan has 99 entries.
- Cache is `studioprint-v57`; ID Print refresh marker is `id-print-v53` and was preserved during rebase.
- Feature commit pushed to `main`: `fb9d438` (`feat(forms): complete Rajasthan gap pass`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 166 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- `forms.html` and `dist/forms.html` validation passed: each has 166 JS entries; Rajasthan gap entries are present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v57` and `id-print-v53` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=rajasthan-fb9d438-*`: page has 166 JS entries and contains `Pehchan Form 14` plus `Pension Medical Limit Extension`. `/sw.js` has `studioprint-v57` and `id-print-v53`; `pehchan-form-14-delayed-birth-death-reporting-rajasthan.pdf` returns 200.

## Research notes

- Research docs include:
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
  - `https://pehchan.rajasthan.gov.in/pehchan1/Download/rules2025.pdf`
  - `https://pension.rajasthan.gov.in/`
  - direct PDFs under `https://pension.rajasthan.gov.in/img/pdf/`
- Every accepted PDF was downloaded from the official host, read/inspected, page-count checked, and rendered for visual QA.
- Third-party pages were not used as PDF sources.
- Rejected/not added in this Rajasthan pass: dirty scanned Family Pension bundle, signed/scanned Notice pack, dirty mixed VariousOtherForms bundle, unverified Pre-88 direct PDF, and pension revision circular/memo candidates.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new/refreshed PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan known official-source gap pass is complete for the documented Pehchan Form 14/Form 15 gap and missing clean Pension table forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; any future Rajasthan addition still needs department-by-department official-source research and PDF inspection before listing.
