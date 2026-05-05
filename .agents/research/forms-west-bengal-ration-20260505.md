# West Bengal Ration Forms Research - 2026-05-05

Scope: continue Forms Hub with a non-Rajasthan batch after the Rajasthan passes. Official listing page used: `https://food.wb.gov.in/food/pds/application.html`. The public page lists offline citizen forms, while the actual PDF host resolves to `https://wbfss.wb.gov.in/food/PDS/Forms/`.

Every accepted PDF below was downloaded from the official West Bengal Food & Supplies host, opened/read for actual use-case, and rendered to local previews before listing.

## Accepted citizen workflows

| Slug | Title | Pages | Source PDF | Use-case |
| --- | --- | ---: | --- | --- |
| `west-bengal-ration-form-3-rural-new-family` | West Bengal Ration Form 3R - New Family Rural | 2 | `Form 3R.pdf` | New rural family digital ration card when no member already has a DRC. |
| `west-bengal-ration-form-3-urban-new-family` | West Bengal Ration Form 3U - New Family Urban | 2 | `Form 3U.pdf` | New urban family digital ration card when no member already has a DRC. |
| `west-bengal-ration-form-4-member-inclusion` | West Bengal Ration Form 4 - Member Inclusion | 2 | `Form 4.pdf` | Inclusion of left-out family members in an existing DRC family. |
| `west-bengal-ration-form-5-card-correction` | West Bengal Ration Form 5 - Card Correction | 2 | `Form 5.pdf` | Correction in existing digital ration card details. |
| `west-bengal-ration-form-6-fps-change` | West Bengal Ration Form 6 - FPS/Kerosene Shop Change | 2 | `Form 6.pdf` | Change of ration shop or kerosene oil shop. |
| `west-bengal-ration-form-7-surrender` | West Bengal Ration Form 7 - Surrender DRC | 2 | `Form 7.pdf` | Surrender one or more DRCs or all DRCs of a family. |
| `west-bengal-ration-form-8-rural-conversion` | West Bengal Ration Form 8R - Rural Category Conversion | 2 | `Form 8R.pdf` | Rural conversion from RKSY-II or GEN card to RKSY-I. |
| `west-bengal-ration-form-8-urban-conversion` | West Bengal Ration Form 8U - Urban Category Conversion | 2 | `Form 8U.pdf` | Urban conversion from RKSY-II or GEN card to RKSY-I. |
| `west-bengal-ration-form-9-duplicate-card` | West Bengal Ration Form 9 - Duplicate Card | 2 | `Form 9.pdf` | Duplicate digital ration card for lost, damaged, or defaced card. |
| `west-bengal-ration-form-10-identity-purpose` | West Bengal Ration Form 10 - Identity Purpose Card | 2 | `Form 10.pdf` | Identity-purpose ration card or conversion from NFSA/RKSY to identity-purpose card. |
| `west-bengal-ration-form-11-mobile-aadhaar-update` | West Bengal Ration Form 11 - Mobile & Aadhaar Update | 2 | `Form 11 (Mobile number Updation Form).pdf` | Update mobile number and Aadhaar details in existing DRC records. |

## Not added in this pass

- `Form for Dealership MR0001.pdf`
- `Application form for Dealer-SR0001.pdf`

Reason: official, but dealership/business application workflows were deprioritized in favor of citizen ration-card workflows. They can be added later as a separate batch if needed.

## Implementation notes

- Source listing page (`food.wb.gov.in`) was used only to discover the official form set.
- Actual PDF downloads came from the official host `wbfss.wb.gov.in/food/PDS/Forms/`.
- All 11 accepted files are clean blank PDFs; no handwritten marks, signatures, or watermark issues found in the visual QA pass.
