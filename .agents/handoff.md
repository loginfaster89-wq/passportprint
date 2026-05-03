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
- `index.html`, `passport-photo.html`, `assets/legal.css`, `dist/_headers`, `dist/index.html`, `dist/passport-photo.html`, and `dist/assets/legal.css` are locally modified from unrelated work/build output and were not staged by this Forms task.

## Latest Forms update

- Added 8 official Rajasthan Labour/Employment forms after PDF inspection:
  - BOCW Welfare Scheme Common Application.
  - Unemployment Allowance Income Declaration - Annexure I.
  - Unemployment Allowance Witness Certificate - Annexure K.
  - Unemployment Allowance Self Declaration - Annexure 1.
  - Unemployment Internship Attendance Certificate.
  - Unemployment Internship Joining Certificate.
  - Unemployment Skill Training Joining Certificate.
  - Unemployment Skill Training Attendance Certificate.
- The official Employment internship/skill-training PDF was split into four one-page local PDFs because it contains four separate workflows.
- `/forms` now has 100 forms.
- Cache is `studioprint-v50`; ID Print refresh marker is `id-print-v49`.
- Feature commit pushed to `main`: `98dd9b2` (`feat(forms): add Rajasthan labour employment forms`).
- Latest parallel ID Print commit observed before push: `61a7d0b`.

## QA done

- Build passed with bundled Node: `node build.js`.
- Manifest validation passed: 100 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- `dist/forms.html` validation passed: 100 JS entries and new BOCW/unemployment entries present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-labour-employment-98dd9b2-*`: page has 100 JS entries and contains BOCW Welfare Scheme Common Application plus Unemployment Skill Training Attendance Certificate. `/sw.js` has `studioprint-v50` and `id-print-v49`; `unemployment-allowance-income-i-rajasthan.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-rajasthan-labour-employment-20260503.md`
  - `.agents/research/forms-rajasthan-police-sje-20260503.md`
  - `.agents/research/forms-rajasthan-refresh-20260503.md`
  - `.agents/research/forms-rajasthan-revenue-20260503.md`
  - `.agents/research/forms-rajasthan-transport-20260503.md`
- Official source bases used in the latest pass:
  - `https://labour.rajasthan.gov.in/`
  - `https://employment.livelihoods.rajasthan.gov.in/`
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
- Rajasthan is not complete yet. Continue official-source research before adding Pehchan 2025 Form 1-A/adopted-child, delayed registration, appeal, general income, or other citizen-service forms.
