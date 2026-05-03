# Handoff For Parallel Codex Chats

Last updated: 2026-05-03 IST

Current repo path used in this chat: `C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

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

## Latest Forms update

- Added 24 official clean Rajasthan Transport forms from the Rajasthan Transport Department forms page:
  - Driving licence / medical: Form 2, Form 4, Form 9, Form R.S. 2.3, Form 8, Form 4A, Form 1, Form 1A.
  - Vehicle registration / RC: Form R.S. 4.1, Form 20, Form 25, Form 26, Form 27, Form R.S. 4.1A, Form 28, Form 29, Form 30, Form 33, Form 34, Form 35.
  - Fitness / permit: Form R.S. 4.6, Form R.S. 4.7, Form R.S. 5.1, Form R.S. 5.2.
- `/forms` now has 75 forms.
- Cache is `studioprint-v44`; ID Print refresh marker remains `id-print-v43`.
- Feature commit pushed to `main`: `ae66863` (`feat(forms): add Rajasthan transport forms`).

## QA done

- Build passed with bundled Node: `node build.js`.
- Manifest validation passed: 75 entries, 24 Transport entries, all referenced source PDFs/previews/page-previews exist, and manifest page counts match actual PDF page counts.
- Local Chrome headless smoke passed on `dist/forms.html`: page rendered 75 forms and contained new Transport entries.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-transport-ae66863`: new Transport forms present, `/sw.js` has `studioprint-v44` and `id-print-v43`, and `transport-vehicle-registration-form-20-rajasthan.pdf` returns 200.
- Live Chrome headless smoke passed on production `/forms`.

## Research notes

- Research doc: `.agents/research/forms-rajasthan-transport-20260503.md`.
- Official source page: `https://transport.rajasthan.gov.in/content/transportportal/hi/transport/downloads/Forms.html`.
- Every accepted PDF was downloaded from an official `transport.rajasthan.gov.in/content/dam/transport/...` direct URL, read with PyMuPDF, page-count checked, and previewed as clean blank text-readable form.
- eMitra caste, domicile/bonafide, income, and EWS third-party pages were not added because clean official standalone printable PDFs were not verified in this pass.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new Transport PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan is not complete yet. Continue official-source research before adding caste, domicile/bonafide, EWS, general income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, or appeal forms.
