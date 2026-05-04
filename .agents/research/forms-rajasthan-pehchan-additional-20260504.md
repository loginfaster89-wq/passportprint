# Rajasthan Pehchan Additional Forms Research - 2026-05-04

Scope: continue Forms Hub expansion for official Rajasthan civil-registration workflows. Source page: Rajasthan Pehchan main public download list, `https://pehchan.rajasthan.gov.in/pehchan5/Mainpage.aspx`.

The public download list exposes standalone official PDFs for birth/death/marriage registration support documents. Each accepted PDF below was downloaded from `pehchan.rajasthan.gov.in`, opened/read or visually inspected, split where the official PDF contained separate workflows, and rendered to local previews before listing.

## Accepted

| Slug | Title | Pages | Source PDF | Use-case |
| --- | --- | ---: | --- | --- |
| `birth-report-adopted-child-form-1ka-rajasthan` | Birth Report for Adopted Child Form 1-A | 2 | `FORM_1ka.pdf` | Birth report for registering an adopted child after adoption. |
| `mccd-form-4-institutional-death-rajasthan` | MCCD Form 4 - Institutional Death | 1 | `Mccd_Form.pdf` page 1 | Medical Certificate of Cause of Death for hospital/institutional deaths. |
| `mccd-form-4a-non-institutional-death-rajasthan` | MCCD Form 4A - Non-Institutional Death | 1 | `Mccd_Form.pdf` page 2 | Medical Certificate of Cause of Death for non-institutional deaths. |
| `delayed-birth-affidavit-after-one-year-rajasthan` | Delayed Birth Affidavit - After 1 Year | 1 | `BirthDeathAffidavait.pdf` page 1 | Affidavit for birth information submitted after more than one year. |
| `delayed-death-affidavit-after-one-year-rajasthan` | Delayed Death Affidavit - After 1 Year | 1 | `BirthDeathAffidavait.pdf` page 2 | Affidavit for death information submitted after more than one year. |
| `delayed-birth-affidavit-30-days-to-one-year-rajasthan` | Delayed Birth Affidavit - 30 Days to 1 Year | 1 | `BirthDeathAffidavait.pdf` page 3 | Affidavit for birth information submitted after 30 days and within one year. |
| `delayed-death-affidavit-30-days-to-one-year-rajasthan` | Delayed Death Affidavit - 30 Days to 1 Year | 1 | `BirthDeathAffidavait.pdf` page 4 | Affidavit for death information submitted after 30 days and within one year. |
| `marriage-registration-affidavit-pack-rajasthan` | Marriage Registration Affidavit Pack | 5 | `Marriageaffidavit.pdf` | Affidavit pack for bride, groom, witnesses, and related marriage-registration declarations. |

## Rejected / not listed

- `Birth Ceritificate Sample.pdf`, `Death Ceritificate Sample.pdf`, `Still Birth Ceritificate Sample.pdf`, `Marriage Ceritificate Sample.pdf`: official samples only, not blank printable application forms.
- `Margdarshika.pdf`, `rules.pdf`, `rules2025.pdf`, `BIRTH_DEATH_ACTAndRULES_2025.pdf`, `ACT.pdf`, `UpdatedAct_BirthDeath.pdf`, `Marriage.pdf`: official rules/guides/acts, not standalone customer forms. Used only as context.
- Pehchan `docs/*.pdf` circulars: not added because they are circular/notification material, not clean shop-printable forms.

## Implementation notes

- `Mccd_Form.pdf` was split into two local entries because Form 4 and Form 4A are separate death workflows.
- `BirthDeathAffidavait.pdf` was split into four local entries because birth/death and 30-days-to-1-year/after-1-year cases are separate workflows.
- `Marriageaffidavit.pdf` remains a single pack because its pages are the required affidavits for one marriage-registration workflow.
- Existing Pehchan Form 1/2/3 and Marriage Application cards were not duplicated.
