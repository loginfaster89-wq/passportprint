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

## Summary

- This chat worked only on Forms cleanup.
- User reported that the Forms Hub must not contain dirty, filled, signed, watermarked, old handwritten, dark scan, rotated, or broken-text PDFs, and that forms must be listed by real use case instead of vague names.
- Removed `Medical Limit Form` and assets because its rendered page 3 had corrupt/gibberish text.
- Replaced one generic Aadhaar entry with official UIDAI Forms 1-8, separated by applicant/use case.
- Split PAN into new PAN and correction use cases: 49A, 49AA, CR-01 individual correction, CR-02 non-individual correction. CR-01/CR-02 PDFs were extracted from the official 2026 Income Tax order and exclude the signed order cover page.
- Clarified Voter form titles by action: new registration, Aadhaar link, delete/object, correction/shift.
- Fixed legacy Rajasthan ration-card PDF/preview orientation to readable upright pages and retitled it `Ration Card New/Update`.
- Forms count is now 43 total.
- Cache bumped to `studioprint-v35`.
- `node build.js` passed using bundled Node.
- Local QA passed: manifest assets/previews/page-previews all exist; headless Chrome search smoke test passed with no console/page errors.
- Live QA passed: `/forms` shows Aadhaar Form 7, PAN CR-01, Ration Card New/Update; `Medical Limit Form` is absent; `/sw.js` has `studioprint-v35`; sample new PDF and preview URLs returned HTTP 200.
- Source commit pushed to `main`: `928aa793d8d00c900caf13ff067506aa00bce4a5` (`fix(forms): split official aadhaar and pan forms`).

## Coordination note

- Do not touch `id-print.html` from this Forms thread. Another chat owns ID Print work.
- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `sw.js`, `dist/forms.html`, `dist/sw.js`, `.agents/live-status.md`, `.agents/handoff.md`.
- Residual local dirty files not owned by this task: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/id-print.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, `dist/terms.html`, and tracked `dist/assets/forms/previews/pages/ration-card-rajasthan-p*.png`.

## Next suggested action

- Continue Forms quality work category-by-category. For each new form, confirm official source, blank/clean PDF, readable text, no handwriting/signature/fill, correct orientation, and clear service purpose.
- If continuing ID Print work, first pull latest `main` and do not reuse old local `dist/id-print.html` changes.
