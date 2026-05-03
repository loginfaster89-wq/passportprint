# Print calibration test sheet research - 2026-05-03

## Why this slice exists

The user cannot personally test every output path because PVC tray / Dragon /
shop printers are not available locally. The product needs a self-check that a
counter user can run before wasting card stock or blaming crop logic.

## Practical counter workflow

- A4 ID-card sheets should be printed at 100% / Actual size, not "Fit to page".
- The quickest field check is a ruler-measurable scale target: a 100 mm line
  must print as 100 mm.
- For card output, the user should also verify a CR80 box: 85.6 mm x 54 mm.
- If those two physical measurements are correct, browser scaling, printer
  driver scaling, and page-size selection are correct enough to proceed with
  actual card PDFs.
- PVC tray output also needs X/Y/scale/rotation correction per printer/tray
  combination; that is already covered by the PVC test grid and profile
  controls shipped in the latest main branch.

## Implementation decision

- Add an A4 calibration sheet that does not require uploading any PDF.
- Keep the test free and skip daily-sheet counting because it contains no user
  document output.
- Render the test as the same 300 DPI canvas pipeline used by the real print
  sheets, so the Print and PNG Download paths are tested too.
- Keep the existing PVC calibration grid for the Epson/PVC layout.

## Acceptance checks

- From `/id-print`, user can open an A4 calibration sheet before uploading.
- The generated sheet is exactly 2480 x 3508 px (A4 at 300 DPI).
- The sheet includes a 100 mm ruler, 50 mm quick check, CR80 85.6 x 54 mm box,
  center/corner guides, and print instructions.
- Print/export must not require login or consume free-plan quota.
- Existing ID upload/crop/sheet behavior must remain unchanged.
