# Hyderabad Residences

A responsive React and TypeScript real-estate presentation site. The current dataset contains only Team4 ARIA; no additional projects are fabricated. The site is frontend-only and uses a configured HTTP endpoint only when an approved enquiry destination is supplied.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

Production checks:

```bash
npm run typecheck
npm run build
npm run test:ui
npm run preview
```

## Content and configuration

- Project details, floor plans, prices, amenities, nearby places, specifications, image imports, and brochure URL: `src/data/projects.ts`
- Business name, phone, email, WhatsApp, Google Maps, and enquiry delivery URL: `src/config/site.ts`
- Project images: `src/assets/images/`
- Global styling and fonts: `src/index.css` and `index.html`

The supplied business and contact details were not client-confirmed. Leave an unconfirmed contact value as `null`; the UI will not create a dummy link.

## Brochure

Place an approved PDF under `public/brochures/`, then set the project's `brochureUrl`, for example:

```ts
brochureUrl: '/brochures/team4-aria.pdf',
```

When `brochureUrl` is `null`, the interface honestly reports that no brochure has been provided.

## Maps and enquiries

Set `googleMapsUrl` only to a client-approved Google Maps destination.

The site-visit form stays in clearly labelled demo mode while `enquiryDeliveryUrl` is `null`. A configured destination must accept a browser CORS `POST` request with JSON. After a successful response, the UI reports that the request was delivered but still does not claim the appointment is confirmed. Confirm the destination's privacy, spam protection, retention, and consent requirements before publishing.

The downloaded `.ics` file is a personal tentative reminder. It is not a booking confirmation.

## Before publishing

Obtain written approval for the business identity, contact channels, map destination, enquiry endpoint, brochure, pricing, RERA reference, possession date, travel times, amenities, specifications, imagery rights, and all marketing claims.
