# Dark theme (current scope)

The moon/sun button in the header toggles a dark theme, but today it **only affects the header and the
mobile menu**:

- `Header.tsx` keeps a `darkMode` state and adds the `.dark` class to the `<header>`.
- `Header.module.css` defines the `.header.dark …` rules: header background, logo text, nav links, mobile
  menu panel, and the language, theme and menu buttons.
- The button also toggles a `dark` class on `<html>`, but no stylesheet uses it yet, so every section
  below the header (Home, About, Services, Contact, etc.) keeps its light colours.
- The choice is not saved: a page reload returns to the light theme.

The contact cards and the Testimonials section are dark in both themes by design; their keyboard focus
ring (`Contact.module.css`) is a light blue chosen for contrast on those dark backgrounds.

Extending the dark theme to the whole page would mean adding dark styles per section (keyed on
`html.dark`) and is not planned yet.
