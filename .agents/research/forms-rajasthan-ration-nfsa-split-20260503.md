# Forms research - Rajasthan ration card / NFSA split - 2026-05-03

## Scope

Forms Hub only. Do not touch `id-print.html` for this task.

## Owner rule captured from user

- A PDF must be read/understood before listing it on `/forms`.
- Do not bundle different government use-cases under one generic card when the PDF contains separate forms.
- Reject filled, pen-written, signed, watermarked, old-dated, dark, rotated, or visibly dirty PDFs.
- Prefer official government sources. Do not add third-party copies just because they are easy to find.

## Official sources checked

- Rajasthan Food Department forms page: `https://food.rajasthan.gov.in/Form_Download.aspx`
- Official ration-card PDF linked from that page: `https://food.rajasthan.gov.in/state_D/Files/2f4f659a-8fb7-47b9-9525-d64d87755174.pdf`
- Official NFSA PDF linked from that page: `https://food.rajasthan.gov.in/Docs/NFSA_Application_Form.pdf`
- eMitra workflow PDF checked but not listed as a printable blank form: `https://emitraapp.rajasthan.gov.in/emitrashared/USER_MGMT_OLD_DOCS/guidelineEform/GAndE_1493702197020.pdf`

The Food Department page was current on 2026-05-03 and showed renewed date `01/05/2026`.

## PDF read result

### Ration-card source PDF

The official 6-page PDF is not one user-facing form. It contains three separate blank use-cases:

- Pages 1-2: Form A-1, normal/APL category, new ration card.
- Pages 3-4: Form A-II, BPL / State BPL / Antyodaya / Annapurna / Aastha category, new ration card.
- Pages 5-6: Form B, existing ration-card correction/update flow, including address change, duplicate card, unit/member correction, and add/remove member sections.

Implementation decision:

- Replace the old combined card `Ration Card Form - New/Update`.
- Add three separate cards:
  - `Ration Card APL - New Card`
  - `Ration Card BPL/Antyodaya - New Card`
  - `Ration Card - Update/Member Change`
- Rotate the update/member-change pages upright while generating the split PDF/previews because the source pages render sideways.

### NFSA source PDF

The official 6-page PDF contains two separate blank appeal/application flows:

- Pages 1-3: Rural area NFSA appeal/application.
- Pages 4-6: Urban area NFSA appeal/application.

Implementation decision:

- Replace the old combined card `NFSA Food Security Application`.
- Add two separate cards:
  - `NFSA Food Security - Rural Appeal`
  - `NFSA Food Security - Urban Appeal`

## Current manifest audit

Current Aadhaar, PAN, Voter, Labour, Pension, EPFO, SSO and other Rajasthan entries were reviewed at manifest/title/source level. No other current entry was found to be a clear accidental bundle like `Ration Card Form - New/Update`.

Voter Form 7 and Form 8 remain single entries because Election Commission itself publishes each as one official multi-purpose form. Splitting those without separate official PDFs would create fake entries.

## Rejected additions

- Third-party ration-card/correction PDFs and SEO pages were rejected.
- The eMitra "NEW RATION CARD" PDF was rejected because it is a workflow/training guide with screenshots, not a blank printable customer form.

## QA expectation

- `/forms` should show 49 forms after replacing 2 combined entries with 5 specific entries.
- Searching `ration` should show the three separate ration-card flows.
- Searching `nfsa` should show rural and urban separately.
- The old titles `Ration Card Form - New/Update` and `NFSA Food Security Application` should not appear.
