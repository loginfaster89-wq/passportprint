# Handoff For Parallel Codex Chats

Last updated: 2026-05-04 IST

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
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260504-next` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Added 8 official Rajasthan Pehchan support forms after PDF inspection:
  - Birth Report for Adopted Child Form 1-A.
  - MCCD Form 4 - Institutional Death.
  - MCCD Form 4A - Non-Institutional Death.
  - Delayed Birth Affidavit - After 1 Year.
  - Delayed Death Affidavit - After 1 Year.
  - Delayed Birth Affidavit - 30 Days to 1 Year.
  - Delayed Death Affidavit - 30 Days to 1 Year.
  - Marriage Registration Affidavit Pack.
- `Mccd_Form.pdf` was split into two entries because Form 4 and Form 4A are separate workflows.
- `BirthDeathAffidavait.pdf` was split into four entries because birth/death and 30-days-to-1-year/after-1-year cases are separate workflows.
- `/forms` now has 118 forms.
- Cache is `studioprint-v52`; ID Print refresh marker is `id-print-v50`.
- Feature commit pushed to `main`: `2db243b` (`feat(forms): add Rajasthan Pehchan support forms`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 118 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- `dist/forms.html` validation passed: 118 JS entries and new Pehchan entries present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v52` and `id-print-v50` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-pehchan-additional-*`: page has 118 JS entries and contains Birth Report for Adopted Child Form 1-A, Delayed Death Affidavit - 30 Days to 1 Year, and Marriage Registration Affidavit Pack. `/sw.js` has `studioprint-v52` and `id-print-v50`; `delayed-birth-affidavit-after-one-year-rajasthan.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-rajasthan-pehchan-additional-20260504.md`
  - `.agents/research/forms-rajasthan-sipf-nps-20260504.md`
  - `.agents/research/forms-rajasthan-labour-employment-20260503.md`
  - `.agents/research/forms-rajasthan-police-sje-20260503.md`
  - `.agents/research/forms-rajasthan-refresh-20260503.md`
  - `.agents/research/forms-rajasthan-revenue-20260503.md`
  - `.agents/research/forms-rajasthan-transport-20260503.md`
- Official source base used in the latest pass:
  - `https://pehchan.rajasthan.gov.in/pehchan5/Mainpage.aspx`
- Every accepted PDF was downloaded from an official direct URL, read/inspected, page-count checked, and rendered for visual QA.
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
- Rajasthan is not complete yet. Continue official-source research before adding additional eMitra certificate workflows, appeal forms, general income workflows, or other valid scheme/application PDFs.
