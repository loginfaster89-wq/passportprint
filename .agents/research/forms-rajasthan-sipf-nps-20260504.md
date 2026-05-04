# Rajasthan SIPF / NPS Forms Research - 2026-05-04

Scope: continue Forms Hub expansion with clean, official Rajasthan forms only. Source used: State Insurance & Provident Fund Department, Government of Rajasthan, New Pension Scheme forms page: `https://sipf.rajasthan.gov.in/FormNewPensionScheme.aspx`.

The SIPF page lists New Pension Scheme forms and shows `Last updated on : 08-05-2025`. Each accepted PDF below was downloaded from `sipf.rajasthan.gov.in`, opened/read for actual use-case, page-count checked, and rendered to previews before listing.

## Accepted

| Slug | Title | Pages | Use-case |
| --- | --- | ---: | --- |
| `nps-subscriber-registration-csrf-g-rajasthan` | NPS Subscriber Registration Form CSRF-G | 4 | Government-sector NPS subscriber registration / PRAN account opening. |
| `nps-subscriber-details-change-s2-rajasthan` | NPS Subscriber Details Change Form S2 | 6 | Subscriber master detail correction, PRAN card reissue, and I-PIN/T-PIN reissue. |
| `nps-inter-sector-shifting-iss-rajasthan` | NPS Inter Sector Shifting Form ISS | 3 | Request to shift subscriber sector or PRAN association. |
| `nps-signature-photo-change-s7-rajasthan` | NPS Signature/Photo Change Form S7 | 1 | Change in subscriber signature or photograph. |
| `nps-tier-ii-activation-s10-rajasthan` | NPS Tier-II Activation Form S10 | 3 | Tier-II activation for existing Tier-I PRAN subscribers. |
| `nps-grievance-registration-g1-rajasthan` | NPS Subscriber Grievance Form G1 | 1 | Subscriber grievance registration against CRA or nodal office issues. |
| `nps-superannuation-withdrawal-101-gs-rajasthan` | NPS Superannuation Withdrawal Form 101-GS | 8 | Withdrawal of accumulated pension wealth on superannuation. |
| `nps-premature-exit-withdrawal-102-gp-rajasthan` | NPS Premature Exit Withdrawal Form 102-GP | 6 | Withdrawal on exit before normal superannuation. |
| `nps-death-withdrawal-103-gd-rajasthan` | NPS Death Claim Withdrawal Form 103-GD | 5 | Nominee/legal-heir withdrawal claim after subscriber death. |
| `nps-state-autonomous-body-mcf-rajasthan` | NPS State Autonomous Body MCF Form | 3 | Master creation form for State Autonomous Body onboarding/nodal details. |

## Rejected / deferred

- `NPS-Annexure-N3.pdf`: official, but preview/render is a tilted scan rather than a clean white form. Not listed.
- `Instruction_and_Application_for_withdrawal.pdf`: official, but it is a scanned instruction/application bundle, not a clean standalone printable blank form. Not listed.
- `Family_Disability_Pension_Withdrawal_Form.pdf`: listed on the page, but the direct official URL returned 404 in this pass. Not listed.
- `Form for Withdrawal by Claimant due to Death of Government Employee.pdf`: listed on the page, but the direct official URL returned 404 in this pass. Not listed.
- `Letter-of-Consent-LoC_SABs.pdf`: official and clean, but it is a consent-letter/admin template rather than a high-confidence citizen/shop printable form. Deferred.

## Implementation notes

- `forms.html` entries are separate per workflow; no combined "NPS forms pack" card.
- `assets/forms/manifest.json` mirrors the same 10 entries for validation.
- PDFs and all page previews are local under `assets/forms/**` so the live site does not depend on third-party availability.
- `sw.js` also had committed conflict markers around the ID Print refresh marker; this pass resolves them and bumps Studio Print cache to refresh the Forms update while preserving `id-print-v50`.
