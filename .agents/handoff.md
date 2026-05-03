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

- Added 3 official clean Rajasthan civil-registration forms from Rajasthan LSG:
  - `Birth Report Form 1`
  - `Death Report Form 2`
  - `Still Birth Report Form 3`
- Removed old `Income Declaration - Scholarship` because its PDF text was a 2019-20 scholarship-year format and no current clean official replacement was verified.
- `/forms` now has 51 forms.
- Cache is `studioprint-v43`; ID Print refresh marker remains `id-print-v42`.
- Feature commit pushed to `main`: `05ff784` (`feat(forms): add Rajasthan civil registration forms`).

## QA done

- Build passed with bundled Node: `node build.js`.
- Manifest validation passed: 51 entries, all referenced source PDFs/previews/page-previews exist, and manifest page counts match actual PDF page counts.
- Local Chrome headless smoke passed on `dist/forms.html`: page rendered 51 forms and showed the new birth/death/still-birth cards.
- Live HTML/SW QA passed on `https://studioprint.pages.dev/forms?qa=forms-civil-05ff784`: all 3 new forms present, old income entry absent, `/sw.js` has `studioprint-v43` and `id-print-v42`.
- Live Chrome headless smoke passed on production `/forms`.

## Research notes

- Research doc: `.agents/research/forms-rajasthan-civil-registration-20260503.md`.
- Rajasthan LSG `BPL.pdf` was rejected because it is a 2003 scanned BPL survey document, image-only/dirty/old, not a clean current blank form.
- Pehchan 2025 Act/Rules PDF was checked as legal context, but it is a rules booklet, not a standalone printable blank form.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate blank forms.
- Do not add filled, pen-written, signed, watermarked, old-dated, dark, rotated, unclear, or third-party PDFs.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, civil-registration PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan is not complete yet. Continue official-source research before adding caste, domicile/bonafide, EWS, income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, or appeal forms.
