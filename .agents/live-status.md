# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms page cleanup only.
- Active task completed: full Forms Hub quality/purpose pass after user reported dirty/filled/unclear PDFs.
- Result: current Forms library audited page-by-page from `assets/forms/manifest.json`: 46 forms, 106 PDF pages, 0 rotation/dark/page-count flags after cleanup.
- Result: visual contact sheet reviewed at `C:\tmp\forms-full-audit-20260503-resume\contact.jpg`.
- Result: legacy PAN 49A / 49AA entries and assets removed because PAN allotment for the 2026 flow is now split into Income Tax Forms 93 / 94 / 95 / 96.
- Result: added official 2026 PAN allotment forms:
  - PAN Form 93 - Individual Indian Applicant
  - PAN Form 94 - Non-Individual Indian Applicant
  - PAN Form 95 - Individual Foreign Applicant
  - PAN Form 96 - Non-Individual Foreign Applicant
- Result: kept PAN CR-01 / CR-02 correction forms and clarified their 2026 correction purpose.
- Result: added official Election Commission Voter Form 6A - Overseas Elector.
- Result: clarified all legacy vague Forms titles/descriptions by real service purpose: Rajasthan Food/NFSA, Scholarship income declaration, Marriage, Character, Shop Act Forms 1/4/5/7/13/15, Contract Labour Forms I/IV/V, BOCW, Trade Union, Jan Aadhaar income, Pension Forms 2/5/5A/6/14A/30, SSO update, Aadhaar, Voter, EPFO.
- Result: Rajasthan ration-card PDF rotation metadata normalized and preview/page previews regenerated upright.
- Result: EPFO Composite Claim Non-Aadhaar official alternate was identified at `https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/Form_CCF_nonaadhar.pdf`, but not added because this environment repeatedly timed out downloading the official PDF. Do not add third-party Scribd/PDF-filler copies.
- Forms count is now 46 total.
- Cache bumped to `studioprint-v37`.
- Build result: bundled Node command `node build.js` passed.
- Local QA result: manifest JSON parsed; every manifest PDF and preview exists; automated audit returned 0 flags; built `dist/forms.html` opened in installed Chrome via Playwright; searches for `voter form 6a`, `pan form 93`, `pan form 96`, `shop act form 4`, `contract labour form iv`, `epfo form 11`, and `ration card` passed; `medical limit` absent; preview modal opened for Voter Form 6A; no page/console errors.
- Live QA result: `https://studioprint.pages.dev/forms` contains `Voter Form 6A - Overseas Elector`, `PAN Form 93 - Individual Indian Applicant`, and `Shop Act Form 4 - Change Notice`; it does not contain `PAN 49A` or `Medical Limit Form`; `https://studioprint.pages.dev/sw.js` returns `studioprint-v37`; sample new PAN/Voter PDF and preview URLs returned HTTP 200.
- Source commit pushed: `3ade9b3f7200ab45cf33c65b55381b477c88083f` (`fix(forms): audit form purposes and update 2026 PAN`).

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `sw.js`, `dist/forms.html`, `dist/sw.js`, selected tracked `dist/assets/forms/previews/pages/*` cleanup, `.agents/live-status.md`, `.agents/handoff.md`.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.

## Shared files touched

- `sw.js` touched only for cache-version bump to `studioprint-v37`.
- `forms.html` touched only for Forms page data.
- Did not touch or stage `id-print.html`.

## Commit / deploy / QA

- Website source commit pushed: `3ade9b3f7200ab45cf33c65b55381b477c88083f`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local QA: passed.
- Live QA: passed after Cloudflare propagation.

## Pending work

- EPFO Composite Claim Non-Aadhaar remains pending until the official EPFO PDF can be downloaded cleanly from the official URL. Do not use third-party copies.
- For every future Forms addition, first research the form online from official sources and confirm: what service it is used for, how people/counters use it, whether alternate versions exist, and whether the PDF is current for the year/use case.
- Reject any PDF with filled text, handwriting, signatures, old dates, watermarks, black/dark scans, rotated pages, broken/gibberish text, or unclear purpose.
- Residual local dirty files not owned by this Forms task remain generated/stale: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, and `dist/terms.html`. Do not stage them without checking with the owner of that work.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
