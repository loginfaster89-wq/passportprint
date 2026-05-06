# Rajasthan Revenue / RIPS Forms Research - 2026-05-06

## Scope

- This pass inspected remaining official RajNivesh rows around Revenue land-conversion forms, UDH portal forms, and Industries / RIPS forms.
- Official index used: `https://rajnivesh.rajasthan.gov.in/Home/Forms`
- API used: `https://rajnivesh.rajasthan.gov.in/Home/GetForms`
- Accepted files were downloaded from official `https://rajnivesh.rajasthan.gov.in/Uploads/` URLs.

## Accepted entries

- `rajasthan-revenue-land-conversion-form-a.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/e34ed706-352e-4072-957d-ad85b6dd3332.pdf`
  - Pages: 2
  - Actual use-case: Form A application under Rule 9 for conversion of agricultural land to non-agricultural use in rural areas.
- `rajasthan-revenue-conversion-purpose-change-form-c.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/914db165-b7bb-4a62-9347-d4972543615b.pdf`
  - Pages: 3
  - Actual use-case: Form C application under Rule 10 for change in purpose after land conversion.
- `rajasthan-rips-2019-form-i-zld-cost-determination.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/e06d43d8-4cf5-404f-95b9-35eec93a2371.pdf`
  - Pages: 1
  - Actual use-case: RIPS 2019 Form I for zero liquid discharge effluent-treatment plant cost determination and capital subsidy claim.
- `rajasthan-rips-2019-form-r-transfer-benefits.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/3217c099-3cd0-40ad-bcf3-4c7a533ed9e5.pdf`
  - Pages: 2
  - Actual use-case: RIPS 2019 Form R for transfer of remaining benefits of the transferor enterprise.

## Rejected / not listed

- `https://rajnivesh.rajasthan.gov.in/Uploads/1959f150-552e-4dfe-b49e-5bd9923f67eeFormA.pdf`
  - RajNivesh title: Revenue Land Conversion Form.
  - Rejected because visual inspection showed a scanned duplicate of Form A with existing signature/marking and poorer quality than the clean Form A accepted above.
- `https://rajnivesh.rajasthan.gov.in/Uploads/462ded45-8fb0-403c-b850-336c07f68238.pdf`
  - RajNivesh title: Form B Conversion Order.
  - Rejected because this is an authority conversion-order template, not a citizen/shop printable application form.
- `https://rajnivesh.rajasthan.gov.in/Uploads/a3421a16-5491-425e-9a23-3ce6e04bb61a.pdf`
  - RajNivesh title: Form D Revised Conversion Order.
  - Rejected because this is an authority revised-order template, not a citizen/shop printable application form.
- RajNivesh UDH Building Plan, 90A, Commencement, Completion, and Telegraph/OFC PDFs were rejected because they are portal instruction/screenshot manuals rather than blank printable forms.
- RajNivesh Industries `FORM7`, `FORM13`, `FORM14`, `FORM15`, `FORM18`, `FORM19`, `FORM20`, `FORM22`, `FORM24`, and `FORM26` were rejected because visual inspection showed scanned pages with existing blue tick/marking.
- RajNivesh Industries `COMMON APPLICATION FORM` was rejected because it is a circular/introductory document, not the actual blank CAF.
- RajNivesh Industries `ROF FORM A` through `ROF FORM F` were rejected because the available files are low-quality scanned image forms.
- RajNivesh Industries `FORM-A (RIPS-2022)` was rejected because the PDF includes prefilled sample data.
- RajNivesh Industries RIPS 2019 Form A, Form D, Form G, and Form P were rejected after visual QA because the first pages contain visible red tick/marking.

## QA notes

- Accepted PDFs were opened with PyMuPDF, page-count checked, and rendered to first-page plus per-page previews.
- No accepted PDF has pen handwriting, signatures, stamps, dark scan background, third-party watermark, or filled customer/sample data.
- Separate workflows were listed as separate website cards.
