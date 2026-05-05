# Rajasthan UDH / Jaipur MC Forms Pass - 2026-05-05

Scope: continue Rajasthan-only Forms Hub work. Do not touch `id-print.html`.

## Official sources checked

- Rajasthan UDH application forms page: `https://udh.rajasthan.gov.in/content/raj/udh/udh-department/en/applicant-corner/online-building-plan-approval-and-related-materials.html`
- Jaipur Municipal Corporation forms page: `https://jaipurmc.org/Presentation/PublicNotice/MstPdf.aspx?Pageid=3`
- Jaipur MC direct PDF host: `https://jaipurmc.org/PDF/Auction_MM_RTI_Act_Etc_PDF/`

## Accepted forms

All accepted forms were downloaded from official sources, rendered visually, and checked for blank/printable form use-case.

- UDH Building Plan Approval - Above 500 sq.m, 16 pages.
- UDH Lease Deed Application, 3 pages.
- UDH Lease Free Certificate Application, 1 page. Official source is a clean JPG; converted to A4 PDF for the website.
- UDH Name Transfer II Application, 2 pages.
- UDH Name Transfer Application, 2 pages.
- UDH Subdivision Application, 2 pages.
- UDH Residential Building Construction - 500 sq.ft to 8 m, 1 page. Official source is a clean JPG; converted to A4 PDF for the website.
- UDH Residential Scheme on Agriculture Land, 2 pages.
- UDH Residential to Commercial Land Use Application, 1 page. Official source is a clean JPG; converted to A4 PDF for the website.
- Jaipur MC Loksunwai Application, 1 page.
- Jaipur MC Trade License Application, 2 pages.
- Jaipur MC Garden/Circle Adoption Application, 1 page. Only the clean first-page application was extracted; signed condition/list pages from the source pack were not included.

## Rejected / not listed

- Jaipur MC `COMING SOON` placeholder PDFs: building permission, up-to-500 sq.m building plan, land-use change, property/self-assessment, sewer connection, state-grant patta, subdivision/reconstitution, MSJKY, dairy booth direct form.
- Jaipur MC fire temporary NOC PDF: official but faint scanned pages; held back for quality.
- Jaipur MC online fire NOC procedure: procedure/notice pack, not a blank printable form.
- Jaipur MC dairy public notice: signed dated notice pack with filled/signed pages, not a clean blank form.
- SJE pension formats 2013 PDF: official but scanned with strong vertical artifacts and old format bundle; held back until a cleaner current source is found.

## Implementation notes

- New local PDFs/previews live under `assets/forms/**`.
- Forms count after this batch: 178 total, 111 Rajasthan.
- Cache version target: `studioprint-v58`.
