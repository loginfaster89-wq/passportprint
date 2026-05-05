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
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-more-20260505` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Completed Rajasthan-only electricity DISCOM pass after the user asked to finish Rajasthan before moving to any other state.
- Added 3 official Rajasthan electricity entries after PDF text/render inspection:
  - JVVNL Electricity New Connection / Load Change.
  - AVVNL Electricity New Connection / Load Change.
  - JDVVNL Electricity New Connection / Load Change.
- Original RajNivesh cover/index page was intentionally not listed because it is not a printable form.
- `/forms` now has 181 forms total; Rajasthan has 114 entries.
- Cache is `studioprint-v59`; ID Print refresh marker is `id-print-v53` and was preserved.
- Feature commit pushed to `main`: `4ce90d7` (`feat(forms): add Rajasthan electricity forms`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 181 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Actual PDF page-count validation passed against manifest for all 181 entries.
- `forms.html` validation passed: 181 JS entries; JVVNL / AVVNL / JDVVNL entries are present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v59` and `id-print-v53` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=rajasthan-electricity-4ce90d7-*`: page contains JVVNL, AVVNL, and JDVVNL electricity entries. `/sw.js` has `studioprint-v59` and `id-print-v53`; `rajasthan-electricity-jvvnl-new-connection-load-change.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-rajasthan-electricity-20260505.md`
  - `.agents/research/forms-rajasthan-udh-jaipurmc-20260505.md`
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
  - `https://rajnivesh.rajasthan.gov.in/Uploads/0e937ea0-0c19-44bf-87fc-8375f086e0bdNew%20Electricity%20Connection%20Form%20final.pdf`
- Every accepted PDF was downloaded from the official host, read/inspected, page-count checked, and rendered for visual QA.
- Third-party pages were not used as PDF sources.
- Rejected/not added in this electricity pass: RajNivesh cover/index page because it is not a printable form, and PHED/water connection candidates because no clean official blank printable PDF was confirmed in this pass.
- Rejected/not added in the previous UDH / Jaipur MC pass: Jaipur MC `COMING SOON` placeholders, faint fire NOC scan, signed/dark dairy notice pack, procedure-only fire NOC document, dirty scanned SJE pension bundle, dirty scanned Family Pension bundle, signed/scanned Notice pack, dirty mixed VariousOtherForms bundle, unverified Pre-88 direct PDF, and pension revision circular/memo candidates.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate forms.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms are acceptable only when still valid/current-use and clean.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, new/refreshed PDFs/previews under `assets/forms/**`, `sw.js`, related tracked `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Rajasthan known official-source gap pass now includes the documented Pehchan Form 14/Form 15 gap, missing clean Pension table forms, clean UDH / Jaipur MC forms, and clean electricity DISCOM forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; any future Rajasthan addition still needs department-by-department official-source research and PDF inspection before listing.
