# Quotivra Screenshots

This folder is reserved for project screenshots used by the main GitHub README and supporting documentation. Screenshots help recruiters, interviewers, contributors, and visitors understand Quotivra quickly without running the project first.

No screenshots are included by default. Add images here after capturing the application screens.

## Documentation Links

- [Master README](../README.md)
- [Frontend README](../frontend/README.md)
- [Backend README](../backend/README.md)

## Recommended Folder Structure

```text
screenshots/
|
|-- login.png
|-- register.png
|-- dashboard.png
|-- create-quotation.png
|-- view-quotation.png
|-- update-quotation.png
|-- company-settings.png
|-- pdf-preview.png
|-- whatsapp-share.png
`-- mobile-responsive-ui.png
```

## Recommended Filename Convention

Use lowercase filenames with hyphens:

```text
screen-name.png
```

Examples:

- `login.png`
- `create-quotation.png`
- `mobile-responsive-ui.png`

Avoid spaces, uppercase-heavy names, and temporary names such as `Screenshot 2026-07-20.png`.

## Screenshot Checklist

Capture these screens when the project UI is ready:

| Screenshot | Filename | Status |
| --- | --- | --- |
| Login page | `login.png` | To be added |
| Register page | `register.png` | To be added |
| Dashboard | `dashboard.png` | To be added |
| Create quotation | `create-quotation.png` | To be added |
| View quotation | `view-quotation.png` | To be added |
| Update quotation | `update-quotation.png` | To be added |
| Company settings | `company-settings.png` | To be added |
| PDF preview | `pdf-preview.png` | To be added |
| WhatsApp sharing flow | `whatsapp-share.png` | To be added |
| Mobile responsive UI | `mobile-responsive-ui.png` | To be added |

## Markdown Examples

Use these examples in `README.md` files after adding screenshots.

```markdown
![Dashboard](./screenshots/dashboard.png)
```

From the frontend README, use:

```markdown
![Dashboard](../screenshots/dashboard.png)
```

From the backend README, only link screenshots when they help explain API-driven workflows:

```markdown
![Quotation PDF Preview](../screenshots/pdf-preview.png)
```

## Recommended Image Dimensions

| Screenshot Type | Suggested Size |
| --- | --- |
| Desktop pages | `1440 x 900` or similar |
| Laptop pages | `1366 x 768` or similar |
| Mobile screens | `390 x 844` or similar |
| PDF preview | Capture the full visible quotation preview |

Use PNG for crisp UI screenshots. Compress images before committing if file sizes become large.

## Desktop and Mobile Organization

For a small portfolio project, keeping all screenshots directly inside `screenshots/` is simple and effective.

If the screenshot set grows, use optional subfolders:

```text
screenshots/
|
|-- desktop/
|-- mobile/
`-- pdf/
```

If subfolders are used, update all README image paths accordingly.

## Privacy and Safety Guidelines

Before adding screenshots:

- Hide real customer names, phone numbers, email addresses, addresses, and GST details.
- Use demo company data instead of personal or client information.
- Avoid exposing real API URLs, database strings, tokens, or browser storage values.
- Blur or replace sensitive quotation amounts if needed.
- Make sure uploaded logos or signatures are safe to publish.

## Quality Tips

- Capture screenshots after the UI has fully loaded.
- Prefer a clean browser window without distracting extensions or bookmarks.
- Keep zoom at `100%` unless a specific view needs a different scale.
- Use consistent sample data across screenshots.
- Verify that dark overlays, modals, dropdowns, and tables are readable.

---

Use this folder as the visual proof of the project experience: clean screens, realistic demo data, and no sensitive information.
