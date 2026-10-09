# Patientcurve Website

Marketing site for Patientcurve: patient journey automation for dental clinics. Core idea: recover revenue from patients your clinic already has (Convert, Recover, Reactivate, Measure). Production URL: https://patientcurve.com

It is a static site with no build step and no dependencies: plain HTML, CSS and JavaScript, hosted on Netlify.

| URL | File | Goal |
| --- | --- | --- |
| `/` | `index.html` | Explain the value and drive visitors to book a revenue audit |
| `/how-it-works` | `how-it-works.html` | Make the follow-up system easy to understand |
| `/revenue-audit` | `revenue-audit.html` | Capture leads through the audit form (Netlify Forms) |
| `/thanks` | `thanks.html` | Confirmation page for submissions made without JavaScript (not indexed) |
| any unknown URL | `404.html` | Not-found page |

Other files:

- `assets/css/styles.css`: design tokens, layout, components and animations
- `assets/js/main.js`: all interactions and the form submission
- `assets/img/`: favicon, app icons and `og-image.png` (the social sharing image)
- `netlify.toml`: publish settings, redirects, security headers and caching
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`

## Deploy to Netlify

1. In Netlify, go to **Add new site → Import an existing project** and pick this GitHub repository.
2. Set the branch to deploy to `main`. Leave the build command empty and set the publish directory to `.`. `netlify.toml` already sets both.
3. Deploy.
4. Under **Domain management**, add `patientcurve.com` (and `www.patientcurve.com` if you want it to redirect). Netlify provisions HTTPS automatically.
5. **Form notifications:** go to **Site configuration → Notifications → Form submission notifications** and add an email notification for the `revenue-audit` form. Without this, leads still arrive, but only in the Netlify dashboard under **Forms**.
6. Optional: in **Forms**, make sure form detection is enabled. It is on by default for new sites. If the `revenue-audit` form doesn't appear after the first deploy, enable detection and redeploy.

Every push to `main` redeploys the site automatically.

## The audit form

The form uses Netlify Forms (`data-netlify="true"`) and needs no backend. Netlify records these fields: `name`, `clinic`, `phone`, `email`, `volume`, `challenge`, `notes`, and `estimate` (the estimator result, if the visitor used it).

- With JavaScript, the form validates inline, submits in the background, and shows the thank-you message on the same page.
- Without JavaScript, the browser's built-in validation applies, and the form posts normally and lands on `/thanks`.
- Spam protection uses a honeypot field (`company_website`). If spam becomes a problem, you can add reCAPTCHA in the Netlify form settings.
- When the site runs on `localhost` or from a file, the form is in preview mode: nothing is sent, and the success screen says so.

## Run locally

Use a server with clean-URL support so that `/how-it-works` works:

```bash
npx serve .
```

Or install the Netlify CLI and run `netlify dev`. This applies the same redirects and headers as production.

## Changing content

- Copy lives directly in the HTML files.
- If you add a page, add it to `sitemap.xml` and give it a `<link rel="canonical">`.
- CSS and JS are cached for one hour (`netlify.toml`), so changes reach every visitor within about an hour of deploying.

## Brand

The site follows the Patientcurve brand guidelines (v1.0, October 2026):

- **Colours:** jade `#0E7C6B` (buttons, links, highlights), deep `#14232B` (dark panels, text), tint `#DCEFEA`, surface `#F6F8F7`. Rose `#E2607A` (or rose light `#F08AA0` on deep) is for the returning dot only and is never used as text. Warning `#8F5A0E` marks due or overdue states; danger `#C0392B` marks lost states.
- **Type:** Familjen Grotesk 600 for headlines, Hind Madurai for body text and labels, IBM Plex Mono for figures and status pills. All three load from Google Fonts.
- **Style:**
  - Headlines and buttons in sentence case, with text left-aligned.
  - Flat surfaces: no shadows and no gradients.
  - Corners of 12px on cards and buttons and 24px on large panels. Status pills are outlined, in mono text.
- **Logo:** use the master files in `assets/img/patientcurve-logo*.svg` and never retype the wordmark. In sentences, the name is written "Patientcurve" (capital P only).
- **Return curve:** used once per page, on the closing panel.
- **Figures:** rupees in Indian format (₹1,84,500). The estimator defaults to ₹.

## Accessibility and performance

- Respects `prefers-reduced-motion`. Animations are turned off, and every animated illustration shows its final state.
- All content is visible without JavaScript; animations are a progressive enhancement.
- Supports keyboard navigation for tabs (arrow keys), the slider, toggles and the form. The form shows inline, announced error messages.
- Looping animations pause when they are off screen.
- The only third-party request is Google Fonts, which is allowed in the Content Security Policy.

## Content rules

The site contains no testimonials, client logos, revenue figures or statistics. All illustrations are labelled as illustrations. The estimator uses only numbers the visitor enters.
