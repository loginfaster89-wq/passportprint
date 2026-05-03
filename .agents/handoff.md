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

## Latest ID Print update

- This chat worked only on ID Print calibration/test-sheet support.
- Commit pushed to `main`: `9167c07a0c9f1a9c42c84b73f4cddacdacaf0b1f` (`feat(id-print): add A4 calibration test sheet`).
- `/id-print` now lets a user open an A4 calibration test sheet without uploading a PDF.
- The calibration sheet is a real 300 DPI A4 canvas (`2480 x 3508`) with a 100 mm ruler, 50 mm quick check, CR80 85.6 x 54 mm box, grid/corner/center guides, and scale instructions.
- Calibration Print / Download PNG bypasses daily quota because it does not output user documents.
- Step 3 also has an `A4 test sheet` action for users who already uploaded an ID.
- Existing PVC tray calibration/profile UI remains in place and unchanged.
- Cache bumped to `studioprint-v38` / `id-print-v38`.

## QA done

- Build passed with bundled Node: `node build.js`.
- Local Chrome QA: A4 test sheet generated from upload screen; canvas and preview were `2480 x 3508`; no page/console errors.
- Local Chrome QA: `C:\Users\ajayt\Downloads\RC.pdf` still detected as RC, preview generated at `2022 x 638`, and A4 sheet generated at `2480 x 3508`; no page/console errors.
- Live QA: `https://studioprint.pages.dev/id-print?qa=cal-v38` has the calibration UI and `https://studioprint.pages.dev/sw.js?qa=cal-v38` has `studioprint-v38` / `id-print-v38`.
- Live browser QA: clicking `Open A4 Test Sheet` generated the calibration sheet with Download PNG and Print available. Only existing font preload credential warnings appeared.

## Coordination note

- Current owned ID Print scope: `id-print.html`, `sw.js`, `dist/id-print.html`, `dist/sw.js`, `.agents/research/print-calibration-test-20260503.md`, `.agents/live-status.md`, `.agents/handoff.md`.
- Do not touch Forms files from this ID Print task unless the user explicitly assigns Forms work.
- Residual local dirty files not owned by this task: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, `dist/terms.html`.

## Future rule

- For any future print-layout or hardware-like feature, do not rely only on visual browser preview.
- First add a measurable calibration output where possible: known mm ruler, card-size box, corner/center marks, and clear 100% scale instructions.
- Then verify the production sheet path uses the same canvas/export/print pipeline as the calibration sheet.
