# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms page cleanup only.
- Active task: fix Forms Hub quality after user reported dirty/filled/broken PDFs and weak form-purpose labelling.
- Task result: removed `Medical Limit Form` because the PDF rendered corrupt/gibberish text on page 3 and is not acceptable as a clean blank form.
- Task result: replaced generic `Aadhaar Form` with official UIDAI `Aadhaar Form 1` through `Aadhaar Form 8`, separated by applicant/use case: adult India address, adult NRI foreign address, child 5-18 India address, child NRI foreign address, child below 5 India address, child below 5 NRI, foreign national adult, foreign national child.
- Task result: split PAN into new PAN and correction use cases: `PAN 49A - New PAN Indian Citizen`, `PAN 49AA - New PAN Foreign Citizen`, `PAN CR-01 - Correction Individual`, and `PAN CR-02 - Correction Non-Individual`. PAN correction forms were split from the official 2026 Income Tax order so the signed order cover page is not exposed as a user form.
- Task result: clarified Voter titles by purpose: Form 6 new registration, Form 6B Aadhaar link, Form 7 delete/object, Form 8 correction/shift.
- Task result: fixed Rajasthan `Ration Card New/Update` preview/PDF orientation from sideways scan to readable upright pages.
- Forms count is now 43 total.
- Build result: bundled Node command `node build.js` passed.
- Local QA result: manifest JSON parsed; every manifest PDF, preview, and page preview exists; built `dist/forms.html` opened in headless Chrome; searches for `aadhaar form 7`, `adult nri foreign address`, `pan cr-01`, and `ration card` passed; `medical limit` returned zero cards; no page errors.
- Live QA result: `https://studioprint.pages.dev/forms` contains `Aadhaar Form 7 - Foreign National Adult`, `PAN CR-01 - Correction Individual`, and `Ration Card New/Update`; it no longer contains `Medical Limit Form`; `https://studioprint.pages.dev/sw.js` returns `studioprint-v35`; sample new PDF and page preview URLs returned HTTP 200.
- Source commit pushed: `928aa793d8d00c900caf13ff067506aa00bce4a5` (`fix(forms): split official aadhaar and pan forms`).

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `sw.js`, `dist/forms.html`, `dist/sw.js`, `.agents/live-status.md`, `.agents/handoff.md`.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.

## Shared files touched

- `sw.js` touched only for cache-version bump to `studioprint-v35`.
- `forms.html` touched only for Forms page data.
- Did not touch or stage `id-print.html`.

## Commit / deploy / QA

- Website source commit pushed: `928aa793d8d00c900caf13ff067506aa00bce4a5`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Live QA: passed.

## Pending work

- Remaining legacy Forms entries still need one-by-one official validation before calling the library complete. Do not bulk-add Indian forms from random scans; use official clean blank PDFs only.
- For future Forms additions, reject files with filled text, handwriting, signatures, old dates, watermarks, black/dark scans, rotated pages, broken/gibberish text, or unclear purpose.
- Residual local dirty files not owned by this Forms task remain generated/stale: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/id-print.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, `dist/terms.html`, and tracked `dist/assets/forms/previews/pages/ration-card-rajasthan-p*.png`. Do not stage them without checking with the owner of that work.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
