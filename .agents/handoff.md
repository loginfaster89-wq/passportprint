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

## Active scope

- This chat owns Forms Hub work only.
- Do not touch `id-print.html` from this Forms task.
- Another chat may work on ID Print; coordinate through these `.agents` files.

## Latest Forms update

- Old combined `Ration Card Form - New/Update` removed.
- Official Rajasthan Food ration-card PDF split by actual embedded forms:
  - Pages 1-2: `Ration Card APL - New Card`
  - Pages 3-4: `Ration Card BPL/Antyodaya - New Card`
  - Pages 5-6: `Ration Card - Update/Member Change`
- The ration-card update/member-change pages were rotated upright in the split PDF/previews.
- Old combined `NFSA Food Security Application` removed.
- Official NFSA PDF split by actual embedded flows:
  - Pages 1-3: `NFSA Food Security - Rural Appeal`
  - Pages 4-6: `NFSA Food Security - Urban Appeal`
- `/forms` now has 49 forms.
- Cache bumped to `studioprint-v41`; `id-print-v40` preserved from the latest ID Print commits.
- Feature commit pushed to `main`: `e87cf9e0d086258efc47787afc561f918097df75` (`fix(forms): split Rajasthan ration and NFSA forms`).
- Live QA passed on `https://studioprint.pages.dev/forms?qa=forms-split-e87cf9e`.

## QA done

- Build passed with bundled Node: `node build.js`.
- Manifest validation passed: 49 entries, all PDF/preview/page-preview files exist, manifest page counts match actual PDF page counts.
- Local Chrome QA passed on `dist/forms.html`: total count 49, old combined titles absent, ration search shows all 3 ration flows, NFSA search shows rural/urban, update preview image is upright portrait `673 x 920`, and no page/console errors.
- Live HTML/SW QA passed: production `/forms` has 49 forms, old combined titles are absent, ration update preview is upright `673 x 920`, and `/sw.js` has `studioprint-v41` / `id-print-v40`.

## Forms quality rule

- Read every PDF before listing it; the website card must describe the actual government use-case.
- Split different use-cases into separate entries when the PDF contains separate blank forms.
- Do not add filled, pen-written, signed, watermarked, old-dated, dark, rotated, unclear, or third-party PDFs.
- Official guides/manuals are not printable blank forms and should not be listed as forms.

## Coordination note

- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, ration/NFSA PDFs and previews under `assets/forms/**`, `sw.js`, related `dist/` outputs, and `.agents` docs.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, and workflow files.
- Existing residual local dirty files from before this Forms task may still appear for unrelated `dist/*` pages. Do not stage unrelated source files.
