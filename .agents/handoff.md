# Handoff For Parallel Codex Chats

Last updated: 2026-05-05 IST

Current repo path for normal work: `C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

## Required start commands

Every parallel chat should start in:

`C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

Then run:

```powershell
git pull --ff-only origin main
Get-Content .agents\work-locks.md
powershell -ExecutionPolicy Bypass -File .agents\check-work-lock.ps1
Get-Content .agents\live-status.md
Get-Content .agents\handoff.md
```

If `.agents/check-work-lock.ps1` reports an active lock, stop before editing,
pushing, or deploying. The active owner must finish or release the lock first.

## Deployment rule

- Production deploys are manual-only. Normal source pushes to `main` should not trigger Cloudflare Pages.
- Read `.agents/deploy-policy.md` before attempting any live deploy.
- Read `.agents/work-locks.md` and take the global edit lock before any live deploy or shared-file change.
- Only one deploy owner should run `Deploy to Cloudflare Pages` from GitHub Actions after collecting ready changes and validating the latest `origin/main`.
- Do not push empty retry commits for runner or Cloudflare internal errors; use `Re-run jobs` or wait for the external service to recover.
- Current deploy blocker was external runner/Cloudflare instability, not the Google verification tag code. The tag is already on `main`.

## Active scope

- This chat owns Forms Hub work only.
- Do not touch `id-print.html` from this Forms task.
- Another chat may work on ID Print; coordinate through these `.agents` files.
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-rajasthan-next2-20260505` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Completed Rajasthan-only Legal Metrology / Consumer Affairs pass after the user asked to finish Rajasthan before moving to any other state.
- Added 4 official Rajasthan Legal Metrology entries after PDF text/render inspection:
  - Legal Metrology Dealer Licence Form LD-1.
  - Legal Metrology Manufacturer Licence Form LM-1.
  - Legal Metrology Repairer Licence Form LR-1.
  - Legal Metrology Packer/Manufacturer Registration.
- E-Tulaman verification/stamping was intentionally not listed because it is a portal user-manual, not a blank printable form.
- `/forms` now has 185 forms total; Rajasthan has 118 entries.
- Cache is `studioprint-v60`; ID Print refresh marker is `id-print-v53` and was preserved.
- Feature commit pushed to `main`: `559fd78` (`feat(forms): add Rajasthan legal metrology forms`).

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 185 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Actual PDF page-count validation passed against manifest for all 185 entries.
- `forms.html` validation passed: 185 JS entries; Legal Metrology dealer/manufacturer/repairer/packer entries are present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v60` and `id-print-v53` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=rajasthan-legal-metrology-559fd78-*`: page contains Legal Metrology dealer/manufacturer/repairer/packer entries. `/sw.js` has `studioprint-v60` and `id-print-v53`; `rajasthan-legal-metrology-dealer-licence-ld1.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-rajasthan-legal-metrology-20260505.md`
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
  - `https://rajnivesh.rajasthan.gov.in/Home/Forms`
  - direct PDFs under `https://rajnivesh.rajasthan.gov.in/Uploads/`
- Every accepted PDF was downloaded from the official host, read/inspected, page-count checked, and rendered for visual QA.
- Third-party pages were not used as PDF sources.
- Rejected/not added in this Legal Metrology pass: E-Tulaman verification/stamping PDF because it is a portal user-manual, not a blank printable form.
- Rejected/not added in the electricity pass: RajNivesh cover/index page because it is not a printable form, and PHED/water connection candidates because no clean official blank printable PDF was confirmed in this pass.
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
- Rajasthan known official-source gap pass now includes the documented Pehchan Form 14/Form 15 gap, missing clean Pension table forms, clean UDH / Jaipur MC forms, clean electricity DISCOM forms, and clean Legal Metrology forms verified on 2026-05-05.
- Do not claim every Rajasthan government PDF forever; any future Rajasthan addition still needs department-by-department official-source research and PDF inspection before listing.
