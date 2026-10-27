# Testimonial submission (mailto)

## Current status: enabled

`SUBMISSIONS_ENABLED = true` in `src/components/Testimonials.tsx` and
`TESTIMONIAL_RECIPIENT = 'goyo.lenero1@gmail.com'` in `src/shared/testimonialSubmission.ts`.
"Send by email" and "Copy message" are active, and the form shows the hint that the visitor's mail app will
open with the message ready.

Safety check: the actions stay disabled while `TESTIMONIAL_RECIPIENT` is empty, even if
`SUBMISSIONS_ENABLED` is `true`, and `buildTestimonialMailto` returns no link without a recipient.

To switch off temporarily: set `SUBMISSIONS_ENABLED = false` and rebuild. The form and draft keep working,
both actions are disabled, pressing Enter does nothing, and the form shows "Testimonial submissions will be
available soon."

## How it works

1. "Share your experience" opens the form (hidden at first): name, email, contracted service, testimonial.
2. "Send by email" validates the fields in the browser (`validateTestimonialSubmission` in
   `src/shared/testimonialSubmission.ts`) and, directly from that click, opens a `mailto:` link built by
   `buildTestimonialMailto` in the same file.
3. The visitor's mail app opens with the recipient, subject and body filled in. **The visitor sends it from
   there.** The site never sends anything and never says the message was sent. The form then closes and
   focus returns to "Share your experience"; the draft stays in memory, so reopening the form restores it.
   With validation errors the form stays open and focus moves to the first invalid field.
4. Secondary option, "Copy message": copies the same prepared body to the clipboard (after the same
   validation). If the clipboard is unavailable or refused, the text is shown selected in a read-only box so
   it can be copied by hand, together with the recipient address.

There is no server endpoint, database, SMTP, or credentials. The site is static: upload the contents of
`dist/` to `public_html/`.

## Message contents

Subject: `Testimonio para el sitio web: <name>` (or the English equivalent, based on the page language).

Body: public name or initials, contact email, contracted service label, testimonial, and a short
authorization sentence matching the notice shown in the form. Subject and body are encoded separately
with `encodeURIComponent`, so accents, line breaks and characters such as `& ? # %` are preserved.

The email typed in the form is kept as typed (only leading and trailing spaces are removed) and is
contact information inside the message. It does not control which
account sends the email; that is whatever account the visitor's mail app uses.

## Recipient

`TESTIMONIAL_RECIPIENT` in `src/shared/testimonialSubmission.ts` is Goyo's final address,
`goyo.lenero1@gmail.com`. With mailto the address is public (visible in the page source and the visitor's
mail app); it is not a secret and may attract spam. Tests read the address from the constant instead of
repeating it, and use a fictitious `.example` address for the encoding checks.

## Limitations

- The visitor needs a configured mail app (or a browser handler for `mailto:` links). Without one,
  clicking may do nothing or open a setup prompt; the site cannot detect this.
- The site cannot know whether the visitor actually sent the email.
- The draft stays in the form after the mail app opens, and while the form is closed, reopened or the
  language is switched. It is lost on page reload.
- Very long testimonials produce long links; the 1500-character limit keeps them within what common
  mail apps accept.

## Publication

The page shows the three original testimonials (`testimonials.t1*`–`t3*` in
`src/context/LanguageContext.tsx`). Submissions are never published automatically; a testimonial appears
only after someone adds it manually, without the email or the contracted service.
