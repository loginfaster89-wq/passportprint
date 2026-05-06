# Rajasthan RIICO / Tourism / Medical Forms Research - 2026-05-06

## Scope

- User asked to keep completing Rajasthan Forms Hub before moving to other states.
- This pass inspected remaining official RajNivesh rows around Medical & Health, Tourism, RIICO, and RSPCB.
- Source policy followed: official government host only, PDF text/read inspection, rendered visual QA, no filled/pen-written/signed/watermarked/dark third-party PDFs.

## Official source inspected

- RajNivesh Forms page/API: `https://rajnivesh.rajasthan.gov.in/Home/Forms`
- Direct accepted PDFs were downloaded from official `https://rajnivesh.rajasthan.gov.in/Uploads/`.

## Accepted entries

- `rajasthan-drug-licence-form-19.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/f48832aa-72df-496f-90bb-3369fc26d6f8.pdf`
  - Pages: 1.
  - Actual use-case: Form 19 application for licence to sell, stock, exhibit, offer for sale, or distribute drugs other than Schedule X drugs.

- `rajasthan-tourism-project-approval-form.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/TourismForm.pdf`
  - Pages: 2.
  - Actual use-case: application for approval of a tourism-unit project.

- `rajasthan-riico-preferential-plot-allotment-rule-3w.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/127ea105-12a0-4a3b-a63f-fe438e2871daPREFERENTIAL%20ALLOTMENT%20OF%20PLOTS%20IN%20INDUSTRIAL%20AREAS%20%5BRule%203W%5D.pdf`
  - Pages: 3.
  - Actual use-case: RIICO Rule 3W application for preferential allotment of plots in industrial areas.

- `rajasthan-riico-land-allotment-revised-form.pdf`
  - Source: `https://rajnivesh.rajasthan.gov.in/Uploads/a3ad68b8-3317-4c75-bdb3-eb49e0aeb391LAND%20ALLOTMENT%20REVISED%20FORM.PDF`
  - Pages: 5.
  - Actual use-case: RIICO revised application for allotment of land or plots in industrial areas developed by RIICO.

## Rejected / not listed

- RajNivesh RSPCB PDFs for CTE, CTO, hazardous waste, municipal solid waste, construction/demolition waste, and biomedical waste were rejected because text/render inspection showed portal screenshot/user-flow pages beginning with `After registration of unit...`, not blank printable forms.
- RajNivesh Tourism `Approval of a Project of Tourism Unit` and `Permission for Film Shooting` PDFs were rejected because they are user-manual / portal screenshot PDFs; the film-shooting PDF contains prefilled sample personal details.
- RajNivesh Medical & Health applicant declaration, CP experience certificate, and pharmacist/competent-person declaration were rejected for this batch because the official PDFs are low-quality scanned blanks, not clean white printable PDFs at the quality bar requested by the user.

## QA notes

- Accepted PDFs were opened with PyMuPDF and rendered to contact-sheet previews before listing.
- No accepted PDF has pen handwriting, signatures, stamps, dark scan background, third-party watermark, or filled sample personal data.
- Each accepted card describes the specific workflow instead of grouping multiple workflows into one generic card.
