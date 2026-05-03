# Rajasthan Forms Refresh Research - 2026-05-03

## Scope

- Page: `/forms`
- Owner: Forms Hub chat only.
- Rule applied: do not create duplicate cards when a workflow already exists; refresh the existing card to the cleaner/current official PDF.

## Refreshed PDFs

| Existing website title | New official source | Pages | Reason |
| --- | --- | ---: | --- |
| Birth Report Form 1 | `https://pehchan.rajasthan.gov.in/pehchan1/Download/FORM_1.pdf` | 2 | Replaced older LSG one-page PDF with current Rajasthan Pehchan Form 1. |
| Death Report Form 2 | `https://pehchan.rajasthan.gov.in/pehchan2/Download/FORM_2.pdf` | 2 | Replaced older LSG one-page PDF with current Rajasthan Pehchan Form 2. |
| Still Birth Report Form 3 | `https://pehchan.rajasthan.gov.in/pehchan5/Download/FORM_3.pdf` | 2 | Replaced older LSG one-page PDF with current Rajasthan Pehchan Form 3. |
| NFSA Food Security - Rural Appeal | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1541500838709.pdf` | 4 | Replaced older 3-page Food Department scan with cleaner official rural eMitra NFSA appeal form. |
| NFSA Food Security - Urban Appeal | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1541499488785.pdf` | 4 | Replaced older 3-page Food Department scan with cleaner official urban eMitra NFSA appeal form. |
| Domicile / Bonafide Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_DOCS/GUIDELINE_AND_EFORM/2020/7/2/GAndE_1593665934637.pdf` | 3 | Replaced older Bhamashah-era eMitra PDF with newer Jan Aadhaar-era PDF. |
| Minority Community Certificate Application | `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_DOCS/GUIDELINE_AND_EFORM/2020/8/21/GAndE_1597987623221.pdf` | 3 | Replaced older Bhamashah-era eMitra PDF with newer Jan Aadhaar-era PDF. |

## Rejected candidates

- `GAndE_1511777404417.pdf`: rejected because visual inspection showed a scan with existing pen/handwritten marks; not clean enough for Forms Hub.
- `GAndE_1496044674295.pdf`: rejected because the existing official Pehchan marriage application is cleaner and already listed.
- `BIRTH_DEATH_ACTAndRULES_2025.pdf`: kept as research reference only; it is a 60-page Act/Rules document, not a standalone printable citizen form.
- `FORM_1A` adopted-child direct PDF: direct official standalone URL was not found in this pass, so no card was added.

## Verification

- Downloaded each accepted replacement from official direct URLs.
- Opened and rendered every accepted PDF with PyMuPDF.
- Regenerated first-page and page-by-page previews.
- Confirmed no duplicate cards were added for already-covered workflows.
