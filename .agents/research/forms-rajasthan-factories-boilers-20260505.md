# Rajasthan Factories / Boilers Forms Research - 2026-05-05

## Scope

- User asked to continue Rajasthan Forms Hub work before moving to other states.
- This pass covers official RajNivesh / RajFAB Factories and Boilers forms.
- Source policy followed: official government host only, PDF text/read inspection, rendered visual QA, no filled/pen-written/signed/watermarked/dirty forms.

## Official sources inspected

- RajNivesh Forms page/API: `https://rajnivesh.rajasthan.gov.in/Home/Forms`
- RajFAB direct form PDF: `https://rajfab.rajasthan.gov.in/web/Documents/forms/Form_II.pdf`
- Direct accepted PDFs were downloaded from official `rajnivesh.rajasthan.gov.in/Uploads/` or `rajfab.rajasthan.gov.in`.

## Accepted entries

- `rajasthan-factory-form-1a-non-hazardous.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/168a742b-5eaa-4344-b2b8-53d93ebcfc03.pdf`
  - Pages: 1.
  - Actual use-case: Form 1A declaration for factories carrying out non-hazardous process and employing up to 50 workers.

- `rajasthan-factory-building-plan-approval-form-1.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/3e6a9e0f-aacd-499a-9cd4-d3f29c5768e1.pdf`
  - Pages: 2.
  - Actual use-case: Form 1 application for permission to construct, extend, or take into use any building/premises as a factory.

- `rajasthan-factory-registration-renewal-form-2.pdf`
  - Source: `https://rajfab.rajasthan.gov.in/web/Documents/forms/Form_II.pdf`
  - Pages: 4.
  - Actual use-case: Form 2 application for registration / renewal / amendment / transfer of factory licence and notice of occupation.

- `rajasthan-boiler-manufacturer-registration-renewal.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/4a8c589a-495a-42ea-98e6-1261d44a9a1b.pdf`
  - Pages: 1.
  - Actual use-case: registration or renewal of boiler manufacturer.

- `rajasthan-boiler-registration-application-checklist.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/Boiler_Registration_and_Certification_Module-1.pdf`
  - Pages used: original pages 1-3.
  - Actual use-case: boiler registration application, procedure, checklist, and required documents.
  - Original page 4 was blank and was removed from the local printable PDF.

## Rejected / not listed

- `https://rajnivesh.rajasthan.gov.in/Uploads/8db90262-f525-4004-b0ea-e343fff687c9.pdf`
  - RajNivesh title: Steam Pipeline Drawing Approval under Boilers Act, 1923.
  - Rejected because visual inspection shows an online form screenshot with prefilled/example values, not a clean blank printable application.

- Energy candidates inspected in this same pass but not listed:
  - DG Set application and HT Transformer application PDFs contain sample personal details such as name, mobile/email/address.
  - New electricity connection application PDF is a CamScanner scan.

## QA notes

- All accepted PDFs were opened with PyMuPDF and rendered to contact-sheet previews.
- No accepted PDF has pen handwriting, signatures, stamps, dark scan backgrounds, or third-party watermark.
- Each accepted card describes the specific form/workflow instead of grouping separate workflows under one generic title.
