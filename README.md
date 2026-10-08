# PatientCurve Website

Marketing site for PatientCurve, a revenue-growth system for dental clinics.

It is a static site with no build step and no dependencies: plain HTML, CSS and JavaScript.

| Page | File | Goal |
| --- | --- | --- |
| Home | `index.html` | Explain the value and drive visitors to book a revenue audit |
| How It Works | `how-it-works.html` | Make the follow-up system easy to understand |
| Revenue Audit | `revenue-audit.html` | Capture leads through the audit form |

Shared assets:

- `assets/css/styles.css`: design tokens, layout, components and animations
- `assets/js/main.js`: all interactions (reveals, counters, hero board, pipeline demo, journey stepper, cycle, before/after toggles, compare slider, estimator, form)
- `assets/img/favicon.svg`

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Upload the repository root to any static host, such as Netlify, Vercel, Cloudflare Pages, GitHub Pages or S3.

## Connect the audit form (required before launch)

The form in `revenue-audit.html` posts JSON to the URL in its `data-endpoint` attribute:

```html
<form id="audit-form" novalidate data-endpoint="https://your-endpoint.example/audit">
```

The payload has these fields: `name`, `clinic`, `phone`, `email`, `monthly_patient_volume`, `biggest_challenge`, `notes`, `estimate`, `page` and `submitted_at`.

The endpoint must accept a `POST` with `Content-Type: application/json`, return a 2xx status, and allow CORS from your site's domain. Suitable options include an automation webhook, Formspree or a serverless function.

**While `data-endpoint` is empty, the form is in preview mode.** Visitors still see the thank-you screen, along with a visible note that nothing was sent, and the payload is logged to the browser console. Leads are not captured until you set the endpoint.

## Accessibility and performance

- Respects `prefers-reduced-motion`. Animations are turned off, and every animated illustration shows its final state.
- All content is visible without JavaScript; animations are a progressive enhancement.
- Supports keyboard navigation for tabs (arrow keys), the slider, toggles and the form. The form shows inline, announced error messages.
- Looping animations pause when they are off screen.
- The only external request is Google Fonts.

## Content rules

The site contains no testimonials, client logos, revenue figures or statistics. All illustrations are labelled as illustrations. The estimator uses only numbers the visitor enters.
