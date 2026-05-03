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
- `passport-photo.html`, `dist/passport-photo.html`, `assets/legal.css`, `dist/assets/legal.css`, and `dist/_headers` are locally modified from unrelated work/build output and were not staged by this Forms task.

## Latest Forms update

- Added 7 official clean Rajasthan Police/SJE forms after PDF inspection:
  - Bikaner Police Servant/Employee Verification.
  - Bikaner Police Tenant/PG Verification.
  - Private Security Agency Licence Form I.
  - Private Security Agency Applicant Verification Form II.
  - Private Security Agency Affidavit Form III.
  - Palanhar Scheme Application.
  - Income Certificate Format - RajSSP Pension.
- `/forms` now has 92 forms.
- Cache is `studioprint-v48`; ID Print refresh marker remains `id-print-v47`.
- Feature commit pushed to `main`: `6772479` (`feat(forms): add Rajasthan police and SJE forms`).
- Previous Forms commits: `1114eb2` refreshed 7 Rajasthan PDFs; `34a75f5` added 10 official clean Rajasthan Revenue/eMitra forms.

## QA done

- Build passed with bundled Node: `node build.js`.
- Manifest validation passed: 92 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-police-sje-6772479-retry`: page has 92 JS entries and contains Palanhar, Bikaner Police Tenant/PG, and RajSSP income entries. `/sw.js` has `studioprint-v48` and `id-print-v47`; `income-certificate-format-rajssp-rajasthan.pdf` returns 200.

## Research notes

- Research docs: `.agents/research/forms-rajasthan-revenue-20260503.md`, `.agents/research/forms-rajasthan-refresh-20260503.md`, and `.agents/research/forms-rajasthan-police-sje-20260503.md`.
- Official source bases: `https://emitraapp.rajasthan.gov.in/`, `https://pehchan.rajasthan.gov.in/`, `https://www.police.rajasthan.gov.in/`, and `https://sje.rajasthan.gov.in/`.
- Every accepted/refreshed PDF was downloaded from an official direct URL, read/inspected, page-count checked, and previewed as clean blank form.
- Third-party pages were used only for candidate discovery; no third-party-hosted PDFs were added.
- Rejected manuals/guides, dirty pen-marked candidates, coloured/rotated Police scans, office-only forms, missing standalone Form 1-A URL guesses, and older lower-quality duplicates were documented in the research notes.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new/refreshed PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan is not complete yet. Continue official-source research before adding income certificate, Pehchan 2025 Form 1-A/adopted-child, delayed registration, appeal, or other citizen-service forms.
