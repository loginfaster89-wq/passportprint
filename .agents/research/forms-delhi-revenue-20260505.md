# Delhi Revenue forms research - 2026-05-05

## Scope

- Source state/department: Government of NCT of Delhi, Department of Revenue.
- Official index used: https://revenue.delhi.gov.in/revenue/forms-downloads
- Source page last-updated date shown by the website during review: 04/05/2026.
- Work scope in this pass: add clean, blank, citizen-service forms to Forms Hub.

## Accepted

Accepted because each PDF came from the official Delhi Revenue domain, opened successfully, had a blank printable form/affidavit format, and did not contain filled customer data, pen-filled fields, third-party branding, or unofficial watermarking.

- Delhi SC Certificate Application.
- Delhi OBC Certificate Application.
- Delhi Hindu Marriage Registration.
- Delhi Special Marriage Registration.
- Delhi Notice of Intended Marriage.
- Delhi Abadi/Extended Abadi Certificate.
- Delhi Birth Order Affidavit.
- Delhi Birth Registration Order Application.
- Delhi Death Registration Order Application.
- Delhi Nationality Certificate Application.
- Delhi Solvency Certificate Application.
- Delhi Solvency Affidavit - Property.
- Delhi Disability ID Card Application.
- Delhi Domicile Certificate Application.
- Delhi Income Certificate Application.
- Delhi Non-Encumbrance Affidavit.
- Delhi Non-Encumbrance Search Report.
- Delhi Surviving Member Affidavit.
- Delhi Freedom Fighter Certificate Affidavit.
- Delhi Income Certificate Affidavit.
- Delhi Solvency Affidavit - Govt Servant.
- Delhi Solvency Affidavit - Salaried Individual.
- Delhi RTI Form A - Information Request.
- Delhi E-Stamp Refund Affidavit.
- Delhi E-Stamp Refund Application.
- Delhi E-Stamp Refund Indemnity Bond.
- Delhi Marriage Registration Affidavit.
- Delhi Marriage Identification Certificate.

## Rejected / deferred

- SC Certificate - Other State: official page lists it separately, but the downloaded PDF matched the standard SC certificate form content, so it was not duplicated in this pass.
- OBC caste lists, SC caste list, circle-rate notification, and Delhi Compulsory Registration of Marriage order: official downloads, but they are reference documents/orders/lists, not blank printable application forms.
- Non-Creamy Layer Certificate application and prescribed OBC certificate format: official downloads, but visual inspection showed scanned/stamped-looking artifacts; defer until a cleaner official PDF is available or the owner explicitly accepts these lower-quality scans.
- Civil Defence Act, J&K migrant circulars/relief documents, and cyber handbook links: not part of the main Forms Downloads citizen-form table for this pass.

## QA notes

- Rendered all accepted PDFs with PyMuPDF and generated first-page plus per-page PNG previews.
- Page counts were read from the PDFs before writing manifest entries.
- This batch keeps state workflows separate instead of grouping different services into one card.
