# Forms Hub Research - Rajasthan Civil Registration Forms

Date: 2026-05-03 IST

## Scope

Add only Forms Hub entries for Rajasthan official, clean, blank PDFs. Do not touch `id-print.html`.

## Existing coverage checked

- Existing Forms Hub already has Rajasthan ration/NFSA split entries, marriage registration, character certificate, labour/shop/contract/BOCW/trade union, Jan Aadhaar income declaration, pension forms, SSO update, plus national Aadhaar/PAN/Voter/EPFO forms.
- Missing high-use Rajasthan civil-registration blank forms: birth report, death report, and still-birth report.

## Official sources checked

- Rajasthan LSG Download Forms page:
  - `https://environment.rajasthan.gov.in/content/raj/udh/en/LSG/LSG/downloads/form.html`
- Accepted direct blank form PDFs from the LSG page:
  - Birth Form 1: `https://environment.rajasthan.gov.in/content/dam/raj/udh/lsgs/lsg-jaipur/pdf/Download%20form/Birth%20Certificate%20Form.pdf`
  - Death Form 2: `https://environment.rajasthan.gov.in/content/dam/raj/udh/lsgs/lsg-jaipur/pdf/Download%20form/Death%20Certificate%20Form.pdf`
  - Still Birth Form 3: `https://environment.rajasthan.gov.in/content/dam/raj/udh/lsgs/lsg-jaipur/pdf/Download%20form/Birth%20And%20Death%20Ceritificate%20form.pdf`
- Rajasthan Pehchan 2025 Act/Rules PDF checked as current legal context:
  - `https://pehchan.rajasthan.gov.in/pehchan9/Download/BIRTH_DEATH_ACTAndRULES_2025.pdf`
  - Result: useful for legal context, but it is a rules booklet, not a standalone clean printable form download.

## PDF read result

- Birth PDF text starts with `जन्म रिपोर्ट`, `प्ररूप सं. 1`, `नियम 5 देखिये`.
- Death PDF text starts with `मृत्यु रिपोर्ट`, `प्ररूप सं. 2`, `नियम 5 देखिये`.
- Still-birth PDF text starts with `मृत जन्म प्रतिवेदन`, `प्ररूप संख्या 3`, `नियम 5`.
- All 3 accepted PDFs are one-page, white, blank printable forms with no pen writing, no filled customer data, no signatures, no watermark overlay, and no dark scan background.

## Rejected in this pass

- LSG `BPL.pdf` from the same download page was rejected. It is a 2003 scanned BPL survey document, image-only, dirty/old, and not a clean current blank eMitra-style form for Forms Hub.
- Existing `Income Declaration - Scholarship` was removed from Forms Hub because its PDF text is a 2019-20 scholarship income declaration format. A current clean official replacement was not verified in this pass.
- Direct standalone clean PDFs for newer Pehchan 2025 Form 1-A/adopted child, Form 14 delayed registration document, and Form 15 appeal were not found in this pass. Keep pending until an official clean standalone source is verified.

## Website entries to add

- `Birth Report Form 1`
- `Death Report Form 2`
- `Still Birth Report Form 3`

Each entry should be separate because each PDF is a distinct statutory reporting workflow.
