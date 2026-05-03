# Forms Hub Research - Rajasthan Transport Forms

Date: 2026-05-03 IST

## Scope

Forms Hub only. Do not touch `id-print.html`.

## User quality rule applied

- Old forms are acceptable only when still valid/current-use.
- Add only official, clean, blank PDFs.
- Reject third-party copies, manuals, guides, filled samples, pen-written scans, signed forms, watermark-heavy copies, dark/dirty scans, and expired scheme-year formats.
- Read each PDF before listing and describe the actual government workflow.

## Official source checked

- Rajasthan Transport Department forms page:
  - `https://transport.rajasthan.gov.in/content/transportportal/hi/transport/downloads/Forms.html`
- The page links direct PDFs from `transport.rajasthan.gov.in/content/dam/transport/...`.
- These are blank statutory transport forms under driving-licence, vehicle registration/RC, fitness, hypothecation, transfer, NOC, and permit workflows.

## PDF inspection result

- All accepted PDFs were downloaded from official Rajasthan Transport direct URLs.
- All accepted PDFs are text-readable, white/clean, unfilled, unsigned, and have no pen writing or dirty scan background.
- Page-count and first-page text were verified with PyMuPDF before adding.
- A contact sheet of first-page previews was checked locally:
  - `.tmp_transport_forms/transport-contact-sheet.png`

## Accepted website entries

Driving licence / medical:

- `Learner Licence Form 2`
- `Fresh Driving Licence Form 4`
- `Driving Licence Renewal Form 9`
- `Duplicate Driving Licence Form 2.3`
- `Add Vehicle Class Form 8`
- `International Driving Permit Form 4A`
- `Medical Self Declaration Form 1`
- `Medical Certificate Form 1A`

Vehicle registration / RC:

- `Temporary Registration Form RS-4.1`
- `Vehicle Registration Form 20`
- `RC Renewal Form 25`
- `Duplicate RC Form 26`
- `New Registration Mark Form 27`
- `Transport Vehicle Re-registration Form RS-4.1A`
- `Vehicle NOC Form 28`
- `Transfer Notice Form 29`
- `Transfer Application Form 30`
- `RC Address Change Form 33`
- `Hypothecation Entry Form 34`
- `Hypothecation Termination Form 35`

Fitness / permit:

- `Fitness Certificate Form RS-4.6`
- `Fitness Renewal Form RS-4.7`
- `Stage Carriage Permit Form RS-5.1`
- `Stage Carriage Permit Form RS-5.2`

## Rejected / deferred in this pass

- eMitra caste, domicile/bonafide, income, and EWS third-party listings were not added because a clean standalone official printable PDF was not verified in this pass. Official service manuals or service lists are not printable blank forms.
- Rajasthan Transport page did not include unrelated non-form manuals in the accepted batch.
