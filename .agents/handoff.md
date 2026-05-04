# Handoff For Parallel Codex Chats

Last updated: 2026-05-04 IST

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
- The latest Forms batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260504` because the original workspace had unrelated dirty files/build output.

## Latest Forms update

- Added 10 official Rajasthan SIPF / NPS forms after PDF inspection:
  - NPS Subscriber Registration Form CSRF-G.
  - NPS Subscriber Details Change Form S2.
  - NPS Inter Sector Shifting Form ISS.
  - NPS Signature/Photo Change Form S7.
  - NPS Tier-II Activation Form S10.
  - NPS Subscriber Grievance Form G1.
  - NPS Superannuation Withdrawal Form 101-GS.
  - NPS Premature Exit Withdrawal Form 102-GP.
  - NPS Death Claim Withdrawal Form 103-GD.
  - NPS State Autonomous Body MCF Form.
- `/forms` now has 110 forms.
- Cache is `studioprint-v51`; ID Print refresh marker is `id-print-v50`.
- Feature commit pushed to `main`: `18bf54b06d85c3a09a2e855938b13536c3ac065e` (`feat(forms): add Rajasthan SIPF NPS forms`).
- A committed `sw.js` conflict-marker block was fixed in this Forms batch while preserving the latest ID Print marker.

## QA done

- Build passed with bundled Node: `node build.js` using the original workspace dependency tree through `NODE_PATH`.
- Manifest validation passed: 110 entries and all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- `dist/forms.html` validation passed: 110 JS entries and new SIPF/NPS entries present.
- `sw.js` and `dist/sw.js` validation passed: no conflict markers; `studioprint-v51` and `id-print-v50` present.
- Live HTML/SW/asset QA passed on `https://studioprint.pages.dev/forms?qa=forms-sipf-nps-*`: page has 110 JS entries and contains NPS Subscriber Registration Form CSRF-G plus NPS Death Claim Withdrawal Form 103-GD. `/sw.js` has `studioprint-v51` and `id-print-v50`; `nps-subscriber-registration-csrf-g-rajasthan.pdf` returns 200.

## Research notes

- Research docs include:
  - `.agents/research/forms-rajasthan-sipf-nps-20260504.md`
  - `.agents/research/forms-rajasthan-labour-employment-20260503.md`
  - `.agents/research/forms-rajasthan-police-sje-20260503.md`
  - `.agents/research/forms-rajasthan-refresh-20260503.md`
  - `.agents/research/forms-rajasthan-revenue-20260503.md`
  - `.agents/research/forms-rajasthan-transport-20260503.md`
- Official source base used in the latest pass:
  - `https://sipf.rajasthan.gov.in/FormNewPensionScheme.aspx`
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
