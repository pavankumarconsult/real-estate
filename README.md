# Team4 Aria — Medha Ventures

A responsive React and TypeScript real-estate presentation site branded as Medha Ventures for the Team4 Aria property. Medha Ventures is not identified as the property developer, and Digystate is credited only as the digital marketing agency in the footer.

## Local development

```bash
npm install
npm run dev
```

## Content sources

- Display brand, phone, email, WhatsApp message, and Google Maps URL: `src/config/site.ts`
- Approved project facts, FAQ copy, and optional section data: `src/data/projects.ts`
- Hero, amenity, and downloadable-document asset imports: `src/data/media.ts`
- Shared enquiry flow: `src/components/EnquiryModal.tsx` and `src/services/enquiryService.ts`

The main visitor action is **Call Now**. The shared enquiry form validates the visitor's entries and opens WhatsApp with a prefilled draft; the visitor must press Send in WhatsApp. The site has no enquiry backend and does not store visitor contact details in local storage.

## Project media

The supplied hero and amenity images, brochure, site plan, and floor-plan PDFs live in `src/assets/media/`. Their production URLs are generated through static Vite imports in `src/data/media.ts`. Specifications and developer information remain hidden while approved content is unavailable.

## Asset approval

The existing images under `src/assets/images/` and newly supplied files under `src/assets/media/` require final client confirmation for usage rights and publication approval. Their import paths are centralized in `src/data/projects.ts` and `src/data/media.ts` for straightforward replacement.
