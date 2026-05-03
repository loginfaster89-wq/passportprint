# Rajasthan Police / SJE Forms Research - 2026-05-03

## Scope

- Page: `/forms`
- Owner: Forms Hub chat only.
- Rule applied: add only official, clean, blank, printable PDFs. Reject filled, pen-written, signed, watermarked, dark, dirty, rotated, and guide/manual PDFs.
- Source type: official Rajasthan Police and Rajasthan Social Justice & Empowerment Department URLs.

## Accepted PDFs

| Website title | Official source | Pages | Use-case read from PDF |
| --- | --- | ---: | --- |
| Bikaner Police Servant/Employee Verification | `https://www.police.rajasthan.gov.in/old/Rajasthan/DownloadForms/Verification%20Forms%20by%20Bikaner%20police.pdf` | 1 | Page 1 of the official Bikaner Police PDF; details for domestic servant, driver, watchman, employee, or hostel worker verification. |
| Bikaner Police Tenant/PG Verification | `https://www.police.rajasthan.gov.in/old/Rajasthan/DownloadForms/Verification%20Forms%20by%20Bikaner%20police.pdf` | 1 | Page 2 of the official Bikaner Police PDF; details for tenant, paying guest, hostel student, or hostel resident verification. |
| Private Security Agency Licence Form I | `https://www.police.rajasthan.gov.in/old/Rajasthan/DownloadForms/FORM%201-%20APPLICATION%20FOR%20LICENSE%20TO%20ENGAGE%20IN%20THE%20BUSINESS%20OF%20PRIVATE%20SECURITY%20AGENCY%20.pdf` | 2 | Rajasthan Police Form I application for licence to run a private security agency. |
| Private Security Agency Applicant Verification Form II | `https://www.police.rajasthan.gov.in/old/Rajasthan/DownloadForms/FORM%202-%20Particulars%20of%20Applicant%20for%20License%20of%20Agency%20For%20verification.pdf` | 5 | Rajasthan Police Form II antecedent verification particulars for private security agency licence applicants. |
| Private Security Agency Affidavit Form III | `https://www.police.rajasthan.gov.in/old/Rajasthan/DownloadForms/Affidavit%20US%207%7B2%7D%20of%20the%20Private%20Security%20Agency%20Regulation%20Act%2C%202005.pdf` | 2 | Rajasthan Police Form III affidavit under Section 7(2) for private security agency licence applications. |
| Palanhar Scheme Application | `https://sje.rajasthan.gov.in/schemes/palanhar_form_2013.pdf` | 5 | Rajasthan SJE Palanhar scheme application for eligible guardian/child categories. |
| Income Certificate Format - RajSSP Pension | `https://sje.rajasthan.gov.in/download/Format%20of%20Income%20Certificate%20for%20RajSSP.pdf` | 1 | Rajasthan SJE/RajSSP income declaration certificate format used in social-security pension workflows. |

## Split decision

- The official Bikaner Police PDF contains two separate user workflows in one file.
- Website entries were split into two one-page local PDFs so users do not print the wrong workflow:
  - servant/employee/hostel-worker verification.
  - tenant/PG/hostel-student verification.

## Rejected candidates

- Rajasthan Police Domestic Servant Verification Form, Kota Police Hostel Verification Form, and Kota Police Tenant Verification Form: rejected for this pass because the official PDFs are rotated coloured scans with visible background tint. They are official, but not clean enough for the user's Forms Hub quality rule.
- Rajasthan Police list-of-enclosures PDF: rejected because extracted text is corrupted and it is a supporting checklist, not a standalone user application form.
- Rajasthan Police SHO report PDF: rejected because it is marked "To be filled by SHO", not a citizen/shop printable user form.
- SJE `Default.aspx?...Format of Income Certificate for RajSSP.pdf` wrapper URL: rejected because it downloaded website chrome/HTML output. The clean direct PDF under `/download/` was used instead.
- SJE scholarship `application_format.pdf` wrapper URL: rejected because the available indexed URL downloaded website chrome/HTML output rather than a clean direct standalone PDF.

## Verification

- Downloaded accepted PDFs from official direct URLs.
- Opened every candidate with PyMuPDF, checked page count, text/visual content, and first-page rendered preview.
- Generated all local previews and page previews from accepted PDFs only.
