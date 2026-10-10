# Patientcurve Website

Landing page for Patientcurve: patient journey automation for independent dental clinics in India. The page sells the **3-Step Patient Recovery System** (Capture → Follow up → Recover). Its primary call to action is a free workflow demo.

Production URL: https://patientcurve.com

## Stack

- React 18 + TypeScript + Vite 6
- Tailwind CSS 4 (brand tokens in `src/index.css`)
- No animation library: motion uses CSS and small React hooks (`src/lib/hooks.ts`)
- The page is **prerendered at build time** (`scripts/prerender.mjs`). The HTML, including the Netlify form, is in `dist/index.html` before any JavaScript runs, and React hydrates it in the browser.

## Commands

```bash
npm install
npm run dev        # local dev server (form runs in demo mode)
npm run typecheck
npm run build      # typecheck, client build, SSR build, prerender -> dist/
npm run preview    # serve dist/
```

## Page structure

| Section | Component |
| --- | --- |
| Header + mobile menu | `Header.tsx` |
| Hero + animated enquiry → booking story | `HeroSection.tsx`, `PatientJourneyAnimation.tsx` |
| The hidden problem | `ProblemSection.tsx` |
| The 3-Step Patient Recovery System | `RecoveryMechanism.tsx` |
| Chatbot vs Patientcurve workflow | `ChatbotComparison.tsx` |
| Interactive workflow simulator | `WorkflowSimulator.tsx`, data in `simulatorData.ts` |
| Integration and implementation | `IntegrationDiagram.tsx` |
| Measurement dashboard (demo data) | `MeasurementDashboard.tsx` |
| Demo booking form | `DemoBookingForm.tsx` |
| FAQ | `FAQ.tsx` |
| Final CTA + footer | `FinalCTA.tsx`, `Footer.tsx` |

To test the alternative hero headline ("Turn more dental enquiries into booked appointments."), set `HEADLINE = HEADLINES.b` in `HeroSection.tsx`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `VITE_PATIENTCURVE_WHATSAPP_NUMBER` | Business WhatsApp number in international format, e.g. `91XXXXXXXXXX`. When set, "Message us on WhatsApp" links appear next to the form, in the form's success and error states, and in the final CTA. When empty, no WhatsApp links are shown. |

Set it in Netlify under **Site configuration → Environment variables**, then redeploy. It's read at build time. For local builds, copy `.env.example` to `.env`.

## The demo form (Netlify Forms)

- Form name: `workflow-demo`. Fields: `name`, `clinic`, `whatsapp`, `locations`, `challenge`. The honeypot field `company_website` catches spam.
- Netlify detects the form from the prerendered `dist/index.html` on deploy.
- With JavaScript, the form validates inline, posts in the background and shows success or error states on the page. Without JavaScript, the browser's built-in validation applies and the form posts to `/thanks`.
- On `localhost`, the form runs in **demo mode**: nothing is sent, and the page says so.
- **Notifications:** Netlify stores submissions under **Forms**. To get an email for each request, add one under **Site configuration → Notifications → Form submission notifications** for `workflow-demo`.

## Deploy (Netlify)

`netlify.toml` sets the build command (`npm run build`), the publish directory (`dist`) and Node 22. Every push to `main` redeploys. It also:

- redirects the old pages: `/how-it-works` → `/#how-it-works`, and `/revenue-audit`, `/audit`, `/book` and `/demo` → `/#demo`
- sets the security headers and CSP (scripts from self only; Google Fonts allowed)
- caches hashed build files in `/static/` permanently, and images in `/assets/` for an hour

## Brand

The site follows the Patientcurve brand guidelines (v1.0):

- **Colours:** deep `#14232B` (midnight) as the primary dark and jade `#0E7C6B` as the accent. Rose is used only for the returning dot, and muted amber `#8F5A0E` marks pending or missed states.
- **Fonts:** Familjen Grotesk (headlines), Hind Madurai (body), IBM Plex Mono (figures and status pills).
- **Style:** flat surfaces with thin borders, 12px/24px radii, sentence case, and the return curve used once (on the closing panel).
- **Logo:** use the master SVGs in `public/assets/img/` and never retype the wordmark.

## Content rules

- No testimonials, client logos, customer counts or performance statistics.
- Every illustration, simulator scenario and dashboard value is labelled as an illustration or demo data.
- Integrations are described as conditional on the clinic's systems, access and plans. No vendor names are shown.
- Pricing, setup time and integrations are described as depending on the clinic. Nothing is guaranteed.

## Accessibility

- Semantic landmarks, a skip link, and visible focus styles.
- ARIA tabs with arrow-key navigation for the simulator, and native `<details>` for the FAQ.
- Form errors are inline, linked with `aria-describedby`, and focus moves to the first invalid field.
- Animations that run longer than five seconds have a pause control. They run only while on screen.
- With `prefers-reduced-motion`, nothing autoplays: the hero shows its final scene, and the scene buttons let visitors step through the story.
