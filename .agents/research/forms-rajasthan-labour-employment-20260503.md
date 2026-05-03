# Rajasthan Labour / Employment Forms Research - 2026-05-03

## Scope

- Page: `/forms`
- Owner: Forms Hub chat only.
- Rule applied: add only official, blank, printable forms; split separate workflows; reject filled, pen-written, signed, watermarked, dark, rotated, unclear, or guide/manual PDFs.
- Source type: official Rajasthan Labour Department and Rajasthan Skill, Employment & Entrepreneurship Department URLs.

## Accepted PDFs

| Website title | Official source | Pages | Use-case read from PDF |
| --- | --- | ---: | --- |
| BOCW Welfare Scheme Common Application | `https://labour.rajasthan.gov.in/Documents/FormatsofSchemes.pdf` | 3 | Common BOCW application plus scheme declarations for building/construction worker welfare scheme claims. |
| Unemployment Allowance Income Declaration - Annexure I | `https://employment.livelihoods.rajasthan.gov.in/UserManual/Income_I.pdf` | 1 | Income declaration by applicant/family for Rajasthan unemployment allowance. |
| Unemployment Allowance Witness Certificate - Annexure K | `https://employment.livelihoods.rajasthan.gov.in/UserManual/Income_K.pdf` | 1 | Witness certificate for applicant income verification in unemployment allowance workflow. |
| Unemployment Allowance Self Declaration - Annexure 1 | `https://employment.livelihoods.rajasthan.gov.in/UserManual/Self_Declaration_File.pdf` | 1 | Self declaration included at the end of unemployment allowance application. Official source is a light scan; local PDF was threshold-cleaned only to remove scan background noise while preserving the blank form content. |
| Unemployment Internship Attendance Certificate | `https://employment.livelihoods.rajasthan.gov.in/website/WebsiteDocs/custom_web_pages/Internship_and_Skill_Training.pdf` | 1 | Page 1 of the official combined PDF; internship attendance certificate for assigned office/department internship. |
| Unemployment Internship Joining Certificate | `https://employment.livelihoods.rajasthan.gov.in/website/WebsiteDocs/custom_web_pages/Internship_and_Skill_Training.pdf` | 1 | Page 2 of the official combined PDF; internship joining certificate for reporting to allotted department/office. |
| Unemployment Skill Training Joining Certificate | `https://employment.livelihoods.rajasthan.gov.in/website/WebsiteDocs/custom_web_pages/Internship_and_Skill_Training.pdf` | 1 | Page 3 of the official combined PDF; skill training joining certificate for allotted training centre. |
| Unemployment Skill Training Attendance Certificate | `https://employment.livelihoods.rajasthan.gov.in/website/WebsiteDocs/custom_web_pages/Internship_and_Skill_Training.pdf` | 1 | Page 4 of the official combined PDF; skill training attendance certificate for completed training period. |

## Split decision

- The official Employment `Internship_and_Skill_Training.pdf` contains four independent workflows in one PDF.
- Website entries were split into four one-page local PDFs so users can directly print the right certificate without printing unrelated pages.
- The BOCW `FormatsofSchemes.pdf` was kept as one 3-page package because page 1 says the same simple application is used for every scheme and pages 2-3 are supporting declarations for the same scheme-claim package.

## Rejected candidates

- `https://labour.rajasthan.gov.in/Documents/BeneficiaryRegistrationApplicationForm.pdf`: rejected because the official PDF is a CamScanner scan with visible scanner mark and dirty background.
- `https://labour.rajasthan.gov.in/Documents/Form3.pdf`: rejected because it is a yellow scanned Shop Act registration certificate, not a clean blank citizen application form.
- `https://labour.rajasthan.gov.in/Documents/Inspection_Note.pdf`: rejected because it is an inspection-note pack for departmental inspection use, not a citizen/shop printable application form.
- `https://employment.livelihoods.rajasthan.gov.in/UserManual/Swaghoshana.pdf`: rejected because the official file is a dark punched/taped scan with visible physical artefacts.
- `https://employment.livelihoods.rajasthan.gov.in/website/WebsiteDocs/documents/243_d132e6c8-5056-4198-ab3f-1ac410b7849dmysy.pdf`: rejected as a 9-page scanned order/guideline bundle, not a clean standalone printable form pack.

## Verification

- Downloaded accepted PDFs from official direct URLs.
- Opened every accepted and rejected candidate with PyMuPDF, checked page count, extracted text where available, and rendered previews for visual quality.
- Generated local PDFs, first-page previews, and page-by-page previews only for accepted forms.
