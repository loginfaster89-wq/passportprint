# Rajasthan Revenue / eMitra Forms Research - 2026-05-03

## Scope

- Page: `/forms`
- Owner: Forms Hub chat only.
- Rule applied: add only official, clean, blank, printable PDFs. Reject manuals, filled scans, pen-written files, watermarked files, dark scans, and duplicate workflow PDFs.
- Source type: official `emitraapp.rajasthan.gov.in` file store URLs. Third-party indexes were used only to discover candidate IDs; accepted PDFs are official direct links.

## Accepted PDFs

| Website title | Official source | Pages | Use-case read from PDF |
| --- | --- | ---: | --- |
| Domicile / Bonafide Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1495797094047.pdf` | 3 | Mool Niwas / domicile / bonafide residence certificate application. |
| OBC/SBC Caste Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1500440878656.pdf` | 4 | Other Backward Class / Special Backward Class caste certificate application. |
| SC/ST Caste Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1500441414051.pdf` | 3 | Scheduled Caste / Scheduled Tribe caste certificate application. |
| Minority Community Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1495797149413.pdf` | 3 | Minority community certificate application. |
| General Caste Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1517909643422.pdf` | 3 | General category caste certificate application. |
| EWS Income & Asset Certificate - Rajasthan State | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_DOCS/GUIDELINE_AND_EFORM/2020/2/24/GAndE_1582546996332.pdf` | 3 | EWS income and asset certificate for Rajasthan State reservation use. |
| EWS Income & Asset Certificate - Central/State | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_DOCS/GUIDELINE_AND_EFORM/2020/2/24/GAndE_1582546967174.pdf` | 4 | EWS income and asset certificate for India Government / Rajasthan Government use. |
| Land Mutation Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1508838632730.pdf` | 1 | Revenue Department mutation / namaantaran application. |
| Seemagyan / Boundary Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1508838608429.pdf` | 1 | Revenue Department Seemagyan / land-boundary demarcation application. |
| Solvency / Haisiyat Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1517393949307.pdf` | 3 | Haisiyat / solvency certificate application with asset and property details. |

## Rejected candidates

- eMitra guideline/manual PDFs for bonafide, caste, minority, mutation, and income workflows: rejected because they are guides/manuals, not blank printable forms.
- `GAndE_1547797511819.pdf`: rejected because it is a 21-page NFSA service guide, not an income-certificate blank form.
- `GAndE_1492663583401.pdf`: rejected because it is a Labour Department user manual, not a printable citizen form.
- Old eMitra ration duplicate/cancellation PDFs: rejected because the same old file is image-only and overlaps the cleaner official Rajasthan Food ration-card form already listed on `/forms`.

## Verification

- Downloaded every accepted PDF from official direct URLs.
- Opened every PDF with PyMuPDF and checked page count, text extraction, first-page preview, and dark/dirty scan ratio.
- Rendered preview PNGs from the accepted PDFs only.
- Did not add duplicate cards when official state/central rows pointed to the same exact PDF.

## Pending

- Rajasthan still needs more official-source research for clean current income certificate forms, Pehchan 2025 adopted-child / delayed-registration / appeal forms, and any remaining citizen service forms not yet verified.
