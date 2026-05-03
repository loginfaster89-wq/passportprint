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
- `passport-photo.html` and `dist/passport-photo.html` are locally modified from unrelated work and were not staged by this Forms task.

## Latest Forms update

- Added 10 official clean Rajasthan Revenue/eMitra forms from official `emitraapp.rajasthan.gov.in` direct PDF sources:
  - Domicile / Bonafide Certificate Application.
  - OBC/SBC Caste Certificate Application.
  - SC/ST Caste Certificate Application.
  - Minority Community Certificate Application.
  - General Caste Certificate Application.
  - EWS Income & Asset Certificate - Rajasthan State.
  - EWS Income & Asset Certificate - Central/State.
  - Land Mutation Application.
  - Seemagyan / Boundary Application.
  - Solvency / Haisiyat Certificate Application.
- `/forms` now has 85 forms.
- Cache is `studioprint-v45`; ID Print refresh marker remains `id-print-v44`.
- Feature commit pushed to `main`: `34a75f5` (`feat(forms): add Rajasthan revenue forms`).

## QA done

- Build passed with bundled Node: `node build.js`.
- Manifest validation passed: 85 entries, 10 new Revenue/eMitra entries, all referenced source PDFs/previews/page-previews exist, and manifest page counts match actual PDF page counts.
- Local Chrome headless smoke passed on `dist/forms.html`: page rendered 85 forms and contained new Revenue entries.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-revenue-34a75f5-final`: new Revenue forms present, `/sw.js` has `studioprint-v45` and `id-print-v44`, and `domicile-bonafide-certificate-rajasthan.pdf` returns 200.
- Live Chrome headless smoke passed on production `/forms`.

## Research notes

- Research doc: `.agents/research/forms-rajasthan-revenue-20260503.md`.
- Official source base: `https://emitraapp.rajasthan.gov.in/`.
- Every accepted PDF was downloaded from an official eMitra direct URL, read with PyMuPDF, page-count checked, and previewed as clean blank form.
- Third-party pages were used only for candidate discovery; no third-party-hosted PDFs were added.
- Rejected manuals/guides and old image-only ration duplicates were documented in the research note.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new Revenue/eMitra PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan is not complete yet. Continue official-source research before adding income certificate, Pehchan 2025 Form 1-A/adopted-child, delayed registration, appeal, or other citizen-service forms.
