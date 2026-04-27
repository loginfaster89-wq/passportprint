# §AC.22 — Print preview canvas-to-img fallback (CONDITIONAL)

> **Standalone copy-paste prompt for the next session.**
> Paste the entire block below (between the `---` markers) into a
> fresh agent chat. It is fully self-contained — no other context
> required other than read access to this repo.

---

You are working on the external GitHub repo
`loginfaster89-wq/passportprint` (Studio Print — an Aadhaar / PAN
ID-card print web tool). Owner is non-technical and prefers terse
Hinglish replies. Local git writes from the workspace are blocked,
so every PR must ship via the GitHub REST API helper at
`/tmp/mkpr.mjs` (which reads `/tmp/pr_config.json` — always create
that JSON with the `write` tool, **never** with a bash heredoc, to
avoid shell-escape corruption). If `/tmp/mkpr.mjs` or `/tmp/pp01/`
are missing (cross-session wipe), recreate by `git clone --depth 5
https://x-access-token:${GITHUB_PAT_PASSPORTPRINT}@github.com/loginfaster89-wq/passportprint.git pp01`
and re-emit `/tmp/mkpr.mjs` from the inline source in
`.agents/skills/studioprint/SKILL.md`.

Before you do anything else, read these three files in full:

1. `AGENTS.md` — hard rules (no `.github/workflows/*.yml`, CSS
   tokens locked, both `id-print.html` and `dist/id-print.html`
   in the same code PR, branch naming `devin/<unix_ts>-<slug>`,
   one PR per logical fix, minimum diff).
2. `.agents/skills/studioprint/SKILL.md` — full project skill,
   including the `TASK (NEXT SESSION) — §AC.22` block at the end
   (it has the conditional Step 0 verification + the standing
   candidates list).
3. `issues.md` — scroll to `§AC.19`, `§AC.20`, `§AC.21` (last
   ~200 lines) for the full chain of print-fix history. The
   §AC.21.5 subsection has the implementation sketch you'll
   actually use if §AC.22 is needed.

Then look at `.agents/references/ac21-print-still-broken.png` —
the user's reference (it's actually the on-screen Step 3 view,
NOT the print preview; the user sent it to show that on-screen
looks fine but print does not).

## Your task — STEP 0 FIRST (CRITICAL)

§AC.21 (PR #272) was shipped at the very end of the previous
session and **never confirmed by the user on real phone
hardware**. The previous agent shipped a `!important` +
`position: absolute` CSS fix that should plausibly resolve the
"print preview shows cards small / surrounded by whitespace"
symptom. So:

**Do NOT write any code until you have done both of these:**

### Step 0a — verify deploy

```bash
curl -s https://studioprint.pages.dev/id-print | grep -o "min-width:210mm"
```

Should return at least one match. If it doesn't, PR #272 hasn't
deployed yet — wait or check Cloudflare Pages dashboard.

### Step 0b — get a real print preview screenshot from the user

Ask the user (in Hindi/Hinglish) to:

1. Force-quit and reopen the browser tab on their phone (full
   refresh, not just pull-to-refresh).
2. Open `https://studioprint.pages.dev/id-print`.
3. Upload `test-pdfs/aadhaar-test.pdf` (password `SUNI1986`).
4. Tap the 🖨 Print button.
5. Send a screenshot of the **print preview dialog itself** —
   the one with the white A4 sheet preview and the Print /
   Cancel buttons. **Not** the on-screen Step 3 preview (the
   page that says "A4 Sheet — Fold & Laminate Layout" at the
   top with the layout-toggle tabs). Be very explicit, the user
   has confused these in past sessions.

### Decision

- **If the print preview now shows cards full-A4 size, top-flush,
  centered, single sheet** → §AC.21 was the final fix. Do NOT
  ship §AC.22. Instead ship a single docs catch-up PR that:
  - Marks §AC.21 SHIPPED + verified in `issues.md` (delete the
    "AWAITING TEST" wording).
  - Removes the `TASK (NEXT SESSION) — §AC.22` block from
    `.agents/skills/studioprint/SKILL.md`.
  - Updates the §6 "Last shipped" line in `SKILL.md`.
  - Deletes `.agents/prompts/ac22-next-session.md` (this file)
    and `.agents/prompts/ac18-next-session.md` (the obsolete
    prior session's prompt).
  - Then pick from the standing candidates list at the end of
    SKILL.md (Multi-card flush-top, Master Settings, PrePrinted
    Card mode, Printer presets, etc).

- **If the print preview is still wrong** → proceed to §AC.22
  below.

## §AC.22 fix (only if Step 0 confirms the bug persists)

### One-line bug

Even after PR #272's `!important` + `position: absolute` CSS,
the phone print preview still shows the canvas at less than full
A4 — cards small, surrounded by whitespace. This points at the
browser's print engine itself mishandling the high-resolution
canvas (2480 × 3508 bitmap), not the CSS.

### Fix path

Render canvas → PNG `<img>` for print. Browser print engines
render `<img>` reliably at requested print size with no
canvas-bitmap DPI quirks. Same PNG bytes work for download too
(PR #269 already proved iOS Safari handles Blob-based PNG
generation fine).

Implementation (~30 lines, one PR):

1. **Markup** — add a hidden `<img>` next to the canvas inside
   `.idp-a4-wrap`:
   ```html
   <div class="idp-a4-wrap">
     <canvas id="a4Canvas" …></canvas>
     <img id="printImg" alt="" />
   </div>
   ```

2. **`btnPrint` handler** — replace the direct
   `window.print()` call with:
   ```js
   a4Canvas.toBlob(blob => {
     const url = URL.createObjectURL(blob);
     const printImg = document.getElementById('printImg');
     printImg.onload = () => {
       window.print();
       // Revoke after the print dialog closes; setTimeout is OK,
       // window.print() is synchronous on most browsers.
       setTimeout(() => URL.revokeObjectURL(url), 1000);
     };
     printImg.src = url;
   }, 'image/png');
   ```

3. **Print CSS** — hide the canvas, show the img at exact A4:
   ```css
   @media print {
     .idp-a4-wrap canvas { display: none !important; }
     .idp-a4-wrap #printImg {
       display: block !important;
       position: absolute !important;
       top: 0 !important; left: 0 !important;
       width: 210mm !important; height: 297mm !important;
       max-width: 210mm !important; max-height: 297mm !important;
       min-width: 210mm !important; min-height: 297mm !important;
       object-fit: contain !important;
       object-position: center top !important;
       margin: 0 !important; padding: 0 !important;
       border: none !important;
       page-break-inside: avoid !important;
       page-break-after: avoid !important;
     }
   }
   ```

4. **Screen CSS** — keep the img hidden in the on-screen view:
   ```css
   .idp-a4-wrap #printImg { display: none; }
   ```

### Reproduction (do BEFORE shipping the fix)

1. Open `https://studioprint.pages.dev/id-print` on real phone
   hardware (Android Chrome AND iOS Safari if both available).
2. Upload `test-pdfs/aadhaar-test.pdf` (pw `SUNI1986`) AND
   `test-pdfs/pan-test.pdf` (pw `05071999`).
3. Confirm Step 2 + Step 3 previews look correct on-screen.
4. Tap 🖨 Print → screenshot the print dialog.
5. Compare against the user's `.agents/references/` images for
   both Aadhaar and PAN. Cards should fill the full A4 page,
   flush to the top, centered, single sheet.

If you can't get real-device access, at minimum reproduce in
Chrome DevTools' device emulation with iOS Safari user-agent
spoofing and a viewport ≤ 414 px wide, then trigger Print from
the emulated viewport.

### Constraints (hard)

- **Minimum diff.** Add the `<img>` element, the `toBlob` branch
  in `btnPrint`, and the CSS rules. Don't touch the JS sheet
  builders. Leave §AC.18–§AC.21 fixes intact.
- **No new dependencies.**
- **One PR.** Branch `devin/<unix_ts>-ac22-print-img-fallback`.
- **Verify on real phone before shipping** — don't ship a
  speculative fix; wait for the user's print-preview screenshot
  confirming success.
- Both `id-print.html` and `dist/id-print.html` must be in the
  same PR (rebuild via `node build.js` after `npm install`).
- After the code PR merges, ship a docs catch-up PR that updates
  `issues.md` (mark §AC.22 SHIPPED), `SKILL.md` (remove the
  TASK-NEXT-SESSION block, update §6 Last-shipped, mark §AC.22
  in the highlights), and deletes both `ac18-next-session.md`
  and `ac22-next-session.md` prompts. Standing pattern from PRs
  #261, #264, #266, #267.
- Standard rules still apply: no `.github/workflows/*.yml`, CSS
  tokens locked.

### Likely files / lines

- `id-print.html` ~line 380–420 — print CSS block (current
  §AC.21 state, last edited PR #272).
- `id-print.html` ~line 2150–2200 — `btnPrint` and `btnDownload`
  handlers.
- `id-print.html` `.idp-a4-wrap` markup (search for
  `idp-a4-wrap` to find the wrapper element).

### Reference screenshot

`.agents/references/ac21-print-still-broken.png` — the user's
on-screen Step 3 view showing cards correctly at top of canvas
(this confirms the JS bitmap rendering works; only the print
path is the problem). Compare your post-fix print output (after
the user sends the print-preview screenshot) against the
expected: cards full-width, top-flush, single A4 sheet.

---

**End of standalone prompt.**

For maintainers: this prompt mirrors the `TASK (NEXT SESSION) —
§AC.22` block in `.agents/skills/studioprint/SKILL.md` and the
§AC.19 / §AC.20 / §AC.21 sections in `issues.md`. After §AC.22
ships (or §AC.21 is confirmed sufficient), delete this file along
with the matching block in `SKILL.md` and the obsolete
`ac18-next-session.md` in the docs catch-up PR.
