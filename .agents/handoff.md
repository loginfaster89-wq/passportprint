# Handoff For Parallel Codex Chats

Last updated: 2026-05-06 00:08 IST

## Paused UI polish WIP

- User paused the UI polish/live update work overnight around 2026-05-06 00:08 IST. Do not deploy this WIP until it is resumed, rebuilt, and re-tested.
- Active lock owner is `ChatGPT Codex UI polish chat`; lock intentionally remains `ACTIVE` so another chat does not edit the same shared UI/cache files.
- Local workspace has uncommitted WIP changes. Current dirty tracked files include shared app shell pages, `assets/legal.css`, `assets/auth.js`, `assets/deferred-ui.js`, `assets/pricing.css`, `assets/pwa.js`, `_headers`, and `sw.js`. Untracked `.well-known/`, `favicon.ico`, and `artifacts/` are from the other deploy/status work and should not be blindly deleted.
- Intended UI scope: cache freshness for first-load users, shared fixed/sticky header spacing, auto pill/card marquees for non-control informational chips, Google button visibility in login modal, pricing button/badge contrast, Passport mobile upload compactness, Passport remove-background card border, Forms preview color polish, and general mobile overflow/performance.
- Current important WIP details:
  - `sw.js` cache markers bumped to `studioprint-v64` / `site-v64`.
  - `_headers` now makes CSS/JS/manifest app shell assets no-cache to avoid hard-refresh issues.
  - Root HTML files were query-bumped to `?v=ui-polish-v64`.
  - `assets/deferred-ui.js` lazy-loads auth/pricing with `?v=ui-polish-v64`.
  - Shared auth and Passport inline auth show the Google fallback button instead of hiding the section on preview origins.
  - Pricing modal CTA/badge colors were changed from black to yellow accent.
  - Infinite strips were added/forced for homepage hero trust pills, Passport benefit/upload pills, and ID Print informational cards/pills.
  - Latest local edit changed `assets/legal.css` from sticky to fixed shared header with centralized body top padding; this must be re-tested because it was made right before pausing.
- Verification already attempted before the final header patch:
  - Fresh preview server on port `8127` returned current CSS.
  - Chrome/Playwright smoke test showed no horizontal overflow on index, passport, forms, id-print, refund at desktop/phone/tablet.
  - Auto marquee motion was confirmed for visible homepage, Passport, and ID Print informational tracks.
  - Google login fallback was visible in the shared login modal.
  - The pre-patch sticky header did not remain sticky while scrolling, which is why the final `assets/legal.css` fixed-header change was started.
- Resume checklist:
  - Run `git status --short --branch`.
  - Re-test `assets/legal.css` fixed-header spacing on index, passport, forms, id-print, and legal pages at phone/tablet/desktop.
  - Run `git diff --check`; earlier failures were only CRLF trailing whitespace on a few edited HTML lines and were mostly cleaned.
  - Build with bundled Node: `C:\Users\ajayt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe build.js` with `NODE_PATH` pointed at bundled `node_modules` if needed.
  - Only after tests pass, update `dist/`, commit source, push, deploy per `.agents/deploy-policy.md`, verify live, then release the lock.

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
- Latest live recovery was completed by Cloudflare dashboard Direct Upload on 2026-05-05 21:51 IST after GitHub Actions hosted runners failed to acquire a runner. The Google verification tag is now live on `https://studioprint.pages.dev/`.

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
