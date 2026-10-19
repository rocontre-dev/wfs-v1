# Testimonial submission: pending server work

## Current state

The "Share your experience" form collects a draft in browser memory only. Its submit button is disabled (`SUBMISSION_ENABLED = false` in `src/components/Testimonials.tsx`) and a visible message explains that submission is not available yet. Nothing is sent and no database is used.

## Pending before enabling submission

1. Confirm the Hostinger product for this site (Website Builder, shared hosting, Cloud, Node.js Web App, or VPS). This decides whether the endpoint is Node.js or PHP. Implement only the compatible one.
2. Implement a same-origin server endpoint that:
   - Re-validates every field with the rules in `src/shared/testimonialSubmission.ts` (with Node.js, import it directly; with PHP, port it and add equivalent tests).
   - Keeps its own trusted copy of the ES/EN notice and accepts only notice version `2026-10-17`.
   - Escapes all visitor text when building the email (HTML escaping belongs on the server).
   - Defines duplicate/retry handling and request-abuse limits based on what Hostinger actually provides.
   - Reports success only after the mail provider accepts the message.
3. Connect the form to that endpoint and set `SUBMISSION_ENABLED` to `true` only in that same change.

## Private server configuration

These values live only in server environment variables or Hostinger's private configuration. Never in frontend code, `VITE_` variables, or source control.

```text
TESTIMONIALS_TO_EMAIL=<TEST_RECIPIENT>
TESTIMONIALS_FROM_EMAIL=
TESTIMONIALS_SMTP_HOST=
TESTIMONIALS_SMTP_PORT=
TESTIMONIALS_SMTP_SECURE=
TESTIMONIALS_SMTP_USER=
TESTIMONIALS_SMTP_PASSWORD=
```

- `TESTIMONIALS_TO_EMAIL`: required. While testing, set it to the test recipient address already agreed with the project owner (intentionally not written in this public repository), only in the server configuration. Replace it with Goyo's confirmed address before production. The browser never chooses or sees the recipient.
- `TESTIMONIALS_FROM_EMAIL`: a mailbox authorized by the SMTP provider and aligned with SPF, DKIM, and DMARC. The visitor's address is used only as `Reply-To`.

## Publication

The page shows the three original testimonials (`testimonials.t1*`–`t3*` in `src/context/LanguageContext.tsx`). Submissions are never published automatically; a testimonial appears only after someone adds it manually, without the email or the contracted service.
