# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms page cleanup only.
- Active task: remove dirty/scanned/filled Rajasthan PDFs from Forms and replace them with clean blank official PDFs.
- Task result: 7 bad Rajasthan entries removed: Labour Beneficiary, Shop Act Form 3, Life Certificate, Family Pension Forms, Birth Application, Death Application, Self Declaration.
- Replacement result: 7 clean Rajasthan Pension portal PDFs added: Pension Form 2, Pension Form 5, Pension Form 5A, Pension Form 6, Pension Form 14A, Pension Form 30, Medical Limit Form.
- Forms count remains 35 total.
- Build result: `node build.js` passed.
- Local QA result: manifest JSON parsed; every manifest PDF, preview, and page preview exists; built `dist/forms.html` opened in headless Chrome; searches for `pension form 2` and `medical limit` passed; removed titles `Birth Application` and `Self Declaration` returned zero cards; no page errors.
- Live QA result: `https://studioprint.pages.dev/forms` now contains `Pension Form 2` and `Medical Limit Form`, no longer contains `Birth Application` or `Family Pension Forms`; `https://studioprint.pages.dev/sw.js` returns `studioprint-v34`; sample new PDF and page preview returned HTTP 200.
- Source commit pushed: `f9196c82b38f0c5bbb0e19205f29a50e3669a4c7` (`fix(forms): replace dirty Rajasthan PDFs`).

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `sw.js`, `dist/forms.html`, `dist/sw.js`, `.agents/live-status.md`, `.agents/handoff.md`.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.

## Shared files touched

- `sw.js` touched only for cache-version bump to `studioprint-v34`.
- `forms.html` touched only for Forms page data.
- Did not touch or stage `id-print.html`.

## Commit / deploy / QA

- Website source commit pushed: `f9196c82b38f0c5bbb0e19205f29a50e3669a4c7`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, `node build.js`.
- Live QA: passed.

## Pending work

- Legacy `Ration Card` preview is still sideways/scan-like from the older Forms set. It was not part of this cleanup commit to keep the diff controlled, but it should be audited/replaced in a separate Forms pass if the owner wants every legacy Rajasthan form to be pristine.
- Residual local dirty files not owned by this Forms task remain generated/stale: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/id-print.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, and `dist/terms.html`. Do not stage them without checking with the owner of that work.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
