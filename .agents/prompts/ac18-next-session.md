# §AC.18 — Phone PNG download / Print breaks front card

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
avoid shell-escape corruption).

Before you do anything else, read these three files in full:

1. `AGENTS.md` — hard rules (no `.github/workflows/*.yml`, CSS
   tokens locked, both `id-print.html` and `dist/id-print.html`
   in the same code PR, branch naming `devin/<unix_ts>-<slug>`,
   one PR per logical fix, minimum diff).
2. `.agents/skills/studioprint/SKILL.md` — full project skill,
   including the `TASK (NEXT SESSION) — §AC.18` block at the end.
3. `issues.md` — scroll to the `§AC.18` section at the end for
   the rank-ordered diagnostic hypotheses, repro steps, and the
   files / lines map.

Then look at the user's reference screenshot at
`.agents/references/ac18-phone-print-broken.png` so you can see
exactly what "broken" means visually.

## Your task

§AC.11–§AC.17 are SHIPPED. **§AC.18 is the only OPEN bug and is
your primary task this session.** User explicitly deferred the fix
to this session ("AB YE ERROR NEXT CHAT MAIN SHI KRENGE").

### One-line bug

On phone (mobile) only, both **PNG download** (`btnDownload`) and
**Print** (`btnPrint`) produce a broken output: the **front card
is wrong**, the **card border is missing / misdrawn**, and the
**ID info text is missing** from the rendered front card. Desktop
is fine (re-verified in §AC.17 / PR #265).

### Top hypothesis (verify FIRST)

`canvas.toDataURL('image/png')` size limit on iOS Safari. A4 @
300 DPI = 2480 × 3508 = 8.7 MP, which exceeds the historical
~5 MB / 4096² cap on older iOS — `toDataURL` returns a truncated
or empty data URI silently. Affects `btnDownload` at
`id-print.html` ~line 2160 (`link.href = a4Canvas.toDataURL('image/png')`).

**Likely fix path:** switch to
`a4Canvas.toBlob(blob => { link.href = URL.createObjectURL(blob); … }, 'image/png')`,
which is not subject to the same cap.

The other five rank-ordered hypotheses (canvas `roundRect`,
`ctx.filter`, PDF.js render scale, `<meta viewport>` × print CSS,
the §AC.15 4 px `fillRect` `r` undefined edge case) are detailed
in `issues.md §AC.18.1`. Walk them in order and stop at the first
one that reproduces.

### Reproduction (do this BEFORE writing any fix)

1. Open `https://studioprint.pages.dev/id-print` on a real
   Android Chrome **and** a real iOS Safari device (test both).
2. Upload `test-pdfs/aadhaar-test.pdf` (password `SUNI1986`)
   **and** `test-pdfs/pan-test.pdf` (password `05071999`).
3. Confirm the Step 2 preview looks correct on-screen.
4. Tap "⬇ Download PNG" → save → open the saved file → compare
   against the desktop output for the same PDF. Capture both for
   the brief.
5. Tap "🖨 Print" → screenshot the print dialog → save as PDF if
   possible. Compare against desktop.

If you can't get real-device access, at minimum reproduce in
Chrome DevTools' device emulation with **iOS Safari user-agent**
spoofing and a viewport ≤ 414 px wide — the `toDataURL` cap won't
trigger in emulation but the rendering path differences will.

### Constraints (hard)

- **Minimum diff.** Mobile-only fix; do not touch desktop
  behaviour or any of the §AC.14–§AC.17 work.
- **No new dependencies.**
- **One PR per logical fix.** If 2+ root causes turn out to be
  involved, ship 2+ small PRs, not a megafix.
- **Verify on real phone before shipping** — don't ship a
  speculative fix based on hypotheses alone.
- Both `id-print.html` and `dist/id-print.html` must be in the
  same code PR (run `npm run build` after editing `id-print.html`
  and include the rebuilt `dist/id-print.html`).
- After the code PR merges, ship a docs catch-up PR that updates
  `issues.md`, `AGENTS.md`, `SKILL.md`, and removes the
  `TASK (NEXT SESSION)` block (this is the standing pattern from
  PRs #261, #264, #266, #267).

### Likely files / lines

- `id-print.html` ~line 2154–2164 — `btnDownload` / `btnPrint`
  handlers (`toDataURL` path).
- `id-print.html` ~line 1397–1660 — `buildXxxSheet` functions
  (rounded clip, §AC.15 black top-line, `ctx.filter`).
- `id-print.html` — `compositePair()` and `applyBatchFilters()`
  (canvas `ctx.filter` usage).
- `id-print.html` — PDF.js render call (`pdf.getPage(1).then(page
  => page.render(...))`).
- `id-print.html` print CSS ~line 350–386 (the §AC.17 fix —
  verify it still works as intended on mobile after any changes).

### Reference screenshot

`.agents/references/ac18-phone-print-broken.png` — the user's own
phone screenshot showing the broken front card (no border, info
text gone). Compare your post-fix output against this exact image.

---

**End of standalone prompt.**

For maintainers: this prompt mirrors the `TASK (NEXT SESSION)`
block in `.agents/skills/studioprint/SKILL.md` and the §AC.18
brief in `issues.md`. After §AC.18 ships, delete this file (along
with the matching block in `SKILL.md`) in the docs catch-up PR.
