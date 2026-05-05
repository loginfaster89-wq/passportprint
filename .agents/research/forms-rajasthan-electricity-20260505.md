# Rajasthan Electricity Forms Research - 2026-05-05

## Scope

- User asked to finish Rajasthan forms before moving to another state.
- This pass covers electricity connection and change-workflow forms used by Rajasthan DISCOM counters.
- Source policy followed: official government host only, PDF read/render inspection before listing, no filled/signed/dark/watermarked forms.

## Official source inspected

- RajNivesh official PDF: `https://rajnivesh.rajasthan.gov.in/Uploads/0e937ea0-0c19-44bf-87fc-8375f086e0bdNew%20Electricity%20Connection%20Form%20final.pdf`
- Source PDF title/cover: "New Connection Forms for Electricity Distribution Companies of Rajasthan".
- Cover page states the applicant should use the form applicable to the relevant Rajasthan power distribution company:
  - Jaipur Vidyut Vitran Nigam Limited (JVVNL)
  - Ajmer Vidyut Vitran Nigam Limited (AVVNL)
  - Jodhpur Vidyut Vitran Nigam Limited (JdVVNL)

## Accepted entries

- `rajasthan-electricity-jvvnl-new-connection-load-change.pdf`
  - Pages used: original PDF pages 2-7.
  - Actual use-case: JVVNL application-cum-agreement for new regular/temporary connection and miscellaneous activities such as load extension/reduction, name change, connection transfer, shifting, and category change.
  - Includes checklist page.

- `rajasthan-electricity-avvnl-new-connection-load-change.pdf`
  - Pages used: original PDF pages 8-13.
  - Actual use-case: AVVNL application-cum-agreement for new regular/temporary connection and miscellaneous activities such as load extension/reduction, name change, connection transfer, shifting, and category change.
  - Includes checklist page.

- `rajasthan-electricity-jdvvnl-new-connection-load-change.pdf`
  - Pages used: original PDF pages 14-19.
  - Actual use-case: JdVVNL application-cum-agreement for new regular/temporary connection and miscellaneous activities such as load extension/reduction, name change, connection transfer, shifting, and category change.
  - Includes checklist page.

## Rejected / not listed

- Original page 1 cover page was not listed as a printable form because it is only an instruction/index page.
- No PHED / water connection PDF was added in this pass because a clean official blank printable PDF was not confirmed during the quick search; service pages and non-PDF pages need a separate verification pass before listing.

## QA notes

- Downloaded PDF size: 2,645,429 bytes.
- PyMuPDF page count: 19 pages.
- Visual contact sheet showed all accepted form pages are blank/clean enough for printable use.
- The website card descriptions intentionally keep this as one combined workflow per DISCOM because the official form itself combines new connection, load change, name change, transfer, shifting, and category change in one application-cum-agreement.
