# Studio Print Live Status

Last updated: 2026-05-04 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched and added 10 official Rajasthan SIPF / NPS forms.
- Result: `/forms` now has 110 forms total.
- Result: added NPS subscriber registration, details change, inter-sector shifting, signature/photo change, Tier-II activation, grievance, superannuation withdrawal, premature-exit withdrawal, death-claim withdrawal, and State Autonomous Body MCF forms.
- Cache bumped to `studioprint-v51`; latest ID Print refresh marker `id-print-v50` preserved.
- Feature commit pushed: `18bf54b06d85c3a09a2e855938b13536c3ac065e` (`feat(forms): add Rajasthan SIPF NPS forms`).
- Previous Forms commits: `98dd9b2` Labour/Employment batch, `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan SIPF/NPS PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-sipf-nps-20260504.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local safety note: this batch was committed from clean worktree `C:\tmp\studioprint-forms-work-20260504` to avoid touching unrelated dirty files in the original workspace.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only to resolve committed conflict markers, bump Forms cache to `studioprint-v51`, and preserve `id-print-v50`.

## Commit / deploy / QA

- Website source commit pushed: `18bf54b06d85c3a09a2e855938b13536c3ac065e`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` with `NODE_PATH` pointing at the existing dependency tree from the original workspace.
- Local validation: passed. Manifest has 110 entries; `forms.html` and `dist/forms.html` each have 110 JS entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema; `sw.js` and `dist/sw.js` have no conflict markers.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-sipf-nps-*`; live page has 110 JS entries and contains `NPS Subscriber Registration Form CSRF-G` plus `NPS Death Claim Withdrawal Form 103-GD`. `/sw.js` contains `studioprint-v51` and `id-print-v50`; `nps-subscriber-registration-csrf-g-rajasthan.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan is still not complete. Continue official-source research for remaining clean citizen-service forms such as Pehchan 2025 Form 1-A/adopted-child, delayed registration documents, appeal forms, general income workflows, and remaining valid scheme/application PDFs.
- Rejected/not added in the SIPF/NPS pass: tilted `NPS-Annexure-N3.pdf`, scanned `Instruction_and_Application_for_withdrawal.pdf`, two SIPF links returning 404, and administrative `Letter-of-Consent-LoC_SABs.pdf`.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
