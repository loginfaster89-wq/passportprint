# Rajasthan Legal Metrology Forms Research - 2026-05-05

## Scope

- User asked to continue Rajasthan Forms Hub work before moving to other states.
- This pass covers RajNivesh official Consumer Affairs / Legal Metrology PDFs.
- Source policy followed: official government host only, PDF text/read inspection, rendered visual QA, no filled/pen-written/signed/watermarked/dirty forms.

## Official source inspected

- RajNivesh Forms page/API: `https://rajnivesh.rajasthan.gov.in/Home/Forms`
- Department: `CONSUMER AFFAIRS [LEGAL METROLOGY]`
- Direct official PDFs listed by the RajNivesh API were downloaded from `https://rajnivesh.rajasthan.gov.in/Uploads/`.

## Accepted entries

- `rajasthan-legal-metrology-dealer-licence-ld1.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/3bbe2634-a404-48f8-babc-ef54a16da406.pdf`
  - Pages: 3.
  - Actual use-case: Form LD-1 application for licence of dealer in weights and measures.

- `rajasthan-legal-metrology-manufacturer-licence-lm1.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/fccd6621-b183-4710-a03f-c4764f30fc77.pdf`
  - Pages: 4.
  - Actual use-case: Form LM-1 application for licence of manufacturer of weights and measures.

- `rajasthan-legal-metrology-repairer-licence-lr1.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/8dcbefe0-9dd2-448a-8963-a443e21b6d30.pdf`
  - Pages: 4.
  - Actual use-case: Form LR-1 application for licence of repairer of weights and measures.

- `rajasthan-legal-metrology-packer-manufacturer-importer-registration.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/bc77b7fc-5dff-4281-b5a9-8a2a33370047.pdf`
  - Pages: 3.
  - Actual use-case: registration of packer, manufacturer, or importer under Rule 27 of the Legal Metrology (Packaged Commodities) Rules, 2011.

## Rejected / not listed

- `https://rajnivesh.rajasthan.gov.in/Uploads/75c919e7-25a2-4d6f-b116-fe64c1804191.pdf`
  - RajNivesh title: E-Tulaman verification and stamping of weights and measures.
  - Rejected because the PDF is a citizen user-manual / portal screenshot flow, not a blank printable application form.

- `https://rajnivesh.rajasthan.gov.in/Uploads/54e8a393-f1fd-4b74-9ca0-6dc3ae27b20f.pdf`
  - RajNivesh title: PHED old forms of department.
  - Rejected because visual/text inspection showed `www.emitrakaka.com` watermark across the PDF; the user's Forms Hub quality rule rejects watermarked PDFs even when the file is reachable through an official listing.

## QA notes

- All accepted PDFs were opened with PyMuPDF and rendered to contact-sheet previews.
- No accepted PDF has pen handwriting, signatures, stamps, dark scan backgrounds, or third-party watermark.
- The accepted PDFs are crisp portal-generated blank form layouts with official RajNivesh source URLs.
